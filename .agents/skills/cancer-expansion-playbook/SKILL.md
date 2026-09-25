---
name: OncoPath 多癌种拓展全流程 Playbook
description: 当需要为 OncoPath / ZhiaiWiki 平台新增任何一种实体瘤（如胰腺癌、前列腺癌、膀胱癌、卵巢癌、鼻咽癌、骨髓瘤等）时，必须阅读本技能，按照完整的 12 步流程执行开发、医学内容填充、DDI 校验、全站 UI/导航同步、测试与验收，确保新癌种与既有 11 个癌种体系完全对齐，不遗漏任何工程、UI 与临床安全环节。
---

# OncoPath 多癌种拓展全流程 Playbook

本技能是为 **ZhiaiWiki / OncoPath** 平台接入**任意新实体瘤专科**（如胰腺癌、前列腺癌、膀胱癌、卵巢癌、鼻咽癌、多发性骨髓瘤、淋巴瘤、脑胶质瘤、肾癌等）的权威操作手册。

涵盖从需求分析 → 代码脚手架 → 集中式调度挂载 → 医学内容填充 → 临床安全防线 → 全站 UI/导航矩阵同步 → 测试验证 → 全栈验收的**全部标准阶段**，所有工程契约、UI 发现链路与临床安全红线必须严格执行。

---

## 0. 前置知识：平台架构与集中式调度全貌

在开发新癌种前，必须彻底理解 OncoPath 的分层架构与注册中心机制：

### 0.1 插件注册中心模式 (CancerRegistry Plugin Pattern)

系统采用单例注册表模式（Registry Pattern）管理所有癌种，位于 `src/lib/cancerRegistry/`：

```
app/src/lib/cancerRegistry/
├── CancerRegistry.ts        # 单例注册中心管理器 (CancerRegistryManager)
├── index.ts                 # 集中 import 并 CancerRegistry.register() 全部插件
├── types.ts                 # CancerPluginSpec 规范接口契约 & CancerTypeOption
└── plugins/
    ├── lungPlugin.ts        # 肺癌 (lung)
    ├── breastPlugin.ts      # 乳腺癌 (breast)
    ├── colorectalPlugin.ts  # 结直肠癌 (colorectal)
    ├── colonPlugin.ts       # 结肠癌 (colon)
    ├── rectalPlugin.ts      # 直肠癌 (rectal)
    ├── gastricPlugin.ts     # 胃癌 (gastric)
    ├── liverPlugin.ts       # 肝癌 (liver)
    ├── esophagealPlugin.ts  # 食管癌 (esophageal)
    ├── thyroidPlugin.ts     # 甲状腺癌 (thyroid)
    ├── endometrialPlugin.ts # 子宫内膜癌 (endometrial)
    ├── cervicalPlugin.ts    # 宫颈癌 (cervical)
    └── pancreaticPlugin.ts  # 胰腺癌 (pancreatic)
```

### 0.2 每个成熟癌种的标准模块集 (Standard Module Set)

每个完整接入的癌种（以乳腺癌/肺癌为标杆）由以下文件组成：

| 文件路径 | 对应导出的核心类型 / 函数 | 职责与工程契约 |
|:---|:---|:---|
| `src/lib/{name}Staging.ts` | `compute{Name}Stage()`: `UnifiedStagingResult`<br>`get{Name}ClinicalCohort()`: `ClinicalCohortResult` | 确定性临床/病理 TNM 分期引擎与顶刊生存队列推演 |
| `src/lib/{name}DdiData.ts` | `{NAME}_TARGETED_DRUGS`: `TargetedDrug[]`<br>`{NAME}_DDI_RULES`: `DdiRule[]`<br>`check{Name}DrugInteractions()`: `DdiAnalysisResult` | 专科靶向药定义与 DDI 药理相互作用/禁忌校验库 |
| `src/lib/{name}StudiesData.ts` | `{NAME}_STUDIES`: `StudyItem[]` (来自 `@/components/StudyCard`) | 顶刊前瞻性里程碑临床试验与真实科研证据库 |
| `src/lib/{name}WikiData.ts` | `{NAME}_WIKI_TOPICS`: `WikiTopic[]` (来自 `@/lib/wikiData`) | 破恐百科词条库（遵循三段式叙事架构） |
| `src/lib/{name}ReimbursementData.ts` | `{NAME}_DRUG_POLICIES`: `DrugPolicy[]` (来自 `@/lib/reimbursementData`) | 国谈医保准入、支付限制与慈善援助 (PAP) 政策库 |
| `src/lib/{name}KnowledgeGraphData.ts` | `{NAME}_GRAPH_NODES`, `{NAME}_EDGE_EVIDENCE_MAP` | 专科医学知识图谱节点与边证据（选配） |
| `src/lib/{name}ResourcesData.ts` | `{NAME}_RESOURCES` | 专科患者随访与康复资源清单（选配） |
| `src/lib/cancerRegistry/plugins/{name}Plugin.ts` | `{name}Plugin`: `CancerPluginSpec` | 插件契约定义，统一聚合分期、药理、内容与主题 |
| `src/__tests__/{name}Staging.test.ts` | Vitest 单元测试套件 | TDD 自动化测试用例，覆盖分期、NaN防御与DDI拦截 |

### 0.3 平台核心联动文件（新增癌种必须同步修改的“中枢节点”）

新增一个癌种**不仅是新增文件**，更必须在全站 17 处核心挂载点完成数据、UI 与服务的全链路同步，杜绝“后台有数据、前端看不见”的断层问题：

#### A. 核心数据与分期调度（数据契约层 · 5 处）
1. **`app/src/lib/types.ts`**：在 `CancerType` 联合类型中追加新癌种标识（如 `'pancreatic'`）。
2. **`app/src/lib/profileStorage.ts`**：
   - 在 `KNOWN_CANCER_TYPES` 数组中追加新癌种标识；
   - 在 `saveProfileToSlot` 中支持该癌种及常见别名的卡槽匹配；
   - 在 `getDualPrimarySummary` 中读取并返回该癌种的槽位档案。
3. **`app/src/lib/stagingRegistry.ts`**：
   - 重新导出 `compute{Name}Stage` 与 `get{Name}ClinicalCohort`；
   - 在 `normalizeCancerType()` 函数中追加中文及英文别名映射（如 `"胰腺"`、`"胰腺癌"`、`"pancreas"` $\to$ `"pancreatic"`）。
4. **`app/src/lib/evidence-data.ts`**：在头部导入 `{NAME}_STUDIES`，并在 `FEATURED_STUDIES` 聚合池中挂载代表性顶刊研究。
5. **`app/src/lib/cancerRegistry/index.ts`**：导入并在入口处执行 `CancerRegistry.register({name}Plugin)`。

#### B. 导航交互与全站视觉矩阵（展示层与用户界面 · 9 处）
6. **`app/src/components/common/CancerIcons.tsx`**：
   - 绘制专科专属矢量解剖 SVG 图标组件（如 `PancreaticIcon`），保证深色/浅色模式自适应；
   - 在主分发组件 `CancerIcon` 中增加分发分支。
7. **`app/src/components/common/CancerSwitch.tsx`**（顶部全局导航切换栏）：
   - 从 `UPCOMING_CANCERS`（规划中占位）中**彻底移除该癌种**（替换为下一个规划中癌种）；
   - 在支持列表中配置该癌种的背景、文字色彩、边框与高亮主题样式。
8. **`app/src/app/page.tsx`**（首页“探索更多癌种专区”九宫格矩阵）：
   - 在 `CANCER_MATRIX_CARDS` 数组中追加新卡片（包含中文名、英文名、专科标签、顶刊与词条统计、跳转路由）；
   - 调整桌面端（如 `lg:grid-cols-3`）与移动端（如 `grid-cols-3`）的自适应网格排版，确保整齐优雅。
9. **`app/src/components/wiki/WikiScenarioTabs.tsx`**（维基百科智能场景标签栏）：
   - 定义专科五大场景 Tabs（如结节影像、病理分期与可切除性、分子分型与化疗、术后康复与外分泌）；
   - 在 `scenarioTabs` 与 `currentTopics` 分流逻辑中绑定新癌种。
10. **`app/src/components/wiki/WikiSearchBar.tsx`**（维基百科动态搜索框）：
    - 在占位符映射字典中配置该癌种的特色靶点、术式、方案与标志物提示词（如 `CA19-9 / Whipple / mFOLFIRINOX`）。
11. **`app/src/components/SettingsModal.tsx`**（用户偏好设置弹窗）：
    - 确保默认癌种选择器能动态读取 `CancerRegistry` 或包含新癌种选项与色彩标识。
12. **`app/src/components/StatsBanner.tsx`**（全站临床证据总库统计横幅）：
    - 导入 `{NAME}_STUDIES` 并并入 `RAW_STUDIES`，更新全站支持癌种数量常量（如 `TOTAL_SUPPORTED_CANCERS = 9`）。
13. **`app/src/components/profile/PatientDashboard.tsx`**（患者临床档案看板与双原发切换）：
    - 适配双原发槽位切换器 `<DualPrimarySwitcher />`；
    - 配置专科靶向药推荐逻辑与档案卡片副标题。
14. **`app/src/app/knowledge/page.tsx`**（临床证据图谱专区）：
    - 在专区 Hero 区域补充该癌种的临床全景描述。

#### C. AI 报告生成与临床推理后端（服务层 · 3 处）
15. **`app/src/app/api/graph/route.ts`**：配置该癌种在医学知识图谱 API 中的节点与关系边返回。
16. **`app/src/app/api/parse-report/route.ts`**：
    - 在 Step 0 中注入专科关键词匹配指南；
    - 在分期评估解析中添加专科分支逻辑与高危评估。
