// src/lib/gameTypes.ts

import { Language } from './i18n'

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

const GAME_TYPE_META: Omit<GameType, 'label'>[] = [
  { id: 'turtle_soup', icon: '🐢', difficulty: 'medium' },
  { id: 'word_analogy', icon: '🔤', difficulty: 'easy' },
  { id: 'logic_puzzle', icon: '🧩', difficulty: 'hard' },
  { id: 'memory_match', icon: '🃏', difficulty: 'easy' },
  { id: 'riddle', icon: '💡', difficulty: 'easy' },
  { id: 'sudoku', icon: '🔢', difficulty: 'medium' },
  { id: 'sequence', icon: '📐', difficulty: 'medium' },
]

const LABELS: Record<Language, Record<GameTypeId, string>> = {
  en: {
    turtle_soup: 'Turtle Soup',
    word_analogy: 'Word Analogy',
    logic_puzzle: 'Logic Puzzle',
    memory_match: 'Memory Match',
    riddle: 'Riddle',
    sudoku: 'Sudoku',
    sequence: 'Number Sequence',
  },
  zh: {
    turtle_soup: '海龟汤',
    word_analogy: '词语类比',
    logic_puzzle: '逻辑推理',
    memory_match: '记忆翻牌',
    riddle: '脑筋急转弯',
    sudoku: '数独',
    sequence: '数列找规律',
  },
}

export function getGameTypes(lang: Language): GameType[] {
  return GAME_TYPE_META.map(type => ({
    ...type,
    label: LABELS[lang][type.id],
  }))
}

export function getGameTypeForDate(date: Date, lang: Language = 'en'): GameType {
  const seed =
    date.getFullYear() * 10000 +
    (date.getMonth() + 1) * 100 +
    date.getDate()

  return getGameTypes(lang)[seed % GAME_TYPE_META.length]
  // return getGameTypes(lang)[5]
}

