---
name: Clinical Data Visualization
description: 临床医学图表与科学可视化设计规范——Kaplan-Meier 生存曲线、HR 森林图、基因组变异全景图、DDI 药物交互矩阵的 Tailwind v4 + React 19 SVG 实现标准，适用于 ZhiaiWiki 全栈平台。
---

# Clinical Data Visualization（临床医学图表与科学可视化设计规范）

本技能定义了知癌维基（ZhiaiWiki）全站**科学数据可视化**的权威实现标准。任何涉及生存分析、临床试验对比、基因组变异展示与药物相互作用的图表组件，**必须遵循本技能的视觉规范、数学定义、可访问性要求与 React/SVG 实现约束**。

灵感来源与参考标准：  
- **IBM Carbon Design System for Healthcare**（临床决策支持 CDS、图表无障碍色板）  
- **Lancet / NEJM / JCO 顶刊图表排版规范**（循证医学图形标准）  
- **NCCN Evidence Block™**（证据强度可视化）  
- 全系统 Tailwind CSS v4 + React 19 + Next.js 16 App Router 无外部重型图表库依赖原则

---

## 0. 核心可视化哲学（Visualization Philosophy）

### 原则 1：科学说服力优先（Scientific Persuasion）
- 每一个数字和曲线背后必须有同行评审支撑；可视化是循证证据的「视觉化语言」，不是装饰。
- 图表必须传达**不确定性**：置信区间、误差线、样本量 at-risk 表必须与核心曲线/指标同时呈现。

### 原则 2：零装饰主义（Zero Chartjunk）
- 参考 Carbon Healthcare 的视觉克制原则：严禁 3D 效果、渐变填充（仅用于面积图 CI 带）、过度网格线、装饰性背景纹理。
- 坐标轴只保留左轴（Y）和底轴（X）；水平参考线使用 `stroke-dasharray="4 4"` 虚线，颜色为 `#e2e8f0`（Slate-200）。

### 原则 3：以患者认知为量尺（Patient Cognition Scale）
- 曲线图必须配有「白话解读卡」：用 9-11 岁阅读难度（参考 NHS 健康素养标准）将核心结论翻译为自然语言。
- 图表标题必须直接回答「这对我意味着什么」（What does this mean for me？）

### 原则 4：无障碍色觉独立性（Color-Vision Independence）
- 参考 Carbon 的无障碍数据可视化调色板（IBM Data Vis Palette）：所有颜色在 Deuteranopia（红绿色盲）模式下仍可区分。
- **必须同时使用：颜色 + 线型/填充图案 + 图例文字标签**，三合一区分各组数据。

---

## 1. Kaplan-Meier 生存曲线（KM Survival Curve）

### 1.1 数学定义与数据结构

```typescript
// KM 曲线数据点类型定义（每个时间点的生存概率估算）
interface KMDataPoint {
  time: number;           // 随访时间（月，Month）
  survival: number;       // 生存概率（0~1，KM 估计值）
  ci_lower: number;       // 95% 置信区间下界
  ci_upper: number;       // 95% 置信区间上界
  at_risk: number;        // 该时间点仍在随访的患者数（At-risk Table）
  events: number;         // 该时间点发生事件（死亡/进展）数
  censored: number;       // 该时间点删失数
}

interface KMSeries {
  label: string;          // 组别标签（如 "奥希替尼 (FLAURA2)"）
  color: string;          // 线条主色（必须符合色觉无障碍调色板）
  strokeDasharray?: string; // 线型（实线 / 虚线区分各组）
  data: KMDataPoint[];
  medianOS?: number;      // 中位生存期（月），用于垂直虚线标注
  hr?: number;            // 风险比 HR（如 0.62）
  hrCI?: [number, number];// HR 95% CI
  pValue?: string;        // p 值（如 "<0.001"）
  trialName?: string;     // 试验名称（如 "FLAURA2"）
  nEnrolled?: number;     // 入组人数 n=xxx
}
```

### 1.2 视觉规范（KM Curve Visual Spec）

