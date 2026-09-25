import type { StudyItem } from "@/components/StudyCard";

export const CERVICAL_STUDIES: StudyItem[] = [
  {
    id: "keynote826_pembrolizumab_2021",
    title: "Pembrolizumab for Persistent, Recurrent, or Metastatic Cervical Cancer (KEYNOTE-826)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2021,
    patientN: 617,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2112435",
    pubmedId: "34534429",
    url: "https://www.nejm.org/doi/10.1056/NEJMoa2112435",
    keyConclusions: [
      "划时代全球 III 期随机双盲对照研究：在化疗 (紫杉醇+顺铂/卡铂) ± 贝伐珠单抗基础上加用帕博利珠单抗，使 PD-L1 CPS $\\ge 1$ 患者的 24 个月总生存率由 41.7% 跃升至 53.0% (HR=0.64)。",
      "在 CPS $\\ge 10$ 人群中死亡风险降低 42% (HR=0.58)，被各大国际指南列为持续、复发或转移性宫颈癌一线治疗最高级别推荐。"
    ],
    relevantFactors: ["KEYNOTE-826", "帕博利珠单抗", "PD-L1 CPS", "贝伐珠单抗", "死亡风险降低36%"],
    applicableStages: ["IV", "IVB", "复发转移"],
    biomarkerDetails: "PD-L1 综合阳性评分 (CPS) $\\ge 1$ 或 $\\ge 10$",
    interventionArm: "帕博利珠单抗 + 化疗 ± 贝伐珠单抗 vs 安慰剂 + 化疗 ± 贝伐珠单抗",
    riskReduction: "全人群死亡风险降低 36% (HR=0.64, P<0.001)"
  },
  {
    id: "embrace1_igabt_ccrt_2021",
    title: "Image-Guided Adaptive Brachytherapy in Locally Advanced Cervical Cancer (EMBRACE-I)",
    journal: "Lancet Oncology",
    year: 2021,
    patientN: 1411,
    studyType: "prospective_cohort",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(20)30753-1",
    pubmedId: "33794199",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(20)30753-1/fulltext",
    keyConclusions: [
      "欧洲乃至全球最大规模局部进展期宫颈癌多中心前瞻队列：盆腔体外同步放化疗 (CCRT) 联合高精度 MRI 引导三维自适应后装放疗 (IGABT)，5 年局部控制率达到惊人的 92.0%。",
      "5 年总生存率高达 74.0%，且通过对直肠、膀胱的靶区高精度避让，3~5 级重度迟发毒副反应发生率被压制在 6.8% 以下，奠定了现代放疗根治的绝对霸主地位。"
    ],
    relevantFactors: ["EMBRACE-I", "三维自适应后装放疗", "局部进展期", "CCRT", "5年局控率92%"],
    applicableStages: ["IB3", "IIA2", "IIB", "IIIA", "IIIB", "IIIC1", "IIIC2", "IVA"],
    biomarkerDetails: "局部进展期宫颈癌 (FIGO 2018 IB3~IVA 期)",
    interventionArm: "顺铂同步外照射 (EBRT) 序贯 MRI 引导自适应三维腔内/组织间插植近距离放疗",
    riskReduction: "5年局部控制率达 92%，重度膀胱直肠并发症发生率 <7%"
  },
  {
    id: "lacc_trial_open_vs_laparoscopic_2018",
    title: "Minimally Invasive versus Abdominal Radical Hysterectomy for Cervical Cancer (LACC)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2018,
    patientN: 631,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1806395",
    pubmedId: "30379051",
    url: "https://www.nejm.org/doi/10.1056/NEJMoa1806395",
    keyConclusions: [
      "震惊全球妇科肿瘤外科界的顶刊前瞻性 III 期 RCT：早期宫颈癌微创手术 (腹腔镜或达芬奇机器人) 组的 4.5 年无病生存率仅为 86.0%，显著低于传统开腹广泛全子宫切除术组的 96.5% (HR=3.74)。",
      "微创组局部复发率增加了近 4 倍，全因死亡风险高出 6 倍 (91.2% vs 97.1%)；该研究直接导致 NCCN 及全球指南撤回微创优先推荐，重申开腹根治术的金标准地位。"
    ],
    relevantFactors: ["LACC试验", "开腹根治术", "微创腹腔镜警示", "无瘤原则", "4.5年DFS 96.5%"],
    applicableStages: ["IA1", "IA2", "IB1", "IB2"],
    biomarkerDetails: "早期 IA1 (伴 LVSI) ~ IB1 期宫颈浸润癌",
    interventionArm: "开腹广泛全子宫切除术 vs 微创广泛全子宫切除术 (普通腹腔镜或机器人)",
    riskReduction: "开腹组无病生存率绝对优出 10.5% (HR=0.30, P<0.001)"
  },
  {
    id: "gog240_bevacizumab_2014",
    title: "Improved Survival with Bevacizumab in Advanced Cervical Cancer (GOG-240)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2014,
    patientN: 452,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1309748",
    pubmedId: "24552318",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1309748",
    keyConclusions: [
      "首个确立抗血管生成靶向药在晚期宫颈癌获益的前瞻性 III 期 RCT：在顺铂+紫杉醇基础上联合贝伐珠单抗，中位总生存期从 13.3 个月提高到 16.8 个月 (HR=0.77)。",
      "客观缓解率由 36% 提升至 48%，确立了贝伐珠单抗作为晚期及复发转移宫颈癌一线标准联合治疗的不可撼动地位。"
    ],
    relevantFactors: ["GOG-240", "贝伐珠单抗", "晚期一线", "抗血管靶向", "总生存期延长"],
    applicableStages: ["IV", "IVB", "复发转移"],
    biomarkerDetails: "持续、复发或 IVB 期转移性宫颈癌",
    interventionArm: "双药化疗 + 贝伐珠单抗 15mg/kg q3w vs 单纯双药化疗",
    riskReduction: "死亡风险降低 23% (HR=0.77, P=0.007)"
  },
];
