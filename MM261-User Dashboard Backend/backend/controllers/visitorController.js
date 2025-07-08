import Visitor from "../models/Visitor.js";

export const getRecentVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .sort({ visitedAt: -1 })
      .limit(4)
      .populate("userId", "name avatar");

    res.status(200).json(visitors);
  } catch (error) {
    console.error("Visitor fetch error:", error.message);
    res.status(500).json({ error: "Something went wrong" });
  }
};
