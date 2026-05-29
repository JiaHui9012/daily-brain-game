# 每日脑力训练 🧠

AI 每天自动生成一个脑力训练游戏，保持大脑活跃。

## 游戏类型

| 游戏 | 难度 | 说明 |
|------|------|------|
| 🐢 海龟汤 | 中等 | 水平思维解谜，猜测完整故事 |
| 🔤 词语类比 | 简单 | 找出词语之间的关系 |
| 🧩 逻辑推理 | 困难 | 河流过河、真话假话等经典谜题 |
| 🃏 记忆翻牌 | 简单 | Emoji 配对记忆游戏 |
| 💡 脑筋急转弯 | 简单 | 5 道有趣的脑筋急转弯 |
| 🔢 数独 | 中等 | 经典 9x9 数独 |
| 📐 数列找规律 | 中等 | 找出数列规律并填入答案 |

每天根据日期自动切换游戏类型，同一天内游戏内容会缓存在 localStorage，不重复调用 API。

## 技术架构

```
Frontend: Next.js 14 + React + Tailwind CSS
Backend:  Next.js API Route (/api/generate-game)
AI:       Google Gemini (via @google/generative-ai) [ori used (but need money): Anthropic Claude Sonnet (via @anthropic-ai/sdk)]
Cache:    localStorage (按日期缓存，每天只调用一次 API)
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置 API Key

```bash
cp .env.example .env.local
```

编辑 `.env.local`，填入你的 API Key：

If using Google Gemini:

```
GEMINI_API_KEY=gemini-api-key
```

👉 在 [aistudio.google.com](https://aistudio.google.com/) 获取 API Key

If using Anthropic Claude Sonnet:

```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

👉 在 [console.anthropic.com](https://console.anthropic.com) 获取 API Key

### 3. 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可体验。

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 部署

推荐部署到 **Vercel**（免费）：

1. 将代码推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 在 Vercel 环境变量中添加 `ANTHROPIC_API_KEY`
4. 部署完成！

## 项目结构

```
src/
├── app/
│   ├── api/
│   │   └── generate-game/
│   │       ├── route.ts        # 后端 API，调用 Google Gemini，保护 API Key
│   │       └── route1.ts       # 后端 API，调用 Anthropic，保护 API Key
│   ├── components/
│   │   ├── TurtleSoup.tsx      # 海龟汤游戏
│   │   ├── Riddle.tsx          # 脑筋急转弯
│   │   ├── WordAnalogy.tsx     # 词语类比
│   │   ├── Sequence.tsx        # 数列找规律
│   │   ├── Sudoku.tsx          # 数独
│   │   ├── LogicPuzzle.tsx     # 逻辑推理
│   │   └── MemoryMatch.tsx     # 记忆翻牌
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # 主页面
└── lib/
    └── gameTypes.ts            # 游戏类型定义 + AI Prompts
```

## 自定义

### 添加新游戏类型

1. 在 `src/lib/gameTypes.ts` 的 `GAME_TYPES` 数组中添加新类型
2. 在 `GAME_PROMPTS` 中添加对应的 prompt
3. 在 `src/app/components/` 中创建新的游戏组件
4. 在 `src/app/page.tsx` 中引入并渲染新组件

### 修改游戏轮换逻辑

编辑 `src/lib/gameTypes.ts` 中的 `getGameTypeForDate` 函数。
