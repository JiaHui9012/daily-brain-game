import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export async function POST(req: NextRequest) {
  try {
    const { scenario, answer, keyPoints, question } = await req.json()

    if (!question || !answer) {
      return NextResponse.json(
        { error: 'Missing question or answer context' },
        { status: 400 }
      )
    }

    const prompt = `You are the host of a Chinese turtle soup lateral thinking puzzle.
Only answer the player's question based on the truth below.
Reply in Chinese with valid JSON only:
{
  "reply": "只能是：是 / 不是 / 不重要 / 无法判断, plus one short sentence if helpful",
  "isRelevant": true
}

Scenario: ${scenario || ''}
Truth: ${answer}
Key point: ${keyPoints || ''}
Player question: ${question}`

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const json = raw.replace(/```json|```/g, '').trim()

    return NextResponse.json(JSON.parse(json))
  } catch (err: unknown) {
    console.error('Question answer error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to answer question', details: message },
      { status: 500 }
    )
  }
}
