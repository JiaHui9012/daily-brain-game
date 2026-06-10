// src/lib/howToPlay.ts
import { GameTypeId } from './gameTypes'
import { Language } from './i18n'

export const HOW_TO_PLAY: Record<GameTypeId, Record<Language, string[]>> = {
  turtle_soup: {
    en: [
      'Read the scenario — a mysterious situation is described.',
      'Your goal is to figure out the full story behind it.',
      'Ask up to 10 yes/no questions. The host answers Yes, No, or Irrelevant.',
      'Use hints if you get stuck.',
      'When you think you know the answer, reveal it to check.',
    ],
    zh: [
      '阅读情境——一个神秘的场景描述。',
      '你的目标是找出背后的完整故事。',
      '最多可以提问 10 个是非题，主持人会回答"是""不是"或"无关"。',
      '遇到困难可以查看提示。',
      '当你认为找到答案时，揭晓答案进行验证。',
    ],
  },
  riddle: {
    en: [
      'Read each riddle carefully.',
      'Type your answer and tap Check — or press Enter.',
      'Your answer is checked for meaning, not just exact wording.',
      'Tap Reveal if you give up, then move to the next riddle.',
      'Work through all riddles to complete today\'s challenge.',
    ],
    zh: [
      '仔细阅读每道谜题。',
      '输入答案后点击"检查"或按回车键提交。',
      '系统会根据意思判断是否正确，不要求一字不差。',
      '放弃时点击"揭晓答案"，然后继续下一题。',
      '完成所有谜题即挑战成功！',
    ],
  },
  word_analogy: {
    en: [
      'Each question shows a word pair that shares a relationship, e.g. fish : water.',
      'Find the word that completes the second pair in the same way.',
      'Tap your chosen answer from the four options.',
      'An explanation is shown after each answer.',
      'Work through all questions to see your final score.',
    ],
    zh: [
      '每道题展示一对有某种关系的词，例如：鱼 : 水。',
      '找出能以同样方式补全第二个词对的选项。',
      '从四个选项中点击你认为正确的答案。',
      '每道题作答后会显示解析。',
      '完成所有题目后查看最终得分。',
    ],
  },
  sequence: {
    en: [
      'Each sequence has a hidden pattern — find it.',
      'The "?" marks the missing number you need to find.',
      'Type your answer in the box and tap Confirm.',
      'The rule is revealed after you answer.',
      'Complete all sequences to finish today\'s puzzle.',
    ],
    zh: [
      '每个数列都有一个隐藏规律，找出它。',
      '"?" 表示你需要填入的缺失数字。',
      '在输入框中填写答案，点击"确认"提交。',
      '作答后会揭示该数列的规律。',
      '完成所有数列即挑战成功！',
    ],
  },
  sudoku: {
    en: [
      'Fill the 9×9 grid so every row, column, and 3×3 box contains digits 1–9.',
      'Tap a cell to select it, then tap a number to place it.',
      'Toggle Notes mode to pencil in candidates without committing.',
      'Tap Erase to clear the selected cell.',
      'Tap Check when done — wrong cells are highlighted in red.',
    ],
    zh: [
      '在 9×9 方格中填入数字，使每行、每列、每个 3×3 宫都包含 1–9。',
      '点击格子选中，再点击下方数字键填入。',
      '开启"笔记"模式可标注候选数字。',
      '点击"清除"可删除选中格子的内容。',
      '完成后点击"检查"，错误格子会红色高亮。',
    ],
  },
  logic_puzzle: {
    en: [
      'Read the scenario carefully — all needed info is there.',
      'Reason through the problem step by step before answering.',
      'Type your answer and tap Check. Meaning matters, not exact wording.',
      'Use hints one at a time if you get stuck.',
      'Reveal the full solution whenever you\'re ready.',
    ],
    zh: [
      '仔细阅读情境描述——所有需要的信息都在其中。',
      '在作答前，请逐步分析推理。',
      '输入答案后点击"检查"，系统按意思判断。',
      '遇到困难时可以逐条查看提示。',
      '准备好后随时揭晓完整解答。',
    ],
  },
  memory_match: {
    en: [
      'All cards start face-down. Tap a card to flip it.',
      'Tap a second card — if it matches, both stay face-up.',
      'If they don\'t match, both flip back after a moment.',
      'Remember card positions to match in fewer moves.',
      'Find all pairs to complete the game!',
    ],
    zh: [
      '所有卡牌初始背面朝上，点击翻开。',
      '再点击第二张——若相同，两张保持正面朝上。',
      '若不匹配，两张稍后翻回背面。',
      '记住每张牌的位置，用最少步数完成配对。',
      '找出所有配对即游戏成功！',
    ],
  },
}