import { describe, it, expect } from "vitest";
import { 
  computeCervicalStage, 
  deriveCervicalTStage, 
  deriveCervicalNStage, 
  deriveCervicalMStage, 
  computeCervicalClinicalCohort 
} from "@/lib/cervicalStaging";
import { computeCancerStage, getClinicalCohortUnified } from "@/lib/stagingRegistry";

describe("Cervical Cancer (FIGO 2018 & AJCC 9th) Staging Engine", () => {
  describe("FIGO 2018 Size & Invasion Stratification", () => {
    it("should classify microscopic stromal invasion <=3mm as Stage IA1 and >3mm to <=5mm as Stage IA2", () => {
      const ia1 = computeCervicalStage({
        stromalInvasionMm: 2.2,
        coneMarginStatus: "negative",
      });
      expect(ia1.stage).toBe("IA1");
      expect(ia1.therapeuticStrategy).toContain("冷刀锥切 (CKC) 即可达到根治");

      const ia2 = computeCervicalStage({
        stromalInvasionMm: 4.1,
      });
      expect(ia2.stage).toBe("IA2");
      expect(ia2.therapeuticStrategy).toContain("广泛全子宫切除术");
    });

    it("should stratify visible lesions: IB1 (<=2cm), IB2 (2~4cm), IB3 (>4cm)", () => {
      const ib1 = computeCervicalStage({ tumorSize: 1.5 });
      expect(ib1.stage).toBe("IB1");

      const ib2 = computeCervicalStage({ tumorSize: 3.2 });
      expect(ib2.stage).toBe("IB2");

      const ib3 = computeCervicalStage({ tumorSize: 5.0 });
      expect(ib3.stage).toBe("IB3");
      expect(ib3.therapeuticStrategy).toContain("根治性同步放化疗 (CCRT");
    });

    it("should identify parametrial invasion as Stage IIB and mandate CCRT rather than direct surgery", () => {
      const iib = computeCervicalStage({
        tumorSize: 3.5,
        parametrialInvasion: true,
      });

      expect(iib.stage).toBe("IIB");
      expect(iib.therapeuticStrategy).toContain("绝不可行单纯全子宫切除术");
      expect(iib.therapeuticStrategy).toContain("根治性同步放化疗 (CCRT");
    });

    it("should upstage pelvic lymph node to IIIC1 and para-aortic node to IIIC2 (FIGO 2018 rule)", () => {
      const iiic1 = computeCervicalStage({
        pelvicNodesPositive: 2,
        paraAorticNodesPositive: 0,
        nodalStagingMethod: "pathologic_p",
      });
      expect(iiic1.stage).toBe("IIIC1p");
      expect(iiic1.therapeuticStrategy).toContain("盆腔根治性同步放化疗");

      const iiic2 = computeCervicalStage({
        pelvicNodesPositive: 1,
        paraAorticNodesPositive: 3,
        nodalStagingMethod: "radiologic_r",
      });
      expect(iiic2.stage).toBe("IIIC2r");
      expect(iiic2.therapeuticStrategy).toContain("延伸野体外照射");
    });
  });

  describe("Surgical Safety Guardrails & LACC Trial Alerts", () => {
    it("should emit warning when laparoscopic radical hysterectomy is chosen due to LACC trial evidence", () => {
      const res = computeCervicalStage({
        tumorSize: 1.8,
        surgicalMethod: "radical_hysterectomy_laparoscopic",
      });

      expect(res.riskFlags?.some(f => f.includes("LACC 顶刊试验警示"))).toBe(true);
    });

    it("should identify early <=2cm young patient as candidate for radical trachelectomy", () => {
      const res = computeCervicalStage({
        tumorSize: 1.6,
        fertilityPreservationDesired: true,
      });

      expect(res.keyFactors?.some(k => k.includes("广泛宫颈切除术 (Radical Trachelectomy)"))).toBe(true);
    });
  });

  describe("Clinical Landmark Cohorts Matching", () => {
    it("matches EMBRACE-I cohort for locally advanced cervical cancer", () => {
      const cohort = computeCervicalClinicalCohort({
        stage: "IIB",
      });

      expect(cohort.name).toContain("EMBRACE-I");
      expect(cohort.rfs5Year).toContain("92.0%");
      expect(cohort.os5Year).toContain("74.0%");
      expect(cohort.metric3?.label).toBe("盆腔器官功能保全率");
    });

    it("matches KEYNOTE-826 cohort for metastatic/recurrent cervical cancer", () => {
      const cohort = computeCervicalClinicalCohort({
        stage: "IVB",
      });

      expect(cohort.name).toContain("KEYNOTE-826");
      expect(cohort.hazardRatio).toContain("0.64");
      expect(cohort.metric3?.label).toBe("客观缓解率 (ORR)");
    });

    it("matches LACC open surgery cohort for early stage", () => {
      const cohort = computeCervicalClinicalCohort({
        stage: "IB1",
      });

      expect(cohort.name).toContain("LACC Trial");
      expect(cohort.rfs5Year).toContain("96.5%");
    });
  });

  describe("Unified Staging Registry Integration", () => {
    it("correctly calls cervical staging from computeCancerStage", () => {
      const unified = computeCancerStage("cervical", {
        tumorSize: 4.5,
      });

      expect(unified.cancerType).toBe("cervical");
      expect(unified.stage).toBe("IB3");
    });

    it("normalizes '宫颈癌' and 'cervix' to cervical plugin", () => {
      const res = computeCancerStage("宫颈癌", {
        stromalInvasionMm: 2.0,
      });
      expect(res.cancerType).toBe("cervical");
      expect(res.stage).toBe("IA1");
    });
  });
});
