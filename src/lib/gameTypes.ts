// src/lib/gameTypes.ts

export type GameTypeId =
  | 'turtle_soup'
  | 'word_analogy'
  | 'logic_puzzle'
  | 'memory_match'
  | 'riddle'
  | 'sudoku'
  | 'sequence'

export interface GameType {
  id: GameTypeId
  label: string
  icon: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export const GAME_TYPES: GameType[] = [
  { id: 'turtle_soup',  label: '海龟汤',    icon: '🐢', difficulty: 'medium' },
  { id: 'word_analogy', label: '词语类比',  icon: '🔤', difficulty: 'easy'   },
  { id: 'logic_puzzle', label: '逻辑推理',  icon: '🧩', difficulty: 'hard'   },
  { id: 'memory_match', label: '记忆翻牌',  icon: '🃏', difficulty: 'easy'   },
  { id: 'riddle',       label: '脑筋急转弯',icon: '💡', difficulty: 'easy'   },
  { id: 'sudoku',       label: '数独',      icon: '🔢', difficulty: 'medium' },
  { id: 'sequence',     label: '数列找规律',icon: '📐', difficulty: 'medium' },
]

export function getGameTypeForDate(date: Date): GameType {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()
  return GAME_TYPES[seed % GAME_TYPES.length]
}

export const GAME_PROMPTS: Record<GameTypeId, string> = {
  turtle_soup: `Generate a "turtle soup" lateral thinking puzzle in Chinese. The player must guess the full story by asking yes/no questions.
Return ONLY valid JSON (no markdown, no backticks):
{
  "title": "puzzle title in Chinese (4-8 chars)",
  "scenario": "the mysterious opening scenario in Chinese (2-3 sentences, intriguing and brief)",
  "question": "The question players need to solve (1 sentence)",
  "hints": ["hint 1", "hint 2", "hint 3"],
  "answer": "full story explanation in Chinese (3-5 sentences)",
  "key_points": "the key twist in one sentence"
}`,

  word_analogy: `Create a Chinese word analogy quiz with 4 questions.
Return ONLY valid JSON:
{
  "title": "词语类比游戏",
  "intro": "找出词语之间的关系，选出正确答案",
  "questions": [
    {
      "stem": "鱼 : 水 = 鸟 : ___",
      "options": ["天空", "树木", "巢穴", "翅膀"],
      "answer": 0,
      "explanation": "鱼生活在水中，鸟生活在天空中"
    }
  ]
}
Make 4 questions of increasing difficulty. Vary the relationship types: category, function, part-whole, opposite.`,

  logic_puzzle: `Create a logic puzzle in Chinese suitable for brain training.
Return ONLY valid JSON:
{
  "title": "puzzle title (4-6 chars)",
  "scenario": "puzzle description in Chinese (3-5 sentences, include all necessary info)",
  "question": "what needs to be solved",
  "hints": ["hint 1", "hint 2"],
  "answer": "detailed step-by-step solution",
  "answer_short": "one-line final answer"
}
Types: river crossing, truth/liar, scheduling, weigh/balance. Pick one at random.`,

  riddle: `Create 5 Chinese riddles (脑筋急转弯) in JSON.
Return ONLY valid JSON:
{
  "title": "今日脑筋急转弯",
  "riddles": [
    {
      "question": "riddle question",
      "answer": "answer",
      "explanation": "why this is the answer"
    }
  ]
}
Make them clever, fun, and varying in difficulty.`,

  sequence: `Create a number sequence puzzle in Chinese.
Return ONLY valid JSON:
{
  "title": "数列找规律",
  "intro": "找出下列数列的规律，填入缺失的数字",
  "sequences": [
    {
      "sequence": [2, 4, 8, 16, "?"],
      "answer": 32,
      "rule": "每项乘以2"
    }
  ]
}
Make 4 sequences of increasing difficulty. Use different rules: arithmetic, geometric, fibonacci-like, alternating, square numbers, etc.`,

  sudoku: `Generate a 9x9 Sudoku puzzle in JSON. The puzzle must be valid and solvable.
Return ONLY valid JSON:
{
  "title": "今日数独",
  "difficulty": "medium",
  "puzzle": [[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]],
  "solution": [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]
}
0 = empty cell. Generate a NEW valid puzzle different from this example.`,

  memory_match: `Generate a memory matching game with 8 pairs of items.
Return ONLY valid JSON:
{
  "title": "今日记忆翻牌",
  "theme": "theme name in Chinese",
  "pairs": [
    {"id": 1, "emoji": "🌸", "label": "樱花"},
    {"id": 2, "emoji": "🌊", "label": "海浪"}
  ]
}
Make exactly 8 pairs. Choose a fun theme: animals, food, nature, sports, etc. Use relevant emojis.`,
}