#### 图表容器尺寸
```tsx
// 标准 KM 图容器（响应式自适应）
<div className="w-full aspect-[4/3] sm:aspect-[16/9] max-w-3xl mx-auto" />
// 移动端：4:3 保证 Y 轴可读；桌面端：16:9 标准临床报告宽高比
```

#### 颜色与线型体系（必须同时使用，色盲友好）

| 组别序号 | 线条主色（Hex） | Tailwind 类 | 线型 (`strokeDasharray`) | 语义 |
| :---: | :--- | :--- | :--- | :--- |
| 1（实验组） | `#2563eb` | `text-blue-600` | `"none"`（实线） | 靶向 / 免疫实验组 |
| 2（对照组） | `#dc2626` | `text-red-600` | `"6 4"`（长虚线） | 化疗 / 安慰剂对照 |
| 3（联合组） | `#059669` | `text-emerald-600` | `"2 3"`（短虚线） | 联合治疗第三组 |
| 4（亚组） | `#d97706` | `text-amber-600` | `"8 2 2 2"`（点划线） | 亚组分析 |

#### 必须包含的图表元素
1. **标题区**：`[癌种] [终点指标（OS/PFS/DFS）] – [试验名称]`，`text-lg font-bold text-slate-900`
2. **Y 轴**：`生存概率 (%)` 或 `无进展生存率 (%)`，范围 0-100%，刻度步长 20%
3. **X 轴**：`随访时间（月）`，步长根据最大随访时间动态计算（通常 3 或 6 的倍数）
4. **中位生存期虚线**：在各组中位 OS/PFS 处绘制垂直 `stroke-dasharray="4 4"` 虚线，终点标注 `median = X 月` 标签
5. **置信区间带（CI Band）**：在曲线上下以 `opacity-20` 半透明填充区域表示 95% CI，同组颜色
6. **删失标记（Censored Tick）**：在每个删失时间点绘制小竖线 `|`（高度 6px，宽度 1px）
7. **At-Risk 表格**：图表正下方附 Risk Table，显示各时间节点的 at-risk 人数，使用 `font-mono tabular-nums text-xs`
8. **结果摘要芯片（Result Badge）**：图例旁附带 HR / p 值徽章

```tsx
// 核心统计数据徽章（图例旁展示）
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 border border-blue-200">
  <span className="text-xs font-semibold text-blue-800">HR {series.hr}</span>
  <span className="text-xs text-blue-600">95% CI [{series.hrCI?.[0]}, {series.hrCI?.[1]}]</span>
  <span className="text-xs font-bold text-blue-900">p {series.pValue}</span>
</div>
```

### 1.3 React SVG 实现约束

```tsx
// ❌ 禁止引入 Recharts、Chart.js、D3（会破坏 Next.js 16 SSR 水合）
// ✅ 使用原生 SVG + React 19 渲染，无外部图表库依赖

'use client'; // 必须标记为客户端组件（SVG 交互依赖 DOM）

import { useRef, useState, useCallback } from 'react';

// KM 曲线坐标转换工具函数
const toSVGX = (time: number, maxTime: number, width: number, padding: { l: number; r: number }) =>
  padding.l + (time / maxTime) * (width - padding.l - padding.r);

const toSVGY = (survival: number, height: number, padding: { t: number; b: number }) =>
  padding.t + (1 - survival) * (height - padding.t - padding.b);

// 生成 KM 阶梯路径（Step-after 插值）
const buildStepPath = (points: KMDataPoint[], maxTime: number, svgW: number, svgH: number, pad: Padding): string => {
  if (points.length === 0) return '';
  let d = `M ${toSVGX(points[0].time, maxTime, svgW, pad)} ${toSVGY(points[0].survival, svgH, pad)}`;
  for (let i = 1; i < points.length; i++) {
    const px = toSVGX(points[i].time, maxTime, svgW, pad);
    const py = toSVGY(points[i].survival, svgH, pad);
    const prevY = toSVGY(points[i - 1].survival, svgH, pad);
    // Step-after：先水平到新时间，再垂直落到新生存率
    d += ` H ${px} V ${py}`;
  }
  return d;
};
```

### 1.4 「白话解读卡」模板（患者侧 Health Literacy Card）

