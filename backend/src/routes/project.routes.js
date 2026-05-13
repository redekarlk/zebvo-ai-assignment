import { Router } from 'express';
import authMiddleware from '../middleware/auth.middleware.js';
import {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
  publishProject,
  getProjectBySlug
} from '../controllers/project.controller.js';
import { deployProject } from '../controllers/deployment.controller.js';

const router = Router();

// Public route must be before authMiddleware
router.get('/public/:slug', getProjectBySlug);

router.use(authMiddleware);

router.route('/').post(createProject).get(getProjects);

router
  .route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

router.post('/:id/publish', publishProject);
router.post('/:id/deploy', deployProject);

export default router;