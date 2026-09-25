import { describe, it, expect } from "vitest";
import {
  ESOPHAGEAL_TARGETED_DRUGS,
  ESOPHAGEAL_DDI_RULES,
  checkEsophagealDrugInteractions,
} from "@/lib/esophagealDdiData";
import { checkDrugInteractionsUnified } from "@/lib/ddiRegistry";

describe("Esophageal Cancer (ESCC) DDI & Pharmacological Safety Engine", () => {
  it("should provide 10 representative ESCC targeted, systemic, and chemotherapy regimens", () => {
    expect(ESOPHAGEAL_TARGETED_DRUGS).toHaveLength(10);
    const ids = ESOPHAGEAL_TARGETED_DRUGS.map((d) => d.id);
    expect(ids).toContain("camrelizumab");
    expect(ids).toContain("tislelizumab");
    expect(ids).toContain("pembrolizumab");
    expect(ids).toContain("toripalimab");
    expect(ids).toContain("serplulimab");
    expect(ids).toContain("cisplatin");
    expect(ids).toContain("paclitaxel");
    expect(ids).toContain("nedaplatin");
    expect(ids).toContain("vinorelbine");
    expect(ids).toContain("anlotinib");
  });

  it("should intercept Anlotinib + Anticoagulant fatal hemorrhage and perforation danger", () => {
    const result = checkEsophagealDrugInteractions("anlotinib", ["warfarin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.severeCount).toBeGreaterThanOrEqual(1);
    expect(result.interactions[0].rule.id).toBe("esophageal-ddi-anlotinib-anticoagulant");
    expect(result.interactions[0].rule.mechanism).toContain("大出血");
  });

  it("should intercept Paclitaxel/Vinorelbine + Clarithromycin CYP3A4 bone marrow toxicity", () => {
    const result = checkEsophagealDrugInteractions("paclitaxel", ["clarithromycin"]);
    expect(result.overallStatus).toBe("warning");
    expect(result.cautionCount).toBeGreaterThanOrEqual(1);
    expect(result.interactions[0].rule.mechanism).toContain("CYP3A4");
  });

  it("should provide reflux timing guidance for postoperative proton pump inhibitors", () => {
    const result = checkEsophagealDrugInteractions("camrelizumab", ["omeprazole"]);
    expect(result.dailySchedulePlan).toBeDefined();
    expect(result.dailySchedulePlan.length).toBeGreaterThan(0);
    expect(result.dailySchedulePlan[0].drugs[0]).toContain("质子泵抑制剂");
  });

  it("should route correctly through unified DDI registry for ESCC drugs", () => {
    const unifiedRes = checkDrugInteractionsUnified({
      cancerType: "esophageal",
      targetedDrugId: "anlotinib",
      chronicDrugIds: ["warfarin"],
    });
    expect(unifiedRes.overallStatus).toBe("danger");
    expect(unifiedRes.severeCount).toBe(1);
  });
});