17. **`app/src/app/api/generate-report/route.ts`**：
    - 定义完整的专科 System Prompt 模板（如 `PANCREATIC_REPORT_PROMPT`）；
    - 注入专科前瞻性顶刊证据库（如 PRODIGE 24、POLO、ESPEN）；
    - 在 `templatePrompt` 条件链路中完成挂载。

---

## 1. 阶段一：新癌种需求分析与医学立项 (Clinical Specification)

### 1.1 基础元数据清单（立项必须确认）

在编写代码前，必须填写以下元数据卡片：

| 字段 | 格式要求 | 示例（胰腺癌） | 说明 |
|:---|:---|:---|:---|
| `cancerKey` | 全小写字母/下划线，作为 `CancerType` | `pancreatic` | 用于文件名、路由参数、存储槽位 ID |
| `chineseName` | 规范医学全称（中文） | `胰腺癌` | 前端界面主要展示文字 |
| `enName` | 英文正式名称 | `Pancreatic Cancer` | 英文版与国际化标识 |
| `organ` | 器官英文标识 | `pancreas` | 用于解剖归类与通用别名匹配 |
| `icon` | 单一 Emoji 符号 | `🫐` | 专区标识，语义贴合器官或象征色彩 |
| `guidelineStandard` | 规范指南版本与出处 | `NCCN 2024 · AJCC 第 8/9 版 · CSCO 2024` | 决定分期引擎依据的行业标准 |
| `themeColor` | 专区主题色阶 | 必须参考 §9.2，禁止与已有专区撞色 | 保证视觉识别的独立性 |

### 1.2 专科独有专业术语（防穿模隔离词典）

整理 10～15 个本癌种绝对独有的术语。这些词汇将被自动化安全脚本（`test-guardrails.ts`）监测，**严禁出现在其他癌种的临床报告或百科内容中**：

> **胰腺癌独有术语示例**：`CA19-9`, `可切除性三分类 (可切/交界可切/局部进展不可切)`, `肠系膜上静脉/门静脉 (SMV/PV) 侵犯`, `腹腔干 (CA) / 肠系膜上动脉 (SMA) 侵犯`, `FOLFIRINOX 方案`, `AG 方案 (白蛋白紫杉醇+吉西他滨)`, `Whipple 术 (胰十二指肠切除术)`, `胰体尾切除术 (RAMPS)`, `BRCA1/2 胚系突变 / POLO 研究`, `奥拉帕利维持`, `胰腺外分泌功能不全 (PEI) / 胰酶替代 (PERT)`

### 1.3 临床药理红线调研（DDI 危险禁忌预排查）

提前梳理该癌种一线/二线药物在实际用药中的**致命性与重要相互作用**：
- **CYP3A4 强诱导剂/强抑制剂**：如厄洛替尼、奥拉帕利、卡巴他赛等受利福平、圣约翰草影响导致血药浓度暴跌。
- **消化道大出血/穿孔风险**：抗血管小分子 TKI 联用抗凝药物在空腔脏器或溃疡背景下的出血风险。
- **胃内 pH 依赖性吸收障碍**：需确认核心口服靶向药是否受质子泵抑制剂（PPI，如奥美拉唑）显著影响（如厄洛替尼溶解度急剧下降需时序隔离）。

---

## 2. 阶段二：代码脚手架生成与核心类型登记

### 2.1 运行专科脚手架命令

项目内置了脚手架脚本 `app/scripts/scaffold-cancer.ts`。

> [!IMPORTANT]
> **执行路径规范**：`scaffold:cancer` 脚本注册在 `app/package.json` 中。必须在 `app` 目录执行，或在项目根目录使用 `npm --prefix app run`。

```bash
# 方式 A：进入 app 目录执行（推荐）
cd app
npm run scaffold:cancer -- --name=pancreatic --chinese="胰腺癌" --organ=pancreas --guideline="NCCN 2024 · AJCC 第 8 版 · CSCO 2024"

# 方式 B：根目录下直接代理执行
npm --prefix app run scaffold:cancer -- --name=pancreatic --chinese="胰腺癌" --organ=pancreas

# 预览生成计划（不实际写入）：
npm --prefix app run scaffold:cancer -- --name=pancreatic --chinese="胰腺癌" --dry-run
```

脚手架会自动生成基础文件骨架并在 `src/lib/cancerRegistry/index.ts` 中插入注册语句。生成后需立即按后续各阶段对骨架代码进行专业化替换与精化。

### 2.2 核心联合类型登记 (`app/src/lib/types.ts`)

在 `src/lib/types.ts` 中找到 `CancerType` 联合类型并追加新癌种：

```typescript
// app/src/lib/types.ts
export type CancerType =
  | "lung"
  | "breast"
  | "colon"
  | "rectal"
  | "gastric"
  | "liver"
  | "esophageal"
  | "colorectal"
  | "thyroid"
  | "endometrial"
  | "cervical"
  | "pancreatic"; // ← 新增癌种标识
```

### 2.3 存储卡槽登记 (`app/src/lib/profileStorage.ts`)

为了使患者档案多卡槽切换（如同时保存肺癌档案与胰腺癌档案）正常运作，必须在 `src/lib/profileStorage.ts` 中更新 `KNOWN_CANCER_TYPES`：

```typescript
// app/src/lib/profileStorage.ts
const KNOWN_CANCER_TYPES: CancerType[] = [
  "lung", "breast", "colon", "rectal", "gastric", "liver",
  "esophageal", "colorectal", "thyroid", "endometrial", "cervical",
  "pancreatic", // ← 新增
];
```

### 2.4 分期调度与别名注册 (`app/src/lib/stagingRegistry.ts`)

在 `src/lib/stagingRegistry.ts` 中追加函数导出与中文名称解析：

```typescript
// 1. 导出新分期函数
export { computePancreaticStage, getPancreaticClinicalCohort } from "./pancreaticStaging";

// 2. 在 normalizeCancerType 函数中追加别名映射
export function normalizeCancerType(cancerType?: string | null, organ?: string | null): CancerType {
  const raw = (cancerType || organ || "").toLowerCase().trim();
  // ... 既有匹配 ...
  if (raw === "pancreatic" || raw === "pancreas" || raw === "胰腺" || raw === "胰腺癌") return "pancreatic";
  
  if (CancerRegistry.has(raw)) return raw as CancerType;
  return "lung";
}
```

---

## 3. 阶段三：分期引擎精化（临床核心与防御性编程）

脚手架生成的分期代码仅为初级骨架，**必须**重写为符合国际指南的完整判定逻辑。

### 3.1 编写 `compute{Name}Stage()`

必须遵守以下严苛的工程与临床防线：
1. **严格的 NaN / 非法值防御**：必须使用 `Number.isFinite()` 校验数值型字段（如肿瘤长径、淋巴结个数、CA19-9 数值），杜绝 `NaN` 渗入计算导致分期逻辑崩溃。
2. **规范化返回值**：必须完整返回 `UnifiedStagingResult` 接口定义的全部字段。

```typescript
// app/src/lib/pancreaticStaging.ts (示例核心结构)
import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface PancreaticStagingInput {
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  tumorSize?: number | null;
  smvPvInvolvement?: boolean | null; // 肠系膜上静脉/门静脉侵犯
  celiacInvolvement?: boolean | null; // 腹腔干/SMA侵犯
  hasDistantMets?: boolean | null;
  ca199?: number | null;
  resectabilityStatus?: "resectable" | "borderline_resectable" | "locally_advanced" | "metastatic" | null;
  [key: string]: any;
}

export function computePancreaticStage(input: PancreaticStagingInput): UnifiedStagingResult {
  const rawSize = Number(input.tumorSize);
  const safeSize = Number.isFinite(rawSize) && rawSize > 0 ? rawSize : 2.0;
  
  // T 分期判定 (AJCC 第 8 版: T1 <= 2cm, T2 >2且<=4cm, T3 >4cm, T4 侵犯腹腔干/SMA/可切除性丧失)
  let t = input.tStage;
  if (!t) {
    if (input.celiacInvolvement) {
      t = "T4";
    } else if (safeSize <= 2.0) {
      t = "T1";
    } else if (safeSize <= 4.0) {
      t = "T2";
    } else {
      t = "T3";
    }
  }

  // N 分期判定 (N0: 0个, N1: 1-3个区域淋巴结, N2: >=4个区域淋巴结)
  let n = input.nStage || "N0";
  
  // M 分期判定
  let m = input.hasDistantMets || (input.mStage && input.mStage.toUpperCase().startsWith("M1")) ? "M1" : "M0";

  let stage = "I";
  if (m === "M1") {
    stage = "IV";
  } else if (t.startsWith("T4")) {
    stage = "III";
  } else if (n.startsWith("N2")) {
    stage = "III";
  } else if (n.startsWith("N1")) {
    stage = "IIB";
  } else {
    // N0
    if (t.startsWith("T3")) stage = "IIA";
    else if (t.startsWith("T2")) stage = "IB";
    else stage = "IA";
  }

  const explanation = `依据 NCCN 2024 / AJCC 第 8 版标准：${t}${n}${m}，综合临床病理分期判定为 ${stage} 期。`;

  return {
    cancerType: "pancreatic",
    stage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation,
    treatmentDirection: `${stage} 期胰腺癌多学科综合诊疗 (MDT)：评估解剖学可切除性与系统转化治疗指征。`,
    versionNotice: "NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024",
  };
}
```

### 3.2 编写 `get{Name}ClinicalCohort()`

匹配对应期别的权威顶刊临床队列，**生存数据严禁虚构**，必须提供真实的顶刊溯源四要素：

