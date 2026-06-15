'use client'
// src/app/components/WordAnalogy.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'
import { GameProgress } from '@/lib/progress';

interface Question { stem: string; options: string[]; answer: number; explanation: string }
interface WordAnalogyData { title: string; intro: string; questions: Question[] }
interface WordAnalogyProps {
  data: WordAnalogyData
  lang: Language
  progress: GameProgress | null
  onProgress: (p: GameProgress) => void
}

const TEXT = {
  en: {
    correctCount: 'correct',
    perfect: 'Perfect score! Nicely done!',
    good: 'Great work. Keep going!',
    tomorrow: 'Come back tomorrow for a new challenge!',
    question: 'Question',
    next: 'Next',
    results: 'View Results',
  },
  zh: {
    correctCount: '答对',
    perfect: '满分！太厉害了！',
    good: '很棒！继续加油！',
    tomorrow: '明天继续挑战！',
    question: '题',
    next: '下一题',
    results: '查看结果',
  },
}

export default function WordAnalogy({ data, lang, progress, onProgress }: WordAnalogyProps) {
  const text = TEXT[lang]
  const [checking, setChecking] = useState(false)
  const [current, setCurrent] = useState<number>(
    () => progress?.state?.current ?? 0
  )
  const [selected, setSelected] = useState<(number | null)[]>(
    () => progress?.state?.selected ?? data.questions.map(() => null)
  )
  const [score, setScore] = useState<number>(
    () => progress?.state?.score ?? 0
  )
  type RevealedQuestion = { answer: number; explanation: string } | null
  const [revealedQuestions, setRevealedQuestions] = useState<RevealedQuestion[]>(
    progress?.state?.revealedQuestions ?? data.questions.map(() => null)
  )

  const q = data.questions[current]
  const sel = selected[current]
  const isDone = current >= data.questions.length

  function saveState(updates: { current?: number; selected?: (number | null)[]; score?: number; revealedQuestions?: RevealedQuestion[] }) {
    const newState = {
      current: updates.current ?? current,
      selected: updates.selected ?? selected,
      score: updates.score ?? score,
      revealedQuestions: updates.revealedQuestions ?? revealedQuestions,
    }
    const solved = (updates.selected ?? selected).every((v): v is number => v !== null)
    onProgress({ solved, state: newState })
  }

  async function select(idx: number) {
    if (sel !== null) return
    const newSelected = selected.map((v, i) => i === current ? idx : v)
    setSelected(newSelected)
    setChecking(true)

    // fetch answer from server
    const res = await fetch('/api/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameType: 'word_analogy', quesNo: current, userAnswer: idx, lang }),
    })
    const result = await res.json()
    const newRevealedQuestions = revealedQuestions.map((v, i) =>
      i === current ? { answer: result.answer, explanation: result.explanation } : v
    )
    setRevealedQuestions(newRevealedQuestions)
    setChecking(false)

    const newScore = idx === result.answer ? score + 1 : score
    if (idx === result.answer) setScore(newScore)
    saveState({ selected: newSelected, score: newScore, revealedQuestions: newRevealedQuestions })
  }

  function handleNext() {
    const next = current + 1
    setCurrent(next)
    saveState({ current: next })
  }

  if (isDone) {
    return (
      <div className="text-center py-8">
        <div className="text-5xl mb-4">{score >= 3 ? '🎉' : '💪'}</div>
        <p className="font-serif text-xl font-semibold text-stone-700 mb-1">
          {score} / {data.questions.length} {text.correctCount}
        </p>
        <p className="text-sm text-stone-400">
          {score === data.questions.length ? text.perfect : score >= 3 ? text.good : text.tomorrow}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-stone-400 mb-4">{data.intro}</p>

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-stone-400 font-medium">
          {lang === 'zh' ? `第 ${current + 1} / ${data.questions.length} 题` : `${text.question} ${current + 1} / ${data.questions.length}`}
        </span>
        <div className="flex gap-1">
          {data.questions.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= current ? 'bg-stone-500' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">{q.stem}</p>

      <div className="grid grid-cols-2 gap-2 mb-4">
        {q.options.map((opt, idx) => {
          let cls = 'border border-stone-200 rounded-lg py-3 px-4 text-sm font-medium text-center cursor-pointer transition-colors'
          if (sel !== null) {
            if (idx === revealedQuestions[current]?.answer) cls += ' bg-green-50 border-green-400 text-green-800'
            else if (!checking && idx === sel) cls += ' bg-red-50 border-red-400 text-red-800'
            else cls += ' text-stone-400'
          } else {
            cls += ' text-stone-700 hover:bg-stone-50'
          }
          return (
            <button key={idx} onClick={() => select(idx)} disabled={sel !== null} className={cls}>
              {opt}
            </button>
          )
        })}
      </div>

      {sel !== null && revealedQuestions[current] && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-4 text-sm text-stone-600 leading-relaxed">
          {revealedQuestions[current]!.explanation}
        </div>
      )}

      {sel !== null && (
        <button
          onClick={handleNext}
          className="w-full bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          {current < data.questions.length - 1 ? text.next : text.results}
        </button>
      )}
    </div>
  )
}
