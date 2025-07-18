import User from "../models/User.js";
import nodemailer from "nodemailer";

// Fetch inactive users using query parameters
// Accepts days, firstName, lastName for fetch users
// Default is 10 days of inactivity
// Returns users who have not been active for the specified number of days
// and match the optional name filters
export const getInactiveUsers = async (req, res) => {
  try {
    const { days = "10", firstName = "", lastName = "" } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

    const query = {
      lastActive: { $lt: cutoffDate },
      firstName: { $regex: firstName, $options: "i" },
      lastName: { $regex: lastName, $options: "i" }
    };

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch inactive users" });
  }
};

// handle action follow-up (no email here) or cleanup
export const updateUserAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;

    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    user.actionLog.push({ action, date: new Date() });

    if (action === "cleanup") {
      await User.findByIdAndDelete(id); // This deletes the user from DB
      return res.json({ message: "🗑️ User deleted successfully (cleanup)" });
    }
    await user.save();
    res.json({ message: `${action} recorded.` });
  } catch (err) {
    res.status(500).json({ error: "Action update failed" });
  }
};

// Send follow-up email
export const sendReminderEmail = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "We miss you at Matrimony Team!",
      text: `Hi ${user.firstName},\n\nWe noticed you haven't logged in recently. Come explore new matches!\n\nWarm regards,\nMatrimony Team.` //\n is used for new lines
    });

    user.actionLog.push({ action: "email-sent", date: new Date() });
    await user.save();

    res.json({ message: "Follow-up email sent" });
  } catch (err) {
    res.status(500).json({ error: "Failed to send email" });
  }
};


