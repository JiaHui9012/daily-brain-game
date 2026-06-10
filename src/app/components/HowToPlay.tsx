// src/app/components/HowToPlay.tsx
'use client'

import { GameTypeId } from '@/lib/gameTypes'
import { Language } from '@/lib/i18n'
import { HOW_TO_PLAY } from '@/lib/howToPlay'

interface HowToPlayProps {
  gameTypeId: GameTypeId
  lang: Language
  onClose: () => void
}

export default function HowToPlay({ gameTypeId, lang, onClose }: HowToPlayProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div
        className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-serif text-lg font-semibold text-stone-800">
            {lang === 'zh' ? '游戏说明' : 'How to Play'}
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 transition-colors text-lg leading-none"
          >
            ×
          </button>
        </div>
        <ol className="flex flex-col gap-2">
          {HOW_TO_PLAY[gameTypeId][lang].map((step, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-stone-600 leading-relaxed">
              <span className="flex-shrink-0 w-4 font-semibold text-stone-300">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}