每个 KM 图组件下方必须附带此解读卡：

```tsx
<div className="mt-4 p-4 rounded-2xl bg-sky-50 border border-sky-200">
  <div className="flex items-start gap-3">
    <span className="text-2xl" role="img" aria-label="灯泡">💡</span>
    <div>
      <p className="text-sm font-semibold text-sky-800 mb-1">这张图告诉我们什么？</p>
      <p className="text-sm text-sky-700 leading-relaxed">
        {/* 动态生成，例如: */}
        {`接受 ${trialName} 方案的患者中，有一半的人在 ${medianOS} 个月后仍在继续生活——
        这比传统化疗多出约 ${improvementMonths} 个月。
        这意味着更多的时间陪伴家人，更多的时间享受生活。`}
      </p>
      <p className="text-xs text-sky-600 mt-2">
        📖 数据来源：{journalRef}（{year}），n={sampleSize} 例患者
      </p>
    </div>
  </div>
</div>
```

---

## 2. HR 森林图（Forest Plot / Hazard Ratio Plot）

### 2.1 数学定义与数据结构

```typescript
interface ForestRow {
  label: string;          // 亚组或研究名称（如 "FLAURA2 (EGFR Ex19del)"）
  subgroup?: string;      // 亚组描述（如 "年龄 <65 岁"）
  hr: number;             // 风险比 Hazard Ratio
  ci_lower: number;       // HR 95% CI 下界
  ci_upper: number;       // HR 95% CI 上界
  n_exp: number;          // 实验组样本量
  n_ctrl: number;         // 对照组样本量
  events_exp?: number;    // 实验组事件数
  events_ctrl?: number;   // 对照组事件数
  weight?: number;        // Meta 分析权重（%）
  isSummary?: boolean;    // 是否为汇总行（加粗菱形显示）
  isHeader?: boolean;     // 是否为分组标题行（不绘制数据点）
}
```

### 2.2 视觉规范

#### 布局结构（3 列）
```
[ 亚组标签列 (40%) ] | [ Forest 图形区域 (40%) ] | [ HR [95% CI] 数字列 (20%) ]
```

#### 核心视觉元素
1. **Null Effect 基准线**：在 HR = 1.0 处绘制垂直实线，颜色 `#94a3b8`（Slate-400），标注「无差异基准」
2. **获益方向标注**：
   - 基准线左侧（HR < 1）：标注「← 有利于实验组」（小字 `text-xs text-emerald-700`）
   - 基准线右侧（HR > 1）：标注「有利于对照组 →」（小字 `text-xs text-amber-700`）
3. **误差线与方块（Forest 主体）**：
   - 水平误差线（95% CI）：`stroke-width="2"`
   - 中心方块：大小与权重（`weight`）成正比（`side = 6 + weight * 0.3`px）
   - 汇总菱形（Summary Diamond）：`isSummary=true` 时替换为菱形（◆），宽度 = CI 范围
4. **X 轴刻度**：对数刻度（`0.1, 0.2, 0.5, 1.0, 2.0, 5.0`）
5. **颜色语义**：
   - HR < 1（获益）：方块/菱形填充 `#2563eb`（Blue-600）
   - HR > 1（有害趋势）：方块填充 `#dc2626`（Red-600）
   - HR 未达统计显著（p > 0.05）：填充 `#94a3b8`（Slate-400）

### 2.3 数字列格式规范

```tsx
// 数字列：tabular-nums 等宽对齐，方便扫描比较
<td className="font-mono tabular-nums text-sm text-slate-700 text-right pr-2">
  {hr.toFixed(2)} [{ci_lower.toFixed(2)}, {ci_upper.toFixed(2)}]
</td>
```

### 2.4 森林图坐标变换（对数刻度）

```typescript
// X 轴对数刻度变换：将 HR 值映射到 SVG 坐标
const LOG_MIN = Math.log(0.1);  // 对数坐标最小值
const LOG_MAX = Math.log(5.0);  // 对数坐标最大值

const hrToX = (hr: number, plotWidth: number, offsetLeft: number): number => {
  const logHR = Math.log(Math.max(0.05, Math.min(hr, 10)));
  return offsetLeft + ((logHR - LOG_MIN) / (LOG_MAX - LOG_MIN)) * plotWidth;
};
```