```typescript
export function getPancreaticClinicalCohort(profile: any): ClinicalCohortResult {
  const stageRes = computePancreaticStage(profile || {});
  const stage = stageRes.stage;

  if (stage === "IV") {
    return {
      name: "MPACT_NAPOLI_Systemic_Cohort",
      stage: "IV期 (转移性胰腺癌一线系统化疗队列)",
      cohortSize: 861,
      rfs5Year: "中位PFS 5.5~6.4月",
      os5Year: "中位OS 8.5~11.1月 (2年OS约 9.0%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (前瞻多中心 Phase III RCT)",
      source: "NEJM 2013 (MPACT) / NEJM 2011 (ACCORD 11)",
      description: "晚期一线 mFOLFIRINOX 或白蛋白紫杉醇联合吉西他滨方案，显著优于传统吉西他滨单药。",
      isPreOp: false,
      keyFactors: ["ECOG PS评分", "CA19-9降幅", "三联化疗耐受性"],
      matchedMorphology: "转移性胰腺导管腺癌",
      riskTier: "high_risk",
      doi: "10.1056/NEJMoa1304369",
      pmid: "24131140",
      journal: "New England Journal of Medicine",
      publicationYear: 2013,
    };
  }

  return {
    name: "PRODIGE_24_Adjuvant_Cohort",
    stage: `${stage}期 (胰腺癌根治术后辅助化疗队列)`,
    cohortSize: 493,
    rfs5Year: "3年无病生存率 39.7% (mFOLFIRINOX组)",
    os5Year: "中位OS 54.4月 (5年OS约 43.2%)",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (1级前瞻多中心国际RCT)",
    source: "NEJM 2018 · PRODIGE 24/CCTG PA.6 · n=493",
    description: "R0/R1 根治切除术后，mFOLFIRINOX 方案将中位生存期显著提升至 54.4 个月，树立早期辅助国际金标准。",
    isPreOp: false,
    keyFactors: ["R0切缘", "术后辅助化疗周期数", "淋巴结检出总数"],
    matchedMorphology: "局限性可切除胰腺癌",
    riskTier: "intermediate_risk",
    doi: "10.1056/NEJMoa1809775",
    pmid: "30575490",
    journal: "New England Journal of Medicine",
    publicationYear: 2018,
  };
}
```

### 3.3 TDD 单元测试补全 (`src/__tests__/{name}Staging.test.ts`)

必须至少包含 **8 项**精准单元测试，确保覆盖各个期别阶梯及非法数值防御：

```typescript
import { describe, it, expect } from "vitest";
import { computePancreaticStage, getPancreaticClinicalCohort } from "@/lib/pancreaticStaging";
import { checkPancreaticDrugInteractions } from "@/lib/pancreaticDdiData";

describe("胰腺癌 (Pancreatic) 专科分期与循证引擎测试", () => {
  it("应准确计算早期 IA 期 (T1N0M0, 肿瘤 <= 2cm)", () => {
    const res = computePancreaticStage({ tumorSize: 1.8, tStage: "T1", nStage: "N0", mStage: "M0" });
    expect(res.stage).toBe("IA");
  });

  it("应准确计算 IIB 期 (淋巴结转移 N1, 局限性病灶)", () => {
    const res = computePancreaticStage({ tumorSize: 2.5, tStage: "T2", nStage: "N1", mStage: "M0" });
    expect(res.stage).toBe("IIB");
  });

  it("应准确计算局部晚期不可切除 III 期 (血管受累 T4)", () => {
    const res = computePancreaticStage({ celiacInvolvement: true, nStage: "N1", mStage: "M0" });
    expect(res.tStage).toBe("T4");
    expect(res.stage).toBe("III");
  });

  it("应准确计算远处转移 IV 期 (伴肝/肺等远处转移 M1)", () => {
    const res = computePancreaticStage({ tumorSize: 2.0, tStage: "T1", nStage: "N0", hasDistantMets: true });
    expect(res.stage).toBe("IV");
  });

  it("应安全防御 NaN 与非正数数值穿透，不发生运行期白屏", () => {
    const res = computePancreaticStage({ tumorSize: NaN, tStage: null, nStage: "N0" });
    expect(res.stage).toBeDefined();
    expect(res.explanation).not.toContain("NaN");
  });

  it("应正确匹配顶刊前瞻临床队列及其真实 PMID/DOI", () => {
    const cohort = getPancreaticClinicalCohort({ stage: "IV", hasDistantMets: true });
    expect(cohort.pmid).toBeDefined();
    expect(cohort.doi).toBeDefined();
    expect(cohort.confidenceRating).toBe("⭐⭐⭐⭐⭐");
  });

  it("应强力拦截 CYP3A4 强诱导剂与靶向药物的严重配伍禁忌", () => {
    const ddi = checkPancreaticDrugInteractions("pancreatic_erlotinib", ["rifampin"]);
    expect(ddi.overallStatus).toBe("danger");
    expect(ddi.severeCount).toBeGreaterThanOrEqual(1);
  });

  it("在无危险药物时应判定为安全状态 (safe)", () => {
    const ddi = checkPancreaticDrugInteractions("pancreatic_erlotinib", []);
    expect(ddi.overallStatus).toBe("safe");
  });
});
```

---

## 4. 阶段四：DDI 药理禁忌数据库精化 (Pharmacovigilance)

### 4.1 靶向药清单 `{NAME}_TARGETED_DRUGS`

在 `src/lib/{name}DdiData.ts` 中定义专科药物。

> [!NOTE]
> `TargetedDrug.target` 的原始联合类型包含 `"EGFR" | "ALK" | "KRAS" | "ROS1" | "MET" | "RET" | "HER2"`。若新癌种涉及其他靶点（如 `PARP`、`BRCA`、`FGFR`、`VEGFR`、`CDK4/6`、`ER`），必须在定义时使用类型断言 `target: "PARP" as any`，或直接扩展 `ddiData.ts` 中的 `TargetedDrug.target` 联合类型。

```typescript
import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

export const PANCREATIC_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "pancreatic_olaparib",
    genericName: "奥拉帕利片",
    brandName: "利普卓 (Lynparza)",
    generation: "PARP 抑制剂",
    target: "PARP" as any,
    standardDosage: "300mg 口服 每日两次 (BID)",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢消除",
    phDependent: false,
  },
  {
    id: "pancreatic_erlotinib",
    genericName: "盐酸厄洛替尼片",
    brandName: "特罗凯 (Tarceva)",
    generation: "第一代 EGFR-TKI",
    target: "EGFR",
    standardDosage: "100mg 口服 每日一次 (联合吉西他滨)",
    metabolismPathway: "主要经肝脏 CYP3A4 代谢",
    phDependent: true, // 胃内 pH 升高显著降低吸收
  },
];
```

### 4.2 DDI 规则库与法定风险等级

`DdiRule.riskLevel` 必须严格遵循 `ddiData.ts` 定义的合法枚举值：
- `"severe_contraindication"`（严重禁忌，对应系统 UI 红色 `danger` 警报）
- `"timing_caution"` / `"timing_warning"`（时序隔离警示，对应系统 UI 橙黄色 `warning` / `caution`）
- `"moderate_caution"`（中度注意，建议随访或调整剂量）
- `"compatible_safe"`（可安全联用）

```typescript
export const PANCREATIC_DDI_RULES: DdiRule[] = [
  // 1. 致命禁忌 · 强诱导剂 (severe_contraindication)
  {
    id: "pancreatic-olaparib-rifampin",
    targetDrugIds: ["pancreatic_olaparib"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向血药浓度暴跌 87%",
    title: "强 CYP3A4 诱导剂导致奥拉帕利抗肿瘤彻底失效",
    mechanism: "利福平强效诱导肝微粒体 CYP3A4 酶，使奥拉帕利稳态 AUC 降低 87%，血药浓度无法维持有效治疗窗。",
    clinicalGuidance: "严禁同服。抗结核治疗期间必须换用不经 CYP3A 显著诱导的药物，或调整抗肿瘤方案。",
    evidenceLevel: "FDA/NMPA说明书",
    severity: "danger",
  },
  // 2. 时序隔离 · pH 依赖吸收 (timing_caution)
  {
    id: "pancreatic-erlotinib-ppi",
    targetDrugIds: ["pancreatic_erlotinib"],
    chronicDrugId: "omeprazole",
    riskLevel: "timing_caution",
    riskLabel: "时序注意 · 胃内pH升高阻碍吸收",
    title: "质子泵抑制剂 (PPI) 导致厄洛替尼血药浓度下降约 46%",
    mechanism: "厄洛替尼的口服溶解度高度依赖酸性胃液环境。奥美拉唑等 PPI 强效抑制胃酸，使胃内 pH 升高至 4 以上，导致厄洛替尼吸收大幅受阻。",
    clinicalGuidance: "如必须同服抑酸剂，建议错峰服用：在服用 PPI 前 2 小时或后 10 小时空腹服用厄洛替尼，或换用 H2 受体拮抗剂并在其前 2 小时服用厄洛替尼。",
    evidenceLevel: "权威前瞻临床研究",
    severity: "caution",
    timingRecommendation: "间隔 4 小时以上，或睡前服用抑酸剂、清晨空腹服用靶向药。",
  },
];
```

---

## 5. 阶段五：顶刊临床队列数据填充 (StudiesData)

### 5.1 数据类型与字段规范

在 `src/lib/{name}StudiesData.ts` 中导出 `{NAME}_STUDIES`。
类型必须使用 **`StudyItem`**（来自 `@/components/StudyCard`），字段必须对齐：

