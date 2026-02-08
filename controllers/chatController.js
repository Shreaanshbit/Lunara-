const ChatSession = require('../models/ChatSession')
const Cycle = require('../models/Cycle')
const { generateChatResponse } = require('../services/geminiClient')
const { calculateAverageCycle, getCyclePhase } = require('../utils/cyclePrediction')
const { extractSymptoms }=require('../services/geminiClient');
const SymptomLog=require('../models/SymptomLog');

exports.chatWithLunara = async (req, res, next) => {
  try {
    const { message } = req.body

    let session = await ChatSession.findOne({ user: req.user._id })

    if (!session) {
      session = await ChatSession.create({
        user: req.user._id,
        messages: []
      })
    }

    const cycles = await Cycle.find({ user: req.user._id }).sort({
      periodStart: -1
    })

    const avgCycleLength = calculateAverageCycle(cycles)
    const phase = cycles.length
      ? getCyclePhase(cycles[0].periodStart, avgCycleLength)
      : 'unknown'

    session.messages.push({ role: 'user', content: message })

    const reply = await generateChatResponse({
      message,
      phase
    })

    session.messages.push({ role: 'assistant', content: reply })
    await session.save()

    const extracted = await extractSymptoms({ message })

    if (extracted && (extracted.mood || extracted.symptoms?.length)) {
    await SymptomLog.create({
        user: req.user._id,
        mood: extracted.mood,
        symptoms: extracted.symptoms || [],
        // intensity: extracted.intensity
    })
    }
    res.json({
      success: true,
      reply,
      phase
    })
  } catch (err) {
    next(err)
  }
}