export function getGamePrompt(type: GameTypeId, lang: Language): string {
  const languageName = lang === 'zh' ? 'Chinese' : 'English'

  const prompts: Record<GameTypeId, string> = {
    turtle_soup: `Generate a "turtle soup" lateral thinking puzzle in English and Chinese versions. The player must guess the full story by asking yes/no questions. Judge the difficulty(easy/medium/hard) based on the results you generate. 
Return ONLY valid JSON (no markdown, no backticks):
{
	"en": {
	  "title": "puzzle title",
	  "scenario": "the mysterious opening scenario, 2-3 brief intriguing sentences",
	  "question": "the question players need to solve",
	  "hints": ["hint 1", "hint 2", "hint 3"],
	  "answer": "full story explanation, 3-5 sentences",
	  "key_points": "the key twist in one sentence",
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "puzzle title",
	  "scenario": "the mysterious opening scenario, 2-3 brief intriguing sentences",
	  "question": "the question players need to solve",
	  "hints": ["hint 1", "hint 2", "hint 3"],
	  "answer": "full story explanation, 3-5 sentences",
	  "key_points": "the key twist in one sentence",
	  "difficulty": "hard"
	}
}`,

    word_analogy: `Create a word analogy quiz in English and Chinese versions with 4 questions. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "Word Analogy Game",
	  "intro": "Find the relationship between the words and choose the correct answer.",
	  "questions": [
		{
		  "stem": "fish : water = bird : ___",
		  "options": ["sky", "tree", "nest", "wing"],
		  "answer": 0,
		  "explanation": "Fish live in water; birds live in the sky."
		}
	  ],
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "Word Analogy Game",
	  "intro": "Find the relationship between the words and choose the correct answer.",
	  "questions": [
		{
		  "stem": "fish : water = bird : ___",
		  "options": ["sky", "tree", "nest", "wing"],
		  "answer": 0,
		  "explanation": "Fish live in water; birds live in the sky."
		}
	  ],
	  "difficulty": "hard"
	}
}
Make 4 questions of increasing difficulty. Vary the relationship types: category, function, part-whole, opposite.`,

    logic_puzzle: `Create a logic puzzle in English and Chinese versions suitable for brain training. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "puzzle title",
	  "scenario": "puzzle description, 3-5 sentences, include all necessary info",
	  "question": "what needs to be solved",
	  "hints": ["hint 1", "hint 2"],
	  "answer": "detailed step-by-step solution",
	  "answer_short": "one-line final answer",
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "puzzle title",
	  "scenario": "puzzle description, 3-5 sentences, include all necessary info",
	  "question": "what needs to be solved",
	  "hints": ["hint 1", "hint 2"],
	  "answer": "detailed step-by-step solution",
	  "answer_short": "one-line final answer",
	  "difficulty": "hard"
	}
}
Types: river crossing, truth/liar, scheduling, weigh/balance. Pick one at random.`,

    riddle: `Create 5 clever riddles in English and Chinese versions. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "Today's Riddles",
	  "riddles": [
		{
		  "question": "riddle question",
		  "answer": "answer",
		  "explanation": "why this is the answer"
		}
	  ],
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "Today's Riddles",
	  "riddles": [
		{
		  "question": "riddle question",
		  "answer": "answer",
		  "explanation": "why this is the answer"
		}
	  ],
	  "difficulty": "hard"
	}
}
Make them fun and varying in difficulty.`,

    sequence: `Create a number sequence puzzle in English and Chinese versions. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "Number Sequences",
	  "intro": "Find the pattern and fill in the missing number.",
	  "sequences": [
		{
		  "sequence": [2, 4, 8, 16, "?"],
		  "answer": 32,
		  "rule": "multiply each term by 2"
		}
	  ],
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "Number Sequences",
	  "intro": "Find the pattern and fill in the missing number.",
	  "sequences": [
		{
		  "sequence": [2, 4, 8, 16, "?"],
		  "answer": 32,
		  "rule": "multiply each term by 2"
		}
	  ],
	  "difficulty": "hard"
	}
}
Make 4 sequences of increasing difficulty. Use different rules: arithmetic, geometric, fibonacci-like, alternating, square numbers, etc.`,

    sudoku: `Generate a 9x9 Sudoku puzzle in JSON. The puzzle must be valid and solvable. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "Today's Sudoku",
	  "difficulty": "hard",
	  "puzzle": [[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]],
	  "solution": [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]
	},
	"zh": {
	  "title": "Today's Sudoku",
	  "difficulty": "hard",
	  "puzzle": [[5,3,0,0,7,0,0,0,0],[6,0,0,1,9,5,0,0,0],[0,9,8,0,0,0,0,6,0],[8,0,0,0,6,0,0,0,3],[4,0,0,8,0,3,0,0,1],[7,0,0,0,2,0,0,0,6],[0,6,0,0,0,0,2,8,0],[0,0,0,4,1,9,0,0,5],[0,0,0,0,8,0,0,7,9]],
	  "solution": [[5,3,4,6,7,8,9,1,2],[6,7,2,1,9,5,3,4,8],[1,9,8,3,4,2,5,6,7],[8,5,9,7,6,1,4,2,3],[4,2,6,8,5,3,7,9,1],[7,1,3,9,2,4,8,5,6],[9,6,1,5,3,7,2,8,4],[2,8,7,4,1,9,6,3,5],[3,4,5,2,8,6,1,7,9]]
	}
}
0 = empty cell. Generate a NEW valid puzzle different from this example.`,

    memory_match: `Generate a memory matching game with 8 pairs of items in English and Chinese versions. Judge the difficulty(easy/medium/hard) based on the results you generate.
Return ONLY valid JSON:
{
	"en": {
	  "title": "Today's Memory Match",
	  "theme": "theme name",
	  "pairs": [
		{"id": 1, "emoji": "🌸", "label": "cherry blossom"},
		{"id": 2, "emoji": "🌊", "label": "wave"}
	  ],
	  "difficulty": "hard"
	},
	"zh": {
	  "title": "Today's Memory Match",
	  "theme": "theme name",
	  "pairs": [
		{"id": 1, "emoji": "🌸", "label": "cherry blossom"},
		{"id": 2, "emoji": "🌊", "label": "wave"}
	  ],
	  "difficulty": "hard"
	}
}
Make exactly 8 pairs. Choose a fun theme: animals, food, nature, sports, etc. Use relevant emojis.`,
  }

  return prompts[type]
}


