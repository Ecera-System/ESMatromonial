// controllers/requestController.js
import Request from '../models/Request.js';
//send
export const sendRequest = async (req, res) => {
  const { receiverId } = req.body;
  const senderId = req.user._id; // from auth middleware

  try {
    // check if already sent
    const existing = await Request.findOne({ sender: senderId, receiver: receiverId });
    if (existing) return res.status(400).json({ message: 'Request already sent' });

    const newRequest = new Request({ sender: senderId, receiver: receiverId });
    await newRequest.save();
    res.status(201).json({ message: 'Request sent successfully', request: newRequest });
  } catch (err) {
    res.status(500).json({ message: 'Error sending request', error: err.message });
  }
};

//accept
export const acceptRequest = async (req, res) => {
  const { requestId } = req.params;

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    request.status = 'accepted';
    await request.save();

    res.json({ message: 'Request accepted' });
  } catch (err) {
    res.status(500).json({ message: 'Error accepting request', error: err.message });
  }
};


//receive
export const getUserRequests = async (req, res) => {
  const userId = req.user._id;

  try {
    const sent = await Request.find({ sender: userId }).populate('receiver', 'name email');
    const received = await Request.find({ receiver: userId, status: 'pending' }).populate('sender', 'name email');
    const accepted = await Request.find({
      $or: [{ sender: userId }, { receiver: userId }],
      status: 'accepted',
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email');

    res.json({ sent, received, accepted });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching requests', error: err.message });
  }
};
