'use client'
// src/app/components/Sequence.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'
import { GameProgress } from '@/lib/progress';

interface SeqItem { sequence: (number | string)[]; answer: number; rule: string }
interface SequenceData { title: string; intro: string; sequences: SeqItem[] }
interface SequenceProps {
  data: SequenceData
  lang: Language
  progress: GameProgress | null
  onProgress: (p: GameProgress) => void
}

const TEXT = {
  en: {
    question: 'Question',
    placeholder: 'Answer',
    confirm: 'Confirm',
    correct: 'Correct!',
    answerIs: 'Correct answer:',
    rule: 'Rule:',
  },
  zh: {
    question: '第',
    placeholder: '填入答案',
    confirm: '确认',
    correct: '答对了！',
    answerIs: '正确答案是',
    rule: '规律：',
  },
}

export default function Sequence({ data, lang, progress, onProgress }: SequenceProps) {
  const text = TEXT[lang]
  const [answers, setAnswers] = useState<string[]>(() =>
    progress?.state?.answers ?? data.sequences.map(() => '')
  )
  const [checked, setChecked] = useState<boolean[]>(() =>
    progress?.state?.checked ?? data.sequences.map(() => false)
  )
  type RevealedSequence = { answer: number; rule: string } | null
  const [revealedSeqs, setRevealedSeqs] = useState<RevealedSequence[]>(
    progress?.state?.revealedSeqs ?? data.sequences.map(() => null)
  )

  function saveState(updates: { answers?: string[]; checked?: boolean[]; revealedSeqs?: RevealedSequence[] }) {
    const newState = {
      answers: updates.answers ?? answers,
      checked: updates.checked ?? checked,
      revealedSeqs: updates.revealedSeqs ?? revealedSeqs,
    }
    const solved = (updates.checked ?? checked).every(Boolean)
    onProgress({ solved, state: newState })
  }

  async function check(i: number) {
    const res = await fetch('/api/check-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gameType: 'sequence', quesNo: i, userAnswer: answers[i], lang }),
    })
    const result = await res.json()
    const newChecked = checked.map((v, j) => j === i ? true : v)
    const newRevealedSeqs = revealedSeqs.map((v, j) =>
      j === i ? { answer: result.answer ?? parseInt(answers[i]), rule: result.rule ?? '' } : v
    )
    setChecked(newChecked)
    setRevealedSeqs(newRevealedSeqs)
    saveState({ checked: newChecked, revealedSeqs: newRevealedSeqs })
  }

  function setAnswer(i: number, value: string) {
    const newAnswers = answers.map((v, j) => j === i ? value : v)
    setAnswers(newAnswers)
    saveState({ answers: newAnswers })
  }

  return (
    <div>
      <p className="text-sm text-stone-400 mb-5">{data.intro}</p>
      {data.sequences.map((seq, i) => {
        const isChecked = checked[i]
        const correct = checked[i] && revealedSeqs[i]?.answer === parseInt(answers[i])
        return (
          <div key={i} className="mb-6">
            <div className="text-xs text-stone-400 font-medium mb-2">
              {lang === 'zh' ? `第 ${i + 1} 题` : `${text.question} ${i + 1}`}
            </div>
            <div className="flex items-center gap-2 flex-wrap mb-3">
              {seq.sequence.map((n, j) => (
                <span key={j}>
                  {n === '?' ? (
                    <div className={`w-11 h-11 border-2 border-dashed rounded-lg flex items-center justify-center font-bold text-base
                      ${isChecked ? (correct ? 'border-green-400 text-green-700 bg-green-50' : 'border-red-400 text-red-700 bg-red-50') : 'border-stone-300 text-stone-400'}`}>
                      {isChecked ? (correct ? revealedSeqs[i]?.answer : '✗') : '?'}
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
                  placeholder={text.placeholder}
                  value={answers[i]}
                  onChange={e => setAnswer(i, e.target.value)}
                  className="w-32 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-stone-400"
                />
                <button
                  onClick={() => check(i)}
                  className="border border-stone-300 text-stone-600 rounded-lg px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
                >
                  {text.confirm}
                </button>
              </div>
            ) : (
              <div className={`text-sm px-3 py-2 rounded-lg ${correct ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                {correct ? `✓ ${text.correct}` : `✗ ${text.answerIs} ${revealedSeqs[i]?.answer}`}
                {revealedSeqs[i]?.rule && <>{' · '}{text.rule}{revealedSeqs[i]?.rule}</>}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
