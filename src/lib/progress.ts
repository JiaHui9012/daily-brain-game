import { GameTypeId } from './gameTypes'

function getKey(gameTypeId: GameTypeId) {
  const d = new Date()
  return `progress_${gameTypeId}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
}

export interface GameProgress {
  solved: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  state: any  // game-specific state (userGrid, current question index, etc.)
}

export function loadProgress(gameTypeId: GameTypeId): GameProgress | null {
  try {
    const raw = localStorage.getItem(getKey(gameTypeId))
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveProgress(gameTypeId: GameTypeId, progress: GameProgress) {
  try {
    localStorage.setItem(getKey(gameTypeId), JSON.stringify(progress))
  } catch {}
}

export function clearProgress(gameTypeId: GameTypeId) {
  try {
    localStorage.removeItem(getKey(gameTypeId))
  } catch {}
}