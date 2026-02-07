const SymptomLog = require('../models/SymptomLog')
const Cycle = require('../models/Cycle')
const { calculateAverageCycle, getCyclePhase } = require('../utils/cyclePrediction')

exports.getCycleSymptomInsights = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: -1
    })

    if (!cycles.length) {
      return res.json({ success: true, insights: [] })
    }

    const avgCycleLength = calculateAverageCycle(cycles)

    const logs = await SymptomLog.find({ user: req.user._id })

    const phaseMap = {}

    logs.forEach(log => {
      const phase = getCyclePhase(log.createdAt, avgCycleLength)
      if (!phaseMap[phase]) {
        phaseMap[phase] = { moods: {}, symptoms: {} }
      }

      if (log.mood) {
        phaseMap[phase].moods[log.mood] =
          (phaseMap[phase].moods[log.mood] || 0) + 1
      }

      log.symptoms.forEach(symptom => {
        phaseMap[phase].symptoms[symptom] =
          (phaseMap[phase].symptoms[symptom] || 0) + 1
      })
    })

    const insights = Object.keys(phaseMap).map(phase => ({
      phase,
      commonMoods: Object.entries(phaseMap[phase].moods)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3),
      commonSymptoms: Object.entries(phaseMap[phase].symptoms)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
    }))

    res.json({
      success: true,
      insights
    })
  } catch (err) {
    next(err)
  }
}