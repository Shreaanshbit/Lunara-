const mongoose = require('mongoose')

const symptomLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    mood: String,
    symptoms: [String],
    intensity: {
      type: Number,
      min: 1,
      max: 5
    },
    source: {
      type: String,
      default: 'chat'
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('SymptomLog', symptomLogSchema)