---

## 3. 基因组变异全景图（Genomic Variant View）

### 3.1 外显子位点轴线规范（Exon Lollipop Chart）

参考 IBM Carbon Healthcare 基因组可视化惯例：

```typescript
interface GenomicVariant {
  position: string;       // 变异位置（如 "Exon 19 del"、"L858R"、"T790M"）
  exon: number;           // 外显子编号（1-28 for EGFR）
  variantType: 'sensitizing' | 'resistant' | 'uncertain' | 'indel' | 'fusion';
  prevalence: number;     // 变异频率（%，用于棒棒糖圆圈大小）
  drugResponse?: string;  // 对应靶向药物（如 "奥希替尼 敏感"）
  clinicalTrial?: string; // 关键试验（如 "FLAURA / FLAURA2"）
}
```

#### 颜色语义体系（变异类型）

| 变异类型 | 颜色（Hex） | Tailwind | 含义 |
| :--- | :--- | :--- | :--- |
| `sensitizing`（敏感突变） | `#2563eb` | `fill-blue-600` | 靶向药物可获益 |
| `resistant`（耐药突变） | `#dc2626` | `fill-red-600` | 靶向药物原发/继发耐药 |
| `uncertain`（意义未明 VUS） | `#94a3b8` | `fill-slate-400` | 临床意义尚不明确 |
| `indel`（插入缺失） | `#7c3aed` | `fill-violet-600` | 20 号外显子插入等特殊变异 |
| `fusion`（基因融合） | `#d97706` | `fill-amber-600` | ALK/ROS1/RET 融合重排 |

#### 外显子轴线排版
- 外显子区段用宽度正比于其编码长度的矩形表示；内含子用更细的连线表示
- 外显子编号标注于矩形上方（`text-xs font-mono`）
- 热点突变（prevalence > 10%）的棒棒糖必须标注变异名称（`text-xs`，45° 斜向避免重叠）

### 3.2 突变解读卡组件模板

```tsx
// 每个突变位点点击后展开解读卡
<div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-4">
  <div className="flex items-start justify-between gap-3 mb-3">
    <div>
      <span className="text-sm font-bold text-slate-900">{variant.position}</span>
      <span className={cn(
        "ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold",
        variant.variantType === 'sensitizing' && "bg-blue-50 text-blue-700 border border-blue-200",
        variant.variantType === 'resistant'   && "bg-rose-50 text-rose-700 border border-rose-200",
        variant.variantType === 'uncertain'   && "bg-slate-100 text-slate-600 border border-slate-200",
      )}>
        {variantTypeLabel[variant.variantType]}
      </span>
    </div>
    <span className="text-xs text-slate-500 tabular-nums">频率 {variant.prevalence}%</span>
  </div>
  {/* 药物响应 */}
  {variant.drugResponse && (
    <p className="text-sm text-slate-700 mb-2">
      <span className="font-medium">对应治疗：</span>{variant.drugResponse}
    </p>
  )}
  {/* 关键试验 */}
  {variant.clinicalTrial && (
    <p className="text-xs text-slate-500">
      📖 关键循证：{variant.clinicalTrial}
    </p>
  )}
</div>
```

---

## 4. DDI 药物相互作用矩阵（Drug-Drug Interaction Matrix）

### 4.1 交互矩阵布局规范

用于展示多药联用的代谢通路（CYP450）重叠风险：

```typescript
interface DDIEntry {
  drugA: string;          // 药物 A 名称（如 "奥希替尼"）
  drugB: string;          // 药物 B 名称（如 "利福平"）
  severity: 'danger' | 'caution' | 'safe';  // 交互严重程度
  mechanism: string;      // 机制（如 "CYP3A4 强诱导，血药浓度降低 87%"）
  recommendation: string; // 推荐处置（如 "严禁同服，必须更换抗结核方案"）
  evidence: string;       // 循证来源（如 "FDA 说明书 / 一级交叉试验"）
  alternativeDrug?: string; // 推荐替代药物
}
```

