/*
Script: validate_and_fix_images.js
- Connects to MongoDB using existing config (uses MONGODB_URI env var)
- Scans all Projects and validates image URLs stored in project.images
- Detects invalid data:image base64 URLs and attempts a safe repair by extracting base64 payload
- Prints a report and (optionally) updates affected documents when run with --fix

Usage:
  node scripts/validate_and_fix_images.js       # dry run, report only
  node scripts/validate_and_fix_images.js --fix # attempt repairs (writes to DB)
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../src/models/Project.js';
import connectDB from '../src/config/db.js';

dotenv.config({ path: process.env.DOTENV_PATH || '.env' });

const isValidDataBase64 = (s) => {
  if (!s || typeof s !== 'string') return false;
  // Basic check: should start with data:<mime>;base64,<payload>
  const m = s.match(/^data:([A-Za-z-+/]+\/[A-Za-z0-9-+.]+);base64,([A-Za-z0-9+/=\r\n]+)$/);
  if (!m) return false;
  const payload = m[2];
  // ensure no whitespace/newline in payload
  if (/\s/.test(payload)) return false;
  return true;
};

const trySanitizeDataUrl = (s) => {
  if (!s || typeof s !== 'string') return null;
  // Try to find a long base64 chunk and rebuild
  // Capture base64 after 'base64,' up to end or before common junk like '&' or '?'
  const idx = s.indexOf('base64,');
  if (idx === -1) return null;
  let payload = s.substring(idx + 'base64,'.length);

  // If there are query-like junk characters appended, strip them
  const junkIndex = payload.search(/[&?\\\s]/);
  if (junkIndex !== -1) payload = payload.substring(0, junkIndex);

  // Remove newlines and spaces
  payload = payload.replace(/\s+/g, '');

  // Validate payload chars
  if (!/^[A-Za-z0-9+/=]+$/.test(payload)) return null;

  // Guess mime type from prefix if possible
  const mimeMatch = s.match(/^data:([^;]+);base64,/);
  const mime = (mimeMatch && mimeMatch[1]) || 'image/png';
  return `data:${mime};base64,${payload}`;
};

const main = async () => {
  const doFix = process.argv.includes('--fix');
  await connectDB();

  const cursor = Project.find().cursor();
  let total = 0;
  let problemCount = 0;
  const problems = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    total++;
    const proj = doc.toObject();
    const images = proj.images || {};
    const keysToCheck = ['hero', 'about', 'cta', 'logo'];
    // services is array - check elements if present
    try {
      for (const key of keysToCheck) {
        const img = images[key];
        if (!img || !img.url) continue;
        const url = img.url;
        if (url.startsWith('data:')) {
          if (!isValidDataBase64(url)) {
            problemCount++;
            const sanitized = trySanitizeDataUrl(url);
            problems.push({ projectId: proj._id, key, urlLength: url.length, sanitized: !!sanitized });
            if (doFix && sanitized) {
              // update the document
              await Project.updateOne({ _id: proj._id }, { $set: { [`images.${key}.url`]: sanitized } });
            }
          }
        }
      }

      // check services array if present
      if (Array.isArray(images.services) && images.services.length > 0) {
        for (let i = 0; i < images.services.length; i++) {
          const s = images.services[i];
          if (!s || !s.url) continue;
          const url = s.url;
          if (url.startsWith('data:') && !isValidDataBase64(url)) {
            problemCount++;
            const sanitized = trySanitizeDataUrl(url);
            problems.push({ projectId: proj._id, key: `services.${i}`, urlLength: url.length, sanitized: !!sanitized });
            if (doFix && sanitized) {
              await Project.updateOne({ _id: proj._id }, { $set: { [`images.services.${i}.url`]: sanitized } });
            }
          }
        }
      }
    } catch (err) {
      console.error('Error inspecting project', proj._id, err.message);
    }
  }

  console.log('--- Image URL scan report ---');
  console.log('Total projects scanned:', total);
  console.log('Problems found:', problemCount);
  if (problems.length > 0) console.table(problems.slice(0, 200));
  if (doFix) console.log('Fix mode: applied fixes for sanitizable URLs.');
  else console.log('Run with --fix to attempt automatic sanitization for some cases.');

  mongoose.disconnect();
};

main().catch(err => {
  console.error('Script failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
