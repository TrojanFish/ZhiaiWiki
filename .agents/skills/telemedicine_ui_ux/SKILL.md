---
name: Telemedicine & Evidence Health UI/UX Design System
description: Comprehensive visual design system, token dictionary, cancer-domain theme palettes, and component styling guidelines for ZhiaiWiki.
---

# Telemedicine & Evidence Health UI/UX Design System (远程医疗与循证医学视觉设计系统)

本技能定义了知癌维基（ZhiaiWiki）全站的**官方视觉设计规范、设计参数字典（Design Tokens）、8大癌种专属色彩体系、圆角与投影阶梯及无障碍无歧视标准**。

本技能作为全系统的前端**「视觉字典（Visual Token Dictionary）」**，所有 UI 渲染必须严格引用本规范中定义的颜色、阴影、圆角与排印规格。

---

## 1. 核心视觉设计哲学 (Visual Philosophy: Serene, Trustworthy, Alive)

1. **心理降焦虑基底 (Anxiety Reduction & Reassurance)**：
   - 肿瘤患者与家属常伴随强烈的恐慌情绪。全站基底必须采用高明度、柔和的灰白底色（`#f8fafc` / `Slate-50`），消除封闭感与压抑感。
   - **严禁全屏大面积使用刺眼纯红**，仅在极高危生理指标处采用柔和有克制的 `Rose-600` / `bg-rose-50`。
2. **专业理性与生命力量并重**：
   - **信赖蓝（Trust Sky/Blue `#0284c7` / `#2563eb`）**：传递顶级同行评审医学论文（NEJM、Lancet、JCO）的严谨科学信赖感；
   - **治愈青绿（Healing Teal `#0d9488` / `#10b981`）**：传递生机、康复、关怀与温润的人文温度。
3. **等宽数字与可溯源排版 (Tabular Figures & Traceability)**：
   - 临床统计量（HR、5yr RFS、CTR比值、费用测算）必须设置 `font-variant-numeric: tabular-nums`，确保数值纵向对齐稳定，彻底杜绝数据在数字变动时的抖动。

---

## 2. 官方设计参数字典 (Design Tokens)

### 2.1 色彩体系 (60 - 30 - 10 黄金法则)

```css
:root {
  /* 60% 主画布基调 (柔和护眼灰白，缓解阅读疲劳) */
  --bg-primary: #f8fafc;       /* Slate-50: 页面全屏底色 */
  --bg-secondary: #f1f5f9;     /* Slate-100: 次级嵌套底色 */
  --bg-card: #ffffff;          /* Card: 纯白立体容器 */
  --border-color: #e2e8f0;     /* Slate-200: 极细冷灰分割线 */
  --border-glow: #cbd5e1;      /* Slate-300: 聚焦与悬停边框 */

  /* 30% 核心品牌与循证信赖色 (医学蓝 + 生命青绿) */
  --accent-blue: #0284c7;      /* Sky-600: 核心按钮/主高亮 */
  --accent-blue-dark: #0369a1; /* Sky-700: 标题重点字/深色模式 */
  --accent-blue-light: #38bdf8;/* Sky-400: 发光光晕/次级描边 */
  --accent-teal: #0d9488;      /* Teal-600: 随访/康复/公益接力 */
  --accent-teal-light: #2dd4bf;/* Teal-400: 康复光晕 */

  /* 10% 临床状态强调色 (四维红绿灯芯片) */
  --status-safe: #059669;      /* Emerald-600: R0切缘/N0/良性 */
  --status-warning: #d97706;   /* Amber-600: 需随访/灰色区间/VDT倍增 */
  --status-danger: #e11d48;    /* Rose-600: 脉管癌栓/高危转移/致命DDI */

  /* 高对比度文本层阶 (严格满足 WCAG 2.1 AA 标准) */
  --text-primary: #0f172a;     /* Slate-900: 大标题/主要指标 */
  --text-secondary: #334155;   /* Slate-700: 舒适阅读正文 */
  --text-muted: #64748b;       /* Slate-500: 注释/辅助说明/DOI出处 */
}
```

