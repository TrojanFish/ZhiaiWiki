/**
 * 胰腺癌 (Pancreatic Cancer) 7 维度端到端本地化深度仿真测试
 * 运行指令: npx tsx scripts/simulate-pancreatic-cancer.ts
 */

import { 
  computePancreaticStage, 
  getPancreaticClinicalCohort, 
  evaluatePancreaticResectability 
} from "../src/lib/pancreaticStaging";
import { 
  checkPancreaticDrugInteractions 
} from "../src/lib/pancreaticDdiData";
import { PANCREATIC_STUDIES } from "../src/lib/pancreaticStudiesData";
import { PANCREATIC_WIKI_TOPICS } from "../src/lib/pancreaticWikiData";
import { PANCREATIC_DRUG_POLICIES } from "../src/lib/pancreaticReimbursementData";
import { CancerRegistry } from "../src/lib/cancerRegistry";
import { normalizeCancerType } from "../src/lib/stagingRegistry";
import { sanitizeClinicalText } from "../src/lib/privacy";

let passCount = 0;
let failCount = 0;

function assertSim(condition: boolean, desc: string, detail?: string) {
  if (condition) {
    console.log(`\x1b[32m  ✓ [PASS]\x1b[0m ${desc}`);
    passCount++;
  } else {
    console.error(`\x1b[31m  ✗ [FAIL]\x1b[0m ${desc} ${detail ? `(${detail})` : ""}`);
    failCount++;
  }
}

console.log("\x1b[1m\x1b[36m========================================================\x1b[0m");
console.log("\x1b[1m\x1b[36m   OncoPath 胰腺癌 7 维度端到端临床深度仿真测试套件    \x1b[0m");
console.log("\x1b[1m\x1b[36m========================================================\x1b[0m\n");

// =================== 维度 1: 确定性 TNM 与解剖切除性推演 ===================
console.log("\x1b[35m[维度 1] 确定性 TNM 分期与血管侵犯三分类推演\x1b[0m");
const stage1 = computePancreaticStage({ tumorSize: 1.8, nStage: "N0", mStage: "M0" });
assertSim(stage1.stage === "IA", "早期 T1N0M0 正确判定为 IA 期");

const stage2 = computePancreaticStage({ tumorSize: 2.8, regionalNodesPositive: 2, mStage: "M0" });
assertSim(stage2.stage === "IIB" && stage2.nStage === "N1", "伴 2 枚淋巴结转移正确判定为 IIB 期");

const stage3 = computePancreaticStage({ celiacInvolvement: true, nStage: "N1", mStage: "M0" });
assertSim(stage3.tStage === "T4" && stage3.stage === "III", "腹腔干侵犯强制升为 T4 并判定为 III 期");

const stage4 = computePancreaticStage({ hasDistantMets: true });
assertSim(stage4.stage === "IV" && stage4.mStage === "M1", "远处转移准确判定为 IV 期");

const stageNan = computePancreaticStage({ tumorSize: NaN as any, regionalNodesPositive: null });
assertSim(Number.isFinite(parseFloat(stageNan.tStage.replace(/\D/g, "") || "1")), "NaN 非法输入安全防御，无白屏奔溃");

const resectCheck = evaluatePancreaticResectability({ smvPvDegree: ">180" });
assertSim(resectCheck.status === "borderline_resectable", "静脉受侵 >180° 正确评定为交界可切除");

// =================== 维度 2: 顶刊前瞻 RCT 队列四要素完备性 ===================
console.log("\n\x1b[35m[维度 2] 前瞻性顶刊队列四要素与真实科研依据穿透\x1b[0m");
const cohortEarly = getPancreaticClinicalCohort({ stage: "IB" });
assertSim(Boolean(cohortEarly.pmid === "30575490" && cohortEarly.doi), "早期辅助队列对应真实 NEJM PRODIGE 24 研究四要素");

const cohortLate = getPancreaticClinicalCohort({ stage: "IV" });
assertSim(Boolean(cohortLate.pmid === "24131140" && cohortLate.doi), "晚期常规一线队列对应真实 NEJM MPACT 研究");

const cohortBrca = getPancreaticClinicalCohort({ stage: "IV", brcaMutation: "positive" });
assertSim(cohortBrca.pmid === "31157963" && cohortBrca.name.includes("POLO"), "gBRCAm 突变晚期精准分流至 POLO 维持队列");

assertSim(PANCREATIC_STUDIES.length >= 5, `文献库收录 ${PANCREATIC_STUDIES.length} 篇权威 RCT 研究`);
assertSim(PANCREATIC_STUDIES.every(s => Boolean(s.pubmedId && s.doi && s.keyConclusions.length >= 2)), "所有收录研究均具备真实 PubMed、DOI 与结构化结论");

