# The Forge Codes 项目需求文档（Agent 执行版）

## 1. 项目概述
- 项目名称：The Forge Codes 关键词站
- 品牌名：`theforgecodes`
- 主域名：`theforgecodes.app`
- 目标关键词：`the forge codes`
- 目标平台：`Cloudflare + GitHub`
- 基础模板：`weijunext/nextjs-starter`
- 当前阶段：需求与实施规划（不写业务代码）

## 2. 项目目标
- 在搜索意图为 `INFO` 的场景下，提供“可验证、可追溯、更新快”的代码信息页。
- 首页围绕 `the forge codes` 打造为核心流量入口，承接主词和高相关长尾词。
- 通过“活跃/失效分离 + 验证时间 + 更新日志”形成与竞品的内容差异化。
- 在上线后 30 天内完成基础内容矩阵和站内内链闭环。

## 3. 业务与SEO需求
- 首页必须聚焦 `the forge codes`，并提供实时状态信息（Active / Expired / Last Verified）。
- 全站品牌统一使用 `theforgecodes`（站点名、页脚、SEO 品牌字段保持一致）。
- 站点 canonical 主域名统一为 `https://theforgecodes.app`（避免多域名收录分散）。
- 首页正文目标字数：`1500-3000` 字。
- 核心关键词密度目标：约 `3%`（建议控制在 `2.8%-3.3%`）。
- 必须布局相关关键词：
`the forge roblox codes`
`the forge codes roblox`
`codes for the forge`
`new codes for the forge`
`the forge working codes`
`how to redeem codes in the forge`
`where to put codes in the forge`
`the forge codes 2026`
- 首页需包含高意图区块：可用代码、失效代码、兑换教程、失效排查、更新日志、FAQ。
- 每个代码条目应支持最小信息单元：`code`、`reward`、`status`、`last_tested`、`source`。

## 4. 竞品导向结论（用于约束设计）
- 主词竞争不低，SERP 常见高权重媒体站（如 beebom、gamesradar、dexerto）。
- 同日期下不同站点代码状态可能冲突，说明“真实性与更新时间”是用户痛点。
- 站点差异化关键不是“再做一份列表”，而是“明确验证机制并公开变更日志”。

## 5. 站点信息架构（MVP）
- `/`：首页（主入口，承接主词）
- `/the-forge-codes`：主词核心页（可与首页合并或首页即该页）
- `/the-forge-codes/{month-year}`：月度页（承接新鲜度长尾）
- `/how-to-redeem-the-forge-codes`：兑换教程页
- `/the-forge-codes-faq`：问题页
- `/the-forge-codes-history`：历史归档页

## 6. 首页结构要求（必须落地）
- Hero：展示主标题、副标题、最后验证时间、今日变更统计。
- Active 区：显示当前可用代码表，含复制操作入口（后续实现）。
- Expired 区：折叠展示历史失效代码，保留透明度。
- Redeem Guide 区：简要步骤 + 跳转完整教程。
- Troubleshooting 区：解释“为什么代码不工作”。
- Update Log 区：按时间倒序记录新增/失效/复测动作。
- FAQ 区：覆盖高频问题并服务长尾查询。

## 7. 非功能需求
- SEO：完整 `title`、`meta description`、语义化 `H1-H2`、结构化内链。
- 性能：首屏核心信息优先可见，避免用户向下滚动才看到可用代码。
- 可维护：代码数据结构化，支持后续自动化更新。
- 可扩展：可复制到其它 Roblox 游戏代码词站。

## 8. 技术与部署约束
- 使用 `nextjs-starter` 作为基础工程。
- 部署链路采用 Cloudflare Workers（基于 OpenNext）+ GitHub 自动构建。
- 分支策略：`main` 生产分支，功能通过 PR 合入。
- 内容更新与代码发布尽量解耦，保证更新频率。

## 9. 验收标准（Definition of Done）
- 首页具备可发布文案（1500-3000 字），并满足主词密度目标。
- 首页可清晰看到：Active / Expired / Redeem / FAQ / Update Log 五大核心内容。
- 至少完成 5 个基础页面并形成互链。
- 部署流程打通：GitHub push 可触发 Cloudflare 自动部署。
- 页面首屏 3 秒内可见“当前可用代码信息”（目标，不含极端网络）。

## 10. 风险与应对
- 风险：主词竞争高，短期难以进入前排。
- 应对：先吃长尾词 + 月份词 + 问题词，逐步积累权重。
- 风险：代码状态变化快，内容过期导致跳出率上升。
- 应对：设置每日更新 SOP，并在页面显式显示最后验证时间。
- 风险：首页关键词堆砌导致可读性下降。
- 应对：按区块自然分布关键词，优先用户可读性。

## 11. 详细 TODO List（按优先级）

### P0（本周必须完成）
- [ ] 确认首页是否即主词页（`/` 与 `/the-forge-codes` 的 canonical 策略）。
- [ ] 完成首页信息架构定稿（Hero、Active、Expired、Redeem、FAQ、Update Log）。
- [ ] 产出首页最终 SEO 文案（1500-3000 字，主词密度约 3%）。
- [ ] 定义代码数据字段：`code/reward/status/last_tested/source`。
- [ ] 建立“更新日志”数据格式（新增、失效、复测三种事件）。
- [ ] 完成 Title / Meta / H 标签方案并审核关键词覆盖。
- [ ] 输出内链策略（首页到教程/FAQ/月度页/历史页）。

