import User from "../models/User.js";
import { registerUser, loginUser } from "../services/authService.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";
const JWT_EXPIRES_IN = "7d";

// Register new user
export const register = async (req, res) => {
  try {
    const { userData, token } = await registerUser(req.body);
    logger.info(`User registered: ${req.body.email}`);
    res
      .status(201)
      .json({ message: "User registered successfully", user: userData, token });
  } catch (err) {
    logger.error(`Registration failed for ${req.body.email}: ${err.message}`);
    res.status(400).json({ error: err.message || "Server error" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { token, user } = await loginUser(req.body);
    logger.info(`User login: ${req.body.email}`);
    res.json({ token, user: { ...user.toObject(), password: undefined } });
  } catch (err) {
    logger.warn(`Login failed for ${req.body.email}: ${err.message}`);
    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
};

// Get current user profile (requires auth middleware)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user.id,
      "-password -verificationDocuments"
    );
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Logout (stateless JWT, just a stub)
export const logout = (req, res) => {
  res.json({ message: "Logged out (client should delete token)" });
};
// Authentication logic
