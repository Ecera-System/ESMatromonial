import Notification from '../models/Notification.js';
import { getIO } from '../utils/socket.js';

export const createNotification = async (notificationData) => {
  try {
    const notification = new Notification(notificationData);
    await notification.save();

    // Push notification to the user via WebSocket
    const io = getIO();
    io.to(notificationData.user.toString()).emit('new-notification', notification);

    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    // Handle error appropriately
  }
};
