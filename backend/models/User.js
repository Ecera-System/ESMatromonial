// User schema

import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: ["Male", "Female", "Other"] },
    height: { type: String },
    weight: { type: String },
    maritalStatus: { type: String },
    religion: { type: String },
    caste: { type: String },
    motherTongue: { type: String },
    manglik: { type: String },
    bodyType: { type: String },
    complexion: { type: String },
    physicalStatus: { type: String },

    // Contact & Location
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    residentialStatus: { type: String },

    // Professional
    education: { type: String },
    educationDetails: { type: String },
    occupation: { type: String },
    occupationDetails: { type: String },
    annualIncome: { type: String },
    workLocation: { type: String },

    // Family
    familyType: { type: String },
    familyStatus: { type: String },
    familyValues: { type: String },
    fatherOccupation: { type: String },
    motherOccupation: { type: String },
    siblings: { type: String },
    familyLocation: { type: String },

    // Lifestyle
    diet: { type: String },
    smoking: { type: String },
    drinking: { type: String },
    hobbies: { type: String },
    interests: { type: String },

    // About
    aboutMe: { type: String },

    // Partner Preferences
    partnerAgeMin: { type: String },
    partnerAgeMax: { type: String },
    partnerHeightMin: { type: String },
    partnerHeightMax: { type: String },
    partnerEducation: { type: String },
    partnerOccupation: { type: String },
    partnerIncome: { type: String },
    partnerLocation: { type: String },
    partnerReligion: { type: String },
    partnerCaste: { type: String },
    partnerMaritalStatus: { type: String },
    partnerAbout: { type: String },

    // Photos
    photos: [{ type: String }],

    // Auth & System
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationDocuments: [{ type: String }],
    subscription: {
      planId: { type: mongoose.Schema.Types.ObjectId, ref: "Plan" },
      startDate: { type: Date },
      endDate: { type: Date },
      isActive: { type: Boolean, default: false },
    },
    lastActive: { type: Date },
    accountStatus: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    avatar: {
    type: String,
    default: ''
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastSeen: {
    type: Date,
    default: Date.now
  }
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt fields
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    if (this.password.startsWith('$2b$')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
    next();
  } catch (error) {
    console.error("Password hashing error:", error);
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    const result = await bcrypt.compare(candidatePassword, this.password);
    return result;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Virtual field for full name
userSchema.virtual('name').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", userSchema);

export default User;
