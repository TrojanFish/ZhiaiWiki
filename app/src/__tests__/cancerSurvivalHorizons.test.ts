import { describe, it, expect } from "vitest";
import { getCohortTimeHorizon, getOrGenerateKmArms } from "../lib/kmCurveHelper";
import { getBreastClinicalCohort } from "../lib/breastStaging";
import { getLungClinicalCohort } from "../lib/staging";

describe("Cancer-Specific Survival Horizons (Landmark Horizons) Engine", () => {
  it("should calibrate Breast Luminal A TAILORx cohort with 10-year extended horizon (120m)", () => {
    const breastProfile = {
      cancerType: "breast",
      stage: "IA",
      erStatus: "positive",
      prStatus: "positive",
      her2Status: "negative",
      molecularSubtype: "Luminal_A",
      oncoTypeScore: 10,
    };
    const cohort = getBreastClinicalCohort(breastProfile);
    expect(cohort.displayMode).toBe("extended_10yr");
    expect(cohort.timeHorizonMonths).toBe(120);
    expect(cohort.metricLabel1).toContain("10年");
    expect(cohort.metricLabel2).toContain("10~12年");

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(120);
    expect(horizon.isExtended).toBe(true);
    expect(horizon.months).toEqual([0, 24, 48, 72, 96, 120]);

    const arms = getOrGenerateKmArms(cohort);
    expect(arms.length).toBe(2);
    expect(arms[0].points.map((p) => p.month)).toEqual([0, 24, 48, 72, 96, 120]);
    expect(arms[0].points[arms[0].points.length - 1].month).toBe(120);
    expect(arms[0].points[arms[0].points.length - 1].rate).toBeGreaterThan(85);
  });

  it("should calibrate Lung Cancer Stage IA cohort with standard 5-year milestone (60m)", () => {
    const lungProfile = {
      cancerType: "lung" as const,
      tStage: "T1b",
      nStage: "N0",
      mStage: "M0",
      tumorSize: 1.5,
      solidSize: 1.5,
      noduleType: "pure_solid",
    };
    const cohort = getLungClinicalCohort(lungProfile);
    expect(cohort).toBeDefined();
    expect(cohort.stage).toContain("IA2");
    expect(cohort.rfs5Year).toBeDefined();
    expect(cohort.os5Year).toBeDefined();

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(60);
    expect(horizon.months).toEqual([0, 12, 24, 36, 48, 60]);

    const arms = getOrGenerateKmArms(cohort);
    expect(arms.length).toBeGreaterThanOrEqual(1);
    expect(arms[0].points.map((p) => p.month)).toEqual([0, 12, 24, 36, 48, 60]);
    expect(arms[0].points[arms[0].points.length - 1].month).toBe(60);
  });

  it("should calibrate Breast HER2+ APHINITY cohort with 5-year iDFS milestone", () => {
    const breastHer2Profile = {
      cancerType: "breast",
      stage: "IIA",
      erStatus: "negative",
      prStatus: "negative",
      her2Status: "positive",
      molecularSubtype: "HER2_Positive",
      nStage: "N1",
    };
    const cohort = getBreastClinicalCohort(breastHer2Profile);
    expect(cohort).toBeDefined();
    expect(cohort.source).toContain("APHINITY");

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(60);

    const arms = getOrGenerateKmArms(cohort);
    expect(arms.length).toBe(2);
    expect(arms[0].armName).toContain("APHINITY");
  });
});
