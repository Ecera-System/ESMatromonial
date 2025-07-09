import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Use the same JWT secret as middleware
const JWT_SECRET = process.env.JWT_SECRET || "yoursecret";
const JWT_EXPIRES_IN = "7d";

console.log("Auth Service JWT_SECRET:", JWT_SECRET); // Debug log

// ========================
// Register
// ========================
export const registerUser = async ({
  email,
  password,
  firstName,
  lastName,
  phone,
  terms,
  ...rest
}) => {
  try {
    if (!email || !password || !firstName || !lastName || !phone) {
      throw new Error("Required fields missing");
    }
    if (!terms) {
      throw new Error("You must accept the terms and conditions");
    }

    const existing = await User.findOne({ email });
    if (existing) throw new Error("Email already registered");

    const user = new User({
      email,
      password,
      firstName,
      lastName,
      phone,
      ...rest,
    });

    const userData = await user.save();
    
    console.log("Creating token with secret:", JWT_SECRET); // Debug log
    
    const token = jwt.sign(
      {
        userId: userData._id,
        email: userData.email,
        name: `${userData.firstName} ${userData.lastName}`,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log("Token created successfully"); // Debug log

    return {
      userData: { ...userData.toObject(), password: undefined },
      token,
    };
  } catch (error) {
    console.error("Registration service error:", error);
    throw error;
  }
};

// ========================
// Login
// ========================
export const loginUser = async ({ email, password }) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.password.startsWith("$2b$")) {
      throw new Error("Account needs to be reset. Please contact support or re-register.");
    }

    const match = await user.comparePassword(password);
    if (!match) {
      const directMatch = await bcrypt.compare(password, user.password);
      if (!directMatch) {
        throw new Error("Invalid credentials");
      }
    }

    console.log("Creating login token with secret:", JWT_SECRET); // Debug log

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    console.log("Login token created successfully"); // Debug log

    return { token, user: { ...user.toObject(), password: undefined } };
  } catch (error) {
    console.error("Login service error:", error);
    throw error;
  }
};

// ========================
// Fix Password Utility
// ========================
export const fixUserPassword = async (email, newPassword) => {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    user.password = newPassword;
    await user.save();

    console.log("Password fixed for user:", email);
    return true;
  } catch (error) {
    console.error("Error fixing password:", error);
    throw error;
  }
};
