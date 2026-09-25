import { describe, it, expect } from "vitest";
import {
  LIVER_TARGETED_DRUGS,
  LIVER_DDI_RULES,
  checkLiverDrugInteractions,
} from "@/lib/liverDdiData";
import { checkDrugInteractionsUnified } from "@/lib/ddiRegistry";

describe("Liver Cancer (HCC) DDI & Pharmacological Safety Engine", () => {
  it("should provide 10 representative HCC targeted, systemic, and antiviral drugs", () => {
    expect(LIVER_TARGETED_DRUGS).toHaveLength(10);
    const ids = LIVER_TARGETED_DRUGS.map((d) => d.id);
    expect(ids).toContain("atezolizumab");
    expect(ids).toContain("bevacizumab");
    expect(ids).toContain("sintilimab");
    expect(ids).toContain("lenvatinib");
    expect(ids).toContain("donafenib");
    expect(ids).toContain("sorafenib");
    expect(ids).toContain("regorafenib");
    expect(ids).toContain("camrelizumab");
    expect(ids).toContain("entecavir");
    expect(ids).toContain("tenofovir_alafenamide");
  });

  it("should intercept Lenvatinib + Warfarin fatal gastrointestinal bleeding contraindication", () => {
    const result = checkLiverDrugInteractions("lenvatinib", ["warfarin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.severeCount).toBeGreaterThanOrEqual(1);
    expect(result.interactions[0].rule.id).toBe("liver-ddi-tki-warfarin-bleeding");
    expect(result.interactions[0].rule.mechanism).toContain("出血");
  });

  it("should intercept Lenvatinib + Rifampin (strong CYP3A4 inducer) severe contraindication", () => {
    const result = checkLiverDrugInteractions("lenvatinib", ["rifampin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.severeCount).toBeGreaterThanOrEqual(1);
    expect(result.interactions[0].rule.id).toBe("liver-ddi-tki-rifampin-induction");
    expect(result.interactions[0].rule.mechanism).toContain("CYP3A4");
  });

  it("should warn timing requirement for Entecavir fasting requirement", () => {
    const result = checkLiverDrugInteractions("entecavir", ["omeprazole"]);
    expect(result.overallStatus).toBe("warning");
    expect(result.cautionCount).toBeGreaterThanOrEqual(1);
    expect(result.interactions[0].rule.id).toBe("liver-ddi-etv-fasting-timing");
    expect(result.interactions[0].rule.timingRecommendation).toContain("空腹");
  });

  it("should route correctly through unified DDI registry for HCC drugs", () => {
    const unifiedRes = checkDrugInteractionsUnified({
      cancerType: "liver",
      targetedDrugId: "lenvatinib",
      chronicDrugIds: ["warfarin", "rifampin"],
    });
    expect(unifiedRes.overallStatus).toBe("danger");
    expect(unifiedRes.severeCount).toBe(2);
  });
});