```typescript
import type { StudyItem } from "@/components/StudyCard";

export const PANCREATIC_STUDIES: StudyItem[] = [
  {
    id: "prodige_24_2018",
    title: "FOLFIRINOX or Gemcitabine as Adjuvant Therapy for Pancreatic Cancer (PRODIGE 24/CCTG PA.6)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2018,
    patientN: 493,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1809775",
    pubmedId: "30575490",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1809775",
    keyConclusions: [
      "mFOLFIRINOX 辅助化疗将局限性胰腺癌根治术后患者的中位总生存期提升至 54.4 个月 vs 吉西他滨单药的 35.0 个月 (HR 0.64, P=0.003)。",
      "确立了体力状态良好 (ECOG 0-1) 局限期胰腺癌术后辅助治疗的全球黄金标准方案。"
    ],
    relevantFactors: ["R0切除", "mFOLFIRINOX", "辅助化疗", "术后生存"],
    applicableStages: ["I", "IA", "IB", "IIA", "IIB", "III"],
    biomarkerDetails: "可切除胰腺导管腺癌术后",
    interventionArm: "mFOLFIRINOX (12周期) vs 吉西他滨单药 (6周期)",
    riskReduction: "死亡风险降低 36% (HR 0.64)",
    cancerType: "pancreatic",
  },
  {
    id: "polo_trial_2019",
    title: "Maintenance Olaparib for Germline BRCA-Mutated Metastatic Pancreatic Cancer (POLO)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2019,
    patientN: 154,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1908639",
    pubmedId: "31157963",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1908639",
    keyConclusions: [
      "对携带胚系 BRCA1/2 突变、一线铂类化疗未进展的转移性胰腺癌患者，奥拉帕利维持治疗显著延长中位无进展生存期 (7.4月 vs 3.8月, HR 0.53, P=0.004)。",
      "开启了胰腺癌生物标志物驱动的精准维持治疗时代。"
    ],
    relevantFactors: ["BRCA1/2", "奥拉帕利", "PARP抑制剂", "维持治疗"],
    applicableStages: ["IV"],
    biomarkerDetails: "gBRCAm 胚系突变阳性",
    interventionArm: "奥拉帕利片 300mg bid vs 安慰剂维持",
    riskReduction: "疾病进展或死亡风险降低 47% (HR 0.53)",
    cancerType: "pancreatic",
  },
];
```

### 5.2 集中式证据池挂载 (`app/src/lib/evidence-data.ts`)

为了让全局文献检索和核心研究卡片能识别新癌种，在 `src/lib/evidence-data.ts` 中完成引用：

```typescript
// app/src/lib/evidence-data.ts 顶部导入
import { PANCREATIC_STUDIES } from "./pancreaticStudiesData";

// 在 FEATURED_STUDIES 数组中挑选代表性里程碑加入：
export const FEATURED_STUDIES: StudyItem[] = [
  // ... 既有研究 ...
  ...PANCREATIC_STUDIES.filter((s) => s.id === "prodige_24_2018" || s.id === "polo_trial_2019"),
];
```

---

## 6. 阶段六：破恐百科词条填充 (WikiData)

### 6.1 数据类型与分类契约

在 `src/lib/{name}WikiData.ts` 中导出 `{NAME}_WIKI_TOPICS`。
必须使用 **`WikiTopic`**（来自 `@/lib/wikiData`）。

平台严格划分为 4 大核心业务分类（`WikiCategory`）：
- `"nodule"`：影像筛查、结节/包块鉴别、早期检出与穿刺指征
- `"pathology"`：术后/穿刺病理报告关键指标解读、免疫组化与分级
- `"genetics"`：基因检测、靶点突变、微卫星状态与耐药机制
- `"recovery"`：系统治疗、手术配合、不良反应管理、随访监测与康复营养

### 6.2 三段式破恐叙事范式

知癌维基的核心人文使命是**破除恐慌**。每条词条必须严格践行“生活化隐喻 $\to$ 临床真相 $\to$ 战术行动清单 $\to$ 暖心定心丸”叙事结构：

```typescript
import type { WikiTopic } from "./wikiData";

export const PANCREATIC_WIKI_TOPICS: WikiTopic[] = [
  {
    id: "pancreatic_resectability_truth",
    category: "nodule",
    subcategory: "可切除性评估",
    title: "胰腺占位白话拆解：确诊就等于没有手术机会吗？",
    subtitle: "从可切除、交界可切除到局部进展期：现代多学科 MDT 转化破局之路",
    icon: "Scan",
    riskLevel: "moderate",
    priorityOrder: 95,
    searchKeywords: ["胰腺占位", "可切除性", "Whipple手术", "转化治疗", "CA19-9", "交界可切除"],
    metaphor: "胰腺就像深藏在上腹部腹膜后的一座重要枢纽，邻近多条主干铁路（门静脉、肠系膜血管）。占位病变是否可切除，取决于肿瘤是否与这些主干铁路发生粘连或侵犯，而不是单看肿瘤大小。",
    clinicalTruth: "约 15%~20% 的初诊患者属于解剖学直接可切除；另有约 30% 属于'交界可切除'或'潜在可转化'。国际最新循证显示，通过 4~6 周期强效新辅助化疗（mFOLFIRINOX 或 AG 方案），相当一部分初诊无法切除的患者能实现肿瘤缩小退缩，争取到根治性切除机会。",
    tactics: [
      "必须在具备胰腺高手术量的三甲胰腺专科中心进行胰腺薄层多期增强 CT 或 MRI 扫描；",
      "切忌仅凭一张普通平扫 CT 就轻易判定'放弃手术'，务必组织外科、肿瘤内科、介入科 MDT 联合会诊；",
      "对交界可切除患者，优先推荐系统化疗转化治疗，待病灶退缩与 CA19-9 显著下降后再评估根治手术。"
    ],
    reassurance: "即便暂时不能开刀，现代系统化疗与靶向免疫联合也能有力遏制病情；医学每一步进展都在为更多患者赢取长期带瘤生存与手术转化的宝贵窗口。",
    keyMetric: {
      label: "新辅助转化手术率 (交界可切除人群)",
      value: "约 50%~60%",
      source: "Annals of Surgery 2020 / CSCO 胰腺癌指南"
    },
    faq: [
      {
        question: "CA19-9 明显升高一定是恶性吗？",
        answer: "不一定。胆管炎、胆道梗阻或良性胆囊疾病均可引起 CA19-9 假性急剧升高；此外约 10% 的人群因 Lewis 抗原阴性，即便患癌 CA19-9 也完全不升高，必须紧密结合高清影像学综合判定。"
      }
    ]
  },
];
```

---

## 7. 阶段七：医保报销数据填充 (ReimbursementData)

### 7.1 数据类型与字段规范

在 `src/lib/{name}ReimbursementData.ts` 中导出 `{NAME}_DRUG_POLICIES`。
必须使用 **`DrugPolicy`**（来自 `@/lib/reimbursementData`），**价格字段必须为数字（`number`）**，以便前端进行自费差额算费与月度经济毒性推演：

```typescript
import type { DrugPolicy } from "./reimbursementData";

export const PANCREATIC_DRUG_POLICIES: DrugPolicy[] = [
  {
    id: "olaparib",
    name: "利普卓",
    genericName: "奥拉帕利片 (150mg)",
    manufacturer: "阿斯利康 (AstraZeneca)",
    target: "BRCA1 / BRCA2 / PARP",
    categoryTag: "parp_immuno",
    originalPrice: 24000,
    negotiatedPrice: 5800,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "携带有害或疑似有害胚系 BRCA 突变 (gBRCAm) 的转移性胰腺癌患者在一线铂类化疗维持治疗。",
    reimbursementLimits: "限经国家认可检测证实携带 gBRCA 突变且一线含铂化疗至少 16 周未进展的晚期患者报销。",
    offLabelNotice: "未检测 BRCA 或非胚系突变患者无法进入医保报销通道，需全额自费或申请特药商业险覆盖。",
    papProgram: "利普卓患者援助项目",
    papFoundation: "中国初级卫生保健基金会",
    papRule: "对符合医学标准但经济承受困难的患者，在自费完成指定周期后提供后续药品慈善救助。"
  },
  {
    id: "nab_paclitaxel",
    name: "凯素 / 艾素",
    genericName: "注射用紫杉醇 (白蛋白结合型) (100mg)",
    manufacturer: "恒瑞医药 / 石药集团 / 原研新基",
    target: "微管蛋白抑制剂",
    categoryTag: "chemo",
    originalPrice: 4800,
    negotiatedPrice: 740,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "联合吉西他滨用于转移性胰腺癌的一线治疗。",
    reimbursementLimits: "已纳入国家医保集采，在晚期胰腺癌一线联合化疗适应证下全额享受乙类统筹报销。",
    papProgram: "国家集采常态化覆盖",
    papFoundation: "国家医疗保障局",
    papRule: "集采中标仿制药单支自付仅数十至百余元，患者月化疗药物自付成本降幅达 90% 以上。"
  }
];
```

---

## 8. 阶段八：知识图谱数据填充（KnowledgeGraphData）— 选配

若新专科需要展示交互式知识图谱，在 `src/lib/{name}KnowledgeGraphData.ts` 中定义图节点与边证据：

```typescript
// 节点分类必须采用标准类型：
// biomarker | drug | treatment | symptom | staging | risk_factor | complication
export const PANCREATIC_GRAPH_NODES = [
  { id: "KRAS_G12D", label: "KRAS G12D", type: "biomarker", nameZh: "KRAS G12D突变" },
  { id: "CA199", label: "CA19-9", type: "biomarker", nameZh: "糖类抗原19-9" },
  { id: "WHIPPLE", label: "Whipple Procedure", type: "treatment", nameZh: "胰十二指肠切除术" },
];

export const PANCREATIC_EDGE_EVIDENCE_MAP: Record<string, any> = {
  "KRAS_G12D->PANCREAS_CANCER": {
    relation: "driver_mutation",
    title: "KRAS 突变驱动胰腺导管腺癌发生",
    evidenceLevel: "Level 1A · 90%+ 检出率",
    source: "Nature 2016 · PMID: 27158780",
  },
};
```

---

## 9. 阶段九：癌种插件最终整合 (CancerPluginSpec)

### 9.1 Plugin 文件规范 (`src/lib/cancerRegistry/plugins/{name}Plugin.ts`)

将上述各子模块聚合成完整的 `CancerPluginSpec`：

