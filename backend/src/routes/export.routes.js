import express from 'express';
import { exportHTML, exportJSON, exportZIP, exportPreviewHTML } from '../controllers/export.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// All export routes require authentication and ownership verification
router.use(authMiddleware);

router.get('/:projectId/html', exportHTML);
router.get('/:projectId/json', exportJSON);
router.get('/:projectId/zip', exportZIP);
router.post('/preview/html', exportPreviewHTML);

export default router;
