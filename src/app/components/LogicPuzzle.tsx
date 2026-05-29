'use client'
// src/app/components/LogicPuzzle.tsx

import { useState } from 'react'

interface LogicData {
  title: string
  scenario: string
  question: string
  hints: string[]
  answer: string
  answer_short: string
}

export default function LogicPuzzle({ data }: { data: LogicData }) {
  const [hintsOpen, setHintsOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  return (
    <div>
      <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
        <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">题目</div>
        <p className="text-sm leading-relaxed text-stone-700">{data.scenario}</p>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">{data.question}</p>

      <div className="mb-4">
        <button
          onClick={() => setHintsOpen(!hintsOpen)}
          className="w-full flex items-center gap-2 text-sm text-stone-500 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
        >
          <span>💡</span>
          <span>查看提示</span>
          <span className="ml-auto">{hintsOpen ? '▲' : '▼'}</span>
        </button>
        {hintsOpen && (
          <div className="mt-2 flex flex-col gap-2">
            {(data.hints || []).map((h, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-600 leading-relaxed">
                <strong>提示 {i + 1}：</strong>{h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <button
          onClick={() => setAnswerOpen(!answerOpen)}
          className="w-full flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
        >
          <span>👁</span>
          <span>揭晓答案</span>
        </button>
        {answerOpen && (
          <div className="mt-2 bg-stone-50 border border-stone-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-stone-700 mb-2">答案：{data.answer_short}</p>
            <p className="text-xs text-stone-500 leading-relaxed">{data.answer}</p>
          </div>
        )}
      </div>
    </div>
  )
}
