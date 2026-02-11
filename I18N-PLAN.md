# i18n 多语言翻译完整实施计划

> 本文档是 theforgecodes.app 多语言翻译的需求文档和任务清单。
> 支持语言：English (en) / 中文 (zh) / 日本語 (ja)

---

## 问题摘要

网站已集成 next-intl，路由和语言切换功能正常，但：

1. **翻译文件是空壳** — `zh.json` 和 `ja.json` 内容与 `en.json` 完全相同（全是英文）
2. **大量 UI 文本硬编码在组件/数据文件中** — 没有走翻译系统，切换语言无效果
3. **MDX 内容文件未翻译** — `zh.mdx` / `ja.mdx` 与 `en.mdx` 一模一样

---

## 实施原则

- **SEO 内容保持英文** — 长篇 SEO 文案（forge-data.ts 中的 narrative/editorial/operations）是针对英文搜索引擎优化的，翻译会降低 SEO 效果。这些内容在 zh/ja 版本中可保留英文或做轻量摘要。
- **UI 文本必须翻译** — 表头、按钮、标签、状态词、导航文字等用户界面元素必须翻译。
- **Metadata 需要翻译** — 每个页面的 title/description 应根据语言变化。
- **分批实施** — 按优先级分 4 批，每批可独立提交和验证。
- **不破坏现有功能** — 每批完成后应能正常构建。

---

## 批次规划

### 批次 1：翻译文件补全 + 已有 t() 调用生效

**目标**：让已经使用 `useTranslations()` / `getTranslations()` 的组件正确显示中日文。

**涉及文件**：
- `i18n/messages/zh.json` — 翻译为中文
- `i18n/messages/ja.json` — 翻译为日文

**现有已使用翻译的组件（无需改代码，只需补翻译文件）**：
- `components/header/Header.tsx` → `Home.title`
- `components/header/HeaderLinks.tsx` → `Header.links`
- `components/footer/Footer.tsx` → `Footer.*`
- `components/LanguageDetectionAlert.tsx` → `LanguageDetection.*`
- `app/[locale]/about/page.tsx` → `About.*`
- `app/[locale]/blog/page.tsx` → `Blog.*`
- `app/[locale]/privacy-policy/page.tsx` → `PrivacyPolicy.*`
- `app/[locale]/terms-of-service/page.tsx` → `TermsOfService.*`
- Showcase 和 Submission 组件 → `Showcase.*`, `Submission.*`

**翻译 key 数量**：约 60+ 个（已有结构，只需翻译值）

**TODO**:
- [ ] 1.1 翻译 `zh.json` 所有 key 为中文
- [ ] 1.2 翻译 `ja.json` 所有 key 为日文
- [ ] 1.3 验证：切换语言后 Header/Footer/About 等页面显示对应语言

---

### 批次 2：核心页面 Metadata 国际化

**目标**：让每个页面的 `<title>` 和 `<meta description>` 根据语言变化。

**涉及文件（需要改代码 + 补翻译 key）**：

| 页面文件 | 当前状态 | 需要的翻译 namespace |
|---------|---------|---------------------|
| `app/[locale]/page.tsx` (首页) | 需检查 | `Home` |
| `app/[locale]/the-forge-codes/page.tsx` | 硬编码英文 metadata | `TheForgeCodes` |
| `app/[locale]/the-forge-codes-faq/page.tsx` | 硬编码英文 metadata | `FAQ` |
| `app/[locale]/the-forge-codes-history/page.tsx` | 硬编码英文 metadata | `History` |
| `app/[locale]/how-to-redeem-the-forge-codes/page.tsx` | 硬编码英文 metadata | `RedeemGuide` |
| `app/[locale]/the-forge-codes/february-2026/page.tsx` | 硬编码英文 metadata | `Month` |
| `app/[locale]/the-forge-codes/[date]/page.tsx` | 硬编码英文 metadata | `Daily` |

**改法**：
1. 在 `en/zh/ja.json` 中为每个页面新增 metadata 翻译 key（title + description）
2. 在每个 `generateMetadata` 中用 `getTranslations()` 读取翻译后的 title/description

**新增翻译 key 约 14 个**（7 页面 x 2 字段）

