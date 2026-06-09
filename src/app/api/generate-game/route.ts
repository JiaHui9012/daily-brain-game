// src/app/api/generate-game/route.ts
// This runs on the SERVER — your API_KEY stays secret.

import { GoogleGenerativeAI } from '@google/generative-ai' // Gemini
// import Anthropic from '@anthropic-ai/sdk' // Claude
import { NextRequest, NextResponse } from 'next/server'
import { getGamePrompt, getGameTypeForDate, GameTypeId, GAME_SAMPLE } from '@/lib/gameTypes'
import { toLanguage } from '@/lib/i18n'
import { validateGameData } from '@/lib/validateGame'

// Gemini
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)
// Claude
// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// })

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

export async function GET(req: NextRequest) {
  // Accept an optional ?date=YYYY-MM-DD for testing; defaults to today
  const dateParam = req.nextUrl.searchParams.get('date')
  const lang = toLanguage(req.nextUrl.searchParams.get('lang'))
  const date = dateParam ? new Date(dateParam) : new Date()

  const gameType = getGameTypeForDate(date, lang)
  const prompt = getGamePrompt(gameType.id, lang)

  try {
	// Gemini
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    })
    const result = await model.generateContent(prompt)
    const raw = result.response.text()
	
	// Claude
	// const message = await client.messages.create({
    //   model: 'claude-sonnet-4-20250514',
    //   max_tokens: 1024,
    //   messages: [{ role: 'user', content: prompt }],
    // })
    // const raw = message.content
    //   .filter((b) => b.type === 'text')
    //   .map((b) => (b as { type: 'text'; text: string }).text)
    //   .join('')

    // Strip markdown fences if present
    const json = raw.replace(/```json|```/g, '').trim()
	const gameData = validateGameData(gameType.id, JSON.parse(json))
	
	// use GAME_SAMPLE if dont want to waste rate limits
	// const gameDatas = GAME_SAMPLE[gameType.id as GameTypeId]
	// const randomIndex = Math.floor(Math.random() * gameDatas.length)
	// const gameData = validateGameData(gameType.id, gameDatas[randomIndex])

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
