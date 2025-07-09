import Message from '../models/Message.js';
import Chat from '../models/Chat.js';
import User from '../models/User.js';

const socketHandler = (io) => {
  const connectedUsers = new Map();

  io.on('connection', async (socket) => {
    const userName = `${socket.user.firstName} ${socket.user.lastName}`;
    console.log(`User ${userName} connected`);
    
    // Store user connection
    connectedUsers.set(socket.userId, socket.id);
    
    // Update user online status
    await User.findByIdAndUpdate(socket.userId, { 
      isOnline: true,
      lastSeen: new Date()
    });

    // Join user to their chat rooms
    const userChats = await Chat.find({ participants: socket.userId });
    userChats.forEach(chat => {
      socket.join(chat._id.toString());
    });

    // Emit online status to all connected users
    socket.broadcast.emit('user-online', {
      userId: socket.userId,
      userName: userName
    });

    // Handle joining a chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${userName} joined chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        const { chatId, content, messageType = 'text', file } = data;

        // Verify user is part of the chat
        const chat = await Chat.findOne({
          _id: chatId,
          participants: socket.userId
        }).populate('participants', 'name avatar');

        if (!chat) return;

        // Create message
        const messageData = {
          chat: chatId,
          sender: socket.userId,
          content,
          messageType
        };

        // Add file data if it's a file message
        if (file && messageType !== 'text') {
          messageData.file = file;
        }

        const message = new Message(messageData);
        await message.save();
        await message.populate('sender', 'name avatar');

        // Update chat's last message
        chat.lastMessage = message._id;
        chat.updatedAt = new Date();
        await chat.save();

        // Emit message to chat room
        io.to(chatId).emit('new-message', message);

        // Send real-time notification to other participants
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== socket.userId
        );

        otherParticipants.forEach(participant => {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          if (participantSocketId) {
            // Emit notification event specifically for the recipient
            io.to(participantSocketId).emit('message-notification', {
              id: Date.now(),
              senderName: socket.user.name,
              senderAvatar: socket.user.avatar,
              content: content,
              messageType: messageType,
              chatId: chatId,
              timestamp: new Date()
            });

            // Also emit chat-updated for sidebar updates
            io.to(participantSocketId).emit('chat-updated', {
              chatId,
              lastMessage: message
            });
          }
        });

      } catch (error) {
        console.error('Error sending message:', error);
      }
    });

    // Handle typing indicators
    socket.on('typing', async (data) => {
      try {
        const { chatId } = data;
        
        // Get chat to find other participants
        const chat = await Chat.findById(chatId).populate('participants', 'name');
        if (!chat) return;

        // Emit typing to other participants only
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== socket.userId
        );

        otherParticipants.forEach(participant => {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          if (participantSocketId) {
            io.to(participantSocketId).emit('user-typing', {
              userId: socket.userId,
              userName: socket.user.name,
              chatId: chatId
            });
          }
        });
      } catch (error) {
        console.error('Error handling typing:', error);
      }
    });

    socket.on('stop-typing', async (data) => {
      try {
        const { chatId } = data;
        
        // Get chat to find other participants
        const chat = await Chat.findById(chatId).populate('participants', 'name');
        if (!chat) return;

        // Emit stop typing to other participants only
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== socket.userId
        );

        otherParticipants.forEach(participant => {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          if (participantSocketId) {
            io.to(participantSocketId).emit('user-stop-typing', {
              userId: socket.userId,
              chatId: chatId
            });
          }
        });
      } catch (error) {
        console.error('Error handling stop typing:', error);
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User ${userName} disconnected`);
      
      // Remove user connection
      connectedUsers.delete(socket.userId);
      
      // Update user offline status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false,
        lastSeen: new Date()
      });

      // Emit offline status to all connected users
      socket.broadcast.emit('user-offline', {
        userId: socket.userId,
        userName: userName
      });
    });
  });
};

export default socketHandler;
