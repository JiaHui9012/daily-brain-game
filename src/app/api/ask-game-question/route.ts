import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { toLanguage } from '@/lib/i18n'
import { Redis } from '@upstash/redis';
import { GameType } from '@/lib/gameTypes';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'
// Initialize Redis
const redis = Redis.fromEnv();

export async function POST(req: NextRequest) {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10)
  const cacheKey = `game:${dateStr}`
  try {
    const { gameType, question, lang: rawLang } = await req.json()
    const lang = toLanguage(rawLang)
    const languageName = lang === 'zh' ? 'Chinese' : 'English'
    const cached = await redis.get<{ 
                                gameType: GameType
                                gameData: Record<string, any>
                              }>(cacheKey)
    if (!cached || cached.gameType.id !== gameType) {
      return NextResponse.json(
        { error: 'Game data not found for today' },
        { status: 404 }
      )
    }
    const gameData = cached.gameData[lang] ?? cached.gameData['en']

    if (!question || !gameData.answer) {
      return NextResponse.json(
        { error: 'Missing question or answer context' },
        { status: 400 }
      )
    }

    const prompt = `You are the host of a turtle soup lateral thinking puzzle.
                    Only answer the player's question based on the truth below.
                    Reply in ${languageName} with valid JSON only:
                    {
                      "reply": "Only answer yes / no / not important / cannot determine, plus one short sentence if helpful",
                      "isCorrect": true if you think the player input has reached the answer, else false 
                    }

                    Scenario: ${gameData.scenario || ''}
                    Truth: ${gameData.answer}
                    Key point: ${gameData.key_points || ''}
                    Player question: ${question}`

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL })
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
    const json = raw.replace(/```json|```/g, '').trim()
    const parsedJson = JSON.parse(json)
    if(!parsedJson.reply || typeof parsedJson.isCorrect !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid response format from AI', details: raw },
        { status: 500 }
      )
    }
    if(parsedJson.isCorrect){
      parsedJson.answer = gameData.answer
      parsedJson.keyPoint = gameData.key_points
    }

    return NextResponse.json(parsedJson)
  } catch (err: unknown) {
    console.error('Question answer error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to answer question', details: message },
      { status: 500 }
    )
  }
}
