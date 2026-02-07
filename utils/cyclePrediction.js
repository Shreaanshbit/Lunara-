const MS_IN_DAY = 1000 * 60 * 60 * 24

const average = (arr) =>
  Math.round(arr.reduce((a, b) => a + b, 0) / arr.length)

exports.calculateCycleLength = (start, end) => {
  return Math.round((end - start) / MS_IN_DAY)
}

exports.calculateAverageCycle = (cycles) => {
  if (cycles.length === 0) return 28
  const lengths = cycles.map(c => c.cycleLength)
  return average(lengths.slice(-6))
}

exports.predictNextPeriod = (lastStart, avgCycleLength) => {
  return new Date(lastStart.getTime() + avgCycleLength * MS_IN_DAY)
}

exports.calculateOvulationDate = (nextPeriod) => {
  return new Date(nextPeriod.getTime() - 14 * MS_IN_DAY)
}

exports.getFertileWindow = (ovulationDate) => {
  const start = new Date(ovulationDate.getTime() - 5 * MS_IN_DAY)
  const end = new Date(ovulationDate.getTime() + 1 * MS_IN_DAY)
  return { start, end }
}

exports.getCyclePhase = (periodStart, avgCycleLength, today = new Date()) => {
  const day = Math.floor((today - periodStart) / MS_IN_DAY) + 1

  if (day <= 0) return 'unknown'
  if (day <= 5) return 'menstrual'
  if (day < avgCycleLength - 14) return 'follicular'
  if (day <= avgCycleLength - 12) return 'ovulatory'
  if (day <= avgCycleLength) return 'luteal'
  return 'menstrual'
}