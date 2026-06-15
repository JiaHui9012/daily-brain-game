// src/app/api/reveal-answer/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'
import { toLanguage } from '@/lib/i18n'

const redis = Redis.fromEnv()

export async function POST(req: NextRequest) {
  const { gameType, quesNo, lang: rawLang } = await req.json()
  const lang = toLanguage(rawLang)
  const dateStr = new Date().toISOString().slice(0, 10)
  const cached = await redis.get<{ gameData: Record<string, any> }>(`game:${dateStr}`)

  if (!cached) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  const gameData = cached.gameData[lang] ?? cached.gameData['en']

  if (gameType === 'riddle') {
    const riddle = gameData.riddles?.[quesNo]
    if (!riddle) return NextResponse.json({ error: 'Invalid question' }, { status: 400 })
    return NextResponse.json({ answer: riddle.answer, explanation: riddle.explanation })
  }

  if (gameType === 'logic_puzzle') {
    return NextResponse.json({ answer: gameData.answer_short, explanation: gameData.answer })
  }

  if (gameType === 'turtle_soup') {
    return NextResponse.json({ answer: gameData.answer, explanation: gameData.key_points })
  }

  return NextResponse.json({ error: 'Unsupported game type' }, { status: 400 })
}