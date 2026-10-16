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
});
