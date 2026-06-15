// src/app/api/generate-game/route.ts
// This runs on the SERVER — your API_KEY stays secret.

import { GoogleGenerativeAI } from '@google/generative-ai' // Gemini
// import Anthropic from '@anthropic-ai/sdk' // Claude
import { NextRequest, NextResponse } from 'next/server'
import { getGamePrompt, getGameTypeForDate, GameTypeId, GAME_SAMPLE, Difficulty, GameType } from '@/lib/gameTypes'
import { toLanguage } from '@/lib/i18n'
import { validateGameData } from '@/lib/validateGame'
import { generateSudoku  } from '@/lib/sudoku'
import { Redis } from '@upstash/redis';

// Gemini
const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
)
// Claude
// const client = new Anthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY,
// })

// Initialize Redis
const redis = Redis.fromEnv();

const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

// Helper to strip answers from gameData before sending to client
function stripAnswers(gameTypeId: string, gameData: Record<string, any>): Record<string, any> {
  const strip = (langData: any) => {
    if (!langData) return langData
    const d = { ...langData }
    
    if (gameTypeId === 'sudoku') {
      delete d.solution
    }
    if (gameTypeId === 'riddle') {
      d.riddles = d.riddles?.map((r: any) => ({ question: r.question }))
    }
    if (gameTypeId === 'logic_puzzle') {
      delete d.answer
      delete d.answer_short
    }
    if (gameTypeId === 'sequence') {
      d.sequences = d.sequences?.map((s: any) => ({ sequence: s.sequence }))
    }
    if (gameTypeId === 'word_analogy') {
      d.questions = d.questions?.map((q: any) => ({ stem: q.stem, options: q.options }))
    }
    if (gameTypeId === 'turtle_soup') {
      delete d.answer
      delete d.key_points
    }
    return d
  }

  return {
    en: strip(gameData.en),
    zh: strip(gameData.zh),
  }
}

export async function GET(req: NextRequest) {
  // Accept an optional ?date=YYYY-MM-DD for testing; defaults to today
  // const dateParam = req.nextUrl.searchParams.get('date')
  const lang = toLanguage(req.nextUrl.searchParams.get('lang'))
  const date = new Date() // dateParam ? new Date(dateParam) : new Date()
  const dateStr = date.toISOString().slice(0, 10)
  const cacheKey = `game:${dateStr}`

  try {
    // Check cache first
    const cached = await redis.get<{ gameType: GameType, gameData: object }>(cacheKey)
    if (cached) {
      return NextResponse.json({
        gameType: cached.gameType,
        gameData: stripAnswers(cached.gameType.id, cached.gameData),
        date: dateStr,
        cached: true,
      })
    }

    const gameType = getGameTypeForDate(date, lang)
    const prompt = getGamePrompt(gameType.id, lang)

    if (gameType.id === 'sudoku') {
      const difficulties: Difficulty[] = ['easy', 'medium', 'hard']
      const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)]
      const sudoku = generateSudoku(randomDifficulty)
      const gameData = validateGameData(gameType.id, {
        en: {
          title: "Today's Sudoku",
          difficulty: sudoku.difficulty,
          puzzle: sudoku.puzzle,
          solution: sudoku.solution,
        },
        zh: {
          title: '今日数独',
          difficulty: sudoku.difficulty,
          puzzle: sudoku.puzzle,
          solution: sudoku.solution,
        },
      })
      const payload = { gameType, gameData }
      await redis.set(`game:${dateStr}`, payload, { ex: 60 * 60 * 24 * 2 }) // Cache for 2 days

      return NextResponse.json({
        gameType,
        gameData: stripAnswers(gameType.id, gameData),
        date: dateStr,
      })
    }

    // Gemini
    const model = genAI.getGenerativeModel({
      model: GEMINI_MODEL,
    })
    const result = await model.generateContent(prompt)
    const raw = result.response.text()

    // Claude
    // // const message = await client.messages.create({
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

    const payload = { gameType, gameData }
    await redis.set(`game:${dateStr}`, payload, { ex: 60 * 60 * 24 * 2 }) // Cache for 2 days

    return NextResponse.json({
      gameType,
      gameData: stripAnswers(gameType.id, gameData),
      date: dateStr,
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
