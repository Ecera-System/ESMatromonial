// import express from "express";
// import {
//   getPlans,
//   createPlan,
//   deletePlan,
//   createOrder,
//   handleWebhook
// } from "../controllers/subscriptionController.js";
// import Plan from "../models/Plan.js"; // Import Plan model

// const router = express.Router();

// router.get("/plans", getPlans);
// router.post("/plans", createPlan);
// router.delete("/plans/:id", deletePlan);
// router.post("/create-order", createOrder);
// router.post("/webhook", express.json({ type: "*/*" }), handleWebhook);

// router.delete("/clear", async (req, res) => {
//   try {
//     const result = await Plan.deleteMany({});
//     res.json({ message: `🧹 ${result.deletedCount} plans deleted successfully.` });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to delete all plans" });
//   }
// });

// export default router;
