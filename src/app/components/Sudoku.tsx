'use client'
// src/app/components/Sudoku.tsx

import { useState } from 'react'

interface SudokuData {
  title: string
  difficulty: string
  puzzle: number[][]
  solution: number[][]
}

export default function Sudoku({ data }: { data: SudokuData }) {
  const [userGrid, setUserGrid] = useState<(number | '')[][]>(
    data.puzzle.map(row => row.map(c => c === 0 ? '' : c))
  )
  const [result, setResult] = useState<'correct' | 'wrong' | 'incomplete' | null>(null)

  function update(r: number, c: number, val: string) {
    const n = parseInt(val)
    setUserGrid(prev => prev.map((row, ri) =>
      row.map((cell, ci) => (ri === r && ci === c) ? (n >= 1 && n <= 9 ? n : '') : cell)
    ))
    setResult(null)
  }

  function check() {
    let complete = true
    let correct = true
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (data.puzzle[r][c] !== 0) continue
        if (userGrid[r][c] === '') { complete = false; continue }
        if (userGrid[r][c] !== data.solution[r][c]) correct = false
      }
    }
    if (!complete) setResult('incomplete')
    else if (correct) setResult('correct')
    else setResult('wrong')
  }

  function reset() {
    setUserGrid(data.puzzle.map(row => row.map(c => c === 0 ? '' : c)))
    setResult(null)
  }

  return (
    <div>
      <div className="sudoku-grid mb-5">
        {data.puzzle.map((row, r) =>
          row.map((given, c) => {
            let cls = 'sudoku-cell'
            if (c === 2 || c === 5) cls += ' border-right'
            if (r === 2 || r === 5) cls += ' border-bottom'
            return (
              <div key={`${r}-${c}`} className={cls}>
                {given !== 0 ? (
                  <span className="font-bold text-stone-800">{given}</span>
                ) : (
                  <input
                    type="number"
                    min={1}
                    max={9}
                    value={userGrid[r][c]}
                    onChange={e => update(r, c, e.target.value)}
                  />
                )}
              </div>
            )
          })
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={check}
          className="flex-1 border border-stone-300 text-stone-700 rounded-lg py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          检查答案
        </button>
        <button
          onClick={reset}
          className="border border-stone-200 text-stone-500 rounded-lg py-2.5 px-4 text-sm hover:bg-stone-50 transition-colors"
        >
          重置
        </button>
      </div>

      {result === 'correct' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          🎉 完全正确！恭喜你完成了今日数独！
        </div>
      )}
      {result === 'wrong' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          还有些错误，再仔细想想！
        </div>
      )}
      {result === 'incomplete' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          还有空格未填写，请继续努力！
        </div>
      )}
    </div>
  )
}
