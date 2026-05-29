'use client'
// src/app/components/Sequence.tsx

import { useState } from 'react'

interface SeqItem { sequence: (number | string)[]; answer: number; rule: string }
interface SequenceData { title: string; intro: string; sequences: SeqItem[] }

export default function Sequence({ data }: { data: SequenceData }) {
  const [answers, setAnswers] = useState<string[]>(data.sequences.map(() => ''))
  const [checked, setChecked] = useState<boolean[]>(data.sequences.map(() => false))

  function check(i: number) {
    setChecked(prev => prev.map((v, j) => j === i ? true : v))
  }

  return (
    <div>
      <p className="text-sm text-stone-400 mb-5">{data.intro}</p>
      {data.sequences.map((seq, i) => {
        const isChecked = checked[i]
        const correct = parseInt(answers[i]) === seq.answer
        return (
          <div key={i} className="mb-6">
            <div className="text-xs text-stone-400 font-medium mb-2">第 {i + 1} 题</div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {seq.sequence.map((n, j) => (
                <span key={j}>
                  {n === '?' ? (
                    <div className={`w-11 h-11 border-2 border-dashed rounded-lg flex items-center justify-center font-bold text-base
                      ${isChecked ? (correct ? 'border-green-400 text-green-700 bg-green-50' : 'border-red-400 text-red-700 bg-red-50') : 'border-stone-300 text-stone-400'}`}>
                      {isChecked ? (correct ? seq.answer : '✗') : '?'}
                    </div>
                  ) : (
                    <div className="w-11 h-11 bg-stone-100 border border-stone-200 rounded-lg flex items-center justify-center font-medium text-base text-stone-700">
                      {n}
                    </div>
                  )}
                  {j < seq.sequence.length - 1 && <span className="text-stone-300 text-xs mx-0.5">,</span>}
                </span>
              ))}
            </div>
            {!isChecked ? (
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="填入答案"
                  value={answers[i]}
                  onChange={e => setAnswers(prev => prev.map((v, j) => j === i ? e.target.value : v))}
                  className="w-32 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400"
                />
                <button
                  onClick={() => check(i)}
                  className="border border-stone-300 text-stone-600 rounded-lg px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                >
                  确认
                </button>
              </div>
            ) : (
              <div className={`text-sm px-3 py-2 rounded-lg ${correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {correct ? '✓ 答对了！' : `✗ 正确答案是 ${seq.answer}`}
                {' · '}规律：{seq.rule}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
