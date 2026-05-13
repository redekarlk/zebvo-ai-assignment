import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      trim: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Template',
    },

    businessInfo: {
      businessName: String,
      category: String,
      services: [String],
      targetAudience: String,
      tone: {
        type: String,
        default: 'professional',
      },
      phone: String,
      email: String,
      address: String,
      website: String,
    },

    sections: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },

    theme: {
      visualStyle: { type: String, default: 'minimal' },
      spacingVibe: { type: String, default: 'breathable' },
      colors: {
        primary: { type: String, default: '#2563eb' },
        secondary: { type: String, default: '#0f172a' },
        background: { type: String, default: '#ffffff' },
        surface: { type: String, default: '#f8fafc' },
        textPrimary: { type: String, default: '#0f172a' },
        textSecondary: { type: String, default: '#475569' },
        border: { type: String, default: '#e2e8f0' },
        accent: { type: String, default: '#2563eb' },
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

    seo: {
      title: String,
      description: String,
      keywords: [String],
    },

    images: {
      hero: {
        prompt: String,
        url: String
      },
      about: {
        prompt: String,
        url: String
      },
      cta: {
        prompt: String,
        url: String
      },
      logo: {
        prompt: String,
        url: String
      }
    },

    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
    },

    deployment: {
      status: {
        type: String,
        enum: ['idle', 'deploying', 'live', 'failed'],
        default: 'idle',
      },
      liveUrl: String,
      lastDeployedAt: Date,
      deploymentId: String,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);

export default Project;