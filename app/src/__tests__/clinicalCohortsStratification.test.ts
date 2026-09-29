import { describe, it, expect } from "vitest";
import { getClinicalCohortUnified } from "@/lib/stagingRegistry";

describe("8 Major Cancers Fine-Grained Landmark Clinical Cohorts Stratification", () => {
  describe("1. Lung Cancer (CheckMate-816, FLAURA2, CROWN)", () => {
    it("should match CheckMate-816 pCR cohort when patient achieves complete pathological response after neoadjuvant chemo-immuno", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "lung",
        stage: "IIIA",
        tStage: "ypT0",
        nStage: "ypN0",
        mStage: "M0",
        neoadjuvantTherapy: true,
        pcrStatus: "pCR",
      });

      expect(cohort.name).toBe("CheckMate816_Neoadjuvant_pCR");
      expect(cohort.os5Year).toContain("95.0%");
      expect(cohort.source).toContain("CheckMate-816");
      expect(cohort.hazardRatio).toContain("0.24");
    });

    it("should match CheckMate-816 residual cohort when patient has non-pCR residual disease after neoadjuvant chemo-immuno", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "lung",
        stage: "IIB",
        tStage: "ypT2a",
        nStage: "ypN0",
        neoadjuvantTherapy: true,
        pcrStatus: "non-pCR",
      });

      expect(cohort.name).toBe("CheckMate816_Neoadjuvant_Residual");
      expect(cohort.os5Year).toContain("78%");
      expect(cohort.source).toContain("CheckMate-816");
    });

    it("should match FLAURA2 combination cohort for EGFR mutant metastatic Stage IV lung cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "lung",
        stage: "IVB",
        mStage: "M1c",
        egfr: "positive",
      });

      expect(cohort.name).toBe("FLAURA2_EGFR_Combination");
      expect(cohort.rfs5Year).toContain("25.5月");
      expect(cohort.source).toContain("FLAURA2");
      expect(cohort.hazardRatio).toContain("0.62");
    });

    it("should match CROWN Lorlatinib cohort for ALK positive metastatic Stage IV lung cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "lung",
        stage: "IVB",
        mStage: "M1c",
        geneMutations: [{ gene: "ALK", status: "positive" }],
      });

      expect(cohort.name).toBe("CROWN_Lorlatinib_Cohort");
      expect(cohort.rfs5Year).toContain("60.0%");
      expect(cohort.source).toContain("CROWN");
      expect(cohort.hazardRatio).toContain("0.19");
    });
  });

  describe("2. Breast Cancer (DESTINY-Breast04, KATHERINE, CREATE-X)", () => {
    it("should match DESTINY-Breast04 T-DXd cohort for Stage IV HER2-low breast cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "breast",
        stage: "IV",
        mStage: "M1",
        her2Status: "IHC_1plus",
      });

      expect(cohort.name).toBe("DESTINY_Breast04_HER2Low");
      expect(cohort.os5Year).toContain("23.4月");
      expect(cohort.source).toContain("DESTINY-Breast04");
      expect(cohort.hazardRatio).toContain("0.64");
    });

    it("should match KATHERINE T-DM1 cohort for HER2+ with residual disease (non-pCR)", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "breast",
        stage: "IIB",
        tStage: "ypT2",
        nStage: "ypN1",
        her2Status: "positive",
        neoadjuvantChemo: true,
        pcrStatus: "non-pCR",
      });

      expect(cohort.name).toBe("KATHERINE_TDM1_Residual");
      expect(cohort.os5Year).toContain("89.1%");
      expect(cohort.source).toContain("KATHERINE");
      expect(cohort.hazardRatio).toContain("0.50");
    });

    it("should match CREATE-X Capecitabine cohort for TNBC with residual disease (non-pCR)", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "breast",
        stage: "IIIA",
        tStage: "ypT2",
        nStage: "ypN1",
        erStatus: "negative",
        prStatus: "negative",
        her2Status: "negative",
        neoadjuvantChemo: true,
        pcrStatus: "non-pCR",
      });

      expect(cohort.name).toBe("CREATE_X_Capecitabine_Residual");
      expect(cohort.os5Year).toContain("78.8%");
      expect(cohort.source).toContain("CREATE-X");
      expect(cohort.hazardRatio).toContain("0.52");
    });
  });

  describe("3. Colorectal Cancer (NICHE-2, PRODIGE 23, OPRA)", () => {
    it("should match NICHE-2 cohort for dMMR Stage III colon cancer receiving neoadjuvant dual immunotherapy", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "colon",
        stage: "IIIB",
        tStage: "T3",
        nStage: "N1",
        dmmrStatus: "dMMR",
      });

      expect(cohort.name).toBe("NICHE2_dMMR_Neoadjuvant_Cohort");
      expect(cohort.rfs5Year).toContain("100%");
      expect(cohort.source).toContain("NICHE-2");
    });

    it("should match PRODIGE 23 TNT cohort for LARC rectal cancer treated with mFOLFIRINOX", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "rectal",
        stage: "IIIB",
        neoadjuvantRegimen: "mFOLFIRINOX",
      });

      expect(cohort.name).toBe("PRODIGE23_TNT_Cohort");
      expect(cohort.os5Year).toContain("82.0%");
      expect(cohort.source).toContain("PRODIGE 23");
      expect(cohort.hazardRatio).toContain("0.69");
    });

    it("should match OPRA Watch & Wait cohort for rectal cancer achieving cCR", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "rectal",
        stage: "IIIB",
        pcrStatus: "cCR",
      });

      expect(cohort.name).toBe("OPRA_WatchAndWait_Cohort");
      expect(cohort.os5Year).toContain("92.0%");
      expect(cohort.source).toContain("OPRA");
    });
  });

  describe("4. Gastric Cancer (KEYNOTE-811, FLOT4 pCR/perioperative, CLASSIC)", () => {
    it("should match KEYNOTE-811 HER2+ immunotherapy cohort for Stage IV gastric cancer with PD-L1 CPS>=1", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "gastric",
        stage: "IV",
        mStage: "M1",
        her2Status: "positive",
        pdl1Cps: 5,
      });

      expect(cohort.name).toBe("KEYNOTE811_HER2_Immuno_Cohort");
      expect(cohort.os5Year).toContain("20.0月");
      expect(cohort.source).toContain("KEYNOTE-811");
      expect(cohort.hazardRatio).toContain("0.72");
    });

    it("should match FLOT4 pCR cohort for gastric cancer achieving complete pathological response", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "gastric",
        stage: "III",
        neoadjuvantTherapy: true,
        pcrStatus: "pCR",
      });

      expect(cohort.name).toBe("FLOT4_pCR_Cohort");
      expect(cohort.os5Year).toContain("78.0%");
      expect(cohort.source).toContain("FLOT4");
    });

    it("should match FLOT4 perioperative cohort for locally advanced gastric/GEJ cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "gastric",
        stage: "III",
        regimen: "FLOT",
        neoadjuvantTherapy: true,
      });

      expect(cohort.name).toBe("FLOT4_Perioperative_Cohort");
      expect(cohort.os5Year).toContain("50.0月");
      expect(cohort.source).toContain("FLOT4");
      expect(cohort.hazardRatio).toContain("0.77");
    });

    it("should match CLASSIC XELOX cohort for D2 resected gastric cancer receiving adjuvant XELOX", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "gastric",
        stage: "III",
        adjuvantRegimen: "XELOX",
      });

      expect(cohort.name).toBe("CLASSIC_XELOX_Cohort");
      expect(cohort.os5Year).toContain("78.0%");
      expect(cohort.source).toContain("CLASSIC");
      expect(cohort.hazardRatio).toContain("0.66");
    });
  });

  describe("5. Liver Cancer (HIMALAYA, MVI High Risk, ORIENT-32)", () => {
    it("should match HIMALAYA STRIDE dual immunotherapy cohort for CNLC IIIb with bleeding risk", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "liver",
        cnlcStage: "IIIb",
        hasBleedingRisk: true,
      });

      expect(cohort.name).toBe("HIMALAYA_STRIDE_Cohort");
      expect(cohort.os5Year).toContain("30.7%");
      expect(cohort.source).toContain("HIMALAYA");
      expect(cohort.hazardRatio).toContain("0.78");
    });

    it("should match CNLC MVI high risk cohort for early liver cancer with microvascular invasion", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "liver",
        cnlcStage: "Ia",
        mviStatus: "positive",
      });

      expect(cohort.name).toBe("CNLC_MVI_HighRisk_Cohort");
      expect(cohort.rfs5Year).toContain("42.0%");
      expect(cohort.source).toContain("MVI");
      expect(cohort.hazardRatio).toContain("0.61");
    });
  });

  describe("6. Esophageal Cancer (CheckMate-577, CROSS, RATIONALE-306)", () => {
    it("should match CheckMate-577 adjuvant Nivolumab cohort for esophageal cancer with residual disease after nCRT", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "esophageal",
        stage: "III",
        neoadjuvantCRT: true,
        pcrStatus: "non-pCR",
      });

      expect(cohort.name).toBe("CheckMate577_Adjuvant_Cohort");
      expect(cohort.rfs5Year).toContain("22.4月");
      expect(cohort.source).toContain("CheckMate-577");
      expect(cohort.hazardRatio).toContain("0.69");
    });

    it("should match CROSS nCRT cohort when CROSS regimen is selected", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "esophageal",
        stage: "III",
        neoadjuvantRegimen: "CROSS",
      });

      expect(cohort.name).toBe("CROSS_nCRT_Cohort");
      expect(cohort.os5Year).toContain("47.0%");
      expect(cohort.source).toContain("CROSS");
      expect(cohort.hazardRatio).toContain("0.60");
    });

    it("should match RATIONALE-306 Tislelizumab cohort for Stage IV esophageal cancer", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "esophageal",
        stage: "IV",
        immunotherapy: "tislelizumab",
      });

      expect(cohort.name).toBe("RATIONALE306_Tislelizumab_Cohort");
      expect(cohort.os5Year).toContain("17.2月");
      expect(cohort.source).toContain("RATIONALE-306");
      expect(cohort.hazardRatio).toContain("0.66");
    });
  });

  describe("7. Thyroid Cancer (ESTIMABL2, ATA BRAF)", () => {
    it("should match ESTIMABL2 low-risk omission of RAI-131 cohort", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "thyroid",
        stage: "I",
        omissionOfRai: true,
      });

      expect(cohort.name).toBe("ESTIMABL2_LowRisk_NoRAI_Cohort");
      expect(cohort.rfs5Year).toContain("95.6%");
      expect(cohort.source).toContain("ESTIMABL2");
    });

    it("should match ATA BRAF high risk cohort for Stage II PTC with BRAF V600E mutation", () => {
      const cohort = getClinicalCohortUnified({
        cancerType: "thyroid",
        stage: "II",
        brafV600e: "positive",
      });

      expect(cohort.name).toBe("ATA_BRAF_HighRisk_Cohort");
      expect(cohort.rfs5Year).toContain("88.0%");
      expect(cohort.source).toContain("ATA 2015");
    });
  });
});
