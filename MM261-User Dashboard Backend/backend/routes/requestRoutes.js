import express from 'express';
import {
  getUserRequests,
  sendRequest,
  acceptRequest,
  rejectRequest
} from '../controllers/requestController.js';

const router = express.Router();
router.get('/', getUserRequests);
router.post('/send', sendRequest);
router.post('/accept', acceptRequest);
router.post('/reject', rejectRequest);
export default router;
