import Notification from '../models/Notification.js';
import logger from '../utils/logger.js';

export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.status(200).json(notifications);
  } catch (error) {
    logger.error(`Error fetching notifications for user ${req.user._id}: ${error.message}`);
    res.status(500).json({ message: 'Server error while fetching notifications' });
  }
};

export const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, user: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    res.status(200).json(notification);
  } catch (error) {
    logger.error(`Error marking notification ${req.params.id} as read for user ${req.user._id}: ${error.message}`);
    res.status(500).json({ message: 'Server error while marking notification as read' });
  }
};

export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user._id, isRead: false },
      { isRead: true }
    );
    res.status(200).json({ message: 'All notifications marked as read' });
  } catch (error) {
    logger.error(`Error marking all notifications as read for user ${req.user._id}: ${error.message}`);
    res.status(500).json({ message: 'Server error while marking all notifications as read' });
  }
};

export const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({ user: req.user._id });
    res.status(200).json({ message: 'All notifications cleared' });
  } catch (error) {
    logger.error(`Error clearing all notifications for user ${req.user._id}: ${error.message}`);
    res.status(500).json({ message: 'Server error while clearing notifications' });
  }
};

export const updateNotificationSettings = async (req, res) => {
  try {
    const { emailNotifications, pushNotifications } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        "notificationSettings.email": emailNotifications,
        "notificationSettings.push": pushNotifications,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Notification settings updated for user: ${user.email}`);
    res.json({ message: "Notification settings updated successfully", notificationSettings: user.notificationSettings });
  } catch (err) {
    logger.error(`Notification settings update error: ${err.message}`);
    res.status(500).json({ error: "Failed to update notification settings" });
  }
};