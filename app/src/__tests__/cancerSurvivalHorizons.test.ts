import { describe, it, expect } from "vitest";
import { getCohortTimeHorizon, getOrGenerateKmArms } from "../lib/kmCurveHelper";
import { getBreastClinicalCohort } from "../lib/breastStaging";
import { computeThyroidClinicalCohort } from "../lib/thyroidStaging";
import { getPancreaticClinicalCohort } from "../lib/pancreaticStaging";
import { getColonClinicalCohort } from "../lib/colorectalStaging";
import { computeLiverClinicalCohort } from "../lib/liverStaging";
import { getGastricClinicalCohort } from "../lib/gastricStaging";

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

  it("should calibrate Thyroid PTMC low-risk cohort with 10~30 year DSS horizon (120m)", () => {
    const thyroidProfile = {
      cancerType: "thyroid",
      stage: "I",
      tStage: "T1a",
      nStage: "N0",
      histology: "PTC",
      tumorSize: 0.8,
    };
    const cohort = computeThyroidClinicalCohort(thyroidProfile);
    expect(cohort.displayMode).toBe("extended_10yr");
    expect(cohort.timeHorizonMonths).toBe(120);
    expect(cohort.metric3?.label).toContain("10~30年");

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(120);
    expect(horizon.months).toEqual([0, 24, 48, 72, 96, 120]);

    const arms = getOrGenerateKmArms(cohort);
    expect(arms[0].points.map((p) => p.month)).toEqual([0, 24, 48, 72, 96, 120]);
    // Low-risk PTMC 10-year DSS should be very high (>95%)
    expect(arms[0].points[arms[0].points.length - 1].rate).toBeGreaterThan(95);
  });

  it("should calibrate Pancreatic Stage IV POLO cohort with median_survival horizon (36m)", () => {
    const pancProfile = {
      cancerType: "pancreatic",
      stage: "IV",
      brcaMutation: "positive",
    };
    const cohort = getPancreaticClinicalCohort(pancProfile);
    expect(cohort.displayMode).toBe("median_survival");
    expect(cohort.timeHorizonMonths).toBe(36);
    expect(cohort.medianOsMonths).toBe(18.9);
    expect(cohort.metricLabel1).toContain("中位无进展生存");
    expect(cohort.metricLabel2).toContain("中位总生存期");

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(36);
    expect(horizon.isMedian).toBe(true);
    expect(horizon.medianMonths).toBe(18.9);
    expect(horizon.months).toEqual([0, 6, 12, 18, 24, 36]);

    const arms = getOrGenerateKmArms(cohort);
    expect(arms[0].points.map((p) => p.month)).toEqual([0, 6, 12, 18, 24, 36]);
    // In exponential decay with mOS 18.9m, at month 18 rate should be close to 50%
    const pt18 = arms[0].points.find((p) => p.month === 18);
    expect(pt18).toBeDefined();
    expect(pt18!.rate).toBeGreaterThan(45);
    expect(pt18!.rate).toBeLessThan(55);
  });

  it("should calibrate Colon Stage III IDEA cohort with intermediate_3yr horizon", () => {
    const colonProfile = {
      cancerType: "colon",
      stage: "III",
      tStage: "T2",
      nStage: "N1",
    };
    const cohort = getColonClinicalCohort(colonProfile);
    expect(cohort.displayMode).toBe("intermediate_3yr");
    expect(cohort.metricLabel1).toContain("3年无病生存率");

    const horizon = getCohortTimeHorizon(cohort);
    expect(horizon.maxMonth).toBe(60);
    expect(horizon.months).toEqual([0, 12, 24, 36, 48, 60]);
  });

  it("should calibrate Gastric RESOLVE / CLASSIC cohorts with 3-year DFS milestone", () => {
    const gastricProfile = {
      cancerType: "gastric",
      stage: "III",
      tStage: "T3",
      nStage: "N1",
      adjuvantRegimen: "XELOX",
    };
    const cohort = getGastricClinicalCohort(gastricProfile);
    expect(cohort.displayMode).toBe("intermediate_3yr");
    expect(cohort.metricLabel1).toContain("3");
    expect(cohort.metricLabel2).toContain("5年总生存率");
  });

  it("should calibrate Liver CNLC Ia early curative cohort with 2-year early recurrence focus", () => {
    const liverProfile = {
      cancerType: "liver",
      stage: "Ia",
      tumorSize: 2.5,
    };
    const cohort = computeLiverClinicalCohort(liverProfile);
    expect(cohort.displayMode).toBe("intermediate_3yr");
    expect(cohort.metricLabel1).toContain("2年早期无复发生存");
  });
});