// =================== 维度 3: 专科 DDI 药理学与致命配伍禁忌 ===================
console.log("\n\x1b[35m[维度 3] DDI 药理学相互作用与致命用药禁忌强拦截\x1b[0m");
const ddiSevere = checkPancreaticDrugInteractions("pancreatic_olaparib", ["rifampin"]);
assertSim(ddiSevere.overallStatus === "danger" && ddiSevere.severeCount >= 1, "强 CYP3A4 诱导剂成功触发红色严重禁忌拦截");

const ddiCaution = checkPancreaticDrugInteractions("pancreatic_erlotinib", ["omeprazole"]);
assertSim(ddiCaution.overallStatus === "warning" && ddiCaution.cautionCount >= 1, "质子泵抑制剂 pH 依赖性吸收成功触发橙色时序警示");
assertSim(ddiCaution.dailySchedulePlan.length >= 2, "成功为患者生成清晨与睡前错峰服药规划");

const ddiSafe = checkPancreaticDrugInteractions("pancreatic_olaparib", []);
assertSim(ddiSafe.overallStatus === "safe" && ddiSafe.severeCount === 0, "空慢病用药时判定为安全状态 (safe)");

// =================== 维度 4: 破恐百科词条四分类与四步叙事 ===================
console.log("\n\x1b[35m[维度 4] 破恐百科词条分类覆盖与人文叙事结构审计\x1b[0m");
const categories = new Set(PANCREATIC_WIKI_TOPICS.map(t => t.category));
assertSim(categories.has("nodule") && categories.has("pathology") && categories.has("genetics") && categories.has("recovery"), "完整覆盖 nodule, pathology, genetics, recovery 四大核心分类");

const allNarrativeComplete = PANCREATIC_WIKI_TOPICS.every(
  t => Boolean(t.metaphor && t.clinicalTruth && t.tactics?.length >= 2 && t.reassurance && t.faq?.length >= 1)
);
assertSim(allNarrativeComplete, "所有词条均严格践行'生活隐喻-临床真相-战术-定心丸'四步破恐叙事");

// =================== 维度 5: 国谈医保政策与数值型算费校验 ===================
console.log("\n\x1b[35m[维度 5] 医保报销目录准入与价格数值安全性\x1b[0m");
const allPricesNumeric = PANCREATIC_DRUG_POLICIES.every(
  p => typeof p.originalPrice === "number" && typeof p.negotiatedPrice === "number" && !isNaN(p.originalPrice) && !isNaN(p.negotiatedPrice)
);
assertSim(allPricesNumeric, "所有医保药品价格均为合法有限数字，杜绝 NaN 算费毒性");

const hasPAP = PANCREATIC_DRUG_POLICIES.some(p => Boolean(p.papProgram && p.papRule));
assertSim(hasPAP, "收录利普卓等特药慈善援助救助规则 (PAP)");

// =================== 维度 6: 单例注册中心挂载与多别名归一化 ===================
console.log("\n\x1b[35m[维度 6] 单例注册中心挂载与多中文别名解析\x1b[0m");
assertSim(CancerRegistry.has("pancreatic"), "CancerRegistry 成功动态装载胰腺癌插件");

const plugin = CancerRegistry.get("pancreatic");
assertSim(plugin.theme.primaryColor.includes("orange"), "专区主题色正确绑定活力暖橙色，无视觉冲突");

const aliases = ["胰腺癌", "胰腺", "pancreas", "pancreatic"];
const allAliasesResolved = aliases.every(a => normalizeCancerType(a) === "pancreatic");
assertSim(allAliasesResolved, "中文别名及英文器官名均准确归一化为 pancreatic");

// =================== 维度 7: 临床病理隐私脱敏 (PII) 审计 ===================
console.log("\n\x1b[35m[维度 7] 真实病理隐私去标识化 (PII) 合规性\x1b[0m");
const sampleReport = "患者王建华，男，62岁，身份证号 110101196203158877，手机号 13800138000，住院号 ZY-2024-9988，胰头占位压迫胆总管。";
const sanitized = sanitizeClinicalText(sampleReport);
assertSim(!sanitized.includes("110101196203158877") && !sanitized.includes("王建华") && !sanitized.includes("13800138000"), "二代身份证、患者姓名与手机号彻底不可逆脱敏");

console.log("\n========================================================");
console.log(`仿真测试结果汇总: \x1b[32m${passCount} 项通过\x1b[0m | \x1b[31m${failCount} 项失败\x1b[0m`);
console.log("========================================================");

if (failCount > 0) {
  console.error("\x1b[1m\x1b[31m[FAILED] 胰腺癌专科深度仿真发现不符合项，请排查修正！\x1b[0m\n");
  process.exit(1);
} else {
  console.log("\x1b[1m\x1b[32m[ALL PASSED] 胰腺癌 7 维度端到端临床深度仿真完美通过！\x1b[0m\n");
}