### 2.2 11 大实体肿瘤专属专区色彩主题字典 (Cancer Theme Accents)

系统支持 11 大癌种专属专区，各专区遵循各自的主题语义色阶，禁止跨专区杂糅：

| 癌种专区 | 专区标识语义 | 徽章背景与文字 Token | 边框与高亮 Token | 语义心理意象 |
| :--- | :--- | :--- | :--- | :--- |
| **肺癌 (Lung)** | `sky` | `bg-sky-50 text-sky-700` | `border-sky-200 hover:border-sky-400` | 洁净空气、呼吸畅通 |
| **乳腺癌 (Breast)** | `pink / rose` | `bg-pink-50 text-pink-700` | `border-pink-200 hover:border-pink-400` | 粉红丝带、柔和关怀 |
| **结直肠癌 (Colorectal)** | `emerald` | `bg-emerald-50 text-emerald-700` | `border-emerald-200 hover:border-emerald-400` | 肠道生机、微生态平衡 |
| **结肠癌 (Colon)** | `emerald` | `bg-emerald-50 text-emerald-700` | `border-emerald-200 hover:border-emerald-400` | 肠道平稳、生机复原 |
| **直肠癌 (Rectal)** | `teal` | `bg-teal-50 text-teal-800` | `border-teal-200 hover:border-teal-400` | 精准保肛、盆底修复 |
| **胃癌 (Gastric)** | `amber` | `bg-amber-50 text-amber-800` | `border-amber-200 hover:border-amber-400` | 暖胃护胃、消化代谢 |
| **原发性肝癌 (Liver)** | `teal / emerald`| `bg-emerald-50 text-emerald-800` | `border-emerald-200 hover:border-emerald-400` | 肝胆排毒、深厚生命力 |
| **食管癌 (Esophageal)** | `purple` | `bg-purple-50 text-purple-700` | `border-purple-200 hover:border-purple-400` | 通畅吞咽、食管黏膜 |
| **甲状腺癌 (Thyroid)** | `rose / indigo` | `bg-rose-50 text-rose-700` | `border-rose-200 hover:border-rose-400` | 蝴蝶腺体、内分泌温和调和 |
| **子宫内膜癌 (Endometrial)** | `rose` | `bg-rose-50 text-rose-700` | `border-rose-200 hover:border-rose-400` | 女性温润、母性呵护 |
| **宫颈癌 (Cervical)** | `fuchsia` | `bg-fuchsia-50 text-fuchsia-700` | `border-fuchsia-200 hover:border-fuchsia-400` | 早期防治、生机焕发 |

---

### 2.3 微观排版字阶与排印规则体系 (Micro-Typography & Precision Typesetting)

全站文字排版遵循严格的临床层阶阶梯，**严禁使用任意手写字号（如 `text-[13px]` 或 `text-[21px]`）**：

