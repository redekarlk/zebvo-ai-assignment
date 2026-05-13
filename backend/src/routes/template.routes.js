import express from 'express';
import {
  getAllTemplates,
  getTemplateById,
  getTemplateBySlug,
} from '../controllers/template.controller.js';

const router = express.Router();

// Get all templates (public endpoint, no auth required)
router.get('/', getAllTemplates);

// Get template by ID
router.get('/:id', getTemplateById);

// Get template by slug (e.g., /templates/modern-agency)
router.get('/slug/:slug', getTemplateBySlug);

export default router;