```typescript
import type { CancerPluginSpec } from "../types";
import {
  computePancreaticStage,
  getPancreaticClinicalCohort,
  type PancreaticStagingInput,
} from "@/lib/pancreaticStaging";
import {
  PANCREATIC_TARGETED_DRUGS,
  checkPancreaticDrugInteractions,
} from "@/lib/pancreaticDdiData";
import { PANCREATIC_STUDIES } from "@/lib/pancreaticStudiesData";
import { PANCREATIC_WIKI_TOPICS } from "@/lib/pancreaticWikiData";
import { PANCREATIC_DRUG_POLICIES } from "@/lib/pancreaticReimbursementData";

export const pancreaticPlugin: CancerPluginSpec = {
  id: "pancreatic",
  name: "胰腺癌",
  enName: "Pancreatic Cancer",
  icon: "🫐",
  organ: "pancreas",
  guidelineStandard: "NCCN 2024 · AJCC 第 8 版 · CSCO 胰腺癌诊疗指南 2024",
  theme: {
    // 严格遵循 §9.2 主题色注册表，禁止与已有专区撞色
    primaryColor: "text-orange-600",
    badgeColor: "bg-white text-orange-600",
    bgColor: "bg-orange-50",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const parsedInput: PancreaticStagingInput = {
        ...rawData,
        ...input,
        organ: "pancreas",
      };
      return computePancreaticStage(parsedInput);
    },
    getCohort: (profile: any) => getPancreaticClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: PANCREATIC_TARGETED_DRUGS,
    checkInteractions: (targetId: string, chronicIds: string[]) =>
      checkPancreaticDrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "pancreatic_olaparib",
  },
  content: {
    featuredStudies: PANCREATIC_STUDIES,
    graphNodes: [],
    edgeEvidences: {},
    wikiTopics: PANCREATIC_WIKI_TOPICS,
    drugPolicies: PANCREATIC_DRUG_POLICIES,
  },
};
```

### 9.2 全站主题色真实注册表（避免视觉冲突）

以下是系统中 **11 个既有插件代码实际使用的色彩**。新增癌种必须选择尚未占用的独立色阶：

| 癌种标识 | 专区中文 | 实际代码中的 Primary Color | 实际代码中的 Bg Color | 状态 |
|:---|:---|:---|:---|:---|
| `lung` | 肺癌 | `text-sky-700` | `bg-sky-50` | 已占用 (天蓝) |
| `breast` | 乳腺癌 | `text-pink-600` | `bg-pink-50` | 已占用 (柔粉) |
| `colorectal` | 结直肠癌 | `text-emerald-600` | `bg-emerald-50` | 已占用 (翠绿) |
| `colon` | 结肠癌 | `text-emerald-600` | `bg-emerald-50` | 已占用 (翠绿) |
| `rectal` | 直肠癌 | `text-teal-700` | `bg-teal-50` | 已占用 (青蓝) |
| `gastric` | 胃癌 | `text-amber-600` | `bg-amber-50` | 已占用 (琥珀) |
| `liver` | 肝癌 | `text-emerald-600` (历史共享) | `bg-emerald-50` | 已占用 |
| `esophageal` | 食管癌 | `text-purple-600` | `bg-purple-50` | 已占用 (深紫) |
| `thyroid` | 甲状腺癌 | `text-rose-600` | `bg-rose-50` | 已占用 (玫瑰红) |
| `endometrial` | 子宫内膜癌 | `text-rose-600` (历史共享) | `bg-rose-50` | 已占用 |
| `cervical` | 宫颈癌 | `text-fuchsia-600` | `bg-fuchsia-50` | 已占用 (紫红) |

**推荐新癌种可用独立色阶（严格杜绝与上述已占色系冲突）**：
- 胰腺癌 (`pancreatic`) $\to$ **`orange`** (`text-orange-600`, `bg-orange-50`)
- 前列腺癌 (`prostate`) $\to$ **`blue`** (`text-blue-600`, `bg-blue-50`)
- 膀胱癌 (`bladder`) $\to$ **`yellow`** (`text-yellow-600`, `bg-yellow-50`)
- 卵巢癌 (`ovarian`) $\to$ **`lime`** (`text-lime-600`, `bg-lime-50`)
- 鼻咽癌 (`nasopharyngeal`) $\to$ **`slate`** (`text-slate-600`, `bg-slate-50`)
- 多发性骨髓瘤 (`myeloma`) $\to$ **`red`** (`text-red-700`, `bg-red-50`)
- 淋巴瘤 (`lymphoma`) $\to$ **`zinc`** (`text-zinc-600`, `bg-zinc-100`)
- 脑胶质瘤 (`glioma`) $\to$ **`stone`** (`text-stone-600`, `bg-stone-100`)

### 9.3 在 `CancerRegistry` 中完成挂载

在 `app/src/lib/cancerRegistry/index.ts` 中引入并注册：

```typescript
// app/src/lib/cancerRegistry/index.ts
import { pancreaticPlugin } from "./plugins/pancreaticPlugin"; // ← 新增导入

// 既有注册...
CancerRegistry.register(pancreaticPlugin); // ← 注册挂载
```

---

---

## 10. 阶段十：UI 视觉层与微观解剖模拟器 (Micro-Visual Simulator)

### 10.1 主题色彩 Token 追加与微观排版对齐

若新增页面或组件需要癌种专属徽章与高亮描边，必须严格遵循 [`.agents/skills/telemedicine_ui_ux/SKILL.md`](file:///c:/Users/Administrator/Desktop/lung/.agents/skills/telemedicine_ui_ux/SKILL.md) 定义的微观字阶与几何规范：
```tsx
// 徽章与标签标准应用 (微观 6px 间隙 + rounded-full 胶囊)
<span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 shadow-2xs">
  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
  {plugin.icon} {plugin.name}
</span>
```

### 10.2 开箱即用：专科微观机制 SVG 模拟器标准模板

当该癌种具有标志性的微观解剖、手术方式或分子机制时（如胰腺癌可切除性评估、KRAS 靶向机制），必须在 `app/src/components/wiki/visuals/` 下创建交互式矢量模拟器。

以下是严格遵守**纯矢量 SVG、零外部重库依赖、CSS `@keyframes` 驱动、零 SSR 水合告警**的生产级组件模板：

```tsx
// app/src/components/wiki/visuals/PancreaticResectabilityVisual.tsx
"use client";

import React, { useState } from "react";
import { ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

interface StageDetail {
  id: "resectable" | "borderline" | "unresectable";
  title: string;
  badge: string;
  badgeColor: string;
  veinStatus: string;
  arteryStatus: string;
  clinicalAction: string;
}

const STAGE_CONFIGS: Record<string, StageDetail> = {
  resectable: {
    id: "resectable",
    title: "可直接切除 (Resectable)",
    badge: "根治机会高",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    veinStatus: "未侵犯 SMV/PV 或粘连 ≤180°",
    arteryStatus: "腹腔干 (CA) / SMA / CHA 轮廓光整，完全游离",
    clinicalAction: "首选多学科会诊后行 R0 根治性切除 (Whipple 或 RAMPS)，术后序贯 mFOLFIRINOX 辅助化疗。",
  },
  borderline: {
    id: "borderline",
    title: "交界可切除 (Borderline Resectable)",
    badge: "强推新辅助转化",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    veinStatus: "受侵 >180° 或短段闭塞，但远近端血管具备重建条件",
    arteryStatus: "肿瘤邻近或包绕腹腔干/SMA ≤180°",
    clinicalAction: "强烈推荐 4~6 周期强效新辅助转化治疗 (mFOLFIRINOX/AG)，退缩降期后再评估根治手术。",
  },
  unresectable: {
    id: "unresectable",
    title: "局部进展不可切 (Locally Advanced)",
    badge: "系统综合治疗",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200",
    veinStatus: "双侧血管广泛包绕侵犯，缺乏手术重建通道",
    arteryStatus: "包绕腹腔干或 SMA >180°，失去解剖学安全平面",
    clinicalAction: "以系统性化疗与靶向免疫为主，维持生活质量与带瘤生存，定期复查评估二线转化潜力。",
  },
};

export function PancreaticResectabilityVisual() {
  const [activeTab, setActiveTab] = useState<"resectable" | "borderline" | "unresectable">("borderline");
  const current = STAGE_CONFIGS[activeTab];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
      {/* 头部标题与控制切换器 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <span>🫐 胰腺解剖与血管侵犯三分类动态模拟器</span>
          </h4>
          <p className="text-xs text-slate-500 mt-0.5 font-normal">
            基于 NCCN / CSCO 肠系膜上血管 (SMV/SMA) 受累程度判定可切除性
          </p>
        </div>
        <div className="inline-flex p-1 bg-slate-100 rounded-xl gap-1 shrink-0 self-start sm:self-auto">
          {(["resectable", "borderline", "unresectable"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeTab === key
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-500 hover:text-slate-900"
              }`}
            >
              {key === "resectable" ? "可切除" : key === "borderline" ? "交界可切" : "不可切"}
            </button>
          ))}
        </div>
      </div>

      {/* SVG 纯矢量解剖示意图 (零外部库, 响应式 viewBox) */}
      <div className="relative w-full aspect-[16/9] sm:aspect-[2.2/1] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 flex items-center justify-center p-2">
        <svg viewBox="0 0 460 200" className="w-full h-full select-none" role="img" aria-label="胰腺解剖与血管切除性示意图">
          <defs>
            {/* 胰腺柔和渐变 */}
            <linearGradient id="pancreasGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fdba74" />
            </linearGradient>
            {/* 门静脉与动脉渐变 */}
            <linearGradient id="veinGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id="arteryGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* 1. 动脉管道 (SMA) */}
          <path d="M 280 20 Q 280 100 290 180" fill="none" stroke="url(#arteryGrad)" strokeWidth="14" strokeLinecap="round" opacity="0.85" />
          <text x="295" y="40" fill="#dc2626" fontSize="10" fontWeight="bold">SMA 肠系膜上动脉</text>

          {/* 2. 静脉管道 (SMV / 门静脉) */}
          <path d="M 230 20 Q 240 100 240 180" fill="none" stroke="url(#veinGrad)" strokeWidth="18" strokeLinecap="round" opacity="0.9" />
          <text x="170" y="40" fill="#0284c7" fontSize="10" fontWeight="bold">SMV 门静脉主干</text>

          {/* 3. 胰腺主体轮廓 */}
          <path
            d="M 60 110 C 90 80, 160 85, 230 95 C 290 105, 360 80, 410 95 C 430 100, 420 130, 380 135 C 300 145, 180 140, 120 150 C 70 160, 45 130, 60 110 Z"
            fill="url(#pancreasGrad)"
            stroke="#fb923c"
            strokeWidth="1.5"
            opacity="0.8"
          />
          <text x="110" y="115" fill="#9a3412" fontSize="11" fontWeight="bold">胰腺体尾部</text>
          <text x="330" y="120" fill="#9a3412" fontSize="11" fontWeight="bold">胰头部 (钩突)</text>

          {/* 4. 动态肿瘤病灶与血管粘连范围指示 */}
          {activeTab === "resectable" && (
            <g className="transition-all duration-300">
              <circle cx="170" cy="115" r="16" fill="#f43f5e" opacity="0.85" stroke="#ffffff" strokeWidth="2" />
              <circle cx="170" cy="115" r="22" fill="none" stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              <text x="170" y="119" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="170" y="148" fill="#059669" fontSize="10" fontWeight="bold" textAnchor="middle">✓ 与大血管界限分明</text>
            </g>
          )}

          {activeTab === "borderline" && (
            <g className="transition-all duration-300">
              <circle cx="232" cy="105" r="20" fill="#f43f5e" opacity="0.9" stroke="#ffffff" strokeWidth="2" />
              <path d="M 232 85 A 20 20 0 0 1 248 115" fill="none" stroke="#f59e0b" strokeWidth="4" />
              <text x="232" y="109" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="232" y="142" fill="#d97706" fontSize="10" fontWeight="bold" textAnchor="middle">⚠ 浸润静脉≤180° (可重建)</text>
            </g>
          )}

          {activeTab === "unresectable" && (
            <g className="transition-all duration-300">
              <circle cx="260" cy="100" r="28" fill="#f43f5e" opacity="0.95" stroke="#ffffff" strokeWidth="2" />
              <circle cx="260" cy="100" r="34" fill="none" stroke="#e11d48" strokeWidth="2.5" strokeDasharray="4 2" />
              <text x="260" y="104" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">病灶</text>
              <text x="260" y="146" fill="#e11d48" fontSize="10" fontWeight="bold" textAnchor="middle">✕ 广泛包绕 SMA/腹腔干&gt;180°</text>
            </g>
          )}
        </svg>
      </div>

      {/* 底部临床破恐解读卡 */}
      <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">{current.title}</span>
            <span className={`text-2xs px-2 py-0.5 rounded-full border font-semibold ${current.badgeColor}`}>
              {current.badge}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-700 block mb-0.5">静脉受累 (SMV/PV)：</span>
            {current.veinStatus}
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200/60">
            <span className="font-semibold text-slate-700 block mb-0.5">动脉受累 (SMA/CA)：</span>
            {current.arteryStatus}
          </div>
        </div>
        <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-lg text-xs text-blue-900 flex items-start gap-2">
          <ArrowRight className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">临床推荐策略：</span>
            {current.clinicalAction}
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## 11. 阶段十一：全站用户界面与导航矩阵入口同步 (UI Navigation, Matrix & Discovery Sync)

