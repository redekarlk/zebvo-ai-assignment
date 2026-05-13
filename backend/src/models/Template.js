import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: ['agency', 'ecommerce', 'saas', 'portfolio', 'service', 'blog', 'consulting', 'nonprofit'],
      default: 'service',
    },

    // Default sections for this template
    sections: [
      {
        id: { type: String },
        type: { type: String },
        order: { type: Number },
        visible: { type: Boolean, default: true },
        props: { type: mongoose.Schema.Types.Mixed },
      },
    ],

    // Default theme for this template
    theme: {
      colors: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#0f172a' },
        background: { type: String, default: '#ffffff' },
        surface: { type: String, default: '#f8fafc' },
        textPrimary: { type: String, default: '#0f172a' },
        textSecondary: { type: String, default: '#475569' },
        border: { type: String, default: '#e2e8f0' },
      },
      typography: {
        fontFamily: { type: String, default: 'Inter' },
        headingFontFamily: { type: String, default: 'Inter' },
        baseScale: { type: String, default: '100%' },
      },
      layout: {
        sectionSpacing: { type: String, default: 'xl' },
        radius: { type: String, default: 'lg' },
        containerWidth: { type: String, default: 'xl' },
      },
      buttons: {
        style: { type: String, default: 'solid' },
        radius: { type: String, default: 'lg' },
      },
      sectionVariants: {
        hero: { type: String, default: 'centered' },
        about: { type: String, default: 'split' },
        services: { type: String, default: 'cards' },
        faq: { type: String, default: 'accordion' },
        cta: { type: String, default: 'banner' },
      },
    },

    // Preview/metadata
    imageUrl: String, // URL to template preview image
    thumbnail: String, // Small preview thumbnail
    tags: [String], // e.g., ['modern', 'minimal', 'colorful']
    isPopular: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // For sorting templates

    // SEO defaults for this template
    seoDefaults: {
      titleTemplate: String, // e.g., "{{ businessName }} | Premium Services"
      descriptionTemplate: String,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model('Template', templateSchema);

export default Template;
