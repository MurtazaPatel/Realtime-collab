const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  content: { type: String, required: true },
  channelId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  reactions: { type: Map, of: Number, default: {} } // Reaction emojis -> count
});

module.exports = mongoose.model('Message', messageSchema);
