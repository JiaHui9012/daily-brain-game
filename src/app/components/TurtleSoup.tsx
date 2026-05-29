'use client'
// src/app/components/TurtleSoup.tsx

import { useState } from 'react'

interface TurtleSoupData {
  title: string
  scenario: string
  question: string
  hints: string[]
  answer: string
  key_points: string
}

export default function TurtleSoup({ data }: { data: TurtleSoupData }) {
  const [hintsOpen, setHintsOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)

  return (
    <div>
      {/* Scenario */}
      <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
        <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">情境</div>
        <p className="text-sm leading-relaxed text-stone-700">{data.scenario}</p>
      </div>

      {/* Question */}
      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">
        {data.question}
      </p>

      {/* Hints */}
      <div className="mb-4">
        <button
          onClick={() => setHintsOpen(!hintsOpen)}
          className="w-full flex items-center gap-2 text-sm text-stone-500 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
        >
          <span>💡</span>
          <span>查看提示（共 {data.hints.length} 条）</span>
          <span className="ml-auto">{hintsOpen ? '▲' : '▼'}</span>
        </button>
        {hintsOpen && (
          <div className="mt-2 flex flex-col gap-2">
            {data.hints.map((h, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-600 leading-relaxed">
                <strong>提示 {i + 1}：</strong>{h}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Answer */}
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
            <p className="text-sm leading-relaxed text-stone-700 mb-2">
              <strong>完整故事：</strong>{data.answer}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>关键点：</strong>{data.key_points}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
