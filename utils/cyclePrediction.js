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

exports.getCyclePhase = (periodStart, avgCycleLength, date = new Date()) => {
  const day = Math.floor((date - periodStart) / MS_IN_DAY) + 1
  const ovulationDay = avgCycleLength - 14

  if (day <= 5) return 'menstrual'
  if (day < ovulationDay) return 'follicular'
  if (day === ovulationDay) return 'ovulatory'
  return 'luteal'
}