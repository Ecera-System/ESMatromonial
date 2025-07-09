import User from "../models/User.js";
import { registerUser, loginUser, fixUserPassword } from "../services/authService.js";
import logger from "../utils/logger.js";

const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";
const JWT_EXPIRES_IN = "7d";

// Register new user
export const register = async (req, res) => {
  try {
    console.log("Registration request received:", req.body);

    const { userData, token } = await registerUser(req.body);

    logger.info(`User registered: ${req.body.email}`);

    res.status(201).json({
      message: "User registered successfully",
      user: userData,
      userData: userData, // Include both for compatibility
      token,
    });
  } catch (err) {
    console.error("Registration controller error:", err);
    logger.error(`Registration failed for ${req.body.email}: ${err.message}`);

    res.status(400).json({
      error: err.message || "Registration failed",
      message: err.message || "Registration failed", // Include both for compatibility
    });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    console.log("Login request received:", {
      email: req.body.email,
      passwordLength: req.body.password?.length,
    });

    const { token, user } = await loginUser(req.body);

    console.log("Login successful for:", req.body.email);
    logger.info(`User login: ${req.body.email}`);

    // Fix: user is already a plain object from loginUser service
    res.json({ token, user });
  } catch (err) {
    console.error("Login controller error:", err);
    logger.warn(`Login failed for ${req.body.email}: ${err.message}`);

    res.status(401).json({ error: err.message || "Invalid credentials" });
  }
};

// Get current user profile (requires auth middleware)
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(
      req.user._id, // Use _id instead of id
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

// Temporary debug endpoint to check user password status
export const debugUser = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const debugInfo = {
      email: user.email,
      passwordHash: user.password,
      hashLength: user.password.length,
      isProperlyHashed: user.password.startsWith("$2b$"),
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
    };

    res.json(debugInfo);
  } catch (error) {
    console.error("Debug user error:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// Temporary endpoint to fix a user's password
export const fixPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ error: "Email and newPassword required" });
    }

    await fixUserPassword(email, newPassword);
    res.json({ message: "Password fixed successfully" });
  } catch (error) {
    console.error("Fix password error:", error);
    res.status(500).json({ error: error.message });
  }
};
// Authentication logic
