'use client'
// src/app/components/MemoryMatch.tsx

import { useState, useEffect, useRef } from 'react'

interface CardPair { id: number; emoji: string; label: string }
interface MemoryData { title: string; theme: string; pairs: CardPair[] }
interface Card extends CardPair { uid: number }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function MemoryMatch({ data }: { data: MemoryData }) {
  const [cards] = useState<Card[]>(() =>
    shuffle([...data.pairs, ...data.pairs].map((p, i) => ({ ...p, uid: i })))
  )
  const [flipped, setFlipped] = useState<number[]>([])
  const [matched, setMatched] = useState<Set<number>>(new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)
  const lockRef = useRef(false)

  function flip(uid: number) {
    if (lockRef.current) return
    if (matched.has(cards[uid].id)) return
    if (flipped.includes(uid)) return

    const newFlipped = [...flipped, uid]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      lockRef.current = true
      setLocked(true)
      setMoves(m => m + 1)
      const [a, b] = newFlipped
      if (cards[a].id === cards[b].id) {
        setMatched(prev => new Set([...prev, cards[a].id]))
        setFlipped([])
        lockRef.current = false
        setLocked(false)
      } else {
        setTimeout(() => {
          setFlipped([])
          lockRef.current = false
          setLocked(false)
        }, 800)
      }
    }
  }

  const done = matched.size === data.pairs.length

  return (
    <div>
      <p className="text-sm text-stone-400 text-center mb-4">主题：{data.theme} · 找出所有配对</p>

      <div className="memory-grid mb-4">
        {cards.map((card, i) => {
          const isFlipped = flipped.includes(i) || matched.has(card.id)
          const isMatched = matched.has(card.id)
          return (
            <div
              key={card.uid}
              onClick={() => flip(i)}
              className={`memory-card ${isMatched ? 'matched' : isFlipped ? 'flipped' : 'hidden'} ${locked && !isFlipped ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <span>{isFlipped ? card.emoji : ''}</span>
            </div>
          )
        })}
      </div>

      <div className="text-center text-sm text-stone-400 mb-3">
        步数：<strong className="text-stone-700">{moves}</strong>
      </div>

      {done && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <p className="text-green-700 font-medium">🎉 完成！共用了 {moves} 步</p>
        </div>
      )}
    </div>
  )
}
