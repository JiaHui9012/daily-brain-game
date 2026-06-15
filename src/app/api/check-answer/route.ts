import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'
import { toLanguage } from '@/lib/i18n'
import { Redis } from '@upstash/redis';
import { GameType } from '@/lib/gameTypes';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash'

// Initialize Redis
const redis = Redis.fromEnv();

type CheckStatus = 'correct' | 'partial' | 'wrong'

function fallbackResponse(status: CheckStatus, feedback: string) {
  return NextResponse.json({
    status,
    isCorrect: status === 'correct',
    feedback,
  })
}

export async function POST(req: NextRequest) {
  const date = new Date()
  const dateStr = date.toISOString().slice(0, 10)
  const cacheKey = `game:${dateStr}`
  try {
    const {
      gameType,
      quesNo,
      // scenario,
      // correctAnswer,
      // fullAnswer,
      userAnswer,
      lang: rawLang,
    } = await req.json()

    const lang = toLanguage(rawLang)
    const languageName = lang === 'zh' ? 'Chinese' : 'English'

    if (!gameType) {
      return NextResponse.json(
        { error: 'Missing game type' },
        { status: 400 }
      )
    }

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

    if (gameType === 'sudoku') {
      const userGrid = userAnswer as (number | null)[][]
      const solution = gameData.solution as number[][]
      let complete = true
      let correct = true
      const wrongCells: { row: number; col: number }[] = []

      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (gameData.puzzle[r][c] !== 0) continue
          if (!userGrid[r][c]) { complete = false; continue }
          if (userGrid[r][c] !== solution[r][c]) {
            correct = false
            wrongCells.push({ row: r, col: c })
          }
        }
      }
      return NextResponse.json({ complete, correct, wrongCells })
    }

    if (gameType === 'sequence') {
      const seq = gameData.sequences?.[quesNo]
      if (!seq) return NextResponse.json({ error: 'Invalid question' }, { status: 400 })
      const correct = parseInt(userAnswer) === seq.answer
      return NextResponse.json({
        correct,
        answer: seq.answer,
        rule: seq.rule,
      })
    }

    if (gameType === 'word_analogy') {
      const q = gameData.questions?.[quesNo]
      if (!q) return NextResponse.json({ error: 'Invalid question' }, { status: 400 })
      const correct = parseInt(userAnswer) === q.answer
      return NextResponse.json({
        correct,
        answer: q.answer,
        explanation: q.explanation,
      })
    }

    if (gameType === 'riddle' || gameType === 'logic_puzzle') {
      if (!userAnswer || (gameType === 'riddle' && quesNo === undefined)) {
        return NextResponse.json(
          { error: 'Missing user answer or question number' },
          { status: 400 }
        )
      }
      if (gameType === 'riddle' && !gameData.riddles?.[quesNo]) {
        return NextResponse.json(
          { error: 'Invalid question number' },
          { status: 400 }
        )
      }
      const scenario = gameType === 'logic_puzzle' ? gameData.scenario : undefined
      const question = gameType === 'logic_puzzle' ? gameData.question : gameData.riddles[quesNo]?.question
      const correctAnswer = gameType === 'logic_puzzle' ? gameData.answer_short : gameData.riddles[quesNo]?.answer
      const fullAnswer = gameType === 'logic_puzzle' ? gameData.answer : gameData.riddles[quesNo]?.explanation
      let parsed: { status: string; isCorrect: boolean; feedback?: string }

      function normalizeAnswer(value: string) {
        return value.toLowerCase().replace(/[\s，。！？、,.!?]/g, '')
      }
      const normUser = normalizeAnswer(userAnswer)
      const normCorrect = normalizeAnswer(correctAnswer)
      const isExactMatch = normUser === normCorrect
      const isLogicMatch = normUser.length > 0 && (
        isExactMatch ||
        normCorrect.includes(normUser) ||
        normUser.includes(normCorrect)
      )

      if (
        (gameType === 'riddle' && isExactMatch) ||
        (gameType === 'logic_puzzle' && isLogicMatch)
      ) {
        // Handle exact answer logic
        parsed = {
          status: 'correct',
          isCorrect: true,
          feedback: undefined,
        }
      } else {
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
        parsed = JSON.parse(json)
      }

      if (!['correct', 'partial', 'wrong'].includes(parsed.status)) {
        throw new Error('Invalid check status')
      }

      return NextResponse.json({
        status: parsed.status,
        isCorrect: parsed.status === 'correct',
        feedback: String(parsed.feedback || ''),
        answer: parsed.status === 'correct' ? correctAnswer : undefined,
        explanation: parsed.status === 'correct' ? fullAnswer : undefined,
      })
    }
  } catch (err: unknown) {
    console.error('Answer check error:', err)
    const feedback = 'I could not check that answer just now. Please try again.'+err
    return fallbackResponse('wrong', feedback)
  }
}
