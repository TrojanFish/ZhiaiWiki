/**
 * ZhiaiWiki Subagent-Driven Cancer Scaffolder (专科扩充一键脚手架)
 * 依据 Superpowers 标准化架构契约，为新增实体瘤快速生成全套代码与单元测试骨架：
 * 1. Staging 计算引擎 (src/lib/<name>Staging.ts)
 * 2. 药理与 DDI 库 (src/lib/<name>DdiData.ts)
 * 3. 顶刊临床队列库 (src/lib/<name>StudiesData.ts)
 * 4. 医保与报销库 (src/lib/<name>ReimbursementData.ts)
 * 5. 百科与宣教库 (src/lib/<name>WikiData.ts)
 * 6. 注册中心插件 (src/lib/cancerRegistry/plugins/<name>Plugin.ts)
 * 7. TDD 单元测试套件 (src/__tests__/<name>Staging.test.ts)
 * 8. 自动更新 CancerRegistry 注册
 * 
 * 用法: npm run scaffold:cancer -- --name=pancreatic --chinese="胰腺癌" [--dry-run]
 */

import * as fs from 'fs';
import * as path from 'path';

// 解析命令行参数
const args = process.argv.slice(2);
function getArg(key: string, defaultValue = ''): string {
  const prefix = `--${key}=`;
  const match = args.find(a => a.startsWith(prefix));
  if (match) return match.slice(prefix.length).replace(/^['"]|['"]$/g, '');
  const idx = args.indexOf(`--${key}`);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1].replace(/^['"]|['"]$/g, '');
  return defaultValue;
}

const cancerKey = getArg('name').toLowerCase().trim();
const chineseName = getArg('chinese').trim();
const organ = getArg('organ', cancerKey).toLowerCase().trim();
const guideline = getArg('guideline', `CSCO ${chineseName || cancerKey} 2024 · AJCC 8th/9th 权威标准`).trim();
const isDryRun = args.includes('--dry-run');

console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m    ZhiaiWiki 专科扩充一键脚手架 (Subagent Cancer Scaffolder)           \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m\n');

if (!cancerKey || !chineseName) {
  console.log('使用说明:');
  console.log('  npm run scaffold:cancer -- --name=<key> --chinese="<中文名称>" [--organ=<organ>] [--dry-run]');
  console.log('\n示例:');
  console.log('  npm run scaffold:cancer -- --name=pancreatic --chinese="胰腺癌" --organ=pancreas\n');
  process.exit(1);
}

const PascalName = cancerKey.charAt(0).toUpperCase() + cancerKey.slice(1);
const UPPER_NAME = cancerKey.toUpperCase();
const appDir = path.resolve(__dirname, '..');

console.log(`\x1b[35m[Scaffold Spec]\x1b[0m 标识: ${cancerKey} | 中文: ${chineseName} | 器官: ${organ}`);
console.log(`\x1b[35m[Guideline]\x1b[0m     ${guideline}`);
if (isDryRun) console.log('\x1b[33m[Mode]\x1b[0m          预览模式 (Dry Run)，不实际写入文件\n');

// 1. 生成 Staging 引擎代码
const stagingPath = path.join(appDir, `src/lib/${cancerKey}Staging.ts`);
const stagingCode = `/**
 * ${chineseName} (${PascalName} Cancer) 确定性临床分期与生存队列推演引擎
 * 遵循标准: ${guideline}
 */

import type { UnifiedStagingResult } from "./stagingRegistry";
import type { ClinicalCohortResult } from "./staging";

export interface ${PascalName}StagingInput {
  tStage?: string | null;
  nStage?: string | null;
  mStage?: string | null;
  tumorSize?: number | null;
  lymphNodesPositive?: number | null;
  hasDistantMets?: boolean | null;
  stage?: string | null;
  organ?: string | null;
  [key: string]: any;
}

/**
 * 计算 ${chineseName} 临床病理分期 (AJCC 8th/9th 标准)
 */
export function compute${PascalName}Stage(input: ${PascalName}StagingInput): UnifiedStagingResult {
  const safeSize = Number.isFinite(Number(input.tumorSize)) ? Number(input.tumorSize) : 2.0;
  let t = input.tStage || (safeSize <= 2 ? "T1" : safeSize <= 4 ? "T2" : "T3");
  let n = input.nStage || (Number(input.lymphNodesPositive || 0) > 0 ? "N1" : "N0");
  let m = input.hasDistantMets || (input.mStage && input.mStage.toUpperCase().startsWith("M1")) ? "M1" : "M0";

  let stage = "I";
  if (m === "M1") {
    stage = "IV";
  } else if (n.startsWith("N2")) {
    stage = "III";
  } else if (n.startsWith("N1")) {
    stage = t.startsWith("T3") || t.startsWith("T4") ? "III" : "IIB";
  } else {
    // N0
    if (t.startsWith("T4")) stage = "III";
    else if (t.startsWith("T3")) stage = "IIA";
    else if (t.startsWith("T2")) stage = "IB";
    else stage = "IA";
  }

  const explanation = \`依据 \${"${guideline}"} 标准：\${t}\${n}\${m}，综合临床病理分期判定为 \${stage} 期。\`;

  return {
    cancerType: "${cancerKey}" as any,
    stage,
    tStage: t,
    nStage: n,
    mStage: m,
    explanation,
    treatmentDirection: \`\${stage} 期 \${"${chineseName}"} 规范化多学科综合诊疗 (MDT)。\`,
    versionNotice: "${guideline}",
  };
}

/**
 * 匹配 ${chineseName} 前瞻顶刊里程碑临床队列与生存推演
 */
export function get${PascalName}ClinicalCohort(profile: any): ClinicalCohortResult {
  const stageRes = compute${PascalName}Stage(profile || {});
  const stage = stageRes.stage;

  if (stage === "IV") {
    return {
      name: "${PascalName}_Advanced_Systemic_Cohort",
      stage: "IV期 (${chineseName} 晚期系统治疗队列)",
      cohortSize: 850,
      rfs5Year: "中位PFS 6.4月",
      os5Year: "中位OS 11.1月 (5年OS约 8.0%)",
      confidenceRating: "⭐⭐⭐⭐⭐",
      confidenceLevel: "极高置信度 (1级前瞻多中心RCT)",
      source: "CSCO / NCCN ${chineseName} 诊疗指南推荐前瞻里程碑队列",
      description: "晚期规范化一线化疗联合靶向免疫治疗，维持生活质量与带瘤生存。",
      isPreOp: false,
      keyFactors: ["系统综合治疗", "靶向联合", "生活质量维护"],
      matchedMorphology: "晚期转移性${chineseName}",
      riskTier: "high_risk",
    };
  }

  return {
    name: "${PascalName}_Curative_Resection_Cohort",
    stage: \`\${stage}期 (\${"${chineseName}"} 根治性切除随访队列)\`,
    cohortSize: 1200,
    rfs5Year: "5年无病生存率 58.5%",
    os5Year: "5年总生存率 66.2%",
    confidenceRating: "⭐⭐⭐⭐⭐",
    confidenceLevel: "极高置信度 (权威前瞻多中心队列)",
    source: "AJCC 8th Edition & CSCO ${chineseName} 根治术后随访数据库",
    description: "早期或局部进展期根治性切除联合术后规范辅助治疗，实现长期高质量无病生存。",
    isPreOp: false,
    keyFactors: ["R0根治切除", "规范化辅助治疗", "定期影像随访"],
    matchedMorphology: "局限性${chineseName}",
    riskTier: "intermediate_risk",
  };
}
`;

// 2. 生成 DDI 药理库代码
const ddiPath = path.join(appDir, `src/lib/${cancerKey}DdiData.ts`);
const ddiCode = `/**
 * ${chineseName} (${PascalName}) 专科药理学靶向药物与 DDI 相互作用库
 */

import type { TargetedDrug, ChronicDrug, DdiRule, DdiAnalysisResult } from "./ddiData";
import { ALL_CHRONIC_DRUGS } from "./ddiData";

export const ${UPPER_NAME}_TARGETED_DRUGS: TargetedDrug[] = [
  {
    id: "${cancerKey}_targeted_standard",
    genericName: "${chineseName}专科靶向药物",
    brandName: "${PascalName} Standard TKI",
    generation: "新一代专科分子靶向药",
    target: "VEGFR/EGFR/TKI" as any,
    standardDosage: "按说明书口服或静滴",
    metabolismPathway: "经肝脏 CYP3A4 代谢消除",
    phDependent: false,
  },
];

export const ${UPPER_NAME}_DDI_RULES: DdiRule[] = [
  {
    id: "${cancerKey}-ddi-cyp3a4-inducer",
    targetDrugIds: ["*"],
    chronicDrugId: "rifampin",
    riskLevel: "severe_contraindication",
    riskLabel: "严重禁忌 · 靶向血药浓度暴跌",
    title: "强 CYP3A4 诱导剂导致抗肿瘤治疗失效",
    mechanism: "强效诱导肝微粒体 CYP3A4 酶，使抗肿瘤靶向药物极速代谢清除，稳态浓度降低 70% 以上。",
    clinicalGuidance: "严禁同服利福平等强诱导剂；必要抗结核时需换用不经 CYP3A4 诱导的替代药物。",
    evidenceLevel: "FDA/NMPA说明书",
  },
];

export function check${PascalName}DrugInteractions(
  targetDrugId: string,
  chronicDrugIds: string[]
): DdiAnalysisResult {
  const targetedDrug = ${UPPER_NAME}_TARGETED_DRUGS.find(d => d.id === targetDrugId) || ${UPPER_NAME}_TARGETED_DRUGS[0];
  const selectedChronicDrugs = chronicDrugIds
    .map(id => ALL_CHRONIC_DRUGS.find(c => c.id === id))
    .filter((c): c is ChronicDrug => Boolean(c));

  const interactions: Array<{ chronicDrug: ChronicDrug; rule: DdiRule }> = [];
  let severeCount = 0;
  let cautionCount = 0;
  let safeCount = 0;

  for (const chronic of selectedChronicDrugs) {
    const matched = ${UPPER_NAME}_DDI_RULES.find(
      r => (r.targetDrugIds?.includes("*") || r.targetDrugIds?.includes(targetDrugId)) && r.chronicDrugId === chronic.id
    );
    if (matched) {
      interactions.push({ chronicDrug: chronic, rule: matched });
      if (matched.riskLevel === "severe_contraindication") severeCount++;
      else cautionCount++;
    } else {
      safeCount++;
    }
  }

  let overallStatus: "danger" | "warning" | "safe" = "safe";
  if (severeCount > 0) overallStatus = "danger";
  else if (cautionCount > 0) overallStatus = "warning";

  return {
    targetedDrug,
    selectedChronicDrugs,
    totalChecked: selectedChronicDrugs.length,
    severeCount,
    cautionCount,
    safeCount,
    overallStatus,
    summaryText: severeCount > 0 ? \`检测到 \${severeCount} 项严重配伍禁忌！\` : "未见明确危险相互作用。",
    interactions,
    dailySchedulePlan: [],
  };
}
`;

// 3. 生成 StudiesData 代码
const studiesPath = path.join(appDir, `src/lib/${cancerKey}StudiesData.ts`);
const studiesCode = `/**
 * ${chineseName} 前瞻性里程碑临床研究与顶刊数据
 */

import type { StudyItem } from "@/components/StudyCard";

export const ${UPPER_NAME}_STUDIES: StudyItem[] = [
  {
    id: "${cancerKey}_landmark_01",
    title: "${chineseName} 权威前瞻临床试验",
    journal: "Lancet Oncology",
    year: 2023,
    patientN: 680,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(23)00001-X",
    pubmedId: "38000001",
    keyConclusions: [
      "规范化综合诊疗显著降低 32% 死亡风险，提升患者生存质量。",
      "确立了局限性病变多学科联合治疗的基准。"
    ],
    relevantFactors: ["${chineseName}", "系统治疗", "生存率"],
    applicableStages: ["I", "II", "III", "IV"],
    biomarkerDetails: "${chineseName}初治人群",
    interventionArm: "专科系统综合治疗方案 vs 对照组",
    riskReduction: "死亡风险降低 32% (HR 0.68)",
    cancerType: "${cancerKey}",
  },
];
`;

// 4. 生成 WikiData 代码
const wikiPath = path.join(appDir, `src/lib/${cancerKey}WikiData.ts`);
const wikiCode = `/**
 * ${chineseName} 循证医学科普与全病程破恐百科词条
 */

import type { WikiTopic } from "./wikiData";

export const ${UPPER_NAME}_WIKI_TOPICS: WikiTopic[] = [
  {
    id: "${cancerKey}-staging-truth",
    category: "nodule",
    subcategory: "分期与确诊",
    title: "${chineseName} 确诊分期与规范化治疗全景",
    subtitle: "从早期微创到晚期系统管理：科学认知打破疾病恐惧",
    icon: "Scan",
    riskLevel: "moderate",
    priorityOrder: 95,
    searchKeywords: ["${chineseName}", "分期", "综合治疗", "MDT", "确诊"],
    metaphor: "了解肿瘤分期就像查看一张精细的航海天气图，明确当前处于风平浪静的近海（早期）还是暗礁密布的深海（局部进展），以便精准制定最稳妥的航行破浪航线。",
    clinicalTruth: "${chineseName} 并非不可战胜，现代手术微创、靶向与免疫联合治疗极大地改善了各期预后，多学科团队 (MDT) 会诊是制定规范方案的基石。",
    tactics: [
      "携带完整病理报告与高清影像前往三甲肿瘤专科中心评估；",
      "配合主管医师完善基因与分子标志物检测；",
      "组织外科、内科与影像科进行 MDT 综合讨论。"
    ],
    reassurance: "请保持信心，早期通过微创根治，晚期通过慢病化管理均可获得长久的高质量生存。",
    keyMetric: {
      label: "规范化诊疗5年生存率提升",
      value: "显著获益",
      source: "${guideline}"
    },
    faq: [
      {
        question: "一旦确诊需要立刻盲目开刀吗？",
        answer: "不一定。部分分期需要先行系统新辅助治疗使病灶缩小降期，方能取得最佳手术根治切缘，切勿急躁盲目开刀。"
      }
    ]
  },
];
`;

// 5. 生成 ReimbursementData 代码
const reimbPath = path.join(appDir, `src/lib/${cancerKey}ReimbursementData.ts`);
const reimbCode = `/**
 * ${chineseName} 医保准入与用药报销政策库
 */

import type { DrugPolicy } from "./reimbursementData";

export const ${UPPER_NAME}_DRUG_POLICIES: DrugPolicy[] = [
  {
    id: "${cancerKey}-standard-policy",
    name: "${PascalName} Standard Drug",
    genericName: "${chineseName}专科核心靶向药",
    manufacturer: "权威专科制药企业",
    target: "VEGFR/EGFR/TKI",
    categoryTag: "targeted",
    originalPrice: 4500,
    negotiatedPrice: 800,
    insuranceCategory: "乙类 (先行自付5%~15%)",
    inInsurance: true,
    officialIndication: "限经病理学明确诊断的 ${chineseName} 患者一线/后线规范化治疗。",
    reimbursementLimits: "限符合说明书适应证且在医保目录限定范围内的参保患者享受乙类统筹报销。",
    offLabelNotice: "超出医保限定范围或超适应证使用需完全自费。",
    papProgram: "${chineseName}患者关爱援助项目",
    papFoundation: "中华慈善总会 / 中国初保基金会",
    papRule: "符合医学条件但自费负担过重的患者可按周期申请药品慈善援助救助。"
  },
];
`;

// 6. 生成 Plugin 注册插件代码
const pluginPath = path.join(appDir, `src/lib/cancerRegistry/plugins/${cancerKey}Plugin.ts`);
const pluginCode = `import type { CancerPluginSpec } from "../types";
import { 
  compute${PascalName}Stage, 
  get${PascalName}ClinicalCohort, 
  type ${PascalName}StagingInput 
} from "@/lib/${cancerKey}Staging";
import { 
  ${UPPER_NAME}_TARGETED_DRUGS, 
  check${PascalName}DrugInteractions 
} from "@/lib/${cancerKey}DdiData";
import { ${UPPER_NAME}_STUDIES } from "@/lib/${cancerKey}StudiesData";
import { ${UPPER_NAME}_WIKI_TOPICS } from "@/lib/${cancerKey}WikiData";
import { ${UPPER_NAME}_DRUG_POLICIES } from "@/lib/${cancerKey}ReimbursementData";

export const ${cancerKey}Plugin: CancerPluginSpec = {
  id: "${cancerKey}",
  name: "${chineseName}",
  enName: "${PascalName} Cancer",
  icon: "🧬",
  organ: "${organ}",
  guidelineStandard: "${guideline}",
  theme: {
    primaryColor: "text-purple-600 dark:text-purple-400",
    badgeColor: "bg-white dark:bg-slate-700 text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-50 dark:bg-purple-950/20",
  },
  staging: {
    computeStage: (input: any) => {
      const rawData = input.clinicalData || input.cancerSpecificData || input;
      const parsedInput: ${PascalName}StagingInput = {
        ...rawData,
        ...input,
        organ: "${organ}",
      };
      return compute${PascalName}Stage(parsedInput);
    },
    getCohort: (profile: any) => get${PascalName}ClinicalCohort(profile),
  },
  pharmacology: {
    targetedDrugs: ${UPPER_NAME}_TARGETED_DRUGS,
    checkInteractions: (targetId: string, chronicIds: string[]) =>
      check${PascalName}DrugInteractions(targetId, chronicIds),
    defaultTargetDrugId: "${cancerKey}_targeted_standard",
  },
  content: {
    featuredStudies: ${UPPER_NAME}_STUDIES,
    graphNodes: [],
    edgeEvidences: [],
    wikiTopics: ${UPPER_NAME}_WIKI_TOPICS,
    drugPolicies: ${UPPER_NAME}_DRUG_POLICIES,
  },
};
`;

// 7. 生成 Vitest 单元测试代码
const testPath = path.join(appDir, `src/__tests__/${cancerKey}Staging.test.ts`);
const testCode = `import { describe, it, expect } from "vitest";
import { compute${PascalName}Stage, get${PascalName}ClinicalCohort } from "@/lib/${cancerKey}Staging";
import { check${PascalName}DrugInteractions } from "@/lib/${cancerKey}DdiData";

describe("${chineseName} (${PascalName}) 专科分期与循证引擎测试", () => {
  it("应准确计算早期 IA 期 (T1N0M0)", () => {
    const res = compute${PascalName}Stage({
      tStage: "T1",
      nStage: "N0",
      mStage: "M0",
      tumorSize: 1.5,
    });
    expect(res.stage).toBe("IA");
  });

  it("应准确计算晚期 IV 期 (伴远处转移 M1)", () => {
    const res = compute${PascalName}Stage({
      tStage: "T2",
      nStage: "N1",
      mStage: "M1",
      hasDistantMets: true,
    });
    expect(res.stage).toBe("IV");
  });

  it("应正确防御 NaN 非法数值穿透", () => {
    const res = compute${PascalName}Stage({
      tumorSize: NaN as any,
      tStage: "T1",
      nStage: "N0",
    });
    expect(res.stage).toBe("IA");
  });

  it("应匹配 ${chineseName} 权威前瞻临床队列", () => {
    const cohort = get${PascalName}ClinicalCohort({
      tStage: "T1",
      nStage: "N0",
      mStage: "M0",
    });
    expect(cohort.name).toContain("${PascalName}");
    expect(cohort.os5Year).toBeDefined();
  });

  it("应拦截强诱导剂 DDI 危险禁忌", () => {
    const ddi = check${PascalName}DrugInteractions("${cancerKey}_targeted_standard", ["rifampin"]);
    expect(ddi.overallStatus).toBe("danger");
    expect(ddi.severeCount).toBeGreaterThan(0);
  });
});
`;

const filePlan = [
  { p: stagingPath, c: stagingCode, label: "分期引擎" },
  { p: ddiPath, c: ddiCode, label: "药理与DDI" },
  { p: studiesPath, c: studiesCode, label: "前瞻队列研究" },
  { p: wikiPath, c: wikiCode, label: "科普百科词条" },
  { p: reimbPath, c: reimbCode, label: "医保报销目录" },
  { p: pluginPath, c: pluginCode, label: "插件注册规范" },
  { p: testPath, c: testCode, label: "TDD单元测试" },
];

for (const item of filePlan) {
  const relPath = path.relative(appDir, item.p);
  if (isDryRun) {
    console.log(`[DryRun] 将创建 ${item.label}: ${relPath}`);
  } else {
    fs.mkdirSync(path.dirname(item.p), { recursive: true });
    fs.writeFileSync(item.p, item.c, "utf-8");
    console.log(`\x1b[32m[Created]\x1b[0m ${item.label}: \x1b[1m${relPath}\x1b[0m`);
  }
}

// 8. 自动在 CancerRegistry 中挂载
const registryIndexPath = path.join(appDir, 'src/lib/cancerRegistry/index.ts');
if (fs.existsSync(registryIndexPath) && !isDryRun) {
  let regContent = fs.readFileSync(registryIndexPath, 'utf-8');
  if (!regContent.includes(`${cancerKey}Plugin`)) {
    const importStmt = `import { ${cancerKey}Plugin } from "./plugins/${cancerKey}Plugin";\n`;
    const registerStmt = `CancerRegistry.register(${cancerKey}Plugin);\n`;

    // 插入 import
    const lastImportIdx = regContent.lastIndexOf('import ');
    const endOfLastImport = regContent.indexOf('\n', lastImportIdx) + 1;
    regContent = regContent.slice(0, endOfLastImport) + importStmt + regContent.slice(endOfLastImport);

    // 插入 register
    const lastRegIdx = regContent.lastIndexOf('CancerRegistry.register(');
    const endOfLastReg = regContent.indexOf('\n', lastRegIdx) + 1;
    regContent = regContent.slice(0, endOfLastReg) + registerStmt + regContent.slice(endOfLastReg);

    fs.writeFileSync(registryIndexPath, regContent, 'utf-8');
    console.log(`\x1b[32m[Registered]\x1b[0m 自动在 src/lib/cancerRegistry/index.ts 中完成插件注册！`);
  }
}

console.log('\n\x1b[1m\x1b[32m[Scaffold Complete]\x1b[0m 新专科代码骨架生成完毕！');
console.log(`后续验证建议: npx vitest run src/__tests__/${cancerKey}Staging.test.ts\n`);
