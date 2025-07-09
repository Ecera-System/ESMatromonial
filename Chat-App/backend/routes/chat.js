import express from 'express';
import Chat from '../models/Chat.js';
import User from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all chats for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user._id
    })
    .populate('participants', 'name email avatar isOnline lastSeen')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create or get existing chat
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { participantId } = req.body;

    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user._id, participantId] }
    }).populate('participants', 'name email avatar isOnline lastSeen');

    if (!chat) {
      // Create new chat
      chat = new Chat({
        participants: [req.user._id, participantId]
      });
      await chat.save();
      await chat.populate('participants', 'name email avatar isOnline lastSeen');
    }

    res.json(chat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Search users
router.get('/users/search', authenticateToken, async (req, res) => {
  try {
    const { query } = req.query;
    
    const users = await User.find({
      $and: [
        { _id: { $ne: req.user._id } },
        {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { email: { $regex: query, $options: 'i' } }
          ]
        }
      ]
    }).select('name email avatar isOnline lastSeen').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
