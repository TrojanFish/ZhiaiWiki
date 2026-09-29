import { describe, it, expect } from "vitest";
import { 
  computeThyroidStage, 
  evaluateTirads, 
  evaluateAtaRisk 
} from "@/lib/thyroidStaging";
import { computeCancerStage, getClinicalCohortUnified } from "@/lib/stagingRegistry";

describe("Thyroid Cancer (AJCC 8th & C-TIRADS & ATA 2015) Staging Engine", () => {
  describe("AJCC 8th Age 55 Cutoff Algorithm for Differentiated Thyroid Carcinoma (PTC/FTC)", () => {
    it("should classify young patient (<55 yo) with extensive lymph node metastasis (N1b) as Stage I when M0", () => {
      // 32岁年轻患者，即便侵犯带状肌 (T3b) 且有颈侧区淋巴结转移 (N1b)，只要无远处转移 (M0)，全部定为 Stage I！
      const result = computeThyroidStage({
        patientAge: 32,
        histologyType: "PTC_classic",
        tumorSize: 2.5,
        extrathyroidalExtension: "strap_muscles_t3b",
        lateralNodesPositive: 4,
        centralNodesPositive: 6,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("I");
      expect(result.tStage).toBe("T3b");
      expect(result.nStage).toBe("N1b");
      expect(result.mStage).toBe("M0");
      expect(result.description).toContain("<55岁无远处转移");
      expect(result.keyFactors).toContain("诊断年龄: 32 岁 (<55岁年轻保护队列)");
    });

    it("should classify young patient (<55 yo) with distant metastases (M1) as Stage II (never III or IV!)", () => {
      const result = computeThyroidStage({
        patientAge: 28,
        histologyType: "PTC_classic",
        tumorSize: 1.8,
        hasDistantMets: true,
        metastasisSites: ["lung"],
      });

      expect(result.stage).toBe("II");
      expect(result.mStage).toBe("M1");
      expect(result.description).toContain("<55岁伴远处转移");
      expect(result.therapeuticStrategy).toContain("大剂量碘-131");
    });

    it("should classify older patient (>=55 yo) T1N0M0 as Stage I", () => {
      const result = computeThyroidStage({
        patientAge: 60,
        histologyType: "PTC_classic",
        tumorSize: 1.2,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("I");
      expect(result.tStage).toBe("T1b");
      expect(result.nStage).toBe("N0");
      expect(result.mStage).toBe("M0");
      expect(result.keyFactors).toContain("诊断年龄: 60 岁 (>=55岁成熟队列)");
    });

    it("should classify older patient (>=55 yo) with lymph node metastasis as Stage II", () => {
      const result = computeThyroidStage({
        patientAge: 58,
        histologyType: "PTC_classic",
        tumorSize: 1.5,
        centralNodesPositive: 3,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("II");
      expect(result.tStage).toBe("T1b");
      expect(result.nStage).toBe("N1a");
      expect(result.mStage).toBe("M0");
      expect(result.description).toContain(">=55岁伴淋巴结转移");
    });

    it("should handle string coerced ages and defensive numeric defaults gracefully", () => {
      const result = computeThyroidStage({
        patientAge: "58" as any,
        tumorSize: "2.4" as any,
        histologyType: "PTC_classic",
        hasDistantMets: false,
      });

      expect(result.stage).toBe("I"); // AJCC 8th: 58yo (>=55) with T2N0M0 is Stage I
      expect(result.tStage).toBe("T2");
      expect(result.keyFactors).toContain("诊断年龄: 58 岁 (>=55岁成熟队列)");
    });

    it("should classify older patient (>=55 yo) T4a local invasion as Stage III", () => {
      const result = computeThyroidStage({
        patientAge: 65,
        histologyType: "PTC_classic",
        extrathyroidalExtension: "gross_organs_t4a", // 侵犯气管/喉返神经
        hasDistantMets: false,
      });

      expect(result.stage).toBe("III");
      expect(result.tStage).toBe("T4a");
      expect(result.description).toContain("III 期");
    });

    it("should classify older patient (>=55 yo) T4b major vessel encasement as Stage IVA", () => {
      const result = computeThyroidStage({
        patientAge: 68,
        histologyType: "PTC_classic",
        extrathyroidalExtension: "prevertebral_carotid_t4b", // 包绕颈总动脉
        hasDistantMets: false,
      });

      expect(result.stage).toBe("IVA");
      expect(result.tStage).toBe("T4b");
      expect(result.description).toContain("IVA 期");
    });

    it("should classify older patient (>=55 yo) M1 distant metastasis as Stage IVB", () => {
      const result = computeThyroidStage({
        patientAge: 62,
        histologyType: "PTC_classic",
        tumorSize: 3.0,
        hasDistantMets: true,
        metastasisSites: ["bone"],
      });

      expect(result.stage).toBe("IVB");
      expect(result.mStage).toBe("M1");
      expect(result.description).toContain("IVB 期");
      expect(result.therapeuticStrategy).toContain("仑伐替尼或索拉非尼");
    });
  });

  describe("Medullary Thyroid Carcinoma (MTC) Staging", () => {
    it("should stage localized MTC T1N0M0 as Stage I regardless of age", () => {
      const result = computeThyroidStage({
        patientAge: 35,
        histologyType: "MTC",
        tumorSize: 1.5,
        calcitoninLevel: 85,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("I");
      expect(result.tStage).toBe("T1b");
      expect(result.nStage).toBe("N0");
      expect(result.keyFactors).toContain("血清降钙素基线: 85 pg/mL");
    });

    it("should stage MTC with central node metastasis N1a as Stage III", () => {
      const result = computeThyroidStage({
        patientAge: 40,
        histologyType: "MTC",
        tumorSize: 1.8,
        centralNodesPositive: 2,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("III");
      expect(result.nStage).toBe("N1a");
      expect(result.description).toContain("甲状腺髓样癌 III 期");
    });

    it("should stage MTC with lateral node metastasis N1b as Stage IVA", () => {
      const result = computeThyroidStage({
        patientAge: 42,
        histologyType: "MTC",
        tumorSize: 2.2,
        lateralNodesPositive: 3,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("IVA");
      expect(result.nStage).toBe("N1b");
      expect(result.therapeuticStrategy).toContain("无需碘-131");
    });

    it("should stage MTC with distant metastasis as Stage IVC", () => {
      const result = computeThyroidStage({
        patientAge: 50,
        histologyType: "MTC",
        hasDistantMets: true,
        metastasisSites: ["liver"],
      });

      expect(result.stage).toBe("IVC");
      expect(result.mStage).toBe("M1");
      expect(result.therapeuticStrategy).toContain("普拉替尼或塞珀替尼");
    });
  });

  describe("Anaplastic Thyroid Carcinoma (ATC) Staging", () => {
    it("should classify ATC as Stage IV without exception", () => {
      const atcLocalized = computeThyroidStage({
        patientAge: 70,
        histologyType: "ATC",
        tumorSize: 3.5,
        hasDistantMets: false,
      });
      expect(atcLocalized.stage).toBe("IVA");

      const atcInvasive = computeThyroidStage({
        patientAge: 72,
        histologyType: "ATC",
        extrathyroidalExtension: "gross_organs_t4a",
        centralNodesPositive: 4,
        hasDistantMets: false,
      });
      expect(atcInvasive.stage).toBe("IVB");

      const atcM1 = computeThyroidStage({
        patientAge: 68,
        histologyType: "ATC",
        hasDistantMets: true,
      });
      expect(atcM1.stage).toBe("IVC");
      expect(atcM1.therapeuticStrategy).toContain("达拉非尼+曲美替尼双靶");
    });
  });

  describe("C-TIRADS 2020 Ultrasound Risk Assessment", () => {
    it("should identify pure cystic nodule as TIRADS 2 (0% malignancy risk)", () => {
      const tirads = evaluateTirads({
        ultrasoundTirads: "2",
        tumorSize: 2.0,
      });
      expect(tirads.malignancyRisk).toContain("0%");
      expect(tirads.fnaRecommendation).toContain("无需穿刺");
    });

    it("should evaluate 4B nodule >=1.0cm with microcalcifications and A/T > 1 as strong FNA candidate", () => {
      const tirads = evaluateTirads({
        aspectRatioGtOne: true,
        microcalcifications: true,
        hypoechoic: "moderate",
        tumorSize: 1.2,
      });
      expect(["4B", "4C"]).toContain(tirads.tiradsClass);
      expect(tirads.fnaRecommendation).toContain("推荐");
    });
  });

  describe("ATA 2015 Risk of Recurrence & TSH Suppression Target", () => {
    it("should assign low risk and TSH 0.5~2.0 for unifocal small nodule with lobectomy", () => {
      const risk = evaluateAtaRisk({
        surgicalMethod: "lobectomy",
      }, "T1a", "N0", "M0");

      expect(risk.ataRiskLevel).toBe("low");
      expect(risk.tshSuppressionTarget).toBe("0.5 ~ 2.0 mIU/L");
      expect(risk.rationale).toContain("避免过度抑制诱发房颤及骨质疏松");
    });

    it("should assign intermediate risk and TSH 0.1~0.5 for N1a or strap muscle invasion", () => {
      const risk = evaluateAtaRisk({
        centralNodesPositive: 6,
      }, "T3b", "N1a", "M0");

      expect(risk.ataRiskLevel).toBe("intermediate");
      expect(risk.tshSuppressionTarget).toBe("0.1 ~ 0.5 mIU/L");
    });

    it("should assign high risk and strict TSH < 0.1 for M1 or T4 invasion", () => {
      const risk = evaluateAtaRisk({}, "T4a", "N1b", "M1");
      expect(risk.ataRiskLevel).toBe("high");
      expect(risk.tshSuppressionTarget).toBe("< 0.1 mIU/L");
    });
  });

  describe("Unified Staging Registry Dynamic Dispatch", () => {
    it("should dispatch thyroid staging from unified registry", () => {
      const result = computeCancerStage("thyroid", {
        patientAge: 30,
        histologyType: "PTC_classic",
        tumorSize: 1.0,
        hasDistantMets: false,
      });

      expect(result.stage).toBe("I");
      expect(result.tStage).toBe("T1a");
      expect(result.therapeuticStrategy).toContain("微小乳头状癌");
    });

    it("should match longitudinal survival cohort for thyroid cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "thyroid",
        stage: "I",
        histologyType: "PTC_classic",
      });

      expect(cohort.name).toContain("Kuma 医院");
      expect(cohort.rfs5Year).toContain("98.5%");
    });

    it("should return Tx and unknown stage when tumor size is missing/NaN in elderly patient", () => {
      const res = computeThyroidStage({
        patientAge: 60,
        tumorSize: NaN as any,
        centralNodesPositive: 0,
        lateralNodesPositive: 0,
        hasDistantMets: false,
      });
      expect(res.tStage).toBe("Tx");
      expect(res.stage).toContain("未知分期");
      expect(res.explanation).toContain("需结合影像或病理补充病灶长径");
    });
  });
});