| 字阶 Token | 像素值 (px) | rem | 行高 (Leading) | 推荐字重 (Weight) | 典型临床与界面应用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `text-micro` | 10px | 0.625rem | 1.4 (`leading-none` 或 14px) | `font-medium` (500) | 极小角标、文献 DOI、微型状态芯片、At-Risk 表格辅助数 |
| `text-caption` | 11px | 0.6875rem | 1.45 (16px) | `font-normal` (400) | 次级时间戳、证据星级脚注、卡片角落辅助来源、免责声明角注 |
| `text-xs` | 12px | 0.75rem | 1.5 (18px) | `font-semibold` (600) | 胶囊徽章 (Pill Badge)、Tag 标签、分段控制器文字、表格列头 (TH) |
| `text-sm` | 14px | 0.875rem | 1.6 (22px) | `font-normal` / `font-medium` | 移动端正文、表单输入框文本、列表副标题、Drawer 抽屉描述 |
| `text-base` | 16px | 1.0rem | 1.7 (27px) | `font-normal` / `font-medium` | 桌面端正文、长篇百科解析正文、重要提示主句 |
| `text-lg` | 18px | 1.125rem | 1.5 (28px) | `font-bold` (700) | Bento 卡片标题、模态框小标题、单项指标卡片头 |
| `text-xl` | 20px | 1.25rem | 1.4 (28px) | `font-bold` (700) | 模块区域标题 (Section Title, H2)、分步引导主标题 |
| `text-2xl` | 24px | 1.5rem | 1.3 (32px) | `font-extrabold` (800) | 临床核心指标中号数字 (如中位生存期 54.4月) |
| `text-3xl` | 30px | 1.875rem | 1.2 (36px) | `font-black` (900) + `tabular-nums` | 核心生存率巨幅数字 (如 95.0%、HR 0.64) |
| `text-4xl` ~ `text-5xl` | 36~48px | 2.25~3rem | 1.15~1.2 (紧凑) | `font-black` (900) + `tracking-tight` | 专区 Hero H1 大标题、核心报告结论醒目标题 |

#### 微观排印硬性规则 (Typography Hard Rules)：
1. **等宽数字防抖动 (`tabular-nums`)**：所有 HR、百分比、费用、生存月数、化验单数值必须设置 `tabular-nums`，消除数值变动时的页面横向抖动。
2. **移动端 16px 视口防自动缩放**：移动端表单 Input/Select 计算字号不得低于 16px（或统一启用 `-webkit-text-size-adjust: 100%`），彻底杜绝 iOS Safari 点击输入框时强制放大视口破坏全屏布局。
3. **中西文混排盘古间距**：汉字与英文单词、数字之间必须留有半角空格（如 `5 年生存率`、`HR 0.64`、`IASLC 第 9 版`）。
4. **字重阶梯严谨性**：`font-black` (900) 仅限核心 H1 与顶格大数字；`font-bold` (700) 用于卡片标题与主按钮；正文严禁滥用 `font-bold`，统一使用 `font-normal` (400) 或 `font-medium` (500) 维持长文阅读舒适度。

---

### 2.4 微观组件几何尺寸与间距规格 (Micro-Component Sizing & Spacing Matrix)

| 微观控件类型 | 尺寸等级 | 几何高度/内边距 | 图标文字微间隙 | 适用场景与示例类名 |
| :--- | :--- | :--- | :--- | :--- |
| **胶囊状态芯片 (Pill)** | 微型 (Micro) | `h-5 px-2 py-0.5 text-micro` | `gap-1` (4px) | `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-micro font-medium` |
| **胶囊状态芯片 (Pill)** | 标准 (Standard)| `h-6 px-2.5 py-1 text-xs` | `gap-1.5` (6px) | `inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold` |
| **操作按钮 (Button)** | 紧凑 (btn-sm) | `h-8 px-3 text-xs rounded-lg` | `gap-1.5` (6px) | 卡片内快捷操作、复制按钮、小切换器 |
| **操作按钮 (Button)** | 标准 (btn-md) | `h-10 px-4 text-sm rounded-xl` | `gap-2` (8px) | 标准表单提交、弹窗确认、次级导航 |
| **操作按钮 (Button)** | 大型 (btn-lg) | `h-12 px-6 text-base rounded-xl font-bold` | `gap-2.5` (10px) | 页面核心行动点 (CTA)、报告生成主按钮 |
| **表单控件 (Input/Select)**| 标准高度 | `h-10 sm:h-11 px-3.5 py-2.5 text-sm sm:text-base` | `gap-2` (8px) | 满足移动端 44px 最小物理触控目标 (Touch Target) |
| **列表行/表格单元格** | 紧凑微间距 | `py-2.5 sm:py-3.5 px-3 sm:px-4` | `gap-3` (12px) | 临床指标对比表、随访时间轴条目 |
| **卡片内层间隙 (Stack)** | 标准竖向节奏 | `space-y-3 sm:space-y-4` | - | 卡片头部标题与内容体之间的呼吸留白 |

