// src/lib/validateGame.ts
import { GameTypeId } from './gameTypes'

export function isDifficulty(value: unknown) {
  return value === 'easy' || value === 'medium' || value === 'hard'
}

export function validateGameData(gameType: GameTypeId, data: any) {
  if (!data || typeof data !== 'object') {
    throw new Error('Game data must be an object')
  }

  if (!data.en || !data.zh) {
    throw new Error('Game data must include en and zh')
  }

  for (const lang of ['en', 'zh'] as const) {
    if (!isDifficulty(data[lang].difficulty)) {
      throw new Error(`${lang} difficulty is invalid`)
    }

    if (typeof data[lang].title !== 'string') {
      throw new Error(`${lang} title is missing`)
    }
  }

  if (gameType === 'riddle') {
    if (!Array.isArray(data.en.riddles) || data.en.riddles.length !== 5) {
      throw new Error('English riddles must contain 5 items')
    }

    if (!Array.isArray(data.zh.riddles) || data.zh.riddles.length !== 5) {
      throw new Error('Chinese riddles must contain 5 items')
    }
  }

  if (gameType === 'sudoku') {
    validateSudokuGrid(data.en.puzzle)
    validateSudokuGrid(data.en.solution)
    validateSudokuGrid(data.zh.puzzle)
    validateSudokuGrid(data.zh.solution)
  }

  return data
}

function validateSudokuGrid(grid: unknown) {
  if (!Array.isArray(grid) || grid.length !== 9) {
    throw new Error('Sudoku grid must have 9 rows')
  }

  for (const row of grid) {
    if (!Array.isArray(row) || row.length !== 9) {
      throw new Error('Sudoku grid rows must have 9 cells')
    }
  }
}