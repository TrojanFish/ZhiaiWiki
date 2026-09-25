import type { StudyItem } from "@/components/StudyCard";

export const THYROID_STUDIES: StudyItem[] = [
  {
    id: "kuma_active_surveillance_2014",
    title: "Patient Outcomes and Cost-Effectiveness of Immediate Surgery versus Active Surveillance for Low-Risk Papillary Thyroid Microcarcinoma",
    journal: "Thyroid",
    year: 2014,
    patientN: 1235,
    studyType: "prospective_cohort",
    evidenceLevel: 4,
    doi: "10.1089/thy.2013.0456",
    pubmedId: "24410185",
    url: "https://www.liebertpub.com/doi/10.1089/thy.2013.0456",
    keyConclusions: [
      "日本神户 Kuma 医院开创性的低危甲状腺微小乳头状癌 (PTMC ≤1cm) 长期主动监测队列：10 年随访中仅 8% 的患者结节增大超过 3mm，发生淋巴结转移者不足 3.8%。",
      "无论初诊即手术还是进展后再转行补救手术，两组患者的 10 年特异性生存率均为 100%；主动监测组避免了 90% 以上的手术并发症与终身服药，彻底改变了国际微小癌诊疗哲学。"
    ],
    relevantFactors: ["主动监测", "PTMC", "微小乳头状癌", "Kuma医院", "免除手术"],
    applicableStages: ["T1aN0M0", "I"],
    biomarkerDetails: "肿瘤最大径 ≤ 10mm / 无被膜外侵犯 / 无淋巴结转移",
    interventionArm: "超声主动监测 (Active Surveillance) vs 立即行腺叶切除术",
    riskReduction: "10年疾病特异性生存率保持 100%，近九成终身免刀"
  },
  {
    id: "select_lenvatinib_2015",
    title: "Lenvatinib versus Placebo in Radioiodine-Refractory Thyroid Cancer (SELECT)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2015,
    patientN: 392,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1406470",
    pubmedId: "25671247",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1406470",
    keyConclusions: [
      "放射性碘难治性分化型甲状腺癌 (RAIR-DTC) 的里程碑突破：口服多靶点 TKI 仑伐替尼使中位无进展生存期 (PFS) 从 3.6 个月断崖式延长至 18.3 个月 (净延长 14.7 个月，HR=0.21)。",
      "客观缓解率 (ORR) 高达 64.8% (安慰剂组仅 1.5%)，使肿瘤迅速大幅退缩，成为全球碘难治性甲癌一线靶向金标准。"
    ],
    relevantFactors: ["仑伐替尼", "SELECT研究", "RAIR-DTC", "碘难治", "PFS延长14.7月"],
    applicableStages: ["IV", "IVA", "IVB"],
    biomarkerDetails: "放射性碘难治性进展期分化型甲状腺癌 (RAIR-DTC)",
    interventionArm: "仑伐替尼 24mg 口服 qd vs 安慰剂",
    riskReduction: "疾病进展或死亡风险降低 79% (HR=0.21, P<0.001)"
  },
  {
    id: "arrow_pralsetinib_2021",
    title: "Efficacy and safety of pralsetinib in patients with advanced RET-altered thyroid cancer (ARROW): a multi-cohort, open-label, registrational, phase 1/2 study",
    journal: "Lancet Diabetes & Endocrinology",
    year: 2021,
    patientN: 136,
    studyType: "prospective_cohort",
    evidenceLevel: 4,
    doi: "10.1016/S2213-8587(21)00120-0",
    pubmedId: "34119338",
    url: "https://www.thelancet.com/journals/landia/article/PIIS2213-8587(21)00120-0/fulltext",
    keyConclusions: [
      "高选择性 RET 抑制剂普拉替尼 (Pralsetinib) 在晚期 RET 突变甲状腺髓样癌 (MTC) 和 RET 融合分化型甲状腺癌中展现出高度持久的客观缓解：初治 RET 突变 MTC 客观缓解率达 71%，RET 融合 DTC 达 89%。",
      "开启了甲状腺髓样癌与晚期难治性甲状腺癌高特异性生物标志物精准靶向治疗的新纪元。"
    ],
    relevantFactors: ["RET突变", "RET融合", "普拉替尼", "ARROW", "甲状腺髓样癌"],
    applicableStages: ["IV", "IVA", "IVB", "IVC"],
    biomarkerDetails: "RET 基因突变 (MTC) 或 RET 基因重排融合 (DTC)",
    interventionArm: "普拉替尼口服 400mg qd",
    riskReduction: "初治 ORR 达 71%~89%，中位 PFS 尚未达到"
  },
  {
    id: "estimabl2_2022",
    title: "Postoperative Thyroid Remnant Ablation in Low-Risk Papillary Thyroid Cancer (ESTIMABL2)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2022,
    patientN: 730,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2111953",
    pubmedId: "35263518",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2111953",
    keyConclusions: [
      "前瞻性多中心 III 期随机对照试验证实：对于术后低危分化型甲状腺乳头状癌 (pT1m/T1b N0/Nx)，全切术后不接受 131-I 清甲治疗组与接受 1.1 GBq (30 mCi) 清甲组相比，3 年无事件发生率完全等效 (95.6% vs 95.9%)。",
      "为全球低危早期甲状腺癌患者安全免除放射性核素 131-I 辐射照射提供了最权威的前瞻性证据支持。"
    ],
    relevantFactors: ["ESTIMABL2", "碘-131清甲", "免除放疗", "低危甲癌", "辐射防护"],
    applicableStages: ["pT1a", "pT1b", "I"],
    biomarkerDetails: "低危分化型甲状腺癌全切术后 (pT1a-T1b N0/Nx M0)",
    interventionArm: "免行131-I清甲随访 vs 接受 1.1 GBq 131-I 清甲",
    riskReduction: "非劣效性确立 (免除清甲未增加任何复发事件)"
  }
];
