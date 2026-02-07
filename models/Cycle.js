const mongoose = require('mongoose')

const cycleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    periodStart: {
      type: Date,
      required: true
    },
    periodEnd: {
      type: Date,
      required: true
    },
    cycleLength: {
      type: Number,
      required: true
    },
    predictedNextPeriod: {
      type: Date
    },
    phase: {
      type: String
    },
    ovulationDate: {
         type: Date
    },
    fertileWindow: {
        start: Date,
        end: Date
    }
  },
  { timestamps: true }
)

module.exports = mongoose.model('Cycle', cycleSchema)