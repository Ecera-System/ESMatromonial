import express from 'express';
import {
  subscribe,
  unsubscribe,
  sendNewsletter
} from '../controllers/newsletterController.js';

const router = express.Router();

router.post('/subscribe', subscribe);
router.get('/unsubscribe/:email', unsubscribe);
router.post('/send', sendNewsletter); // Protect this in production

export default router;
