const Cycle = require('../models/Cycle')
const {
  calculateCycleLength,
  calculateAverageCycle,
  predictNextPeriod,
  calculateOvulationDate,
  getFertileWindow,
  getCyclePhase
} = require('../utils/cyclePrediction')

exports.addCycle = async (req, res, next) => {
  try {
    const { periodStart, periodEnd } = req.body

    const start = new Date(periodStart)
    const end = new Date(periodEnd)

    const cycleLength = calculateCycleLength(start, end)

    const previousCycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: 1
    })

    const avgCycleLength = calculateAverageCycle([
      ...previousCycles,
      { cycleLength }
    ])

    const predictedNextPeriod = predictNextPeriod(start, avgCycleLength)
    const ovulationDate = calculateOvulationDate(predictedNextPeriod)
    const fertileWindow = getFertileWindow(ovulationDate)
    const phase = getCyclePhase(start, avgCycleLength)

    const cycle = await Cycle.create({
      user: req.user._id,
      periodStart: start,
      periodEnd: end,
      cycleLength,
      predictedNextPeriod,
      phase,
      ovulationDate,
      fertileWindow
    })

    res.status(201).json({
      success: true,
      cycle,
      avgCycleLength
    })
  } catch (err) {
    next(err)
  }
}

exports.getCycles = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: -1
    })
    res.json({ success: true, cycles })
  } catch (err) {
    next(err)
  }
}

exports.getCurrentCycleInsight = async (req, res, next) => {
  try {
    const cycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: -1
    })

    if (!cycles.length) {
      return res.json({ success: true, insight: null })
    }

    const latest = cycles[0]
    const avgCycleLength = calculateAverageCycle(cycles)
    const phase = getCyclePhase(latest.periodStart, avgCycleLength)
    const ovulationDate = calculateOvulationDate(latest.predictedNextPeriod)
    const fertileWindow = getFertileWindow(ovulationDate)

    res.json({
      success: true,
      phase,
      predictedNextPeriod: latest.predictedNextPeriod,
      fertileWindow,
      confidence: cycles.length >= 3 ? 'medium' : 'low'
    })
  } catch (err) {
    next(err)
  }
}