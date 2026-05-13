import vertexAI from '../config/gemini.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import buildThemePrompt from '../prompts/theme.prompt.js';
import buildWebsiteContentPrompt from '../prompts/website.prompt.js';
import { normalizeDesignTheme, DEFAULT_DESIGN_THEME } from '../utils/designSystem.js';
import { parseJsonLoose } from '../utils/jsonParser.js';

const REQUIRED_SECTION_TYPES = ['hero', 'about', 'services', 'faq', 'cta'];

// Get Gemini API instance as fallback
const getGeminiAPI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

const getAIModel = () => {
  // Try Vertex AI first, fall back to Generative AI
  try {
    return vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (error) {
    console.warn('[AI Service] Vertex AI not available, using Generative AI:', error.message);
    const genAI = getGeminiAPI();
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
};

const callAIModel = async (prompt) => {
  try {
    const model = getAIModel();
    const response = await model.generateContent(prompt);
    
    // Handle both Vertex AI and Generative AI response formats
    let text;
    if (response.response && response.response.candidates) {
      // Vertex AI format
      text = response.response.candidates[0]?.content?.parts[0]?.text;
    } else if (response.candidates) {
      // Generative AI format
      text = response.candidates[0]?.content?.parts[0]?.text;
    }
    
    if (!text) {
      throw new Error('No text in response');
    }
    
    return text.trim();
  } catch (error) {
    console.error('[AI Service] Model call failed:', error.message);
    throw error;
  }
};

const safeString = (value, fallback) => {
  if (typeof value === 'string' && value.trim()) {
    return value.trim();
  }
  return fallback;
};

const safeArray = (value) => {
  if (Array.isArray(value)) {
    return value.filter((item) => typeof item === 'string' && item.trim());
  }
  return [];
};

const buildFallbackWebsiteContent = (businessInfo = {}) => {
  const businessName = safeString(businessInfo.businessName, 'Your Business');
  const category = safeString(businessInfo.category, 'Digital Services');
  const targetAudience = safeString(businessInfo.targetAudience, 'customers');
  const tone = safeString(businessInfo.tone, 'professional');
  const stylePreference = safeString(businessInfo.stylePreference, 'modern');
  const fontFamily = safeString(businessInfo.typography?.fontFamily || businessInfo.fontFamily, 'Inter');
  const headingFontFamily = safeString(businessInfo.typography?.headingFontFamily || businessInfo.headingFontFamily, fontFamily);
  const services = safeArray(businessInfo.services);

  const serviceItems = (services.length ? services : ['Consulting', 'Implementation', 'Support']).map((service) => ({
    title: service,
    description: `${service} tailored for ${targetAudience}.`,
  }));

  const theme = normalizeDesignTheme({
    colors: {
      primary: '#2563eb',
      secondary: '#0f172a',
      background: '#ffffff',
      surface: '#f8fafc',
      textPrimary: '#0f172a',
      textSecondary: '#475569',
      border: '#e2e8f0',
    },
    typography: {
      fontFamily,
      headingFontFamily,
    },
  });

  return {
    usedFallback: true,
    theme,
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'split',
        props: {
          headline: `${businessName} for ${targetAudience}`,
          subheadline: `Trusted ${category} solutions with a ${tone} approach.`,
          ctaText: 'Get Started',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'reversed',
        props: {
          title: `About ${businessName}`,
          description: `${businessName} helps ${targetAudience} through reliable ${category} solutions focused on outcomes and long-term growth.`,
        },
      },
      {
        id: 'services-1',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'featured',
        props: {
          title: 'Our Services',
          items: serviceItems,
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        order: 4,
        visible: true,
        variant: 'cards',
        props: {
          items: [
            {
              question: `What does ${businessName} do?`,
              answer: `We provide ${category} services for ${targetAudience}.`,
            },
            {
              question: 'How do we start?',
              answer: 'Contact us with your requirements and we will propose a tailored plan.',
            },
            {
              question: 'Do you provide ongoing support?',
              answer: 'Yes, we provide support and optimization after delivery.',
            },
            {
              question: 'Can services be customized?',
              answer: 'Yes, all services can be adjusted based on your goals.',
            },
          ],
        },
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 5,
        visible: true,
        variant: 'newsletter',
        props: {
          headline: `Ready to grow with ${businessName}?`,
          buttonText: 'Contact Us',
        },
      },
    ],
    images: {
      hero: {
        prompt: `Professional high-impact hero image for ${businessName}, ${category} business, aligned with a ${stylePreference} visual style, clean premium composition, cinematic lighting, no text, no watermark`,
      },
      about: {
        prompt: `Professional about-section image for ${businessName}, aligned with a ${stylePreference} visual style, authentic team collaboration or founder portrait in a premium workspace, no text, no watermark`,
      },
      services: {
        prompt: `Professional services-section image concept for ${businessName}, aligned with a ${stylePreference} visual style, refined business scene showing expertise and trust, no text, no watermark`,
      },
      faq: {
        prompt: `Professional FAQ/support image for ${businessName}, aligned with a ${stylePreference} visual style, calm advisory or customer support scene, no text, no watermark`,
      },
      cta: {
        prompt: `Professional call-to-action image for ${businessName}, aligned with a ${stylePreference} visual style, success-focused business scene with strong conversion energy, no text, no watermark`,
      },
      logo: {
        prompt: `Minimal premium logo concept for ${businessName}, brand mark inspired by ${category}, aligned with a ${stylePreference} visual style, clean vector style, no text, no watermark`,
      },
    },
    seo: {
      title: `${businessName} | ${category}`,
      description: `${businessName} offers ${category} services for ${targetAudience}.`,
      keywords: [
        businessName.toLowerCase(),
        category.toLowerCase(),
        targetAudience.toLowerCase(),
        ...services.map((service) => service.toLowerCase()),
      ],
    },
  };
};

const parseGeminiJson = (rawText) => {
  try {
    return parseJsonLoose(rawText);
  } catch (error) {
    console.error('[AI Service] JSON Parse failed for text:', rawText);
    throw new Error('AI returned invalid JSON format');
  }
};

const ensureSectionVariants = (sections = []) => {
  const defaultVariants = {
    hero: 'centered',
    about: 'split',
    services: 'cards',
    faq: 'accordion',
    cta: 'banner',
  };
  
  return sections.map((section) => ({
    ...section,
    variant: section.variant || defaultVariants[section.type] || 'default',
  }));
};

const validateAiResult = (result) => {
  if (!result || typeof result !== 'object') {
    throw new Error('Invalid AI response: response is not an object');
  }

  if (!result.theme || typeof result.theme !== 'object') {
    throw new Error('Invalid AI response: missing theme');
  }

  if (!result.images || typeof result.images !== 'object') {
    throw new Error('Invalid AI response: missing images');
  }

  // Ensure all required image keys exist, even if only with prompts
  const requiredImageKeys = ['hero', 'about', 'services', 'faq', 'cta', 'logo'];
  requiredImageKeys.forEach(key => {
    if (!result.images[key] || (typeof result.images[key] !== 'object' && typeof result.images[key] !== 'string')) {
      throw new Error(`Invalid AI response: missing or invalid image data for ${key}`);
    }
  });

  if (!result.seo || typeof result.seo !== 'object' || !Array.isArray(result.seo.keywords)) {
    throw new Error('Invalid AI response: missing SEO metadata');
  }

  if (!result.sections || !Array.isArray(result.sections) || result.sections.length === 0) {
    throw new Error('Invalid AI response: missing sections array');
  }

  const sectionTypes = result.sections.map((section) => section?.type);
  const missingTypes = REQUIRED_SECTION_TYPES.filter((requiredType) => !sectionTypes.includes(requiredType));

  if (missingTypes.length > 0) {
    throw new Error(`Invalid AI response: missing required section types (${missingTypes.join(', ')})`);
  }

  // Relaxed ordering but strictly checking properties
  result.sections.forEach((section, index) => {
    if (!section.type || !section.props || typeof section.props !== 'object') {
      throw new Error(`Invalid AI response: section at index ${index} is missing type or props`);
    }
  });

  return true;
};

export const generateVisualIdentity = async (businessInfo) => {
  try {
    const prompt = buildThemePrompt(businessInfo);
    
    console.log(`[AI Service] Generating visual identity...`);
    const rawText = await callAIModel(prompt);
    const result = parseGeminiJson(rawText);

    if (!result.theme) {
      throw new Error('Invalid theme response: missing theme object');
    }

    return result.theme;
  } catch (error) {
    console.error(`[AI Service] Visual identity error:`, error.message);
    return DEFAULT_DESIGN_THEME;
  }
};

export const generateWebsiteContentWithTheme = async (businessInfo, theme) => {
  try {
    const prompt = buildWebsiteContentPrompt(businessInfo, theme);
    
    console.log(`[AI Service] Generating content for theme: ${theme.visualStyle}...`);
    const rawText = await callAIModel(prompt);
    const result = parseGeminiJson(rawText);

    // Basic structure check
    if (!result.sections || !Array.isArray(result.sections)) {
      throw new Error('Invalid content response: missing sections array');
    }

    return result;
  } catch (error) {
    console.error(`[AI Service] Content generation error:`, error.message);
    return buildFallbackWebsiteContent(businessInfo);
  }
};

// Main Entry Point
export const generateWebsiteContent = async (businessInfo, userInstructions = '') => {
  console.log(`[AI Service] Starting 2-step generation flow...`);
  
  // Step 1: Brand Strategy
  const theme = await generateVisualIdentity(businessInfo);
  
  // Step 2: Content Architecture
  const content = await generateWebsiteContentWithTheme(businessInfo, theme);
  
  return {
    ...content,
    theme: theme,
    usedFallback: content.usedFallback || false
  };
};

const getDefaultSectionProps = (sectionType, businessInfo = {}) => {
  const businessName = businessInfo.businessName || 'Your Business';
  const category = businessInfo.category || 'Business';
  const targetAudience = businessInfo.targetAudience || 'customers';
  
  const defaults = {
    hero: {
      headline: `Welcome to ${businessName}`,
      subheadline: `Premium ${category} solutions for ${targetAudience}`,
      ctaText: 'Get Started'
    },
    about: {
      title: `About ${businessName}`,
      description: `${businessName} is a leading provider of ${category} services. We are committed to delivering excellence and building long-term relationships with our clients.`
    },
    services: {
      title: 'Our Services',
      items: (businessInfo.services || ['Service 1', 'Service 2', 'Service 3']).map(s => ({
        title: s,
        description: `Expert ${s} tailored to your specific needs.`
      }))
    },
    faq: {
      items: [
        {
          question: `What services does ${businessName} provide?`,
          answer: `We provide comprehensive ${category} services designed for ${targetAudience}.`
        },
        {
          question: 'How do we get started?',
          answer: 'Contact us today to discuss your requirements and receive a customized proposal.'
        },
        {
          question: 'What makes us different?',
          answer: `We combine expertise, innovation, and customer focus to deliver exceptional results.`
        },
        {
          question: 'Do you offer ongoing support?',
          answer: 'Yes, we provide comprehensive support and maintenance services.'
        }
      ]
    },
    cta: {
      headline: `Ready to work with ${businessName}?`,
      buttonText: 'Contact Us Today'
    }
  };
  
  return defaults[sectionType] || {};
};

export const regenerateSectionContent = async (businessInfo, sectionType) => {
  const businessName = businessInfo?.businessName || 'Your Business';
  const category = businessInfo?.category || 'Business';
  const targetAudience = businessInfo?.targetAudience || 'customers';
  const tone = businessInfo?.tone || 'professional';
  
  const prompt = `You are an expert web copywriter. Generate compelling content for a "${sectionType}" section of a website.

Business Information:
- Business Name: ${businessName}
- Category: ${category}
- Target Audience: ${targetAudience}
- Tone: ${tone}

Return ONLY valid JSON (no markdown, no explanations) matching the exact structure below:

${sectionType === 'services' ? `{
  "title": "Section Title",
  "items": [
    { "title": "Item Name", "description": "Item description" },
    { "title": "Item Name", "description": "Item description" }
  ]
}` : sectionType === 'faq' ? `{
  "items": [
    { "question": "Question?", "answer": "Answer here" },
    { "question": "Question?", "answer": "Answer here" }
  ]
}` : `{
  "headline": "Main heading",
  "title": "Section title (if applicable)",
  "subheadline": "Optional subtitle",
  "description": "Section description",
  "buttonText": "CTA button text (if applicable)"
}` }`;

  try {
    const rawText = await callAIModel(prompt);
    console.log(`[AI Service] Raw response for regenerate ${sectionType}:`, rawText);
    
    let result = parseGeminiJson(rawText);

    // Normalize response for 'services' section
    if (sectionType === 'services') {
      const items = result.items || result.services || result.list || [];
      let finalItems = Array.isArray(items) ? items.filter(item => item && typeof item === 'object') : [];
      
      if (finalItems.length === 0) {
        finalItems = (businessInfo?.services || ['Custom Solutions']).map(s => ({
          title: s,
          description: `Professional ${s} services tailored for your specific needs.`
        }));
      }

      result = {
        title: result.title || 'Our Services',
        items: finalItems
      };
    } else if (sectionType === 'faq') {
      const items = result.items || result.faqs || [];
      let finalItems = Array.isArray(items) ? items.filter(item => item && typeof item === 'object') : [];
      
      if (finalItems.length === 0) {
        finalItems = getDefaultSectionProps('faq', businessInfo).items;
      }

      result = { items: finalItems };
    }
    
    return result;
  } catch (error) {
    console.error(`[AI Service] Regenerate ${sectionType} failed:`, error.message);
    // Return fallback for this section type
    return getDefaultSectionProps(sectionType, businessInfo);
  }
};