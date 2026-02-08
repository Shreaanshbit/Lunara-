const SymptomLog = require('../models/SymptomLog')
const Cycle = require('../models/Cycle')
const { calculateAverageCycle, getCyclePhase } = require('./cyclePrediction')

exports.getCycleSymptomInsightsInternal = async userId => {
  const cycles = await Cycle.find({ user: userId }).sort({ periodStart: -1 })
  if (!cycles.length) return null

  const avgCycleLength = calculateAverageCycle(cycles)
  const currentPhase = getCyclePhase(cycles[0].periodStart, avgCycleLength)

  const logs = await SymptomLog.find({ user: userId })
  if (!logs.length) return { currentPhase }

  const phaseData = { moods: {}, symptoms: {} }

  logs.forEach(log => {
    const phase = getCyclePhase(log.createdAt, avgCycleLength)
    if (phase !== currentPhase) return

    if (log.mood) {
      phaseData.moods[log.mood] = (phaseData.moods[log.mood] || 0) + 1
    }

    log.symptoms.forEach(s => {
      phaseData.symptoms[s] = (phaseData.symptoms[s] || 0) + 1
    })
  })

  const topMood = Object.entries(phaseData.moods)
    .sort((a, b) => b[1] - a[1])[0]?.[0]

  const topSymptoms = Object.entries(phaseData.symptoms)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([s]) => s)

  return {
    currentPhase,
    topMood,
    topSymptoms
  }
}