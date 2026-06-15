'use client'
// src/app/components/LogicPuzzle.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'

interface LogicData {
  title: string
  scenario: string
  question: string
  hints: string[]
  answer: string
  answer_short: string
}

type CheckStatus = 'correct' | 'partial' | 'wrong'

const TEXT = {
  en: {
    prompt: 'Prompt',
    answerLabel: 'Your Answer',
    placeholder: 'Type your answer...',
    check: 'Check',
    checking: 'Checking',
    correct: 'Correct!',
    partial: 'Almost there.',
    wrong: 'Not quite. Check a hint or keep reasoning.',
    hints: 'View hints',
    hint: 'Hint',
    reveal: 'Reveal answer',
    answer: 'Answer: ',
  },
  zh: {
    prompt: '题目',
    answerLabel: '作答',
    placeholder: '输入你的答案...',
    check: '检查',
    checking: '检查中',
    correct: '答对了！',
    partial: '差一点。',
    wrong: '还不对，可以查看提示或继续推理。',
    hints: '查看提示',
    hint: '提示',
    reveal: '揭晓答案',
    answer: '答案：',
  },
}

export default function LogicPuzzle({ data, lang }: { data: LogicData; lang: Language }) {
  const text = TEXT[lang]
  const [hintsOpen, setHintsOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [userAnswer, setUserAnswer] = useState('')
  const [checking, setChecking] = useState(false)
  const [checkResult, setCheckResult] = useState<{ status: CheckStatus; feedback: string } | null>(null)
  type RevealedAnswer = { answer: string; explanation: string } | null
  const [revealedAnswer, setRevealedAnswer] = useState<RevealedAnswer>(null)

  async function handleReveal(open: boolean, result: { answer: string; explanation: string } | null = null) {
    setAnswerOpen(open)
    if (open && !revealedAnswer) {
      if (result != null) {
        setRevealedAnswer(result)
      } else {
        const res = await fetch('/api/reveal-answer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ gameType: 'logic_puzzle', lang }),
        })
        const data = await res.json()
        setRevealedAnswer(data)
      }
    }
  }

  async function checkAnswer() {
    if (!userAnswer.trim() || checking) return

    setChecking(true)
    setCheckResult(null)

    try {
      const res = await fetch('/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'logic_puzzle',
          userAnswer,
          lang,
        }),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      const status: CheckStatus =
        result.status === 'correct' || result.status === 'partial' ? result.status : 'wrong'

      setCheckResult({
        status,
        feedback: result.feedback || (status === 'correct' ? text.correct : status === 'partial' ? text.partial : text.wrong),
      })

      if (status === 'correct') handleReveal(true, { answer: result.answer, explanation: result.explanation })
    } catch {
      setCheckResult({ status: 'wrong', feedback: text.wrong })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div>
      <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
        <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">{text.prompt}</div>
        <p className="text-sm leading-relaxed text-stone-700">{data.scenario}</p>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">{data.question}</p>

      <div className="mb-4">
        <label htmlFor="logic-answer" className="block text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">
          {text.answerLabel}
        </label>
        <div className="flex gap-2">
          <input
            id="logic-answer"
            value={userAnswer}
            onChange={e => {
              setUserAnswer(e.target.value)
              setCheckResult(null)
            }}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer() }}
            placeholder={text.placeholder}
            className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-400"
          />
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim() || checking || answerOpen}
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {checking ? text.checking : text.check}
          </button>
        </div>
        {checkResult && (
          <p className={`mt-2 text-sm font-medium ${
            checkResult.status === 'correct'
              ? 'text-green-700'
              : checkResult.status === 'partial'
                ? 'text-amber-600'
                : 'text-red-500'
          }`}>
            {checkResult.feedback}
          </p>
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setHintsOpen(!hintsOpen)}
          className="w-full flex items-center gap-2 text-sm text-stone-500 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
        >
          <span>💡</span>
          <span>{text.hints}</span>
          <span className="ml-auto">{hintsOpen ? '▲' : '▼'}</span>
        </button>
        {hintsOpen && (
          <div className="mt-2 flex flex-col gap-2">
            {(data.hints || []).map((h, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-600 leading-relaxed">
                <strong>{text.hint} {i + 1}: </strong>{h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {/* {!answerOpen && ( */}
          <button
            onClick={() => handleReveal(!answerOpen)}
            className="w-full flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
          >
            <span>👁</span>
            <span>{text.reveal}</span>
          </button>
        {/* )} */}
        {answerOpen && (
          <div className="mt-2 bg-stone-50 border border-stone-200 rounded-lg p-4">
            {revealedAnswer ? (
              <>
                <p className="text-sm font-semibold text-stone-700 mb-2">{text.answer}{revealedAnswer.answer}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{revealedAnswer.explanation}</p>
              </>
            ) : (
              <p className="text-xs text-stone-400">Loading...</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
