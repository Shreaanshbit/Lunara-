const MS_PER_DAY = 1000 * 60 * 60 * 24

const daysBetween = (a, b) =>
  Math.round((b.getTime() - a.getTime()) / MS_PER_DAY)

exports.calculateCycleLength = (start, end) =>
  daysBetween(start, end)

exports.calculateAverageCycle = cycles => {
  if (!cycles.length) return 28

  const weighted = cycles
    .slice(-6)
    .map((c, i) => c.cycleLength * (i + 1))

  const weightSum = weighted.reduce((a, b) => a + b, 0)
  const divisor = (weighted.length * (weighted.length + 1)) / 2

  return Math.round(weightSum / divisor)
}

exports.predictNextPeriod = (lastStart, avgCycleLength) =>
  new Date(lastStart.getTime() + avgCycleLength * MS_PER_DAY)

exports.calculateOvulationDate = nextPeriod =>
  new Date(nextPeriod.getTime() - 14 * MS_PER_DAY)

exports.getFertileWindow = ovulation => ({
  start: new Date(ovulation.getTime() - 5 * MS_PER_DAY),
  end: new Date(ovulation.getTime() + 1 * MS_PER_DAY)
})

exports.getCyclePhase = (lastPeriodStart, avgCycleLength) => {
  const today = new Date()
  const day = daysBetween(lastPeriodStart, today)

  if (day <= 5) return 'menstrual'
  if (day <= avgCycleLength * 0.45) return 'follicular'
  if (day <= avgCycleLength * 0.6) return 'ovulatory'
  return 'luteal'
}

exports.getPredictionConfidence = cycles => {
  if (cycles.length >= 6) return 'high'
  if (cycles.length >= 3) return 'medium'
  return 'low'
}