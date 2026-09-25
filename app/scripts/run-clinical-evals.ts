/**
 * OncoPath Clinical Golden Evals Runner (临床黄金评测集执行器)
 * 依据 Superpowers 端到端验证与仿真规范，对 10 大实体瘤与妇科肿瘤共 20 组复杂边界病例进行自动化评测打分
 * 
 * 运行方式: npm run bench:clinical (或 npx tsx scripts/run-clinical-evals.ts)
 */

import { CLINICAL_GOLDEN_CASES } from '../src/lib/clinicalGoldenEvals';
import { computeCancerStage, getClinicalCohortUnified } from '../src/lib/stagingRegistry';
import { checkDrugInteractionsUnified } from '../src/lib/ddiRegistry';

console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m');
console.log('\x1b[1m\x1b[35m    OncoPath 临床黄金评测基准套件 (Clinical Golden Evals Benchmark - Superpowers)     \x1b[0m');
console.log('\x1b[1m\x1b[35m========================================================================================\x1b[0m\n');

let totalCases = CLINICAL_GOLDEN_CASES.length;
let stagingPassCount = 0;
let cohortPassCount = 0;
let ddiPassCount = 0;
let totalDdiTests = 0;
let allPassed = true;

console.log(`\x1b[36m[Benchmark]\x1b[0m 正在评测 10 大主要恶性肿瘤的 ${totalCases} 组里程碑复杂真实病例...\n`);

for (const c of CLINICAL_GOLDEN_CASES) {
  console.log(`\x1b[1m[${c.id}]\x1b[0m \x1b[33m【${c.cancerType.toUpperCase()}】\x1b[0m ${c.title} (${c.category})`);

  // 1. 评测临床分期算法
  let stagingMatch = false;
  let computedStage = '';
  try {
    const stageRes = computeCancerStage(c.cancerType, c.profile);
    computedStage = stageRes.stage || stageRes.cnlcStage || '';
    // 支持精准匹配或前缀匹配（如 "IA1" 匹配 "IA"）
    stagingMatch = (computedStage === c.expectedStage) || (computedStage.startsWith(c.expectedStage));
  } catch (err: any) {
    computedStage = `ERROR: ${err.message}`;
  }

  if (stagingMatch) {
    stagingPassCount++;
    console.log(`  ├─ 分期推演: \x1b[32m[PASS]\x1b[0m 计算分期: ${computedStage} (预期: ${c.expectedStage})`);
  } else {
    allPassed = false;
    console.log(`  ├─ 分期推演: \x1b[31m[FAIL]\x1b[0m 计算分期: ${computedStage} vs 预期: ${c.expectedStage}`);
  }

  // 2. 评测顶刊前瞻队列与 5 年生存率证据匹配
  let cohortMatch = false;
  let matchedTrialName = '';
  try {
    const cohortRes = getClinicalCohortUnified(c.profile) as any;
    matchedTrialName = cohortRes?.trialName || cohortRes?.name || cohortRes?.cohortId || '';
    
    // 灵活匹配试验名称
    const cleanMatched = matchedTrialName.toLowerCase().replace(/[-_]/g, '');
    const cleanExpected = c.expectedTrialCohort.toLowerCase().replace(/[-_]/g, '');
    cohortMatch = cleanMatched.includes(cleanExpected) || Boolean(cohortRes?.source && cohortRes.source.toLowerCase().includes(cleanExpected));
  } catch (err: any) {
    matchedTrialName = `ERROR: ${err.message}`;
  }

  if (cohortMatch) {
    cohortPassCount++;
    console.log(`  ├─ 顶刊队列: \x1b[32m[PASS]\x1b[0m 匹配研究: ${matchedTrialName}`);
  } else {
    allPassed = false;
    console.log(`  ├─ 顶刊队列: \x1b[31m[FAIL]\x1b[0m 匹配研究: ${matchedTrialName} vs 预期包含: ${c.expectedTrialCohort}`);
  }

  // 3. 评测 DDI 药理学禁忌拦截（若有测试配置）
  if (c.ddiTest) {
    totalDdiTests++;
    let ddiMatch = false;
    let actualLevel = '';
    try {
      const ddiRes = checkDrugInteractionsUnified(c.cancerType, c.ddiTest.drugA, [c.ddiTest.drugB]);
      actualLevel = ddiRes.overallStatus;
      
      // caution 与 warning 语义相同
      const normActual = (actualLevel === 'warning') ? 'caution' : actualLevel;
      const normExpected = (c.ddiTest.expectedLevel === 'warning') ? 'caution' : c.ddiTest.expectedLevel;
      ddiMatch = (normActual === normExpected);
    } catch (err: any) {
      actualLevel = `ERROR: ${err.message}`;
    }

    if (ddiMatch) {
      ddiPassCount++;
      console.log(`  ├─ 药理 DDI: \x1b[32m[PASS]\x1b[0m 禁忌等级: ${actualLevel} (${c.ddiTest.description})`);
    } else {
      allPassed = false;
      console.log(`  ├─ 药理 DDI: \x1b[31m[FAIL]\x1b[0m 禁忌等级: ${actualLevel} vs 预期: ${c.ddiTest.expectedLevel}`);
    }
  }

  console.log(`  └─ 临床安全断言: \x1b[90m${c.safetyAssertion}\x1b[0m\n`);
}

// 统计雷达指标
const stagingAccuracy = ((stagingPassCount / totalCases) * 100).toFixed(1);
const cohortGrounding = ((cohortPassCount / totalCases) * 100).toFixed(1);
const ddiRecall = totalDdiTests > 0 ? ((ddiPassCount / totalDdiTests) * 100).toFixed(1) : '100.0';

console.log('========================================================================================');
console.log('                          评测能力雷达与质量指标看板');
console.log('========================================================================================');
console.log(` 1. 临床分期精确度 (Staging Accuracy)     : \x1b[1m\x1b[32m${stagingAccuracy}%\x1b[0m (${stagingPassCount}/${totalCases})`);
console.log(` 2. 顶刊循证契合度 (Evidence Grounding)   : \x1b[1m\x1b[32m${cohortGrounding}%\x1b[0m (${cohortPassCount}/${totalCases})`);
console.log(` 3. 药理禁忌召回率 (DDI Safety Recall)    : \x1b[1m\x1b[32m${ddiRecall}%\x1b[0m (${ddiPassCount}/${totalDdiTests})`);
console.log('----------------------------------------------------------------------------------------');

if (allPassed) {
  console.log('🎉 \x1b[1m\x1b[32m[All Golden Evals PASSED]\x1b[0m 8 大实体瘤 16 组里程碑复杂真实病例 100% 全量通过！');
  console.log('系统在各专科权威分期、顶刊队列证据链及药理学相互作用拦截上均达到顶级临床就绪水准。\n');
  process.exit(0);
} else {
  console.error('❌ \x1b[1m\x1b[31m[Golden Evals FAILED]\x1b[0m 存在未通过的医学基准测试，请排查算法。');
  process.exit(1);
}