### P1（第 2 周完成）
- [ ] 完成 `how-to-redeem` 页面文案与结构。
- [ ] 完成 `faq` 页面文案与结构（覆盖 not working 场景）。
- [ ] 完成 `history` 页面结构与首批样例数据。
- [ ] 完成首个 `month-year` 页面（如 February 2026）。
- [ ] 完成站点级 SEO 基础项：sitemap、robots、OG 基础信息。
- [ ] 完成首页与子页面的关键词分工，避免内耗。

### P1（部署链路）
- [ ] 完成 Cloudflare Workers 方案选型与配置清单。
- [ ] 打通 GitHub 仓库与 Cloudflare 自动构建。
- [ ] 配置环境变量、构建命令、产物验证。
- [ ] 绑定主域名 `theforgecodes.app` 并验证 HTTPS 与缓存策略。
- [ ] 配置 `www` 与非 `www` 的统一跳转策略（固定到单一主域）。

### P2（第 3-4 周优化）
- [ ] 建立内容更新 SOP（每日检查、每周回顾）。
- [ ] 增加“最近 7 次验证记录”模块增强信任。
- [ ] 增加“失效原因统计”模块提升实用性。
- [ ] 迭代 Meta 标题与描述（按 CTR 表现调优）。
- [ ] 增加更多问题词落地页（如 where/how/not working 组合）。
- [ ] 建立竞品跟踪表（beebom/tryhardguides 等）并每周更新。

### 持续性任务（每周循环）
- [ ] 每日最少一次复测代码并更新 `last_tested`。
- [ ] 每周一次核查关键词排名与收录情况。
- [ ] 每周一次检查页面内容时效性与失效信息。
- [ ] 每周一次审查内链完整性和页面跳出点。

## 12. 里程碑
- M1（D+3）：首页可发布文案定稿 + 页面结构冻结。
- M2（D+7）：核心页面群完成（首页/教程/FAQ/历史/月度）。
- M3（D+10）：Cloudflare + GitHub 自动部署打通。
- M4（D+30）：完成首轮内容矩阵与SEO基础优化闭环。

## 13. 本文档使用说明
- 本文档作为执行基线，后续调整需在文档中追加“变更记录”。
- 若关键词策略变化，优先更新第 3、5、11 节并同步所有执行项。
- 若新增页面，必须先定义其关键词职责，避免与首页主词互相竞争。

## 14. 品牌与 SEO 字段统一规范（新增）

### 14.1 全站品牌常量
- Brand Name: `theforgecodes`
- Primary Domain: `https://theforgecodes.app`
- Site URL (base): `https://theforgecodes.app`
- Default Locale: `en-US`

### 14.2 Canonical 与域名统一
- 所有页面 canonical 必须使用 `https://theforgecodes.app{path}`。
- 非主域（如 `www.theforgecodes.app`）统一 301 到主域。
- HTTP 统一跳转到 HTTPS。
- 首页 canonical 固定为 `https://theforgecodes.app/`。

### 14.3 页面级 SEO 字段模板
- `title`: `The Forge Codes (Month Year): Active & Expired + Last Verified | theforgecodes`
- `description`: `Get verified the forge codes with daily updates, active/expired status, rewards, and redeem steps.`
- `robots`: `index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1`
- `alternates.canonical`: `https://theforgecodes.app{path}`

### 14.4 Open Graph 统一口径
- `og:site_name`: `theforgecodes`
- `og:type`: `website`
- `og:title`: 与页面 title 保持一致
- `og:description`: 与页面 description 保持语义一致
- `og:url`: `https://theforgecodes.app{path}`
- `og:image`: `https://theforgecodes.app/og/default.jpg`（后续可按页面动态生成）

### 14.5 Twitter Card 统一口径
- `twitter:card`: `summary_large_image`
- `twitter:title`: 与页面 title 一致
- `twitter:description`: 与页面 description 一致
- `twitter:image`: `https://theforgecodes.app/og/default.jpg`

### 14.6 JSON-LD（组织信息）
- `@type`: `Organization`
- `name`: `theforgecodes`
- `url`: `https://theforgecodes.app`
- `logo`: `https://theforgecodes.app/logo.png`

### 14.7 JSON-LD（网页信息）
- `@type`: `WebSite`
- `name`: `theforgecodes`
- `url`: `https://theforgecodes.app`
- `potentialAction` 使用站内搜索（后续实现）

### 14.8 首页专属字段要求
- 首页 Title 必须含主词 `the forge codes` 与当月时间词。
- 首页 Description 必须含主词 `the forge codes`。
- 首页 H1 建议：`The Forge Codes (Month Year)`。
- 首页首屏需展示 Last Verified 时间（含时区）。

### 14.9 新增执行 TODO（品牌口径）
- [ ] 在全站 metadata 配置中固定 `siteName = theforgecodes`。
- [ ] 配置 `metadataBase = https://theforgecodes.app`。
- [ ] 统一 OG/Twitter 图片默认地址与命名规则。
- [ ] 增加结构化数据（Organization + WebSite）。
- [ ] 校验所有核心页面 canonical 是否指向主域。
- [ ] 校验 `www` 与非 `www` 跳转是否生效。
- [ ] 发布前执行一次 SEO 字段核对清单。
