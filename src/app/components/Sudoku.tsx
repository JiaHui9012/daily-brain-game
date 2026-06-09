'use client'
// src/app/components/Sudoku.tsx

import { useState } from 'react'
import { Language } from '@/lib/i18n'

interface SudokuData {
  title: string
  difficulty: string
  puzzle: number[][]
  solution: number[][]
}

type CellValue = number | ''
type CheckResult = 'correct' | 'wrong' | 'incomplete' | null

const NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9]

const TEXT = {
  en: {
    check: 'Check',
    reset: 'Reset',
    notes: 'Notes',
    notesOn: 'Notes On',
    erase: 'Erase',
    correct: "🎉 Completely correct! You finished today's Sudoku!",
    wrong: 'Some cells are still wrong. Take another look!',
    incomplete: 'There are still empty cells. Keep going!',
  },
  zh: {
    check: '检查',
    reset: '重置',
    notes: '笔记',
    notesOn: '笔记开',
    erase: '清除',
    correct: '🎉 完全正确！恭喜你完成了今日数独！',
    wrong: '还有些错误，再仔细想想！',
    incomplete: '还有空格未填写，请继续努力！',
  },
}

function emptyNotes() {
  return Array.from({ length: 9 }, () =>
    Array.from({ length: 9 }, () => [] as number[])
  )
}

function isPeer(aRow: number, aCol: number, bRow: number, bCol: number) {
  return (
    aRow === bRow ||
    aCol === bCol ||
    (Math.floor(aRow / 3) === Math.floor(bRow / 3) &&
      Math.floor(aCol / 3) === Math.floor(bCol / 3))
  )
}

export default function Sudoku({ data, lang }: { data: SudokuData; lang: Language }) {
  const text = TEXT[lang]
  const [userGrid, setUserGrid] = useState<CellValue[][]>(
    data.puzzle.map(row => row.map(c => c === 0 ? '' : c))
  )
  const [notes, setNotes] = useState<number[][][]>(emptyNotes)
  const [selected, setSelected] = useState<[number, number] | null>(null)
  const [notesMode, setNotesMode] = useState(false)
  const [result, setResult] = useState<CheckResult>(null)

  function placeNumber(value: number) {
    if (!selected) return
    const [row, col] = selected
    if (data.puzzle[row][col] !== 0) return

    if (notesMode) {
      setNotes(prev => prev.map((noteRow, r) =>
        noteRow.map((cellNotes, c) => {
          if (r !== row || c !== col) return cellNotes
          return cellNotes.includes(value)
            ? cellNotes.filter(n => n !== value)
            : [...cellNotes, value].sort()
        })
      ))
      return
    }

    setUserGrid(prev => prev.map((gridRow, r) =>
      gridRow.map((cell, c) => r === row && c === col ? value : cell)
    ))
    setNotes(prev => prev.map((noteRow, r) =>
      noteRow.map((cellNotes, c) =>
        isPeer(row, col, r, c) ? cellNotes.filter(n => n !== value) : cellNotes
      )
    ))
    setResult(null)
  }

  function eraseSelected() {
    if (!selected) return
    const [row, col] = selected
    if (data.puzzle[row][col] !== 0) return

    setUserGrid(prev => prev.map((gridRow, r) =>
      gridRow.map((cell, c) => r === row && c === col ? '' : cell)
    ))
    setNotes(prev => prev.map((noteRow, r) =>
      noteRow.map((cellNotes, c) => r === row && c === col ? [] : cellNotes)
    ))
    setResult(null)
  }

  function check() {
    let complete = true
    let correct = true

    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (data.puzzle[row][col] !== 0) continue
        if (userGrid[row][col] === '') {
          complete = false
          continue
        }
        if (userGrid[row][col] !== data.solution[row][col]) correct = false
      }
    }

    if (!complete) setResult('incomplete')
    else if (correct) setResult('correct')
    else setResult('wrong')
  }

  function reset() {
    setUserGrid(data.puzzle.map(row => row.map(c => c === 0 ? '' : c)))
    setNotes(emptyNotes())
    setSelected(null)
    setResult(null)
  }

  function isWrong(row: number, col: number) {
    return (
      result === 'wrong' &&
      data.puzzle[row][col] === 0 &&
      userGrid[row][col] !== '' &&
      userGrid[row][col] !== data.solution[row][col]
    )
  }

  return (
    <div>
      <div className="sudoku-grid mb-5">
        {data.puzzle.map((row, r) =>
          row.map((given, c) => {
            const value = userGrid[r][c]
            const isGiven = given !== 0
            const isSelected = selected?.[0] === r && selected?.[1] === c
            const isRelated = selected ? isPeer(selected[0], selected[1], r, c) : false
            let cls = 'sudoku-cell'
            if (c === 2 || c === 5) cls += ' border-right'
            if (r === 2 || r === 5) cls += ' border-bottom'
            if (isSelected) cls += ' sudoku-selected'
            else if (isRelated) cls += ' sudoku-related'
            if (isWrong(r, c)) cls += ' sudoku-wrong'

            return (
              <button
                key={`${r}-${c}`}
                type="button"
                onClick={() => setSelected([r, c])}
                className={cls}
              >
                {value !== '' ? (
                  <span className={isGiven ? 'font-bold text-stone-800' : 'font-semibold'}>
                    {value}
                  </span>
                ) : (
                  <span className="grid h-full w-full grid-cols-3 grid-rows-3 text-[9px] leading-none text-stone-400">
                    {NUMBERS.map(n => (
                      <span key={n} className="flex items-center justify-center">
                        {notes[r][c].includes(n) ? n : ''}
                      </span>
                    ))}
                  </span>
                )}
              </button>
            )
          })
        )}
      </div>

      <div className="mb-3 grid grid-cols-9 gap-1">
        {NUMBERS.map(n => (
          <button
            key={n}
            type="button"
            onClick={() => placeNumber(n)}
            className="rounded-lg border border-stone-200 py-2 text-sm font-semibold text-stone-700 hover:bg-stone-50 disabled:cursor-not-allowed disabled:text-stone-300"
            disabled={!selected}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="flex gap-2 mb-3">
        <button
          onClick={() => setNotesMode(v => !v)}
          className={`border rounded-lg py-2.5 px-4 text-sm font-medium transition-colors ${
            notesMode
              ? 'border-stone-800 bg-stone-800 text-white'
              : 'border-stone-300 text-stone-700 hover:bg-stone-50'
          }`}
        >
          {notesMode ? text.notesOn : text.notes}
        </button>
        <button
          onClick={eraseSelected}
          className="border border-stone-200 text-stone-500 rounded-lg py-2.5 px-4 text-sm hover:bg-stone-50 transition-colors"
        >
          {text.erase}
        </button>
        <button
          onClick={check}
          className="flex-1 border border-stone-300 text-stone-700 rounded-lg py-2.5 text-sm font-medium hover:bg-stone-50 transition-colors"
        >
          {text.check}
        </button>
        <button
          onClick={reset}
          className="border border-stone-200 text-stone-500 rounded-lg py-2.5 px-4 text-sm hover:bg-stone-50 transition-colors"
        >
          {text.reset}
        </button>
      </div>

      {result === 'correct' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm text-green-700">
          {text.correct}
        </div>
      )}
      {result === 'wrong' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
          {text.wrong}
        </div>
      )}
      {result === 'incomplete' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-700">
          {text.incomplete}
        </div>
      )}
    </div>
  )
}
