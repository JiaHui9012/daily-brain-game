// src/app/api/generate-game/route.ts
// This runs on the SERVER — your ANTHROPIC_API_KEY stays secret.

import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { GAME_PROMPTS, getGameTypeForDate, GameTypeId } from '@/lib/gameTypes'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function GET(req: NextRequest) {
  // Accept an optional ?date=YYYY-MM-DD for testing; defaults to today
  const dateParam = req.nextUrl.searchParams.get('date')
  const date = dateParam ? new Date(dateParam) : new Date()

  const gameType = getGameTypeForDate(date)
  const prompt = GAME_PROMPTS[gameType.id as GameTypeId]

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = message.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as { type: 'text'; text: string }).text)
      .join('')

    // Strip markdown fences if present
    const json = raw.replace(/```json|```/g, '').trim()
    const gameData = JSON.parse(json)

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
