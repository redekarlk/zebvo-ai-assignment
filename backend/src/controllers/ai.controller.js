import asyncHandler from '../utils/asyncHandler.js';
import Project from '../models/Project.js';
import { generateWebsiteContent } from '../services/ai.service.js';
import { generateProjectImages, generateSingleImage } from '../services/image.service.js';
import * as imagePrompts from '../prompts/image.prompt.js';
import { normalizeDesignTheme } from '../utils/designSystem.js';
import { parseJsonLoose } from '../utils/jsonParser.js';

const REQUIRED_SECTION_TYPES = ['hero', 'about', 'services', 'faq', 'cta'];

const tryParseJson = (value) => {
  if (typeof value !== 'string') {
    return value;
  }

  try {
    return parseJsonLoose(value);
  } catch {
    return value;
  }
};

const normalizeSections = (rawSections) => {
  let sections = tryParseJson(rawSections);

  if (sections && !Array.isArray(sections) && typeof sections === 'object' && Array.isArray(sections.sections)) {
    sections = sections.sections;
  }

  if (!Array.isArray(sections)) {
    return [];
  }

  const normalized = sections
    .map((item) => tryParseJson(item))
    .filter((item) => item && typeof item === 'object' && !Array.isArray(item));

  return normalized;
};

const createFallbackWebsiteContent = (businessInfo = {}) => {
  const businessName = businessInfo.businessName || 'Your Business';
  const category = businessInfo.category || 'Digital Services';
  const targetAudience = businessInfo.targetAudience || 'customers';
  const tone = businessInfo.tone || 'professional';
  const services = Array.isArray(businessInfo.services) && businessInfo.services.length
    ? businessInfo.services
    : ['Consulting', 'Implementation', 'Support'];

  return {
    usedFallback: true,
    theme: normalizeDesignTheme({
      colors: {
        primary: '#2563eb',
        secondary: '#0f172a',
        background: '#ffffff',
        surface: '#f8fafc',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        border: '#e2e8f0',
      },
    }),
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
          items: services.map((service) => ({
            title: service,
            description: `${service} tailored for ${targetAudience}.`,
          })),
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
      hero: { prompt: `Professional high-impact hero image for ${businessName}, ${category} business, clean premium composition, no text, no watermark` },
      about: { prompt: `Professional about-section image for ${businessName}, authentic team collaboration or founder portrait in a premium workspace, no text, no watermark` },
      services: { prompt: `Professional services-section image concept for ${businessName}, refined business scene showing expertise and trust, no text, no watermark` },
      faq: { prompt: `Professional FAQ/support image for ${businessName}, calm advisory or customer support scene, no text, no watermark` },
      cta: { prompt: `Professional call-to-action image for ${businessName}, success-focused business scene with strong conversion energy, no text, no watermark` },
      logo: { prompt: `Minimal premium logo concept for ${businessName}, brand mark inspired by ${category}, clean vector style, no text, no watermark` },
    },
    seo: {
      title: `${businessName} | ${category}`,
      description: `${businessName} offers ${category} services for ${targetAudience}.`,
      keywords: [
        String(businessName).toLowerCase(),
        String(category).toLowerCase(),
        String(targetAudience).toLowerCase(),
        ...services.map((service) => String(service).toLowerCase()),
      ],
    },
  };
};

const hasRequiredSections = (sections) => {
  if (!Array.isArray(sections) || sections.length < 5) {
    return false;
  }

  const types = sections.map((section) => section?.type);
  return REQUIRED_SECTION_TYPES.every((type) => types.includes(type));
};

