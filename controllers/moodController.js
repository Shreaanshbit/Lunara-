const MoodLog = require('../models/moodLog')

exports.createMoodLog = async (req, res, next) => {
  try {
    const log = await MoodLog.create({
      user: req.user._id,
      mood: req.body.mood,
      stressLevel: req.body.stressLevel,
      anxietyLevel: req.body.anxietyLevel,
      energyLevel: req.body.energyLevel,
      notes: req.body.notes
    })

    res.status(201).json({ success: true, log })
  } catch (err) {
    next(err)
  }
}

exports.getMoodLogs = async (req, res, next) => {
  try {
    const logs = await MoodLog.find({ user: req.user._id }).sort({ date: -1 })
    res.json({ success: true, logs })
  } catch (err) {
    next(err)
  }
}

exports.deleteMoodLog = async (req, res, next) => {
  try {
    await MoodLog.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    })
    res.json({ success: true })
  } catch (err) {
    next(err)
  }
}