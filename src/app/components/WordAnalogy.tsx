'use client'
// src/app/components/WordAnalogy.tsx

import { useState } from 'react'

interface Question { stem: string; options: string[]; answer: number; explanation: string }
interface WordAnalogyData { title: string; intro: string; questions: Question[] }

export default function WordAnalogy({ data }: { data: WordAnalogyData }) {
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
          {score} / {data.questions.length} 答对
        </p>
        <p className="text-sm text-stone-400">
          {score === 4 ? '满分！太厉害了！' : score >= 3 ? '很棒！继续加油！' : '明天继续挑战！'}
        </p>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-stone-400 mb-4">{data.intro}</p>

      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-stone-400 font-medium">第 {current + 1} / {data.questions.length} 题</span>
        <div className="flex gap-1">
          {data.questions.map((_, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= current ? 'bg-stone-500' : 'bg-stone-200'}`} />
          ))}
        </div>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">{q.stem}</p>

      {/* Options */}
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

      {/* Explanation */}
      {sel !== null && (
        <div className="bg-stone-50 border border-stone-200 rounded-lg p-3 mb-4 text-sm text-stone-600 leading-relaxed">
          {q.explanation}
        </div>
      )}

      {/* Next */}
      {sel !== null && (
        <button
          onClick={() => setCurrent(c => c + 1)}
          className="w-full bg-stone-800 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-stone-700 transition-colors"
        >
          {current < data.questions.length - 1 ? '下一题' : '查看结果'}
        </button>
      )}
    </div>
  )
}
