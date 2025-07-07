// controllers/requestController.js
import Request from '../models/requestModel.js';

export const getUserRequests = async (req, res) => {
  try {
    const userId = req.user._id;

    const received = await Request.find({ receiver: userId })
      .populate('sender', 'name avatar')
      .exec();

    const sent = await Request.find({ sender: userId })
      .populate('receiver', 'name avatar')
      .exec();

    const accepted = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted',
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .exec();

    res.status(200).json({ received, sent, accepted });
  } catch (err) {
    console.error('Error getting requests:', err);
    res.status(500).json({ message: 'Failed to get user requests' });
  }
};
