// src/app/api/generate-game/route.ts
// This runs on the SERVER — your API_KEY stays secret.

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { GAME_PROMPTS, getGameTypeForDate, GameTypeId, GAME_SAMPLE } from '@/lib/gameTypes'

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export async function GET(req: NextRequest) {
  // Accept an optional ?date=YYYY-MM-DD for testing; defaults to today
  const dateParam = req.nextUrl.searchParams.get('date')
  const date = dateParam ? new Date(dateParam) : new Date()

  const gameType = getGameTypeForDate(date)
  const prompt = GAME_PROMPTS[gameType.id as GameTypeId]

  try {
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    })
    const result = await model.generateContent(prompt)

    const raw = result.response.text()

    // Strip markdown fences if present
    const json = raw.replace(/```json|```/g, '').trim()
    const gameData = JSON.parse(json)
	
	// use GAME_SAMPLE if dont want to waste rate limits
	// const gameDatas = GAME_SAMPLE[gameType.id as GameTypeId]
	// const randomIndex = Math.floor(Math.random() * gameDatas.length)
	// const gameData = gameDatas[randomIndex]

    return NextResponse.json({
      gameType,
      gameData,
      date: date.toISOString().slice(0, 10),
    })
  } catch (err: unknown) {
    console.error('Game generation error:', err)
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json(
      { error: 'Failed to generate game', details: message },
      { status: 500 }
    )
  }
}