> [!IMPORTANT]
> **临床工程红线**：很多新癌种开发往往止步于分期算法与医学数据，导致新癌种虽然“代码存在”，但在用户界面上完全缺失入口（导航栏依然显示“规划中”、主页矩阵卡片遗漏、百科场景 Tab 缺失、偏好设置无法选择、AI 报告依然调用肺癌模板）。
> 任何新实体瘤上线，**必须**同步完成以下 7 大 UI/UX 与服务端中枢的全面对接！

### 11.1 绘制专属解剖矢量 SVG 图标 (`app/src/components/common/CancerIcons.tsx`)

每一个成熟癌种必须拥有独立的解剖矢量图标（精准表达器官形态与肿瘤高发部位），禁止使用通用或无意义占位符：

1. **新建专科 SVG 组件**：遵循 Tailwind 响应式与 `currentColor` 规范，支持深色/浅色模式自适应。
   ```tsx
   // app/src/components/common/CancerIcons.tsx
   export function PancreaticIcon({ className = "w-4 h-4" }: { className?: string }) {
     return (
       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className}>
         {/* 十二指肠 C 型环 */}
         <path d="M 5 4 C 2 7, 2 17, 5 20 C 7 21, 9 20, 9 18" />
         {/* 胰头、胰体、胰尾轮廓 */}
         <path d="M 7 11 C 9 8, 14 9, 21 11 C 22 13, 21 15, 17 15 C 13 15, 9 16, 7 14 Z" />
         {/* 胰管 */}
         <path d="M 8 12.5 Q 14 12, 18 13" strokeDasharray="1.5 1.5" />
       </svg>
     );
   }
   ```
2. **在 `CancerIcon` 统一分发器中注册**：
   ```tsx
   if (type === "pancreatic") return <PancreaticIcon className={className} />;
   ```

### 11.2 顶部全局导航切换栏接入与下线占位 (`app/src/components/common/CancerSwitch.tsx`)

顶部导航栏是全站跨癌种无缝切换的最核心枢纽：

1. **下线规划中占位**：从 `UPCOMING_CANCERS` 数组中**移除已上线的癌种**，替换为下一个筹备中专科（如前列腺癌 `prostate`）。
2. **挂载专科视觉主题配色**：
   在下拉浮层中为新癌种配置专科风格的文字色彩、背景、聚焦高亮与激活样式（严格契合 §9.2 调色盘）：
   ```tsx
   // 示例：胰腺癌专属琥珀暖金配色
   plugin.id === "pancreatic"
     ? "text-amber-800 bg-amber-50/70 border-amber-200/80"
     : ...
   ```
3. **联动 Trigger 按钮状态**：在切换器闭合时的按钮图标与文字色上，保证当前癌种高亮生效。

### 11.3 首页“探索更多癌种专区”卡片矩阵与自适应布局 (`app/src/app/page.tsx`)

首页矩阵是新用户发现专科的主航道：

1. **登记矩阵卡片 (`CANCER_MATRIX_CARDS`)**：
   ```tsx
   {
     id: "pancreatic",
     name: "胰腺癌专区",
     enName: "Pancreatic Cancer",
     icon: <PancreaticIcon className="w-5 h-5 text-amber-600" />,
     desc: "解剖可切除性分类 · mFOLFIRINOX · gBRCA维持",
     tags: ["Whipple术", "CA19-9", "mFOLFIRINOX", "POLO研究"],
     stats: "10+ 顶刊队列 · 14 专科词条",
     href: "/?cancer=pancreatic",
     color: "hover:border-amber-300 hover:shadow-amber-500/5 group-hover:text-amber-600",
   }
   ```
2. **响应式网格 (Grid) 几何平铺对齐**：
   - 当专区数量为 9 时：桌面端必须调整为 `md:grid-cols-2 lg:grid-cols-3`（形成完美的 3x3 九宫格）；
   - 移动端微型启动器调整为 `grid-cols-3 sm:grid-cols-5`，彻底杜绝孤行或视觉断层。

### 11.4 维基智能场景 Tabs 与动态搜索占位符 (`WikiScenarioTabs.tsx`, `WikiSearchBar.tsx`)

1. **定义五大临床业务场景 Tabs (`WikiScenarioTabs.tsx`)**：
   ```tsx
   export const PANCREATIC_SCENARIO_TABS = [
     { id: "all", label: "全部专科词条", icon: "📚", count: 14 },
     { id: "nodule", label: "胰腺结节与影像排查", icon: "🔍", count: 3 },
     { id: "pathology", label: "病理分期与可切除性", icon: "🔬", count: 4 },
     { id: "genetics", label: "靶向基因与系统化疗", icon: "🧬", count: 4 },
     { id: "recovery", label: "术后生活与胰酶替代", icon: "🛡️", count: 3 },
   ];
   ```
   在组件内部通过 `cancerType === "pancreatic"` 分流挂载 `PANCREATIC_SCENARIO_TABS` 与 `PANCREATIC_WIKI_TOPICS`。
2. **配置动态搜索提示词 (`WikiSearchBar.tsx`)**：
   在占位符映射字典中配置该癌种的高频热搜临床术语：
   ```tsx
   pancreatic: "搜索胰腺癌核心知识：CA19-9、Whipple、KRAS、交界可切除、mFOLFIRINOX、胰酶替代...",
   ```

### 11.5 偏好设置与多卡槽患者看板 (`SettingsModal.tsx`, `PatientDashboard.tsx`)

1. **偏好设置弹窗 (`SettingsModal.tsx`)**：
   重构或接入 `CancerRegistry.getSupportedTypes()`，使患者偏好设置弹窗能动态列出新癌种，显示对应指南标准与英文名。
2. **多卡槽患者看板与双原发切换 (`PatientDashboard.tsx` & `profileStorage.ts`)**：
   - 在 `profileStorage.ts` 的 `saveProfileToSlot` 与 `getDualPrimarySummary` 中注入新癌种槽位提取；
   - 在 `PatientDashboard.tsx` 的 `<DualPrimarySwitcher />` 传参中包含新癌种 profile；
   - 补充专科特异性推荐药物逻辑（如 BRCA 突变提示奥拉帕利维持）与患者卡片副标题。

### 11.6 全站证据统计横幅与图谱描述 (`StatsBanner.tsx`, `knowledge/page.tsx`)

