import Feedback from '../models/Feedback.js';

// GET all feedback
export const getAllFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// POST new feedback
export const createFeedback = async (req, res) => {
  try {
    const { username, rating, comment } = req.body;
    const newFeedback = new Feedback({ username, rating, comment });
    await newFeedback.save();
    res.status(201).json(newFeedback);
  } catch (error) {
    res.status(400).json({ message: 'Invalid data' });
  }
};

// PATCH toggle feature
export const toggleFeature = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    if (!feedback) return res.status(404).json({ message: 'Not found' });

    feedback.isFeatured = !feedback.isFeatured;
    await feedback.save();
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
