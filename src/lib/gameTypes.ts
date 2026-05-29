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
  // return GAME_TYPES[5]
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
For Examples: river crossing, truth/liar, scheduling, weigh/balance...`,

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



export const GAME_SAMPLE: Record<GameTypeId, any> = {
  turtle_soup: [{
    "title": "诡异的汤",
    "scenario": "一名男子在家中猝死，死状惊恐。他的桌上放着一碗喝了一半的汤，旁边有一份关于海上救援的新闻报纸。屋内没有打斗痕迹，警方排除了他杀。",
    "question": "男子为什么会死？",
    "hints": [
        "男子曾经失明。",
        "报纸上的新闻与他有关。",
        "汤本身不是毒药。"
    ],
    "answer": "男子曾遭遇海难，在漂流期间，他因失明而无法辨认食物，为了生存喝下了一碗同伴用“海龟肉”熬制的汤。获救后，他恢复了视力，并在报纸上看到新闻，得知同伴已死，并且海难区域根本没有海龟。他突然意识到自己当时喝下的不是海龟汤，而是同伴的肉，巨大的恐惧与恶心使他当场死亡。",
    "key_points": "他意识到自己在不知情的情况下，吃下了人肉。"
},
{
    "title": "圣水之谜",
    "scenario": "一位毕生致力于研究古代文明的著名考古学家，终于在一次秘密挖掘中，发现了一个传说中的古代圣杯，其中盛满了据说能揭示宇宙奥秘的“生命之水”。他怀着敬畏与激动的心情，小心翼翼地品尝了一小口。然而，他瞬间脸色煞白，身体颤抖，失声痛哭道：“不，这不可能！我所有的信仰都崩塌了！”",
    "question": "考古学家到底尝到了什么，让他如此绝望？",
    "hints": [
        "味道本身是关键，而不是圣杯的来源。",
        "这种味道在古代是不可能存在的。",
        "它彻底颠覆了考古学家对“古代文明”的认知。"
    ],
    "answer": "考古学家尝到的“生命之水”，味道竟然和他日常喝的、带有特定人工甜味剂的某品牌碳酸饮料一模一样。这个发现彻底摧毁了他对古老文明和传说中圣物的信仰。这意味着传说中的圣物可能是一个精心策划的骗局，或者古代文明的真实面貌与他毕生所学大相径庭，甚至可能涉及某种不可思议的现代穿越或伪造。他所理解的整个历史体系瞬间崩塌，他所有的学术成就都变得毫无意义。",
    "key_points": "“生命之水”尝起来的味道，竟是现代工业化生产的饮料，彻底颠覆了考古学家的世界观。"
}],

  word_analogy: [{
    "title": "词语类比游戏",
    "intro": "找出词语之间的关系，选出正确答案",
    "questions": [
        {
            "stem": "水果 : 苹果 = 蔬菜 : ___",
            "options": [
                "萝卜",
                "米饭",
                "饼干",
                "肉"
            ],
            "answer": 0,
            "explanation": "苹果是水果的一种，萝卜是蔬菜的一种，它们是所属类别和实例的关系。"
        },
        {
            "stem": "剪刀 : 剪 = 笔 : ___",
            "options": [
                "写",
                "画",
                "读",
                "擦"
            ],
            "answer": 0,
            "explanation": "剪刀的主要功能是“剪”，笔的主要功能是“写”，它们是工具及其最主要动作的关系。"
        },
        {
            "stem": "汽车 : 轮胎 = 钟表 : ___",
            "options": [
                "时间",
                "指针",
                "齿轮",
                "报时"
            ],
            "answer": 1,
            "explanation": "轮胎是汽车用于行驶的重要组成部分，指针是钟表用于指示时间的重要组成部分，它们是整体与关键构成部分的关系。"
        },
        {
            "stem": "光明 : 黑暗 = 勤劳 : ___",
            "options": [
                "懒惰",
                "努力",
                "休息",
                "疲惫"
            ],
            "answer": 0,
            "explanation": "光明和黑暗是一对反义词，勤劳和懒惰也是一对反义词。"
        }
    ]
},
{
    "title": "词语类比游戏",
    "intro": "找出词语之间的关系，选出正确答案",
    "questions": [
        {
            "stem": "鱼 : 水 = 鸟 : ___",
            "options": [
                "天空",
                "树木",
                "巢穴",
                "翅膀"
            ],
            "answer": 0,
            "explanation": "鱼生活在水中，鸟生活在天空中，两者均表示动物与其主要生存环境的关系。"
        },
        {
            "stem": "作家 : 作品 = 老师 : ___",
            "options": [
                "学校",
                "知识",
                "人才",
                "教育"
            ],
            "answer": 2,
            "explanation": "作家创作出作品，老师培养出人才，两者均表示施动者与其主要成果的关系。"
        },
        {
            "stem": "精明 : 糊涂 = 慷慨 : ___",
            "options": [
                "小气",
                "贪婪",
                "节俭",
                "吝啬"
            ],
            "answer": 3,
            "explanation": "精明与糊涂是一对反义词，表示智力状态的两极；慷慨与吝啬也是一对反义词，表示给予态度上的两极。"
        },
        {
            "stem": "璞玉 : 美玉 = 蒙昧 : ___",
            "options": [
                "知识",
                "智慧",
                "文明",
                "启蒙"
            ],
            "answer": 2,
            "explanation": "璞玉是未经雕琢的玉石，美玉是经过雕琢的精品，喻指从原生态到完美状态的转化；蒙昧是指未开化的状态，文明是指经过教化、发展而达到的开化、进步的状态。两者均表示从原始/未开发状态到成熟/开化状态的转化。"
        }
    ]
}],

  logic_puzzle: [{
    "title": "诚谎迷局",
    "scenario": "小明、小华、小丽三人是好朋友。他们中，一人总是说真话，一人总是说谎话，还有一人有时说真话有时说谎话（随机）。有一天，他们各自说了一句话：小明说：“小华是说真话的人。” 小华说：“小丽是说真话的人。” 小丽说：“我就是说真话的人。”",
    "question": "请问，他们三人中，谁是说真话的人，谁是说谎话的人，谁是随机的人？",
    "hints": [
        "假设某一人是说真话的人，然后检查是否会产生矛盾。",
        "记住只有一个人是说真话的，一个人是说谎的，一个人是随机的。"
    ],
    "answer": "我们来逐一分析：\n\n**第一步：假设小丽是说真话的人。**\n1. 如果小丽是说真话的人，那么小丽说的话“我就是说真话的人”是真的。这与假设一致，所以小丽有可能是说真话的人。\n2. 如果小丽是说真话的人，那么小明说的话“小华是说真话的人”就是假的（因为小丽是说真话的人，小华不可能是）。因此，小明不是说真话的人。\n3. 如果小丽是说真话的人，那么小华说的话“小丽是说真话的人”就是真的。\n4. 我们已知小丽是说真话的人。小明说谎话（因为他的话是假的）。\n5. 小华说了真话，但他不是说真话的人（因为小丽是）。所以，小华只能是随机的人（有时说真话有时说谎话）。\n6. 如果小丽是说真话的人，小华是随机的人，那么剩下的只有小明是说谎话的人。\n7. 检查：小明（说谎者）说“小华是说真话的人”（假话，小华是随机的）。一致。\n8. 检查：小华（随机者）说“小丽是说真话的人”（真话）。一致。\n9. 检查：小丽（说真话者）说“我就是说真话的人”（真话）。一致。\n所以，这个配置是成立的：**小丽是说真话的人，小华是随机的人，小明是说谎话的人。**\n\n**第二步：考虑其他假设，看是否会产生矛盾。**\n\n**假设小明是说真话的人。**\n1. 如果小明是说真话的人，那么小明说的话“小华是说真话的人”是真的。\n2. 这样一来，小明和小华都是说真话的人，但这与题设“只有一人总是说真话”矛盾。\n所以，小明不可能是说真话的人。\n\n**假设小华是说真话的人。**\n1. 如果小华是说真话的人，那么小华说的话“小丽是说真话的人”是真的。\n2. 这样一来，小华和小丽都是说真话的人，但这与题设“只有一人总是说真话”矛盾。\n所以，小华不可能是说真话的人。\n\n综上所述，只有当小丽是说真话的人时，所有条件都能成立。",
    "answer_short": "小明是说谎话的人，小华是随机的人，小丽是说真话的人。"
},
{
    "title": "失窃疑云",
    "scenario": "学校图书馆里一本珍贵的古籍失窃了。当时只有四名学生——小明、小红、小刚、小丽——在图书馆。经过询问，他们每人说了一句话。已知只有一名学生是小偷，且小偷一定会说谎，而其他三名无辜的学生都说了真话。\n小明说：“我没有偷书，小红也没偷。”\n小红说：“小刚偷了书。”\n小刚说：“小红在撒谎。”\n小丽说：“我没有偷书，小明也没有偷。”",
    "question": "请问，是谁偷走了古籍？",
    "hints": [
        "首先找出互相矛盾的陈述，它们之中必然有一个是真话，一个是谎话。",
        "记住只有小偷说谎，其余三人都说真话，利用这一点来排除可能性。"
    ],
    "answer": "1.  分析四名学生的陈述：\n    *   小明：“我没有偷书，小红也没偷。”\n    *   小红：“小刚偷了书。”\n    *   小刚：“小红在撒谎。”\n    *   小丽：“我没有偷书，小明也没有偷。”\n\n2.  找出矛盾的陈述：小红说“小刚偷了书”，而小刚说“小红在撒谎”。这两个陈述直接矛盾，不可能同时为真，也不可能同时为假。这意味着，他们两人中必然有一人说真话，一人说谎话。根据题目条件，说谎的那个人就是小偷。\n\n3.  因此，小偷只可能是小红或小刚。我们分两种情况进行推论：\n\n    *   **假设小红是小偷：**\n        *   如果小红是小偷，那么小红在说谎。她的陈述“小刚偷了书”是假话，这意味着小刚没有偷书。\n        *   如果小红是小偷，那么小刚不是小偷，他说的是真话。他的陈述“小红在撒谎”是真话，这与小红是小偷（说谎者）的假设一致。\n        *   现在检查其他人的陈述（他们都必须说真话）：\n            *   小明说：“我没有偷书，小红也没偷。” 如果小红是小偷，那么小红偷了书。所以小明说“小红也没偷”是假话。但这与小明是无辜者（说真话）的条件矛盾。因此，小红不可能是小偷。\n\n    *   **假设小刚是小偷：**\n        *   如果小刚是小偷，那么小刚在说谎。他的陈述“小红在撒谎”是假话，这意味着小红没有撒谎，小红说的是真话。\n        *   如果小红说的是真话，那么她的陈述“小刚偷了书”就是真话。这与小刚是小偷的假设完全一致。\n        *   现在检查其他人的陈述（他们都必须说真话）：\n            *   小明说：“我没有偷书，小红也没偷。” 如果小刚是小偷，小明是无辜的，他说真话。他确实没偷书，小红也没偷书（因为小偷是小刚）。这与小刚是小偷的假设一致。\n            *   小丽说：“我没有偷书，小明也没有偷。” 如果小刚是小偷，小丽是无辜的，她说真话。她确实没偷书，小明也没偷书（因为小偷是小刚）。这与小刚是小偷的假设一致。\n\n4.  所有陈述在假设小刚是小偷的情况下都符合题目条件。因此，小刚就是偷书的人。",
    "answer_short": "小刚"
}],

  riddle: [{
    "title": "今日脑筋急转弯",
    "riddles": [
        {
            "question": "什么东西越洗越脏？",
            "answer": "抹布",
            "explanation": "抹布是用来擦脏东西的，所以它本身会变得越来越脏。"
        },
        {
            "question": "小明从家里到学校，走了十分钟，然后又从学校回家，却只走了五分钟，为什么？",
            "answer": "他是跑着回去的。",
            "explanation": "走路和跑步的速度不同，所以时间也不同。"
        },
        {
            "question": "什么东西永远在你前面，但你却永远抓不到它？",
            "answer": "未来",
            "explanation": "未来是指尚未发生、还没有到来的时间，所以它总是在我们前面，但我们永远无法“抓住”它。"
        },
        {
            "question": "手机掉到马桶里，捞起来后第一时间应该做什么？",
            "answer": "冲水。",
            "explanation": "因为马桶已经很脏了，冲水是为了清理马桶，而不是手机。"
        },
        {
            "question": "一只鸡和一只鹅同时过河，谁先到对岸？",
            "answer": "鹅。",
            "explanation": "因为“鹅”(é)是“我”(wǒ)的谐音，所以“我”(鹅)先到对岸。"
        }
    ]
},
{
    "title": "今日脑筋急转弯",
    "riddles": [
        {
            "question": "什么水果从来不迟到？",
            "answer": "荔枝",
            "explanation": "“荔枝” (lì zhī) 的发音与“立时” (lì shí) 相似，“立时”有立刻、准时之意，所以荔枝从不迟到。"
        },
        {
            "question": "什么东西，你给它越多，它就越生气？",
            "answer": "火",
            "explanation": "“生气”可以指火势越来越旺、越来越猛烈。你给火越多燃料，它就烧得越旺，就像“生气”一样。"
        },
        {
            "question": "什么东西，它在水里的时候是“活的”，一到陆地上就“死”了？",
            "answer": "船",
            "explanation": "船在水里能航行、运行，所以是“活的”；到了陆地上就无法移动，失去其功能，所以是“死”的。"
        },
        {
            "question": "什么字，中间粗，两头细？",
            "answer": "丰",
            "explanation": "汉字“丰”的字形结构中，中间的横画较长，而上下两头的笔画相对较短，视觉上呈现出中间粗、两头细的特点。"
        },
        {
            "question": "什么东西，当你拥有它时，你看不见它；当你失去它时，你才能看见它？",
            "answer": "失去",
            "explanation": "当你拥有某样东西时，你不会特别“看见”或感受到“失去”这种状态。只有当它真正失去后，你才能察觉、体验或“看见”这种“失去”本身。"
        }
    ]
}],

  sequence: [{
    "title": "数列找规律",
    "intro": "找出下列数列的规律，填入缺失的数字",
    "sequences": [
        {
            "sequence": [
                2,
                4,
                8,
                16,
                "?"
            ],
            "answer": 32,
            "rule": "每项是前一项的2倍 (几何数列)"
        },
        {
            "sequence": [
                50,
                45,
                40,
                35,
                "?"
            ],
            "answer": 30,
            "rule": "每项比前一项小5 (等差数列)"
        },
        {
            "sequence": [
                1,
                1,
                2,
                3,
                5,
                "?"
            ],
            "answer": 8,
            "rule": "从第三项开始，每项是前两项的和 (斐波那契数列)"
        },
        {
            "sequence": [
                3,
                7,
                15,
                31,
                "?"
            ],
            "answer": 63,
            "rule": "每项是前一项的2倍加1"
        }
    ]
},
{
    "title": "数列找规律",
    "intro": "找出下列数列的规律，填入缺失的数字",
    "sequences": [
        {
            "sequence": [
                1,
                4,
                7,
                10,
                "?"
            ],
            "answer": 13,
            "rule": "每项比前一项增加3"
        },
        {
            "sequence": [
                1,
                4,
                9,
                16,
                "?"
            ],
            "answer": 25,
            "rule": "数列是自然数的平方 (1², 2², 3², ...)"
        },
        {
            "sequence": [
                1,
                1,
                2,
                3,
                5,
                "?"
            ],
            "answer": 8,
            "rule": "从第三项起，每项是前两项的和 (斐波那契数列)"
        },
        {
            "sequence": [
                1,
                2,
                4,
                7,
                11,
                "?"
            ],
            "answer": 16,
            "rule": "相邻两项的差依次递增1 (差值序列为 1, 2, 3, 4, ...)"
        }
    ]
}],

  sudoku: [{
    "title": "今日数独",
    "difficulty": "medium",
    "puzzle": [
        [
            0,
            0,
            0,
            0,
            0,
            7,
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
            6,
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
            5,
            0
        ],
        [
            0,
            0,
            0,
            0,
            8,
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
            0,
            0
        ]
    ],
    "solution": [
        [
            1,
            5,
            6,
            9,
            2,
            7,
            8,
            4,
            3
        ],
        [
            2,
            3,
            4,
            8,
            1,
            5,
            6,
            9,
            7
        ],
        [
            8,
            7,
            9,
            6,
            4,
            3,
            1,
            5,
            2
        ],
        [
            5,
            8,
            1,
            4,
            7,
            9,
            2,
            3,
            6
        ],
        [
            6,
            9,
            3,
            2,
            5,
            8,
            4,
            7,
            1
        ],
        [
            7,
            4,
            2,
            1,
            3,
            6,
            5,
            8,
            9
        ],
        [
            4,
            1,
            8,
            5,
            6,
            2,
            3,
            0,
            0
        ],
        [
            3,
            2,
            5,
            7,
            9,
            1,
            0,
            0,
            0
        ],
        [
            9,
            6,
            7,
            3,
            8,
            4,
            0,
            0,
            0
        ]
    ]
},
{
    "title": "今日数独",
    "difficulty": "medium",
    "puzzle": [
        [
            0,
            0,
            0,
            0,
            0,
            4,
            0,
            9,
            0
        ],
        [
            0,
            7,
            0,
            0,
            0,
            0,
            0,
            0,
            3
        ],
        [
            1,
            0,
            0,
            0,
            9,
            0,
            8,
            0,
            0
        ],
        [
            0,
            0,
            5,
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
            4,
            0,
            0,
            0,
            5,
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
            1,
            0,
            0
        ],
        [
            0,
            0,
            6,
            0,
            8,
            0,
            0,
            0,
            9
        ],
        [
            2,
            0,
            0,
            0,
            0,
            0,
            0,
            4,
            0
        ],
        [
            0,
            4,
            0,
            3,
            0,
            0,
            0,
            0,
            0
        ]
    ],
    "solution": [
        [
            5,
            6,
            3,
            8,
            1,
            4,
            7,
            9,
            2
        ],
        [
            8,
            7,
            9,
            2,
            5,
            6,
            4,
            1,
            3
        ],
        [
            1,
            2,
            4,
            7,
            9,
            3,
            8,
            5,
            6
        ],
        [
            9,
            1,
            5,
            4,
            7,
            8,
            2,
            3,
            6
        ],
        [
            7,
            3,
            4,
            6,
            2,
            1,
            5,
            8,
            9
        ],
        [
            6,
            8,
            2,
            5,
            3,
            9,
            1,
            7,
            4
        ],
        [
            4,
            5,
            6,
            1,
            8,
            7,
            3,
            2,
            9
        ],
        [
            2,
            9,
            8,
            1,
            6,
            5,
            3,
            4,
            7
        ],
        [
            3,
            4,
            1,
            9,
            2,
            7,
            6,
            8,
            5
        ]
    ]
}],

  memory_match: [{
    "title": "今日记忆翻牌",
    "theme": "可爱动物",
    "pairs": [
        {
            "id": 1,
            "emoji": "🐼",
            "label": "熊猫"
        },
        {
            "id": 2,
            "emoji": "🐱",
            "label": "猫咪"
        },
        {
            "id": 3,
            "emoji": "🐶",
            "label": "小狗"
        },
        {
            "id": 4,
            "emoji": "🐰",
            "label": "兔子"
        },
        {
            "id": 5,
            "emoji": "🐻",
            "label": "小熊"
        },
        {
            "id": 6,
            "emoji": "🦊",
            "label": "狐狸"
        },
        {
            "id": 7,
            "emoji": "🦁",
            "label": "小狮子"
        },
        {
            "id": 8,
            "emoji": "🦉",
            "label": "猫头鹰"
        }
    ]
},
{
    "title": "今日记忆翻牌",
    "theme": "美味水果",
    "pairs": [
        {
            "id": 1,
            "emoji": "🍎",
            "label": "苹果"
        },
        {
            "id": 2,
            "emoji": "🍌",
            "label": "香蕉"
        },
        {
            "id": 3,
            "emoji": "🍊",
            "label": "橙子"
        },
        {
            "id": 4,
            "emoji": "🍓",
            "label": "草莓"
        },
        {
            "id": 5,
            "emoji": "🍇",
            "label": "葡萄"
        },
        {
            "id": 6,
            "emoji": "🍍",
            "label": "菠萝"
        },
        {
            "id": 7,
            "emoji": "🍉",
            "label": "西瓜"
        },
        {
            "id": 8,
            "emoji": "🍑",
            "label": "桃子"
        }
    ]
}],
}
