import type { WikiTopic, WikiCategory } from "./wikiData";

export const BREAST_WIKI_TOPICS: WikiTopic[] = [
  // ==========================================
  // 一、 影像筛查与早期病变 (Screening & Early Stage) - 4 篇
  // ==========================================
  {
    id: "bi_rads_scale",
    category: "nodule",
    subcategory: "影像评级",
    title: "BI-RADS 分级白话拆解",
    subtitle: "从 0 类到 6 类：究竟几类需要穿刺？几类只需定期随访？",
    icon: "Scan",
    riskLevel: "moderate",
    priorityOrder: 95,
    visualComponent: "BiRadsScaleVisual",
    searchKeywords: ["BI-RADS", "BIRADS", "乳腺影像评级", "4A", "4B", "4C", "5类", "3类结节", "穿刺指征", "ACR", "超声结节", "钼靶结节"],
    metaphor: "BI-RADS 就像交通信号灯与安全警报器的组合——1~2类是绿色安全通行证，3类是黄色观察提醒，4类以上才是需要派侦察兵（活检穿刺）查探的哨声。",
    clinicalTruth: "ACR BI-RADS 3 类恶性率严格 <2%，国际公认只需 3~6 个月超声复查，盲目穿刺属过度诊疗；4A 类恶性率仅 2%~10%，90% 以上为良性；只有 4B (10%~50%)、4C (50%~95%) 和 5 类 (≥95%) 必须常规穿刺活检明确病理。",
    tactics: [
      "BI-RADS 3 类请遵医嘱保持 3~6 个月短期随访，随访 2~3 年稳定自动降为 2 类；",
      "BI-RADS 4A 类不要恐慌，90% 概率是良性（如纤维腺瘤或微囊肿）；",
      "若达到 4B 及以上，请在超声或钼靶定位下行空芯针穿刺活检 (CNB) 明确病理。"
    ],
    reassurance: "即便拿到 4 类报告，十个人中仍有大部分是虚惊一场的良性病变；理性做活检只是为了彻底排除隐患。",
    keyMetric: {
      label: "BI-RADS 3类恶性风险",
      value: "≤ 1.8%",
      source: "Radiology 2019 / ACR BI-RADS 5th Edition"
    },
    faq: [
      {
        question: "B超报 3 类，钼靶报 4A 类，以哪一个为准？",
        answer: "超声对软组织肿块敏感，钼靶对微小钙化敏感。通常取最高级别（4A类）进一步复查或评估，不必过度担忧。"
      },
      {
        question: "3 类结节吃消结散结的中药能消掉吗？",
        answer: "乳腺实性纤维腺瘤由纤维与腺上皮构成，任何口服药物均无法使其自行融化消失，定期随访是唯一科学证据支持的做法。"
      }
    ]
  },
  {
    id: "microcalcifications",
    category: "nodule",
    subcategory: "钼靶征象",
    title: "钼靶微钙化 (Microcalcifications)",
    subtitle: "粗大良性钙化 vs 泥沙样成簇微钙化：识别早期原位癌信号",
    icon: "Layers",
    riskLevel: "high",
    priorityOrder: 90,
    visualComponent: "MicrocalcificationVisual",
    searchKeywords: ["钙化", "微钙化", "钼靶钙化", "成簇微钙化", "泥沙样钙化", "粗钙化", "DCIS", "导管原位癌", "麦默通", "乳腺钙化"],
    metaphor: "粗大孤立的钙化就像海滩上的贝壳碎片，大多是良性腺体退化的痕迹；而成簇分布的多形性泥沙样微细钙化，则像散落的面粉，可能提示导管原位癌的微观分泌物。",
    clinicalTruth: "散在、圆形的粗大钙化（如爆米花样纤维腺瘤钙化）100% 良性；而成簇状、线样分支状微钙化可能提示导管内坏死与原位癌（DCIS），需行钼靶立体定位微创活检。",
    tactics: [
      "钼靶提示粗大点状钙化无需任何治疗，正常每年体检即可；",
      "若提示成簇分布（每平方厘米 >5 枚）微钙化，建议乳腺外科就诊；",
      "必要时行钼靶立体定位真空辅助旋切活检（麦默通），病理排查早期原位癌。"
    ],
    reassurance: "即使微钙化确诊为原位癌 (DCIS)，它也属于未突破基底膜的零期病变，规范完整切除后 10 年生存率接近 100%！",
    keyMetric: {
      label: "良性粗钙化恶性风险",
      value: "0%",
      source: "AJR 2021 / ACR Guidelines"
    },
    faq: [
      {
        question: "为什么平时做 B 超没发现钙化，做钼靶却报了钙化？",
        answer: "高频超声对小于 0.5mm 的微细钙化分辨率有限，而钼靶 X 线是目前国际公认检测乳腺微钙化的金标准影像手段。"
      }
    ]
  },
  {
    id: "breast_density",
    category: "nodule",
    subcategory: "腺体分型",
    title: "致密型乳腺 (Dense Breast)",
    subtitle: "中国女性高发致密腺体：为什么需要「钼靶 + 超声」黄金组合？",
    icon: "ShieldCheck",
    riskLevel: "low",
    priorityOrder: 40,
    visualComponent: "BiRadsScaleVisual",
    searchKeywords: ["致密型乳腺", "致密腺体", "Type C", "Type D", "乳腺超声", "钼靶漏诊", "乳腺MRI", "腺体分型", "乳腺筛查"],
    metaphor: "在极度致密的腺体背景下寻找肿块，就像在一场大雪中寻找一只小白兔；钼靶容易被白色腺体遮挡，而超声波能穿透雪层探查实物。",
    clinicalTruth: "中国约 70% 绝经前女性属于致密型乳腺（C/D 型）。单纯钼靶漏诊率可达 30%~40%，指南一致推荐「钼靶 + 高频彩色多普勒超声」强强联合筛查。",
    tactics: [
      "体检报告若提示「乳腺致密 (Type C/D)」，切勿单做钼靶，务必加做高频彩超；",
      "高危人群（如有家族史）每 1~2 年可补充一次乳腺增强核磁共振 (MRI)；",
      "致密型乳腺本身是生理发育特征，绝不代表已经患癌。"
    ],
    reassurance: "致密腺体是中国女性的普遍常态，只要双项联合检查，就能织起最严密的早筛保护网。",
    keyMetric: {
      label: "超声联合钼靶漏诊降低率",
      value: "42%",
      source: "JAMA 2020 Chinese Multi-center Cohort"
    },
    faq: [
      {
        question: "做乳腺 MRI 检查有辐射吗？",
        answer: "核磁共振 (MRI) 依靠磁场成像，完全没有电离辐射，安全性极高。"
      }
    ]
  },
  {
    id: "dcis_in_situ",
    category: "nodule",
    subcategory: "零期病变",
    title: "导管原位癌 (DCIS 零期乳腺癌)",
    subtitle: "基底膜完好无损的零期病变：为什么它完全不具备致命转移能力？",
    icon: "ShieldCheck",
    riskLevel: "safe",
    priorityOrder: 89,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["DCIS", "导管原位癌", "零期乳腺癌", "0期乳腺癌", "基底膜", "保乳放疗", "非浸润性癌", "Van Nuys", "微钙化病理"],
    metaphor: "DCIS 就像被关在坚固防弹玻璃房间里的调皮捣蛋分子，基底膜这扇防弹玻璃门完好无损，癌细胞根本接触不到外面的血管和淋巴管，因此绝对无法远走高飞。",
    clinicalTruth: "DCIS 是纯粹的非浸润性原位癌，癌细胞完全局限在乳腺导管内。只要手术达到切缘阴性（R0），其远期特异性生存率高达 98%~99% 以上。国际指南明确严禁对纯 DCIS 进行全身化疗！",
    tactics: [
      "根据病灶范围选择保乳手术加术后全乳放疗，或全乳房单纯切除（伴即刻重建）；",
      "若做保乳手术，切缘净度至关重要（至少达到 2mm 安全切缘）；",
      "纯 DCIS 绝对不需要化疗，激素受体阳性者可口服他莫昔芬 5 年降低对侧新发风险。"
    ],
    reassurance: "DCIS 被医学界称为「可以彻底治愈的零期乳腺癌」，它是早筛成功阻击癌症的最佳范例。",
    keyMetric: {
      label: "规范治疗 DCIS 10年特异生存率",
      value: "> 99%",
      source: "JAMA Oncology 2020 / Early Breast Cancer Trialists"
    },
    faq: [
      {
        question: "DCIS 手术后需要清扫腋窝淋巴结吗？",
        answer: "纯 DCIS 癌细胞未穿透基底膜，发生淋巴转移概率 <1%，常规无需腋窝淋巴结清扫。仅在做全乳切除或怀疑微浸润时预防性行前哨活检 (SLNB)。"
      }
    ]
  },

  // ==========================================
  // 二、 浸润病理与组织学高危因子 (Pathology & Risk) - 6 篇
  // ==========================================
  {
    id: "invasive_ductal_carcinoma",
    category: "pathology",
    subcategory: "病理类型",
    title: "浸润性导管癌 (IDC) 与浸润性小叶癌 (ILC)",
    subtitle: "乳腺癌最常见病理类型拆解：突破基底膜的真相与现代治愈率",
    icon: "Microscope",
    riskLevel: "high",
    priorityOrder: 100,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["IDC", "浸润性导管癌", "ILC", "浸润性小叶癌", "浸润癌", "病理类型", "保乳指征", "非特殊型浸润癌"],
    metaphor: "导管就像乳腺内部的水管管道，肿瘤细胞突破水管壁向外生长称为浸润；现代外科与综合药物治疗能够将这些突破的游离细胞全面歼灭在根部。",
    clinicalTruth: "非特殊型浸润性导管癌 (IDC-NST) 占所有乳腺癌的 70%~80%。浸润并不等于晚期，肿瘤大小、淋巴结状态与受体分子分型才是决定预后的核心关键。",
    tactics: [
      "不必因「浸润」二字盲目恐慌，I~II 期早期 IDC 治愈率极高；",
      "等待完整的免疫组化 (IHC) 结果（ER、PR、HER2、Ki-67），这是制定后续治疗方案的核心航标；",
      "根据肿块大小与乳房体积比例评估是否具备保乳手术指征。"
    ],
    reassurance: "在我国早期浸润性乳腺癌患者中，5 年生存率已突破 90% 以上，治愈已成为普遍现实。",
    keyMetric: {
      label: "早期 IDC 5年总生存率 (OS)",
      value: "> 93%",
      source: "CSCO BC Guidelines 2024 / NCCN 2024"
    },
    faq: [
      {
        question: "浸润性小叶癌 (ILC) 和浸润性导管癌有什么不同？",
        answer: "小叶癌由于缺乏 E-cadherin 黏附蛋白，常呈单行线性浸润生长，质地较软，钼靶不易显影，对侧乳腺多发倾向略高，通常需重点做 MRI 评估。"
      }
    ]
  },
  {
    id: "nottingham_grade",
    category: "pathology",
    subcategory: "病理分级",
    title: "组织学分级 (Nottingham SBR 1~3级)",
    subtitle: "显微镜下细胞异型性：分级高就一定更危险吗？",
    icon: "Activity",
    riskLevel: "moderate",
    priorityOrder: 85,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["Nottingham", "组织学分级", "G1", "G2", "G3", "SBR分级", "分化程度", "核分裂象", "腺管形成"],
    metaphor: "分级如同看肿瘤细胞长得像不像正常的乳腺细胞——1级像规矩排列的学生，3级像冲动的熊孩子；但熊孩子对化疗杀伤药物反而格外敏感脆弱。",
    clinicalTruth: "Nottingham 评分整合腺管形成率、核多形性与核分裂象计数（总分 3~9 分）：3~5 分为 G1 (分化好)，6~7 分为 G2 (中等)，8~9 分为 G3 (差)。G3 虽然增殖快，但对含铂/紫杉类化疗具有极高应答敏感性。",
    tactics: [
      "若为 G1 级，说明肿瘤惰性温和，复发风险极低；",
      "若为 G3 级，说明细胞增殖快，更应严格遵医嘱完成规范化化疗或强化治疗；",
      "分级必须与 TNM 分期和受体状态结合看，切勿单凭一项分级自己吓自己。"
    ],
    reassurance: "分级高代表细胞在显微镜下的活跃度，绝不等于不可治愈，现代药物对高活跃细胞有极强打击力。",
    keyMetric: {
      label: "G1级患者10年良好预后率",
      value: "88% ~ 94%",
      source: "Nottingham Ten-Year Prognostic Cohort"
    },
    faq: [
      {
        question: "分期和分级是一回事吗？",
        answer: "完全不同！分期 (Stage I~IV) 代表肿瘤扩散的解剖范围和大小；分级 (Grade 1~3) 代表显微镜下单个细胞的长相和恶性度。"
      }
    ]
  },
  {
    id: "margins_no_ink",
    category: "pathology",
    subcategory: "外科切缘",
    title: "保乳切缘标准：墨汁未染癌 (No Ink on Tumor)",
    subtitle: "做保乳手术切缘切多大才安全？切缘阴性意味着什么？",
    icon: "ShieldCheck",
    riskLevel: "safe",
    priorityOrder: 30,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["切缘", "墨汁未染癌", "No ink on tumor", "R0切除", "切缘阴性", "保乳切缘", "保乳放疗", "扩大切除"],
    metaphor: "病理医生会在切下的标本表面涂上专用墨汁，只要显微镜下墨汁边缘没有沾染到癌细胞，就证明肿块被完好地整体搬出，周围正常组织干干净净。",
    clinicalTruth: "根据 SSO/ASTRO 国际指南，浸润性乳腺癌保乳切缘达到「墨汁未染癌 (No ink on tumor)」即达到 R0 完整根治标准；无需盲目追求数厘米的扩大切除，盲目扩大切除并不增加生存获益反而破坏乳房美观。",
    tactics: [
      "术后病理报告若明确写有「各切缘未见癌」或「R0切除」，说明外科手术大获全胜；",
      "保乳术后常规配合全乳房低分割放疗，即可达到与全乳切除完全等同的长期生存率；",
      "若切缘阳性（切缘见癌），医生通常会进行二次局部扩切，依然有机会保留乳房。"
    ],
    reassurance: "切缘阴性是外科治愈的第一块基石，配合术后规范放疗，保乳与全切的生存期完全没有差异。",
    keyMetric: {
      label: "切缘阴性保乳术长期局控率",
      value: "97% ~ 99%",
      source: "SSO/ASTRO Consensus Guideline (JCO)"
    },
    faq: [
      {
        question: "全切是不是比保乳更安全、更不容易复发？",
        answer: "长达 20 年的国际多中心 RCT 随访（如 NSABP B-06、米兰试验）反复证明，保乳联合放疗的远期总生存率与全乳切除完全相同，甚至患者心理满意度和生活质量显著更高。"
      }
    ]
  },
  {
    id: "slnb_sentinel_nodes",
    category: "pathology",
    subcategory: "淋巴结评估",
    title: "前哨淋巴结活检 (SLNB) 与微转移",
    subtitle: "告别全清扫胳膊粗肿痛时代：1~2枚前哨阳性一定要清扫腋窝吗？",
    icon: "Layers",
    riskLevel: "moderate",
    priorityOrder: 75,
    visualComponent: "LymphedemaArmVisual",
    searchKeywords: ["前哨淋巴结", "SLNB", "前哨活检", "微转移", "Z0011", "免除清扫", "腋窝清扫", "ALND", "淋巴结转移"],
    metaphor: "前哨淋基结是癌细胞从乳房外逃遇到的第一道关卡（哨兵站）。只要哨兵站守住了（阴性），后面的大部队驻地（腋窝大网）就绝对安全，无需大动干戈全盘清扫。",
    clinicalTruth: "前哨淋巴结活检 (SLNB) 已完全取代传统全面腋窝清扫 (ALND)。根据经典的 ACOSOG Z0011 临床试验，保乳术中即便有 1~2 枚前哨淋巴结阳性，只要配合术后规范全乳放疗与全身辅助治疗，免除腋窝清扫患者的长期生存率与清扫组毫无差异！",
    tactics: [
      "前哨活检阴性患者严禁做腋窝清扫，极大保护患侧上肢淋巴回流，避免术后手脚水肿；",
      "病理若提示孤立肿瘤细胞 (i+) 或微转移 (pN1mi ≤2mm)，临床预后等同于阴性；",
      "若前哨阳性枚数较多（≥3枚）或全切未做放疗，医生会审慎评估是否需补充腋窝处理。"
    ],
    reassurance: "避免不必要的腋窝清扫，是现代乳腺外科最伟大的微创进步之一，让患者远离终生胳膊粗胀的痛苦。",
    keyMetric: {
      label: "ACOSOG Z0011 10年总生存率",
      value: "86.3% (免清扫组)",
      source: "JAMA 2017 / 10-Year Follow-up"
    },
    faq: [
      {
        question: "前哨淋巴结是怎么在手术台上找出来的？",
        answer: "术前或术中通过向乳晕区注射纳米炭、荧光示踪剂或同位素，顺着淋巴管第一批染色的 1~4 枚淋巴结即为前哨淋巴结，术中做快速冰冻切片。"
      }
    ]
  },
  {
    id: "neoadjuvant_pcr",
    category: "pathology",
    subcategory: "新辅助疗效",
    title: "新辅助治疗与病理完全缓解 (pCR)",
    subtitle: "术前打化疗/靶向能把肿瘤彻底打没吗？达到 pCR 意味着什么？",
    icon: "Award",
    riskLevel: "high",
    priorityOrder: 96,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["新辅助治疗", "pCR", "病理完全缓解", "MP评分", "RCB", "残存病灶", "降期保乳", "新辅助化疗", "术前化疗"],
    metaphor: "新辅助治疗就像在手术前发动一次饱和式精准轰炸，让病理医生在术后切下来的标本显微镜下掘地三尺，也找不到哪怕一颗有活力的癌细胞——这就是 pCR。",
    clinicalTruth: "病理完全缓解 (pCR，定义为 ypT0/is ypN0) 是早期 HER2 阳性和三阴性乳腺癌长期无事件生存的最强替代终点。达到 pCR 的患者 5 年无复发生存率超过 90%~95%！即使未达 pCR (non-pCR)，现代靶向与化疗强化方案（T-DM1 或卡培他滨）仍能筑起强力二道防线。",
    tactics: [
      "肿块 >2cm 或腋窝淋巴结转移者，推荐首选术前新辅助治疗（化疗+靶向/免疫）；",
      "新辅助期间每 2 个周期通过彩超或 MRI 评估退缩幅度（RECIST 标准）；",
      "若术后病理证实达到 pCR，后续继续完成靶向满 1 年即可；若未达 pCR，遵医嘱加用强化方案。"
    ],
    reassurance: "新辅助治疗不仅让原本无法保乳的患者成功保乳，更是体内药物敏感性的实时测验，为术后精准决策提供最坚实依据。",
    keyMetric: {
      label: "HER2阳性新辅助HP双靶 pCR率",
      value: "60% ~ 70%",
      source: "NeoSphere / TRYPHAENA / PEONY 试验"
    },
    faq: [
      {
        question: "新辅助治疗后如果肿瘤完全摸不到了，是不是可以不做手术？",
        answer: "绝对不行！影像学消失不等于显微镜下 100% 根除。目前国际标准仍必须进行外科手术，完整切除原发肿瘤瘤床并评估前哨淋巴结，以病理切片为最终准绳。"
      }
    ]
  },
  {
    id: "ki67_proliferation_index",
    category: "pathology",
    subcategory: "增殖指数",
    title: "Ki-67 增殖指数：14%~20% 灰区判读与化疗决策",
    subtitle: "病理报告上的百分比：高活跃细胞的危险与化疗高敏感性",
    icon: "Activity",
    riskLevel: "moderate",
    priorityOrder: 80,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["Ki-67", "Ki67", "增殖指数", "灰区", "14%", "20%", "细胞分裂", "核分裂象", "化疗获益", "增殖活跃度"],
    metaphor: "Ki-67 就像汽车的发动机转速表：低于 14% 是慢悠悠的怠速滑行，超过 30% 是高速飞驰；虽然跑得快看似危险，但化疗药物的钉子恰恰最容易扎破飞驰的车胎。",
    clinicalTruth: "Ki-67 指示处于细胞分裂增殖周期的细胞比例。St. Gallen 共识将 <14% 归为低表达 (Luminal A 特征)，>20%~30% 归为高表达。14%~20% 属于国际公认的临床灰区，通常需要结合 PR 水平、分级以及 21 基因检测综合裁决是否化疗。",
    tactics: [
      "Ki-67 < 14% 且 HR+ HER2- 患者：通常无需化疗，单纯内分泌治疗即可获得极佳预后；",
      "Ki-67 处于 14%~20% 灰区：建议行 21 基因 (Oncotype DX) 或 MammaPrint 基因检测精准定性；",
      "Ki-67 > 30%：提示细胞增殖旺盛，对紫杉类/蒽环类化疗敏感性显著更高，遵医嘱规律化疗。"
    ],
    reassurance: "Ki-67 高只说明细胞长得快，绝不代表晚期；正因为长得快，化疗药物杀灭它的效果反而立竿见影。",
    keyMetric: {
      label: "Ki-67 <14% 免化疗良好预后率",
      value: "> 94%",
      source: "St. Gallen International Breast Cancer Consensus"
    },
    faq: [
      {
        question: "为什么同一家医院穿刺标本和手术大标本的 Ki-67 数值不一样？",
        answer: "肿瘤组织内部存在空间异质性（不同区域生长速度不同），穿刺只取了一小条，而手术大标本涵盖范围更广，通常以手术大标本的热点区 (Hot spot) 评估为准。"
      }
    ]
  },

  // ==========================================
  // 三、 受体分型与精准靶向 (Genetics & Subtypes) - 5 篇
  // ==========================================
  {
    id: "luminal_a_and_b",
    category: "genetics",
    subcategory: "分子分型",
    title: "Luminal A 型与 Luminal B 型：激素受体阳性全解",
    subtitle: "ER 与 PR 阳性的定心丸：为什么内分泌治疗是治愈核心？",
    icon: "Dna",
    riskLevel: "safe",
    priorityOrder: 98,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["Luminal A", "Luminal B", "ER", "PR", "雌激素受体", "孕激素受体", "内分泌治疗", "他莫昔芬", "来曲唑", "阿那曲唑"],
    metaphor: "激素受体 (ER/PR) 就像癌细胞嘴里的食物开关，内分泌药物如同关掉供给开关断其粮草，癌细胞便会自然凋亡饥饿而死，这种断粮疗法比化疗更加长效持久。",
    clinicalTruth: "Luminal A 型（ER+, PR+, HER2-, Ki-67低）占全乳腺癌近 60%，恶性度低，长程 5~10 年内分泌治疗疗效极其优越，大部分患者无需化疗；Luminal B 型细胞活跃度稍高，结合基因检测评估化疗与 CDK4/6 抑制剂强化。",
    tactics: [
      "确认 ER/PR 百分比数值，阳性率越高（如 >50%~90%），内分泌治疗获益越大；",
      "坚持长期服药（绝经前他莫昔芬，绝经后来曲唑/阿那曲唑），切勿自行停药；",
      "定期监测骨密度、血脂及妇科子宫内膜超声。"
    ],
    reassurance: "属于 Luminal A 型是乳腺癌中最大的幸运，它属于预后最好的一类，规范内分泌治疗治愈率极高。",
    keyMetric: {
      label: "Luminal A 型 5年无病生存率",
      value: "> 95%",
      source: "St. Gallen Consensus Guidelines"
    },
    faq: [
      {
        question: "为什么有人说激素受体阳性 5 年后还会复发？",
        answer: "HR+ 肿瘤生长缓慢，确实存在晚期复发风险。国际前瞻性 ATLAS 与 aTTOM 研究证实，将内分泌治疗从 5 年延长至 10 年，能显著压低 10 年后的复发曲线。"
      }
    ]
  },
  {
    id: "her2_positive_and_adc",
    category: "genetics",
    subcategory: "靶向治疗",
    title: "HER2 阳性与 ADC 生物导弹时代",
    subtitle: "从过去的最凶险分型，到如今拥有最强靶向武器（曲妥+帕妥+T-DXd）",
    icon: "Target",
    riskLevel: "high",
    priorityOrder: 92,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["HER2", "HER2阳性", "曲妥珠单抗", "赫赛汀", "帕妥珠单抗", "双靶向", "T-DXd", "德曲妥珠单抗", "ADC", "HER2低表达"],
    metaphor: "过去 HER2 扩增像恶性加速油门，但如今医学为它精准装上了制动闸（曲妥珠单抗）与定向精准制导导弹（ADC 药物 T-DXd），药物直接穿透细胞精准引爆。",
    clinicalTruth: "HER2 (IHC 3+ 或 FISH+) 曾是侵袭性代表，但自赫赛汀（曲妥珠）联合帕捷特（帕妥珠）双靶问世以来，早期治愈率已跨越式提高；新一代 ADC 药物德曲妥珠单抗 (T-DXd) 更是攻破了 HER2 低表达难题。",
    tactics: [
      "IHC 2+ 结果属于不确定，必须补充 FISH 基因扩增检测最终定性；",
      "HER2 阳性早期高危（淋巴结阳性或肿块>2cm）首选曲妥珠单抗 + 帕妥珠单抗满 1 年双靶向辅助；",
      "定期复查心脏超声（LVEF 射血分数），监测靶向药心脏安全性。"
    ],
    reassurance: "HER2 阳性已彻底摆脱当年的绝望标签，在靶向药双重保护下，预后已完全比肩甚至超越其他亚型。",
    keyMetric: {
      label: "HP双靶较单靶降低复发风险",
      value: "-24% (HR=0.76)",
      source: "APHINITY Trial (NEJM 6-Year Update)"
    },
    faq: [
      {
        question: "什么是 HER2 低表达 (HER2-low)？",
        answer: "指免疫组化 IHC 1+ 或 IHC 2+ 且 FISH 阴性的患者。过去被归为 HER2 阴性，如今根据 DESTINY-Breast04 研究，这类患者也可从新一代 ADC 药物中大幅获益。"
      }
    ]
  },
  {
    id: "triple_negative_tnbc",
    category: "genetics",
    subcategory: "三阴性突破",
    title: "三阴性乳腺癌 (TNBC) 与免疫治疗新曙光",
    subtitle: "缺少受体不等于绝路：化疗高敏感性与 PD-1 免疫抑制剂破局",
    icon: "AlertTriangle",
    riskLevel: "high",
    priorityOrder: 88,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["三阴性", "TNBC", "免疫治疗", "帕博利珠单抗", "K药", "KEYNOTE-522", "pCR", "卡培他滨", "BRCA"],
    metaphor: "三阴性癌细胞就像不穿制服的敌军，虽然没法用内分泌和 HER2 靶向抓捕，但免疫治疗能擦亮我们自身免疫系统的双眼，调动体内免疫 T 细胞大军进行精准围剿。",
    clinicalTruth: "TNBC 指 ER/PR/HER2 均为阴性，约占 15%。由于增殖极快，对紫杉类与含铂化疗高度敏感。KEYNOTE-522 研究证实新辅助化疗联合帕博利珠单抗 (K药) 免疫治疗，病理完全缓解率 (pCR) 跃升至 64.8%！",
    tactics: [
      "中高危 TNBC 强烈推荐术前新辅助治疗，争取达到肿瘤完全消失 (pCR)；",
      "若术后仍有残存病灶，可口服卡培他滨强化或奥拉帕利维持（若伴 BRCA 突变）；",
      "术后前 3 年是关键监测窗口期，平稳度过 5 年后复发概率将极速断崖式下降。"
    ],
    reassurance: "TNBC 是一个「熬过 5 年即治愈」的病种，只要规范完成初次全面治疗，长期健康存活的患者比比皆是。",
    keyMetric: {
      label: "新辅助免疫联合化疗 pCR 率",
      value: "64.8%",
      source: "KEYNOTE-522 (NEJM 2022)"
    },
    faq: [
      {
        question: "三阴性患者必须做基因检测吗？",
        answer: "建议检测 BRCA1/2 胚系突变。若伴有突变，术后可选用 PARP 抑制剂（奥拉帕利）靶向维持治疗，显著降低复发风险。"
      }
    ]
  },
  {
    id: "oncotype_dx_21_gene",
    category: "genetics",
    subcategory: "基因图谱",
    title: "21 基因 (Oncotype DX) 复发评分：如何免除辅助化疗？",
    subtitle: "TAILORx 权威顶刊共识：0~100 分如何精准避免过度化疗？",
    icon: "Dna",
    riskLevel: "moderate",
    priorityOrder: 82,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["21基因", "Oncotype DX", "RS评分", "TAILORx", "免化疗", "多基因检测", "复发风险评分", "过度治疗防范"],
    metaphor: "21 基因检测就像一次全面的战力摸底考试，它精准量化了未来 10 年肿瘤潜伏复发的概率，分数低的患者完全不需要忍受化疗掉头发与呕吐的痛苦。",
    clinicalTruth: "针对早期 HR+ HER2- 淋巴结阴性患者，TAILORx 万人研究证实：RS 0~10 分为极低风险，免化疗；绝经后患者若 RS 11~25 分，单纯内分泌治疗生存率与加用化疗完全一致，指南一致推荐豁免化疗；仅 RS ≥ 26 分建议化疗。",
    tactics: [
      "适用于 T1~T2、HR+、HER2-、N0 或微小转移患者，避免盲目受化疗之苦；",
      "若 RS 评分处于 0~25 分区间（绝经后），可坚定信心免除辅助化疗；",
      "年轻绝经前女性若 RS 16~25 分，需与医生权衡化疗带来的卵巢去势保护效应。"
    ],
    reassurance: "不化疗不是放弃治疗，而是现代科技赋予低危患者的免受伤害特权，循证指南充分证实其安全性。",
    keyMetric: {
      label: "TAILORx 免化疗组 9年无浸润生存",
      value: "93.9% (与化疗组无差)",
      source: "NEJM 2018 (10,273 例前瞻研究)"
    },
    faq: [
      {
        question: "做 21 基因检测需要额外取肉做手术吗？",
        answer: "完全不需要！直接使用之前手术切除下来封存在医院病理科的石蜡包埋蜡块组织送检即可。"
      }
    ]
  },
  {
    id: "brca_gene_testing",
    category: "genetics",
    subcategory: "遗传突变",
    title: "BRCA1/2 突变与遗传性乳腺癌/卵巢癌综合征",
    subtitle: "朱莉同款基因突变：遗传排查、PARP 靶向药 (奥拉帕利) 与对侧乳腺保护",
    icon: "Dna",
    riskLevel: "high",
    priorityOrder: 86,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["BRCA", "BRCA1", "BRCA2", "遗传性乳腺癌", "HBOC", "PARP抑制剂", "奥拉帕利", "OlympiA", "预防性切除", "卵巢癌风险", "同源重组修复"],
    metaphor: "BRCA 基因就像人体内部负责修复 DNA 破损的工程抢修队；一旦这个工程队基因发生突变罢工，DNA 损伤累积就容易致癌，但这也恰恰让癌细胞出现致命死穴（无法修复双链断裂）。",
    clinicalTruth: "约 5%~10% 的乳腺癌是由胚系 BRCA1/2 基因突变引起（常染色体显性遗传，子女各占 50% 概率）。携带者终生患乳腺癌风险高达 60%~80%，患卵巢癌风险达 20%~40%。OlympiA 研究证实：携带 BRCA 突变的高危早期患者术后使用 PARP 抑制剂（奥拉帕利）维持 1 年，可将死亡风险降低 32%！",
    tactics: [
      "早发性 (<50岁)、三阴性、双侧乳腺癌或有家族肿瘤史者，强烈推荐检测 gBRCA 胚系突变；",
      "携带突变的高危早期患者，术后遵医嘱口服奥拉帕利靶向强化治疗满 1 年；",
      "定期加强对侧乳腺核磁共振 (MRI) 监测，完成生育后建议妇科评估预防性附件切除防范卵巢癌。"
    ],
    reassurance: "查出突变绝非绝症，而是发现了精准阻断病情的靶标；PARP 靶向药能利用其合成致死机制，实施极其精准的毁灭性打击。",
    keyMetric: {
      label: "OlympiA 奥拉帕利降低死亡风险",
      value: "-32% (HR=0.68)",
      source: "NEJM 2022 / OlympiA Phase III Trial"
    },
    faq: [
      {
        question: "携带 BRCA 突变一定要像朱莉一样切除双侧乳房吗？",
        answer: "非必须！保乳手术配合术后规律高敏乳腺增强 MRI 严密监控也是国际公认的科学路径，是否选择预防性全切需根据个人心理预期和医生审慎沟通。"
      }
    ]
  },

  // ==========================================
  // 四、 术后全程康复与随访 (Therapy & Recovery) - 7 篇
  // ==========================================
  {
    id: "lymphedema_prevention",
    category: "recovery",
    subcategory: "术后自查",
    title: "患侧上肢淋巴水肿居家防范与臂围测量",
    subtitle: "术后警惕胳膊粗胀：五条黄金保护红线与自查测量法",
    icon: "ShieldCheck",
    riskLevel: "moderate",
    priorityOrder: 70,
    visualComponent: "LymphedemaArmVisual",
    searchKeywords: ["淋巴水肿", "手臂粗", "患肢水肿", "臂围测量", "五严禁", "弹力袖套", "水肿预防", "水肿自查", "上肢水肿"],
    metaphor: "淋巴管就像手臂里的微细排水下水道，腋窝手术后排水通道变少，因此必须格外呵护这条手臂，严禁超负荷排水（防烫伤、防破损、防高压）。",
    clinicalTruth: "腋窝手术后上肢淋巴水肿是常见并发症（尤其做过腋窝淋巴结清扫或腋窝放疗者）。早期水肿为可逆性，若延误至纤维化期将难以消退，早期臂围监测是核心手段。",
    tactics: [
      "患侧手臂【绝对五严禁】：严禁抽血测血糖、严禁静脉输液、严禁测血压、严禁提重物 (>3kg)、严禁高热暴晒温泉；",
      "定期自查测量：用软尺测量腕横纹、腕上 10cm、肘上 10cm 双侧臂围，双侧差值 >2cm 立即就诊；",
      "若出现早期发胀发沉，可在康复治疗师指导下穿戴量身定制的医用压力弹力袖套。"
    ],
    reassurance: "现代前哨活检技术已让水肿发生率大幅降低；只要养成良好防护习惯，绝大多数患者终生手臂轻松健康。",
    keyMetric: {
      label: "前哨活检 SLNB 术后水肿率",
      value: "< 5%",
      source: "Lancet Oncology Multi-center Meta-analysis"
    },
    faq: [
      {
        question: "做过腋窝清扫的手臂不小心被蚊子叮咬或抓破了怎么办？",
        answer: "立刻用碘伏轻柔消毒，切勿用力抓挠！若 24 小时内出现患肢红斑、皮温发烫、发热，高度警惕丹毒急性感染，必须立即就医静脉抗感染。"
      }
    ]
  },
  {
    id: "shoulder_rehabilitation",
    category: "recovery",
    subcategory: "功能康复",
    title: "术后肩关节功能锻炼日历 (爬墙操指南)",
    subtitle: "防止术后患侧肩膀僵硬、拉扯感与粘连活动受限",
    icon: "Activity",
    riskLevel: "safe",
    priorityOrder: 50,
    visualComponent: "LymphedemaArmVisual",
    searchKeywords: ["爬墙操", "肩关节锻炼", "术后康复", "功能锻炼", "肩膀僵硬", "防粘连", "手指爬墙", "肩关节活动度"],
    metaphor: "手术创口的愈合就像织布，如果不活动，疤痕组织会紧紧缩成一团把肩膀锁死；规律轻柔的拉伸就是让组织柔顺延展。",
    clinicalTruth: "术后早期循序渐进的患侧上肢康复锻炼，能显著降低胸壁粘连与肩周炎发生率，通常术后第 1 天起即可开始远端关节活动，拔除引流管后全面启动爬墙锻炼。",
    tactics: [
      "术后第 1~3 天（卧床与引流期）：仅活动手指、握拳、旋转手腕、轻屈手肘，严禁大范围抬肩；",
      "术后第 7~14 天（引流管拔除后）：启动站立位手指爬墙练习、摸耳摸发动作；",
      "术后 1 个月：全面恢复患侧手臂抬高 180 度上举及向后反手摸背。"
    ],
    reassurance: "轻微的紧绷拉扯感是正常修复过程，只要每天坚持轻柔爬墙 3 次，肩膀完全可以恢复如初。",
    keyMetric: {
      label: "规律功能锻炼肩关节恢复率",
      value: "96.4%",
      source: "Rehabilitation Oncology Standard Protocol"
    },
    faq: [
      {
        question: "锻炼时有些拉扯痛，需要忍痛死命拉伸吗？",
        answer: "绝对不要暴力拉扯！以「稍有紧绷牵拉感、轻度酸痛但在耐受范围内」为准，过激拉伸反而导致皮下渗液或撕裂。"
      }
    ]
  },
  {
    id: "endocrine_bone_and_hot_flashes",
    category: "recovery",
    subcategory: "内分泌对策",
    title: "内分泌治疗常见副作用：潮热盗汗与骨质疏松对策",
    subtitle: "他莫昔芬与芳香化酶抑制剂 (AI) 长期服药居家安心生存指南",
    icon: "ShieldCheck",
    riskLevel: "moderate",
    priorityOrder: 65,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["潮热盗汗", "骨质疏松", "内分泌副作用", "芳香化酶抑制剂", "地舒单抗", "双膦酸盐", "钙片", "蜂王浆禁忌", "他莫昔芬副作用"],
    metaphor: "体内雌激素水平下降就像天气转凉，身体温控中枢偶有短路引起潮热；而骨骼里的钙质流失稍快，只要我们及时把骨钙的仓库补满，就能安稳过冬。",
    clinicalTruth: "他莫昔芬常见副作用为潮热盗汗与子宫内膜增厚；芳香化酶抑制剂（来曲唑/阿那曲唑/依西美坦）常见副作用为关节酸痛与骨量丢失。这些均是药物发挥强烈抗癌效果的伴随信号，完全可通过对症管理缓解。",
    tactics: [
      "服用芳香化酶抑制剂期间：每日补充钙剂（600~1200mg）+ 维生素 D3（800~1000IU），每年复查骨密度 (DXA)；",
      "骨量显著减少 (T值 <-2.5) 者，遵医嘱每半年皮下注射地舒单抗 (Prolia) 或静滴双膦酸盐护骨；",
      "服用他莫昔芬期间：每年做一次经阴道妇科超声，关注子宫内膜厚度与异常阴道出血。"
    ],
    reassurance: "副作用充分证明药物正在全力遏制肿瘤复发；现代支持治疗有极其完备的方案守护骨骼与生活品质。",
    keyMetric: {
      label: "地舒单抗预防 AI 所致骨折率",
      value: "-50%",
      source: "ABCSG-18 Trial (Lancet 2019)"
    },
    faq: [
      {
        question: "潮热盗汗严重影响睡眠，可以吃大豆异黄酮或蜂王浆缓解吗？",
        answer: "绝对严禁！蜂王浆、雪蛤、大豆异黄酮浓缩保健品含有外源性或植物性雌激素，会直接对抗内分泌药物的抗癌疗效，增加复发风险！"
      }
    ]
  },
  {
    id: "ovarian_suppression_ofs",
    category: "recovery",
    subcategory: "内分泌强化",
    title: "卵巢功能抑制 (OFS 停经针)：诺雷得与抑那通注射指南",
    subtitle: "绝经前 HR+ 患者的保护伞：为什么打针人工闭经能显著降低复发？",
    icon: "ShieldCheck",
    riskLevel: "moderate",
    priorityOrder: 78,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["OFS", "卵巢功能抑制", "停经针", "诺雷得", "戈舍瑞林", "抑那通", "亮丙瑞林", "绝经前", "SOFT/TEXT", "内分泌强化"],
    metaphor: "卵巢是绝经前女性制造雌激素的超级大工厂；打停经针（GnRHa）就像向工厂发出一道休眠指令，让卵巢暂时安全歇工，彻底断掉供给肿瘤的激素燃料。",
    clinicalTruth: "根据 SOFT 与 TEXT 全球里程碑研究，中高危绝经前 HR+ 乳腺癌（如淋巴结转移、肿块较大或年龄 <35 岁）在口服内分泌基础上加用卵巢功能抑制 (OFS) 满 5 年，可显著提高 8 年无病生存率，降低 24%~35% 的复发风险！",
    tactics: [
      "常用药物为醋酸戈舍瑞林（诺雷得 3.6mg，每 28 天腹部皮下注射）或亮丙瑞林（抑那通）；",
      "打针后会出现暂时性闭经、潮热与性欲减退，停药后卵巢功能通常可在数月至 1 年内恢复；",
      "定期监测血清雌二醇 (E2) 与促卵泡生成素 (FSH)，确保雌激素水平彻底达到绝经后标准 (<30 pg/mL)。"
    ],
    reassurance: "打停经针不是让你真正衰老，而是在肿瘤复发的高危窗口期给身体按下雌激素安全保护锁，疗程结束后可安全平稳解锁。",
    keyMetric: {
      label: "SOFT/TEXT 试验 OFS 降低复发率",
      value: "-35% (HR=0.65)",
      source: "NEJM 2018 / 8-Year Follow-up"
    },
    faq: [
      {
        question: "打了停经针后又来了一次少量月经，是药物失效了吗？",
        answer: "初次注射后的前 2~4 周可能出现药物引起的短期卵巢反跳刺激，属于正常现象；若注射 3 个月后仍有规律月经，需抽血查 E2 水平评估是否完全去势。"
      }
    ]
  },
  {
    id: "breast_reconstruction",
    category: "recovery",
    subcategory: "形体重建",
    title: "乳房重建选择：即刻假体 vs 自体皮瓣 (DIEP/背阔肌)",
    subtitle: "治病与美丽无需二选一：全切后重塑乳房形态的安全时机与方案",
    icon: "HeartPulse",
    riskLevel: "safe",
    priorityOrder: 45,
    visualComponent: "LymphedemaArmVisual",
    searchKeywords: ["乳房重建", "即刻重建", "延期重建", "假体隆胸", "扩张器", "自体皮瓣", "DIEP", "背阔肌皮瓣", "外形重塑", "保乳整形"],
    metaphor: "乳房重建就像在拆除危房的同一天就依照原貌建造一栋崭新温暖的房屋，既彻底清除了病灶，又让女性完整保留身体的尊严与对称的美丽曲线。",
    clinicalTruth: "大量循证医学研究证实，乳房切除术后行即刻重建（术中同步完成）绝不延误术后辅助放化疗，也不增加肿瘤复发风险，更不会影响局部复发的早期检出；自体下腹部皮瓣 (DIEP) 触感最自然且终生免更换假体。",
    tactics: [
      "若无需术后放疗：即刻假体植入（单步或组织扩张器二步法）创伤最小、恢复快；",
      "若术后需行胸壁放疗：自体皮瓣（如腹直肌皮瓣 DIEP）抗辐射耐受性更好，长期质感极优；",
      "即便已做过全切手术多年，依然可在无病生存平稳期选择延期乳房重建重拾自信。"
    ],
    reassurance: "乳腺癌治疗的目标不仅是活下来，更是带着骄傲与自信高质量地生活。乳房重建是现代肿瘤整形外科送给每位患者的温暖馈赠。",
    keyMetric: {
      label: "即刻乳房重建术后心理满意度",
      value: "92% ~ 96%",
      source: "Plastic & Reconstructive Surgery Multi-center"
    },
    faq: [
      {
        question: "假体放进去后会不会影响以后复查发现肿瘤复发？",
        answer: "绝不影响！假体通常放置在胸大肌后方深层，而复发病灶若出现通常位于皮下浅表，通过彩超和 MRI 能清晰分层鉴别，完全不影响防癌监控。"
      }
    ]
  },
  {
    id: "her2_cardiac_safety",
    category: "recovery",
    subcategory: "靶向随访",
    title: "HER2 靶向治疗心脏安全性与 LVEF 射血分数监测",
    subtitle: "打曲妥珠/帕妥珠单抗会损伤心脏吗？每3个月做心超的核心指标解读",
    icon: "Activity",
    riskLevel: "moderate",
    priorityOrder: 60,
    visualComponent: "ReceptorSubtypeVisual",
    searchKeywords: ["心脏毒性", "LVEF", "射血分数", "赫赛汀心肌毒性", "曲妥珠单抗心脏", "心电图", "心肌酶", "心脏彩超", "心脏安全性"],
    metaphor: "曲妥珠单抗对心脏就像踩刹车时偶尔让心脏引擎稍感吃力，但这种疲劳是良性且可逆的，只要松开油门（暂停用药）或保护保养，心肌马力很快就能完全恢复如初。",
    clinicalTruth: "抗 HER2 靶向药物所致心功能不全大多属于 II 型心脏毒性（非剂量蓄积性、不导致心肌细胞坏死死亡），停药或在心内科干预后 90% 以上可完全逆转恢复。指南要求治疗期间每 3 个月复查一次心脏彩超评估左室射血分数 (LVEF)。",
    tactics: [
      "在首次靶向治疗前必须完成基线心脏彩超，记录基准 LVEF（正常通常 ≥50%~55%）；",
      "靶向治疗期间每 3 个月规律复查心超：若 LVEF 下降超过 10 个绝对百分点且 <50%，需遵医嘱暂停靶向治疗 3~4 周；",
      "必要时联用心内科 ACEI / β受体阻滞剂护心药物，心功能恢复后可安全重启靶向治疗。"
    ],
    reassurance: "临床严重的不可逆心衰发生率不足 1%，只要按期做心超把关，靶向治疗的安全性极其可靠稳健。",
    keyMetric: {
      label: "曲妥珠单抗心脏毒性完全恢复率",
      value: "> 90%",
      source: "NSABP B-31 / NCCTG N9831 Long-term Cardiac Data"
    },
    faq: [
      {
        question: "复查心超显示 LVEF 从 65% 降到 58%，需要马上停药吗？",
        answer: "无需停药！虽然数值有轻度波动，但 58% 依然在正常范围（≥50%）内，且下降未达 10%，可继续按期用药，下个周期复查即可。"
      }
    ]
  },
  {
    id: "breast_tumor_markers",
    category: "recovery",
    subcategory: "标志物随访",
    title: "乳腺癌肿瘤标志物 CA15-3 与 CEA：动态波动的科学真相",
    subtitle: "化验单指标轻度偏高是复发转移了吗？解读良性生理波动与排查路径",
    icon: "AlertTriangle",
    riskLevel: "moderate",
    priorityOrder: 55,
    visualComponent: "BiRadsScaleVisual",
    searchKeywords: ["CA15-3", "CA153", "CEA", "肿瘤标志物", "指标偏高", "化验单波动", "假阳性", "复查随访", "轻度偏高"],
    metaphor: "肿瘤标志物就像海面上的浮标，海浪翻滚（如一次感冒、脂肪肝、乳腺炎或化验试剂批次差异）都能让浮标上下晃动几厘米；只有浮标持续如火箭般翻倍飙升，才需要拉响警报。",
    clinicalTruth: "CA15-3 和 CEA 在早期乳腺癌敏感性仅约 20%~30%，不能用于确诊，也不作为单项复发的唯一标准。良性肝炎、妇科良性囊肿、甚至吸烟都可导致其轻度升高。只有连续 2~3 次翻倍呈进行性上升趋势时，才提示需行全身影像学排查。",
    tactics: [
      "若指标仅轻度超出参考上限 10%~20%，切勿自己吓唬自己，保持平静 1 个月后在同一家医院复查；",
      "重视「动态趋势」而非「单次绝对值」，孤立的单次偏高大多为检验误差或生理良性波动；",
      "若确实出现持续快速上升，在医生指导下完善胸部腹部 CT、乳腺超声与全身骨扫描。"
    ],
    reassurance: "临床上 80% 以上单次化验轻度偏高的患者，在随访复查后均自行回落或保持稳定，绝大多数并非肿瘤复发。",
    keyMetric: {
      label: "标志物单次轻度偏高良性率",
      value: "> 85%",
      source: "ASCO Clinical Oncology Biomarker Guidelines"
    },
    faq: [
      {
        question: "每次去医院复查都需要把 CA15-3、CEA、CA125、CA19-9 全都抽一遍吗？",
        answer: "无须盲目全抽！乳腺专科重点关注 CA15-3 与 CEA，滥查多个无关联指标反而容易因假阳性造成极大心理恐慌与不必要的过度检查。"
      }
    ]
  },
  // ==========================================
  // 八、 乳腺癌高阶纵深专科词条 (Expansion to 30)
  // ==========================================
  {
    id: "breast_dcis_microinvasion",
    category: "nodule",
    subcategory: "原位癌与微浸润",
    title: "导管原位癌伴微浸润 (DCIS-Mi)：浸润界限与前哨淋巴结抉择",
    subtitle: "病理报告上的「≤1mm 微小浸润灶」是否意味着癌细胞已经扩散？",
    icon: "ShieldAlert",
    riskLevel: "low",
    priorityOrder: 76,
    visualComponent: "DcisBasementMembraneVisual",
    searchKeywords: ["DCIS-Mi", "微浸润", "导管原位癌", "前哨淋巴结活检", "基底膜突破", "过度治疗", "放疗指征"],
    metaphor: "微浸润就像关在坚固鸟笼里的鸟儿，仅仅把一根羽毛探出了铁丝网缝隙（≤1mm），身体绝大部分依然牢牢受困在笼内，极难发生远处转移。",
    clinicalTruth: "乳腺导管原位癌伴微浸润 (DCIS-Mi) 定义为浸润灶最大径不超过 1mm。虽然病理分期归为 T1mic，但其生物学行为和纯 DCIS 极度相似，10 年生存率超过 98%。通常建议结合前哨淋巴结活检 (SLNB) 排查，无需盲目做大范围腋窝清扫。",
    tactics: [
      "若全乳切除术，建议同步行前哨淋巴结活检；若行保乳术，可根据微浸润范围与医生审慎评估是否做 SLNB；",
      "确保手术切缘阴性（切缘距离肿瘤 ≥2mm 为安全切缘）；",
      "激素受体阳性者评估是否需要口服他莫昔芬降低对侧乳腺及同侧残存腺体复发风险。"
    ],
    reassurance: "微浸润仍处于极其早期的起跑线，根治性手术后几乎能达到彻底治愈，不要把 1mm 的微浸润等同于晚期浸润性大肿瘤。",
    keyMetric: {
      label: "DCIS-Mi 10 年乳腺癌特异生存率",
      value: "> 98.5%",
      source: "CSCO / NCCN 乳腺癌临床指南"
    },
    faq: [
      {
        question: "微浸润需要做术后化疗吗？",
        answer: "绝大多数 DCIS-Mi 患者淋巴结为阴性，属于全身复发极低危人群，国际权威指南明确指出无需接受术后静脉辅助化疗！"
      }
    ]
  },
  {
    id: "breast_cdk46_inhibitors",
    category: "genetics",
    subcategory: "内分泌联合靶向",
    title: "CDK4/6 抑制剂全景：HR+/HER2- 靶向新时代的基石",
    subtitle: "哌柏西利、阿贝西利、达尔西利：如何管理中性粒细胞减少与腹泻？",
    icon: "Zap",
    riskLevel: "moderate",
    priorityOrder: 75,
    visualComponent: "BoneMarrowGcsfVisual",
    searchKeywords: ["CDK4/6", "哌柏西利", "阿贝西利", "达尔西利", "爱博新", "中性粒细胞减少", "内分泌耐药", "高危辅助强化"],
    metaphor: "CDK4/6 抑制剂就像给癌细胞内部永不停歇的分裂齿轮扔进了一根强力卡轴，与内分泌治疗双管齐下，直接让癌细胞陷入永久休眠或凋亡。",
    clinicalTruth: "CDK4/6 抑制剂联合内分泌治疗已成为 HR+/HER2- 晚期乳腺癌一线标准治疗，阿贝西利更是获批用于高危淋巴结阳性早期患者的术后强化辅助。主要不良反应为骨髓抑制（哌柏西利/达尔西利）或腹泻与肝功能异常（阿贝西利），绝大多数可通过对症处理或减量可逆控制。",
    tactics: [
      "服用哌柏西利/达尔西利者，前两个周期必须每 2 周监测一次全血细胞计数，特别关注中性粒细胞绝对值；",
      "服用阿贝西利者，备足洛哌丁胺（易蒙停），在首次出现稀便时立即按医嘱服药，多饮水补充电解质；",
      "出现 3 级以上骨髓抑制时按医生要求暂停服药并评估是否减量，切勿自行擅自停药或盲目加量。"
    ],
    reassurance: "CDK4/6 抑制剂引起的白细胞偏低与传统化疗截然不同，它通常不造成骨髓造血干细胞凋亡，停药几天骨髓即可迅速自我恢复，发热性中性粒细胞减少 (FN) 发生率极低（<2%）。",
    keyMetric: {
      label: "CDK4/6 联合内分泌相比单用内分泌 PFS 延长",
      value: "接近翻倍 (14 ➔ 28+ 月)",
      source: "MONALEESA / PALOMA / monarchE 临床试验"
    },
    faq: [
      {
        question: "中性粒细胞降到 1.0 时需要天天打升白针吗？",
        answer: "一般无需立即打升白针，只需按医嘱停药或延迟下一周期用药，绝大多数患者停药 7 天左右即可自行回升至安全用药范围。"
      }
    ]
  },
  {
    id: "breast_olaparib_brca",
    category: "genetics",
    subcategory: "PARP抑制剂与BRCA突变",
    title: "BRCA1/2 基因突变与 PARP 抑制剂：合成致死精准爆破",
    subtitle: "从安吉丽娜·朱莉的遗传风险到奥拉帕利在三阴性与高危乳腺癌中的突破",
    icon: "Dna",
    riskLevel: "high",
    priorityOrder: 74,
    visualComponent: "EgfrMutationMapVisual",
    searchKeywords: ["BRCA1", "BRCA2", "奥拉帕利", "PARP抑制剂", "合成致死", "遗传性乳腺癌", "OlympiA", "同源重组修复缺陷", "HRD"],
    metaphor: "DNA 修复就像房屋的双保险电路——BRCA 是主断路器，PARP 是备用保险丝。普通细胞哪怕坏了一个，另一个也能保电；而带有 BRCA 突变的癌细胞一旦被 PARP 抑制剂切断备用线，就彻底短路暴毙（合成致死），正常细胞却安然无恙。",
    clinicalTruth: "携带胚系 BRCA1/2 突变 (gBRCAm) 的高危早期乳腺癌（无论三阴性或高复发风险 HR+）在完成常规化疗与手术后，加用 PARP 抑制剂奥拉帕利辅助治疗 1 年，可显著降低复发与死亡风险。此外，确诊 gBRCA 突变还为对侧乳腺及卵巢的预防性策略提供关键依据。",
    tactics: [
      "符合高危特征（三阴性、发病年龄 ≤50 岁、有卵巢癌/乳腺癌家族史）的患者建议主动行外周血胚系 BRCA 基因检测；",
      "服用奥拉帕利期间定期监测血红蛋白，警惕贫血与疲乏，适时对症纠正；",
      "完成育龄后，妇科肿瘤专科联合会诊，评估输卵管/卵巢预防性切除时机。"
    ],
    reassurance: "检出 BRCA 突变绝不代表被判死刑，它反而为你锁定了一把高度敏感的精准靶向特异武器（PARP 抑制剂），让治疗更有胜算。",
    keyMetric: {
      label: "OlympiA 研究中奥拉帕利降低 3 年侵袭性复发风险",
      value: "32%",
      source: "NEJM 2021 / OlympiA Phase III Trial"
    },
    faq: [
      {
        question: "我有 BRCA 突变，会百分之百遗传给我的子女吗？",
        answer: "BRCA 为常染色体显性遗传，遗传给下一代的概率为 50%，并非 100%；且携带基因突变并不等于必定发病，通过早期监测可完全掌控风险。"
      }
    ]
  },
  {
    id: "breast_endocrine_osteoporosis",
    category: "recovery",
    subcategory: "内分泌骨健康管理",
    title: "芳香化酶抑制剂 (AI) 骨质疏松防范：双膦酸盐与地舒单抗骨保护",
    subtitle: "来曲唑、阿那曲唑、依西美坦引起的关节酸痛与骨量流失如何从容应对？",
    icon: "Activity",
    riskLevel: "moderate",
    priorityOrder: 73,
    visualComponent: "AdjuvantDecisionTreeVisual",
    searchKeywords: ["芳香化酶抑制剂", "来曲唑", "阿那曲唑", "骨质疏松", "双膦酸盐", "唑来膦酸", "地舒单抗", "骨密度", "关节酸痛"],
    metaphor: "雌激素是女性骨骼的天然保鲜剂。芳香化酶抑制剂为了饿死癌细胞，把体内的雌激素压到了极低水平，骨骼就像干燥冬季缺水的土壤，需要额外施加抗骨吸收的「固沙剂」来加固。",
    clinicalTruth: "绝经后使用 AI 治疗的患者每年骨量丢失约为 2%~3%，明显高于自然绝经女性。权威指南推荐在起始 AI 治疗前基线检测双能 X 射线 (DXA) 骨密度。对于 T 评分 < -2.0 或高骨折风险患者，每 6 个月注射一次唑来膦酸或每 6 个月注射地舒单抗不仅能稳固骨量，大型荟萃分析更证实其能减少骨转移发生率。",
    tactics: [
      "开始内分泌前完善腰椎与髋部 DXA 骨密度检查，此后每年复查一次；",
      "常规每日补充钙剂 (1000~1200mg) 和维生素 D3 (800~1000IU)；",
      "使用双膦酸盐前建议先看口腔科，处理隐匿龋齿或拔牙创面，防范罕见下颌骨坏死 (ONJ)；",
      "坚持适度负重力量训练与快走，戒烟限酒减少咖啡因流失骨质。"
    ],
    reassurance: "骨质疏松完全可防可控，只要规范补钙、监测并在指征明确时联用骨保护剂，绝大多数患者都能平稳完成 5~10 年的内分泌旅程。",
    keyMetric: {
      label: "双膦酸盐辅助治疗降低绝经后乳腺癌骨转移发生率",
      value: "28%",
      source: "EBCTCG Early Breast Cancer Trialists' Group Meta-analysis"
    },
    faq: [
      {
        question: "吃了来曲唑后早晨起来手指关节僵硬疼痛是骨转移了吗？",
        answer: "绝非骨转移！这是典型的芳香化酶抑制剂相关的肌骨骼综合征 (AIMS)，多发生在服药后 2~6 个月，适度活动后减轻，可遵医嘱对症治疗或温和散步改善。"
      }
    ]
  },
  {
    id: "breast_radiation_skin_cardiac",
    category: "recovery",
    subcategory: "放疗防护与心脏保护",
    title: "保乳术后放疗全护理：放射性皮炎防治与左侧乳腺 DIBH 心脏屏气保护",
    subtitle: "如何保持照射野皮肤完整性？深吸气屏气技术如何让心脏远离射线照射？",
    icon: "Sun",
    riskLevel: "safe",
    priorityOrder: 72,
    visualComponent: "AblationSbrtVisual",
    searchKeywords: ["保乳放疗", "放射性皮炎", "DIBH", "深吸气屏气", "左乳放疗", "心脏毒性", "三乙醇胺", "放疗定位线"],
    metaphor: "深吸气屏气 (DIBH) 就像肺部充气把心脏往后方和下方推开，在乳腺靶区和心脏之间垫起了一层厚厚的空气软垫，让直线加速器的射线精准扫射乳房，却完全擦不到心脏。",
    clinicalTruth: "保乳手术后行辅助全乳放疗可将同侧乳房局部复发率降低一半以上。针对左侧乳腺癌患者，现代放疗采用 DIBH 技术可使心脏平均受照剂量降低 50%~70%，大幅削减远期缺血性心脏病风险。放疗期间合理使用医用放射防护喷剂/软膏，可极大减轻皮肤红斑与湿性脱皮反应。",
    tactics: [
      "放疗区域皮肤切勿用热水烫洗、禁用肥皂等碱性清洁剂，穿纯棉宽松内衣；",
      "放疗期间及照射野内严禁自行涂抹含重金属的药膏，可在技师指导下使用三乙醇胺等专用乳膏，但照射前 2 小时需擦净；",
      "保护好身体上的放疗定位十字标记线，若有模糊切勿自行用笔描画，由放疗技师核对补画；",
      "左乳患者积极配合技师进行呼吸训练，熟练掌握 20 秒以上的平稳深吸气屏气动作。"
    ],
    reassurance: "现代调强放疗 (IMRT) 剂量分布极精准，绝大部分患者仅经历轻微如晒斑的红斑反应，放疗结束后 2~4 周内皮肤大多可完全修复光洁。",
    keyMetric: {
      label: "DIBH 技术减少左心室受照射平均剂量幅度",
      value: "50% - 65%",
      source: "JCO Clinical Oncology / ASTRO 放疗指南"
    },
    faq: [
      {
        question: "放疗会导致全身脱发吗？",
        answer: "不会！乳腺放疗是局部定向物理治疗，射线仅作用于胸壁与锁骨上区域，绝不影响头部毛囊，不会引起全头脱发。"
      }
    ]
  },
  {
    id: "breast_her2_low_enhertu",
    category: "pathology",
    subcategory: "HER2 低表达新蓝海",
    title: "HER2 低表达 (HER2-Low) 革命：重新定义乳腺癌分类",
    subtitle: "IHC 1+ 或 IHC 2+/FISH 阴性不再等于「HER2 阴性」，ADC 新星德曲妥珠单抗 (T-DXd) 带来全新生机",
    icon: "Crosshair",
    riskLevel: "moderate",
    priorityOrder: 71,
    visualComponent: "Her2AdcVisual",
    searchKeywords: ["HER2-Low", "HER2低表达", "优赫得", "T-DXd", "德曲妥珠单抗", "DESTINY-Breast04", "ADC", "抗体偶联药物"],
    metaphor: "过去我们将癌细胞非黑即白分为 HER2 阳性（锁极多）或阴性（几乎没锁）。现在有了精准生物导弹（ADC），哪怕癌细胞门上只有稀疏零星的几把小锁（HER2 低表达），导弹也能精准定位并实施「旁观者效应」彻底清除周边肿瘤。",
    clinicalTruth: "全球近 50%~60% 的乳腺癌患者属于 HER2 低表达（免疫组化 IHC 1+ 或 IHC 2+ 且 FISH 阴性）。DESTINY-Breast04 重磅试验证实，针对这部分患者使用德曲妥珠单抗 (T-DXd) 相比传统化疗，无进展生存期与总生存期均获得里程碑式的双重飞跃。",
    tactics: [
      "晚期耐药复发患者务必重新调取最近活检的病理切片，明确 IHC 是否为 1+ 或 2+；",
      "应用 T-DXd 期间高度警惕间质性肺病 (ILD)/药物性肺炎，定期复查胸部薄层 CT；",
      "若出现干咳、呼吸急促或低热，立即停药并联系主管医生行激素排查干预。"
    ],
    reassurance: "曾经被归为常规化疗后无计可施的慢病患者，现在有了直达病灶的新型生物导弹，治疗选项比以往任何时代都要更加宽广丰富。",
    keyMetric: {
      label: "DESTINY-Breast04 研究 T-DXd 降低死亡风险",
      value: "36%",
      source: "NEJM 2022 / ASCO Plenary Session"
    },
    faq: [
      {
        question: "为什么我多年前的病理报告上写的是「HER2 阴性」？",
        answer: "过去只要未达到 IHC 3+ 或 FISH 阳性，病理统一笼统盖戳为「阴性」；请医生重新复核 IHC 原图是 0 还是 1+/2+，绝大部分既往阴性患者其实符合如今的 HER2-Low 标准！"
      }
    ]
  },
  {
    id: "breast_fertility_preservation",
    category: "recovery",
    subcategory: "育龄期生育与卵巢保护",
    title: "年轻乳腺癌患者生育保护：GnRHa 卵巢抑制与安全妊娠时机",
    subtitle: "患癌后还能做妈妈吗？化疗前卵巢功能保护与治愈停药后的科学备孕",
    icon: "Heart",
    riskLevel: "safe",
    priorityOrder: 70,
    visualComponent: "FollowupTimelineVisual",
    searchKeywords: ["生育保护", "卵巢保护", "戈舍瑞林", "GnRHa", "化疗卵巢早衰", "POSITIVE研究", "备孕时机", "年轻乳腺癌"],
    metaphor: "GnRHa 就像在化疗风暴来临前，给娇嫩的卵巢按下了「冬眠暂停键」，让卵泡停止代谢分裂，从而对化疗毒性药物产生绝缘防护，等风暴平息后再唤醒它。",
    clinicalTruth: "化疗前 1~2 周开始注射 GnRHa（如戈舍瑞林/亮丙瑞林）并在化疗期间持续使用，可显著降低化疗导致的早期绝经风险，提升化疗后月经恢复率。重磅 POSITIVE 临床试验证实，内分泌受体阳性患者在规范服药 18~30 个月后，暂时中断内分泌治疗进行备孕生育，短期内不会增加肿瘤复发风险。",
    tactics: [
      "确诊后有生育意愿的年轻患者（≤40 岁），应在化疗启动前第一时间与生殖医学科和肿瘤科医生共同制定方案；",
      "在化疗开始前至少 1~2 周注射第一针 GnRHa，直至化疗结束；",
      "有条件者可选择化疗前行快速促排卵冷冻胚胎或成熟卵子；",
      "暂停内分泌治疗备孕需严格符合医学标准，完成生育与哺乳后应尽快恢复剩余疗程的内分泌治疗。"
    ],
    reassurance: "罹患乳腺癌并不等于被剥夺做母亲的权利。随着现代保护技术和临床证据的积累，越来越多的年轻患者在康复后成功拥抱健康的新生命。",
    keyMetric: {
      label: "GnRHa 卵巢保护患者化疗后卵巢功能恢复率",
      value: "超 70%",
      source: "PROMISE-GIM6 / POSITIVE Clinical Trial (NEJM 2023)"
    },
    faq: [
      {
        question: "怀孕时体内雌激素飙升会不会刺激乳腺癌复发？",
        answer: "多项全球大型临床前瞻性对照研究（包括 POSITIVE 研究）证实，严格评估后的缓解期妊娠并不会显著增加乳腺癌复发转移的风险。"
      }
    ]
  },
  {
    id: "breast_postop_seroma_drainage",
    category: "recovery",
    subcategory: "围术期外科并发症",
    title: "乳腺与腋窝术后皮下积液 (Seroma)：引流管护理与患侧制动平衡",
    subtitle: "拔管后胸壁鼓起波动水囊怎么办？穿刺抽液与加压包扎实操要领",
    icon: "ShieldAlert",
    riskLevel: "low",
    priorityOrder: 69,
    visualComponent: "LymphedemaArmVisual",
    searchKeywords: ["皮下积液", "Seroma", "引流管护理", "引流量", "拔管指征", "穿刺抽液", "加压包扎", "术后活动"],
    metaphor: "手术剥离后在皮肤与胸壁深层组织之间留出了一个潜在空腔，身体毛细血管与淋巴管渗出的淡黄色渗液容易在此处蓄积，就像平整土地后雨水汇聚成的浅水洼。",
    clinicalTruth: "皮下积液是乳腺癌手术（尤其是全乳切除伴腋窝清扫）最常见的早期并发症，发生率约为 15%~30%。拔除引流管的常规标准为 24 小时引流量少于 15~20ml。拔管后若出现局部囊性感隆起，属于正常组织吸收过渡期，量大时门诊无菌穿刺抽液并局部加压包扎即可治愈，极少继发感染。",
    tactics: [
      "带引流管期间每日记录引流量与颜色，保持引流管负压球处于有效扁瘪吸附状态；",
      "拔管前患侧上肢避免过早外展大于 90 度或用力提重物，防止创面反复滑动剪切导致渗液激增；",
      "拔管后如发现患侧胸壁或腋下有波动感包块，切勿用力搓揉或自行拿针挑破，回医院门诊由医生无菌抽吸；",
      "抽液后遵医嘱配合自粘弹力绷带适当加压包扎 48~72 小时促进创面粘连愈合。"
    ],
    reassurance: "皮下积液是纯粹的无菌性创面渗出反应，绝非肿瘤残留复发；只要保持无菌与适度加压，身体组织会在数周内完全闭合愈合。",
    keyMetric: {
      label: "规范抽吸加压后皮下积液愈合率",
      value: "> 95%",
      source: "Surgical Oncology Clinics Practice Guidelines"
    },
    faq: [
      {
        question: "门诊穿刺抽皮下积液会很痛吗？需要打麻药吗？",
        answer: "手术区域常伴有局部感觉神经迟钝，且抽液使用极细的无菌注射针头，进针痛感极其轻微，一般无须额外注射局麻药物。"
      }
    ]
  }
];

