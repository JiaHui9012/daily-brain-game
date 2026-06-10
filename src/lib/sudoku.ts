import { getSudoku } from 'sudoku-gen'
import { Difficulty } from './gameTypes'

export interface GeneratedSudoku {
  puzzle: number[][]
  solution: number[][]
  difficulty: Difficulty
}

export function generateSudoku(difficulty: Difficulty = 'medium'): GeneratedSudoku {
  const sudoku = getSudoku(difficulty)

  return {
    puzzle: toGrid(sudoku.puzzle),
    solution: toGrid(sudoku.solution),
    difficulty,
  }
}

function toGrid(value: string): number[][] {
  return Array.from({ length: 9 }, (_, row) =>
    Array.from({ length: 9 }, (_, col) => {
      const char = value[row * 9 + col]
      return char === '-' ? 0 : Number(char)
    })
  )
}