### 4.2 矩阵单元格颜色规范（三合一：颜色 + 图标 + 文字）

```tsx
// ❌ 仅凭颜色区分禁忌（色盲患者无法识别）
// ✅ 颜色 + 专属图标 + 显式文字标签 三合一

const DDI_CELL_STYLES = {
  danger: {
    bg: 'bg-rose-50 border-rose-300 border-dashed',
    text: 'text-rose-800',
    icon: '🛑',           // 停止图标（色盲可识别）
    label: '严重禁忌',
    description: '严禁同服 / 立即停药',
  },
  caution: {
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    icon: '⚠️',           // 警告三角（色盲可识别）
    label: '时序警示',
    description: '需严格错峰 / 定期监测血药浓度',
  },
  safe: {
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    icon: '✅',           // 勾号（色盲可识别）
    label: '可以联用',
    description: '目前无明显相互作用证据',
  },
};
```

### 4.3 DDI 风险雷达图（CYP450 代谢路径重叠度）

用于展示多药联用时对各主要代谢酶的竞争程度：

```tsx
// 雷达图维度定义（6 个 CYP 代谢轴）
const CYP_AXES = [
  { key: 'cyp3a4', label: 'CYP3A4' },   // 最重要（肿瘤靶向药主要通路）
  { key: 'cyp2d6', label: 'CYP2D6' },   // 他莫昔芬相关
  { key: 'cyp2c9', label: 'CYP2C9' },   // 华法林相关
  { key: 'cyp2c19', label: 'CYP2C19' }, // PPI 相关
  { key: 'cyp1a2', label: 'CYP1A2' },
  { key: 'pgp', label: 'P-gp' },         // 转运蛋白
];
```

---

## 5. 证据强度可视化（Evidence Level Badge System）

### 5.1 NCCN 证据级别标章

参考 IBM Carbon NCCN Evidence Block™ 与 CSCO 指南推荐级别：

```typescript
type EvidenceLevel = 
  | '1A'   // 最高级：多项 Phase III RCT，一致结论
  | '1B'   // 高级：单项大型 Phase III RCT
  | '2A'   // 中高：Phase II 或专家共识（统一推荐）
  | '2B'   // 中等：Phase II 或专家共识（意见分歧）
  | '3'    // 低：仅病例报告或专家意见
  | 'IND'; // 实验性：临床试验入组

type RecommendationGrade = 'I' | 'IIA' | 'IIB' | 'III'; // CSCO 推荐级别
```

```tsx
// 证据标章组件规范（⭐ 星级 + 文字徽章）
const EVIDENCE_BADGE = {
  '1A': { stars: 5, bg: 'bg-blue-50 border-blue-300', text: 'text-blue-800', label: 'Ⅰ类证据 A 级推荐' },
  '1B': { stars: 4, bg: 'bg-sky-50 border-sky-200',   text: 'text-sky-800',  label: 'Ⅰ类证据 B 级推荐' },
  '2A': { stars: 3, bg: 'bg-teal-50 border-teal-200', text: 'text-teal-800', label: 'Ⅱ类证据 A 级推荐' },
  '2B': { stars: 2, bg: 'bg-amber-50 border-amber-200',text:'text-amber-800',label: 'Ⅱ类证据 B 级推荐' },
  '3':  { stars: 1, bg: 'bg-slate-50 border-slate-200',text:'text-slate-600',label: 'Ⅲ类证据（仅供参考）'},
};

// 使用示例
<div className={cn(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold",
  EVIDENCE_BADGE[level].bg,
  EVIDENCE_BADGE[level].text
)}>
  {'⭐'.repeat(EVIDENCE_BADGE[level].stars)}
  <span>{EVIDENCE_BADGE[level].label}</span>
</div>
```

### 5.2 四要素循证出处凭证（Mandatory Citation Block）

所有图表展示的核心数据，**必须**附带四要素完整来源凭证：

