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
  const [userAnswer, setUserAnswer] = useState('')
  const [checked, setChecked] = useState(false)

  function normalizeAnswer(value: string) {
    return value.toLowerCase().replace(/[\s，。！？、,.!?]/g, '')
  }

  const correctAnswer = normalizeAnswer(data.answer_short)
  const normalizedUserAnswer = normalizeAnswer(userAnswer)
  const isCorrect =
    normalizedUserAnswer.length > 0 &&
    (normalizedUserAnswer === correctAnswer ||
      correctAnswer.includes(normalizedUserAnswer) ||
      normalizedUserAnswer.includes(correctAnswer))

  function checkAnswer() {
    if (!userAnswer.trim()) return
    setChecked(true)
  }

  return (
    <div>
      <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
        <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">题目</div>
        <p className="text-sm leading-relaxed text-stone-700">{data.scenario}</p>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">{data.question}</p>

      <div className="mb-4">
        <label htmlFor="logic-answer" className="block text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">
          作答
        </label>
        <div className="flex gap-2">
          <input
            id="logic-answer"
            value={userAnswer}
            onChange={e => {
              setUserAnswer(e.target.value)
              setChecked(false)
            }}
            onKeyDown={e => {
              if (e.key === 'Enter') checkAnswer()
            }}
            placeholder="输入你的答案..."
            className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-400"
          />
          <button
            onClick={checkAnswer}
            disabled={!userAnswer.trim()}
            className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            检查
          </button>
        </div>
        {checked && (
          <p className={`mt-2 text-sm font-medium ${isCorrect ? 'text-green-700' : 'text-red-500'}`}>
            {isCorrect ? '答对了！' : '还不对，可以查看提示或继续推理。'}
          </p>
        )}
      </div>

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
