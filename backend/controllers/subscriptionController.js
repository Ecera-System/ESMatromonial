// // controllers/subscriptionController.js

// import Plan from "../models/Plan.js";
// import { createRazorpayOrder } from "../services/paymentService.js";
// import crypto from "crypto";

// // Get all plans
// export const getPlans = async (req, res) => {
//   try {
//     const plans = await Plan.find();
//     res.json(plans);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch plans" });
//   }
// };

// // Create a new plan (Admin only)
// export const createPlan = async (req, res) => {
//   try {
//     const { name, price, features } = req.body;
//     const plan = new Plan({ name, price, features });
//     await plan.save();
//     res.status(201).json(plan);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to create plan" });
//   }
// };

// // Delete a plan (Admin only)
// export const deletePlan = async (req, res) => {
//   try {
//     const { id } = req.params;
//     await Plan.findByIdAndDelete(id);
//     res.json({ message: "Plan deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete plan" });
//   }
// };

// // Create Razorpay order for payment
// export const createOrder = async (req, res) => {
//   try {
//     const { amount, planId } = req.body;

//     const order = await createRazorpayOrder(amount); // from services/paymentService.js

//     res.json({
//       orderId: order.id,
//       amount: order.amount,
//       currency: order.currency,
//       planId,
//     });
//   } catch (err) {
//     console.error("❌ Razorpay order error:", err);
//     res.status(500).json({ error: "Order creation failed" });
//   }
// };

// // Razorpay webhook handler (verifies signature)
// export const handleWebhook = (req, res) => {
//   const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
//   const signature = req.headers["x-razorpay-signature"];

//   const hash = crypto
//     .createHmac("sha256", secret)
//     .update(JSON.stringify(req.body))
//     .digest("hex");

//   if (hash === signature) {
//     console.log("✅ Webhook verified:", req.body);

//     // TODO: Store payment, activate plan for user, etc.
//     // Example: Save to Payment collection or mark user as Premium

//     res.status(200).json({ status: "ok" });
//   } else {
//     console.log("❌ Invalid webhook signature");
//     res.status(400).json({ status: "invalid signature" });
//   }
// };
