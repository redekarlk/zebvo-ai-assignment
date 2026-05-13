const stripCodeFences = (text = '') =>
  String(text)
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/i, '')
    .trim();

const normalizeJsonText = (text = '') =>
  String(text)
    .replace(/^\uFEFF/, '')
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/,\s*([}\]])/g, '$1')
    .trim();

const extractBalancedJsonBlocks = (text = '') => {
  const blocks = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === '\\') {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === '{' || ch === '[') {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
      continue;
    }

    if (ch === '}' || ch === ']') {
      if (depth > 0) {
        depth -= 1;
      }
      if (depth === 0 && start !== -1) {
        blocks.push(text.slice(start, i + 1));
        start = -1;
      }
    }
  }

  return blocks;
};

export const parseJsonLoose = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  const raw = stripCodeFences(value);
  const candidates = [raw, ...extractBalancedJsonBlocks(raw)].filter(Boolean);

  for (const candidate of candidates) {
    const normalized = normalizeJsonText(candidate);

    try {
      const parsed = JSON.parse(normalized);
      return typeof parsed === 'string' ? parseJsonLoose(parsed) : parsed;
    } catch {
      // Try next candidate.
    }
  }

  throw new Error('Unable to parse JSON from model output');
};

export { stripCodeFences };