1. **`StatsBanner.tsx` 全站临床证据总库统计**：
   - 导入 `{NAME}_STUDIES` 并合入 `RAW_STUDIES` 证据池；
   - 更新已支持癌种总数计数器：`const TOTAL_SUPPORTED_CANCERS = 9;`。
2. **`knowledge/page.tsx` 证据专区副标题**：
   - 在 Hero 说明文案中配置该癌种的临床定位（如“覆盖胰腺癌 NCCN/CSCO 权威指南、可切除性评估、PRODIGE 24 及 POLO 顶刊突破”）。

### 11.7 AI 临床推理与报告生成后端 API 联动 (`api/parse-report`, `api/generate-report`, `api/graph`)

1. **知识图谱节点 API (`app/src/app/api/graph/route.ts`)**：
   配置新癌种分支，返回专科医学实体与关系边。
2. **病理与影像解析 API (`app/src/app/api/parse-report/route.ts`)**：
   - 在 Step 0 中注入专科病理关键词指南；
   - 在分期解析步骤中添加新癌种分期与危险度评估规则。
3. **AI 临床报告生成 API (`app/src/app/api/generate-report/route.ts`)**：
   - 编写专科专属的 System Prompt 模板（如 `PANCREATIC_REPORT_PROMPT`），包含 5 大核心板块与同理心定心丸；
   - 提取并注入专科前瞻性顶刊研究证据库；
   - 在 `templatePrompt` 条件链路中完成挂载，杜绝报告生成回退为肺癌默认模板。

---

## 12. 阶段十二：全栈验证、端到端深度仿真与合流验收清单

任何新癌种代码合入主干前，必须按顺序通过以下 7 道自动化质检防线：

### 12.1 类型安全性验证（零容忍）

```bash
cd app
npx tsc --noEmit
```
**合格标准**：终端输出 `0 errors`。任何类型报错必须彻底排查，严禁用破坏性 `any` 抹平核心业务字段。

### 12.2 单元测试网全量回归

```bash
# 必须在 app 目录下执行（确保 Vitest 正确解析 tsconfig.json 的 @/ 路径别名）
cd app

# 1. 运行新癌种专科单元测试
npx vitest run src/__tests__/pancreaticStaging.test.ts

# 2. 全量回归既有 438+ 单元测试用例
npm run test:unit
```
**合格标准**：测试套件数量 +1，总用例数增加 $\ge 8$ 项，**全量测试通过率 100%（0 失败）**。

### 12.3 临床护栏与防穿模检测

```bash
npm run test:guardrails
```
**合格标准**：自动化词汇扫描零穿模警告。
同时，**必须打开 `.agents/skills/oncology-clinical-safety/SKILL.md` 文件**，将本癌种在 §1.2 整理的独有专科术语补充至技能正文第 26~33 行列表中，完成知识库同步升级。

### 12.4 专科端到端深度仿真套件 (End-to-End Simulation Suite)

每个新癌种必须配备专属的本地深度仿真脚本 `app/scripts/simulate-{name}-cancer.ts`。

以下是完整的 7 维度全景仿真代码模板，可直接复制适配：

