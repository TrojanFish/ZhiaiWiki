import { describe, it, expect } from "vitest";
import { 
  THYROID_TARGETED_DRUGS, 
  THYROID_DDI_RULES, 
  checkThyroidDrugInteractions 
} from "@/lib/thyroidDdiData";
import { checkDrugInteractionsUnified } from "@/lib/ddiRegistry";

describe("Thyroid Cancer DDI & Pharmacological Safety Engine", () => {
  it("should provide 10 representative thyroid endocrine, targeted and support drugs", () => {
    expect(THYROID_TARGETED_DRUGS).toHaveLength(10);
    const ids = THYROID_TARGETED_DRUGS.map((d) => d.id);
    expect(ids).toContain("levothyroxine");
    expect(ids).toContain("lenvatinib");
    expect(ids).toContain("sorafenib");
    expect(ids).toContain("donafenib");
    expect(ids).toContain("anlotinib");
    expect(ids).toContain("pralsetinib");
    expect(ids).toContain("selpercatinib");
    expect(ids).toContain("dabrafenib_trametinib");
    expect(ids).toContain("cabozantinib");
    expect(ids).toContain("calcium_vitd");
  });

  it("should trigger timing warning for Levothyroxine + Calcium (4-hour separation rule)", () => {
    const result = checkThyroidDrugInteractions("levothyroxine", ["calcium_vitd"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-lt4-calcium");
    expect(result.interactions[0].rule.riskLevel).toBe("timing_warning");
    expect(result.interactions[0].rule.management).toContain("严格间隔至少 4 小时");
  });

  it("should trigger timing warning for Levothyroxine + Ferrous Sulfate (4-hour separation rule)", () => {
    const result = checkThyroidDrugInteractions("levothyroxine", ["ferrous_sulfate"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-lt4-iron");
    expect(result.interactions[0].rule.management).toContain("严格间隔 4 小时");
  });

  it("should trigger timing warning for Levothyroxine + Omeprazole PPI", () => {
    const result = checkThyroidDrugInteractions("levothyroxine", ["omeprazole"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-lt4-ppi");
    expect(result.interactions[0].rule.mechanism).toContain("胃酸分泌环境");
  });

  it("should intercept Levothyroxine + Warfarin bleeding severe contraindication", () => {
    const result = checkThyroidDrugInteractions("levothyroxine", ["warfarin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-lt4-warfarin");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("牙龈出血");
  });

  it("should trigger moderate caution for Levothyroxine + Metformin", () => {
    const result = checkThyroidDrugInteractions("levothyroxine", ["metformin"]);
    expect(result.overallStatus).toBe("caution");
    expect(result.warningCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-lt4-metformin");
  });

  it("should intercept Lenvatinib + Clarithromycin (CYP3A4 inhibitor) severe contraindication", () => {
    const result = checkThyroidDrugInteractions("lenvatinib", ["clarithromycin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("severe_contraindication");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("恶性高血压危象");
  });

  it("should intercept Lenvatinib + Rifampin (CYP3A4 inducer) severe contraindication", () => {
    const result = checkThyroidDrugInteractions("lenvatinib", ["rifampin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("severe_contraindication");
    expect(result.interactions[0].rule.clinicalManifestation).toContain("碘难治甲癌病灶迅速进展");
  });

  it("should evaluate Lenvatinib + Amlodipine as safe and compatible blood pressure management", () => {
    const result = checkThyroidDrugInteractions("lenvatinib", ["amlodipine"]);
    expect(result.overallStatus).toBe("safe");
    expect(result.safeCount).toBe(1);
    expect(result.interactions[0].rule.riskLevel).toBe("compatible_safe");
    expect(result.interactions[0].rule.management).toContain("首选氨氯地平");
  });

  it("should intercept Pralsetinib (RET) + Clarithromycin severe contraindication", () => {
    const result = checkThyroidDrugInteractions("pralsetinib", ["clarithromycin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-ret-cyp3a4-inhibitor");
  });

  it("should intercept Anlotinib + Aspirin hemorrhage severe contraindication", () => {
    const result = checkThyroidDrugInteractions("anlotinib", ["aspirin"]);
    expect(result.overallStatus).toBe("danger");
    expect(result.dangerCount).toBe(1);
    expect(result.interactions[0].rule.id).toBe("thyroid-ddi-anlotinib-anticoagulant");
  });

  it("should automatically route through unified DDI registry for thyroid cancer drugs", () => {
    const unifiedLt4 = checkDrugInteractionsUnified("thyroid", "levothyroxine", ["calcium_vitd"]);
    expect(unifiedLt4.overallStatus).toBe("caution");
    expect(unifiedLt4.warningCount).toBe(1);

    // Auto-routing when cancerType is omitted (Levothyroxine is unique to thyroid)
    const unifiedAutoLt4 = checkDrugInteractionsUnified(undefined, "levothyroxine", ["calcium_vitd"]);
    expect(unifiedAutoLt4.overallStatus).toBe("caution");
    expect(unifiedAutoLt4.warningCount).toBe(1);

    // Explicit thyroid routing for Pralsetinib
    const unifiedPra = checkDrugInteractionsUnified("thyroid", "pralsetinib", ["clarithromycin"]);
    expect(unifiedPra.overallStatus).toBe("danger");
    expect(unifiedPra.dangerCount).toBe(1);

    // Explicit thyroid routing for Lenvatinib
    const unifiedLen = checkDrugInteractionsUnified("thyroid", "lenvatinib", ["clarithromycin"]);
    expect(unifiedLen.overallStatus).toBe("danger");
    expect(unifiedLen.dangerCount).toBe(1);
  });
});
