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
