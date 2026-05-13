const buildWebsiteContentPrompt = (businessInfo, theme) => {
  return `Role: You are a World-Class Conversion Strategist and UI/UX Architect. Your goal is to generate a comprehensive, high-converting 8-section landing page for "${businessInfo.businessName}".

Context:
- Category: ${businessInfo.category}
- Audience: ${businessInfo.targetAudience}
- Style DNA: [${theme.visualStyle}] [${theme.spacingVibe}]

Architectural Requirements (Follow AIDA Model):
Generate a logical flow of exactly 8 sections using these types and variants:

1. HERO (Attention): 
   - Variant: centered-split or full-width-overlaid
   - Content: A "Big Promise" headline and a strong CTA.

2. LOGOS / SOCIAL PROOF:
   - Type: "features" | Variant: "logo-strip"
   - Content: List 4-5 key partners or trust markers (e.g. "Certified Organic", "ISO Certified").

3. ABOUT (Interest):
   - Type: "about" | Variant: "split-left-image"
   - Content: Tell the "Origin Story" or the "Why" behind the brand.

4. FEATURES (Interest):
   - Type: "features" | Variant: "grid-cards"
   - Content: List 4 core functional benefits of the product/service.

5. PROCESS (Desire):
   - Type: "services" | Variant: "steps-alternating"
   - Content: A 3-step "How it Works" section (e.g. Order, Delivery, Enjoy).

6. TESTIMONIALS (Desire):
   - Type: "testimonials" | Variant: "quote-grid"
   - Content: 3 realistic, emotionally-charged reviews with author names/roles.

7. FAQ (Clarity):
   - Type: "faq" | Variant: "accordion-minimal"
   - Content: Answer 5 common objections or questions.

8. FINAL CTA (Action):
   - Type: "cta" | Variant: "minimal-banner"
   - Content: One last powerful nudge to convert.

Data Mapping Rules:
- All section IDs must be unique (e.g. hero-1, about-1, etc.).
- "headline" is mandatory for every section.
- "ctaText" is required for Hero, CTA, and optionally About.
- Images: Generate descriptive "url_ref" (15 words) for Hero, About, and Features.
- SEO: Include an "seo" object with "title", "description", and an array of 8-10 "keywords" (highly relevant, conversion-focused).

Output ONLY a valid JSON object. Do not explain anything. Return ONLY the JSON.`;
};

export default buildWebsiteContentPrompt;