**TODO**:
- [ ] 2.1 在 `en.json` 中新增 7 个页面的 metadata key（TheForgeCodes/FAQ/History/RedeemGuide/Month/Daily）
- [ ] 2.2 在 `zh.json` 中翻译这些 metadata key
- [ ] 2.3 在 `ja.json` 中翻译这些 metadata key
- [ ] 2.4 修改 `the-forge-codes/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.5 修改 `the-forge-codes-faq/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.6 修改 `the-forge-codes-history/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.7 修改 `how-to-redeem-the-forge-codes/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.8 修改 `the-forge-codes/february-2026/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.9 修改 `the-forge-codes/[date]/page.tsx` 的 generateMetadata 使用 t()
- [ ] 2.10 验证：切换语言后各页面 `<title>` 和 meta description 显示对应语言

---

### 批次 3：UI 组件硬编码文本国际化

**目标**：将组件中硬编码的 UI 文本（表头、按钮、标签、状态词等短文本）改为翻译调用。

**注意**：长篇 SEO 文案（段落文章）保持英文不翻译，只翻译用户界面元素。

#### 3A: `components/forge/ForgeSections.tsx`（最大文件，583 行）

需要提取的 UI 文本：
- 表头：Code / Reward / Status / Last tested / Source
- 状态词：Added / Expired / Retested / active / expired
- 按钮文字：Latest / History / View All History →
- 标题：Recent Codes / Active The Forge Codes / Expired The Forge Codes
- 段落 intro（section 描述性短句）
- 标签：PC / Mobile 图片说明
- section 标题：How to Redeem / Why Not Working / Update Log / FAQ

**改法**：该组件目前是服务端组件，可用 `getTranslations()` 或改为接受翻译 props。

**TODO**:
- [ ] 3A.1 在 `en.json` 新增 `ForgeSections` namespace 包含所有 UI 文本 key
- [ ] 3A.2 在 `zh.json` 翻译 `ForgeSections` namespace
- [ ] 3A.3 在 `ja.json` 翻译 `ForgeSections` namespace
- [ ] 3A.4 修改 `ForgeSections.tsx` 中的 UI 文本使用翻译函数
- [ ] 3A.5 验证 `/the-forge-codes` 页面三语切换正常

#### 3B: `components/home/index.tsx`（547 行，首页组件）

需要提取的 UI 文本：
- 侧边栏：Live Hub / History / Recent Codes / View All History → / active / expired
- Hero 按钮文字：Open Live The Forge Codes Hub / Browse Code History
- Section 标题：Quick Active Preview / Operational Snapshot / Homepage FAQ
- 统计标签：Active Codes / Expired Tracked / Latest Snapshot / Avg Search
- 信号卡标签：US Monthly Search / Global Monthly Search / Tracked Variations / Question Keywords

**注意**：homepageSections 和 faqItems 中的长段落是 SEO 内容，保持英文。

**TODO**:
- [ ] 3B.1 在 `en.json` 新增 `HomePage` namespace 包含首页 UI 文本 key
- [ ] 3B.2 在 `zh.json` 翻译 `HomePage` namespace
- [ ] 3B.3 在 `ja.json` 翻译 `HomePage` namespace
- [ ] 3B.4 修改 `components/home/index.tsx` 中的 UI 短文本使用翻译
- [ ] 3B.5 验证首页三语切换正常

#### 3C: `lib/forge-data.ts` 中的 UI 文本

需要翻译的短文本（这些会被组件直接显示）：
- `forgeRedeemSteps`: 4 个步骤的 title + detail
- `forgeTroubleshooting`: 4 个 Q&A
- `forgeFaq`: 6 个 Q&A

**改法**：改为函数，接收 locale 参数返回对应语言内容；或在组件端用翻译 key 覆盖。

**TODO**:
- [ ] 3C.1 在 `en.json` 新增 `ForgeData` namespace（redeem steps / troubleshooting / faq）
- [ ] 3C.2 在 `zh.json` 翻译 `ForgeData` namespace
- [ ] 3C.3 在 `ja.json` 翻译 `ForgeData` namespace
- [ ] 3C.4 修改使用这些数据的组件改为读取翻译

#### 3D: 其他页面硬编码文本

| 文件 | 需要翻译的 UI 文本 |
|------|-------------------|
| `the-forge-codes-faq/page.tsx` | hero 标题/描述、section 标题 "Core FAQ" / "Fast failure checklist" |
| `the-forge-codes-history/page.tsx` | hero 标题/描述、统计标签、按钮文字、SEO section 标题、用例列表 |
| `the-forge-codes/[date]/page.tsx` | "Daily snapshot"、section 标题、failure checklist 步骤、"Source Coverage" 等 |
| `the-forge-codes/february-2026/page.tsx` | "Monthly archive"、section 标题、统计标签、weekly 标签 |
| `components/forge/HistoryMonthGroup.tsx` | 标签文字 |

**TODO**:
- [ ] 3D.1 在翻译文件中新增 FAQ 页面 UI key 并翻译
- [ ] 3D.2 修改 `the-forge-codes-faq/page.tsx` 使用翻译
- [ ] 3D.3 在翻译文件中新增 History 页面 UI key 并翻译
- [ ] 3D.4 修改 `the-forge-codes-history/page.tsx` 使用翻译
- [ ] 3D.5 在翻译文件中新增 Daily 页面 UI key 并翻译
- [ ] 3D.6 修改 `the-forge-codes/[date]/page.tsx` 使用翻译
- [ ] 3D.7 在翻译文件中新增 Monthly 页面 UI key 并翻译
- [ ] 3D.8 修改 `the-forge-codes/february-2026/page.tsx` 使用翻译
- [ ] 3D.9 验证所有子页面三语切换正常

---

### 批次 4：MDX 内容文件翻译

**目标**：翻译 MDX 内容文件，让长文内容页面也支持多语言。

**涉及文件**（6 个需翻译，en 版本已有）：

| 路径 | 内容 |
|------|------|
| `content/about/zh.mdx` | 关于页面 |
| `content/about/ja.mdx` | 关于页面 |
| `content/privacy-policy/zh.mdx` | 隐私政策 |
| `content/privacy-policy/ja.mdx` | 隐私政策 |
| `content/terms-of-service/zh.mdx` | 服务条款 |
| `content/terms-of-service/ja.mdx` | 服务条款 |
| `content/how-to-redeem-the-forge-codes/zh.mdx` | 兑换指南 |
| `content/how-to-redeem-the-forge-codes/ja.mdx` | 兑换指南 |

**TODO**:
- [ ] 4.1 翻译 `content/about/zh.mdx` 为中文
- [ ] 4.2 翻译 `content/about/ja.mdx` 为日文
- [ ] 4.3 翻译 `content/privacy-policy/zh.mdx` 为中文
- [ ] 4.4 翻译 `content/privacy-policy/ja.mdx` 为日文
- [ ] 4.5 翻译 `content/terms-of-service/zh.mdx` 为中文
- [ ] 4.6 翻译 `content/terms-of-service/ja.mdx` 为日文
- [ ] 4.7 翻译 `content/how-to-redeem-the-forge-codes/zh.mdx` 为中文
- [ ] 4.8 翻译 `content/how-to-redeem-the-forge-codes/ja.mdx` 为日文
- [ ] 4.9 验证：切换语言后 About / Privacy / Terms / Redeem Guide 显示对应语言内容

---

## 工作量估算

| 批次 | 新增翻译 key | 需修改组件文件 | 预估复杂度 |
|------|-------------|--------------|-----------|
| 批次 1 | 0（已有 key） | 0 | 低 — 只翻译 JSON |
| 批次 2 | ~14 | 6 | 低 — metadata 改为 t() |
| 批次 3A | ~40 | 1（大文件） | 中 — ForgeSections 改造 |
| 批次 3B | ~25 | 1（大文件） | 中 — 首页组件改造 |
| 批次 3C | ~30 | 2-3 | 中 — 数据层改造 |
| 批次 3D | ~50 | 5 | 高 — 多页面修改 |
| 批次 4 | 0 | 0 | 中 — 8 个 MDX 文件翻译 |

**总计**：约 160 个翻译 key，15+ 个组件/页面文件修改，8 个 MDX 文件翻译。

---

## 关于 SEO 长文内容的处理策略

以下内容**不翻译**（保持英文）：
- `lib/forge-data.ts` 中的 `forgeKeywordNarrative`、`forgeEditorialGuide`、`forgeOperationsManual`
- `components/home/index.tsx` 中的 `homepageSections`（5 个 SEO section）和 `faqItems`
- `the-forge-codes/[date]/page.tsx` 中的 `redeemVariants`、`useVariants`、`whereVariants`
- `the-forge-codes/february-2026/page.tsx` 中的 `trendNarrative` 和 `monthPlaybook`
- `the-forge-codes-history/page.tsx` 中的 SEO content sections

**原因**：这些是针对英文 SEO 关键词优化的长文案，翻译后会失去目标关键词覆盖。中日文用户访问这些页面仍可正常阅读核心 UI 信息（表格、按钮、标签已翻译），长文部分保持英文不影响功能使用。

---

## 日期格式本地化

以下位置的日期格式化函数 `toLocaleDateString("en-US", ...)` 需要改为使用当前 locale：
- `components/home/index.tsx` → `formatRecentDate()`
- `components/forge/ForgeSections.tsx` → `formatRecentDate()`
- `the-forge-codes/[date]/page.tsx` → `toLongDate()`
- `the-forge-codes/february-2026/page.tsx` → `longDate()`
- `the-forge-codes-history/page.tsx` → `formatMonthLabel()`

**改法**：传入 locale 参数，使用 `toLocaleDateString(locale, ...)` 使日期显示本地化。

这个可以在批次 3 中顺带处理。
