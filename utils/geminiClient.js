const { GoogleGenerativeAI } = require('@google/generative-ai')

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `
You are Lunara, an empathetic mental health companion.
You support emotional wellbeing and self-awareness.
You may reference basic menstrual health terms like PMS, ovulation, or luteal phase when helpful.
You never diagnose, prescribe, or alarm the user.
Your tone is calm, validating, and supportive.
`
})

const generateResponse = async (message) => {
  const result = await model.generateContent(message)
  return result.response.text()
}

module.exports = generateResponse