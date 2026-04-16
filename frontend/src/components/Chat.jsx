import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

// Create socket outside component to prevent multiple connections on re-render
const socket = io('http://localhost:5001');

export default function Chat({ channelId }) {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [username, setUsername] = useState('User' + Math.floor(Math.random() * 1000));
  const messagesEndRef = useRef(null);

  // Fetch past messages and setup socket listeners
  useEffect(() => {
    // 1. Join Socket channel
    socket.emit('join_channel', channelId);

    // 2. Fetch history (if backend DB is running, it might fail if memory-only, so we catch error)
    axios.get(`http://localhost:5001/api/messages/${channelId}`)
      .then(res => setMessages(res.data))
      .catch(err => {
        console.log('Could not fetch history, probably running memory-only mode without DB.');
        setMessages([]); // reset on channel change
      });

    // 3. Listen for new messages
    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('receive_message', handleReceiveMessage);

    // Cleanup when changing channels
    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, [channelId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const messageData = {
      channelId,
      sender: username,
      content: inputValue
    };

    socket.emit('send_message', messageData);
    setInputValue('');
  };

  const reactToMessage = (msgId, reaction) => {
    // Basic demonstration of reactions implementation
    socket.emit('message_reaction', { channelId, messageId: msgId, reaction });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      
      {/* Name config (simple simulation of login) */}
      <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ color: '#a6adc8' }}>Sending as:</span>
        <input 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          style={{ padding: '5px 10px', borderRadius: '4px', border: 'none', backgroundColor: '#313244', color: '#cdd6f4' }} 
        />
      </div>

      {/* Message List */}
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {messages.map((msg, idx) => (
          <div key={msg._id || idx} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
              <span style={{ fontWeight: 'bold', color: '#89b4fa' }}>{msg.sender}</span>
              <span style={{ fontSize: '0.75rem', color: '#6c7086' }}>
                {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : new Date().toLocaleTimeString()}
              </span>
            </div>
            <div style={{ marginTop: '5px', color: '#cdd6f4' }}>{msg.content}</div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={`Message #${channelId}`}
          style={{ 
            flex: 1, 
            padding: '12px', 
            borderRadius: '8px', 
            border: '1px solid #45475a', 
            backgroundColor: '#313244', 
            color: '#cdd6f4', 
            outline: 'none' 
          }}
        />
        <button 
          type="submit" 
          style={{ 
            padding: '12px 24px', 
            borderRadius: '8px', 
            border: 'none', 
            backgroundColor: '#89b4fa', 
            color: '#11111b', 
            fontWeight: 'bold',
            cursor: 'pointer' 
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
