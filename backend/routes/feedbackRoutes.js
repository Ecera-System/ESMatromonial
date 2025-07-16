import express from 'express';
import {
  getAllFeedback,
  createFeedback,
  toggleFeature
} from '../controllers/feedbackController.js';

const router = express.Router();

router.get('/', getAllFeedback);
router.post('/', createFeedback);
router.patch('/:id/feature', toggleFeature);

export default router;
