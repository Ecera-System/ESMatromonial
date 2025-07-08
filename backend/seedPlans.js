// backend/seedPlans.js
import axios from "axios";

const plans = [
  {
    name: "Basic",
    price: 0,
    features: ["View Profiles", "Send Interest"],
  },
  {
    name: "Premium",
    price: 499,
    features: ["Direct Chat", "Priority Support", "Daily Recommendations"],
  },
  {
    name: "Elite VIP",
    price: 999,
    features: ["Profile Boost", "Personal Matchmaker", "Unlimited Chats"],
  },
];

const seedPlans = async () => {
  try {
    // 1. Check existing plans
    const { data: existingPlans } = await axios.get("http://localhost:5000/api/subscription/plans");
    
    if (existingPlans.length > 0) {
      console.log("⚠️ Plans already exist. Skipping seed.");
      return;
    }

    // 2. Insert new plans
    for (const plan of plans) {
      const res = await axios.post("http://localhost:5000/api/subscription/plans", plan);
      console.log(`✅ Plan "${res.data.name}" inserted`);
    }
  } catch (err) {
    console.error("❌ Error seeding plans:", err.response?.data || err.message);
  }
};

seedPlans();