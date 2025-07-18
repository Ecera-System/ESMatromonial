import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phone: String,
  photos: [String],
  lastActive: Date,
  subscription: { accountStatus: String },
  cleanupPending: { type: Boolean, default: false }, // ✅ Add this
  actionLog: [{ action: String, date: Date }],
}, { timestamps: true });

export default mongoose.model("User", userSchema);

