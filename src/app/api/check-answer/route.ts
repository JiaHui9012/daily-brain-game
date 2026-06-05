import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { toLanguage } from '@/lib/i18n'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

type CheckStatus = 'correct' | 'partial' | 'wrong'

function fallbackResponse(status: CheckStatus, feedback: string) {
  return NextResponse.json({
    status,
    isCorrect: status === 'correct',
    feedback,
  })
}

export async function POST(req: NextRequest) {
  try {
    const {
      gameType,
      question,
      scenario,
      correctAnswer,
      fullAnswer,
      userAnswer,
      lang: rawLang,
    } = await req.json()

    const lang = toLanguage(rawLang)
    const languageName = lang === 'zh' ? 'Chinese' : 'English'

    if (!gameType || !correctAnswer || !userAnswer) {
      return NextResponse.json(
        { error: 'Missing game type, correct answer, or user answer' },
        { status: 400 }
      )
    }

    const prompt = `You are checking a player's answer to a brain game.
Return ONLY valid JSON with this exact shape:
{
  "status": "correct" | "partial" | "wrong",
  "isCorrect": true | false,
  "feedback": "one short sentence in ${languageName}"
}

Rules:
- Accept equivalent wording and synonyms.
- For logic puzzles, mark correct when the player reaches the right conclusion. Mark partial when they identify only part of the conclusion or miss important reasoning.
- For riddles, be stricter: accept synonyms of the answer, but reject vague related ideas.
- Do not reveal the correct answer when the status is "wrong" or "partial".
- Feedback must be encouraging and concise.

Game type: ${gameType}
Scenario: ${scenario || ''}
Question: ${question || ''}
Correct answer: ${correctAnswer}
Full solution or explanation: ${fullAnswer || correctAnswer}
Player answer: ${userAnswer}`

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const json = raw.replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(json)

    if (!['correct', 'partial', 'wrong'].includes(parsed.status)) {
      throw new Error('Invalid check status')
    }

    return NextResponse.json({
      status: parsed.status,
      isCorrect: parsed.status === 'correct',
      feedback: String(parsed.feedback || ''),
    })
  } catch (err: unknown) {
    console.error('Answer check error:', err)
    const feedback = 'I could not check that answer just now. Please try again.'
    return fallbackResponse('wrong', feedback)
  }
}
