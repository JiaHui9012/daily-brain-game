'use client'
// src/app/components/WordAnalogy.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'

interface Question { stem: string; options: string[]; answer: number; explanation: string }
interface WordAnalogyData { title: string; intro: string; questions: Question[] }

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

export default function WordAnalogy({ data, lang }: { data: WordAnalogyData; lang: Language }) {
  const text = TEXT[lang]
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<(number | null)[]>(data.questions.map(() => null))
  const [score, setScore] = useState(0)

  const q = data.questions[current]
  const sel = selected[current]
  const isDone = current >= data.questions.length

  function select(idx: number) {
    if (sel !== null) return
    const newSelected = selected.map((v, i) => i === current ? idx : v)
    setSelected(newSelected)
    if (idx === q.answer) setScore(s => s + 1)
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
            if (idx === q.answer) cls += ' bg-green-50 border-green-400 text-green-800'
            else if (idx === sel) cls += ' bg-red-50 border-red-400 text-red-800'
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

      {sel !== null && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-4 text-sm text-stone-600 leading-relaxed">
          {q.explanation}
        </div>
      )}

      {sel !== null && (
        <button
          onClick={() => setCurrent(c => c + 1)}
          className="w-full bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          {current < data.questions.length - 1 ? text.next : text.results}
        </button>
      )}
    </div>
  )
}
