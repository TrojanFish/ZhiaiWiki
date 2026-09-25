import type { StudyItem } from "@/components/StudyCard";

export const BREAST_STUDIES: StudyItem[] = [
  {
    id: "tailorx_2018",
    title: "Adjuvant Chemotherapy Guided by a 21-Gene Expression Assay in Breast Cancer (TAILORx)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2018,
    patientN: 10273,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1804710",
    pubmedId: "29860917",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1804710",
    keyConclusions: [
      "针对早期 HR+、HER2-、淋巴结阴性患者，21 基因评分 RS 11~25 分绝经后女性，单纯内分泌治疗生存率不劣于加用化疗组（9年无浸润复发率 93.9% vs 93.8%）。",
      "彻底确立了早期激素受体阳性低危患者安全免除辅助化疗的国际黄金标准，避免成千上万患者遭受过度化疗之苦。"
    ],
    relevantFactors: ["21基因", "Oncotype DX", "ER+", "免化疗", "Luminal A"],
    applicableStages: ["I", "IA", "IB", "IIA"],
    biomarkerDetails: "HR+ / HER2- / 淋巴结阴性 / 21基因 RS 0-25",
    interventionArm: "单纯内分泌治疗 vs 内分泌联合辅助化疗",
    riskReduction: "非劣效性确立 (免化疗组9年无浸润生存 93.9%)"
  },
  {
    id: "rxponder_2021",
    title: "First Results of a Randomized Trial of Adjuvant Chemotherapy in Patients with 1-3 Positive Lymph Nodes and Recurrence Score <= 25 (RxPONDER)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2021,
    patientN: 5083,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2108873",
    pubmedId: "34851833",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2108873",
    keyConclusions: [
      "即使伴有 1~3 个腋窝淋巴结转移，绝经后女性只要 21 基因 RS ≤ 25 分，豁免辅助化疗并未降低 5 年无浸润复发生存率（91.9% vs 91.6%）。",
      "打破了以往「只要淋巴结阳性就必须无条件化疗」的传统旧教条，将化疗降阶梯推向微淋巴结转移人群。"
    ],
    relevantFactors: ["1~3个淋巴结阳性", "21基因", "绝经后", "RxPONDER"],
    applicableStages: ["IIA", "IIB"],
    biomarkerDetails: "HR+ / HER2- / N1 (1-3个阳性) / RS <= 25",
    interventionArm: "内分泌单药 vs 内分泌联合化疗",
    riskReduction: "绝经后化疗无额外获益 (HR=1.02, P=0.89)"
  },
  {
    id: "monarche_2023",
    title: "Adjuvant abemaciclib combined with endocrine therapy for high-risk early breast cancer: monarchE 5-year results",
    journal: "Lancet Oncology",
    year: 2023,
    patientN: 5637,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S1470-2045(23)00490-6",
    pubmedId: "37866347",
    url: "https://www.thelancet.com/journals/lanonc/article/PIIS1470-2045(23)00490-6/fulltext",
    keyConclusions: [
      "高危早期 HR+ HER2- 患者在规范内分泌治疗基础上加用 CDK4/6 抑制剂阿贝西利 2 年，5 年无浸润复发生存率 (iDFS) 绝对获益扩大至 7.6% (83.6% vs 76.0%)。",
      "在完成 2 年服药停药后，阿贝西利带来的防复发优势仍持续扩大，证明具有深远的抗肿瘤生物学遗留记忆效应。"
    ],
    relevantFactors: ["阿贝西利", "CDK4/6i", "高危早期", "淋巴结>=4", "MonarchE"],
    applicableStages: ["IIA", "IIB", "IIIA", "IIIB"],
    biomarkerDetails: "HR+ / HER2- / 腋窝淋巴结>=4个 或 1-3个伴G3/肿块>=5cm",
    interventionArm: "阿贝西利 150mg bid (2年) + 内分泌 vs 单纯内分泌",
    riskReduction: "-32% 复发风险 (HR=0.68, P<0.0001)"
  },
  {
    id: "destiny_breast03_2022",
    title: "Trastuzumab Deruxtecan versus Trastuzumab Emtansine for HER2-Positive Advanced Breast Cancer (DESTINY-Breast03)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2022,
    patientN: 524,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2115026",
    pubmedId: "35320644",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2115026",
    keyConclusions: [
      "新一代 ADC 药物德曲妥珠单抗 (T-DXd) 对比经典 T-DM1，将疾病进展或死亡风险降低了惊人的 72% (HR=0.28)。",
      "中位无进展生存期 (PFS) 突破性达到近 29 个月，成为 HER2 阳性晚期二线治疗全球颠覆性金标准。"
    ],
    relevantFactors: ["T-DXd", "优赫得", "HER2阳性", "ADC生物导弹"],
    applicableStages: ["IV", "复发转移"],
    biomarkerDetails: "HER2 阳性 (IHC 3+ 或 FISH+)",
    interventionArm: "T-DXd (5.4 mg/kg) vs T-DM1 (3.6 mg/kg)",
    riskReduction: "-72% 疾病进展风险 (HR=0.28, P<0.001)"
  },
  {
    id: "destiny_breast04_2022",
    title: "Trastuzumab Deruxtecan in Previously Treated HER2-Low Advanced Breast Cancer (DESTINY-Breast04)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2022,
    patientN: 557,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2203690",
    pubmedId: "35665782",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2203690",
    keyConclusions: [
      "全球首次在「HER2 低表达 (HER2-low: IHC 1+ 或 2+/FISH-)」群体中证实靶向治疗能显著延长无进展生存期与总生存期（PFS 从 5.1 个月翻倍至 9.9 个月）。",
      "重塑了半个世纪以来的乳腺癌二元分类体系，使占全乳腺癌近一半的 HER2 低表达患者步入 ADC 靶向时代。"
    ],
    relevantFactors: ["HER2低表达", "HER2-low", "T-DXd", "DESTINY-Breast04"],
    applicableStages: ["IV", "晚期"],
    biomarkerDetails: "HER2-low (IHC 1+ 或 IHC 2+/FISH阴性)",
    interventionArm: "T-DXd vs 医生选择的化疗",
    riskReduction: "-50% 疾病进展风险 (HR=0.50, P<0.001)"
  },
  {
    id: "acosog_z0011_2017",
    title: "Effect of Axillary Dissection vs No Axillary Dissection on 10-Year Overall Survival Among Women With Invasive Breast Cancer and Sentinel Node Metastases (ACOSOG Z0011)",
    journal: "Journal of the American Medical Association (JAMA)",
    year: 2017,
    patientN: 891,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1001/jama.2017.11470",
    pubmedId: "28897521",
    url: "https://jamanetwork.com/journals/jama/fullarticle/2653737",
    keyConclusions: [
      "保乳术中 1~2 个前哨淋巴结转移患者，免除腋窝淋巴结清扫 (ALND) 组与全清扫组相比，10 年总生存率完全无差异 (86.3% vs 83.6%)。",
      "彻底奠定了现代乳腺外科微创化的国际基石，极大避免了患侧上肢淋巴水肿的终生致残风险。"
    ],
    relevantFactors: ["前哨淋巴结", "SLNB", "免除腋窝清扫", "保乳放疗"],
    applicableStages: ["I", "II", "T1-T2 N1mi/N1"],
    biomarkerDetails: "临床 T1-T2 N0，术中 1-2 枚前哨淋巴结阳性",
    interventionArm: "单纯前哨活检 (免清扫) vs 腋窝淋巴结清扫 (ALND)",
    riskReduction: "10年总生存完全等效 (HR=0.93, P=0.72)"
  },
  {
    id: "keynote_522_2022",
    title: "Event-Free Survival with Pembrolizumab in Early Triple-Negative Breast Cancer (KEYNOTE-522)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2022,
    patientN: 1174,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2112651",
    pubmedId: "35134293",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2112651",
    keyConclusions: [
      "高危早期三阴性乳腺癌 (TNBC) 新辅助化疗加用帕博利珠单抗 (K药)，病理完全缓解率 (pCR) 显著提升至 64.8% (对照组 51.2%)。",
      "36 个月无事件生存率 (EFS) 从 76.8% 显著提升至 84.5%，复发转移或死亡风险降低 37% (HR=0.63)。",
      "确立了早期 TNBC 免疫联合化疗全病程新辅助/辅助的标准治疗新格局。"
    ],
    relevantFactors: ["三阴性", "TNBC", "帕博利珠单抗", "KEYNOTE-522", "pCR", "免疫治疗"],
    applicableStages: ["II", "III", "T1c N1-2", "T2-4 N0-2"],
    biomarkerDetails: "三阴性 (ER-/PR-/HER2-)，新辅助治疗人群",
    interventionArm: "帕博利珠单抗+化疗 (术前) 序贯 帕博利珠单抗单药 (术后) vs 安慰剂+化疗",
    riskReduction: "-37% 事件发生风险 (HR=0.63, P<0.001)"
  },
  {
    id: "olympia_2021",
    title: "Adjuvant Olaparib for Patients with BRCA1- or BRCA2-Mutated Breast Cancer (OlympiA)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2021,
    patientN: 1836,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa2105215",
    pubmedId: "34081848",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa2105215",
    keyConclusions: [
      "伴胚系 BRCA1/2 突变的高危早期 HER2 阴性乳腺癌患者，完成局部治疗与化疗后口服奥拉帕利 1 年，3 年无浸润复发生存率达 85.9% vs 77.1%。",
      "侵袭性复发或死亡风险大幅降低 42% (HR=0.58)，4 年总生存期也展现显著获益 (HR=0.68)。",
      "奠定了 BRCA 基因致病突变携带者术后靶向辅助维持治疗的国际里程碑标准。"
    ],
    relevantFactors: ["BRCA1", "BRCA2", "奥拉帕利", "PARP抑制剂", "OlympiA", "遗传性乳腺癌"],
    applicableStages: ["II", "III", "高危早期"],
    biomarkerDetails: "胚系 BRCA1/2 突变 / HER2 阴性 / 高危早期 (TNBC 或高危 HR+)",
    interventionArm: "奥拉帕利 300mg bid 口服1年 vs 安慰剂",
    riskReduction: "-42% 浸润性复发风险 (HR=0.58, P<0.001)"
  },
  {
    id: "aphinity_2017",
    title: "Adjuvant Pertuzumab and Trastuzumab in Early HER2-Positive Breast Cancer (APHINITY)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2017,
    patientN: 4805,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1703643",
    pubmedId: "28581356",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1703643",
    keyConclusions: [
      "高危早期 HER2 阳性患者在单靶曲妥珠单抗基础上联合帕妥珠单抗 (HP双靶)，6 年随访证实淋巴结阳性亚组 iDFS 绝对获益达 4.5% (87.9% vs 83.4%)。",
      "淋巴结阳性人群复发转移风险显著降低 28% (HR=0.72)，成为全球高危 HER2 阳性辅助治疗的一致金标准。"
    ],
    relevantFactors: ["HER2阳性", "帕妥珠单抗", "曲妥珠单抗", "HP双靶", "APHINITY"],
    applicableStages: ["I", "II", "III"],
    biomarkerDetails: "HER2 阳性 (IHC 3+ 或 FISH+) / 淋巴结阳性或肿块>2cm",
    interventionArm: "帕妥珠单抗+曲妥珠单抗+化疗 (1年) vs 曲妥珠单抗+化疗",
    riskReduction: "-28% 复发风险 (淋巴结阳性组 HR=0.72)"
  },
  {
    id: "katherine_2019",
    title: "Trastuzumab Emtansine for Residual Invasive HER2-Positive Breast Cancer (KATHERINE)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2019,
    patientN: 1486,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1814017",
    pubmedId: "30516102",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1814017",
    keyConclusions: [
      "新辅助治疗后手术病理仍有残存浸润癌 (non-pCR) 的 HER2 阳性患者，术后改用 ADC 药物 T-DM1 辅助治疗 14 周期，3 年 iDFS 达 88.3% (对照组 77.0%)。",
      "浸润性复发或死亡风险断崖式降低 50% (HR=0.50)，确立了新辅助未达完全缓解者的标准换药强化方案。"
    ],
    relevantFactors: ["T-DM1", "KATHERINE", "残存病灶", "non-pCR", "HER2阳性强化"],
    applicableStages: ["ypT1-4", "ypN1-3", "新辅助术后残存"],
    biomarkerDetails: "新辅助靶向化疗后乳腺或淋巴结仍有残存浸润癌",
    interventionArm: "T-DM1 (3.6 mg/kg Q3W) vs 曲妥珠单抗单靶",
    riskReduction: "-50% 浸润性复发风险 (HR=0.50, P<0.001)"
  },
  {
    id: "create_x_2017",
    title: "Adjuvant Capecitabine for Breast Cancer after Preoperative Chemotherapy (CREATE-X)",
    journal: "New England Journal of Medicine (NEJM)",
    year: 2017,
    patientN: 910,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1056/NEJMoa1612645",
    pubmedId: "28564564",
    url: "https://www.nejm.org/doi/full/10.1056/NEJMoa1612645",
    keyConclusions: [
      "针对术前新辅助化疗后未达 pCR 的 HER2 阴性乳腺癌患者，术后加用口服卡培他滨强化辅助治疗 6~8 周期，5 年无病生存率由 67.6% 提升至 74.1% (HR=0.70)。",
      "在三阴性 (TNBC) 亚组中获益尤为显著，5 年总生存率提高达 8.5% (78.8% vs 70.3%，死亡风险降低 48%)。"
    ],
    relevantFactors: ["卡培他滨", "CREATE-X", "三阴性强化", "non-pCR", "新辅助残存"],
    applicableStages: ["ypT1-4", "ypN1-3", "HER2阴性"],
    biomarkerDetails: "HER2 阴性 / 新辅助术后病理有残存病灶 (non-pCR)",
    interventionArm: "卡培他滨口服 (1250 mg/m2 bid d1-14 q3w, 8周期) vs 标准对照",
    riskReduction: "-48% TNBC死亡风险 (HR=0.52, P=0.01)"
  },
  {
    id: "soft_text_2018",
    title: "Absolute Improvements in Freedom from Distant Recurrence to 9 Years on TEXT and SOFT Trials",
    journal: "Journal of Clinical Oncology (JCO)",
    year: 2018,
    patientN: 4891,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1200/JCO.18.01059",
    pubmedId: "30321073",
    url: "https://ascopubs.org/doi/10.1200/JCO.18.01059",
    keyConclusions: [
      "针对绝经前高危 HR+ 乳腺癌（尤其淋巴结阳性或接受过化疗者），卵巢功能抑制 (OFS 诺雷得) 联合芳香化酶抑制剂依西美坦，较单纯他莫昔芬显著提高 9 年无远处复发率 (89.0% vs 84.5%)。",
      "奠定了绝经前年轻中高危患者「打闭经针 + 口服芳香化酶抑制剂」的现代标准内分泌强化策略。"
    ],
    relevantFactors: ["OFS", "卵巢功能抑制", "SOFT", "TEXT", "绝经前强化", "依西美坦"],
    applicableStages: ["I", "II", "III", "绝经前高危"],
    biomarkerDetails: "绝经前女性 / HR+ / HER2- / 伴高危复发因素",
    interventionArm: "OFS + 依西美坦 vs OFS + 他莫昔芬 vs 单纯他莫昔芬",
    riskReduction: "-30% 复发风险 (OFS+AI vs TAM, HR=0.70)"
  },
  {
    id: "atlas_2013",
    title: "Long-term effects of continuing adjuvant tamoxifen to 10 years versus stopping at 5 years (ATLAS)",
    journal: "The Lancet",
    year: 2013,
    patientN: 12894,
    studyType: "rct",
    evidenceLevel: 5,
    doi: "10.1016/S0140-6736(12)61963-1",
    pubmedId: "23219177",
    url: "https://www.thelancet.com/journals/lancet/article/PIIS0140-6736(12)61963-1/fulltext",
    keyConclusions: [
      "万余名 HR+ 乳腺癌患者 15 年长期随访证实：坚持他莫昔芬治疗至 10 年对比 5 年停药，使诊断后第 10 年起的乳腺癌复发率进一步降低 25%，死亡率降低 29%。",
      "证实了激素受体阳性晚期潜伏复发风险可通过长程内分泌治疗有效遏制，确立了中高危患者 10 年长程内分泌方案。"
    ],
    relevantFactors: ["他莫昔芬10年", "ATLAS", "长程内分泌", "延长时间", "15年随访"],
    applicableStages: ["I", "II", "III", "HR+"],
    biomarkerDetails: "HR+ 早期乳腺癌，已完成5年他莫昔芬且无复发",
    interventionArm: "继续他莫昔芬至10年 vs 5年停药观察",
    riskReduction: "-29% 乳腺癌死亡率 (诊断10年后 HR=0.71, P=0.002)"
  }
];
