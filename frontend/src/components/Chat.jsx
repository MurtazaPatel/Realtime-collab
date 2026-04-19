import React, { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import axios from 'axios'

const socket = io('http://localhost:5001')

export default function Chat({ channelId, username, token }) {
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    socket.emit('join_channel', { channelId, username })

    axios.get(`http://localhost:5001/api/messages/${channelId}`)
      .then(res => setMessages(res.data))
      .catch(err => setMessages([]))

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg])
    }

    socket.on('receive_message', handleReceiveMessage)

    return () => {
      socket.off('receive_message', handleReceiveMessage)
    }
  }, [channelId, username])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (e) => {
    e.preventDefault()
    if (!inputValue.trim()) return

    const msgData = {
      channelId,
      sender: username,
      content: inputValue,
      timestamp: new Date().toISOString()
    }

    setMessages((prev) => [...prev, msgData])

    socket.emit('send_message', msgData)
    setInputValue('')
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const renderContent = (content) => {
    let text = content.replace(/<think>[\s\S]*?<\/think>/gi, '').trim()
    
    // Strip markdown formatting to make the text clean
    text = text.replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    text = text.replace(/\*(.*?)\*/g, '$1') // Remove italic
    text = text.replace(/#{1,6}\s+(.*)/g, '$1') // Remove headers
    text = text.replace(/---+/g, '') // Remove horizontal rules
    text = text.replace(/`([^`]+)`/g, '$1') // Remove inline code
    text = text.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
    text = text.trim()

    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ))
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', backgroundColor: '#f9fafb' }}>
      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', padding: '30px' }}>
        {messages.map((msg, idx) => {
          const isMe = msg.sender === username
          const isBot = msg.sender === 'Bot'
          
          let bubbleBg = isMe ? '#2563eb' : '#ffffff'
          let bubbleColor = isMe ? '#ffffff' : '#111827'
          let bubbleBorder = isMe ? 'none' : '1px solid #e5e7eb'

          if (isBot) {
            bubbleBg = '#ecfdf5' // light green
            bubbleColor = '#065f46' // dark green
            bubbleBorder = '1px solid #10b981'
          }

          return (
            <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', paddingLeft: '2px' }}>
                  <span style={{ fontWeight: '600', fontSize: '13px', color: isBot ? '#10b981' : '#6b7280' }}>
                    {msg.sender}
                  </span>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>{formatTime(msg.timestamp)}</span>
                </div>
              )}

              <div style={{ 
                maxWidth: '75%', 
                padding: '12px 16px', 
                backgroundColor: bubbleBg, 
                color: bubbleColor, 
                border: bubbleBorder,
                borderRadius: '16px', 
                borderBottomRightRadius: isMe ? '4px' : '16px',
                borderBottomLeftRadius: !isMe ? '4px' : '16px',
                fontSize: '15px',
                lineHeight: '1.5',
                boxShadow: isMe ? '0 2px 4px rgba(37, 99, 235, 0.2)' : '0 1px 2px rgba(0,0,0,0.05)'
              }}>
                {renderContent(msg.content)}
              </div>

              {isMe && (
                <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px', paddingRight: '2px' }}>
                  {formatTime(msg.timestamp)}
                </div>
              )}
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ padding: '20px 30px', backgroundColor: '#ffffff', borderTop: '1px solid #e5e7eb' }}>
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '12px' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message or @bot to ask AI..."
            style={{ 
              flex: 1, 
              padding: '14px 20px', 
              background: '#f3f4f6', 
              color: '#111827', 
              border: '1px solid #e5e7eb',
              borderRadius: '24px',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => e.target.style.borderColor = '#2563eb'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <button type="submit" style={{ 
            padding: '12px 24px', 
            background: '#2563eb', 
            color: 'white', 
            border: 'none',
            borderRadius: '24px',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(37,99,235,0.2)',
            transition: 'background 0.2s'
          }}
          onMouseOver={(e) => e.target.style.background = '#1d4ed8'}
          onMouseOut={(e) => e.target.style.background = '#2563eb'}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
