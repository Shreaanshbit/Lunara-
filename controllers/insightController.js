const SymptomLog = require('../models/SymptomLog')
const Cycle = require('../models/Cycle')
const { calculateAverageCycle, getCyclePhase, predictNextPeriod } = require('../utils/cyclePrediction')

exports.getCycleSymptomInsights = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: -1
    })

    if (!cycles.length) {
      return res.json({ success: true, insight: null })
    }

    const avgCycleLength = calculateAverageCycle(cycles)
    const currentCycle = cycles[0]
    const currentPhase = getCyclePhase(currentCycle.periodStart, avgCycleLength)
    const predictedNextPeriod = predictNextPeriod(
      currentCycle.periodStart,
      avgCycleLength
    )

    const logs = await SymptomLog.find({ user: req.user._id })

    if (!logs.length) {
      return res.json({
        success: true,
        currentPhase,
        predictedNextPeriod,
        insight: null
      })
    }

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

    const currentPhaseData = phaseMap[currentPhase] || {
      moods: {},
      symptoms: {}
    }

    const commonSymptoms = Object.entries(currentPhaseData.symptoms)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([symptom]) => symptom)

    const commonMoods = Object.entries(currentPhaseData.moods)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 1)
      .map(([mood]) => mood)

    const confidence =
      cycles.length >= 6 && logs.length >= 10
        ? 'high'
        : cycles.length >= 3
        ? 'medium'
        : 'low'

    let message = null

    if (commonSymptoms.length || commonMoods.length) {
      message = `You often report ${[
        ...commonSymptoms,
        ...commonMoods
      ].join(', ')} during this phase. Being gentle with yourself may help.`
    }

    res.json({
      success: true,
      currentPhase,
      predictedNextPeriod,
      commonSymptoms,
      moodTrend: commonMoods[0] || null,
      confidence,
      message
    })
  } catch (err) {
    next(err)
  }
}