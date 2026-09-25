import { describe, it, expect } from "vitest";
import {
  ENDOMETRIAL_TARGETED_DRUGS,
  checkEndometrialDrugInteractions,
} from "../lib/endometrialDdiData";
import {
  CERVICAL_TARGETED_DRUGS,
  checkCervicalDrugInteractions,
} from "../lib/cervicalDdiData";
import {
  checkDrugInteractionsUnified,
  getTargetedDrugsForCancer,
  getDefaultTargetDrugId,
} from "../lib/ddiRegistry";

describe("Gynecologic Oncology DDI Pharmacovigilance Engine (妇科肿瘤专科用药排雷引擎)", () => {
  describe("1. Endometrial Cancer Pharmacology & DDI (子宫内膜癌)", () => {
    it("should list endometrial specialized drugs including immunotherapies, targeted agents, and progestins", () => {
      expect(ENDOMETRIAL_TARGETED_DRUGS.length).toBeGreaterThanOrEqual(6);
      const ids = ENDOMETRIAL_TARGETED_DRUGS.map((d) => d.id);
      expect(ids).toContain("dostarlimab");
      expect(ids).toContain("pembrolizumab");
      expect(ids).toContain("lenvatinib");
      expect(ids).toContain("megestrol_acetate");
      expect(ids).toContain("medroxyprogesterone");
      expect(ids).toContain("carboplatin_paclitaxel");
    });

    it("should intercept severe contraindication for Lenvatinib + Rifampin (CYP3A4 induction crash)", () => {
      const res = checkEndometrialDrugInteractions("lenvatinib", ["rifampin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
      expect(res.cautionCount).toBe(0);
      expect(res.interactions[0].rule.title).toContain("利福平");
      expect(res.summaryText).toContain("高危用药禁忌");
    });

    it("should intercept severe fatal bleeding warning for Lenvatinib + Warfarin", () => {
      const res = checkEndometrialDrugInteractions("lenvatinib", ["warfarin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.riskLabel).toContain("致命警示");
    });

    it("should trigger timing caution for High-Dose Megestrol/MPA + Warfarin (VTE & INR balance)", () => {
      const res = checkEndometrialDrugInteractions("megestrol_acetate", ["warfarin"]);
      expect(res.overallStatus).toBe("warning");
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain("孕激素");
    });

    it("should trigger caution for Lenvatinib + Clarithromycin (CYP3A4 inhibition toxicity spike)", () => {
      const res = checkEndometrialDrugInteractions("lenvatinib", ["clarithromycin"]);
      expect(res.overallStatus).toBe("warning");
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.clinicalGuidance).toContain("克拉霉素");
    });

    it("should trigger caution for Carboplatin/Paclitaxel + Furosemide (nephrotoxicity defense)", () => {
      const res = checkEndometrialDrugInteractions("carboplatin_paclitaxel", ["furosemide"]);
      expect(res.overallStatus).toBe("warning");
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain("利尿剂");
    });

    it("should confirm safe compatibility for Dostarlimab with standard chronic medications", () => {
      const res = checkEndometrialDrugInteractions("dostarlimab", ["amlodipine", "metformin"]);
      expect(res.overallStatus).toBe("safe");
      expect(res.severeCount).toBe(0);
      expect(res.cautionCount).toBe(0);
      expect(res.safeCount).toBe(2);
    });
  });

  describe("2. Cervical Cancer Pharmacology & DDI (宫颈癌)", () => {
    it("should list cervical specialized drugs including CCRT sensitizer, anti-angiogenic, and bispecific antibodies", () => {
      expect(CERVICAL_TARGETED_DRUGS.length).toBeGreaterThanOrEqual(5);
      const ids = CERVICAL_TARGETED_DRUGS.map((d) => d.id);
      expect(ids).toContain("cisplatin");
      expect(ids).toContain("bevacizumab");
      expect(ids).toContain("pembrolizumab");
      expect(ids).toContain("cadonilimab");
      expect(ids).toContain("tisotumab_vedotin");
    });

    it("should intercept severe contraindication for Cisplatin + Gentamicin (tubular necrosis & irreversible deafness)", () => {
      const res = checkCervicalDrugInteractions("cisplatin", ["gentamicin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.riskLabel).toContain("绝对禁忌");
      expect(res.interactions[0].rule.mechanism).toContain("氨基糖苷");
    });

    it("should intercept severe warning for Bevacizumab + Warfarin (vaginal hemorrhage & rectovaginal fistula)", () => {
      const res = checkCervicalDrugInteractions("bevacizumab", ["warfarin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain("直肠阴道瘘");
    });

    it("should trigger timing caution for Cisplatin + Furosemide (hydration and ototoxicity)", () => {
      const res = checkCervicalDrugInteractions("cisplatin", ["furosemide"]);
      expect(res.overallStatus).toBe("warning");
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.title).toContain("呋塞米");
    });

    it("should trigger timing caution for Bevacizumab + Amlodipine (blood pressure monitoring)", () => {
      const res = checkCervicalDrugInteractions("bevacizumab", ["amlodipine"]);
      expect(res.overallStatus).toBe("warning");
      expect(res.cautionCount).toBe(1);
      expect(res.interactions[0].rule.mechanism).toContain("NO");
    });

    it("should confirm safe compatibility for Cadonilimab (双抗) with standard chronic medications", () => {
      const res = checkCervicalDrugInteractions("cadonilimab", ["omeprazole", "atorvastatin"]);
      expect(res.overallStatus).toBe("safe");
      expect(res.severeCount).toBe(0);
      expect(res.cautionCount).toBe(0);
    });
  });

  describe("3. Polymorphic Routing via DDI Registry (多态路由与自动检测)", () => {
    it("should route endometrial cancer explicitly and provide default drug", () => {
      const drugs = getTargetedDrugsForCancer("endometrial");
      expect(drugs.length).toBeGreaterThanOrEqual(6);
      expect(getDefaultTargetDrugId("endometrial")).toBe("megestrol_acetate");

      const res = checkDrugInteractionsUnified("endometrial", "lenvatinib", ["rifampin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
    });

    it("should route cervical cancer explicitly and provide default drug", () => {
      const drugs = getTargetedDrugsForCancer("cervical");
      expect(drugs.length).toBeGreaterThanOrEqual(5);
      expect(getDefaultTargetDrugId("cervical")).toBe("cisplatin");

      const res = checkDrugInteractionsUnified("cervical", "cisplatin", ["gentamicin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
    });

    it("should automatically detect endometrial drug without cancerType parameter", () => {
      const res = checkDrugInteractionsUnified(undefined, "lenvatinib", ["warfarin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
    });

    it("should automatically detect cervical drug without cancerType parameter", () => {
      const res = checkDrugInteractionsUnified(undefined, "cisplatin", ["gentamicin"]);
      expect(res.overallStatus).toBe("danger");
      expect(res.severeCount).toBe(1);
    });
  });
});
