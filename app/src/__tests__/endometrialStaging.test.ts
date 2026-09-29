import { describe, it, expect } from "vitest";
import { 
  computeEndometrialStage, 
  computeEndometrialClinicalCohort 
} from "@/lib/endometrialStaging";
import { computeCancerStage } from "@/lib/stagingRegistry";

describe("Endometrial Cancer (FIGO 2023 & TCGA 4 Molecular Subtypes) Staging Engine", () => {
  describe("FIGO 2023 Molecular Subtype Reclassification & De-escalation", () => {
    it("should downstage POLEmut patient to IAm_POLEmut even with G3 poorly differentiated histology and deep invasion", () => {
      // 52岁患者，病理为低分化 (G3) 且浸润肌层 >=50%，但在 FIGO 2023 中检出致病性 POLE 突变，权威降阶梯至 IAm_POLEmut
      const result = computeEndometrialStage({
        patientAge: 52,
        histologyType: "endometrioid_G3",
        differentiation: "poor_G3",
        myometrialInvasion: "greater_equal_50",
        poleMutationStatus: "pathogenic_mutant",
        cervicalInvolvement: "none",
        pelvicNodesPositive: 0,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("IAm_POLEmut");
      expect(result.explanation).toContain("POLE 超突变型");
      expect(result.therapeuticStrategy).toContain("PORTEC-4a");
      expect(result.therapeuticStrategy).toContain("安全降阶梯");
      expect(result.keyFactors).toContain("POLE 催化亚基致病性突变 (超突变型)");
    });

    it("should upstage p53abn patient to IICm_p53abn when any myometrial invasion is present (even <50%)", () => {
      // 普通内膜样腺癌伴浅肌层浸润 (<50%)，若 p53 异常表达，FIGO 2023 规定直接升期至 IICm_p53abn
      const result = computeEndometrialStage({
        patientAge: 62,
        histologyType: "endometrioid_G2",
        myometrialInvasion: "less_than_50",
        p53Status: "aberrant_null_or_overexpressed",
        cervicalInvolvement: "none",
        pelvicNodesPositive: 0,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("IICm_p53abn");
      expect(result.explanation).toContain("IICm_p53abn");
      expect(result.therapeuticStrategy).toContain("紫杉醇+卡铂 (TC)");
      expect(result.therapeuticStrategy).toContain("PORTEC-3");
      expect(result.riskFlags).toContain("p53abn 属于高危亚型，具有侵袭性生物学行为，需强化化疗覆盖");
    });

    it("should classify standard G1/G2 MMRd/NSMP with shallow invasion as Stage IA", () => {
      const result = computeEndometrialStage({
        patientAge: 56,
        histologyType: "endometrioid_G1",
        differentiation: "well_G1",
        myometrialInvasion: "less_than_50",
        mmrStatus: "dMMR",
        p53Status: "wildtype",
        cervicalInvolvement: "none",
      });

      expect(result.stage).toBe("IA");
      expect(result.therapeuticStrategy).toContain("无需任何辅助放化疗");
    });

    it("should classify cervical stromal invasion as Stage IIA", () => {
      const result = computeEndometrialStage({
        patientAge: 59,
        histologyType: "endometrioid_G2",
        cervicalInvolvement: "stromal_invasion",
        pelvicNodesPositive: 0,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("IIA");
      expect(result.explanation).toContain("IIA 期 (肿瘤累及宫颈间质浸润");
    });

    it("should classify pelvic node metastasis as IIIC1 and para-aortic node metastasis as IIIC2", () => {
      const resultPelvic = computeEndometrialStage({
        patientAge: 55,
        pelvicNodesPositive: 2,
        paraAorticNodesPositive: 0,
        hasDistantMets: false,
      });
      expect(resultPelvic.stage).toBe("IIIC1");

      const resultAortic = computeEndometrialStage({
        patientAge: 55,
        pelvicNodesPositive: 1,
        paraAorticNodesPositive: 2,
        hasDistantMets: false,
      });
      expect(resultAortic.stage).toBe("IIIC2");
      expect(resultAortic.therapeuticStrategy).toContain("延伸野");
    });
  });

  describe("Young Patient Fertility Sparing Evaluation", () => {
    it("should identify young G1 patient with no myometrial invasion as candidate for high-dose progestin", () => {
      const result = computeEndometrialStage({
        patientAge: 29,
        histologyType: "endometrioid_G1",
        differentiation: "well_G1",
        myometrialInvasion: "none",
        fertilityPreservationDesired: true,
        cervicalInvolvement: "none",
        pelvicNodesPositive: 0,
        hasDistantMets: false,
      });

      expect(result.keyFactors).toContain("年轻早期保育候选者: G1高分化内膜样腺癌且MRI证实未侵及肌层");
      expect(result.keyFactors?.some(k => k.includes("醋酸甲地孕酮 (MA 160mg/d)"))).toBe(true);
    });
  });

  describe("Clinical Landmark Cohorts Matching", () => {
    it("matches PORTEC-4a cohort for POLEmut", () => {
      const cohort = computeEndometrialClinicalCohort({
        stage: "IAm_POLEmut",
        molecularSubtype: "POLEmut",
      });

      expect(cohort.name).toContain("PORTEC-4a");
      expect(cohort.rfs5Year).toContain("96.8%");
      expect(cohort.metric3?.value).toBe("96.2%");
    });

    it("matches RUBY / NRG-GY018 cohort for advanced dMMR", () => {
      const cohort = computeEndometrialClinicalCohort({
        stage: "IIIC1",
        molecularSubtype: "MMRd",
        clinicalData: { mmrStatus: "dMMR" },
      });

      expect(cohort.name).toContain("RUBY Part 1");
      expect(cohort.hazardRatio).toContain("0.28");
      expect(cohort.metric3?.label).toBe("免疫应答持久持续率");
    });

    it("matches fertility preservation cohort for young early patient desiring pregnancy", () => {
      const cohort = computeEndometrialClinicalCohort({
        stage: "IA",
        clinicalData: {
          fertilityPreservationDesired: true,
          myometrialInvasion: "none",
        }
      });

      expect(cohort.name).toContain("保留生育功能前瞻队列");
      expect(cohort.rfs5Year).toContain("78.5%");
      expect(cohort.metric3?.label).toBe("子宫器官保留率");
    });
  });

  describe("Unified Staging Registry Integration", () => {
    it("correctly calls endometrial staging from computeCancerStage", () => {
      const unified = computeCancerStage("endometrial", {
        patientAge: 48,
        molecularSubtype: "POLEmut",
        myometrialInvasion: "greater_equal_50",
      });

      expect(unified.cancerType).toBe("endometrial");
      expect(unified.stage).toBe("IAm_POLEmut");
    });

    it("normalizes '子宫内膜癌' and '子宫癌' to endometrial plugin", () => {
      const res = computeCancerStage("子宫内膜癌", {
        molecularSubtype: "POLEmut",
      });
      expect(res.cancerType).toBe("endometrial");
    });
  });
});
