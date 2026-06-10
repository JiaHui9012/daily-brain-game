'use client'
// src/app/components/Riddle.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'

interface RiddleItem { question: string; answer: string; explanation: string }
interface RiddleData { title: string; riddles: RiddleItem[] }

type CheckStatus = 'correct' | 'partial' | 'wrong'

const TEXT = {
  en: {
    completeTitle: 'All done!',
    completeText: "Today's challenge is finished. Come back tomorrow!",
    question: 'Question',
    placeholder: 'Type your answer...',
    check: 'Check',
    checking: 'Checking',
    correct: 'Correct!',
    partial: 'Close, but not quite.',
    wrong: 'Not quite. Try again.',
    answer: 'Answer',
    reveal: 'Reveal answer',
    next: 'Next',
    result: 'Finish',
    skip: 'Skip',
  },
  zh: {
    completeTitle: '全部完成！',
    completeText: '今日挑战结束，明天继续！',
    question: '题',
    placeholder: '输入你的答案...',
    check: '检查',
    checking: '检查中',
    correct: '答对了！',
    partial: '很接近，但还差一点。',
    wrong: '还不对，可以再想想。',
    answer: '答案',
    reveal: '揭晓答案',
    next: '下一题',
    result: '完成',
    skip: '跳过',
  },
}

function normalizeAnswer(value: string) {
  return value.toLowerCase().replace(/[\s，。！？、,.!?]/g, '')
}

export default function Riddle({ data, lang }: { data: RiddleData; lang: Language }) {
  const text = TEXT[lang]
  const [current, setCurrent] = useState(0)
  const [revealed, setRevealed] = useState<boolean[]>(data.riddles.map(() => false))
  const [answers, setAnswers] = useState<string[]>(data.riddles.map(() => ''))
  const [checkResults, setCheckResults] = useState<({ status: CheckStatus; feedback: string } | null)[]>(
    data.riddles.map(() => null)
  )
  const [checking, setChecking] = useState(false)

  const allDone = current >= data.riddles.length
  const riddle = data.riddles[current]
  const isRevealed = revealed[current]
  const userAnswer = answers[current] || ''
  const checkResult = checkResults[current]
  const exactMatch = !allDone && normalizeAnswer(userAnswer) === normalizeAnswer(riddle.answer)
  const isLast = current === data.riddles.length - 1

  function reveal() {
    setRevealed(prev => prev.map((v, i) => i === current ? true : v))
  }

  async function checkAnswer() {
    if (!userAnswer.trim() || checking) return

    if (exactMatch) {
      setCheckResults(prev => prev.map((v, i) => i === current ? { status: 'correct', feedback: text.correct } : v))
      reveal()
      return
    }

    setChecking(true)
    setCheckResults(prev => prev.map((v, i) => i === current ? null : v))

    try {
      const res = await fetch('/api/check-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameType: 'riddle',
          question: riddle.question,
          correctAnswer: riddle.answer,
          fullAnswer: riddle.explanation,
          userAnswer,
          lang,
        }),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      const status: CheckStatus =
        result.status === 'correct' || result.status === 'partial' ? result.status : 'wrong'

      setCheckResults(prev => prev.map((v, i) => i === current
        ? {
            status,
            feedback: result.feedback || (status === 'correct' ? text.correct : status === 'partial' ? text.partial : text.wrong),
          }
        : v
      ))

      if (status === 'correct') reveal()
    } catch {
      setCheckResults(prev => prev.map((v, i) => i === current ? { status: 'wrong', feedback: text.wrong } : v))
    } finally {
      setChecking(false)
    }
  }

  if (allDone) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🎉</div>
        <p className="font-serif text-xl font-semibold text-stone-700 mb-2">{text.completeTitle}</p>
        <p className="text-sm text-stone-400">{text.completeText}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-stone-400 font-medium">
          {lang === 'zh' ? `第 ${current + 1} / ${data.riddles.length} 题` : `${text.question} ${current + 1} / ${data.riddles.length}`}
        </span>
        <div className="flex gap-1">
          {data.riddles.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= current ? 'bg-stone-500' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">
        {riddle.question}
      </p>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            value={userAnswer}
            onChange={e => {
              const next = e.target.value
              setAnswers(prev => prev.map((v, i) => i === current ? next : v))
              setCheckResults(prev => prev.map((v, i) => i === current ? null : v))
            }}
            onKeyDown={e => { if (e.key === 'Enter') checkAnswer() }}
            placeholder={text.placeholder}
            className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-400"
          />
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim() || checking || isRevealed}
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

      {isRevealed && (
        <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
          <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-1">{text.answer}</div>
          <p className="text-sm font-semibold text-stone-700 mb-1">{riddle.answer}</p>
          <p className="text-xs text-stone-400 leading-relaxed">{riddle.explanation}</p>
        </div>
      )}

      <div className="flex gap-2 mt-2">
        {!isRevealed && (
          <button onClick={reveal} className="flex-1 bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors">
            {text.reveal}
          </button>
        )}
        {isRevealed && !isLast && (
          <button onClick={() => setCurrent(c => c + 1)} className="flex-1 bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors">
            {text.next}
          </button>
        )}
        {isRevealed && isLast && (
          <button onClick={() => setCurrent(data.riddles.length)} className="flex-1 bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors">
            {text.result}
          </button>
        )}
        {!isRevealed && !isLast && (
          <button onClick={() => setCurrent(c => c + 1)} className="border border-stone-200 text-stone-500 rounded-lg py-2.5 px-4 text-sm font-medium hover:bg-stone-50 transition-colors">
            {text.skip}
          </button>
        )}
      </div>
    </div>
  )
}
