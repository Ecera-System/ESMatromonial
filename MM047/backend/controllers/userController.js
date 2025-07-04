import {
  getAllUsersService,
  getUserByIdService,
  updateUserService,
  deleteUserService,
} from "../services/userService.js";
import logger from "../utils/logger.js";

// Get all users (with filters)
export const getAllUsers = async (req, res) => {
  try {
    const users = await getAllUsersService();
    logger.info("Fetched all users");
    res.json(users);
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    res.status(500).json({ error: "Server error" });
  }
};

// Get single user profile
export const getUserById = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) {
      logger.warn(`User not found: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
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
  logger.info(`Photo upload requested for user: ${req.user?.id || "unknown"}`);
  res.json({ message: "Photo uploaded (stub)" });
};

// Upload verification documents (stub)
export const uploadDocuments = async (req, res) => {
  logger.info(
    `Document upload requested for user: ${req.user?.id || "unknown"}`
  );
  res.json({ message: "Documents uploaded (stub)" });
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
  logger.info("User search requested with filters", req.body);
  res.json([]);
};

// Calculate profile completion percentage
export const getProfileCompletion = async (req, res) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) {
      logger.warn(`User not found for profile completion: ${req.params.id}`);
      return res.status(404).json({ error: "User not found" });
    }

    // List all relevant fields for completion
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
    fields.forEach((field) => {
      if (Array.isArray(user[field])) {
        if (user[field] && user[field].length > 0) filled++;
      } else if (
        user[field] !== undefined &&
        user[field] !== null &&
        user[field] !== ""
      ) {
        filled++;
      }
    });

    // Add isVerified as a required field for 100%
    const totalFields = fields.length + 1;
    if (user.isVerified) filled++;
    // else do not increment, so 100% is only possible if verified

    const percentage = Math.round((filled / totalFields) * 100);

    logger.info(`Profile completion for user ${req.params.id}: ${percentage}%`);
    res.json({ completion: percentage });
  } catch (err) {
    logger.error(
      `Error calculating profile completion for ${req.params.id}: ${err.message}`
    );
    res.status(500).json({ error: "Server error" });
  }
};