```tsx
<div className="mt-3 pt-3 border-t border-slate-100 flex items-start gap-2">
  <span className="text-slate-400 text-xs mt-0.5">📖</span>
  <div>
    <p className="text-xs text-slate-500 leading-relaxed">
      <span className="font-medium text-slate-700">{trialName}</span>
      {' · '}
      <span>{journal} {year}</span>
      {' · '}
      <span>n={sampleSize} 例</span>
      {' · '}
      <span className="font-medium">{primaryEndpoint}</span>
    </p>
    <a
      href={doiUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-xs text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1 mt-0.5"
    >
      查看原文出处 ↗
    </a>
  </div>
</div>
```

---

## 6. 技术实现约束（Engineering Constraints）

### 6.1 禁止引入的外部库

```
❌ recharts       — 服务端渲染不兼容，水合错误风险高
❌ chart.js       — 依赖 Canvas，SSR 无法渲染
❌ d3             — 直接操作 DOM，与 React 19 冲突
❌ victory-native — React Native 库，不适配 Next.js App Router
❌ highcharts     — 商业授权，且体积过大（700kB+）
```

### 6.2 推荐的轻量实现路径

```
✅ 原生 SVG + React 19 (viewBox 自适应，无外部依赖)
✅ 纯 CSS 动画 (animation-fill-mode: forwards) 替代 JS 动画
✅ Tailwind v4 任意值类名用于精确 SVG 样式控制
✅ 动态 import() + Suspense 延迟加载复杂图表组件，避免首屏 FCP 受损
```

### 6.3 SSR 水合安全规范（图表专项）

```tsx
// ✅ 图表组件必须是纯客户端组件
'use client';

// ✅ 使用 useHydrated hook 防止 SSR 渲染不一致
import { useHydrated } from '@/lib/useHydrated';

export function KMCurveChart({ series }: { series: KMSeries[] }) {
  const hydrated = useHydrated();
  
  // SSR 阶段：渲染占位骨架（高度与图表相同，避免 CLS）
  if (!hydrated) {
    return (
      <div className="w-full aspect-[16/9] rounded-2xl bg-slate-100 animate-pulse" 
           aria-label="图表加载中..." />
    );
  }
  
  return <KMCurveChartInner series={series} />;
}
```

### 6.4 无障碍 ARIA 规范（图表专项）

```tsx
// SVG 图表必须包含完整的无障碍属性
<svg
  role="img"
  aria-label={`${title} 生存曲线图：${ariaDescription}`}
  aria-describedby={`${chartId}-desc`}
>
  <title id={`${chartId}-title`}>{title}</title>
  <desc id={`${chartId}-desc`}>{ariaDescription}</desc>
  {/* 图表内容 */}
</svg>

// 同时必须提供数据表格视图（屏幕阅读器用户的等效访问方式）
<details className="mt-2">
  <summary className="text-xs text-slate-500 cursor-pointer hover:text-slate-700">
    📋 查看数据表格（无障碍版）
  </summary>
  <table className="sr-only">
    {/* 屏幕阅读器可访问的原始数据表格 */}
  </table>
</details>
```

---

## 7. 质量门禁（Quality Gates）

每个可视化组件上线前，必须通过以下检查项：

- [ ] **数学正确性**：KM 曲线为单调不增阶梯函数；HR CI 下界 < HR < HR CI 上界；所有数值为 `Number.isFinite()` 有限值
- [ ] **循证完整性**：四要素出处凭证（试验名 + 期刊年份 + 样本量 + 终点指标）100% 覆盖
- [ ] **色觉无障碍**：在 Deuteranopia 色盲模拟模式下，各组曲线仍可通过线型 + 图例区分
- [ ] **患者解读卡**：每个图表组件均附带 9-11 岁阅读难度的白话解读卡
- [ ] **SSR 安全**：`npm run build` 零水合错误，使用 `useHydrated` 防护骨架屏
- [ ] **At-Risk 表格**：KM 曲线必须附带各时间节点的 at-risk 人数表
- [ ] **ARIA 标签**：SVG `role="img"` + `aria-label` + `aria-describedby` 完整
- [ ] **移动端自适应**：移动端 4:3，桌面端 16:9；触控区域 ≥ 44px × 44px
