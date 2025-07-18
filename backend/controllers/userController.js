import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/userService.js";
import { getDailyRecommendations } from "../services/matchService.js";
import { getTodayRecommendation } from "../services/schedulerService.js";
import User from "../models/User.js";
import logger from "../utils/logger.js";
import { createNotification } from "../services/notificationService.js";
import mongoose from "mongoose";

// Get all users (with filters)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, "-password -verificationDocuments");
    res.json({ users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

// Get single user profile
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password").populate("subscription.plan").populate("privacy").populate("notificationSettings");
    if (!user) {
      logger.warn(`User not found: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    // Increment profileViews if the requester is not the owner
    if (
      req.user &&
      req.user._id &&
      req.user._id.toString() !== user._id.toString()
    ) {
      await User.findByIdAndUpdate(user._id, { $inc: { profileViews: 1 } });
      user.profileViews = user.profileViews + 1;
    }
    logger.info(`Fetched user: ${req.params.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error fetching user ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Update user profile
export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);
    if (!user) {
      logger.warn(`User not found for update: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`Updated user: ${req.params.id}`);
    res.json(user);
  } catch (err) {
    logger.error(`Error updating user ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};
export const updateIsNewUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findByIdAndUpdate(
      userId,
      { isNewUser: false },
      { new: true }
    );
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "isNewUser status updated successfully" });
  } catch (err) {
    logger.error(`Error updating isNewUser status: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  try {
    const user = await deleteUserService(req.params.id);
    if (!user) {
      logger.warn(`User not found for deletion: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }
    logger.info(`Deleted user: ${req.params.id}`);
    res.json({ message: "User deleted" });
  } catch (err) {
    logger.error(`Error deleting user ${req.params.id}: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Upload profile photo (stub)
export const uploadPhoto = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ error: "No photo uploaded" });
    }
    const userId = req.user._id;
    const photoUrl = req.file.path;
    // Add photo URL to user's photos array
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { photos: photoUrl } },
      { new: true }
    );
    res.json({ message: "Photo uploaded", photoUrl, photos: user.photos });
  } catch (err) {
    res.status(500).json({ error: "Photo upload failed" });
  }
};

// Upload verification documents (stub)
export const uploadDocuments = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No documents uploaded" });
    }
    const userId = req.user._id;
    const docUrls = req.files.map((f) => f.path);
    // Add document URLs to user's verificationDocuments array (create if not exists)
    const user = await User.findByIdAndUpdate(
      userId,
      { $push: { verificationDocuments: { $each: docUrls } } },
      { new: true }
    );
    res.json({
      message: "Documents uploaded",
      docUrls,
      verificationDocuments: user.verificationDocuments,
    });
  } catch (err) {
    res.status(500).json({ error: "Document upload failed" });
  }
};

// Get match suggestions (stub)
export const getSuggestions = async (req, res) => {
  logger.info(
    `Match suggestions requested for user: ${req.user?.id || "unknown"}`
  );
  res.json([]);
};

// Search users with filters (stub)
export const searchUsers = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Authentication required for search." });
    }
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ message: "Search query 'q' is required." });
    }

    const searchRegex = new RegExp(q, "i"); // Case-insensitive search

    const users = await User.find(
      {
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { city: searchRegex },
          { state: searchRegex },
          { occupation: searchRegex },
          { education: searchRegex },
          { interests: searchRegex },
        ],
      },
      "firstName lastName city state occupation education photos"
    ) // Select relevant fields
      .limit(20); // Limit results for suggestions

    logger.info(`User search for '${q}' returned ${users.length} results.`);
    res.json(users);
  } catch (err) {
    logger.error(
      `Error during user search for '${req.query.q}': ${err.message}`
    );
    res.status(500).json({ error: "Server error during search" });
  }
};

// Calculate profile completion percentage
export const getProfileCompletion = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      logger.warn(`User not found for profile completion: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }

    const fields = [
      "firstName",
      "lastName",
      "dateOfBirth",
      "gender",
      "height",
      "weight",
      "maritalStatus",
      "religion",
      "caste",
      "motherTongue",
      "manglik",
      "bodyType",
      "complexion",
      "physicalStatus",
      "email",
      "phone",
      "country",
      "state",
      "city",
      "residentialStatus",
      "education",
      "educationDetails",
      "occupation",
      "occupationDetails",
      "annualIncome",
      "workLocation",
      "familyType",
      "familyStatus",
      "familyValues",
      "fatherOccupation",
      "motherOccupation",
      "siblings",
      "familyLocation",
      "diet",
      "smoking",
      "drinking",
      "hobbies",
      "interests",
      "aboutMe",
      "partnerAgeMin",
      "partnerAgeMax",
      "partnerHeightMin",
      "partnerHeightMax",
      "partnerEducation",
      "partnerOccupation",
      "partnerIncome",
      "partnerLocation",
      "partnerReligion",
      "partnerCaste",
      "partnerMaritalStatus",
      "partnerAbout",
      "photos",
    ];

    let filled = 0;
    let missingFields = [];

    fields.forEach((field) => {
      if (Array.isArray(user[field])) {
        if (user[field] && user[field].length > 0) {
          filled++;
        } else {
          missingFields.push(field);
        }
      } else if (
        user[field] !== undefined &&
        user[field] !== null &&
        user[field] !== ""
      ) {
        filled++;
      } else {
        missingFields.push(field);
      }
    });

    // Add isVerified as a required field for 100%
    const totalFields = fields.length + 1;
    if (user.isVerified) {
      filled++;
    } else {
      missingFields.push("isVerified");
    }

    const percentage = Math.round((filled / totalFields) * 100);

    logger.info(
      `Profile completion for user ${
        req.params.id
      }: ${percentage}%, missing: ${missingFields.join(", ")}`
    );
    res.json({ completion: percentage, missingFields });
  } catch (err) {
    logger.error(
      `Error calculating profile completion for ${req.params.id}: ${err.message}`
    );
    res.status(500).json({ error: "Server error" });
  }
};

// Get daily recommendation
const publicUserFields =
  "firstName lastName photos dateOfBirth occupation city country height weight maritalStatus religion caste motherTongue manglik bodyType complexion physicalStatus email phone state residentialStatus education educationDetails annualIncome workLocation familyType familyStatus familyValues fatherOccupation motherOccupation siblings familyLocation diet smoking drinking hobbies interests aboutMe partnerAgeMin partnerAgeMax partnerHeightMin partnerHeightMax partnerEducation partnerOccupation partnerIncome partnerLocation partnerReligion partnerCaste partnerMaritalStatus partnerAbout lastActive";

// Get daily recommendation
export const getDailyRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    logger.info(`Fetching daily recommendation for user: ${userId}`);

    // First try to get today's pre-generated recommendation
    let todayRecommendation = await getTodayRecommendation(userId);

    if (todayRecommendation) {
      // Populate the recommendedUserId to get user details including avatar
      await todayRecommendation.populate("recommendedUserId", publicUserFields);
      logger.info(
        `Successfully retrieved pre-generated recommendation for user ${userId}`
      );
      // Mark as viewed
      await todayRecommendation.updateOne({ isViewed: true });
      return res.json({
        recommendation: todayRecommendation,
        matchPercentage: todayRecommendation.matchPercentage,
        isOnDemand: false,
        recommendationId: todayRecommendation._id,
      });
    }

    logger.info(
      `No pre-generated recommendation found for user ${userId}, generating on-demand`
    );

    // Fallback to on-demand generation
    const recommendations = await getDailyRecommendations(userId, 1);

    if (!recommendations.length) {
      logger.warn(`No recommendations found for user: ${userId}`);
      return res.status(404).json({
        message:
          "No new recommendations found based on your current preferences.",
        suggestions: [
          "Try adjusting your partner preferences to broaden your search.",
          "Complete your profile to unlock more potential matches.",
          "Consider resetting your skipped users list to see them again (if you wish).",
          "Check back later, new users are joining all the time!",
        ],
      });
    }

    // Return the on-demand recommendation
    logger.info(
      `Successfully generated on-demand recommendation for user ${userId}`
    );

    // Manually select public fields for the on-demand recommendation
    const recommendedUser = recommendations[0];
    const filteredRecommendedUser = {};
    publicUserFields.split(" ").forEach((field) => {
      if (recommendedUser[field] !== undefined) {
        filteredRecommendedUser[field] = recommendedUser[field];
      }
    });
    filteredRecommendedUser._id = recommendedUser._id; // Ensure _id is always included

    const onDemandRecommendation = {
      recommendedUserId: filteredRecommendedUser,
      matchScore: recommendedUser.matchScore,
      matchPercentage: calculateMatchPercentage(recommendedUser.matchScore),
      isOnDemand: true,
    };
    return res.json({
      recommendation: onDemandRecommendation,
      matchPercentage: onDemandRecommendation.matchPercentage,
      isOnDemand: true,
    });
  } catch (err) {
    logger.error(
      `Recommendation error for user ${req.user._id}: ${err.message}`
    );
    res.status(500).json({
      error: "Failed to generate recommendations",
      details: err.message,
    });
  }
};