export const generateWebsite = asyncHandler(async (req, res) => {
  const { projectId, userInstructions } = req.body;

  if (!projectId) {
    return res.status(400).json({ success: false, message: 'Project ID is required' });
  }

  const project = await Project.findOne({ _id: projectId, user: req.user._id });
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  console.log(`[AI Controller] Starting website generation for project: ${projectId}`);

  let result = await generateWebsiteContent(project.businessInfo, userInstructions);
  let usedFallback = result.usedFallback || false;
  const normalizedSections = normalizeSections(result.sections);

  if (!hasRequiredSections(normalizedSections)) {
    console.log(`[AI Controller] Sections validation failed, using fallback`);
    result = createFallbackWebsiteContent(project.businessInfo);
    usedFallback = true;
  } else {
    result.sections = normalizedSections;
  }
  
  // Extract the actual service titles generated in the website content
  const servicesSection = result.sections.find(s => s.type === 'services');
  const actualServices = (servicesSection?.props?.serviceItems || servicesSection?.props?.items || []).map(item => item.title);
  
  console.log(`[AI Controller] Website sections created. Services: ${actualServices.join(', ')}`);

  // Generate All Project Images (synced with actual services)
  console.log(`[AI Controller] Starting image generation with AI prompts...`);
  let images;
  try {
    images = await generateProjectImages(project.businessInfo, actualServices, result.images);
    console.log(`[AI Controller] Images generated successfully`);
  } catch (error) {
    console.error(`[AI Controller] Image generation error:`, error.message);
    // Still continue with fallback images
    images = {
      hero: { prompt: 'Hero image', url: 'https://loremflickr.com/1200/800/business/all', imageType: 'hero', keywords: 'business' },
      about: { prompt: 'About image', url: 'https://loremflickr.com/1200/800/team/all', imageType: 'about', keywords: 'team' },
      services: actualServices.map(s => ({ title: s, prompt: `Image for ${s}`, url: 'https://loremflickr.com/1200/800/business/all', imageType: 'service', keywords: 'business' })),
      cta: { prompt: 'CTA image', url: 'https://loremflickr.com/1200/800/success/all', imageType: 'cta', keywords: 'success' },
      logo: { prompt: 'Logo', url: 'https://loremflickr.com/1200/800/logo/all', imageType: 'logo', keywords: 'logo' }
    };
  }

  console.log(`[AI Controller] Saving to database...`);
  
  const updateData = {
    name: result.businessInfo?.businessName || project.name,
    businessInfo: {
      ...project.businessInfo,
      ...result.businessInfo
    },
    sections: result.sections,
    theme: normalizeDesignTheme(result.theme || project.theme),
    seo: result.seo || {},
    images: images
  };

  await Project.collection.updateOne(
    { _id: project._id },
    {
      $set: updateData
    }
  );

  console.log(`[AI Controller] Database update complete`);

  let updatedProject = await Project.collection.findOne({ _id: project._id });

  console.log(`[AI Controller] Website generation complete. UsedFallback: ${usedFallback}`);

  res.json({
    success: true,
    message: 'Website generated successfully',
    usedFallback,
    data: updatedProject
  });
});
export const regenerateSection = asyncHandler(async (req, res) => {
  const { projectId, sectionId } = req.body;

  if (!projectId || !sectionId) {
    return res.status(400).json({
      success: false,
      message: 'Project ID and Section ID are required',
    });
  }

  const project = await Project.findOne({
    _id: projectId,
    user: req.user._id,
  });

  if (!project) {
    return res.status(404).json({
      success: false,
      message: 'Project not found',
    });
  }

  const sectionIndex = project.sections.findIndex(s => s.id === sectionId);
  if (sectionIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Section not found',
    });
  }

  const sectionToRegenerate = project.sections[sectionIndex];
  
  const { regenerateSectionContent } = await import('../services/ai.service.js');

  try {
    const newProps = await regenerateSectionContent(project.businessInfo, sectionToRegenerate.type);

    // Update the section props
    project.sections[sectionIndex].props = newProps;

    // Build update object
    const updateData = { 
      sections: project.sections,
      images: { ...project.images }
    };

    // Handle image regeneration for the specific section
    const { generateSingleImage, generateServiceImages } = await import('../services/image.service.js');

    if (sectionToRegenerate.type === 'services') {
      const actualServices = newProps.items?.map(item => item.title) || [];
      const newServiceImages = await generateServiceImages(project.businessInfo, actualServices);
      updateData.images.services = newServiceImages;
    } else if (['hero', 'about', 'cta'].includes(sectionToRegenerate.type)) {
      const { buildHeroImagePrompt, buildAboutImagePrompt, buildCTAImagePrompt } = await import('../prompts/image.prompt.js');
      
      let promptBuilder;
      if (sectionToRegenerate.type === 'hero') {
        promptBuilder = buildHeroImagePrompt;
      } else if (sectionToRegenerate.type === 'about') {
        promptBuilder = buildAboutImagePrompt;
      } else if (sectionToRegenerate.type === 'cta') {
        promptBuilder = buildCTAImagePrompt;
      }

      if (promptBuilder) {
        const newImage = await generateSingleImage(promptBuilder, project.businessInfo);
        updateData.images[sectionToRegenerate.type] = newImage;
      }
    }

    // Use raw collection update for atomic operation
    await Project.collection.updateOne(
      { _id: project._id },
      { $set: updateData }
    );

    // Fetch updated section from database
    const updatedProject = await Project.collection.findOne({ _id: project._id });
    const updatedSection = updatedProject.sections[sectionIndex];

    res.json({
      success: true,
      message: 'Section regenerated successfully',
      data: updatedSection
    });
  } catch (error) {
    console.error('[AI Controller] Section regeneration failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate section: ' + error.message
    });
  }
});

export const regenerateImage = asyncHandler(async (req, res) => {
  const { projectId, imageType, serviceIndex } = req.body;

  if (!projectId || !imageType) {
    return res.status(400).json({ success: false, message: 'Project ID and image type are required' });
  }

  const project = await Project.findOne({ _id: projectId, user: req.user._id });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  try {
    let newImage;
    const businessInfo = project.businessInfo;

    switch (imageType) {
      case 'hero':
        newImage = await generateSingleImage(imagePrompts.buildHeroImagePrompt, businessInfo);
        project.images.hero = newImage;
        break;
      case 'about':
        newImage = await generateSingleImage(imagePrompts.buildAboutImagePrompt, businessInfo);
        project.images.about = newImage;
        break;
      case 'cta':
        newImage = await generateSingleImage(imagePrompts.buildCTAImagePrompt, businessInfo);
        project.images.cta = newImage;
        break;
      case 'logo':
        newImage = await generateSingleImage(imagePrompts.buildLogoPrompt, businessInfo);
        project.images.logo = newImage;
        break;
      case 'service':
        if (serviceIndex === undefined || !project.images.services[serviceIndex]) {
          return res.status(400).json({ success: false, message: 'Valid service index required' });
        }
        const serviceTitle = project.images.services[serviceIndex].title;
        newImage = await generateSingleImage(imagePrompts.buildServiceImagePrompt, serviceTitle, businessInfo);
        project.images.services[serviceIndex] = { ...project.images.services[serviceIndex], ...newImage };
        newImage = project.images.services[serviceIndex];
        break;
      default:
        return res.status(400).json({ success: false, message: 'Invalid image type' });
    }

    // Bust cache
    if (newImage && newImage.url) {
      newImage.url = `${newImage.url}&t=${Date.now()}`;
    }

    // Use raw collection update for Mixed type safety
    await Project.collection.updateOne(
      { _id: project._id },
      { $set: { images: project.images } }
    );

    res.json({
      success: true,
      message: 'Image regenerated successfully',
      data: newImage
    });
  } catch (error) {
    console.error('[AI Controller] Image regeneration failed:', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to regenerate image: ' + error.message
    });
  }
});