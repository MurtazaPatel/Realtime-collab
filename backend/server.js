require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const Message = require('./models/Message');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// ─── In-memory fallback store ────────────────────────────────────────────────
// Used when MongoDB is not available
let useInMemory = false;
const inMemoryMessages = {}; // { [channelId]: Message[] }

function storeMessage(msg) {
  if (!inMemoryMessages[msg.channelId]) inMemoryMessages[msg.channelId] = [];
  inMemoryMessages[msg.channelId].push(msg);
  // Keep only last 100 messages per channel in memory
  if (inMemoryMessages[msg.channelId].length > 100) {
    inMemoryMessages[msg.channelId].shift();
  }
}

function getMessages(channelId) {
  return (inMemoryMessages[channelId] || []).slice(-50);
}

// ─── MongoDB connection ───────────────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/realtime-collab')
  .then(() => console.log('✅  MongoDB connected'))
  .catch((err) => {
    console.warn('⚠️  MongoDB unavailable — using in-memory store:', err.message);
    useInMemory = true;
  });

// ─── Track online users per channel ─────────────────────────────────────────
const channelUsers = {}; // { [channelId]: Set<{ socketId, username }> }

// ─── Socket.IO events ────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`🔌 User connected: ${socket.id}`);

  // ---------- join_channel ---------------------------------------------------
  socket.on('join_channel', async ({ channelId, username }) => {
    socket.join(channelId);
    socket.data.channelId = channelId;
    socket.data.username = username || 'Anonymous';

    // Track presence
    if (!channelUsers[channelId]) channelUsers[channelId] = new Map();
    channelUsers[channelId].set(socket.id, socket.data.username);

    console.log(`👤 ${socket.data.username} (${socket.id}) joined channel: ${channelId}`);

    // Notify everyone in channel about the updated user list
    io.to(channelId).emit('channel_users', Array.from(channelUsers[channelId].values()));

    // Send chat history to the newly joined user
    try {
      let history;
      if (useInMemory) {
        history = getMessages(channelId);
      } else {
        history = await Message.find({ channelId }).sort({ timestamp: 1 }).limit(50);
      }
      socket.emit('chat_history', history);
    } catch (err) {
      console.error('Error fetching history:', err.message);
      socket.emit('chat_history', []);
    }
  });

  // ---------- send_message ---------------------------------------------------
  socket.on('send_message', async (data) => {
    // data: { channelId, sender, content }
    const messageData = {
      sender: data.sender || socket.data.username || 'Anonymous',
      content: data.content,
      channelId: data.channelId,
      timestamp: new Date()
    };

    // Broadcast to everyone in the channel (including sender for consistency)
    io.to(data.channelId).emit('receive_message', messageData);

    // Persist
    if (useInMemory) {
      storeMessage(messageData);
    } else {
      try {
        const newMessage = new Message(messageData);
        await newMessage.save();
      } catch (err) {
        console.error('DB save failed, storing in memory:', err.message);
        storeMessage(messageData);
      }
    }
  });

  // ---------- typing indicator -----------------------------------------------
  socket.on('typing', ({ channelId, username, isTyping }) => {
    socket.to(channelId).emit('user_typing', { username, isTyping });
  });

  // ---------- message_reaction -----------------------------------------------
  socket.on('message_reaction', (data) => {
    // data: { channelId, messageId, reaction, username }
    io.to(data.channelId).emit('receive_reaction', data);
  });

  // ---------- disconnect -----------------------------------------------------
  socket.on('disconnect', () => {
    const { channelId, username } = socket.data;
    if (channelId && channelUsers[channelId]) {
      channelUsers[channelId].delete(socket.id);
      io.to(channelId).emit('channel_users', Array.from(channelUsers[channelId].values()));
    }
    console.log(`❌ User disconnected: ${username || socket.id}`);
  });
});

// ─── REST endpoints ──────────────────────────────────────────────────────────

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: useInMemory ? 'in-memory' : 'mongodb' });
});

// Fetch message history for a channel
app.get('/api/messages/:channelId', async (req, res) => {
  try {
    let messages;
    if (useInMemory) {
      messages = getMessages(req.params.channelId);
    } else {
      messages = await Message.find({ channelId: req.params.channelId })
        .sort({ timestamp: 1 })
        .limit(50);
    }
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ─── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`   Health → http://localhost:${PORT}/health`);
});
