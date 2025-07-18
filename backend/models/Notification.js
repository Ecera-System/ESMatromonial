// Notification schema

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // recipient
  type: {
    type: String,
    enum: [
      "message",
      "system",
      "welcome",
      "password_change",
      "interest_sent",
      "interest_accepted",
      "interest_rejected",
      "request_cancelled",
      "new_request",
      "profile_visit",
    ],
    default: "system",
  },
  title: { type: String, required: true },
  message: { type: String, required: true }, // notification text
  link: { type: String }, // e.g., /profile/userId
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" }, // related chat (if any)
  fromUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // sender (if any)
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Notification", notificationSchema);