export const GAME_SAMPLE: Record<GameTypeId, any> = {
  turtle_soup: [{
    "en": {
        "title": "The Taste of Truth",
        "scenario": "A lone survivor of a horrific shipwreck was rescued after weeks adrift. Severely malnourished, he slowly recovered in a hospital. One day, a nurse brought him a comforting bowl of turtle soup.",
        "question": "Why did he take one bite, scream in horror, and then jump out the hospital window to his death?",
        "hints": [
            "The taste of the soup was not inherently poisonous.",
            "His actions were triggered by a horrifying realization about his time on the island.",
            "He wasn't alone on the island initially."
        ],
        "answer": "While stranded on the island with a companion, they became desperate for food. His companion, claiming to have found a turtle, provided meat for them to survive. The survivor ate it, believing it to be turtle. The taste of the *real* turtle soup in the hospital revealed that what he had eaten on the island was not turtle, but human flesh—likely his companion's flesh. The horrific truth of unknowingly committing cannibalism drove him to suicide.",
        "key_points": "The taste of real turtle soup made him realize he had unknowingly committed cannibalism to survive while stranded.",
        "difficulty": "medium"
    },
    "zh": {
        "title": "真相之味",
        "scenario": "一场可怕海难的唯一幸存者在海上漂流数周后获救。他严重营养不良，在医院里缓慢康复。一天，护士给他端来一碗暖心的海龟汤。",
        "question": "他为何尝了一口汤后，惊恐尖叫，然后跳窗自杀？",
        "hints": [
            "汤本身并无毒。",
            "他的举动是源于他对孤岛时期一个可怕真相的领悟。",
            "最初在岛上，他并非独自一人。"
        ],
        "answer": "被困岛上时，他与一位同伴都极度渴望食物。他的同伴声称找到了海龟，并提供肉给他们充饥。幸存者当时相信那是海龟肉并吃下了。在医院里，当他尝到真正的海龟汤时，他才意识到当时在岛上吃的并非海龟肉，而是人肉——很可能是他同伴的肉。这个可怕的真相让他精神崩溃，最终选择自杀。",
        "key_points": "真正海龟汤的味道让他意识到，为了生存，他曾在不知情的情况下食用了人肉。",
        "difficulty": "medium"
    }
}],

  word_analogy: [{
    "en": {
        "title": "Word Analogy Game",
        "intro": "Find the relationship between the words and choose the correct answer.",
        "questions": [
            {
                "stem": "dog : mammal = snake : ___",
                "options": [
                    "reptile",
                    "amphibian",
                    "fish",
                    "bird"
                ],
                "answer": 0,
                "explanation": "A dog is a type of mammal; a snake is a type of reptile. (Category relationship)"
            },
            {
                "stem": "scissors : cut = pen : ___",
                "options": [
                    "write",
                    "draw",
                    "ink",
                    "paper"
                ],
                "answer": 0,
                "explanation": "The primary function of scissors is to cut; the primary function of a pen is to write. (Function relationship)"
            },
            {
                "stem": "day : night = truth : ___",
                "options": [
                    "lie",
                    "false",
                    "secret",
                    "fiction"
                ],
                "answer": 0,
                "explanation": "Day is the opposite of night; truth is the opposite of a lie. (Opposite relationship)"
            },
            {
                "stem": "orchestra : symphony = choir : ___",
                "options": [
                    "song",
                    "hymn",
                    "chorus",
                    "performance"
                ],
                "answer": 2,
                "explanation": "An orchestra performs a symphony; a choir performs a chorus (or choral piece). (Group performs specific type of work relationship)"
            }
        ],
        "difficulty": "medium"
    },
    "zh": {
        "title": "词语类比游戏",
        "intro": "找出词语之间的关系，并选择正确答案。",
        "questions": [
            {
                "stem": "狗 : 哺乳动物 = 蛇 : ___",
                "options": [
                    "爬行动物",
                    "两栖动物",
                    "鱼",
                    "鸟"
                ],
                "answer": 0,
                "explanation": "狗是一种哺乳动物；蛇是一种爬行动物。(类别关系)"
            },
            {
                "stem": "剪刀 : 剪 = 钢笔 : ___",
                "options": [
                    "写",
                    "画",
                    "墨水",
                    "纸"
                ],
                "answer": 0,
                "explanation": "剪刀的主要功能是剪；钢笔的主要功能是写。(功能关系)"
            },
            {
                "stem": "白天 : 黑夜 = 真相 : ___",
                "options": [
                    "谎言",
                    "错误",
                    "秘密",
                    "虚构"
                ],
                "answer": 0,
                "explanation": "白天和黑夜是反义词；真相和谎言是反义词。(反义关系)"
            },
            {
                "stem": "管弦乐队 : 交响乐 = 合唱团 : ___",
                "options": [
                    "歌曲",
                    "赞美诗",
                    "合唱",
                    "表演"
                ],
                "answer": 2,
                "explanation": "管弦乐队演奏交响乐；合唱团演唱合唱曲。(团体与其表演作品的关系)"
            }
        ],
        "difficulty": "medium"
    }
}],

  logic_puzzle: [{
    "en": {
        "title": "The Farmer's River Crossing Dilemma",
        "scenario": "A farmer needs to transport a fox, a chicken, and a bag of grain across a river. The boat is small and can only carry the farmer and one other item (either the fox, the chicken, or the grain) at a time. The problem is, if left alone, the fox will eat the chicken, and the chicken will eat the grain.",
        "question": "What is the minimum sequence of steps for the farmer to safely transport all three items to the other side of the river?",
        "hints": [
            "Not every trip has to move an item permanently to the other side; some items might need to be temporarily brought back.",
            "Consider what pairs of items can safely be left together without the farmer's supervision."
        ],
        "answer": "Here's the sequence of steps:\n1.  The farmer takes the **chicken** across the river. (Left bank: Fox, Grain; Right bank: Chicken, Farmer)\n2.  The farmer returns alone to the starting side. (Left bank: Fox, Grain, Farmer; Right bank: Chicken)\n3.  The farmer takes the **fox** across the river. (Left bank: Grain; Right bank: Chicken, Fox, Farmer)\n4.  The farmer takes the **chicken** back to the starting side. (Left bank: Grain, Chicken, Farmer; Right bank: Fox)\n5.  The farmer takes the **grain** across the river. (Left bank: Chicken; Right bank: Fox, Grain, Farmer)\n6.  The farmer returns alone to the starting side. (Left bank: Chicken, Farmer; Right bank: Fox, Grain)\n7.  The farmer takes the **chicken** across the river. (Left bank: Empty; Right bank: Fox, Grain, Chicken, Farmer)",
        "answer_short": "Farmer takes Chicken, returns. Farmer takes Fox, brings Chicken back. Farmer takes Grain, returns. Farmer takes Chicken.",
        "difficulty": "medium"
    },
    "zh": {
        "title": "农夫过河难题",
        "scenario": "一位农夫需要将一只狐狸、一只鸡和一袋谷物运过一条河。船很小，每次只能载农夫和一件物品（可以是狐狸、鸡或谷物）。麻烦的是，如果无人看管，狐狸会吃掉鸡，鸡会吃掉谷物。",
        "question": "农夫需要按照什么顺序，才能安全地将所有三件物品运到河对岸？请列出最少步骤。",
        "hints": [
            "并非每次过河都要将物品永久地留在对岸，有些物品可能需要暂时运回。",
            "考虑哪些物品可以安全地放在一起而无需农夫看管。"
        ],
        "answer": "以下是解决此难题的步骤：\n1.  农夫带**鸡**过河。(左岸：狐狸、谷物；右岸：鸡、农夫)\n2.  农夫独自返回起始岸。(左岸：狐狸、谷物、农夫；右岸：鸡)\n3.  农夫带**狐狸**过河。(左岸：谷物；右岸：鸡、狐狸、农夫)\n4.  农夫带**鸡**返回起始岸。(左岸：谷物、鸡、农夫；右岸：狐狸)\n5.  农夫带**谷物**过河。(左岸：鸡；右岸：狐狸、谷物、农夫)\n6.  农夫独自返回起始岸。(左岸：鸡、农夫；右岸：狐狸、谷物)\n7.  农夫带**鸡**过河。(左岸：空；右岸：狐狸、谷物、鸡、农夫)",
        "answer_short": "农夫带鸡过河，返回。带狐狸过河，带鸡返回。带谷物过河，返回。带鸡过河。",
        "difficulty": "medium"
    }
}],

  riddle: [{
    "en": {
        "title": "Today's Riddles",
        "riddles": [
            {
                "question": "I have cities, but no houses; forests, but no trees; and water, but no fish. What am I?",
                "answer": "A map.",
                "explanation": "Maps represent geographical features and bodies of water symbolically, without being the actual places or containing living things."
            },
            {
                "question": "What is full of holes but still holds water?",
                "answer": "A sponge.",
                "explanation": "Sponges are inherently porous (full of holes), yet their structure allows them to absorb and retain water."
            },
            {
                "question": "What question can you never answer yes to?",
                "answer": "Are you asleep yet?",
                "explanation": "If you are truly asleep, you cannot respond. If you respond 'yes,' it contradicts the premise, proving you are awake."
            },
            {
                "question": "I speak without a mouth and hear without ears. I have no body, but I come alive with sound. What am I?",
                "answer": "An echo.",
                "explanation": "An echo repeats sound (speaks), is a reflection of sound (hears), and is generated by sound waves (comes alive with sound)."
            },
            {
                "question": "What has to be broken before you can use it?",
                "answer": "An egg.",
                "explanation": "To cook or consume an egg, its protective shell must be cracked or broken first."
            }
        ],
        "difficulty": "medium"
    },
    "zh": {
        "title": "今日谜语",
        "riddles": [
            {
                "question": "我有城市却没有房屋；我有森林却没有树木；我有水域却没有鱼儿。我是什么？",
                "answer": "地图。",
                "explanation": "地图象征性地描绘地理特征和水域，但本身不是真实的地点，也不包含生物。"
            },
            {
                "question": "什么东西满是孔洞，却依然能盛水？",
                "answer": "海绵。",
                "explanation": "海绵本质上是多孔的，但其结构使其能够吸收并保持水分。"
            },
            {
                "question": "哪个问题你永远不能回答“是”？",
                "answer": "“你睡着了吗？”",
                "explanation": "如果你真的睡着了，你无法回应。如果你回答“是”，那就与前提矛盾，证明你醒着。"
            },
            {
                "question": "我无口能言，无耳能听。我没有身体，却随声而生。我是什么？",
                "answer": "回声。",
                "explanation": "回声重复声音（言），是声音的反射（听），并由声波产生（随声而生）。"
            },
            {
                "question": "什么东西必须先打破才能使用？",
                "answer": "鸡蛋。",
                "explanation": "要烹饪或食用鸡蛋，必须先打破它的蛋壳。"
            }
        ],
        "difficulty": "medium"
    }
}],

  sequence: [{
    "en": {
        "title": "Number Sequences",
        "intro": "Find the pattern and fill in the missing number.",
        "sequences": [
            {
                "sequence": [
                    3,
                    7,
                    11,
                    15,
                    "?"
                ],
                "answer": 19,
                "rule": "Add 4 to the previous term."
            },
            {
                "sequence": [
                    4,
                    12,
                    36,
                    108,
                    "?"
                ],
                "answer": 324,
                "rule": "Multiply the previous term by 3."
            },
            {
                "sequence": [
                    2,
                    3,
                    5,
                    8,
                    13,
                    "?"
                ],
                "answer": 21,
                "rule": "Each term is the sum of the two preceding terms (Fibonacci sequence)."
            },
            {
                "sequence": [
                    1,
                    2,
                    6,
                    24,
                    120,
                    "?"
                ],
                "answer": 720,
                "rule": "Each term is the factorial of its position (1st term is 1!, 2nd is 2!, etc.)."
            }
        ],
        "difficulty": "medium"
    },
    "zh": {
        "title": "数字序列",
        "intro": "找出规律，填补缺失的数字。",
        "sequences": [
            {
                "sequence": [
                    3,
                    7,
                    11,
                    15,
                    "?"
                ],
                "answer": 19,
                "rule": "前一项加4。"
            },
            {
                "sequence": [
                    4,
                    12,
                    36,
                    108,
                    "?"
                ],
                "answer": 324,
                "rule": "前一项乘以3。"
            },
            {
                "sequence": [
                    2,
                    3,
                    5,
                    8,
                    13,
                    "?"
                ],
                "answer": 21,
                "rule": "每一项是前两项的和（斐波那契数列）。"
            },
            {
                "sequence": [
                    1,
                    2,
                    6,
                    24,
                    120,
                    "?"
                ],
                "answer": 720,
                "rule": "每一项是其位置的阶乘（第一项是1!, 第二项是2!等）。"
            }
        ],
        "difficulty": "medium"
    }
}],

  sudoku: [{
    "en": {
        "title": "Today's Sudoku",
        "difficulty": "hard",
        "puzzle": [
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                9
            ],
            [
                0,
                5,
                0,
                0,
                0,
                2,
                0,
                0,
                6
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                8,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0,
                7,
                0,
                0,
                0,
                0
            ],
            [
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                7,
                0
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                4
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
        ],
        "solution": [
            [
                3,
                8,
                2,
                6,
                4,
                7,
                5,
                1,
                9
            ],
            [
                7,
                5,
                1,
                9,
                3,
                2,
                8,
                4,
                6
            ],
            [
                4,
                9,
                6,
                5,
                1,
                8,
                7,
                2,
                3
            ],
            [
                6,
                3,
                8,
                7,
                2,
                4,
                9,
                5,
                1
            ],
            [
                2,
                4,
                5,
                1,
                7,
                9,
                3,
                6,
                8
            ],
            [
                1,
                7,
                9,
                8,
                6,
                5,
                4,
                3,
                2
            ],
            [
                9,
                1,
                4,
                3,
                5,
                6,
                2,
                7,
                8
            ],
            [
                5,
                2,
                3,
                7,
                8,
                1,
                6,
                9,
                4
            ],
            [
                8,
                6,
                7,
                4,
                9,
                3,
                1,
                0,
                5
            ]
        ]
    },
    "zh": {
        "title": "今日数独",
        "difficulty": "hard",
        "puzzle": [
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                9
            ],
            [
                0,
                5,
                0,
                0,
                0,
                2,
                0,
                0,
                6
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                8,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0,
                7,
                0,
                0,
                0,
                0
            ],
            [
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                7,
                0
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                4
            ],
            [
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ]
        ],
        "solution": [
            [
                3,
                8,
                2,
                6,
                4,
                7,
                5,
                1,
                9
            ],
            [
                7,
                5,
                1,
                9,
                3,
                2,
                8,
                4,
                6
            ],
            [
                4,
                9,
                6,
                5,
                1,
                8,
                7,
                2,
                3
            ],
            [
                6,
                3,
                8,
                7,
                2,
                4,
                9,
                5,
                1
            ],
            [
                2,
                4,
                5,
                1,
                7,
                9,
                3,
                6,
                8
            ],
            [
                1,
                7,
                9,
                8,
                6,
                5,
                4,
                3,
                2
            ],
            [
                9,
                1,
                4,
                3,
                5,
                6,
                2,
                7,
                8
            ],
            [
                5,
                2,
                3,
                7,
                8,
                1,
                6,
                9,
                4
            ],
            [
                8,
                6,
                7,
                4,
                9,
                3,
                1,
                0,
                5
            ]
        ]
    }
}],

  memory_match: [{
    "en": {
        "title": "Today's Memory Match",
        "theme": "Nature & Weather",
        "pairs": [
            {
                "id": 1,
                "emoji": "☀️",
                "label": "sun"
            },
            {
                "id": 2,
                "emoji": "🌙",
                "label": "moon"
            },
            {
                "id": 3,
                "emoji": "🌧️",
                "label": "rain"
            },
            {
                "id": 4,
                "emoji": "☁️",
                "label": "cloud"
            },
            {
                "id": 5,
                "emoji": "🌳",
                "label": "tree"
            },
            {
                "id": 6,
                "emoji": "🌸",
                "label": "flower"
            },
            {
                "id": 7,
                "emoji": "🌈",
                "label": "rainbow"
            },
            {
                "id": 8,
                "emoji": "❄️",
                "label": "snowflake"
            }
        ],
        "difficulty": "easy"
    },
    "zh": {
        "title": "今日记忆匹配",
        "theme": "自然与天气",
        "pairs": [
            {
                "id": 1,
                "emoji": "☀️",
                "label": "太阳"
            },
            {
                "id": 2,
                "emoji": "🌙",
                "label": "月亮"
            },
            {
                "id": 3,
                "emoji": "🌧️",
                "label": "雨"
            },
            {
                "id": 4,
                "emoji": "☁️",
                "label": "云"
            },
            {
                "id": 5,
                "emoji": "🌳",
                "label": "树"
            },
            {
                "id": 6,
                "emoji": "🌸",
                "label": "花"
            },
            {
                "id": 7,
                "emoji": "🌈",
                "label": "彩虹"
            },
            {
                "id": 8,
                "emoji": "❄️",
                "label": "雪花"
            }
        ],
        "difficulty": "easy"
    }
}],
}