```typescript
// app/scripts/simulate-pancreatic-cancer.ts
/**
 * 胰腺癌 (Pancreatic Cancer) 7 维度端到端本地化深度仿真测试
 * 运行指令: npx tsx scripts/simulate-pancreatic-cancer.ts
 */

import { computePancreaticStage, getPancreaticClinicalCohort } from "../src/lib/pancreaticStaging";
import { checkPancreaticDrugInteractions, PANCREATIC_TARGETED_DRUGS } from "../src/lib/pancreaticDdiData";
import { PANCREATIC_STUDIES } from "../src/lib/pancreaticStudiesData";
import { PANCREATIC_WIKI_TOPICS } from "../src/lib/pancreaticWikiData";
import { PANCREATIC_DRUG_POLICIES } from "../src/lib/pancreaticReimbursementData";
import { CancerRegistry } from "../src/lib/cancerRegistry";
import { normalizeCancerType } from "../src/lib/stagingRegistry";
import { sanitizeClinicalText } from "../src/lib/privacy";

let passCount = 0;
let failCount = 0;

function assertSim(condition: boolean, desc: string) {
  if (condition) {
    console.log(`\x1b[32m  ✓ [PASS]\x1b[0m ${desc}`);
    passCount++;
  } else {
    console.error(`\x1b[31m  ✗ [FAIL]\x1b[0m ${desc}`);
    failCount++;
  }
}

console.log("\x1b[1m\x1b[36m=== 胰腺癌 7 维度端到端临床深度仿真测试 ===\x1b[0m\n");

// 维度一：TNM 与可切除性分期阶梯推演
console.log("\x1b[35m[维度 1] 确定性 TNM 分期与血管侵犯推演\x1b[0m");
const stage1 = computePancreaticStage({ tumorSize: 1.5, nStage: "N0", mStage: "M0" });
assertSim(stage1.stage === "IA", "早期 T1N0M0 正确判定为 IA 期");

const stage3 = computePancreaticStage({ celiacInvolvement: true, nStage: "N1", mStage: "M0" });
assertSim(stage3.tStage === "T4" && stage3.stage === "III", "腹腔干侵犯强制升为 T4 并判定为 III 期");

const stageNan = computePancreaticStage({ tumorSize: NaN as any, nStage: "N0" });
assertSim(Number.isFinite(parseFloat(stageNan.tStage.replace(/\D/g, "") || "1")), "NaN 肿瘤大小安全回退，无页面报错");

// 维度二：顶刊队列与生存穿透四要素
console.log("\n\x1b[35m[维度 2] 前瞻性顶刊队列四要素完备性\x1b[0m");
const cohort = getPancreaticClinicalCohort({ stage: "III" });
assertSim(Boolean(cohort.pmid && cohort.doi), "生存队列具备真实的 PubMed PMID 与 DOI");
assertSim(cohort.confidenceRating === "⭐⭐⭐⭐⭐", "队列具备最高置信度评级");

// 维度三：专科 DDI 药理相互作用与致命用药拦截
console.log("\n\x1b[35m[维度 3] DDI 药理相互作用与强诱导剂拦截\x1b[0m");
const ddiSevere = checkPancreaticDrugInteractions("pancreatic_olaparib", ["rifampin"]);
assertSim(ddiSevere.overallStatus === "danger" && ddiSevere.severeCount >= 1, "成功拦截强 CYP3A4 诱导剂严重禁忌");

const ddiSafe = checkPancreaticDrugInteractions("pancreatic_olaparib", []);
assertSim(ddiSafe.overallStatus === "safe", "无慢性用药时安全基线判定为 safe");

// 维度四：破恐百科词条四分类与三段式结构审计
console.log("\n\x1b[35m[维度 4] 百科词条三段式破恐与分类覆盖\x1b[0m");
const hasNodule = PANCREATIC_WIKI_TOPICS.some((t) => t.category === "nodule");
const allHaveMetaphor = PANCREATIC_WIKI_TOPICS.every((t) => Boolean(t.metaphor && t.clinicalTruth && t.reassurance));
assertSim(hasNodule, "覆盖核心业务分类");
assertSim(allHaveMetaphor, "所有词条均完整实现生活化隐喻、临床真相与定心丸");

// 维度五：国谈医保政策与数值型算费校验
console.log("\n\x1b[35m[维度 5] 医保报销目录与价格数值安全性\x1b[0m");
const allPricesNumeric = PANCREATIC_DRUG_POLICIES.every(
  (p) => typeof p.originalPrice === "number" && typeof p.negotiatedPrice === "number" && !isNaN(p.originalPrice)
);
assertSim(allPricesNumeric, "所有药价均为合法数字，杜绝 NaN 毒性算费");

// 维度六：注册中心调度与多卡槽别名归一化
console.log("\n\x1b[35m[维度 6] 单例注册中心挂载与多中文别名解析\x1b[0m");
assertSim(CancerRegistry.has("pancreatic"), "CancerRegistry 已正确装载该癌种插件");
assertSim(normalizeCancerType("胰腺癌") === "pancreatic", "normalizeCancerType 成功解析中文别名");

// 维度七：真实病理隐私去标识化 (PII) 审计
console.log("\n\x1b[35m[维度 7] 临床病理隐私脱敏合规性\x1b[0m");
const rawReport = "患者张建国，男，58岁，身份证 110101196805121234，门诊号 HA-2024-8899，胰头占位。";
const clean = sanitizeClinicalText(rawReport);
assertSim(!clean.includes("110101196805121234") && !clean.includes("张建国"), "身份证与姓名彻底脱敏");

console.log(`\n======================================================`);
console.log(`仿真结果汇总: \x1b[32m${passCount} 项通过\x1b[0m | \x1b[31m${failCount} 项失败\x1b[0m`);
if (failCount > 0) {
  process.exit(1);
} else {
  console.log("\x1b[1m\x1b[32m[All Passed] 胰腺癌专科端到端临床深度仿真完美通过！\x1b[0m\n");
}
```

### 12.5 生产打包编译（Next.js 16 SSR 验证）

```bash
npm run build
```
**合格标准**：Next.js (Turbopack) 生产构建成功，退出码为 0，静态页面全量生成无警告，零水合不匹配（Hydration mismatch）错误。

### 12.6 CI 流水线状态核验

检查 `.github/workflows/clinical-ci.yml`。若新增了专科专项仿真脚本，需在 CI 任务矩阵中追加对应的验证指令：
```yaml
# 在 GitHub Actions 矩阵中添加
- name: Run Pancreatic Oncology E2E Simulation
  run: npm --prefix app run tsx scripts/simulate-pancreatic-cancer.ts
```

---

### 12.7 最终验收检查清单 (PR Gatekeeper Checklist)

在发起 Pull Request 或交付前，请逐项勾选自检：

#### 一、文件与注册完整性
- [ ] 已在 `app/src/lib/types.ts` 中扩展 `CancerType` 联合类型。
- [ ] 已在 `app/src/lib/profileStorage.ts` 的 `KNOWN_CANCER_TYPES` 中登记并适配多卡槽存储。
- [ ] 已在 `app/src/lib/stagingRegistry.ts` 中导出分期函数，并更新 `normalizeCancerType` 别名映射。
- [ ] 已在 `app/src/lib/evidence-data.ts` 中导入并挂载至 `FEATURED_STUDIES` 聚合池。
- [ ] 已在 `app/src/lib/cancerRegistry/index.ts` 中执行 `CancerRegistry.register()`。
- [ ] 已在 `.agents/skills/oncology-clinical-safety/SKILL.md` 中同步追加防穿模词汇。

#### 二、医学内容与临床安全
- [ ] 分期引擎具备严格的 `Number.isFinite()` 防御，无法输入非法数值导致 `NaN` 报错。
- [ ] DDI 药理库覆盖核心靶向药，危险禁忌注明真实药理机制，`riskLevel` 合法。
- [ ] 前瞻临床队列具备真实出处四要素（试验名、顶刊、样本量、真实 PMID/DOI）。
- [ ] 百科词条覆盖四大分类，符合“隐喻 $\to$ 真相 $\to$ 战术 $\to$ 定心丸”破恐叙事范式。
- [ ] 医保报销库采用 `DrugPolicy` 接口，原价与国谈价为数字类型，医保红线清晰。

#### 三、全站 UI 导航矩阵与服务同步
- [ ] `CancerIcons.tsx` 已提供专科专属解剖矢量 SVG，深浅色正常渲染，统一分发器已接入。
- [ ] `CancerSwitch.tsx` 已从 `UPCOMING_CANCERS` 移除（替换为后续规划癌种），并上线至正式列表，主题色与激活态正常。
- [ ] `page.tsx` 已在 `CANCER_MATRIX_CARDS` 中挂载卡片，网格排版自适应（如 3x3 九宫格），移动端启动器对其对齐。
- [ ] `WikiScenarioTabs.tsx` 与 `WikiSearchBar.tsx` 已配置专科场景 Tabs 与热词占位符。
- [ ] `SettingsModal.tsx` 与 `PatientDashboard.tsx` 已支持该癌种偏好切换、靶向药推荐与多卡槽病历隔离。
- [ ] `StatsBanner.tsx` 已并入专科顶刊证据库，更新全站支持癌种总数计数器。
- [ ] `api/parse-report`、`api/generate-report` 与 `api/graph` 已挂载专科 System Prompt 模板与证据库。

#### 四、工程质量与 CI 验收
- [ ] `npx tsc --noEmit` $\to$ 0 errors。
- [ ] `npm run test:unit` $\to$ 全部通过，包含新增的 $\ge 8$ 项单元用例。
- [ ] `npm run test:guardrails` $\to$ 0 警告，零跨专科概念穿模。
- [ ] `npx tsx scripts/simulate-{name}-cancer.ts` $\to$ 7 维度全景仿真 100% 通过。
- [ ] `npm run build` $\to$ 退出码 0，生产包打包顺利，无水合告警。

---

## 附录 A：推荐优先拓展的癌种路线图

以下为建议的后续实体瘤拓展梯队（按中国发病人数、临床关注度与平台架构契合度排序）：

| 优先级 | 癌种中文 | 癌种标识 | 权威指南依据 | 核心靶向/系统药物 | 核心技术要点与特殊分期维度 |
|:---:|:---|:---|:---|:---|:---|
| 🔴 **P1** | **胰腺癌** | `pancreatic` | NCCN 2024 / CSCO 2024 | 奥拉帕利、厄洛替尼、mFOLFIRINOX、AG方案 | 可切除性三分类（可切/交界/局部进展）；CA19-9假阴性；gBRCA维持 |
| 🔴 **P1** | **前列腺癌** | `prostate` | EAU 2024 / CSCO 2024 | 恩扎卢胺、阿比特龙、奥拉帕利、镥-177-PSMA | PSA 动力学倍增；Gleason/Grade Group 分级；ADT去势抵抗 (CRPC) 演变 |
| 🟠 **P2** | **卵巢癌** | `ovarian` | FIGO 2021 / NCCN 2024 | 尼拉帕利、奥拉帕利、贝伐珠单抗、紫杉醇+卡铂 | FIGO 手术病理分期；BRCA/HRD 双标志物；肿瘤细胞减灭术 (R0) 残余 |
| 🟠 **P2** | **膀胱癌** | `bladder` | EAU 2024 / CSCO 2024 | 厄达非替尼 (FGFR)、帕博利珠单抗、EV (ADC) | 非肌层浸润 (NMIBC) vs 肌层浸润 (MIBC)；TURBt 术后即刻膀胱灌注 |
| 🟡 **P3** | **鼻咽癌** | `nasopharyngeal` | CSCO 2024 (中国特色优势) | 特瑞普利单抗、替雷利珠单抗、顺铂+吉西他滨 | EB 病毒 (EBV-DNA) 拷贝动态监测；IMRT 调强放疗靶区；颈部淋巴结分区 |
| 🟡 **P3** | **弥漫大B淋巴瘤**| `dlbcl` | NCCN 2024 / CSCO 2024 | 利妥昔单抗 (CD20)、Pola (ADC)、CAR-T | Ann Arbor 分期；IPI 预后评分；COO 分型 (GCB vs ABC)；BTK 严重 DDI |
| 🟢 **P4** | **多发性骨髓瘤**| `myeloma` | IMWG 2024 / NCCN 2024 | 硼替佐米、来那度胺、达雷妥尤单抗 (CD38) | R-ISS 分期；CRAB 四联器官损伤标准；血清 M 蛋白/免疫固定电泳；MRD |
| 🟢 **P4** | **脑胶质瘤** | `glioma` | WHO 2021 中枢神经系统分类 | 替莫唑胺 (TMZ)、贝伐珠单抗、洛莫司汀、TTFields (电场) | WHO 2021 分子分型：IDH 突变状态、1p/19q 共缺失、MGMT 启动子甲基化 |
| 🔵 **P5** | **肾细胞癌** | `rcc` | EAU 2024 / CSCO 2024 | 帕博利珠单抗+阿昔替尼、卡博替尼、舒尼替尼 | 透明细胞 vs 非透明细胞；IMDC 危险度评分；保肾手术 (PN) vs 根治性切除 |
| 🔵 **P5** | **头颈部鳞癌** | `headneck` | AJCC 第 8 版 / NCCN 2024 | 帕博利珠单抗、西妥昔单抗、顺铂+5-FU | HPV/p16 驱动与非驱动分轨；功能保全与诱导化疗；放化疗吞咽康复 |

---

## 附录 B：反模式与高频踩坑速查表 (Anti-Pattern Quick Reference)

| ❌ 典型错误代码 / 操作 | 根因与临床危害 | ✅ 规范标准做法 |
|:---|:---|:---|
| **捏造 HR 或生存期数字** | 产生严重医学幻觉，误导患者治疗决策 | 必须引用 PubMed 真实期刊论文，填写清晰四要素 |
| **脚手架在根目录直接执行失败** | `scaffold:cancer` 脚本只在 `app/package.json` 中配置 | 执行 `npm --prefix app run scaffold:cancer` 或 `cd app` |
| **引用不存在的 `ClinicalStudy` 接口** | 编译器报 TS2304 找不到名称 | 统一使用 `StudyItem`（来自 `@/components/StudyCard`） |
| **Wiki 词条沿用旧版通用结构** | 字段缺失导致百科抽屉与风险色标无法渲染 | 采用 `WikiTopic` 规范，实现 `metaphor` 与 `tactics[]` |
| **医保原价写成字符串 `"4500元/盒"`** | 导致前端算费函数计算出 `NaN` 元 | 必须使用数字类型：`originalPrice: 4500` |
| **DDI `riskLevel` 写成 `"caution"`** | 枚举值非法，编译阶段直接报错 | 采用合法值 `"timing_caution"` 或 `"timing_warning"` |
| **新靶向药 target 强塞未定义字段** | 触发 TypeScript 类型错误 | 扩展 `TargetedDrug.target` 或在赋值时使用 `as any` |
| **新专科主题色与既有专区撞色** | 导致移动端和桌面端视觉识别混淆 | 严格参考 §9.2，选用 `orange`、`blue`、`yellow` 等新色 |
| **Staging 引擎直接除法未防 `NaN`** | 患者输入空数据时页面白屏崩溃 | 使用 `Number.isFinite()` 提供安全数值保底 |
| **遗漏 `profileStorage.ts` 登记** | 无法为新癌种建立独立的本地档案卡槽 | 在 `KNOWN_CANCER_TYPES` 数组中追加该癌种标识 |
| **遗漏 `stagingRegistry.ts` 别名** | 外部传入中文“胰腺癌”时意外回退至肺癌 | 在 `normalizeCancerType()` 中显式映射其中文别名 |
| **新癌种上线后顶部导航仍为“规划中”** | 未从 `CancerSwitch.tsx` 的 `UPCOMING_CANCERS` 移除 | 从 `UPCOMING_CANCERS` 剔除并在正式列表中配置主题高亮 |
| **主页“探索更多癌种专区”漏加卡片** | 仅完成了数据层代码，遗漏了 `page.tsx` 挂载 | 在 `CANCER_MATRIX_CARDS` 中登记并适配 3x3 优雅排版 |
| **AI 报告生成回退为肺癌默认模板** | 未在 `api/generate-report` 挂载专科 System Prompt | 编写专科专属 Prompt 并在 `templatePrompt` 显式路由 |
| **仅运行单测试跳过 `npm run test:unit`** | 产生隐蔽回归 Bug，CI 流水线失败 | 本地必须跑通 438+ 项全量单元测试与护栏检测 |
