import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { handleImageUpload } from '../middleware/uploadMiddleware.js';
import { 
  predictDiseasePublic, 
  getDetectionHistory, 
  getDashboardStats,
  getDetectionById 
} from '../controllers/detectionController.js';

const router = express.Router();

// ✅ PUBLIC - NO protect middleware
router.post('/predict', handleImageUpload, predictDiseasePublic);

// ✅ PROTECTED - These need login
router.get('/history', protect, getDetectionHistory);
router.get('/dashboard', protect, getDashboardStats);
router.get('/:id', protect, getDetectionById);

export default router;