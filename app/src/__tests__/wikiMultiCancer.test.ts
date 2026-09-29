import { describe, it, expect } from "vitest";
import { WIKI_TOPICS, getWikiCategories } from "@/lib/wikiData";
import { BREAST_WIKI_TOPICS } from "@/lib/breastWikiData";

describe("Multi-Cancer Wiki Decoupling & Categories", () => {
  it("should return lung categories when cancerType is lung or undefined", () => {
    const lungCats = getWikiCategories("lung");
    expect(lungCats.nodule.label).toBe("肺结节消恐与随访");
    expect(lungCats.pathology.label).toBe("术后病理密码破译");
    expect(lungCats.genetics.label).toBe("驱动基因与精准靶向");
    expect(lungCats.recovery.label).toBe("术后康复与长期随访");

    const defaultCats = getWikiCategories();
    expect(defaultCats.nodule.label).toBe("肺结节消恐与随访");
  });

  it("should return breast categories when cancerType is breast", () => {
    const breastCats = getWikiCategories("breast");
    expect(breastCats.nodule.label).toBe("乳腺影像筛查与评级");
    expect(breastCats.pathology.label).toBe("浸润病理与分级破译");
    expect(breastCats.genetics.label).toBe("受体分型与精准用药");
    expect(breastCats.recovery.label).toBe("术后身心康复与随访");
  });

  it("should correctly calculate dynamic topic counts for both cancers", () => {
    // Lung dynamic counts
    const lungTotal = WIKI_TOPICS.length;
    const lungHighRisk = WIKI_TOPICS.filter((t) => t.riskLevel === "high").length;
    expect(lungTotal).toBe(48);
    expect(lungHighRisk).toBe(9);

    // Breast dynamic counts
    const breastTotal = BREAST_WIKI_TOPICS.length;
    const breastHighRisk = BREAST_WIKI_TOPICS.filter((t) => t.riskLevel === "high").length;
    expect(breastTotal).toBe(30);
    expect(breastHighRisk).toBe(7);

    // Breast category breakdown
    const noduleTopics = BREAST_WIKI_TOPICS.filter((t) => t.category === "nodule");
    const pathologyTopics = BREAST_WIKI_TOPICS.filter((t) => t.category === "pathology");
    const geneticsTopics = BREAST_WIKI_TOPICS.filter((t) => t.category === "genetics");
    const recoveryTopics = BREAST_WIKI_TOPICS.filter((t) => t.category === "recovery");

    expect(noduleTopics.length).toBe(5);
    expect(pathologyTopics.length).toBe(7);
    expect(geneticsTopics.length).toBe(7);
    expect(recoveryTopics.length).toBe(11);
    expect(noduleTopics.length + pathologyTopics.length + geneticsTopics.length + recoveryTopics.length).toBe(breastTotal);
  });

  it("should ensure all breast topics have valid non-empty clinical content and visual components", () => {
    const validVisuals = [
      "BiRadsScaleVisual",
      "MicrocalcificationVisual",
      "ReceptorSubtypeVisual",
      "LymphedemaArmVisual",
      "DcisBasementMembraneVisual",
      "BoneMarrowGcsfVisual",
      "EgfrMutationMapVisual",
      "AdjuvantDecisionTreeVisual",
      "AblationSbrtVisual",
      "Her2AdcVisual",
      "FollowupTimelineVisual",
    ];

    for (const topic of BREAST_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
      expect(topic.visualComponent).toBeDefined();
      expect(validVisuals).toContain(topic.visualComponent);
    }
  });

  it("should decouple scenario tabs between lung and breast cancer", async () => {
    const { LUNG_SCENARIO_TABS, BREAST_SCENARIO_TABS } = await import("@/components/wiki/WikiScenarioTabs");

    // Check Lung tabs
    expect(LUNG_SCENARIO_TABS).toHaveLength(5);
    expect(LUNG_SCENARIO_TABS[0].headline).toBe("肺癌循证指标全景大盘");
    expect(LUNG_SCENARIO_TABS[1].headline).toBe("刚体检查出肺结节");
    expect(LUNG_SCENARIO_TABS[2].headline).toBe("刚拿到术后病理报告");
    expect(LUNG_SCENARIO_TABS[3].headline).toBe("医生让我做基因/靶向治疗");
    expect(LUNG_SCENARIO_TABS[4].headline).toBe("术后身体恢复与长期随访");

    // Check Breast tabs
    expect(BREAST_SCENARIO_TABS).toHaveLength(5);
    expect(BREAST_SCENARIO_TABS[0].headline).toBe("乳腺癌循证指标全景大盘");
    expect(BREAST_SCENARIO_TABS[1].headline).toBe("体检筛查发现结节/钙化");
    expect(BREAST_SCENARIO_TABS[2].headline).toBe("刚拿到浸润癌病理报告");
    expect(BREAST_SCENARIO_TABS[3].headline).toBe("医生让我看受体与基因检测");
    expect(BREAST_SCENARIO_TABS[4].headline).toBe("术后身体恢复与内分泌随访");

    // Verify dynamic tab stats calculation
    const calcStats = (tabs: typeof BREAST_SCENARIO_TABS, topics: typeof BREAST_WIKI_TOPICS) => {
      const result: Record<string, { total: number; high: number }> = {};
      for (const tab of tabs) {
        const cat = tab.category;
        const list = cat === "all" ? topics : topics.filter((t) => t.category === cat);
        result[cat] = {
          total: list.length,
          high: list.filter((t) => t.riskLevel === "high").length,
        };
      }
      return result;
    };

    // Breast stats
    const breastStats = calcStats(BREAST_SCENARIO_TABS, BREAST_WIKI_TOPICS);
    expect(breastStats.all.total).toBe(30);
    expect(breastStats.all.high).toBe(7);
    expect(breastStats.nodule.total).toBe(5);
    expect(breastStats.nodule.high).toBe(1); // microcalcifications
    expect(breastStats.pathology.total).toBe(7);
    expect(breastStats.pathology.high).toBe(2); // invasive_ductal_carcinoma, neoadjuvant_pcr
    expect(breastStats.genetics.total).toBe(7);
    expect(breastStats.genetics.high).toBe(4); // her2, tnbc, brca_gene_testing, olaparib
    expect(breastStats.recovery.total).toBe(11);
    expect(breastStats.recovery.high).toBe(0);

    // Lung stats
    const lungStats = calcStats(LUNG_SCENARIO_TABS, WIKI_TOPICS);
    expect(lungStats.all.total).toBe(48);
    expect(lungStats.all.high).toBe(9);
    expect(lungStats.nodule.total).toBe(16);
    expect(lungStats.pathology.total).toBe(12);
    expect(lungStats.genetics.total).toBe(10);
    expect(lungStats.recovery.total).toBe(10);
  }, 20000);

  it("should return colorectal categories when cancerType is colorectal", () => {
    const crcCats = getWikiCategories("colorectal");
    expect(crcCats.nodule.label).toBe("肠镜早筛与直肠保肛");
    expect(crcCats.pathology.label).toBe("浸润病理与核磁切缘");
    expect(crcCats.genetics.label).toBe("驱动基因与靶向免疫");
    expect(crcCats.recovery.label).toBe("TNT新辅助与造口康复");
  });

  it("should ensure all 25 colorectal topics have valid clinical content and specialized visual components", async () => {
    const { COLORECTAL_WIKI_TOPICS } = await import("@/lib/colorectalWikiData");
    expect(COLORECTAL_WIKI_TOPICS).toHaveLength(25);

    const validVisuals = [
      "RectalAnatomyRulerVisual",
      "RectalCrmMriVisual",
      "RectalTntWatchWaitVisual",
      "StomaCareLarsVisual",
      "PdL1ImmuneMechanismVisual",
      "TargetedSideEffectsVisual",
      "AdjuvantDecisionTreeVisual",
      "HccInterventionSystemicVisual",
      "EgfrMutationMapVisual",
      "Her2AdcVisual",
      "MrdCtdnaVisual",
      "GastricDumpingNutritionVisual",
    ];

    for (const topic of COLORECTAL_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
      expect(topic.visualComponent).toBeDefined();
      expect(validVisuals).toContain(topic.visualComponent);
    }

    // Verify rectal-specific key topics
    const ids = COLORECTAL_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("rectal_anatomy_margins");
    expect(ids).toContain("rectal_mri_crm_emvi");
    expect(ids).toContain("rectal_tnt_watch_wait");
    expect(ids).toContain("rectal_stoma_lars_rehab");
    expect(ids).toContain("rectal_dmmr_pembrolizumab");
  });

  it("should decouple colorectal scenario tabs and dynamic topic counts", async () => {
    const { COLORECTAL_SCENARIO_TABS } = await import("@/components/wiki/WikiScenarioTabs");
    const { COLORECTAL_WIKI_TOPICS } = await import("@/lib/colorectalWikiData");

    expect(COLORECTAL_SCENARIO_TABS).toHaveLength(5);
    expect(COLORECTAL_SCENARIO_TABS[0].headline).toBe("结直肠癌循证指标全景大盘");
    expect(COLORECTAL_SCENARIO_TABS[1].headline).toBe("肠镜息肉早筛与直肠保肛");
    expect(COLORECTAL_SCENARIO_TABS[2].headline).toBe("浸润病理与核磁切缘破译");
    expect(COLORECTAL_SCENARIO_TABS[3].headline).toBe("驱动基因与精准靶向免疫");
    expect(COLORECTAL_SCENARIO_TABS[4].headline).toBe("TNT全程新辅助与造口康复");

    const noduleCount = COLORECTAL_WIKI_TOPICS.filter((t) => t.category === "nodule").length;
    const pathCount = COLORECTAL_WIKI_TOPICS.filter((t) => t.category === "pathology").length;
    const genCount = COLORECTAL_WIKI_TOPICS.filter((t) => t.category === "genetics").length;
    const recCount = COLORECTAL_WIKI_TOPICS.filter((t) => t.category === "recovery").length;

    expect(noduleCount).toBe(5);
    expect(pathCount).toBe(4);
    expect(genCount).toBe(10);
    expect(recCount).toBe(6);
    expect(noduleCount + pathCount + genCount + recCount).toBe(25);
  });

  it("should ensure all 25 Colon topics have valid clinical content, tactics, and risk levels", async () => {
    const { COLON_WIKI_TOPICS } = await import("@/lib/colonWikiData");
    expect(COLON_WIKI_TOPICS).toHaveLength(25);

    for (const topic of COLON_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = COLON_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("colon_kras_g12c_targeted");
    expect(ids).toContain("colon_her2_amplification_adc");
    expect(ids).toContain("colon_oxaliplatin_neuropathy");
    expect(ids).toContain("colon_ctdna_mrd_monitoring");
    expect(ids).toContain("colon_anastomotic_leak_warning");
    expect(ids).toContain("colon_cea_ca199_fluctuation");
  });

  it("should ensure all 25 Rectal topics have valid clinical content, tactics, and risk levels", async () => {
    const { RECTAL_WIKI_TOPICS } = await import("@/lib/rectalWikiData");
    expect(RECTAL_WIKI_TOPICS).toHaveLength(25);

    for (const topic of RECTAL_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = RECTAL_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("rectal_short_vs_long_course_rt");
    expect(ids).toContain("rectal_ultralow_isr_sphincter");
    expect(ids).toContain("rectal_panp_nerve_preservation");
    expect(ids).toContain("rectal_dmmr_pembrolizumab_ccr");
    expect(ids).toContain("rectal_lateral_lymph_node_dissection");
  });

  it("should ensure all 25 Gastric topics have valid clinical content, tactics, and risk levels", async () => {
    const { GASTRIC_WIKI_TOPICS } = await import("@/lib/gastricWikiData");
    expect(GASTRIC_WIKI_TOPICS).toHaveLength(25);

    for (const topic of GASTRIC_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = GASTRIC_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("gastric_hp_eradication_prevention");
    expect(ids).toContain("gastric_zolbetuximab_claudin18");
    expect(ids).toContain("gastric_her2_tdxd_adc");
    expect(ids).toContain("gastric_reconstruction_roux_en_y");
    expect(ids).toContain("gastric_total_gastrectomy_anemia");
  });

  it("should ensure all 25 Liver topics have valid clinical content, tactics, and risk levels", async () => {
    const { LIVER_WIKI_TOPICS } = await import("@/lib/liverWikiData");
    expect(LIVER_WIKI_TOPICS).toHaveLength(25);

    for (const topic of LIVER_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = LIVER_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("liver_pvtt_cheng_classification");
    expect(ids).toContain("liver_phlf_5050_icg_prevention");
    expect(ids).toContain("liver_lenvatinib_adverse_management");
    expect(ids).toContain("liver_rupture_hemorrhage_emergency");
    expect(ids).toContain("liver_flr_pve_portal_embolization");
  });

  it("should ensure all 25 Esophageal topics have valid clinical content, tactics, and risk levels", async () => {
    const { ESOPHAGEAL_WIKI_TOPICS } = await import("@/lib/esophagealWikiData");
    expect(ESOPHAGEAL_WIKI_TOPICS).toHaveLength(25);

    for (const topic of ESOPHAGEAL_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = ESOPHAGEAL_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("escc_checkmate577_adjuvant_nivo");
    expect(ids).toContain("escc_cervical_definitive_crt");
    expect(ids).toContain("escc_rln_injury_voice_rehab");
    expect(ids).toContain("escc_cisplatin_hydration_nephrotoxicity");
    expect(ids).toContain("escc_covered_stent_vs_peg");
  });

  it("should ensure all 25 Thyroid topics have valid clinical content, tactics, and risk levels", async () => {
    const { THYROID_WIKI_TOPICS } = await import("@/lib/thyroidWikiData");
    const { THYROID_SCENARIO_TABS } = await import("@/components/wiki/WikiScenarioTabs");

    expect(THYROID_WIKI_TOPICS).toHaveLength(27);
    expect(THYROID_SCENARIO_TABS).toHaveLength(5);
    expect(THYROID_SCENARIO_TABS[0].headline).toBe("甲状腺癌循证指标全景大盘");

    for (const topic of THYROID_WIKI_TOPICS) {
      expect(topic.id).toBeTruthy();
      expect(topic.title).toBeTruthy();
      expect(topic.metaphor).toBeTruthy();
      expect(topic.clinicalTruth).toBeTruthy();
      expect(topic.tactics.length).toBeGreaterThan(0);
      expect(topic.reassurance).toBeTruthy();
      expect(["high", "moderate", "low", "safe"]).toContain(topic.riskLevel);
      expect(["nodule", "pathology", "genetics", "recovery"]).toContain(topic.category);
    }

    const ids = THYROID_WIKI_TOPICS.map((t) => t.id);
    expect(ids).toContain("thyroid_tirads_ultrasound");
    expect(ids).toContain("thyroid_ajcc8_age55_cutoff");
    expect(ids).toContain("thyroid_lt4_timing_absorption");
    expect(ids).toContain("thyroid_hypocalcemia_pth_management");
    expect(ids).toContain("thyroid_rai_131_remnant_ablation");
  });
});

