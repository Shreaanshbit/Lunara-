require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const moodRoutes=require('./routes/mood');
const cycleRoutes=require('./routes/cycle')
const chatRoutes=require('./routes/chat')
const insightRoutes=require('./routes/insights')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Lunara backend running 🌙' })
})

app.use('/auth', authRoutes);
app.use('/mood',moodRoutes);
app.use('/cycles',cycleRoutes);
app.use('/chat',chatRoutes);
app.use('/insights',insightRoutes);


app.use(errorMiddleware)

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`)
    })
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed', err)
    process.exit(1)
  })