import { describe, it, expect } from "vitest";
import { getClinicalCohortUnified } from "@/lib/stagingRegistry";

describe("Lung & Breast Fine-Grained Landmark Clinical Cohorts Stratification", () => {
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
});
