import { describe, it, expect } from "vitest";
import { 
  computePancreaticStage, 
  getPancreaticClinicalCohort, 
  evaluatePancreaticResectability 
} from "@/lib/pancreaticStaging";
import { checkPancreaticDrugInteractions, PANCREATIC_TARGETED_DRUGS } from "@/lib/pancreaticDdiData";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { normalizeCancerType } from "@/lib/stagingRegistry";

describe("胰腺癌 (Pancreatic Cancer) 专科分期与循证引擎深度测试", () => {
  it("应准确计算早期 IA 期 (T1N0M0, 肿瘤 <= 2cm, 区域淋巴结阴性)", () => {
    const res = computePancreaticStage({
      tumorSize: 1.6,
      tStage: "T1",
      nStage: "N0",
      mStage: "M0",
    });
    expect(res.stage).toBe("IA");
    expect(res.tStage).toBe("T1");
    expect(res.explanation).toContain("IA 期");
  });

  it("应准确计算早期 IB 期 (T2N0M0, 肿瘤 > 2cm 且 <= 4cm)", () => {
    const res = computePancreaticStage({
      tumorSize: 3.2,
      regionalNodesPositive: 0,
      mStage: "M0",
    });
    expect(res.tStage).toBe("T2");
    expect(res.stage).toBe("IB");
  });

  it("应准确计算局部病变 IIA 期 (T3N0M0, 肿瘤 > 4cm 且未累及大动脉)", () => {
    const res = computePancreaticStage({
      tumorSize: 5.0,
      regionalNodesPositive: 0,
      mStage: "M0",
    });
    expect(res.tStage).toBe("T3");
    expect(res.stage).toBe("IIA");
  });

  it("应准确计算伴 1~3 枚淋巴结转移的 IIB 期 (T1-3 N1 M0)", () => {
    const res = computePancreaticStage({
      tumorSize: 2.8,
      regionalNodesPositive: 2,
      mStage: "M0",
    });
    expect(res.nStage).toBe("N1");
    expect(res.stage).toBe("IIB");
  });

  it("应准确计算局部晚期 III 期 (累及腹腔干/SMA T4，或 >=4枚淋巴结转移 N2)", () => {
    // 血管侵犯 T4
    const resVascular = computePancreaticStage({
      celiacInvolvement: true,
      nStage: "N0",
      mStage: "M0",
    });
    expect(resVascular.tStage).toBe("T4");
    expect(resVascular.stage).toBe("III");

    // N2 淋巴结负荷
    const resN2 = computePancreaticStage({
      tumorSize: 2.2,
      regionalNodesPositive: 5,
      mStage: "M0",
    });
    expect(resN2.nStage).toBe("N2");
    expect(resN2.stage).toBe("III");
  });

  it("应准确计算远处转移 IV 期 (伴肝/肺/腹膜等远处转移 M1)", () => {
    const res = computePancreaticStage({
      tumorSize: 2.0,
      hasDistantMets: true,
    });
    expect(res.stage).toBe("IV");
    expect(res.mStage).toBe("M1");
  });

  it("应精确评估解剖学可切除性三分类 (Resectable vs Borderline vs Locally Advanced vs Metastatic)", () => {
    // 1. 可切除
    const r1 = evaluatePancreaticResectability({ tumorSize: 2.0 });
    expect(r1.status).toBe("resectable");

    // 2. 交界可切除 (静脉受累 > 180° 但可重建)
    const r2 = evaluatePancreaticResectability({ smvPvDegree: ">180" });
    expect(r2.status).toBe("borderline_resectable");

    // 3. 局部进展不可切 (SMA/腹腔干侵犯)
    const r3 = evaluatePancreaticResectability({ smaInvolvement: true });
    expect(r3.status).toBe("locally_advanced");

    // 4. 远处转移
    const r4 = evaluatePancreaticResectability({ hasDistantMets: true });
    expect(r4.status).toBe("metastatic");
  });

  it("应正确防御 NaN 与非法非数值输入，安全回退不崩溃", () => {
    const res = computePancreaticStage({
      tumorSize: NaN as any,
      regionalNodesPositive: null,
      mStage: undefined,
    });
    expect(res.stage).toBeDefined();
    expect(res.explanation).not.toContain("NaN");
  });

  it("应匹配顶刊前瞻临床队列及其真实 PMID 和 DOI (PRODIGE 24 / PREOPANC / MPACT)", () => {
    // 早期切除术后 -> PRODIGE 24
    const cohortEarly = getPancreaticClinicalCohort({ stage: "IIB" });
    expect(cohortEarly.name).toContain("PRODIGE_24");
    expect(cohortEarly.pmid).toBe("30575490");
    expect(cohortEarly.doi).toBe("10.1056/NEJMoa1809775");
    expect(cohortEarly.confidenceRating).toBe("⭐⭐⭐⭐⭐");

    // 局部进展新辅助 -> PREOPANC
    const cohortIII = getPancreaticClinicalCohort({ stage: "III" });
    expect(cohortIII.name).toContain("PREOPANC");
    expect(cohortIII.pmid).toBe("35640799");

    // 晚期常规一线 -> MPACT
    const cohortIV = getPancreaticClinicalCohort({ stage: "IV" });
    expect(cohortIV.name).toContain("MPACT");
    expect(cohortIV.pmid).toBe("24131140");
  });

  it("对晚期携带胚系 BRCA 突变患者应精准匹配 POLO 奥拉帕利维持队列", () => {
    const cohortBrca = getPancreaticClinicalCohort({ stage: "IV", brcaMutation: "positive" });
    expect(cohortBrca.name).toContain("POLO");
    expect(cohortBrca.pmid).toBe("31157963");
    expect(cohortBrca.rfs5Year).toContain("7.4月");
  });

  it("应成功拦截强 CYP3A4 诱导剂严重配伍禁忌 (奥拉帕利 + 利福平)", () => {
    const ddi = checkPancreaticDrugInteractions("pancreatic_olaparib", ["rifampin"]);
    expect(ddi.overallStatus).toBe("danger");
    expect(ddi.severeCount).toBeGreaterThanOrEqual(1);
    expect(ddi.summaryText).toContain("严重配伍禁忌");
  });

  it("应正确识别厄洛替尼与质子泵抑制剂 (PPI) 的时序隔离与错峰指导", () => {
    const ddi = checkPancreaticDrugInteractions("pancreatic_erlotinib", ["omeprazole"]);
    expect(ddi.overallStatus).toBe("warning");
    expect(ddi.cautionCount).toBeGreaterThanOrEqual(1);
    expect(ddi.dailySchedulePlan.length).toBeGreaterThan(0);
    expect(ddi.dailySchedulePlan.some(p => p.timeSlot.includes("清晨空腹"))).toBe(true);
    expect(ddi.dailySchedulePlan.some(p => p.timeSlot.includes("睡前"))).toBe(true);
  });

  it("无危险药物相互作用时应判定为安全状态 (safe)", () => {
    const ddi = checkPancreaticDrugInteractions("pancreatic_olaparib", []);
    expect(ddi.overallStatus).toBe("safe");
    expect(ddi.severeCount).toBe(0);
  });

  it("注册中心与别名解析应正确挂载并识别胰腺癌", () => {
    expect(CancerRegistry.has("pancreatic")).toBe(true);
    const plugin = CancerRegistry.get("pancreatic");
    expect(plugin.name).toBe("胰腺癌");
    expect(plugin.organ).toBe("pancreas");
    expect(plugin.theme.primaryColor).toContain("orange");

    expect(normalizeCancerType("胰腺癌")).toBe("pancreatic");
    expect(normalizeCancerType("胰腺")).toBe("pancreatic");
    expect(normalizeCancerType("pancreas")).toBe("pancreatic");
  });
});
