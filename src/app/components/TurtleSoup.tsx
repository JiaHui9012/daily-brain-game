'use client'
// src/app/components/TurtleSoup.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'

interface TurtleSoupData {
  title: string
  scenario: string
  question: string
  hints: string[]
  answer: string
  key_points: string
}

const MAX_QUESTIONS = 10

const TEXT = {
  en: {
    scenario: 'Scenario',
    ask: 'Ask',
    askPlaceholder: 'Ask a yes/no question...',
    sending: 'Thinking',
    send: 'Send',
    host: 'Host',
    you: 'You',
    askError: 'Question failed. Please try again.',
    hints: 'View hints',
    hint: 'Hint',
    reveal: 'Reveal answer',
    fullStory: 'Full story: ',
    keyPoint: 'Key point: ',
    limitReached: `Limit reached (${MAX_QUESTIONS}/${MAX_QUESTIONS}). Reveal the answer?`,
  },
  zh: {
    scenario: '情境',
    ask: '提问',
    askPlaceholder: '问一个是/不是问题...',
    sending: '思考中',
    send: '发送',
    host: '主持人',
    you: '你',
    askError: '提问失败，请稍后再试',
    hints: '查看提示',
    hint: '提示',
    reveal: '揭晓答案',
    fullStory: '完整故事：',
    keyPoint: '关键点：',
    limitReached: `已达提问上限（${MAX_QUESTIONS}/${MAX_QUESTIONS}），要揭晓答案吗？`,
  },
}

export default function TurtleSoup({ data, lang }: { data: TurtleSoupData; lang: Language }) {
  const text = TEXT[lang]
  const [hintsOpen, setHintsOpen] = useState(false)
  const [answerOpen, setAnswerOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)
  const [qa, setQa] = useState<{ question: string; reply: string }[]>([])
  const [askError, setAskError] = useState<string | null>(null)

  async function askQuestion() {
    const trimmed = question.trim()
    if (!trimmed || asking) return

    setAsking(true)
    setAskError(null)

    try {
      const res = await fetch('/api/ask-game-question', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: data.scenario,
          answer: data.answer,
          keyPoints: data.key_points,
          question: trimmed,
          lang,
        }),
      })

      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const result = await res.json()
      setQa(prev => [...prev, { question: trimmed, reply: result.reply }])
      setQuestion('')
	  if(result.isCorrect) {
		setAnswerOpen(true)
	  }
    } catch (err: unknown) {
      setAskError(err instanceof Error ? err.message : text.askError)
    } finally {
      setAsking(false)
    }
  }

  return (
    <div>
      <div className="bg-stone-50 border-l-2 border-stone-300 rounded-lg p-4 mb-4">
        <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-2">{text.scenario}</div>
        <p className="text-sm leading-relaxed text-stone-700">{data.scenario}</p>
      </div>

      <p className="font-serif text-base font-semibold text-stone-800 leading-relaxed mb-5">
        {data.question}
      </p>

      <div className="mb-4 rounded-lg border border-stone-200 p-3">
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="turtle-question" className="block text-xs font-medium tracking-widest text-stone-400 uppercase">
            {text.ask}
          </label>
          <span className={`text-xs font-medium ${qa.length >= MAX_QUESTIONS ? 'text-red-400' : 'text-stone-400'}`}>
            {qa.length} / {MAX_QUESTIONS}
          </span>
        </div>
        {qa.length >= MAX_QUESTIONS && (
          <p className="text-sm text-amber-600 mb-2">{text.limitReached}</p>
        )}
          <div className="flex gap-2">
            <input
              id="turtle-question"
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') askQuestion()
              }}
              placeholder={text.askPlaceholder}
              className="min-w-0 flex-1 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700 outline-none focus:border-stone-400"
            />
            <button
              onClick={askQuestion}
              disabled={asking || !question.trim() || answerOpen || qa.length >= MAX_QUESTIONS}
              className="rounded-lg bg-stone-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-stone-700 disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              {asking ? text.sending : text.send}
            </button>
          </div>
        
        {askError && <p className="mt-2 text-xs text-red-500">{askError}</p>}
        {qa.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {qa.map((item, i) => (
              <div key={`${item.question}-${i}`} className="rounded-lg bg-stone-50 px-3 py-2 text-sm">
                <p className="text-stone-500">{text.you}: {item.question}</p>
                <p className="font-medium text-stone-700">{text.host}: {item.reply}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={() => setHintsOpen(!hintsOpen)}
          className="w-full flex items-center gap-2 text-sm text-stone-500 border border-stone-200 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
        >
          <span>💡</span>
          <span>{text.hints} ({data.hints.length})</span>
          <span className="ml-auto">{hintsOpen ? '▲' : '▼'}</span>
        </button>
        {hintsOpen && (
          <div className="mt-2 flex flex-col gap-2">
            {data.hints.map((h, i) => (
              <div key={i} className="bg-stone-50 border border-stone-200 rounded-lg px-4 py-2.5 text-sm text-stone-600 leading-relaxed">
                <strong>{text.hint} {i + 1}: </strong>{h}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        {!answerOpen && (
          <button
            onClick={() => setAnswerOpen(!answerOpen)}
            className="w-full flex items-center gap-2 text-sm font-medium text-stone-700 border border-stone-300 rounded-lg px-4 py-2.5 hover:bg-stone-50 transition-colors text-left"
          >
            <span>👁</span>
            <span>{text.reveal}</span>
          </button>
		)}
        {answerOpen && (
          <div className="mt-2 bg-stone-50 border border-stone-200 rounded-lg p-4">
            <p className="text-sm leading-relaxed text-stone-700 mb-2">
              <strong>{text.fullStory}</strong>{data.answer}
            </p>
            <p className="text-xs text-stone-400 leading-relaxed">
              <strong>{text.keyPoint}</strong>{data.key_points}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
