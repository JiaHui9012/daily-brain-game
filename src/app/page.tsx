'use client'
// src/app/page.tsx

import { useEffect, useState, useRef } from 'react'
import { GameType } from '@/lib/gameTypes'
import TurtleSoup from './components/TurtleSoup'
import Riddle from './components/Riddle'
import WordAnalogy from './components/WordAnalogy'
import Sequence from './components/Sequence'
import Sudoku from './components/Sudoku'
import LogicPuzzle from './components/LogicPuzzle'
import MemoryMatch from './components/MemoryMatch'

function formatDate() {
  const d = new Date()
  const days = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 星期${days[d.getDay()]}`
}

function getTodayKey() {
  const d = new Date()
  return `brain_game_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

function getStreak() {
  if (typeof window === 'undefined') return 0
  return parseInt(localStorage.getItem('brain_streak') || '0')
}

function updateStreak() {
  if (typeof window === 'undefined') return
  const d = new Date()
  const today = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
  const lastDate = localStorage.getItem('brain_streak_date')
  if (lastDate === today) return

  const yesterday = new Date(d)
  yesterday.setDate(yesterday.getDate() - 1)
  const yKey = `${yesterday.getFullYear()}-${yesterday.getMonth() + 1}-${yesterday.getDate()}`

  const streak = lastDate === yKey ? getStreak() + 1 : 1
  localStorage.setItem('brain_streak', String(streak))
  localStorage.setItem('brain_streak_date', today)
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameType, setGameType] = useState<GameType | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gameData, setGameData] = useState<any>(null)
  const [streak, setStreak] = useState(0)
  const hasLoaded = useRef(false)

  useEffect(() => {
	if (hasLoaded.current) return
	hasLoaded.current = true
  
    async function load() {
      // Check localStorage cache first
      const cacheKey = getTodayKey()
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { gameType, gameData } = JSON.parse(cached)
          setGameType(gameType)
          setGameData(gameData)
          updateStreak()
          setStreak(getStreak())
          setLoading(false)
          return
        } catch {
          localStorage.removeItem(cacheKey)
        }
      }

      // Fetch from backend API
      try {
        const res = await fetch('/api/generate-game')
        if (!res.ok) throw new Error(`Server error ${res.status}`)
        const data = await res.json()
        setGameType(data.gameType)
        setGameData(data.gameData)
        localStorage.setItem(cacheKey, JSON.stringify({ gameType: data.gameType, gameData: data.gameData }))
        updateStreak()
        setStreak(getStreak())
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const diffLabel = { easy: '简单', medium: '中等', hard: '困难' }
  const diffColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800',
  }

  return (
    <main className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block text-xs font-medium tracking-widest text-stone-500 bg-white border border-stone-200 rounded-full px-4 py-1 mb-4">
            {formatDate()}
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-800 mb-1">每日脑力训练</h1>
          <p className="text-sm text-stone-500 font-light">每天一个 AI 生成的小游戏，保持大脑活跃</p>
        </div>

        {/* Game Card */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">

          {loading && (
            <div className="text-center py-16 px-6">
              <div className="spinner mb-4" />
              <p className="text-sm text-stone-400">AI 正在生成今日游戏，请稍候...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 px-6">
              <p className="text-sm text-stone-500 mb-4">生成失败：{error}</p>
              <button
                onClick={() => { setError(null); setLoading(true); window.location.reload() }}
                className="px-6 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                重新加载
              </button>
            </div>
          )}

          {!loading && !error && gameType && gameData && (
            <>
              {/* Game header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100">
                <div className="w-10 h-10 bg-stone-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                  {gameType.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium tracking-widest text-stone-400 uppercase mb-0.5">
                    {gameType.label}
                  </div>
                  <div className="font-serif text-lg font-semibold text-stone-800 truncate">
                    {gameData.title}
                  </div>
                </div>
                <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${diffColor[gameType.difficulty]}`}>
                  {diffLabel[gameType.difficulty]}
                </span>
              </div>

              {/* Game body */}
              <div className="p-6">
                {gameType.id === 'turtle_soup'  && <TurtleSoup data={gameData} />}
                {gameType.id === 'riddle'        && <Riddle data={gameData} />}
                {gameType.id === 'word_analogy'  && <WordAnalogy data={gameData} />}
                {gameType.id === 'sequence'      && <Sequence data={gameData} />}
                {gameType.id === 'sudoku'        && <Sudoku data={gameData} />}
                {gameType.id === 'logic_puzzle'  && <LogicPuzzle data={gameData} />}
                {gameType.id === 'memory_match'  && <MemoryMatch data={gameData} />}
              </div>

              {/* Streak footer */}
              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-50 border-t border-stone-100 text-sm text-stone-400">
                <span>连续挑战</span>
                <span className="text-xl font-bold text-stone-700">{streak}</span>
                <span>天</span>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
