require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const Message = require('./models/Message')
const User = require('./models/User')

const app = express()
app.use(cors())
app.use(express.json())

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

const JWT_SECRET = process.env.JWT_SECRET || 'my_super_secret_college_key'

const groups = [
    { id: 'psychology', name: 'Psychology' },
    { id: 'philosophy', name: 'Philosophy' },
    { id: 'entertainment', name: 'Entertainment' },
    { id: 'hollywood', name: 'Hollywood' },
    { id: 'bollywood', name: 'Bollywood' }
]

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/realtime-collab')
  .then(() => console.log('✅ mongodb connected'))
  .catch(err => console.log('❌ mongodb error', err))

io.on('connection', (socket) => {
  console.log('user connected', socket.id)

  socket.on('join_channel', async ({ channelId, username }) => {
    socket.join(channelId)
    const history = await Message.find({ channelId }).sort({ timestamp: 1 }).limit(50)
    socket.emit('chat_history', history)
  })

  socket.on('send_message', async (data) => {
    const msgData = {
      sender: data.sender || 'Anonymous',
      content: data.content,
      channelId: data.channelId,
      timestamp: new Date()
    }
    
    socket.broadcast.to(data.channelId).emit('receive_message', msgData)
    await new Message(msgData).save()

    if (data.content.trim().toLowerCase().startsWith('@bot')) {
      const prompt = data.content.replace(/^@bot/i, '').trim()
      
      try {
        const tagsRes = await fetch('http://127.0.0.1:11434/api/tags')
        const tagsData = await tagsRes.json()
        const activeModel = tagsData.models && tagsData.models.length > 0 ? tagsData.models[0].name : 'llama3'

        const ollamaRes = await fetch('http://127.0.0.1:11434/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: activeModel, prompt: prompt, stream: false })
        })
        const ollamaData = await ollamaRes.json()
        
        const botMsg = { sender: 'Bot', content: ollamaData.response, channelId: data.channelId, timestamp: new Date() }
        io.to(data.channelId).emit('receive_message', botMsg)
        await new Message(botMsg).save()
      } catch (e) {
        const botErrorMsg = { sender: 'Bot', content: 'I am offline right now.', channelId: data.channelId, timestamp: new Date() }
        io.to(data.channelId).emit('receive_message', botErrorMsg)
        await new Message(botErrorMsg).save()
      }
    }
  })
})

app.get('/api/groups', (req, res) => res.json(groups))

app.post('/api/register', async (req, res) => {
  const { username, password } = req.body
  const existing = await User.findOne({ username })
  if (existing) return res.status(400).json({ error: 'User exists' })
  await new User({ username, password }).save()
  res.json({ message: 'User created' })
})

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body
  const user = await User.findOne({ username, password })
  if (!user) return res.status(400).json({ error: 'Invalid creds' })
  const token = jwt.sign({ username: user.username }, JWT_SECRET)
  res.json({ token, username: user.username })
})

app.get('/api/messages/:channelId', async (req, res) => {
  const msgs = await Message.find({ channelId: req.params.channelId }).sort({ timestamp: 1 }).limit(50)
  res.json(msgs)
})

const port = process.env.PORT || 5001
server.listen(port, () => console.log(`server is running on port ${port}`))