---

## 3. 圆角与层级投影体系 (Radius & Elevation)

### 3.1 严格圆角分级 (Border Radius Tokens)
* **胶囊徽章与状态芯片**：`rounded-full`（用于 Pill Badge、TAG、红绿灯状态点）；
* **操作按钮与表单控件**：`rounded-xl`（12px，用于 Button、Input、Select）；
* **内容卡片与列表块**：`rounded-2xl`（16px，用于 Wiki 紧凑卡、文献卡、单项指标展示）；
* **大型 Bento 主容器与模态框**：`rounded-3xl`（24px，用于首页 Hero、报告主框、Dialog、Bottom Sheet 移动端顶圆角 `rounded-t-3xl sm:rounded-3xl`）。

### 3.2 弥散柔光投影体系 (Elevation & Shadows)

```css
/* 微轻量投影 (微小徽章、输入框) */
.shadow-2xs { box-shadow: 0 1px 2px 0 rgba(15, 23, 42, 0.03); }
.shadow-xs  { box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.05); }

/* 标准卡片投影 (干净轻盈，无脏灰感) */
.shadow-sm  { box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.06), 0 1px 2px -1px rgba(15, 23, 42, 0.04); }

/* 悬浮与模态框顶层投影 */
.shadow-lg  { box-shadow: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.04); }
.shadow-2xl { box-shadow: 0 25px 50px -12px rgba(15, 23, 42, 0.25); }

/* 临床高质感微光悬浮过渡 (Card Hover) */
.card-hover {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}
.card-hover:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px -4px rgba(15, 23, 42, 0.07), 0 4px 10px -2px rgba(15, 23, 42, 0.03);
  border-color: #cbd5e1;
}
```

---

## 4. 触觉反馈与微交互准则 (Micro-Interactions & Input Ergonomics)

1. **触觉反馈分级阶梯 (Haptic Feedback Tiers)**：
   - 必须通过全站统一的 `triggerHaptic(type)` 触发物理微震动；桌面 PC 端静默无感，移动端按严重等级分级响应：
     - `light`（轻微触控）：导航 Tab 切换、癌种专区切换、折叠卡片展开；
     - `medium`（操作确认）：档案保存成功、爱心寄语提交、基因突变选中；
     - `selection`（轮播微触）：分段滚动选择器逐项滑动触感；
     - `warning` / `heavy`：高危 DDI 严重配伍禁忌拦截、清空全部临床病历。
2. **移动端触控高亮与物理按压形变 (Touch Feedback)**：
   - 全局强制配置 `-webkit-tap-highlight-color: transparent;`，消除触控点击时的丑陋半透明闪烁框；
   - 移动端通过 `active:scale-[0.97]`（或 `active:scale-95`）实现真实的物理按压阻尼感；
   - 严禁将 `:hover` 样式无防护地挂载在移动端触控元素上（会导致点击后永久滞留悬停变暗状态），必须通过 `@media (hover: hover) and (pointer: fine)` 与桌面端悬停分离。
3. **无障碍键盘焦点环 (Accessible Focus Rings)**：
   - 必须禁止全局生硬清除 `outline` 而不给回退替代；
   - 对非输入框的交互元素提供柔和的医学蓝辉光环：
     ```css
     button:focus-visible, a:focus-visible {
       outline: none;
       box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.38);
     }
     ```
4. **抽屉手势防穿透与视口自适应 (Sheet Ergonomics)**：
   - 模态抽屉滚动区必须配置 `overscroll-behavior: contain;`，彻底防御底层主页面橡皮筋乱跳；
   - 移动端抽屉高度必须采用 `max-h-[92dvh]`（兼容 `92vh`）动态规避 Safari/Chrome 动态地址栏截断；
   - 紧凑按钮（如 32px 的关闭圆钮）必须通过 `.touch-target-expand` 伪元素扩张至 $\ge 44\text{px}$ 物理命中区。
