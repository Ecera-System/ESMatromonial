// Socket.io setup

import { Server } from 'socket.io';
import User from '../models/User.js';
import Chat from '../models/Chat.js';
import Message from '../models/Message.js';
import Notification from '../models/Notification.js';
import Call from '../models/Call.js';

let io;


const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  // Track connected users
  const connectedUsers = new Map();
  // Track active calls (userId <-> { with, socketId })
  const activeCalls = new Map();

  io.on('connection', async (socket) => {
    // Expect userId in handshake query
    const userId = socket.handshake.query.userId;
    console.log('🔌 New socket connection attempt, userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId provided in handshake');
      return;
    }
    
    const user = await User.findById(userId);
    if (!user) {
      console.log('❌ User not found:', userId);
      return;
    }
    
    socket.userId = user._id.toString();
    socket.user = user;

    console.log('✅ User connected:', user.firstName, user.lastName, 'Socket ID:', socket.id);

    // Store user connection
    connectedUsers.set(user._id.toString(), socket.id);

    // Update user online status
    await User.findByIdAndUpdate(user._id, {
      isOnline: true,
      lastActive: new Date(),
    });

    // Send the list of currently online users to the newly connected user
    socket.emit('online-users', Array.from(connectedUsers.keys()));

    // Emit online status to all connected users
    io.emit('user-online', { userId: user._id });

    // Join user to their chat rooms
    const userChats = await Chat.find({ participants: user._id });
    userChats.forEach(chat => {
      socket.join(chat._id.toString());
    });

    // Handle joining a chat room
    socket.on('join-chat', (chatId) => {
      socket.join(chatId);
      console.log(`User ${user._id} joined chat ${chatId}`);
    });

    // Handle sending messages
    socket.on('send-message', async (data) => {
      try {
        console.log('📨 Received message:', data);
        const { chatId, content, messageType = 'text', file } = data;
        
        // Verify user is part of the chat
        const chat = await Chat.findOne({
          _id: chatId,
          participants: user._id
        }).populate('participants', 'firstName lastName avatar');
        
        if (!chat) {
          console.log('❌ User not part of chat or chat not found');
          return;
        }

        // Create message
        const messageData = {
          chat: chatId,
          sender: user._id,
          content,
          messageType
        };

        if (file && messageType !== 'text') {
          messageData.file = file;
        }

        const message = new Message(messageData);
        await message.save();
        await message.populate('sender', 'firstName lastName avatar');

        console.log('💾 Message saved:', message._id);

        // Update chat's last message
        chat.lastMessage = message._id;
        chat.updatedAt = new Date();
        await chat.save();

        // Emit message to chat room
        io.to(chatId).emit('new-message', message);
        console.log('📤 Message emitted to chat room:', chatId);

        // Send real-time notification to other participants
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== user._id.toString()
        );

        for (const participant of otherParticipants) {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          
          // Create notification in DB
          await Notification.create({
            user: participant._id,
            type: 'message',
            message: `${user.firstName} sent you a message`,
            chat: chatId,
            fromUser: user._id,
            isRead: false
          });

          if (participantSocketId) {
            io.to(participantSocketId).emit('message-notification', {
              chatId,
              fromUser: user._id,
              senderName: user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName || user.email,
              senderAvatar: user.avatar,
              message: content,
              messageType,
              timestamp: new Date()
            });

            io.to(participantSocketId).emit('chat-updated', {
              chatId,
              lastMessage: message
            });
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
        socket.emit('message-error', { error: 'Failed to send message' });
      }
    });

    // Typing indicators
    socket.on('typing', async (data) => {
      try {
        const { chatId } = data;
        const chat = await Chat.findById(chatId).populate('participants', 'firstName lastName');
        if (!chat) return;
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== user._id.toString()
        );
        otherParticipants.forEach(participant => {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          if (participantSocketId) {
            io.to(participantSocketId).emit('user-typing', {
              userId: user._id,
              userName: user.firstName && user.lastName
                ? `${user.firstName} ${user.lastName}`
                : user.firstName || user.email,
              chatId
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
        const chat = await Chat.findById(chatId).populate('participants', 'firstName lastName');
        if (!chat) return;
        const otherParticipants = chat.participants.filter(
          p => p._id.toString() !== user._id.toString()
        );
        otherParticipants.forEach(participant => {
          const participantSocketId = connectedUsers.get(participant._id.toString());
          if (participantSocketId) {
            io.to(participantSocketId).emit('user-stop-typing', {
              userId: user._id,
              chatId
            });
          }
        });
      } catch (error) {
        console.error('Error handling stop typing:', error);
      }
    });

    // --- WebRTC Call Signaling Events ---
    // Map of userId <-> socketId is already handled by connectedUsers

    // Initiate a call (fix event name to match frontend)
    socket.on('callToUser', (data) => {
      const calleeSocketId = connectedUsers.get(data.callToUserId);
      console.log('[CALL] callToUser event received from', socket.userId, 'to', data.callToUserId, 'calleeSocketId:', calleeSocketId);
      
      if (!calleeSocketId) {
        socket.emit('userUnavailable', { message: 'User is offline.' });
        return;
      }
      
      // If callee is already in a call
      if (activeCalls.has(data.callToUserId)) {
        socket.emit('userBusy', { message: 'User is currently in another call.' });
        return;
      }
      
      // Relay call to callee
      io.to(calleeSocketId).emit('callToUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
        email: data.email,
        profilepic: data.profilepic,
      });
      console.log('[CALL] callToUser event emitted to calleeSocketId:', calleeSocketId);
    });

    // Answer a call
    socket.on('call-answer', async ({ toUserId, fromUserId, answer, roomId }) => {
      console.log('Received call-answer from', fromUserId, 'to', toUserId, 'roomId', roomId);
      const toSocketId = connectedUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('call-answered', { fromUserId, answer, roomId });
      }
      // Update call status
      if (roomId) {
        await Call.findOneAndUpdate({ "connectionDetails.roomId": roomId }, { status: 'completed' });
      }
    });

    // Reject a call
    socket.on('call-reject', async ({ toUserId, callId }) => {
      const toSocketId = connectedUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('call-rejected', {
          fromUserId: socket.userId,
          callId,
        });
      }
      // Update call status
      await Call.findByIdAndUpdate(callId, { status: 'rejected' });
    });

    // End a call
    socket.on('call-end', async ({ to, from }) => {
      console.log('Received call-end from', from, 'to', to);
      const toSocketId = connectedUsers.get(to);
      if (toSocketId) {
        io.to(toSocketId).emit('call-ended', { fromUserId: from });
      }
      // Optionally update call status in DB
    });

    // ICE candidate exchange
    socket.on('ice-candidate', ({ toUserId, candidate }) => {
      console.log('Received ice-candidate from', socket.userId, 'to', toUserId, candidate);
      const toSocketId = connectedUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('ice-candidate', {
          fromUserId: socket.userId,
          candidate,
        });
      }
    });

    // Call timeout
    socket.on('call-timeout', async ({ toUserId, callId }) => {
      const toSocketId = connectedUsers.get(toUserId);
      if (toSocketId) {
        io.to(toSocketId).emit('call-timeout', {
          fromUserId: socket.userId,
          callId,
        });
      }
      // Update call status
      await Call.findByIdAndUpdate(callId, { status: 'missed' });
    });

    // Heartbeat/ping mechanism
    socket.on('heartbeat', async () => {
      await User.findByIdAndUpdate(user._id, {
        lastActive: new Date(),
      });
    });

    // --- Video/Voice Call Presence & Signaling Extensions ---
    // Send the socket ID to the connected user (for WebRTC peer signaling)
    socket.emit('me', socket.id);

    // Handle user join for presence (already handled above, but emit online-users to all)
    io.emit('online-users', Array.from(connectedUsers.keys()));

    // --- Call Signaling Extensions ---
    // Prevent double calls (busy state)
    socket.on('callToUser', (data) => {
      const calleeSocketId = connectedUsers.get(data.callToUserId);
      if (!calleeSocketId) {
        socket.emit('userUnavailable', { message: 'User is offline.' });
        return;
      }
      // If callee is already in a call
      if (activeCalls.has(data.callToUserId)) {
        socket.emit('userBusy', { message: 'User is currently in another call.' });
        io.to(calleeSocketId).emit('incomingCallWhileBusy', {
          from: data.from,
          name: data.name,
          email: data.email,
          profilepic: data.profilepic,
        });
        return;
      }
      // Relay call to callee
      io.to(calleeSocketId).emit('callToUser', {
        signal: data.signalData,
        from: data.from,
        name: data.name,
        email: data.email,
        profilepic: data.profilepic,
      });
    });

    socket.on('answeredCall', (data) => {
      io.to(data.to).emit('callAccepted', {
        signal: data.signal,
        from: data.from,
      });
      // Track both users as in a call
      activeCalls.set(data.from, { with: data.to, socketId: socket.id });
      activeCalls.set(data.to, { with: data.from, socketId: data.to });
    });

    socket.on('reject-call', (data) => {
      io.to(data.to).emit('callRejected', {
        name: data.name,
        profilepic: data.profilepic,
      });
    });

    socket.on('call-ended', (data) => {
      io.to(data.to).emit('callEnded', {
        name: data.name,
      });
      // Remove both users from active calls
      activeCalls.delete(data.from);
      activeCalls.delete(data.to);
    });

    // On disconnect, clean up
    socket.on('disconnect', async () => {
      console.log('👋 User disconnected:', user.firstName, user.lastName);
      
      // Update user offline status
      await User.findByIdAndUpdate(user._id, {
        isOnline: false,
        lastActive: new Date(),
      });

      // Clean up active calls
      activeCalls.delete(user._id.toString());
      for (const [key, value] of activeCalls.entries()) {
        if (value.with === user._id.toString()) activeCalls.delete(key);
      }

      // Remove from connected users
      connectedUsers.delete(user._id.toString());
      
      // Emit updated online users list
      io.emit('online-users', Array.from(connectedUsers.keys()));
      io.emit('user-offline', { userId: user._id });
    });
  });
};

const getIO = () => {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
};

export { initializeSocket, getIO };