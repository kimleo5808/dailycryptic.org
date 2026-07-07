# NYT Letter Boxed 提示页 — Blueprint

> 第一批第 3 个页面。流程：研究 → SEO(backlinko) → UI(frontend-design) → 落地。

## 0. 竞品（第①步）
word.tips / thewordfinder / letterboxdsolver / connectionssolver 等。模式：展示今日双词解（"gold star"）+ 无剧透提示（难字 J/K/Q/X/Z 优先、辅音簇 str/tion、词链规划）+ solver 工具。
**差距 = 切入点**：竞品多为纯 solver/静态答案，缺"可视化盒子 + 解路径动画 + 深度解题教学 + cryptic 桥接"。数据源 `window.gameData` 干净（sides / ourSolution / dictionary，dictionary 不存储）。

## 1. 路由与元数据
- today：`/letter-boxed-answers-today`（主词 `letter boxed answers today`）；归档 `/letter-boxed-answers` + `[date]`。
- Title(≤60)：`NYT Letter Boxed Answers & Hints Today — 2-Word`
- Desc(≤155)：`Today's NYT Letter Boxed answer and hints. Spoiler-free nudges first, then the official two-word solution. Updated daily, free.`
- H1：`NYT Letter Boxed Answers & Hints for Today`

## 2. 关键词/词密（1–3%）
主 `letter boxed answers today`；副 `letter boxed hints today`、`letter boxed solution`、`nyt letter boxed two word solution`、`how to play letter boxed`。LSI：box, sides, word chain, pangram-free, NYT games, two-word。

## 3. 结构
### A. 每日动态（无剧透梯度）
1. **字母盒（SVG）**：正方形四边各 3 字母（12 节点），今日 sides 渲染。
2. **无剧透提示梯度**（折叠递进）：解用几词、各词长度、各词首字母 + 所在边、难字提示。
3. **解答 Reveal**：官方双词解；reveal 时在盒子上**描出解路径**（节点连线动画）。
### B. 常青（≥1500 词，固定 H2）
B1 What Is Letter Boxed ~220 · B2 How to Play (rules) ~300 · B3 Reading the Box / sides & chain rule ~260 · B4 How to Find a Two-Word Solution ~360 · B5 6 Strategies ~360 · B6 Letter Boxed & Cryptic Crosswords (独有桥接) ~240 · B7 FAQ ~300 · B8 More games ~120。合计 ≈ 2,160。

## 4. FAQ(8)
today's answer / how to play / what's a two-word solution / can letters repeat & the side rule / when reset / free? / archive / does it help cryptic solving。

## 5. 内链
today's cryptic clue · anagram solver · crossword word finder · Spelling Bee answers today · Wordle answers today · Letter Boxed archive。反向：nav(Hints)+footer+各游戏 more-games。

## 6. Schema
FAQPage + Breadcrumb + Article。

## 7. AdSense
① 解答块后/常青前 ② B4/B5 间 ③ FAQ 前。避开盒子/提示/Reveal 交互区。

## 8. 数据管线
- `data/letter-boxed/puzzles.json`：{id, printDate, sides[4], solution=base64(JSON(words))}。**不存 dictionary**（1194 词/天，避免 Worker 大 JSON）。仅 today 可取，归档随日累积。
- `scripts/fetch-letter-boxed.mjs`（解析 gameData，`--file` 支持）+ `lib/letter-boxed-data.ts` + `.github/workflows/update-letter-boxed.yml`（每日）。

## 9. UI（第③步 · frontend-design）
### 方向：Neon Wire / Connect-the-Dots（连点描线）
与 Spelling Bee 暖蜂巢、Pips 蓝图网格刻意区隔：Letter Boxed 走**极简几何 + 霓虹描线**。用尚未用过的**翠绿/teal**作强调色（复用 `--chart-2` emerald / `--strands-hint` teal），区别于琥珀(SB)、靛蓝(Pips)。记忆点 = 字母盒 + reveal 时**沿解路径逐段描线动画**。
### 令牌
强调 teal `hsl(var(--strands-hint))`；节点/描边用 foreground/border；reveal 路径 teal 渐显；卡片 --card。
### 布局
1. 字母盒 SVG：正方形，四边各 3 字母节点（圆点 + 字母），细描边框。节点载入交错 `fade-in-up`。
2. 提示梯度：Radix 折叠，teal 徽章；难字提示用 mono。
3. Reveal：双词解 pill（mono 大字）+ 盒子上 polyline 描出字母链（`stroke-dasharray` 描线动画，`prefers-reduced-motion` 关）。
4. 常青编辑式：定义引用卡（teal 左竖条）、B4 双词解教学、B5 策略序号列表、B6 cryptic 桥接高亮卡。FAQ 手风琴。
### 组件
```
components/letter-boxed/
  LetterBoxedBox.tsx        // SVG 盒子 + 12 节点（+可选解路径）
  LetterBoxedSolution.tsx   // client: reveal 双词解 + 触发路径
  LetterBoxedHints.tsx      // client: 无剧透提示梯度
  LetterBoxedPuzzleCard.tsx // 归档卡片
```
### 可访问性
盒子 SVG aria-label 今日字母；Reveal 用 `<button aria-expanded>`；解路径不只靠颜色（配文字双词解）；节点对比度达 AA。
