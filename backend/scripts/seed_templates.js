/*
Script: seed_templates.js
- Seeds the database with predefined website templates
- Usage: node scripts/seed_templates.js
*/

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Template from '../src/models/Template.js';
import connectDB from '../src/config/db.js';
import { normalizeDesignTheme } from '../src/utils/designSystem.js';

dotenv.config({ path: process.env.DOTENV_PATH || '.env' });

const templates = [
  {
    name: 'Modern Agency',
    slug: 'modern-agency',
    description: 'Perfect for creative agencies and design studios. Features a bold hero, portfolio-style services, and strong CTAs.',
    category: 'agency',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150',
    tags: ['modern', 'bold', 'creative'],
    isPopular: true,
    order: 1,
    theme: {
      primaryColor: '#0099FF',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-1',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'centered',
        props: {
          headline: 'Elevate Your Brand',
          subheadline: 'Cutting-edge design and strategy for modern businesses',
          ctaText: 'Get Started',
        },
      },
      {
        id: 'about-1',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'split',
        props: {
          title: 'About Our Agency',
          description: 'We specialize in creating bold, innovative digital experiences that drive business growth.',
        },
      },
      {
        id: 'services-1',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'cards',
        props: {
          title: 'Our Services',
          items: [
            { title: 'Brand Strategy', description: 'Develop your unique market position' },
            { title: 'Web Design', description: 'Beautiful, functional digital experiences' },
            { title: 'Digital Marketing', description: 'Reach your audience effectively' },
          ],
        },
      },
      {
        id: 'faq-1',
        type: 'faq',
        order: 4,
        visible: true,
        variant: 'accordion',
        props: {
          items: [
            { question: 'What is your process?', answer: 'We follow a collaborative, research-driven approach to ensure your vision becomes reality.' },
            { question: 'How long does a project take?', answer: 'Projects typically range from 4-12 weeks depending on scope.' },
          ],
        },
      },
      {
        id: 'cta-1',
        type: 'cta',
        order: 5,
        visible: true,
        variant: 'banner',
        props: {
          headline: 'Ready to Transform Your Brand?',
          buttonText: 'Contact Us Today',
        },
      },
    ],
  },
  {
    name: 'E-Commerce Store',
    slug: 'ecommerce-store',
    description: 'Optimized for selling products. Includes featured products, testimonials, and conversion-focused CTAs.',
    category: 'ecommerce',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=600&h=400',
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-adf4e565db18?w=200&h=150',
    tags: ['commerce', 'sales', 'conversion'],
    isPopular: true,
    order: 2,
    theme: {
      primaryColor: '#ec4899',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-ecom',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'split',
        props: {
          headline: 'Discover Your Next Favorite',
          subheadline: 'Premium products, fast shipping, guaranteed satisfaction',
          ctaText: 'Shop Now',
        },
      },
      {
        id: 'about-ecom',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'reversed',
        props: {
          title: 'Why Shop With Us',
          description: 'Handpicked quality products, exceptional customer service, and fast delivery.',
        },
      },
      {
        id: 'services-ecom',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'alternating',
        props: {
          title: 'What We Offer',
          items: [
            { title: 'Premium Selection', description: 'Carefully curated products' },
            { title: 'Fast Shipping', description: 'Delivered in 2-5 business days' },
            { title: '100% Satisfaction', description: 'Easy returns and exchanges' },
          ],
        },
      },
      {
        id: 'cta-ecom',
        type: 'cta',
        order: 4,
        visible: true,
        variant: 'newsletter',
        props: {
          headline: 'Exclusive Offer: 20% Off Your First Order',
          buttonText: 'Claim Offer',
        },
      },
    ],
  },
  {
    name: 'SaaS Startup',
    slug: 'saas-startup',
    description: 'Built for Software-as-a-Service companies. Emphasizes features, pricing tiers, and free trial CTAs.',
    category: 'saas',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&h=400',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=150',
    tags: ['tech', 'startup', 'features'],
    isPopular: true,
    order: 3,
    theme: {
      primaryColor: '#10b981',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-saas',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'minimal',
        props: {
          headline: 'Automate Your Workflow',
          subheadline: 'Intuitive software that saves teams time and money',
          ctaText: 'Start Free Trial',
        },
      },
      {
        id: 'about-saas',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'fullwidth',
        props: {
          title: 'Built for Your Team',
          description: 'Trusted by thousands of companies worldwide to streamline operations and boost productivity.',
        },
      },
      {
        id: 'services-saas',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'minimal',
        props: {
          title: 'Key Features',
          items: [
            { title: 'Easy Integration', description: 'Connect with your existing tools' },
            { title: 'Real-time Analytics', description: 'Data-driven insights at a glance' },
            { title: 'Enterprise Security', description: 'Your data is protected' },
          ],
        },
      },
      {
        id: 'cta-saas',
        type: 'cta',
        order: 4,
        visible: true,
        variant: 'minimal',
        props: {
          headline: 'Join 10,000+ Teams Using Our Platform',
          buttonText: 'Get Started Free',
        },
      },
    ],
  },
  {
    name: 'Portfolio Showcase',
    slug: 'portfolio-showcase',
    description: 'Ideal for freelancers and creatives. Emphasizes portfolio, testimonials, and availability.',
    category: 'portfolio',
    imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=150',
    tags: ['portfolio', 'creative', 'freelance'],
    isPopular: false,
    order: 4,
    theme: {
      primaryColor: '#f59e0b',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-port',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'overlaid',
        props: {
          headline: 'Creative Professional',
          subheadline: 'Crafting compelling digital experiences',
          ctaText: 'View My Work',
        },
      },
      {
        id: 'about-port',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'imagebg',
        props: {
          title: 'About Me',
          description: 'With 10+ years of experience, I help brands tell their story through design.',
        },
      },
      {
        id: 'services-port',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'featured',
        props: {
          title: 'Services',
          items: [
            { title: 'Visual Design', description: 'UI/UX design for web and mobile' },
            { title: 'Branding', description: 'Logo and brand identity systems' },
            { title: 'Consulting', description: 'Strategic design guidance' },
          ],
        },
      },
      {
        id: 'cta-port',
        type: 'cta',
        order: 4,
        visible: true,
        variant: 'aside',
        props: {
          headline: 'Let\'s Create Something Amazing',
          buttonText: 'Get in Touch',
        },
      },
    ],
  },
  {
    name: 'Service Provider',
    slug: 'service-provider',
    description: 'Perfect for consultants, coaches, and service-based businesses. Includes testimonials and booking CTA.',
    category: 'service',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=400',
    thumbnail: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=200&h=150',
    tags: ['service', 'professional', 'consultation'],
    isPopular: false,
    order: 5,
    theme: {
      primaryColor: '#8b5cf6',
      secondaryColor: '#0f172a',
      fontFamily: 'Inter',
    },
    sections: [
      {
        id: 'hero-svc',
        type: 'hero',
        order: 1,
        visible: true,
        variant: 'fancy',
        props: {
          headline: 'Transform Your Business',
          subheadline: 'Expert consulting and coaching for sustainable growth',
          ctaText: 'Book a Consultation',
        },
      },
      {
        id: 'about-svc',
        type: 'about',
        order: 2,
        visible: true,
        variant: 'minimal',
        props: {
          title: 'Expert Guidance',
          description: 'With proven methodologies and industry experience, we help businesses reach their full potential.',
        },
      },
      {
        id: 'services-svc',
        type: 'services',
        order: 3,
        visible: true,
        variant: 'stacked',
        props: {
          title: 'Services',
          items: [
            { title: 'Strategy Consulting', description: 'Develop a winning business strategy' },
            { title: 'Executive Coaching', description: 'Personalized leadership development' },
            { title: 'Team Training', description: 'Build high-performing teams' },
          ],
        },
      },
      {
        id: 'cta-svc',
        type: 'cta',
        order: 4,
        visible: true,
        variant: 'split',
        props: {
          headline: 'Ready to Unlock Your Potential?',
          buttonText: 'Schedule Your Call',
        },
      },
    ],
  },
];

const normalizedTemplates = templates.map((template) => ({
  ...template,
  theme: normalizeDesignTheme(template.theme),
}));

const main = async () => {
  await connectDB();

  try {
    // Clear existing templates
    await Template.deleteMany({});
    console.log('Cleared existing templates');

    // Insert new templates
    const inserted = await Template.insertMany(normalizedTemplates);
    console.log(`✓ Seeded ${inserted.length} templates`);

    inserted.forEach(t => {
      console.log(`  - ${t.name} (${t.slug})`);
    });
  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    mongoose.disconnect();
  }
};

main();
