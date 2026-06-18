# Daily Brain Training 每日脑力训练 🧠

[English](#english) | [中文](#中文)

---

<a id="english"></a>
## English

An AI-generated daily brain training game to keep your mind active. Supports English and Chinese.

### Game Types

| Game | Description |
|---|---|
| 🐢 Turtle Soup | Lateral thinking puzzle — ask yes/no questions to uncover the full story |
| 🔤 Word Analogy | Find the relationship between word pairs |
| 🧩 Logic Puzzle | Classic reasoning puzzles (river crossing, truth-tellers/liars, etc.) |
| 🃏 Memory Match | Emoji pair-matching memory game |
| 💡 Riddle | 5 fun brain teasers |
| 🔢 Sudoku | Classic 9x9 Sudoku |
| 📐 Sequence | Find the pattern and fill in the missing number |

The game rotates daily based on the date. Difficulty (where applicable) is decided by the AI at generation time and returned along with the puzzle — it isn't hardcoded. Tap the **"?"** icon before playing any game for instructions.

> **Note on Sudoku:** unlike the other games, Sudoku puzzles are **not** AI-generated. They're produced locally using the [`sudoku-gen`](https://www.npmjs.com/package/sudoku-gen) package, which guarantees a valid, uniquely-solvable puzzle every time. The difficulty (easy/medium/hard) is picked at random on the server for each day.

### Architecture

```
Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
Backend:  Next.js API Routes
AI:       Google Gemini (via @google/generative-ai) [alternative: Anthropic Claude, paid]
Sudoku:   sudoku-gen (local generation, no AI call)
Cache:    Upstash Redis (daily puzzle data, cached for 48 hours)
Progress: localStorage (user progress & streak, scoped by date + game type)
```

#### Security design

- Correct answers / Sudoku solutions are **never** sent to the client — they live only in Redis.
- The client only ever receives the puzzle itself (question text, options, grid, etc.) and submits answers to `/api/check-answer` for server-side validation.
- Revealing an answer goes through a dedicated `/api/reveal-answer` endpoint, fetched on demand rather than included in the initial payload.

### Getting Started

#### 1. Install dependencies

```bash
npm install
```

#### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

**AI (choose one)**

```env
# Google Gemini (recommended, generous free tier)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash   # optional, this is the default

# Or Anthropic Claude (paid)
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

👉 Get a Gemini API key: [aistudio.google.com](https://aistudio.google.com/)
👉 Get an Anthropic API key: [console.anthropic.com](https://console.anthropic.com)

**Upstash Redis (stores daily puzzles & answers)**

```env
KV_REST_API_URL=your-upstash-url
KV_REST_API_TOKEN=your-upstash-token
```

👉 Create a database in your Vercel project under **Storage → Upstash → Create**, then run:

```bash
vercel env pull .env.local
```

This will populate the variables automatically.

#### 3. Run the dev server

```bash
npm run dev
```

Open <http://localhost:3000>.

#### 4. Build for production

```bash
npm run build
npm start
```

### Deployment

Recommended: **Vercel**

1. Push the code to GitHub
2. Import the project at [vercel.com](https://vercel.com)
3. Create an Upstash Redis database under **Storage** (env vars are injected automatically)
4. Add `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`) to your Vercel environment variables
5. Deploy!

### Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── generate-game/
│   │   │   └── route.ts          # Generates/caches today's puzzle; strips answers before returning
│   │   ├── check-answer/
│   │   │   └── route.ts          # Server-side answer validation (exact match + AI semantic check)
│   │   └── reveal-answer/
│   │       └── route.ts          # On-demand answer/explanation reveal
│   ├── components/
│   │   ├── TurtleSoup.tsx
│   │   ├── Riddle.tsx
│   │   ├── WordAnalogy.tsx
│   │   ├── Sequence.tsx
│   │   ├── Sudoku.tsx
│   │   ├── LogicPuzzle.tsx
│   │   ├── MemoryMatch.tsx
│   │   └── HowToPlayModal.tsx    # "How to play" popup
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # Main page: language switching, progress loading, streak
└── lib/
    ├── gameTypes.ts               # Game type definitions + AI prompts + GAME_SAMPLE
    ├── sudoku.ts                  # Sudoku generation (wraps sudoku-gen)
    ├── validateGame.ts            # Validates AI-returned data structure
    ├── howToPlay.ts                # Bilingual "how to play" copy per game
    ├── progress.ts                 # localStorage read/write/cleanup for user progress
    └── i18n.ts                     # Language types & helpers
```

### User Progress & Streaks

- Each game component persists its play state (current question, selected answers, revealed status, etc.) via an `onProgress` callback into `localStorage`, keyed by **date + game type** — refreshing the page won't lose progress.
- The streak only increments once the day's game is marked complete.
- `cleanOldStorage()` runs on startup and removes entries older than the retention window (default 7 days), keeping localStorage tidy.

### Customization

#### Add a new game type

1. Add the new type to the `GAME_TYPES` array in `src/lib/gameTypes.ts`
2. Add the corresponding AI prompt to `GAME_PROMPTS`
3. Add validation rules in `src/lib/validateGame.ts`
4. Add bilingual instructions in `src/lib/howToPlay.ts`
5. Create the game component in `src/app/components/` (ideally supporting `progress`/`onProgress` for persistence)
6. If the game has an answer that must stay secret, add the field to `stripAnswers()` in `generate-game/route.ts`, and implement validation in `check-answer` / `reveal-answer`
7. Import and render the component in `src/app/page.tsx`

#### Change the rotation logic

Edit the `getGameTypeForDate` function in `src/lib/gameTypes.ts`.

#### Adjust cache duration

The `ex` parameter (in seconds) on the Redis call in `generate-game/route.ts` controls how long a day's puzzle is cached. Default is 48 hours.

### License

MIT

---

<a id="中文"></a>
## 中文

AI 每天自动生成一个脑力训练游戏，保持大脑活跃。支持中英双语。

### 游戏类型

| 游戏 | 说明 |
|---|---|
| 🐢 海龟汤 | 水平思维解谜，提问猜测完整故事 |
| 🔤 词语类比 | 找出词语之间的关系 |
| 🧩 逻辑推理 | 河流过河、真话假话等经典谜题 |
| 🃏 记忆翻牌 | Emoji 配对记忆游戏 |
| 💡 脑筋急转弯 | 5 道有趣的脑筋急转弯 |
| 🔢 数独 | 经典 9x9 数独 |
| 📐 数列找规律 | 找出数列规律并填入答案 |

每天根据日期自动切换游戏类型。难度（如适用）由 AI 在生成题目时一并判断并返回，并非预先写死。开始游戏前可点击 **「？」** 图标查看玩法说明。

> **关于数独的特别说明：** 与其他游戏不同，数独题目**并非由 AI 生成**，而是使用 [`sudoku-gen`](https://www.npmjs.com/package/sudoku-gen) 这个 package 在本地生成，可以保证每次生成的题目都有效且有唯一解。难度（简单/中等/困难）由服务器每天随机挑选。

### 技术架构

```
Frontend: Next.js 14 + React + TypeScript + Tailwind CSS
Backend:  Next.js API Routes
AI:       Google Gemini (via @google/generative-ai) [备选: Anthropic Claude，需要付费]
数独:     sudoku-gen（本地生成，不调用 AI）
Cache:    Upstash Redis（每日题目数据，缓存 48 小时）
Progress: localStorage（用户进度与连续挑战天数，按日期 + 游戏类型隔离）
```

#### 安全设计

- 题目的正确答案 / 数独解答 **不会**发送到客户端，统一存放在 Redis。
- 客户端只能拿到题目本身（题干、选项、谜题等），通过 `/api/check-answer` 提交答案做服务器端校验。
- 答案揭晓（Reveal）也走专门的 `/api/reveal-answer` 接口，按需拉取，不在初次请求中暴露。

### 快速开始

#### 1. 安装依赖

```bash
npm install
```

#### 2. 配置环境变量

```bash
cp .env.example .env.local
```

编辑 `.env.local`：

**AI（任选其一）**

```env
# Google Gemini（推荐，免费额度充足）
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash   # 可选，默认值

# 或 Anthropic Claude（需要付费）
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

👉 Gemini API Key 获取地址：[aistudio.google.com](https://aistudio.google.com/)
👉 Anthropic API Key 获取地址：[console.anthropic.com](https://console.anthropic.com)

**Upstash Redis（存储每日题目与答案）**

```env
KV_REST_API_URL=your-upstash-url
KV_REST_API_TOKEN=your-upstash-token
```

👉 在 Vercel 项目的 **Storage → Upstash → Create** 创建数据库，然后执行：

```bash
vercel env pull .env.local
```

会自动写入对应的环境变量。

#### 3. 启动开发服务器

```bash
npm run dev
```

打开 <http://localhost:3000> 即可体验。

#### 4. 构建生产版本

```bash
npm run build
npm start
```

### 部署

推荐部署到 **Vercel**：

1. 将代码推送到 GitHub
2. 在 [vercel.com](https://vercel.com) 导入项目
3. 在 Vercel **Storage** 中创建 Upstash Redis 数据库（会自动注入环境变量）
4. 在 Vercel 环境变量中添加 `GEMINI_API_KEY`（或 `ANTHROPIC_API_KEY`）
5. 部署完成！

### 项目结构

```
src/
├── app/
│   ├── api/
│   │   ├── generate-game/
│   │   │   └── route.ts          # 生成/缓存今日题目，返回前已剥离答案
│   │   ├── check-answer/
│   │   │   └── route.ts          # 服务器端校验用户答案（精确匹配 + AI 语义判断）
│   │   └── reveal-answer/
│   │       └── route.ts          # 按需揭晓答案/解析
│   ├── components/
│   │   ├── TurtleSoup.tsx
│   │   ├── Riddle.tsx
│   │   ├── WordAnalogy.tsx
│   │   ├── Sequence.tsx
│   │   ├── Sudoku.tsx
│   │   ├── LogicPuzzle.tsx
│   │   ├── MemoryMatch.tsx
│   │   └── HowToPlayModal.tsx    # 玩法说明弹窗
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                  # 主页面，负责语言切换、进度加载、连续挑战天数
└── lib/
    ├── gameTypes.ts               # 游戏类型定义 + AI Prompts + GAME_SAMPLE
    ├── sudoku.ts                  # 数独生成（sudoku-gen 封装）
    ├── validateGame.ts            # AI 返回数据的结构校验
    ├── howToPlay.ts                # 各游戏玩法说明文案（中英双语）
    ├── progress.ts                 # 用户进度的 localStorage 读写与清理
    └── i18n.ts                     # 语言类型与工具函数
```

### 用户进度与连续挑战

- 每个游戏组件的作答状态（当前题号、已选答案、是否揭晓等）会通过 `onProgress` 回调持久化到 `localStorage`，键名按 **日期 + 游戏类型** 隔离，刷新页面不会丢失进度。
- 连续挑战天数（streak）只在当天题目被标记为「已完成」时才会增加。
- `cleanOldStorage()` 会在每次启动时清理超过保留天数（默认 7 天）的旧记录，避免 localStorage 无限增长。

### 自定义

#### 添加新游戏类型

1. 在 `src/lib/gameTypes.ts` 的 `GAME_TYPES` 数组中添加新类型
2. 在 `GAME_PROMPTS` 中添加对应的 AI prompt
3. 在 `src/lib/validateGame.ts` 中添加数据结构校验
4. 在 `src/lib/howToPlay.ts` 中添加双语玩法说明
5. 在 `src/app/components/` 中创建新的游戏组件（建议同时支持 `progress`/`onProgress` 以持久化进度）
6. 如果该游戏有需要保密的答案，在 `generate-game/route.ts` 的 `stripAnswers()` 中添加对应字段，并在 `check-answer` / `reveal-answer` 中实现校验逻辑
7. 在 `src/app/page.tsx` 中引入并渲染新组件

#### 修改游戏轮换逻辑

编辑 `src/lib/gameTypes.ts` 中的 `getGameTypeForDate` 函数。

#### 调整缓存时间

`generate-game/route.ts` 中 Redis 的 `ex` 参数（单位：秒）控制题目缓存有效期，默认 48 小时。

### License

MIT
