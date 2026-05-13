import { Router } from 'express';
import {
  registerUser,
  loginUser,
  getCurrentUser,
} from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', authMiddleware, getCurrentUser);

export default router;