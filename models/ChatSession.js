const mongoose = require('mongoose')

const chatSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    messages: [
      {
        role: {
          type: String,
          enum: ['user', 'assistant'],
          required: true
        },
        content: {
          type: String,
          required: true
        }
      }
    ]
  },
  { timestamps: true }
)

module.exports = mongoose.model('ChatSession', chatSessionSchema)