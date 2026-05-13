import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import { generateWebsite, regenerateSection, regenerateImage } from '../controllers/ai.controller.js';
import { chatWithAI } from '../controllers/chat.controller.js';

const router = Router();

router.post('/generate-website', authMiddleware, generateWebsite);
router.post('/regenerate-section', authMiddleware, regenerateSection);
router.post('/generate-image', authMiddleware, regenerateImage);
router.post('/chat', authMiddleware, chatWithAI);

export default router;