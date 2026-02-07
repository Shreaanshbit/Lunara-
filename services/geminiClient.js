const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
})

exports.generateChatResponse = async ({ message, phase }) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `
You are Lunara, a gentle mental health companion.
Use basic medical terms.
Do not diagnose or prescribe.
Be empathetic and calm.

User cycle phase: ${phase}
User message: "${message}"
`
  })

  return response.text
}