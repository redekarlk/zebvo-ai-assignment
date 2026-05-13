import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { JWT } from 'google-auth-library';
import vertexAI from '../config/gemini.js';

const GOOGLE_CLOUD_PROJECT_ID = process.env.GOOGLE_CLOUD_PROJECT_ID;
const GOOGLE_CLOUD_LOCATION = process.env.GOOGLE_CLOUD_LOCATION || 'us-central1';
const IMAGE_MODELS = [
  'imagen-4.0-fast-generate-001',
  'imagen-4.0-generate-001',
  'imagen-3.0-fast-generate-001',
  'imagen-3.0-generate-001',
];

// Cache for keywords to avoid redundant AI calls
const keywordCache = new Map();

const createFallbackImageDataUrl = (prompt, imageType = 'general', keywords = []) => {
  // Pure visual placeholder with no text - only gradients, shapes, and glows
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="55%" stop-color="#2563eb" />
          <stop offset="100%" stop-color="#0f172a" />
        </linearGradient>
        <radialGradient id="glow1" cx="40%" cy="30%" r="55%">
          <stop offset="0%" stop-color="#60a5fa" stop-opacity="0.5" />
          <stop offset="100%" stop-color="#60a5fa" stop-opacity="0" />
        </radialGradient>
        <radialGradient id="glow2" cx="70%" cy="70%" r="50%">
          <stop offset="0%" stop-color="#a78bfa" stop-opacity="0.35" />
          <stop offset="100%" stop-color="#a78bfa" stop-opacity="0" />
        </radialGradient>
        <filter id="blur">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" />
        </filter>
      </defs>
      <!-- Base gradient background -->
      <rect width="1280" height="720" fill="url(#bg)" />
      <!-- Glow overlays -->
      <rect width="1280" height="720" fill="url(#glow1)" />
      <rect width="1280" height="720" fill="url(#glow2)" />
      <!-- Abstract geometric shapes -->
      <circle cx="1040" cy="120" r="180" fill="#ffffff" fill-opacity="0.08" filter="url(#blur)" />
      <circle cx="240" cy="620" r="220" fill="#ffffff" fill-opacity="0.06" filter="url(#blur)" />
      <circle cx="640" cy="360" r="120" fill="#60a5fa" fill-opacity="0.1" />
      <!-- Decorative rectangles -->
      <rect x="200" y="150" width="400" height="3" fill="#93c5fd" fill-opacity="0.4" transform="rotate(-15 400 151.5)" />
      <rect x="700" y="500" width="350" height="2" fill="#a78bfa" fill-opacity="0.3" transform="rotate(25 875 501)" />
      <!-- Accent circles for depth -->
      <circle cx="150" cy="200" r="60" fill="none" stroke="#60a5fa" stroke-width="2" stroke-opacity="0.3" />
      <circle cx="1100" cy="600" r="90" fill="none" stroke="#a78bfa" stroke-width="2" stroke-opacity="0.25" />
      <!-- Center focal point - subtle geometric -->
      <path d="M 640 300 L 700 360 L 640 420 L 580 360 Z" fill="none" stroke="#93c5fd" stroke-width="2" stroke-opacity="0.4" />
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};
const getGeminiAPI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return new GoogleGenerativeAI(apiKey);
};

const getAIModel = () => {
  try {
    return vertexAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  } catch (error) {
    const genAI = getGeminiAPI();
    return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }
};

const generateKeyword = async (context, imageType = 'general') => {
  const contextStr = typeof context === 'string' ? context : JSON.stringify(context);
  const cacheKey = `${imageType}:${contextStr}`;
  
  if (keywordCache.has(cacheKey)) return keywordCache.get(cacheKey);
  
  try {
    const model = getAIModel();
    const typeGuide = {
      hero: 'representing the core business essence',
      about: 'representing professional teamwork',
      service: 'representing the specific service',
      cta: 'representing growth and action'
    };
    
    const prompt = `Based on: "${contextStr}", for a ${typeGuide[imageType] || 'business visual'}, output 3 specific search keywords separated by commas. No filler.`;
    const response = await model.generateContent(prompt);
    
    let text = "";
    if (response.response && response.response.candidates) {
      text = response.response.candidates[0]?.content?.parts[0]?.text;
    } else if (response.candidates) {
      text = response.candidates[0]?.content?.parts[0]?.text;
    }
    
    const keywords = (text || 'business').trim().split(',').map(k => k.trim());
    keywordCache.set(cacheKey, keywords);
    return keywords;
  } catch (error) {
    return ['business', 'professional'];
  }
};

