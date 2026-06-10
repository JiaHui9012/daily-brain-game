'use client'
// src/app/page.tsx

import { useEffect, useState } from 'react'
import { GameType, getGameTypes, Difficulty } from '@/lib/gameTypes'
import { LANGUAGES, Language, toLanguage } from '@/lib/i18n'
import TurtleSoup from './components/TurtleSoup'
import Riddle from './components/Riddle'
import WordAnalogy from './components/WordAnalogy'
import Sequence from './components/Sequence'
import Sudoku from './components/Sudoku'
import LogicPuzzle from './components/LogicPuzzle'
import MemoryMatch from './components/MemoryMatch'
import HowToPlay from './components/HowToPlay'

const UI_TEXT = {
  en: {
    appTitle: 'Daily Brain Training',
    subtitle: 'One AI-generated mini game each day to keep your mind active.',
    loading: "AI is generating today's game. Please wait...",
    failed: 'Generation failed: ',
    reload: 'Reload',
    streakPrefix: 'Current streak',
    streakSuffix: 'days',
    difficulty: { easy: 'Easy', medium: 'Medium', hard: 'Hard' },
  },
  zh: {
    appTitle: '每日脑力训练',
    subtitle: '每天一个 AI 生成的小游戏，保持大脑活跃',
    loading: 'AI 正在生成今日游戏，请稍候...',
    failed: '生成失败：',
    reload: '重新加载',
    streakPrefix: '连续挑战',
    streakSuffix: '天',
    difficulty: { easy: '简单', medium: '中等', hard: '困难' },
  },
}

function formatDate(lang: Language) {
  const d = new Date()

  if (lang === 'zh') {
    const days = ['日', '一', '二', '三', '四', '五', '六']
    return `${d.getMonth() + 1} 月 ${d.getDate()} 日 · 星期${days[d.getDay()]}`
  }

  return d.toLocaleDateString('en', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })
}

function getTodayKey(lang: Language) {
  const d = new Date()
  // return `brain_game_${lang}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
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
  const [lang, setLang] = useState<Language>('en')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gameType, setGameType] = useState<GameType | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [gameData, setGameData] = useState<any>(null)
  const [streak, setStreak] = useState(0)
  const [showHowToPlay, setShowHowToPlay] = useState(false)

  useEffect(() => {
    const savedLang = toLanguage(localStorage.getItem('brain_lang'))
    setLang(savedLang)
  }, [])

  useEffect(() => {
    if (lang === null) return
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      setGameType(null)
      setGameData(null)

      const cacheKey = getTodayKey(lang)
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        try {
          const { gameTypeId, gameData } = JSON.parse(cached)
          if (cancelled) return
          const gameType = getGameTypes(lang).find((u) => u.id === gameTypeId) ?? null;
          setGameType(gameType)
          setGameData(gameData[lang])
          updateStreak()
          setStreak(getStreak())
          setLoading(false)
        } catch {
          localStorage.removeItem(cacheKey)
        }
      } else {
        try {
          const res = await fetch(`/api/generate-game?lang=${lang}`)
          if (!res.ok) throw new Error(`Server error ${res.status}`)
          const data = await res.json()
          if (cancelled) return
          setGameType(data.gameType)
          setGameData(data.gameData[lang])
          localStorage.setItem(cacheKey, JSON.stringify({ gameTypeId: data.gameType.id, gameData: data.gameData }))
          updateStreak()
          setStreak(getStreak())
        } catch (e: unknown) {
          if (!cancelled) setError(e instanceof Error ? e.message : 'Unknown error')
        } finally {
          if (!cancelled) setLoading(false)
        }
      }
    }

    load()
	return () => { cancelled = true }
  }, [lang])
  
  
  function switchLang(newLang: Language) {
    setLang(newLang)
    localStorage.setItem('brain_lang', newLang)
  }

  const text = UI_TEXT[lang]
  const diffLabel = text.difficulty
  const diffColor = {
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    hard: 'bg-red-100 text-red-800',
  }

  return (
    <main className="min-h-screen bg-stone-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-block text-xs font-medium tracking-widest text-stone-500 bg-white border border-stone-200 rounded-full px-4 py-1 mb-4">
            {formatDate(lang)}
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-800 mb-1">{text.appTitle}</h1>
          <p className="text-sm text-stone-500 font-light mb-4">{text.subtitle}</p>
          <div className="inline-flex rounded-lg border border-stone-200 bg-white p-1">
            {LANGUAGES.map(option => (
              <button
                key={option.id}
                onClick={() => switchLang(option.id)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  lang === option.id
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-500 hover:bg-stone-50'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          {loading && (
            <div className="text-center py-16 px-6">
              <div className="spinner mb-4" />
              <p className="text-sm text-stone-400">{text.loading}</p>
            </div>
          )}

          {error && (
            <div className="text-center py-16 px-6">
              <p className="text-sm text-stone-500 mb-4">{text.failed}{error}</p>
              <button
                onClick={() => { setError(null); setLoading(true); window.location.reload() }}
                className="px-6 py-2 bg-stone-800 text-white rounded-lg text-sm font-medium hover:bg-stone-700 transition-colors"
              >
                {text.reload}
              </button>
            </div>
          )}

          {!loading && !error && gameType && gameData && (
            <>
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
                <span className={`text-xs font-medium px-3 py-1 rounded-full flex-shrink-0 ${diffColor[gameData.difficulty as Difficulty]}`}>
                  {diffLabel[gameData.difficulty as Difficulty]}
                </span>
                <button
                  onClick={() => setShowHowToPlay(true)}
                  className="w-7 h-7 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-colors flex-shrink-0 text-sm font-semibold"
                  aria-label="How to play"
                >
                  ?
                </button>
              </div>

              <div className="p-6">
                {gameType.id === 'turtle_soup'  && <TurtleSoup data={gameData} lang={lang} />}
                {gameType.id === 'riddle'        && <Riddle data={gameData} lang={lang} />}
                {gameType.id === 'word_analogy'  && <WordAnalogy data={gameData} lang={lang} />}
                {gameType.id === 'sequence'      && <Sequence data={gameData} lang={lang} />}
                {gameType.id === 'sudoku'        && <Sudoku data={gameData} lang={lang} />}
                {gameType.id === 'logic_puzzle'  && <LogicPuzzle data={gameData} lang={lang} />}
                {gameType.id === 'memory_match'  && <MemoryMatch data={gameData} lang={lang} />}
              </div>

              <div className="flex items-center justify-center gap-2 px-6 py-3 bg-stone-50 border-t border-stone-100 text-sm text-stone-400">
                <span>{text.streakPrefix}</span>
                <span className="text-xl font-bold text-stone-700">{streak}</span>
                <span>{text.streakSuffix}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {showHowToPlay && gameType && (
        <HowToPlay
          gameTypeId={gameType.id}
          lang={lang}
          onClose={() => setShowHowToPlay(false)}
        />
      )}
    </main>
  )
}
