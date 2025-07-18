// Admin operations

import { triggerDailyRecommendations as triggerRecommendations } from "../services/schedulerService.js";
import logger from "../utils/logger.js";
import User from "../models/User.js";

// Manually trigger daily recommendations (admin only)
export const triggerDailyRecommendations = async (req, res) => {
  try {
    logger.info("Admin triggered daily recommendation generation");
    await triggerRecommendations();
    res.json({
      message: "Daily recommendations generation triggered successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    logger.error(`Error triggering daily recommendations: ${error.message}`);
    res.status(500).json({
      error: "Failed to trigger daily recommendations",
      details: error.message,
    });
  }
};

// Get scheduler status
export const getSchedulerStatus = async (req, res) => {
  try {
    res.json({
      message: "Daily recommendation scheduler is running",
      schedule: "Every day at 6:00 AM (IST)",
      cleanupSchedule: "Every Sunday at 2:00 AM (IST)",
      lastRun: new Date().toISOString(),
      status: "active",
    });
  } catch (error) {
    logger.error(`Error getting scheduler status: ${error.message}`);
    res.status(500).json({ error: "Failed to get scheduler status" });
  }
};

// Admin: Search users by query (name, email, etc.)
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query || query.trim() === "") {
      return res.status(400).json({ error: "Search query is required" });
    }
    // Build a case-insensitive regex for partial match
    const regex = new RegExp(query, "i");
    // Search by firstName, lastName, email, phone, city, etc.
    const users = await User.find({
      $or: [
        { firstName: regex },
        { lastName: regex },
        { email: regex },
        { phone: regex },
        { city: regex },
        { state: regex },
        { country: regex },
      ],
    }).select("-password -verificationDocuments");
    res.json({ count: users.length, users });
  } catch (error) {
    logger.error(`Admin user search error: ${error.message}`);
    res.status(500).json({ error: "Failed to search users" });
  }
};
