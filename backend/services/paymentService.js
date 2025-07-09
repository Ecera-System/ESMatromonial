// services/paymentService.js
import dotenv from "dotenv";
dotenv.config();

import Razorpay from "razorpay";

// Razorpay instance with credentials
const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});

// Create order function
export const createRazorpayOrder = async (amount) => {
  try {
    const options = {
      amount: amount * 100, // amount in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    return order;
  } catch (error) {
    console.error("❌ Razorpay order creation failed:", error);
    throw new Error("Razorpay order creation failed");
  }
};
