import express from 'express';
import { authenticate } from '../middleware/auth.js';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  clearAllNotifications,
} from '../controllers/notificationController.js';

const router = express.Router();

// Get all notifications for the logged-in user
router.get('/', authenticate, getNotifications);

// Mark a notification as read
router.patch('/:id/read', authenticate, markAsRead);

// Mark all notifications as read
router.patch('/read-all', authenticate, markAllAsRead);

// Clear all notifications
router.delete('/clear-all', authenticate, clearAllNotifications);

export default router; 