// Skip recommendation
export const skipRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { skippedUserId, recommendationId } = req.body;

    // Add to skipped users list
    await User.findByIdAndUpdate(userId, {
      $addToSet: { skippedUsers: skippedUserId },
    });

    // If we have a recommendationId, mark it as skipped
    if (recommendationId) {
      const DailyRecommendation = (
        await import("../models/DailyRecommendation.js")
      ).default;
      await DailyRecommendation.findByIdAndUpdate(recommendationId, {
        isSkipped: true,
      });
    }

    res.json({ message: "User skipped successfully" });
  } catch (err) {
    logger.error(`Error skipping user: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Like recommendation
export const likeRecommendation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { recommendedUserId, recommendationId } = req.body;

    // If we have a recommendationId, mark it as liked
    if (recommendationId) {
      const DailyRecommendation = (
        await import("../models/DailyRecommendation.js")
      ).default;
      await DailyRecommendation.findByIdAndUpdate(recommendationId, {
        isLiked: true,
      });
    }

    // Here you could add logic to send a connection request
    // Create a notification for the recommended user
    const likingUser = await User.findById(userId);
    if (likingUser) {
      await createNotification({
        user: recommendedUserId,
        type: "new_interest",
        title: "New Interest!",
        message: `${likingUser.firstName} has shown interest in your profile!`, // Use liking user's name
        link: `/profile/${userId}`, // Link to the liking user's profile
      });
      logger.info(
        `Notification created for ${recommendedUserId} about interest from ${userId}`
      );
    }

    logger.info(`User ${userId} liked recommendation ${recommendedUserId}`);
    res.json({ message: "Recommendation liked successfully" });
  } catch (err) {
    logger.error(`Error liking recommendation: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Helper function
const calculateMatchPercentage = (score) => {
  const maxPossibleScore = 10; // Adjust based on your scoring system
  return Math.min(100, Math.round((score / maxPossibleScore) * 100));
};

// Update privacy settings
export const updatePrivacySettings = async (req, res) => {
  try {
    const { profileVisibility, contactVisibility, dataUsage, marketingCommunications } = req.body;
    const userId = req.user.id;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        "privacy.profileVisibility": profileVisibility,
        "privacy.contactVisibility": contactVisibility,
        "privacy.dataUsage": dataUsage,
        "privacy.marketingCommunications": marketingCommunications,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Privacy settings updated for user: ${user.email}`);
    res.json({ message: "Privacy settings updated successfully", privacy: user.privacy });
  } catch (err) {
    logger.error(`Privacy settings update error: ${err.message}`);
    res.status(500).json({ error: "Failed to update privacy settings" });
  }
};

// Delete account
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    logger.info(`Account deleted for user: ${user.email}`);
    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    logger.error(`Account deletion error: ${err.message}`);
    res.status(500).json({ error: "Failed to delete account" });
  }
};
