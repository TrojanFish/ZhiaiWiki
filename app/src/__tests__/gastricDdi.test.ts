import { describe, it, expect } from "vitest";
import { 
  GASTRIC_TARGETED_DRUGS, 
  GASTRIC_DDI_RULES, 
  checkGastricDrugInteractions 
} from "@/lib/gastricDdiData";
import { checkDrugInteractionsUnified } from "@/lib/ddiRegistry";

describe("Gastric Cancer DDI & Pharmacological Safety Engine", () => {
  it("should provide 10 representative gastric targeted and systemic drugs", () => {
    expect(GASTRIC_TARGETED_DRUGS).toHaveLength(10);
    const ids = GASTRIC_TARGETED_DRUGS.map((d) => d.id);
    expect(ids).toContain("zolbetuximab");
    expect(ids).toContain("trastuzumab");
    expect(ids).toContain("trastuzumab_deruxtecan");
    expect(ids).toContain("apatinib");
    expect(ids).toContain("nivolumab");
    expect(ids).toContain("sintilimab");
    expect(ids).toContain("tislelizumab");
    expect(ids).toContain("ramucirumab");
    expect(ids).toContain("flot_chemo");
    expect(ids).toContain("sox_xelox");
  });

  it("should trigger timing warning for Zolbetuximab triple-antiemetic premedication", () => {
    const result = checkGastricDrugInteractions("zolbetuximab", ["omeprazole"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-zolbetuximab-emesis");
    expect(result.interactions[0].rule.management).toContain("地塞米松");
    expect(result.interactions[0].rule.management).toContain("NK-1");
  });

  it("should intercept Trastuzumab cardiac toxicity risk", () => {
    const result = checkGastricDrugInteractions("trastuzumab", ["atorvastatin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-trastuzumab-anthracycline");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("LVEF");
  });

  it("should intercept Apatinib + Clarithromycin (CYP3A4 strong inhibitor) severe contraindication", () => {
    const result = checkGastricDrugInteractions("apatinib", ["clarithromycin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("severe_contraindication");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("血压急剧飙升");
  });

  it("should intercept Apatinib + Rifampin (CYP3A4 strong inducer) severe contraindication", () => {
    const result = checkGastricDrugInteractions("apatinib", ["rifampin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("severe_contraindication");
    expect(result.interactions[0].rule.mechanism).toContain("血药稳态谷浓度下降");
  });

  it("should intercept Apatinib + Warfarin fatal gastrointestinal bleeding contraindication", () => {
    const result = checkGastricDrugInteractions("apatinib", ["warfarin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-apatinib-warfarin");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("柏油样黑便");
  });

  it("should evaluate Apatinib + Amlodipine as safe and compatible blood pressure management", () => {
    const result = checkGastricDrugInteractions("apatinib", ["amlodipine"]);
    expect(result.overallStatus).toBe("safe");
    expect(result.safeCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("compatible_safe");
    expect(result.interactions[0].rule.management).toContain("140/90");
  });

  it("should intercept Capecitabine / SOX + Warfarin severe contraindication", () => {
    const result = checkGastricDrugInteractions("sox_xelox", ["warfarin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-capecitabine-warfarin");
  });

  it("should provide timing warning for FLOT Oxaliplatin cold-induced acute neurotoxicity", () => {
    const result = checkGastricDrugInteractions("flot_chemo", ["metformin"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-oxaliplatin-cold-neurotoxicity");
    expect(result.interactions[0].rule.management).toContain("避冷保暖三字诀");
  });

  it("should trigger caution for Nivolumab + high-dose Dexamethasone", () => {
    const result = checkGastricDrugInteractions("nivolumab", ["dexamethasone"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("gastric-ddi-pd1-steroids");
  });

  it("should automatically route through unified DDI registry for gastric cancer drugs", () => {
    const unifiedZol = checkDrugInteractionsUnified("gastric", "zolbetuximab", ["omeprazole"]);
    expect(unifiedZol.overallStatus).toBe("caution");
    expect(unifiedZol.warningCount).toBe(1);

    // Auto-dispatch without specifying cancer type
    const unifiedApa = checkDrugInteractionsUnified(undefined, "apatinib", ["clarithromycin"]);
    expect(unifiedApa.overallStatus).toBe("danger");
    expect(unifiedApa.dangerCount).toBe(1);
  });
});
