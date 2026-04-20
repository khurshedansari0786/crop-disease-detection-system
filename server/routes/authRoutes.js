import express from 'express';
import { registerUser, loginUser, adminLogin, logout, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);
router.post('/admin-login', authLimiter, adminLogin);
router.get('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

export default router;