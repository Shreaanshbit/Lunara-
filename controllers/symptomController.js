const SymptomLog = require('../models/SymptomLog')

exports.confirmSymptoms = async (req, res, next) => {
  try {
    const { symptoms, mood, intensity } = req.body

    const log = await SymptomLog.create({
      user: req.user._id,
      symptoms,
      mood,
      intensity: Math.min(5, Math.max(1, intensity))
    })

    res.status(201).json({
      success: true,
      log
    })
  } catch (err) {
    next(err)
  }
}