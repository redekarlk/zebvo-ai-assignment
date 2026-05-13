const buildThemePrompt = (businessInfo) => {
  return `Role: You are a Senior Brand Strategist and Art Director. Your goal is to define a world-class visual identity for a new business website.

Business Identity:
- Name: ${businessInfo.businessName}
- Category: ${businessInfo.category}
- Core Services: ${(businessInfo.services || []).join(', ')}
- Target Audience: ${businessInfo.targetAudience}
- Brand Voice: ${businessInfo.tone || 'professional'}

Instruction:
Define a cohesive "Visual DNA" for this brand. Your choices will drive the entire HTML layout.

1. Colors: Select a high-contrast, professional palette.
   - primary: The main action color.
   - secondary: The depth color (often dark).
   - background: The primary surface color.
   - surface: The card/alternate background.
   - accent: A punchy highlight color.

2. Typography: Select a high-end font pairing from Google Fonts. 
   - Options for Heading/Body: 
     - [Syne / Inter] (Modern/Tech)
     - [Playfair Display / Lato] (Elegant/Traditional)
     - [Montserrat / Open Sans] (Clean/Corporate)
     - [Outfit / Roboto] (Friendly/SaaS)

3. Visual Style: Choose the aesthetic "vibe".
   - Options: [minimal, glassmorphism, bold, corporate]

4. Composition Tokens:
   - spacingVibe: [compact, breathable]
   - borderRadius: [0px (sharp), 12px (standard), 40px (playful)]

Output Format (STRICT JSON):
{
  "theme": {
    "visualStyle": "minimal | glassmorphism | bold | corporate",
    "spacingVibe": "compact | breathable",
    "colors": {
      "primary": "#HEX",
      "secondary": "#HEX",
      "background": "#HEX",
      "surface": "#HEX",
      "accent": "#HEX",
      "textPrimary": "#HEX",
      "textSecondary": "#HEX",
      "border": "#HEX"
    },
    "typography": {
      "fontFamily": "Body Font Name",
      "headingFontFamily": "Heading Font Name"
    },
    "layout": {
      "radius": "0px | 12px | 40px",
      "sectionSpacing": "xl"
    }
  }
}

Return ONLY the JSON. No preamble.`;
};

export default buildThemePrompt;
