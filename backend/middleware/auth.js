import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Admin from "../models/Admin.js";
import logger from "../utils/logger.js";

// Ensure consistent JWT secret
const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log("Auth Header:", authHeader);
    console.log("Extracted Token:", token ? "Token exists" : "No token");
    console.log("JWT_SECRET being used:", JWT_SECRET);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "Access token required" });
    }

    // Use the same JWT_SECRET that was used for signing
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded token:", decoded);
    
    // Check if it's an admin token
    if (decoded.admin) {
      const admin = await Admin.findById(decoded.id).select("-password");
      if (!admin) {
        console.log("Admin not found for ID:", decoded.id);
        return res.status(401).json({ message: "Invalid admin token" });
      }
      req.admin = admin;
      req.user = admin;
      req.isAdmin = true;
      console.log("Admin authenticated:", admin.email);
    } else {
      // Regular user token - use userId from JWT payload
      const userId = decoded.userId || decoded.id;
      console.log("Looking for user with ID:", userId);
      
      const user = await User.findById(userId).select("-password");
      if (!user) {
        console.log("User not found for ID:", userId);
        return res.status(401).json({ message: "Invalid user token" });
      }
      req.user = user;
      req.isAdmin = false;
      console.log("User authenticated:", user.email);
    }

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    logger.error("Auth middleware error:", error);
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }
    return res.status(500).json({ message: "Server error" });
  }
};

// Add authenticate function for chat routes compatibility
export const authenticate = authenticateToken;

// Middleware to allow only admins
export const requireAdmin = (req, res, next) => {
  console.log("RequireAdmin - isAdmin:", req.isAdmin, "admin exists:", !!req.admin);
  if (!req.isAdmin || !req.admin) {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

// Middleware to allow only users
export const requireUser = (req, res, next) => {
  console.log("RequireUser - isAdmin:", req.isAdmin, "user exists:", !!req.user);
  if (req.isAdmin) {
    return res.status(403).json({ error: "User access required" });
  }
  if (!req.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

export const authenticateSocket = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return next(new Error('Authentication error'));
    }

    socket.userId = user._id.toString();
    socket.user = user;
    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
};