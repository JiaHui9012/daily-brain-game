import { getSudoku } from 'sudoku-gen'

export type SudokuDifficulty = 'easy' | 'medium' | 'hard'

export interface GeneratedSudoku {
  puzzle: number[][]
  solution: number[][]
  difficulty: SudokuDifficulty
}

export function generateSudoku(difficulty: SudokuDifficulty = 'medium'): GeneratedSudoku {
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
