import Visitor from "../models/Visitor.js";

// GET visitors
export const getVisitors = async (req, res) => {
  try {
    const visitors = await Visitor.find()
      .populate("userId", "name avatarUrl")
      .sort({ _id: -1 });

    res.status(200).json(visitors);
  } catch (err) {
    console.error("Error fetching visitors:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST a visitor
export const addVisitor = async (req, res) => {
  const { name, avatarUrl, userId } = req.body;

  if (!name || !avatarUrl || !userId) {
    return res.status(400).json({ message: "Name, avatarUrl, and userId are required" });
  }

  try {
    const newVisitor = new Visitor({ name, avatarUrl, userId });
    await newVisitor.save();
    res.status(201).json(newVisitor);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
