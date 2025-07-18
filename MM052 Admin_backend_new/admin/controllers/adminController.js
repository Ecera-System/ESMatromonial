// Admin operations

import { triggerDailyRecommendations as triggerRecommendations } from "../../services/schedulerService.js";
import logger from "../../utils/logger.js";
import User from "../../models/User.js";
import Report from "../../models/Report.js";
import Feedback from "../../models/Feedback.js";

export const getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalMale = await User.countDocuments({ gender: "male" });
    
    const totalFemale = await User.countDocuments({ gender: "female" });
    
    const totalPremium = await User.countDocuments({ isPremium: true });

    res.json({ totalUsers ,totalMale, totalFemale, totalPremium });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user stats" });
  }
};

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

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedUser", "username email")
      .populate("reporter", "username email");
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

export const enableUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isDisabledByAdmin: false,
        adminNotes: ""
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account enabled", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to enable user" });
  }
};


export const disableUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { note } = req.body;  // Admin can include a reason

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        isDisabledByAdmin: true,
        adminNotes: note || "Disabled by admin"
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User account disabled", user: updatedUser });
  } catch (err) {
    res.status(500).json({ error: "Failed to disable user" });
  }
};

export const getDisabledUsers = async (req, res) => {
  try {
    const disabledUsers = await User.find({ isDisabledByAdmin: true }).select("-password");
    res.json(disabledUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch disabled users" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user" });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const newReports = await Report.find({ reviewed: false })
      .populate("reportedUser", "username email");
    res.json(newReports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
};

export const markReportReviewed = async (req, res) => {
  try {
    const { reportId } = req.params;
    await Report.findByIdAndUpdate(reportId, { reviewed: true });
    res.json({ message: "Report marked as reviewed" });
  } catch (err) {
    res.status(500).json({ error: "Failed to update report" });
  }
};

export const getFeedbackAnalytics = async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    const totalRatings = feedbacks.reduce((sum, f) => sum + f.rating, 0);
    const averageRating = feedbacks.length > 0 ? (totalRatings / feedbacks.length) : 0;

    res.json({ averageRating, totalFeedbacks: feedbacks.length, feedbacks });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback analytics" });
  }
};

export const getInactiveUsers = async (req, res) => {
  try {
    const months = parseInt(req.query.months) || 6;
    const thresholdDate = new Date();
    thresholdDate.setMonth(thresholdDate.getMonth() - months);

    const inactiveUsers = await User.find({
      lastActive: { $lt: thresholdDate },
      isDisabled: false
    }).select("-password");

    res.json(inactiveUsers);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inactive users" });
  }
};
