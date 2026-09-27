---
name: Clinical Evidence Design Triad
description: 临床循证设计三位一体规范——融合 Nordhealth Design System（高密度医护端）、NHS.UK Frontend（患者端健康素养）与 IBM Carbon Healthcare（循证级别与精准医疗）三大顶级开源医疗设计体系的精华，提炼为纯 Tailwind v4 + React 19 组件规范，适用于 ZhiaiWiki / OncoPath 全平台。
---

# Clinical Evidence Design Triad（临床循证设计三位一体规范）

本技能是 ZhiaiWiki / OncoPath 平台的**「专科临床可信度系统」**，融合全球三大顶级医疗开源设计体系的精华原则，形成专属于本平台的组件语言。

核心参考来源：
- 🏥 **[Nordhealth Design System](https://nordhealth.design/)**（欧洲顶级 EHR 临床界面系统）
- 🇬🇧 **[NHS.UK Digital Service Manual](https://service-manual.nhs.uk/design-system)**（英国国家医疗服务健康素养标准）
- 🔬 **[IBM Carbon Design System for Healthcare](https://carbondesignsystem.com/)**（临床决策支持 CDS 与精准医学可视化）

> **重要工程约束**：不直接安装上述框架的 NPM 包，而是将其经过全球顶级临床机构验证的设计规范提炼为原生 Tailwind v4 + React 19 实现。

---

## 模块 A：Nordhealth 医护端规范（高信息密度 · 专业沉浸）

### A.1 设计哲学引入

Nordhealth Design System 服务于欧洲医疗卫生系统数十家 EHR（电子健康记录）平台，其核心理念：
- **"Density with Clarity"**：高密度信息布局必须同时保持极高的识别清晰度，永远不牺牲可读性换取密度
- **"Keyboard First"**：临床工作者双手可能戴有手套或持医疗器械，键盘导航效率决定工作流
- **"Calm Technology"**：界面不应主动打扰医护注意力，只在关键时刻提供精准警报

### A.2 高密度临床数据表格（Compact Clinical Table）

```tsx
// 临床指标高密度表格规范（参考 Nordhealth compact-density 原则）
// 行高：40px（桌面）/ 48px（移动端触控）
// 单元格内边距：py-2.5 px-3（紧凑但可呼吸）

<table className="w-full text-sm border-collapse">
  {/* 表头：极轻背景 + 小字 + 大写字母增强可读性 */}
  <thead>
    <tr className="border-b-2 border-slate-200">
      <th className="py-2.5 px-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
        临床指标
      </th>
      <th className="py-2.5 px-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
        数值 / 结果
      </th>
      <th className="py-2.5 px-3 text-center text-xs font-semibold text-slate-500 uppercase tracking-wide">
        临床状态
      </th>
      <th className="py-2.5 px-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wide">
        参考区间
      </th>
    </tr>
  </thead>
  <tbody className="divide-y divide-slate-100">
    {/* 数据行：斑马纹（偶数行微弱底色），无过度装饰 */}
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="py-2.5 px-3 text-sm font-medium text-slate-800">
        CEA（癌胚抗原）
      </td>
      <td className="py-2.5 px-3 text-right font-mono tabular-nums text-sm font-semibold text-rose-700">
        48.3
        <span className="ml-1 text-xs text-slate-400 font-normal">ng/mL</span>
      </td>
      <td className="py-2.5 px-3 text-center">
        {/* 三合一状态芯片：颜色 + 图标 + 文字 */}
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <span role="img" aria-label="危急高值">▲</span>
          危急高值
        </span>
      </td>
      <td className="py-2.5 px-3 text-right text-xs text-slate-400 font-mono tabular-nums">
        &lt;5.0
      </td>
    </tr>
  </tbody>
</table>
```

### A.3 危急值（Critical Value）微色彩告警规范

参考 Nordhealth 的「Calm Alerting」原则：严禁使用大面积纯红背景制造恐慌，使用有克制的微色彩与专属图标：

| 状态 | 触发条件 | 背景 + 边框 | 文字 | 图标 | 芯片文字 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **危急高值** ↑↑ | 超过危急高值上限 | `bg-rose-50 border-rose-300 border-dashed` | `text-rose-800` | `▲ 危急` | 危急高值 |
| **偏高** ↑ | 高于正常上限 | `bg-amber-50 border-amber-200` | `text-amber-800` | `↑ 偏高` | 偏高 |
| **正常** | 在参考区间内 | `bg-emerald-50 border-emerald-100` | `text-emerald-700` | `✓ 正常` | 正常 |
| **偏低** ↓ | 低于正常下限 | `bg-sky-50 border-sky-200` | `text-sky-700` | `↓ 偏低` | 偏低 |
| **危急低值** ↓↓ | 低于危急低值下限 | `bg-violet-50 border-violet-300 border-dashed` | `text-violet-800` | `▼ 危急` | 危急低值 |

```tsx
// 危急值告警组件（Nordhealth Calm Alerting 实现）
// ❌ 禁止：<div className="bg-red-600 text-white p-4">CEA 超标！立即就医！</div>
// ✅ 正确示例：

<div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-dashed border-rose-300">
  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
    <span className="text-rose-600 text-sm font-bold" aria-hidden="true">▲</span>
  </div>
  <div>
    <p className="text-sm font-semibold text-rose-800">CEA 处于危急高值区间</p>
    <p className="text-xs text-rose-600 mt-0.5">当前值 48.3 ng/mL（参考上限 5.0 ng/mL）</p>
    <p className="text-xs text-rose-700 mt-1.5">
      建议：请结合影像学检查进一步评估，必要时预约 MDT 多学科会诊。
    </p>
  </div>
</div>
```

### A.4 键盘无障碍导航规范（Keyboard Accessibility）

参考 Nordhealth 的 Keyboard-First 原则，适配临床工作流中快捷键优先的操作习惯：

```tsx
// 所有交互组件必须支持完整的键盘导航
// 标准焦点环：医疗蓝辉光（替代浏览器默认蓝色方框）
// 参考 Nordhealth Focus Ring 实现

// globals.css / tailwind.css 全局配置：
/*
  [data-focus-visible-added], *:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px #ffffff, 0 0 0 4px #0284c7;
  }
*/

// React 组件实现
<button
  className={cn(
    "px-4 py-2 rounded-xl text-sm font-medium transition-all",
    "bg-sky-600 text-white",
    "hover:bg-sky-700",
    // 键盘焦点时显示双层辉光环（白色间隔 + 品牌蓝）
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2",
    // 键盘 Tab 顺序：临床操作关键按钮优先
    "focus:z-10"
  )}
  // 快捷键提示
  aria-keyshortcuts="Alt+S"
  title="保存报告 (Alt+S)"
>
  保存报告
</button>
```

### A.5 静默状态徽章（Silent Status Badge）

Nordhealth 的「Calm Technology」原则：状态徽章应传达信息但不主动吸引注意力：

```tsx
// 静默状态徽章：无边框，无阴影，低饱和度
// 用于常规状态（非危急）展示，不抢夺医护视线

const SILENT_BADGE_STYLES = {
  active:    'bg-emerald-100 text-emerald-700',   // 治疗进行中
  followup:  'bg-sky-100 text-sky-700',            // 随访期
  completed: 'bg-slate-100 text-slate-600',        // 治疗完成
  pending:   'bg-amber-100 text-amber-700',        // 待处置
  archived:  'bg-slate-50 text-slate-400',         // 已归档
};

<span className={cn(
  "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium",
  SILENT_BADGE_STYLES[status]
)}>
  {statusLabel}
</span>
```

---

## 模块 B：NHS.UK 患者端规范（健康素养 · 去焦虑叙事）

### B.1 设计哲学引入

NHS.UK Digital Service Manual 是全球健康素养（Health Literacy）设计的最高标准，其核心原则：
- **"Plain English First"**：所有医学内容必须以 9-11 岁阅读难度表达，杜绝无解释的医学黑话
- **"Do the hard work to make it simple"**：让内容创作者承担翻译医学术语的责任，而不是让患者自己去查
- **"Design for the most vulnerable"**：为认知负荷最高、情绪最脆弱的患者而设计，其他人自然受益

### B.2 医学术语 Popover 说明规范（Plain Language Glossary）

每个难以理解的医学专业术语，必须通过悬停/点击 Popover 提供即时白话解释：

```tsx
// 医学术语解释组件（NHS.UK Plain Language 标准）
// 术语下方虚线标注，点击展示解释

interface MedTermProps {
  term: string;          // 医学术语（如 "EGFR 突变"）
  plainText: string;     // 9-11 岁阅读难度的白话解释
  learnMoreUrl?: string; // 知癌维基内部链接（深度阅读）
}

// ✅ 正确实现：
<span className="relative inline-block">
  <button
    className={cn(
      "border-b border-dashed border-sky-400 text-inherit",
      "cursor-help focus-visible:outline-none",
      "focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-1 rounded-sm",
    )}
    aria-describedby={`${termId}-popover`}
  >
    {term}
  </button>

  {/* Popover 内容（使用 Tailwind group/peer 或受控 state） */}
  <div
    id={`${termId}-popover`}
    role="tooltip"
    className={cn(
      "absolute bottom-full left-0 mb-2 z-50 w-64",
      "bg-white rounded-2xl border border-slate-200 shadow-lg p-3",
      "text-sm text-slate-700 leading-relaxed"
    )}
  >
    <p className="font-semibold text-slate-900 text-xs uppercase tracking-wide mb-1.5">
      通俗理解
    </p>
    <p className="text-sm text-slate-700">{plainText}</p>
    {learnMoreUrl && (
      <a
        href={learnMoreUrl}
        className="text-xs text-sky-600 hover:text-sky-800 hover:underline inline-flex items-center gap-0.5 mt-2"
      >
        深入了解 →
      </a>
    )}
  </div>
</span>
```

### B.3 医学术语白话词汇表（覆盖主要肿瘤专科术语）

以下术语必须在首次出现时触发 Popover 说明（遵循 NHS Plain English 标准）：

| 医学术语 | NHS 风格白话解释（≤20字）| 适用癌种 |
| :--- | :--- | :--- |
| `EGFR 突变` | 肿瘤细胞里有一个特定的"开关"出了故障，让癌细胞不停生长。好消息是，有专门针对这个开关的靶向药物。 | 肺癌 |
| `磨玻璃结节 (GGO)` | 肺部CT上看起来像磨砂玻璃一样朦胧的小阴影，通常是早期肺癌或癌前病变的信号，很多时候可以先随访观察。 | 肺癌 |
| `HER2 阳性` | 肿瘤细胞表面有大量特定蛋白（HER2），像天线一样让癌细胞疯狂生长。针对它的靶向药物效果很好。 | 乳腺癌、胃癌 |
| `Ki-67` | 一个衡量肿瘤细胞分裂速度的指标，数值越高表示癌细胞增殖越活跃，需要更积极的治疗。 | 乳腺癌等 |
| `淋巴结转移` | 癌细胞通过淋巴管扩散到附近淋巴结（免疫站点）。这会影响分期和治疗方案，但不代表无法治疗。 | 全癌种 |
| `pCR（病理完全缓解）` | 新辅助治疗后，外科手术取出的标本在显微镜下找不到任何活的癌细胞——这是治疗效果最好的结果之一。 | 乳腺癌、食管癌等 |
| `免疫组化 (IHC)` | 一种在显微镜下给肿瘤细胞"染色"的检测方法，用来看肿瘤表面有没有特定的蛋白靶点。 | 全癌种 |
| `CRM (环周切缘)` | 直肠癌手术时，肿瘤切除后最近边缘的距离，是预测复发的重要指标，越大说明切除越干净。 | 直肠癌 |
| `微卫星不稳定 (MSI-H)` | 肿瘤细胞 DNA 修复系统出了问题，虽然这听起来不好，但这类肿瘤对免疫治疗药物（PD-1抑制剂）往往效果极好。 | 结直肠癌、子宫内膜癌 |
| `Child-Pugh 分级` | 评估肝癌患者肝脏功能好坏的"分档"方式（A/B/C 三档），直接影响能否做手术以及能用什么药。 | 肝癌 |
| `BRAF V600E` | 肿瘤基因里的一个特定突变，让细胞生长的"油门"一直踩到底。甲状腺癌中若存在，可用靶向药达拉非尼+曲美替尼联合治疗。 | 甲状腺癌、结直肠癌 |
| `Claudin 18.2` | 肿瘤细胞表面的一种蛋白，胃癌中约 40% 患者阳性，靶向它的新药佐妥昔单抗已获批一线使用。 | 胃癌 |
| `DDI（药物相互作用）` | 两种药物同时使用时，相互影响对方的效果或产生新的副作用。肿瘤靶向药与某些常用药组合需要特别注意。 | 全癌种 |

### B.4 分步向导卡（Stepwise Decision Guide）

参考 NHS.UK Stepper 组件，用于引导患者完成多步骤复杂决策（如分期确认 → 基因检测 → 治疗方案选择）：

```tsx
// 分步向导组件（NHS 风格 · 去焦虑感）
interface StepItem {
  step: number;
  title: string;         // 简短步骤标题（≤10 字）
  description: string;   // 患者行动描述（≤40 字，白话）
  status: 'completed' | 'current' | 'pending';
  timeEstimate?: string; // 预计耗时提示（如 "约 1-2 周"）
}

<ol className="space-y-0">
  {steps.map((step, index) => (
    <li key={step.step} className="flex gap-4">
      {/* 步骤编号列 */}
      <div className="flex flex-col items-center">
        <div className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0",
          step.status === 'completed' && "bg-emerald-600 text-white",
          step.status === 'current'   && "bg-sky-600 text-white ring-4 ring-sky-100",
          step.status === 'pending'   && "bg-slate-200 text-slate-500",
        )}>
          {step.status === 'completed' ? '✓' : step.step}
        </div>
        {/* 连接线（除最后一步外） */}
        {index < steps.length - 1 && (
          <div className={cn(
            "w-0.5 flex-1 mt-1",
            step.status === 'completed' ? "bg-emerald-300" : "bg-slate-200"
          )} />
        )}
      </div>

      {/* 步骤内容 */}
      <div className="pb-6 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className={cn(
            "text-sm font-semibold",
            step.status === 'current' ? "text-sky-800" : "text-slate-700"
          )}>
            {step.title}
          </h3>
          {step.timeEstimate && (
            <span className="text-xs text-slate-400 flex-shrink-0">{step.timeEstimate}</span>
          )}
        </div>
        <p className="text-sm text-slate-600 mt-0.5 leading-relaxed">
          {step.description}
        </p>
      </div>
    </li>
  ))}
</ol>
```

### B.5 抗焦虑文案过滤守则（De-Escalation Language Rules）

参考 NHS 内容设计（Content Design）原则，针对肿瘤平台的特殊情绪管理需求：

#### 必须替换的恐慌性词汇清单

| ❌ 禁止使用 | ✅ 替换为 | 原因 |
| :--- | :--- | :--- |
| 无药可救 | 目前暂无标准治疗，但可以关注临床试验 | 给予行动路径，而非绝望宣判 |
| 晚期 / 终末期 | 局部进展期 / 系统性疾病（附生存数据） | 临床术语 + 循证数据替代情绪词 |
| 5 年内死亡率 | 5 年生存率（如 "接受规范治疗后有 60% 的患者存活超过 5 年"） | 正框架（Positive Framing）表达 |
| 复发不可避免 | 规范随访有助于早期发现复发，多数可以再次治疗 | 赋能行动（Patient Empowerment） |
| 随时危及生命 | 需要密切医学监测，主治医生会定期评估 | 专业干预感而非孤独恐惧感 |
| 不能手术 / 不可切除 | 目前直接手术的风险较高，治疗团队在评估转化方案 | 过程感（Process-Oriented） |

#### 正框架（Positive Reframing）模板

```tsx
// ✅ 高危因素披露时，必须在同一视口内呈现「对应循证破局方案」

// ❌ 反例：
<p className="text-red-600">您的报告显示脉管浸润阳性，这是高危转移风险因素。</p>

// ✅ 正例：
<div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
  <div className="flex items-start gap-3">
    <span className="text-rose-400 mt-0.5 flex-shrink-0" aria-hidden="true">
      <ShieldAlert className="w-5 h-5" />
    </span>
    <div>
      <p className="text-sm font-semibold text-rose-800 mb-1">
        报告显示：脉管侵犯（LVSI）阳性
      </p>
      <p className="text-sm text-rose-700 leading-relaxed">
        这是一个需要更积极随访的因素。但根据{' '}
        <span className="font-medium">KEYNOTE-394 / KEYNOTE-590</span>{' '}
        等大型研究，对于高危患者，辅助系统治疗可将复发风险显著降低至 40%-60%。
      </p>
      <div className="mt-2.5 pt-2.5 border-t border-rose-100">
        <p className="text-xs text-rose-600">
          💡 建议：向主治医生咨询是否需要增加辅助治疗，并制定个体化随访计划。
        </p>
      </div>
    </div>
  </div>
</div>
```

---

## 模块 C：Carbon Healthcare 循证端规范（精准医疗 · CDS）

### C.1 设计哲学引入

IBM Carbon Design System for Healthcare 针对临床决策支持（CDS）场景的核心原则：
- **"Minimal Cognitive Load"**：在医生最忙碌的临床决策时刻，减少每一秒的认知负担
- **"Data Hierarchy"**：明确的视觉层级让医生能在 3 秒内定位最关键信息
- **"Trust through Transparency"**：每一个建议必须可溯源，可质疑，可自行验证

### C.2 临床试验入组/排除比对矩阵（Trial Eligibility Matrix）

```tsx
// 临床试验适配度评分矩阵（Carbon Healthcare 风格）
interface TrialCriterion {
  criterion: string;      // 入组/排除条件描述
  type: 'inclusion' | 'exclusion';
  patientMatch: 'met' | 'not_met' | 'partial' | 'unknown';
  importance: 'mandatory' | 'preferred' | 'optional';
  detail?: string;        // 具体说明
}

// 适配状态颜色体系
const MATCH_STATUS = {
  met:      { bg: 'bg-emerald-50', text: 'text-emerald-800', icon: '✓', label: '符合' },
  not_met:  { bg: 'bg-rose-50',    text: 'text-rose-800',    icon: '✗', label: '不符合' },
  partial:  { bg: 'bg-amber-50',   text: 'text-amber-800',   icon: '~', label: '部分符合' },
  unknown:  { bg: 'bg-slate-50',   text: 'text-slate-600',   icon: '?', label: '待确认' },
};

// 组件渲染
<div className="divide-y divide-slate-100 rounded-2xl border border-slate-200 overflow-hidden">
  {/* 整体适配度评分头部 */}
  <div className="px-4 py-3 bg-slate-50 flex items-center justify-between">
    <span className="text-sm font-semibold text-slate-800">入组适配度评分</span>
    <div className="flex items-center gap-2">
      <div className="flex gap-1">
        {[...Array(matchScore)].map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
        ))}
        {[...Array(5 - matchScore)].map((_, i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full bg-slate-200" />
        ))}
      </div>
      <span className="text-sm font-bold text-slate-700">{matchScore}/5</span>
    </div>
  </div>

  {/* 条件逐项列表 */}
  {criteria.map((item, index) => (
    <div key={index} className="flex items-start gap-3 px-4 py-3">
      <span className={cn(
        "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold",
        MATCH_STATUS[item.patientMatch].bg,
        MATCH_STATUS[item.patientMatch].text,
      )}>
        {MATCH_STATUS[item.patientMatch].icon}
      </span>
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-sm",
          item.importance === 'mandatory' ? "font-semibold text-slate-900" : "font-normal text-slate-700"
        )}>
          {item.criterion}
          {item.importance === 'mandatory' && (
            <span className="ml-1.5 text-xs text-rose-600 font-medium">必要条件</span>
          )}
        </p>
        {item.detail && (
          <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
        )}
      </div>
    </div>
  ))}
</div>
```

### C.3 NCCN 证据等级 × CSCO 推荐级别双轨标章

参考 IBM Carbon 的 NCCN Evidence Block™ 设计语言，结合中国 CSCO 指南体系：

```tsx
// 双轨证据标章（国际 NCCN + 中国 CSCO 对照）
interface DualEvidenceBadgeProps {
  nccnCategory: '1' | '2A' | '2B' | '3';  // NCCN 证据分类
  cscoLevel: 'I' | 'II' | 'III';            // CSCO 推荐级别
  cscoGrade: 'A' | 'B';                     // CSCO 推荐强度
}

const NCCN_STYLES = {
  '1':  { bg: 'bg-blue-600',  text: 'text-white', label: 'NCCN 1 类' },
  '2A': { bg: 'bg-sky-500',   text: 'text-white', label: 'NCCN 2A' },
  '2B': { bg: 'bg-sky-200',   text: 'text-sky-900', label: 'NCCN 2B' },
  '3':  { bg: 'bg-slate-200', text: 'text-slate-700', label: 'NCCN 3 类' },
};

const CSCO_STYLES = {
  'I':  { bg: 'bg-emerald-600', text: 'text-white', label: 'CSCO Ⅰ' },
  'II': { bg: 'bg-emerald-400', text: 'text-white', label: 'CSCO Ⅱ' },
  'III':{ bg: 'bg-slate-300',   text: 'text-slate-800', label: 'CSCO Ⅲ' },
};

<div className="inline-flex rounded-lg overflow-hidden border border-slate-200 shadow-xs">
  <div className={cn(
    "px-2.5 py-1 text-xs font-bold",
    NCCN_STYLES[nccnCategory].bg,
    NCCN_STYLES[nccnCategory].text
  )}>
    {NCCN_STYLES[nccnCategory].label}
  </div>
  <div className={cn(
    "px-2.5 py-1 text-xs font-bold border-l border-white/20",
    CSCO_STYLES[cscoLevel].bg,
    CSCO_STYLES[cscoLevel].text
  )}>
    {CSCO_STYLES[cscoLevel].label}{cscoGrade}
  </div>
</div>
```

### C.4 精准医疗靶点检测导航面板（Biomarker Panel）

参考 Carbon Healthcare 基因组学信息展示的语义层级原则：

```tsx
// 靶点检测状态全景面板
// 用于肿瘤基因检测报告的核心结果展示

const BIOMARKER_RESULT = {
  positive:    { icon: '+', bg: 'bg-blue-50 border-blue-200',    text: 'text-blue-800',    label: '阳性' },
  negative:    { icon: '−', bg: 'bg-slate-50 border-slate-200',  text: 'text-slate-600',   label: '阴性' },
  amplified:   { icon: '↑↑', bg: 'bg-violet-50 border-violet-200', text: 'text-violet-800', label: '扩增' },
  mutated:     { icon: '▲', bg: 'bg-amber-50 border-amber-200',  text: 'text-amber-800',   label: '突变' },
  fused:       { icon: '⊕', bg: 'bg-rose-50 border-rose-200',   text: 'text-rose-800',    label: '融合' },
  not_tested:  { icon: '−', bg: 'bg-slate-50 border-dashed border-slate-200', text: 'text-slate-400', label: '未检测' },
};

// 靶点卡片网格（响应式 2-3 列）
<div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
  {biomarkers.map((marker) => (
    <div key={marker.name} className={cn(
      "rounded-xl border p-3 flex flex-col gap-1.5",
      BIOMARKER_RESULT[marker.result].bg
    )}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
          {marker.name}
        </span>
        <span className={cn(
          "text-xs font-bold tabular-nums",
          BIOMARKER_RESULT[marker.result].text
        )}>
          {BIOMARKER_RESULT[marker.result].label}
        </span>
      </div>
      {/* 靶向药物对应提示 */}
      {marker.targetedDrug && (
        <p className="text-xs text-slate-600">
          → {marker.targetedDrug}
        </p>
      )}
      {/* 突变率 / 表达水平 */}
      {marker.value && (
        <p className={cn("text-lg font-black tabular-nums", BIOMARKER_RESULT[marker.result].text)}>
          {marker.value}
          {marker.unit && <span className="text-xs font-normal ml-0.5">{marker.unit}</span>}
        </p>
      )}
    </div>
  ))}
</div>
```

### C.5 临床数据语义层级（Data Hierarchy Principle）

参考 Carbon 的「3 秒规则」：医生打开报告后，3 秒内必须能看到最重要的信息：

```
层级 1（0-1 秒）：生存预后核心结论 → 巨幅 text-4xl font-black 数字 + 状态颜色
层级 2（1-3 秒）：关键靶点与治疗方案 → text-xl font-bold 标题 + 证据徽章
层级 3（3-10 秒）：病理细节与亚组分析 → text-base 正文 + 可折叠详情
层级 4（10 秒+）：原始数据与文献来源 → text-sm 辅助信息 + DOI 链接
```

```tsx
// 三秒法则布局示例
<div className="space-y-6">
  {/* 层级 1：核心预后结论（一眼看懂） */}
  <div className="p-5 rounded-3xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200">
    <p className="text-xs font-semibold text-sky-600 uppercase tracking-wider mb-2">
      5 年总生存率（规范治疗后）
    </p>
    <p className="text-5xl font-black text-sky-800 tabular-nums leading-none">
      87.0<span className="text-2xl font-bold text-sky-600">%</span>
    </p>
    <p className="text-sm text-sky-700 mt-2">
      基于 ADAURA 研究（n=682，NEJM 2020）
    </p>
  </div>

  {/* 层级 2：关键治疗方案（扫一眼确认） */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    {recommendedRegimens.map((regimen) => (
      <div key={regimen.name} className="rounded-2xl border border-slate-200 p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-sm font-bold text-slate-900">{regimen.name}</h3>
          <DualEvidenceBadge
            nccnCategory={regimen.nccnCategory}
            cscoLevel={regimen.cscoLevel}
            cscoGrade={regimen.cscoGrade}
          />
        </div>
        <p className="text-xs text-slate-600">{regimen.summary}</p>
      </div>
    ))}
  </div>

  {/* 层级 3/4：详情按需展开 */}
  <details className="rounded-2xl border border-slate-200 overflow-hidden">
    <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-slate-700 hover:bg-slate-50 list-none flex items-center justify-between">
      <span>病理详情与亚组分析</span>
      <ChevronDown className="w-4 h-4 text-slate-400" />
    </summary>
    <div className="px-4 pb-4 pt-2 space-y-4">
      {/* 层级 3/4 内容 */}
    </div>
  </details>
</div>
```

---

## 全局质量门禁（Quality Gates for All Three Modules）

每个融合本技能的组件上线前，必须通过以下三轨检查：

### 医护端质量门禁（Nordhealth Module）
- [ ] 表格行高 ≥ 40px（桌面端），移动端 ≥ 48px（满足 44px 触控目标）
- [ ] 所有危急值芯片同时使用颜色 + 上下箭头图标 + 文字标签三合一呈现
- [ ] 所有交互元素支持 `Tab / Enter / Escape` 键盘操作，并有 `focus-visible` 双层辉光环
- [ ] 数值列使用 `font-mono tabular-nums`，无横向抖动

### 患者端质量门禁（NHS.UK Module）
- [ ] 所有医学专业术语在首次出现时有 Popover 白话解释，解释文字 ≤ 50 字，阅读难度 ≤ 11 岁
- [ ] 高危风险披露时，同一视口内必须展示对应的循证治疗对策（正框架）
- [ ] 禁止使用「晚期、无药可救、随时危及生命」等恐慌性绝对词汇
- [ ] 多步骤决策引导使用 Stepper 组件，每步有清晰的时间预期提示

### 循证端质量门禁（Carbon Healthcare Module）
- [ ] 所有治疗推荐方案必须附带 NCCN + CSCO 双轨证据徽章
- [ ] 临床试验匹配矩阵每个条件都有 `met / not_met / partial / unknown` 四态状态标注
- [ ] 靶点检测面板结果徽章同时展示颜色 + 符号（+/-/▲/⊕）+ 文字标签
- [ ] 核心报告页面遵循「3 秒法则」：层级 1 结论在视口首屏，层级 3/4 使用折叠展开
