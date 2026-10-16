import { describe, it, expect } from "vitest";
import { CancerRegistry, CancerPluginSpec } from "@/lib/cancerRegistry";
import { computeCancerStage, getClinicalCohortUnified } from "@/lib/stagingRegistry";
import {
  getTargetedDrugsForCancer,
  checkDrugInteractionsUnified,
  getDefaultTargetDrugId,
} from "@/lib/ddiRegistry";

describe("CancerRegistry Plugin Architecture", () => {
  it("should have lung and breast plugins registered by default", () => {
    expect(CancerRegistry.has("lung")).toBe(true);
    expect(CancerRegistry.has("breast")).toBe(true);
    expect(CancerRegistry.has("pancreatic" as any)).toBe(false);
    expect(CancerRegistry.has("unknown_xyz" as any)).toBe(false);

    const types = CancerRegistry.getSupportedTypes();
    expect(types).toEqual(["lung", "breast"]);
  });

  it("should safely fallback to default (lung) for unknown cancer types", () => {
    const fallbackPlugin = CancerRegistry.get("non_existent_cancer" as any);
    expect(fallbackPlugin.id).toBe("lung");
    expect(fallbackPlugin.name).toBe("肺癌");
  });

  it("should dynamically generate CancerSwitch options", () => {
    const options = CancerRegistry.getOptions();
    expect(options.length).toBeGreaterThanOrEqual(2);
    const lungOption = options.find((o) => o.type === "lung");
    const breastOption = options.find((o) => o.type === "breast");

    expect(lungOption).toBeDefined();
    expect(lungOption?.label).toBe("肺癌");
    expect(lungOption?.icon).toBe("🫁");

    expect(breastOption).toBeDefined();
    expect(breastOption?.label).toBe("乳腺癌");
    expect(breastOption?.icon).toBe("🎗️");
  });

  it("should compute lung staging via unified staging registry", () => {
    const lungRes = computeCancerStage("lung", {
      tumorSize: 1.5,
      solidSize: 1.5,
      noduleType: "pure_solid",
      tStage: "T1b",
      nStage: "N0",
      mStage: "M0",
    });

    expect(lungRes.cancerType).toBe("lung");
    expect(lungRes.stage).toBe("IA2");
    expect(lungRes.tStage).toBe("T1b");
  });

  it("should compute breast prognostic staging via unified staging registry", () => {
    const breastRes = computeCancerStage("breast", {
      tumorSize: 1.8,
      tStage: "T1c",
      nStage: "N0",
      mStage: "M0",
      erStatus: "positive",
      prStatus: "positive",
      her2Status: "negative",
      grade: "1",
    });

    expect(breastRes.cancerType).toBe("breast");
    expect(breastRes.stage).toBe("IA");
    expect(breastRes.molecularSubtype).toBe("Luminal_A");
  });

  it("should dispatch getClinicalCohortUnified to respective cancer plugins", () => {
    // Lung profile
    const lungProfile = {
      cancerType: "lung" as const,
      tumorSize: "2.0",
      solidSize: "2.0",
      noduleType: "pure_solid",
      tStage: "T1b",
      nStage: "N0",
      mStage: "M0",
    };
    const lungCohort = getClinicalCohortUnified(lungProfile);
    expect(lungCohort).toBeDefined();
    expect(lungCohort.stage).toContain("IA2");

    // Breast profile
    const breastProfile = {
      cancerType: "breast" as const,
      tumorSize: "1.5",
      tStage: "T1c",
      nStage: "N0",
      mStage: "M0",
      erStatus: "positive",
      prStatus: "positive",
      her2Status: "negative",
      grade: "1",
    };
    const breastCohort = getClinicalCohortUnified(breastProfile);
    expect(breastCohort).toBeDefined();
    expect(breastCohort.source).toContain("TAILORx");
  });

  it("should provide cancer-specific pharmacology and DDI detection", () => {
    const lungDrugs = getTargetedDrugsForCancer("lung");
    const breastDrugs = getTargetedDrugsForCancer("breast");

    expect(lungDrugs.some((d) => d.id === "osimertinib")).toBe(true);
    expect(breastDrugs.some((d) => d.id === "tamoxifen")).toBe(true);
    expect(breastDrugs.some((d) => d.id === "palbociclib")).toBe(true);

    // Default drug IDs
    expect(getDefaultTargetDrugId("lung")).toBe("osimertinib");
    expect(getDefaultTargetDrugId("breast")).toBe("tamoxifen");

    // DDI test for breast tamoxifen + paroxetine (CYP2D6 inhibition)
    const tamoxifenDdi = checkDrugInteractionsUnified("breast", "tamoxifen", ["paroxetine"]);
    expect(tamoxifenDdi.interactions.length).toBeGreaterThan(0);
    expect((tamoxifenDdi as any).overallStatus).toBe("danger");
    expect((tamoxifenDdi as any).severeCount).toBe(1);

    // Auto-detection of targetId without explicit cancerType
    const autoDdi = checkDrugInteractionsUnified(undefined, "tamoxifen", ["paroxetine"]);
    expect(autoDdi.interactions.length).toBeGreaterThan(0);
    expect((autoDdi as any).overallStatus).toBe("danger");
  });

  it("should allow seamless third-party/future cancer plug-in (e.g. Colorectal Cancer CRC)", () => {
    const mockCrcPlugin: CancerPluginSpec = {
      id: "colorectal" as any,
      name: "结直肠癌",
      enName: "Colorectal Cancer",
      icon: "🪱",
      organ: "colorectal",
      guidelineStandard: "CSCO / NCCN 结直肠癌指南 2024",
      theme: {
        primaryColor: "text-emerald-700",
        badgeColor: "bg-white text-emerald-700",
        bgColor: "bg-emerald-50",
      },
      staging: {
        computeStage: (input: any) => ({
          cancerType: "colorectal" as any,
          stage: input.tStage === "T1" && input.nStage === "N0" ? "I期" : "II期",
          tStage: input.tStage || "T1",
          nStage: input.nStage || "N0",
          mStage: input.mStage || "M0",
          explanation: "结直肠癌 TNM 试行计算",
        }),
        getCohort: () => ({
          name: "CRC_COHORT",
          stage: "I期",
          cohortSize: 2000,
          rfs5Year: "90%",
          os5Year: "92%",
          confidenceRating: "⭐⭐⭐⭐⭐",
          confidenceLevel: "高置信度",
          source: "IDEA / CALGB 长期队列",
          description: "结直肠癌早期队列",
          isPreOp: false,
          keyFactors: [],
          matchedMorphology: "管状腺癌",
          riskTier: "minimal_risk",
        }),
      },
      pharmacology: {
        targetedDrugs: [
          {
            id: "cetuximab",
            genericName: "西妥昔单抗",
            brandName: "爱必妥 (Erbitux)",
            target: "EGFR",
            generation: "靶向大分子单抗",
            standardDosage: "500 mg/m² 每2周一次",
            metabolismPathway: "网状内皮系统清除",
            phDependent: false,
          },
        ],
        checkInteractions: () => ({
          targetedDrug: null,
          selectedChronicDrugs: [],
          totalChecked: 0,
          severeCount: 0,
          cautionCount: 0,
          safeCount: 1,
          overallStatus: "safe",
          summaryText: "未见已知高危药物相互作用",
          interactions: [],
          dailySchedulePlan: [],
        } as any),
        defaultTargetDrugId: "cetuximab",
      },
    };

    // 1. 无缝注册新癌种
    CancerRegistry.register(mockCrcPlugin);

    // 2. 检查注册状态
    expect(CancerRegistry.has("colorectal")).toBe(true);

    // 3. 动态 options 自动包含 CRC
    const updatedOptions = CancerRegistry.getOptions();
    const crcOption = updatedOptions.find((o) => o.type === ("colorectal" as any));
    expect(crcOption).toBeDefined();
    expect(crcOption?.label).toBe("结直肠癌");
    expect(crcOption?.icon).toBe("🪱");

    // 4. 统一分期引擎无缝支持 CRC
    const crcStageRes = computeCancerStage("colorectal" as any, {
      tStage: "T1",
      nStage: "N0",
    });
    expect(crcStageRes.stage).toBe("I期");
    expect(crcStageRes.cancerType).toBe("colorectal");

    // 5. 统一药理学自动包含 CRC 靶向药
    const crcDrugs = getTargetedDrugsForCancer("colorectal" as any);
    expect(crcDrugs.length).toBe(1);
    expect(crcDrugs[0].id).toBe("cetuximab");
  });

  it("should ensure all registered cancer plugins have domain-specific featured studies and drug policies", () => {
    const lung = CancerRegistry.get("lung");
    expect(lung.content?.featuredStudies?.length).toBeGreaterThan(0);
    expect(lung.content?.drugPolicies?.length).toBeGreaterThan(0);

    const breast = CancerRegistry.get("breast");
    expect(breast.content?.featuredStudies?.length).toBeGreaterThan(0);
    expect(breast.content?.featuredStudies?.some((s: any) => s.id === "tailorx_2018" || s.id === "aphinity_2017")).toBe(true);
    expect(breast.content?.drugPolicies?.length).toBeGreaterThan(0);
  });
});