const generateImageWithAI = async (prompt) => {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  
  if (!GOOGLE_CLOUD_PROJECT_ID || !email || !key) {
    console.warn('[Image Service] Missing Vertex AI credentials - falling back to SVG');
    return null;
  }

  try {
    const jwtClient = new JWT({
      email,
      key: key.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/cloud-platform'],
    });

    const { access_token: accessToken } = await jwtClient.authorize();

    for (const modelName of IMAGE_MODELS) {
      const endpoint = `https://${GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com/v1/projects/${GOOGLE_CLOUD_PROJECT_ID}/locations/${GOOGLE_CLOUD_LOCATION}/publishers/google/models/${modelName}:predict`;

      try {
        console.log(`[Image Service] Requesting Vertex AI image generation with ${modelName}...`);
        const response = await axios.post(
          endpoint,
          { instances: [{ prompt }], parameters: { sampleCount: 1, aspectRatio: '1:1', enhancePrompt: false } },
          {
            headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
            timeout: 30000,
          }
        );

        const prediction = response.data?.predictions?.[0];
        if (prediction?.bytesBase64Encoded) {
          console.log(`[Image Service] ✓ Vertex AI image generated successfully with ${modelName}`);
          return `data:${prediction.mimeType || 'image/png'};base64,${prediction.bytesBase64Encoded}`;
        }

        console.warn(`[Image Service] No image data returned from ${modelName}`);
      } catch (error) {
        const status = error.response?.status;
        console.error(`[Image Service] Vertex AI ${modelName} failed:`, status || error.message);
        if (status !== 404) {
          continue;
        }
      }
    }

    console.warn('[Image Service] All Vertex AI image models failed - falling back to SVG');
    return null;
  } catch (error) {
    console.error('[Image Service] Vertex AI generation failed:', error.message);
    console.warn('[Image Service] Falling back to SVG placeholder');
    return null;
  }
};

export const generateSingleImage = async (promptBuilder, ...args) => {
  let imageType = 'general';
  try {
    const builderName = promptBuilder.name || '';
    if (builderName.includes('Hero')) imageType = 'hero';
    else if (builderName.includes('About')) imageType = 'about';
    else if (builderName.includes('Service')) imageType = 'service';
    else if (builderName.includes('CTA')) imageType = 'cta';

    const prompt = promptBuilder(...args);
    const keywords = await generateKeyword(args[0], imageType);
    
    console.log(`[Image Service] Generating ${imageType} image...`);
    let imageUrl = await generateImageWithAI(prompt);
    
    if (!imageUrl) {
      console.log(`[Image Service] Using SVG fallback for ${imageType}`);
      imageUrl = createFallbackImageDataUrl(prompt, imageType, keywords);
    } else {
      console.log(`[Image Service] ✓ ${imageType} image generated successfully`);
    }
    
    return {
      prompt,
      url: imageUrl,
      imageType,
      generatedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error(`[Image Service] Error generating image:`, error.message);
    return {
      prompt: 'Fallback',
      url: createFallbackImageDataUrl('Fallback image', imageType, ['business', 'professional']),
      imageType,
      generatedAt: new Date().toISOString()
    };
  }
};

export const generateProjectImages = async (businessInfo, actualServices = [], aiPrompts = {}) => {
  const { buildHeroImagePrompt, buildAboutImagePrompt, buildServiceImagePrompt, buildCTAImagePrompt } = await import('../prompts/image.prompt.js');
  
  const [heroGen, aboutGen, ctaGen] = await Promise.all([
    generateSingleImage(aiPrompts.hero?.prompt ? () => aiPrompts.hero.prompt : buildHeroImagePrompt, businessInfo),
    generateSingleImage(aiPrompts.about?.prompt ? () => aiPrompts.about.prompt : buildAboutImagePrompt, businessInfo),
    generateSingleImage(aiPrompts.cta?.prompt ? () => aiPrompts.cta.prompt : buildCTAImagePrompt, businessInfo),
  ]);

  const serviceImages = await Promise.all(
    (actualServices.length > 0 ? actualServices : (businessInfo.services || [])).map((service, idx) => 
      generateSingleImage(aiPrompts.services?.[idx]?.prompt ? () => aiPrompts.services[idx].prompt : buildServiceImagePrompt, service, businessInfo)
    )
  );

  return { 
    hero: { ...aiPrompts.hero, ...heroGen }, 
    about: { ...aiPrompts.about, ...aboutGen }, 
    services: serviceImages.map((gen, idx) => ({ ...(aiPrompts.services?.[idx] || {}), ...gen })), 
    cta: { ...aiPrompts.cta, ...ctaGen } 
  };
};