5. **优雅加载状态**：
   - 禁止在关键卡片上使用单一生硬的大号 Spinner 菊花图；
   - 优先采用带有蓝白渐变扫光的骨架屏（Skeleton Shimmer），缓解等待焦躁。

---

## 5. WCAG 2.1 AAA 色觉友好与无障碍对比度矩阵 (Color Vision Accessibility)

针对红绿色盲（Deuteranopia / Protanopia）、全色弱及低视力老年肿瘤患者群体的特殊生理特征，执行以下无歧视排版铁律：

### 5.1 零纯色依赖铁律 (Never Rely on Color Alone)
任何临床警示、复发风险或 DDI 禁忌，**严禁仅通过红绿色彩区分**。必须同时搭载「色彩 + 专有图标 + 显式文字芯片」三合一载体：
- **安全状态 (Safe)**：绿色基底 (`text-emerald-700 bg-emerald-50`) + `CheckCircle2` 图标 + 明确文字 `[安全 / 兼容]`；
- **警示状态 (Caution)**：琥珀色基底 (`text-amber-800 bg-amber-50`) + `AlertTriangle` 图标 + 明确文字 `[时序警示 / 需随访]`；
- **致命禁忌 (Danger)**：暗玫瑰红 (`text-rose-700 bg-rose-50 border-rose-300`) + `ShieldAlert` 图标 + 明确文字 `[严禁同服 / 严重禁忌]`；
- **高危卡片附加纹理**：极高危 DDI 拦截卡片必须带有虚线边框 (`border-dashed border-rose-300`) 或斜向警示条纹，确保全色盲患者无需辨色即可感知危险等级。

### 5.2 严格对比度阈值 (Contrast Ratio Matrix)
* **正文与背景**：严格满足 WCAG 2.1 AAA 级标准，文本与背景对比度 $\ge 7:1$（如 `Slate-900` `#0f172a` 在 `Slate-50` `#f8fafc` 上的对比度为 **15.8:1**）；
* **辅助说明与次要标签**：对比度 $\ge 4.5:1$（如 `Slate-500` `#64748b` 在白底上的对比度为 **4.6:1**）；
* **触控目标最小尺寸**：所有移动端可点击元素必须满足 **44px × 44px** 物理无障碍触控目标面积。

---

## 6. 夜间查房柔光暗黑模式设计系统 (Medical Night Ward Dark Mode)

针对患者夜间查阅报告、住院病房弱光环境与医护夜巡场景，提供生理友好的柔光深色体系：

```css
/* 医疗夜间暗黑变量 (消除刺眼纯黑 #000000 带来的瞳孔剧烈收缩与光晕效应) */
:root[data-theme="dark"] {
  --bg-primary: #0b0f19;       /* 深度护眼夜空底色，低蓝光波段 */
  --bg-secondary: #111827;     /* 次级微凸起底色 */
  --bg-card: #151e2e;          /* 悬浮临床卡片背景色 */
  --border-color: #243247;     /* 极弱夜间冷灰边框 */
  
  --text-primary: #f8fafc;     /* Slate-50: 夜间阅读高对比主字 */
  --text-secondary: #cbd5e1;   /* Slate-300: 舒适阅读次级文本 */
  --text-muted: #94a3b8;       /* Slate-400: 来源出处与辅助注释 */

  /* 夜间状态芯片柔化处理 (降低饱和度，防止暗光下刺眼) */
  --status-safe-bg: rgba(6, 95, 70, 0.25);
  --status-safe-text: #6ee7b7;
  --status-warning-bg: rgba(146, 64, 14, 0.25);
  --status-warning-text: #fcd34d;
  --status-danger-bg: rgba(159, 18, 57, 0.25);
  --status-danger-text: #fda4af;
}
```
