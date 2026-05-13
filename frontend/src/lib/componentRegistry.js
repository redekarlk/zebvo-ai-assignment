import HeroSection from '@/components/preview/sections/HeroSection';
import AboutSection from '@/components/preview/sections/AboutSection';
import ServicesSection from '@/components/preview/sections/ServicesSection';
import FAQSection from '@/components/preview/sections/FAQSection';
import CTASection from '@/components/preview/sections/CTASection';
import TestimonialsSection from '@/components/preview/sections/TestimonialsSection';
import ContactSection from '@/components/preview/sections/ContactSection';
import FooterSection from '@/components/preview/sections/FooterSection';

/**
 * Section component registry
 * Maps (type) → component
 */
export const SECTION_REGISTRY = {
  hero: HeroSection,
  about: AboutSection,
  services: ServicesSection,
  features: ServicesSection, // Features uses the same layout logic as Services
  faq: FAQSection,
  cta: CTASection,
  testimonials: TestimonialsSection,
  contact: ContactSection,
  footer: FooterSection
};

/**
 * Supported variants per section type
 */
export const SECTION_VARIANTS = {
  hero: ['centered', 'split', 'minimal', 'overlaid', 'fancy'],
  about: ['split', 'reversed', 'fullwidth', 'imagebg', 'minimal'],
  services: ['cards', 'stacked', 'alternating', 'minimal', 'featured'],
  features: ['grid-cards', 'minimal', 'icon-list'],
  faq: ['accordion', 'cards', 'list', 'sidebar'],
  cta: ['banner', 'split', 'minimal', 'aside', 'newsletter'],
  testimonials: ['grid', 'carousel', 'clean'],
  contact: ['split', 'centered', 'minimal'],
  footer: ['simple', 'detailed', 'minimal']
};

/**
 * Content fields per section type for click-to-edit
 * Updated to support the dynamic Agentic Architect schema
 */
export const SECTION_CONTENT_FIELDS = {
  hero: [
    { field: 'headline', label: 'Headline', type: 'text', path: 'props.headline' },
    { field: 'subheadline', label: 'Subheadline', type: 'textarea', path: 'props.subheadline' },
    { field: 'ctaText', label: 'CTA Button Text', type: 'text', path: 'props.ctaText' },
  ],
  about: [
    { field: 'headline', label: 'Headline', type: 'text', path: 'props.headline' },
    { field: 'title', label: 'Alternative Title', type: 'text', path: 'props.title' },
    { field: 'content', label: 'Main Content (String or Array)', type: 'textarea', path: 'props.content' },
    { field: 'description', label: 'Alternative Description', type: 'textarea', path: 'props.description' },
  ],
  services: [
    { field: 'headline', label: 'Section Headline', type: 'text', path: 'props.headline' },
    { field: 'subheadline', label: 'Subtitle', type: 'text', path: 'props.subheadline' },
    { field: 'serviceItems', label: 'Service Items', type: 'array', path: 'props.serviceItems', itemFields: ['title', 'description'] },
    { field: 'items', label: 'Legacy Items', type: 'array', path: 'props.items', itemFields: ['title', 'description'] },
  ],
  features: [
    { field: 'headline', label: 'Section Headline', type: 'text', path: 'props.headline' },
    { field: 'serviceItems', label: 'Feature Items', type: 'array', path: 'props.serviceItems', itemFields: ['title', 'description', 'icon'] },
  ],
  faq: [
    { field: 'headline', label: 'Section Headline', type: 'text', path: 'props.headline' },
    { field: 'faqItems', label: 'FAQ Items', type: 'array', path: 'props.faqItems', itemFields: ['question', 'answer'] },
    { field: 'items', label: 'Legacy Items', type: 'array', path: 'props.items', itemFields: ['question', 'answer'] },
  ],
  cta: [
    { field: 'headline', label: 'Headline', type: 'text', path: 'props.headline' },
    { field: 'subheadline', label: 'Subheadline', type: 'textarea', path: 'props.subheadline' },
    { field: 'ctaText', label: 'Button Text', type: 'text', path: 'props.ctaText' },
    { field: 'buttonText', label: 'Legacy Button Text', type: 'text', path: 'props.buttonText' },
  ],
  testimonials: [
    { field: 'headline', label: 'Headline', type: 'text', path: 'props.headline' },
    { field: 'testimonials', label: 'Testimonials', type: 'array', path: 'props.testimonials', itemFields: ['name', 'quote'] },
  ],
};

export const getComponent = (type) => SECTION_REGISTRY[type] || null;
export const isValidVariant = (type, variant) => SECTION_VARIANTS[type]?.includes(variant);
export const getEditableFields = (type) => SECTION_CONTENT_FIELDS[type] || [];
export const getSectionTypes = () => Object.keys(SECTION_REGISTRY);
export const getJsonPath = (sectionId, fieldPath) => `sections.${sectionId}.${fieldPath}`;

export default SECTION_REGISTRY;