export const BREAST_WIKI_CATEGORIES: Record<WikiCategory, { label: string; icon: string; desc: string; color: string; badgeBg: string }> = {
  nodule: {
    label: "乳腺影像筛查与评级",
    icon: "breast",
    desc: "针对 BI-RADS 3/4类、致密型腺体、钼靶微钙化与 DCIS 零期病变，提供科学评估与穿刺指引",
    color: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  pathology: {
    label: "浸润病理与分级破译",
    icon: "microscope",
    desc: "破译 Nottingham 分级、切缘标准、前哨活检(SLNB)、新辅助 pCR 与 Ki-67 增殖指数密码",
    color: "text-blue-700",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
  },
  genetics: {
    label: "受体分型与精准用药",
    icon: "dna",
    desc: "解码 ER/PR、HER2/ADC 生物导弹、三阴性免疫突破、21基因复发评分与 BRCA 遗传突变靶向",
    color: "text-purple-700",
    badgeBg: "bg-purple-50 border-purple-200 text-purple-700",
  },
  recovery: {
    label: "术后身心康复与随访",
    icon: "recovery",
    desc: "患肢水肿防范与臂围测量、爬墙操、停经针(OFS)、假体重建、心脏安全及标志物波动解惑",
    color: "text-amber-700",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
};
