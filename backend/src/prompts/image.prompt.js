const normalizeBusinessInfo = (businessInfo = {}) => ({
  businessName: businessInfo.businessName || 'Brand',
  category: businessInfo.category || 'business',
  services: Array.isArray(businessInfo.services) ? businessInfo.services : [],
  targetAudience: businessInfo.targetAudience || 'customers',
});

const noTextRules = 'ABSOLUTELY NO text, no words, no captions, no labels, no logos, no watermarks, no UI elements, no charts, no numbers, no written language of any kind. Pure visual composition only.';

export const buildHeroImagePrompt = (businessInfo) => {
  const info = normalizeBusinessInfo(businessInfo);
  const services = info.services.length
    ? info.services.slice(0, 2).join(', ')
    : info.category;

  return [
    `Generate a stunning, high-quality product or service showcase image for ${info.businessName}.`,
    `This image is for the hero/header section and must visually represent what ${info.businessName} does (${info.category}).`,
    `Show actual product, service in use, or professional deliverable: If tech/software - show dashboard/app interface in use. If service-based - show actual work/results. If product - showcase the product itself.`,
    `Composition: Professional product photography. Polished, premium, modern. Strong visual hierarchy with clear main subject. Well-lit, sharp, high-impact.`,
    `Style: Contemporary professional photography. Premium studio quality. Modern color grading. Clean, premium aesthetic that elevates brand perception.`,
    `This image must make the website look more professional and credible. Not abstract - show real, tangible product/service/results.`,
    noTextRules,
  ].join(' ');
};

export const buildAboutImagePrompt = (businessInfo) => {
  const info = normalizeBusinessInfo(businessInfo);
  return [
    `Generate a professional, compelling about-section image for ${info.businessName}.`,
    `This image must showcase the brand's credibility and professionalism for a ${info.category} company.`,
    `Show ONE of: (1) professional team at work, (2) founder/leader portrait with authority, (3) actual workspace showing professional environment, (4) service delivery in action showing real results.`,
    `Composition: Premium professional photography. Portrait-style or well-composed scene. Strong presence, trustworthy energy. Clean framing, professional lighting.`,
    `Style: Corporate professional photography. Authentic, credible, polished. Modern color grading. High-quality product photography style lighting and composition.`,
    `This image must convey expertise, trust, and professionalism. Make the about section feel real and credible, not generic.`,
    noTextRules,
  ].join(' ');
};

export const buildServiceImagePrompt = (serviceTitle, businessInfo) => {
  const info = normalizeBusinessInfo(businessInfo);
  return [
    `Generate a professional, high-quality product/service image specifically for: "${serviceTitle}"`,
    `This is a service card for a ${info.category} company. The image must clearly show what "${serviceTitle}" IS and what it DOES.`,
    `Show actual product, tool, result, or service delivery: If software/digital - show dashboard, app, interface, or digital deliverable. If physical product - show the product with professional styling. If service - show the service being delivered or results achieved.`,
    `Composition: Professional product photography style. Clean, premium, well-lit. Strong focal point. Perfect for a card/tile layout. High production value.`,
    `Style: Studio-quality professional photography. Modern, polished, premium. Sharp focus, excellent lighting, contemporary color grading.`,
    `This image must be specific and tangible - not generic. It should make this service look valuable and professional compared to competitors.`,
    noTextRules,
  ].join(' ');
};

export const buildCTAImagePrompt = (businessInfo) => {
  const info = normalizeBusinessInfo(businessInfo);
  return [
    `Generate a powerful, high-impact image for the CTA (call-to-action) section of ${info.businessName}.`,
    `This image must inspire action and demonstrate the value/results of ${info.category} services from ${info.businessName}.`,
    `Show real results, achievement, or transformation: Success metrics, before/after, professional delivering results, product/service in successful use, or business growth/achievement visualization.`,
    `Composition: Striking professional photography. High-impact visual. Dynamic, energetic but polished. Strong visual interest. Motivating and engaging.`,
    `Style: Premium professional photography. Contemporary, powerful aesthetic. Modern color grading with impact. Studio quality. Compelling and action-inspiring.`,
    `This image should make visitors want to take action - show real value, real results, real capability.`,
    noTextRules,
  ].join(' ');
};

export const buildLogoPrompt = (businessInfo) => {
  const info = normalizeBusinessInfo(businessInfo);
  const serviceHint = info.services.length
    ? info.services[0]
    : info.category;
    
  return [
    `Create a minimalist logo concept for ${info.businessName}, a ${info.category} brand.`,
    `Design a simple geometric brand mark that subtly reflects ${serviceHint} and works as a small favicon or header logo.`,
    `Use clean shapes, strong silhouette, minimal detail, monochrome-friendly styling, and a premium modern identity.`,
    noTextRules,
  ].join(' ');
};

// Kept for backward compatibility if needed
export const buildImagePrompt = buildHeroImagePrompt;
