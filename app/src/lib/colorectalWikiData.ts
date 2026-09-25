import type { WikiTopic, WikiCategory } from "./wikiData";

export const COLORECTAL_WIKI_TOPICS: WikiTopic[] = [
  // ==========================================
  // 一、 肠镜早筛与直肠解剖保肛 (Screening & Anatomy)
  // ==========================================
  {
    id: "colonoscopy_polyps",
    category: "nodule",
    subcategory: "早筛防线",
    title: "肠镜检查与息肉腺瘤阻断白话",
    subtitle: "从炎性息肉、管状腺瘤到高级别上皮内瘤变：把肠癌扼杀在摇篮中",
    icon: "Scan",
    riskLevel: "safe",
    priorityOrder: 95,
    visualComponent: "RectalAnatomyRulerVisual",
    searchKeywords: ["肠镜", "结肠息肉", "管状腺瘤", "绒毛状腺瘤", "锯齿状息肉", "ESD", "EMR", "早筛", "大便隐血", "肠镜复查"],
    metaphor: "结直肠息肉就像胃肠道草坪上长出的几株杂草——良性的炎性息肉是普通杂草，而腺瘤性息肉则是可能结出有毒果实的带刺藤蔓；在它恶变为癌之前，肠镜下夹除或微创切除即可实现100%连根拔起。",
    clinicalTruth: "超过 85%~90% 的结直肠癌遵循「正常黏膜 ➔ 腺瘤 ➔ 高级别上皮内瘤变 ➔ 浸润性癌」的演变链条，这一过程通常漫长达 5~10 年。只要定期做一次全结肠镜并在内镜下行 EMR 或 ESD 完整切除腺瘤，即可阻断绝大部分肠癌发生！",
    tactics: [
      "40 岁以上人群即便没有任何症状，建议主动完成人生的第一次全结肠镜筛查；",
      "若切除的息肉病理提示为「低级别上皮内瘤变/管状腺瘤」，切缘干净后遵医嘱 1~3 年内复查肠镜；",
      "若提示为「高级别上皮内瘤变」或「黏膜内原位癌 (Tis)」，只要水平与垂直切缘均为阴性，内镜切除即为根治性治疗，无须盲目开腹大切肠段。"
    ],
    reassurance: "只要在息肉和腺瘤阶段被肠镜发现并切除，你就已经成功战胜了一场潜在的恶性肿瘤；遵医嘱按时复查肠镜，即可终身远离结直肠癌威胁。",
    keyMetric: {
      label: "规律肠镜筛查肠癌发病率降低",
      value: "56% - 68%",
      source: "NEJM 2022 / NCCN CRC Screening Guidelines"
    },
    faq: [
      {
        question: "做无痛肠镜会不会伤脑子或者有危险？",
        answer: "无痛肠镜使用的丙泊酚静脉镇静起效快、代谢极迅速，药物在数十分钟内由肝脏代谢完毕，不留体内后遗效应，安全性非常高。"
      },
      {
        question: "肠镜切除息肉后还会再长吗？",
        answer: "切除的病灶本身不会复发，但由于肠道微环境或饮食习惯，其他肠黏膜部位未来可能长出新息肉，因此规律肠镜随访必不可少。"
      }
    ]
  },
  {
    id: "rectal_anatomy_margins",
    category: "nodule",
    subcategory: "直肠解剖与保肛",
    title: "直肠三段分水岭与距肛门距离 (cm) 保肛密码",
    subtitle: "低位 (<5cm)、中段 (5-10cm) 与上段 (10-15cm)：为什么差 1 厘米保肛难度天壤之别？",
    icon: "Compass",
    riskLevel: "high",
    priorityOrder: 96,
    visualComponent: "RectalAnatomyRulerVisual",
    searchKeywords: ["直肠癌保肛", "距肛门距离", "齿状线", "内括约肌", "外括约肌", "ISR手术", "超低位保肛", "Miles手术", "腹膜返折"],
    metaphor: "直肠就像一条穿行在骨盆繁华闹市中的精密地下管道——上段直肠在开阔平原（腹膜返折以上），两端留有充足安全余量，保肛轻而易举；而低位直肠（距肛门不到5厘米）深陷在骨盆最底层，紧贴着人体至关重要的「控便总阀门（内外括约肌）」，差 1 厘米都决定了能不能保住正常排便。",
    clinicalTruth: "解剖学以腹膜返折为分水岭：上段直肠 (10~15cm) 有浆膜覆盖，生物学类似结肠，几乎 100% 顺利保肛且通常无需新辅助放疗；中下段直肠位于返折以下，无浆膜层，被直肠系膜与骨盆筋膜包裹，局部复发率高。现代经括约肌间切除术 (ISR)、超低位 LAR 结合术前新辅助 TNT 降期，已将距肛缘仅 3~5cm 的低位直肠癌保肛成功率提高至 70% 以上！",
    tactics: [
      "精确测量解剖距离：必须以薄层 HR-MRI 测量的「肿瘤下缘距肛缘 (Anal Verge)」及「距齿状线 (Dentate Line)」净距离为准；",
      "评估内外括约肌受侵情况：若肿瘤仅侵犯内括约肌而外括约肌正常，可通过 ISR 手术切除内括约肌保住肛门；",
      "若已侵犯外括约肌或肛提肌，切勿盲目为了保肛而舍弃根治切缘，应遵循肿瘤学根治第一原则行 Miles 手术或优先行 TNT 强力降期。"
    ],
    reassurance: "保肛技术日新月异，超低位并非绝症禁区；即使极低位确实无法保肛接受永久造口，现代造口密闭无味，工作、运动与社交同样自在从容。",
    keyMetric: {
      label: "低位直肠癌新辅助降期后保肛成功率",
      value: "72.5%",
      source: "CSCO 结直肠癌指南 2024 / 国内大肠外科专科队列"
    },
    faq: [
      {
        question: "距肛门 4cm 的低位直肠癌，是不是必须切除肛门挂粪袋？",
        answer: "绝对不一定！现代直肠癌倡导先做全程新辅助 (TNT) 放化疗使肿瘤明显萎缩退缩，只要肿瘤退缩后与外括约肌能保留足够的安全远端切缘 (DRM ≥ 1cm)，多数患者能成功实施保肛手术，甚至部分达到 cCR 者可完全免除开刀！"
      }
    ]
  },

  // ==========================================
  // 二、 浸润病理、核磁切缘与质控红线 (Pathology & Staging)
  // ==========================================
  {
    id: "tnm_depth_invasion",
    category: "pathology",
    subcategory: "浸润深度",
    title: "T 分期肠壁浸润密码破译",
    subtitle: "T1 到 T4 浸润深度全景：肠壁如同四层防护墙，突破哪一层最危险？",
    icon: "Layers",
    riskLevel: "moderate",
    priorityOrder: 92,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["T分期", "T1", "T2", "T3", "T4a", "T4b", "浸润深度", "黏膜下层", "固有肌层", "浆膜层", "肠穿透"],
    metaphor: "正常的肠壁就像一座四层城墙：第一层是内表面黏膜层，第二层是黏膜下层 (T1)，第三层是坚固的固有肌层 (T2)，第四层是外表面的浆膜下与腹膜外衣 (T3/T4)。只要城墙还没被彻底穿透，肿瘤就依然被牢牢围困在管道局部。",
    clinicalTruth: "T1 期仅侵犯黏膜下层，淋巴结转移率不足 10%；T2 浸润固有肌层；T3 穿透肌层至浆膜下脂肪，属于最常见的术后病理分期；T4a 穿透脏层腹膜，T4b 侵入邻近膀胱、子宫或腹壁等器官。T4 属于重大高危病理指标，术后强烈建议强化辅助化疗以防腹腔种植。",
    tactics: [
      "若术后病理为 T1/T2N0，属于 I 期极早期，根治性手术后完全不需要辅助化疗；",
      "若病理提示为 T4（穿透腹膜或侵及临近结构），请由肿瘤内科团队评估强化双药辅助化疗方案；",
      "手术必须由结直肠专科医生遵循 CME (完整结肠系膜切除) 或 TME 规范执行，确保根治切缘彻底阴性。"
    ],
    reassurance: "即便病理报了 T3，只要淋巴结为 0 枚转移 (IIA期)，完整手术切除后的 5 年总生存率依然超过 80%~85%，无需过度恐惧。",
    keyMetric: {
      label: "T1-2 N0 I期 5年根治生存率",
      value: "95%+",
      source: "AJCC Cancer Staging Manual 8th Edition"
    },
    faq: [
      {
        question: "CT 报告上写的「肠壁增厚」就是肠癌晚期吗？",
        answer: "绝对不是！肠道炎症、水肿、痉挛甚至肠镜检查前的肠道蠕动均可导致 CT 上表现为肠壁增厚，最终确诊必须以肠镜下的病理活检金标准为准。"
      }
    ]
  },
  {
    id: "rectal_mri_crm_emvi",
    category: "pathology",
    subcategory: "核磁切缘",
    title: "直肠核磁 HR-MRI：环周切缘 (CRM) 与脉管侵犯 (EMVI)",
    subtitle: "为什么直肠癌必须做高分辨率核磁？CRM ≤ 1mm 阳性与 mrEMVI 的致命预警",
    icon: "Eye",
    riskLevel: "high",
    priorityOrder: 97,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["环周切缘", "CRM", "MRF", "系膜筋膜", "EMVI", "脉管浸润", "直肠核磁", "MERCURY", "TME平面", "局部复发"],
    metaphor: "直肠系膜就像裹在直肠管道外围的一层防弹夹克，夹克最外层的皮就是直肠系膜筋膜 (MRF)。如果肿瘤长在夹克棉花内部，距离外皮还有厚厚间隙 (CRM > 1mm)，外科医生就能整件完整脱下夹克 (TME切除)；如果肿瘤已经快要刺穿外皮 (CRM ≤ 1mm)，直接开刀就会撕破防弹衣导致癌细胞散落满骨盆，必须先放疗把刺烧缩回去！",
    clinicalTruth: "骨盆薄层高分辨率 MRI (HR-MRI) 是评估中低位直肠癌的国际金标准（MERCURY 标准）。CRM (环周切缘) 净距离 ≤ 1.0mm 严格定义为阳性/受累，直接手术局部复发率高达 30% 以上；mrEMVI (壁外静脉侵犯) 阳性提示癌栓穿破静脉管壁，远处肝肺转移风险激增 3~4 倍。这两项是判定是否必须行术前放化疗/TNT 的绝对核心依据。",
    tactics: [
      "确诊中低位直肠癌后，首要任务是在有专科经验的中心完成骨盆高分辨率薄层核磁 (HR-MRI)，绝不可用普通腹部 CT 代替；",
      "若 MRI 提示 CRM ≤ 1.0mm 或 MRF 受累，强烈建议推迟直接手术，由多学科 MDT 安排术前 TNT 或长程放化疗降期；",
      "伴有 mrEMVI 阳性患者，全身化疗周期必须足量，定期复查胸腹部增强 CT 监测肝肺微转移。"
    ],
    reassurance: "CRM 阳性并不等于无法手术；现代 TNT 方案能使 70% 以上受累的系膜筋膜成功退缩降期转为安全阴性，重新赢得干净彻底的根治切除机会。",
    keyMetric: {
      label: "CRM 阴性规范 TME 术后 5 年局部复发率",
      value: "< 4.8%",
      source: "MERCURY 国际多中心核磁队列 / Lancet Oncol"
    },
    faq: [
      {
        question: "为什么结肠癌不需要测 CRM，而直肠癌必须测 CRM？",
        answer: "结肠表面有光滑的浆膜层包被，且腹腔内活动度大；而中低位直肠深居狭窄骨盆内，四周没有浆膜，只有薄薄一层直肠系膜筋膜包裹。如果肿瘤向周围横向浸润突破系膜筋膜，就会残留于骨盆侧壁导致顽固局部复发，因此直肠癌必须严密测量 CRM。"
      }
    ]
  },
  {
    id: "lymph_nodes_td",
    category: "pathology",
    subcategory: "淋巴结与沉积",
    title: "淋巴结清扫 (≥12枚) 与肿瘤沉积 (TD)",
    subtitle: "病理报告上的「淋巴结检出总数」为何必须达到 12 枚？肿瘤沉积又是怎么回事？",
    icon: "ShieldAlert",
    riskLevel: "high",
    priorityOrder: 90,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["淋巴结清扫", "12枚淋巴结", "肿瘤沉积", "TD", "N1c", "淋巴结转移", "质控红线", "系膜癌结节"],
    metaphor: "清扫淋巴结就像排雷工兵清理战场雷区——排查的雷点越多（检出 ≥12 枚），遗漏暗雷的概率就越趋近于零；而「肿瘤沉积 (TD)」就像散落在肠周泥土里的散落火药粒，虽然没结成地雷包，但也必须用全身体化疗彻底清洗阻断。",
    clinicalTruth: "国际各大指南（CSCO、NCCN、AJCC）一致将「送检淋巴结总数 ≥ 12 枚」列为结直肠外科手术与病理检查的质控红线。若检出少于 12 枚，分期可能存在低估风险；若没有淋巴结转移但存在肿瘤沉积，AJCC 8th 标准特异归入 N1c 分期，需按 III 期强化辅助化疗。",
    tactics: [
      "若术后病理淋巴结清扫不足 12 枚，即便是 II 期也属于高危 II 期，建议与医生探讨是否行辅助化疗；",
      "若报告出现「肿瘤沉积 (TD)」，请将其视作需要药物防护的明确信号，规范完成术后辅助化疗；",
      "术后定期复查盆腹增强 CT 及 CEA，监测淋巴引流区动态。"
    ],
    reassurance: "即便是 N1 期（1~3枚淋巴结阳性），在现代 CAPOX 辅助化疗保驾护航下，治愈率依然可达 80% 以上，绝非不可战胜！",
    keyMetric: {
      label: "淋巴结检出>=12枚分期准确度提升",
      value: "96.4%",
      source: "Annals of Surgery Multi-center Pathology Quality Cohort"
    },
    faq: [
      {
        question: "淋巴结转移枚数越多，是不是代表全身都扩散了？",
        answer: "淋巴结属于区域第一道滤过防御站，区域淋巴结转移仍然属于局部病变范畴（III期），只要腹部和肺部没有远处实质转移，依然属于治愈性根治手术的窗口期。"
      }
    ]
  },

  // ==========================================
  // 三、 分子驱动基因与精准靶向免疫 (Genetics & Targets)
  // ==========================================
  {
    id: "rectal_dmmr_pembrolizumab",
    category: "genetics",
    subcategory: "直肠免疫奇迹",
    title: "dMMR 局部晚期直肠癌新辅助免疫免手术神话",
    subtitle: "从 MSKCC 100% 完全缓解到中国指南：单抗免疫如何颠覆传统放化疗手术？",
    icon: "Award",
    riskLevel: "safe",
    priorityOrder: 99,
    visualComponent: "RectalTntWatchWaitVisual",
    searchKeywords: ["dMMR直肠癌", "MSKCC", "Dostarlimab", "帕博利珠单抗", "免手术", "去化疗", "100%缓解", "PD-1", "直肠癌免疫新辅助"],
    metaphor: "传统放化疗和手术就像大刀阔斧的拆迁队，虽然能铲除肿瘤，但不可避免地破坏周边房屋（损伤控便括约肌和神经）；而对于 dMMR 直肠癌，免疫单抗就像是精准唤醒了患者自身的特工巡警，兵不血刃把癌细胞吃得一干二净，连手术刀都不用动，完完整整保留所有器官！",
    clinicalTruth: "纪念斯隆凯特琳癌症中心 (MSKCC) 在《新英格兰医学杂志》(NEJM) 发表里程碑突破：局部晚期 dMMR/MSI-H 直肠癌患者接受 PD-1 免疫单抗单药新辅助治疗后，100% 实现临床完全缓解 (cCR)，无一例患者需要放疗或外科手术切除，中位随访数年无复发！《CSCO 结直肠癌指南 2024》已将局部晚期 dMMR 直肠癌新辅助免疫治疗列为重大推荐。",
    tactics: [
      "所有新确诊直肠癌患者，必须第一时间做免疫组化检测 MMR 蛋白 (MLH1/MSH2/MSH6/PMS2)；",
      "若证实为 dMMR (MSI-H)，强烈推荐前往大型肿瘤医院结直肠专科 MDT，评估先行 PD-1 免疫单抗新辅助治疗；",
      "治疗期间每 2~3 个月密切复查肠镜与核磁，达到 cCR 后遵医嘱进入 Watch & Wait 密切观察，争取彻底豁免切肠与造口。"
    ],
    reassurance: "查出 dMMR 属于直肠癌中最幸运的分子类型，拥有目前全人类实体瘤中最高的免疫治愈应答率，是免除手术保留肛门的黄金钥匙。",
    keyMetric: {
      label: "MSKCC 前瞻队列 dMMR 局部晚期直肠癌 cCR 率",
      value: "100%",
      source: "NEJM 2022 / NEJM 2024 (MSKCC Cercek et al.)"
    },
    faq: [
      {
        question: "如果免疫治疗让直肠癌完全消退了，真的可以一刀不开吗？",
        answer: "在专业结直肠专科中心严密随访下，完全可以！只要内镜下黏膜光滑仅有白斑疤痕、直肠指诊柔软光滑、核磁 DWI 信号完全阴性，即可实施「观察等待」策略，免除开腹手术和造口。"
      }
    ]
  },
  {
    id: "msi_dmmr_revolution",
    category: "genetics",
    subcategory: "免疫里程碑",
    title: "微卫星不稳定 (dMMR / MSI-H) 免疫突破",
    subtitle: "为什么说测出 dMMR 就像中了大奖？II 期免化疗与晚期免疫神话白话",
    icon: "Dna",
    riskLevel: "safe",
    priorityOrder: 98,
    visualComponent: "RectalTntWatchWaitVisual",
    searchKeywords: ["MSI-H", "dMMR", "pMMR", "MSS", "微卫星不稳定", "错配修复", "免疫治疗", "PD-1", "帕博利珠单抗", "免化疗", "Lynch综合征"],
    metaphor: "dMMR 肿瘤细胞的 DNA 修复拼字工罢工了，导致癌细胞表面密密麻麻全是拼写错误的蛋白质标记；这等于给体内的免疫士兵（T细胞）树立了极其醒目的荧光靶心，一针免疫单抗即可唤醒全军将其剿灭。",
    clinicalTruth: "约 15% 结直肠癌伴有 dMMR / MSI-H。临床核心价值有二：① II 期 dMMR 患者天然预后优越，对单药 5-FU 化疗耐药，各大指南推荐免除辅助化疗；② 晚期 dMMR 患者使用 PD-1 免疫单抗（如帕博利珠单抗）有效率极高，中位无进展生存翻倍 (KEYNOTE-177)，甚至可实现去化疗持久缓解。",
    tactics: [
      "所有结直肠癌确诊患者，无论分期早晚，必须行 IHC (MLH1/MSH2/MSH6/PMS2) 或 PCR 筛查 MSI 状态；",
      "若为 II 期 dMMR 结肠癌，请勿盲目接受口服氟尿嘧啶单药化疗，避免无益伤害；",
      "家族中有多个肠癌或子宫内膜癌患者时，检测 dMMR 可同时排查林奇综合征 (Lynch Syndrome) 遗传倾向。"
    ],
    reassurance: "查出 dMMR/MSI-H 是现代肿瘤免疫学给肠癌患者最珍贵的礼物，拥有极多无化疗、低毒性的长效治疗利器。",
    keyMetric: {
      label: "KEYNOTE-177 免疫一线中位 PFS",
      value: "16.5 个月",
      source: "NEJM 2020 (KEYNOTE-177 RCT)"
    },
    faq: [
      {
        question: "IHC 报告上的 MLH1、MSH2、MSH6、PMS2 四个指标怎么看？",
        answer: "这 4 个蛋白全部阳性表达 (+) 即为正常的 pMMR (微卫星稳定 MSS)；若其中任何一个或两个表达缺失 (-)，即为 dMMR (微卫星高度不稳定 MSI-H)。"
      }
    ]
  },
  {
    id: "ras_braf_genetics",
    category: "genetics",
    subcategory: "分子靶向",
    title: "RAS / BRAF 基因突变与西妥昔单抗指征",
    subtitle: "KRAS、NRAS 与 BRAF：为什么用靶向药（爱必妥）前必须先测基因？",
    icon: "Pill",
    riskLevel: "moderate",
    priorityOrder: 88,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["KRAS", "NRAS", "BRAF", "V600E", "西妥昔单抗", "爱必妥", "靶向治疗", "MAPK通路", "G12D", "野生型"],
    metaphor: "抗 EGFR 靶向药（西妥昔单抗）就像一把精准卡住肿瘤细胞生长总电闸的锁；如果下游的线路核心元件（KRAS/NRAS）自身已经突变短路自行常开，无论你怎么在总闸上锁也无济于事。",
    clinicalTruth: "全 RAS (KRAS/NRAS 外显子 2/3/4) 及 BRAF 野生型患者接受抗 EGFR 单抗才能获益；突变型患者使用西妥昔单抗不仅无效，反增加皮疹与腹泻毒性。若检测出罕见难治的 BRAF V600E 突变，现已有恩考芬尼联合西妥昔单抗的双靶突破方案 (BEACON CRC)。",
    tactics: [
      "考虑靶向治疗前，必须完成二代测序 (NGS) 全 RAS 及 BRAF 检测，绝不可盲目试用西妥昔单抗；",
      "若 RAS 存在突变，一线靶向药应首选抗血管生成的贝伐珠单抗联合化疗；",
      "若为全野生型且位于左半结肠/直肠，西妥昔单抗能带来快速肿瘤退缩，为潜在肝转移争取切除机会。"
    ],
    reassurance: "即使检测出 RAS 突变，贝伐珠单抗、呋喹替尼等多种抗血管靶向药依旧提供强大疗效，靶向治疗选择丰富多样。",
    keyMetric: {
      label: "全 RAS 野生型左半抗 EGFR 获益率",
      value: "68%+",
      source: "FIRE-3 & CALGB 80405 Trials"
    },
    faq: [
      {
        question: "用西妥昔单抗身上长满粉刺样皮疹，是药物过敏必须停药吗？",
        answer: "绝对不是！痤疮样皮疹是抗 EGFR 药物阻断皮肤上皮细胞的经典靶向效应，大量临床证据显示皮疹反应越显著，往往预示着体内抗肿瘤抗癌疗效越好！"
      }
    ]
  },
  {
    id: "sidedness_targets",
    category: "genetics",
    subcategory: "原发部位",
    title: "左右半结肠癌的「双面性格」与用药分水岭",
    subtitle: "盲肠升结肠 (右半) vs 降结肠直肠 (左半)：胚胎发育与靶向天壤之别",
    icon: "Compass",
    riskLevel: "moderate",
    priorityOrder: 85,
    visualComponent: "RectalAnatomyRulerVisual",
    searchKeywords: ["左半结肠", "右半结肠", "Sidedness", "盲肠癌", "升结肠癌", "直肠癌", "乙状结肠癌", "原发部位", "靶向差异"],
    metaphor: "左半结肠（含直肠）和右半结肠就像性格迥异的双胞胎——右半结肠起源于胚胎中肠，像个神经大条的硬汉，更易发生隐匿贫血与基因突变；左半结肠与直肠起源于后肠，性格敏感细腻，更容易出现便血与梗阻信号，对 EGFR 靶向药极度敏感。",
    clinicalTruth: "国际前瞻临床大样本 (CALGB/SWOG 80405) 证实：以结肠脾曲为界，左半结直肠癌 (降结肠/乙状结肠/直肠) 靶向一线首选抗 EGFR 单抗西妥昔单抗；右半结肠癌 (盲肠/升结肠/横结肠) 生物学恶性度较高、MSI-H 及 BRAF 突变比例高，一线靶向无论基因如何均首选抗 VEGF 单抗贝伐珠单抗。",
    tactics: [
      "看清出院小结中的原发部位：升结肠/回盲部为右半，乙状结肠/直肠为左半；",
      "左半且 RAS/BRAF 野生型患者，积极配合西妥昔单抗治疗争取最佳缩瘤转化；",
      "右半结肠癌无论突变与否，首选联合贝伐珠单抗治疗并常规检测 MSI-H。"
    ],
    reassurance: "部位决定初始用药路径，精准顺应肿瘤的生物学脾气用药，能最大限度发挥每一支药物的抗癌威力。",
    keyMetric: {
      label: "左半 RAS 野生型西妥昔中位 OS",
      value: "36.0 个月",
      source: "JAMA 2017 (CALGB/SWOG 80405)"
    },
    faq: [
      {
        question: "直肠癌在左右半分类中属于哪一边？",
        answer: "直肠起源于胚胎后肠，在肿瘤生物学上与降结肠、乙状结肠完全一致，属于典型的「左半结直肠系统」，RAS/BRAF 野生型时对抗 EGFR 单抗敏感度极高。"
      }
    ]
  },

  // ==========================================
  // 四、 术后康复、新辅助与器官保留 (Recovery & Rehabilitation)
  // ==========================================
  {
    id: "rectal_tnt_watch_wait",
    category: "recovery",
    subcategory: "TNT与器官保留",
    title: "直肠癌全程新辅助 (TNT) 与 Watch & Wait 器官保留",
    subtitle: "RAPIDO 与 PRODIGE 23 模式：肿瘤完全消失 (cCR) 后能否免开刀保留肛门？",
    icon: "HeartPulse",
    riskLevel: "safe",
    priorityOrder: 97,
    visualComponent: "RectalTntWatchWaitVisual",
    searchKeywords: ["直肠癌保肛", "TNT", "全程新辅助", "RAPIDO", "PRODIGE23", "Watch and Wait", "观察等待", "cCR", "pCR", "器官保留"],
    metaphor: "传统治疗是「先切再擦洗」，往往患者术后体虚难以吃下化疗；现代 TNT 模式是「先调集海陆空全军把原发病灶与全身暗哨彻底扫灭」，结果许多患者打完放化疗后，复查发现原发肿瘤已经完全化解吸收，推开了「观察等待、免除开刀」的器官保留大门。",
    clinicalTruth: "全程新辅助治疗 (TNT) 将全身双药/三药强化化疗全部前移至放疗前后，使中低位直肠癌病理完全缓解 (pCR) 率由既往传统长程放化疗的 14% 翻倍提升至近 30%，并显著削减 3 年远处转移率。对于经指诊、内镜及 HR-MRI 确认达到临床完全缓解 (cCR) 的患者，指南一致推荐进入 Watch & Wait 观察等待，免受开腹切除之苦！",
    tactics: [
      "适合局部晚期中低位直肠癌 (cT3-4 或 N+)、CRM 阳性/受累或 EMVI 阳性患者；",
      "TNT 治疗结束后必须耐心等待 8~12 周进行消退评估，切勿因急于复查把纤维水肿疤痕误认为残存癌；",
      "选择 Watch & Wait 的患者必须遵守前 2 年每 2~3 个月严密复查的约定；若极少数出现局部再生，>90% 依然能安全补做挽救性手术，不损失生存率。"
    ],
    reassurance: "TNT 全程新辅助彻底改写了直肠癌的治疗哲学，器官保留不再是神话，为中低位患者守住了正常控便的最高尊严。",
    keyMetric: {
      label: "RAPIDO 试验 TNT 方案完全缓解 (pCR) 率",
      value: "28.4%",
      source: "Lancet Oncology 2021 (RAPIDO Trial)"
    },
    faq: [
      {
        question: "TNT 全程新辅助治疗做完需要多长时间？",
        answer: "RAPIDO 模式（短程放疗 1 周 + CAPOX 巩固化疗约 18 周）总计约 5 个月；PRODIGE 23 模式（诱导化疗约 12 周 + 长程同步放化疗约 5 周）总计约 6 个月。时间虽长，但把全部化疗做在体能最好的术前，完成度远高于术后。"
      }
    ]
  },
  {
    id: "rectal_stoma_lars_rehab",
    category: "recovery",
    subcategory: "造口与LARS康复",
    title: "造口居家防漏水护理与保肛后 LARS 排便康复",
    subtitle: "临时造口防漏防红皮、还纳时间表，与保肛术后频繁跑厕所的科学调适",
    icon: "ShieldAlert",
    riskLevel: "moderate",
    priorityOrder: 89,
    visualComponent: "StomaCareLarsVisual",
    searchKeywords: ["造口护理", "回肠造口", "造口底盘", "防漏贴环", "防漏膏", "造口还纳", "LARS综合征", "前切除综合征", "Kegel运动", "易蒙停"],
    metaphor: "临时造口就像为了保护下游新建大桥（肠道吻合口）免受洪水冲刷而暂时建立的分洪渠，等桥墩长牢水泥彻底凝固（3~6个月）后关闸即可；而保肛后的大便频繁（LARS），就像新买的皮鞋刚上脚难免磨脚，经过半年的适应与锻炼，肠道控便功能会越来越默契。",
    clinicalTruth: "低位直肠切除术后，由于天然直肠壶腹（储粪库）缺失及括约肌神经微创，多达 60%~70% 的保肛患者会经历低位前切除综合征 (LARS)，表现为每日排便 10~15 次、里急后重与急迫感。通过水溶性膳食纤维、洛哌丁胺调节及 Kegel 提肛训练，多数患者在术后 6~12 个月内逐步代偿好转。造口底盘精准留出 1~2mm 间隙并辅以防漏贴环，可 100% 避免粪水性皮炎。",
    tactics: [
      "造口防漏五步口诀：测量基底、孔径留出1~2mm、防漏贴环填平褶皱、手掌温按5分钟、排便达1/3即倾倒；",
      "保护性回肠造口建议在术后 3~6 个月，经泛影葡胺灌肠造影证实吻合口完全愈合牢固后，择期行造口还纳微创手术；",
      "保肛术后 LARS 综合征饮食应对：每日早晨补充洋车前子壳使稀便凝胶化成形，餐前配合洛哌丁胺延缓肠蠕动，每天早中晚坚持各做 15 次 Kegel 提肛肌收缩。"
    ],
    reassurance: "临时造口是吻合口愈合的保护神；排便频繁是肠道适应代偿的必经之路，随着时间推移，大部分患者都会重新建立起平稳的生活节律。",
    keyMetric: {
      label: "规范造口护理使造口皮炎发生率降至",
      value: "3.5%",
      source: "WOCN 国际造口护理学会循证实践标准"
    },
    faq: [
      {
        question: "保肛术后大便一天十几趟，擦得屁股红肿脱皮，该怎么办？",
        answer: "这是典型的前切除综合征 (LARS)。切勿每次用干纸巾用力擦拭，建议使用温水冲洗或湿厕纸轻轻蘸干，涂抹氧化锌软膏保护肛周皮肤；同时口服洋车前子壳膳食纤维增加大便成形度，餐前按医嘱服用半片至一片易蒙停。"
      }
    ]
  },
  {
    id: "adjuvant_idea_chemo",
    category: "recovery",
    subcategory: "化疗减毒",
    title: "IDEA 试验下的 3 个月 CAPOX 减毒方案",
    subtitle: "做 3 个月还是 6 个月化疗？如何避开奥沙利铂周围神经手足麻木毒性？",
    icon: "ShieldCheck",
    riskLevel: "safe",
    priorityOrder: 94,
    visualComponent: "StomaCareLarsVisual",
    searchKeywords: ["IDEA试验", "CAPOX", "FOLFOX", "3个月化疗", "奥沙利铂", "神经毒性", "手足麻木", "辅助化疗减毒"],
    metaphor: "化疗就像给消灭残余敌兵开炮——IDEA 试验发现，对于低危阵地，集中轰炸 3 个月已经足够消灭所有残匪，再多炸 3 个月不仅没多大额外战果，反而会严重炸伤自己的周围神经道路（导致持久手足麻木）。",
    clinicalTruth: "IDEA 协作组整合全球 1.2 万名 III 期患者前瞻数据：对于低危 III 期 (T1-3 N1)，3 个月 CAPOX 方案在无病生存率上完全非劣于传统的 6 个月方案，同时将 3 度严重神经毒性从 16% 断崖式降至 3%！高危患者 (T4 或 N2) 则仍建议完成 6 个月足疗程。",
    tactics: [
      "若术后病理评估为低危 III 期 (T1-3 N1)，优先与主治医生确认选用 3 个月 (4个周期) CAPOX 方案；",
      "接受奥沙利铂输注期间及输注后 1 周内，严格禁食冷水、冰饮，避免接触冷水、冷金属或吹冷风，防范急性冷诱发感觉异常；",
      "服药期间配合甲钴胺、维生素 B1 营养神经，若出现持筷困难或扣纽扣不灵便，及时反馈医生下调剂量。"
    ],
    reassurance: "低危患者多做 3 个月化疗并不会带来额外获益，科学降阶梯用药是国际公认保护中枢神经与生活质量的最高智慧。",
    keyMetric: {
      label: "3个月 CAPOX 严重神经毒性降低率",
      value: "81%",
      source: "NEJM 2018 (IDEA Collaboration)"
    },
    faq: [
      {
        question: "化疗少做 3 个月会不会导致复发率升高？",
        answer: "IDEA 全球 1.2 万人数据证实，对于低危 III 期（T1-3 N1），3 个月与 6 个月的 3 年及 5 年复发率差异仅有不到 0.2%，统计学确立非劣效性，绝对安全可靠！"
      }
    ]
  },
  // ==========================================
  // 五、 结直肠综合高阶纵深专科词条 (Expansion to 25)
  // ==========================================
  {
    id: "colorectal_lynch_hereditary",
    category: "genetics",
    subcategory: "遗传性家族筛查",
    title: "Lynch 综合征家系筛查：错配修复基因遗传与全家健康防线",
    subtitle: "MLH1、MSH2、MSH6、PMS2 胚系突变：为什么一人确诊，全家直系亲属都需要排查？",
    icon: "Dna",
    riskLevel: "high",
    priorityOrder: 81,
    visualComponent: "EgfrMutationMapVisual",
    searchKeywords: ["Lynch综合征", "HNPCC", "遗传性肠癌", "错配修复基因", "MLH1", "MSH2", "家系筛查", "子宫内膜癌", "早筛肠镜"],
    metaphor: "Lynch 综合征就像家族祖传的打字机自带拼写校对失灵缺陷。常人的打字员能随时纠错，而携带突变者容易积累乱码（突变），导致肠道乃至子宫内膜更早冒出火花。",
    clinicalTruth: "约 3% 的结直肠癌由 Lynch 综合征（遗传性非息肉病性结直肠癌）引起。它是由 MLH1、MSH2、MSH6 或 PMS2 胚系突变导致的常染色体显性遗传病。若免疫组化提示 MMR 蛋白缺失，且排除 BRAF V600E 突变及 MLH1 启动子高甲基化，强烈推荐全外显子胚系基因测序以排查 Lynch 综合征，指导直系亲属尽早干预。",
    tactics: [
      "确诊时年龄 <50 岁或有多位一级亲属患肠癌/子宫内膜癌者，必查 MMR 蛋白与胚系基因；",
      "确诊 Lynch 综合征的突变携带者，建议从 20~25 岁起每 1~2 年进行一次高质量全结肠镜筛查；",
      "女性携带者需同步接受经阴道超声与子宫内膜活检随访，防范妇科第二原发癌。"
    ],
    reassurance: "查出 Lynch 综合征并不意味着无可救药，相反，规律肠镜下切除早期息肉可使患者终身结肠癌死亡率降低 70% 以上，全家人都能因提前预防而受益。",
    keyMetric: {
      label: "早期肠镜监测降低 Lynch 携带者肠癌死亡率",
      value: "超 72%",
      source: "Gastroenterology / NCCN 遗传性高危结直肠癌指南"
    },
    faq: [
      {
        question: "如果我是 Lynch 综合征，我的孩子有多大几率遗传？",
        answer: "Lynch 综合征属于常染色体显性遗传，子女遗传突变基因的概率为 50%。子女可在年满 18~20 岁后进行针对性外周血基因验证。"
      }
    ]
  },
  {
    id: "colorectal_liver_mets_mdt",
    category: "nodule",
    subcategory: "肝转移多学科转化",
    title: "结直肠癌肝转移 (CRLM) 可切除性评估：转化治疗与根治切除时机",
    subtitle: "从初始不可切除到肿瘤退缩根治：为什么肝转移不再是不可逾越的绝境？",
    icon: "Crosshair",
    riskLevel: "high",
    priorityOrder: 80,
    visualComponent: "HccInterventionSystemicVisual",
    searchKeywords: ["CRLM", "结直肠癌肝转移", "转化治疗", "肝切除", "同时性肝转移", "贝伐珠单抗", "西妥昔单抗", "MDT会诊"],
    metaphor: "结肠与直肠有一条直通肝脏的天然高速公路（门静脉），癌细胞容易顺水漂流在肝脏扎根。但肝脏具有极强的自我再生与代偿能力，只要能把肝内病灶干净切除并保留充足健康肝脏，就能逆转绝境。",
    clinicalTruth: "约 20%~25% 的结直肠癌患者在初诊时即合并肝转移。现代结直肠癌多学科团队 (MDT) 的核心目标是评估肝病灶是否可切除。对于初始不可切除患者，通过高强度全身转化治疗（化疗联用靶向药贝伐珠单抗或西妥昔单抗）缩小病灶，部分患者可转化为根治性 R0 手术切除，5 年生存率可达 30%~50%。",
    tactics: [
      "所有初诊肝转移患者，必须在开始治疗前接受包含胃肠外科、肝胆外科、肿瘤内科、介入科的 MDT 联合会诊；",
      "每 2~3 个月复查上腹部薄层增强 MRI + 普美显造影，精准评估病灶退缩与未来残肝体积 (FLR)；",
      "转化成功达到手术指征时，择期行肠原发灶与肝转移灶的一期或分期切除。"
    ],
    reassurance: "肠癌肝转移绝不等同于生命倒计时！在现代医学靶向转化与精细肝外科技术的护航下，相当一部分晚期转移患者实现了长达数年甚至十余年的无瘤长期生存。",
    keyMetric: {
      label: "结直肠癌肝转移 R0 根治切除后 5 年生存率",
      value: "35% - 50%",
      source: "Annals of Surgery / CSCO 结直肠癌诊疗指南"
    },
    faq: [
      {
        question: "肝上长了好几个转移灶，是不是就不能做手术了？",
        answer: "不能只看病灶数目！只要剩余健康肝脏体积充足（正常肝脏保留 ≥30%，肝硬化保留 ≥40%）且关键血管未被侵犯，多发病灶依然可以通过分段切除或联合消融实现根治。"
      }
    ]
  },
  {
    id: "colorectal_folfox_folfiri_balance",
    category: "recovery",
    subcategory: "一线化疗基石对比",
    title: "FOLFOX vs FOLFIRI 方案权衡：奥沙利铂与伊立替康副反应破译",
    subtitle: "如何选择一线双药？手足遇冷刺痛与延迟性腹泻的针对性解痉防范",
    icon: "ShieldAlert",
    riskLevel: "moderate",
    priorityOrder: 79,
    visualComponent: "AdjuvantDecisionTreeVisual",
    searchKeywords: ["FOLFOX", "FOLFIRI", "奥沙利铂", "伊立替康", "手足刺痛", "冷过敏", "延迟性腹泻", "阿托品", "易蒙停"],
    metaphor: "FOLFOX 与 FOLFIRI 就像战壕里的两把突击步枪——一把配发的是冷敏感子弹（奥沙利铂，怕冷怕冰），另一把配发的是肠动力激惹弹（伊立替康，易刺激肠道滑膛）。医生会根据你的体质和生活习惯定制弹药。",
    clinicalTruth: "FOLFOX（氟尿嘧啶+亚叶酸钙+奥沙利铂）和 FOLFIRI（氟尿嘧啶+亚叶酸钙+伊立替康）在晚期转移性结肠癌一线疗效中总生存期相当。奥沙利铂主要特征为蓄积性外周神经毒性（遇冷刺激手脚针扎样刺痛）；伊立替康主要特征为迟发性腹泻（常在用药 24 小时后发生）和急性胆碱能综合征（出汗、腹部绞痛）。",
    tactics: [
      "使用奥沙利铂当天及随后 5~7 天内严禁接触任何冷水、冷饮、金属把手，温水洗脸刷牙；",
      "使用伊立替康若滴注中突发多汗、流涎、腹部绞痛，立即通知护士皮下注射阿托品解痉；",
      "使用伊立替康后一旦发生迟发性腹泻，立刻按医嘱首剂服用 4mg 洛哌丁胺（易蒙停），随后每 2 小时服 2mg 直至腹泻停止。"
    ],
    reassurance: "掌握两套方案的个性化副反应规律后，绝大部分不适都可以通过提前防护和常备药物化险为夷，顺利完成全程治疗。",
    keyMetric: {
      label: "规范使用易蒙停控制伊立替康迟发腹泻成功率",
      value: "> 90%",
      source: "ESMO Clinical Practice Guidelines for Metastatic Colorectal Cancer"
    },
    faq: [
      {
        question: "奥沙利铂打到第 6 次手脚麻木加重，需要减量或停药吗？",
        answer: "若出现拿筷子扣纽扣困难等日常功能障碍（2 级神经毒性），应及时向主管医生汇报，按照 OPTIMOX 间歇策略适度减量或暂时休药，防止不可逆神经损伤。"
      }
    ]
  },
  {
    id: "colorectal_bevacizumab_monitoring",
    category: "genetics",
    subcategory: "抗血管生成安全预警",
    title: "贝伐珠单抗靶向安全红线：肠穿孔、高血压与围术期停药窗口",
    subtitle: "抑制血管生成的双刃剑：哪些蛛丝马迹提示需要立即暂停靶向药？",
    icon: "AlertTriangle",
    riskLevel: "high",
    priorityOrder: 78,
    visualComponent: "TargetedSideEffectsVisual",
    searchKeywords: ["贝伐珠单抗", "安维汀", "肠穿孔", "高血压", "蛋白尿", "伤口裂开", "抗血管生成", "停药窗口期"],
    metaphor: "贝伐珠单抗就像把肿瘤的补给管道（新生毛细血管）全部切断断水断粮；但它同时也减缓了正常组织血管的修复能力，因此胃肠道薄弱处与新鲜手术切口需要格外保护。",
    clinicalTruth: "贝伐珠单抗是晚期转移性结直肠癌的核心靶向药物之一。但由于其抑制 VEGF 途径，可能导致罕见但致命的胃肠道穿孔（发生率约 1%~2%）、顽固性高血压、蛋白尿以及伤口延迟愈合。择期大手术前必须停药至少 6~8 周，术后伤口完全愈合且至少满 4~6 周方可恢复用药。",
    tactics: [
      "用药期间每日早晚定时监测血压，血压若持续 ≥140/90 mmHg，及时启动降压药物治疗；",
      "每个周期化疗前常规化验尿常规，若尿蛋白 ≥2+ 应查 24 小时尿蛋白定量；",
      "用药期间若突发剧烈刀割样腹痛伴腹肌强直板状腹，必须立即就近急诊外科排查消化道穿孔；",
      "计划进行拔牙、胃肠内镜活检或任何外科手术前，必须提前向医生说明正在使用贝伐珠单抗。"
    ],
    reassurance: "肠穿孔发生率极低（<2%），只要避开急性溃疡和肠道严重狭窄期，并在围手术期严格遵守停药窗口期，贝伐珠单抗的安全性十分可靠。",
    keyMetric: {
      label: "规范监测下贝伐珠单抗胃肠道穿孔发生率",
      value: "< 1.5%",
      source: "Lancet Oncology / FDA Drug Safety Data"
    },
    faq: [
      {
        question: "用药后尿常规提示尿蛋白 1+ 需要停药吗？",
        answer: "1+ 通常不需要停药，但提示需要密切追踪；若进展至 2+ 或 24 小时尿蛋白定量 >2g，则需遵医嘱暂停用药直至指标恢复安全范围。"
      }
    ]
  },
  {
    id: "colorectal_mremvi_vascular_invasion",
    category: "nodule",
    subcategory: "血行转移预警",
    title: "壁外血管侵犯 (mrEMVI)：MRI 识别直肠与结肠远处血行转移隐形火种",
    subtitle: "肿瘤钻入系膜静脉的影像标志：如何指导术后强化全身静脉化疗？",
    icon: "Network",
    riskLevel: "high",
    priorityOrder: 77,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["EMVI", "mrEMVI", "壁外血管侵犯", "血行转移", "肝转移风险", "强化辅助化疗", "MRI分级"],
    metaphor: "mrEMVI 就像癌细胞偷偷钻进了肠系膜周围的大水管（静脉血管），顺着水流有把火星冲刷到肝脏和肺部的潜伏风险。MRI 能像透视镜一样捕捉到血管被癌栓撑粗膨隆的异常影像。",
    clinicalTruth: "MRI 诊断的壁外血管侵犯 (mrEMVI) 分为 0~4 级（3~4 级为阳性）。mrEMVI 阳性患者发生远处血行转移（尤其肝肺转移）的风险是阴性患者的 3~4 倍。即使原发灶成功切除，mrEMVI 阳性仍提示高度全身隐匿微转移风险，是指导术后采用全疗程加进化疗方案（如 CAPOX/mFOLFOX6）的关键高危指标。",
    tactics: [
      "检查盆腔与腹部 MRI 报告中是否有明确的「mrEMVI 评级（0~4分）」；",
      "若术前存在 mrEMVI 阳性，治疗策略应倾向于更积极的全程新辅助治疗 (TNT) 提前控制全身血液循环；",
      "术后随访加强胸腹部增强 CT 监测频率，重点排查肝肺早期转移灶。"
    ],
    reassurance: "发现 mrEMVI 阳性让医生能提前布防，在微小转移灶形成之前用高强度系统性化疗精准狙击，大大削弱了癌细胞扩散的机会。",
    keyMetric: {
      label: "mrEMVI 阳性患者远处转移风险增加倍数",
      value: "3 - 4 倍",
      source: "Radiology / J Clin Oncol 临床影像共识"
    },
    faq: [
      {
        question: "mrEMVI 阳性做完放化疗后会消失吗？",
        answer: "会！约 50% 以上的患者在新辅助放化疗后出现 mrEMVI 降期或纤维化消失（转为 ymrEMVI 阴性），预后会得到显著改善。"
      }
    ]
  },
  {
    id: "colorectal_braf_v600e_targeted",
    category: "genetics",
    subcategory: "难治靶点联合破局",
    title: "BRAF V600E 恶性突变攻坚：恩考芬尼 + 西妥昔单抗双靶靶向破局",
    subtitle: "右半恶性度高、传统化疗反应差的凶险突变如何打出漂亮的绝地反击？",
    icon: "Zap",
    riskLevel: "high",
    priorityOrder: 76,
    visualComponent: "EgfrMutationMapVisual",
    searchKeywords: ["BRAF", "BRAF V600E", "恩考芬尼", "西妥昔单抗", "BEACON", "康奈非尼", "难治肠癌", "右半结肠"],
    metaphor: "BRAF V600E 就像下游水闸的电机卡死在常开状态，滔滔水流疯狂刺激肿瘤分裂。单用一种靶向药堵漏，肿瘤会瞬间通过其他支路反弹反馈激活；必须用恩考芬尼加上西妥昔单抗「上下游双重关闸」，才能彻底掐死肿瘤供水。",
    clinicalTruth: "约 8%~10% 的结直肠癌携带 BRAF V600E 突变，多见于右半结肠、老年女性及黏液腺癌，传统二联化疗预后极差。里程碑式 BEACON 试验证实：单用 BRAF 抑制剂无效，必须联合抗 EGFR 单抗（恩考芬尼 + 西妥昔单抗）。该「无化疗双靶组合」使客观缓解率成倍提高，显著逆转了生存劣势，成为 NCCN/CSCO 指南推荐的二线金标准。",
    tactics: [
      "所有初诊晚期结直肠癌患者必须同步检测 KRAS、NRAS 和 BRAF V600E 状态；",
      "BRAF V600E 阳性患者一线通常首选加强型三联方案（FOLFOXIRI + 贝伐珠单抗）或积极参与前沿临床试验；",
      "一线疾病进展后，立即无缝换用恩考芬尼联合西妥昔单抗双靶方案；",
      "双靶治疗期间警惕痤疮样皮疹与低镁血症，常备润肤剂与口服补镁制剂。"
    ],
    reassurance: "过去 BRAF 突变曾被视为无药可用的阴霾，如今靶向联合策略已经成功攻克这道堡垒，为患者提供了极具杀伤力的靶向杀手锏。",
    keyMetric: {
      label: "BEACON 研究双靶方案相比对照组死亡风险降低",
      value: "40%",
      source: "NEJM / BEACON CRC Phase III Study"
    },
    faq: [
      {
        question: "既然是 BRAF 突变，为什么还要用西妥昔单抗（抗 EGFR）？",
        answer: "因为肠癌细胞具有极强的反馈代偿回路，单独抑制 BRAF 会瞬间反射性激活上游 EGFR 受体使耐药重现，必须双管齐下切断反馈机制才能持久见效。"
      }
    ]
  },
  {
    id: "colorectal_her2_dual_adc",
    category: "genetics",
    subcategory: "罕见基因过表达破局",
    title: "结直肠癌 HER2 扩增与双靶/ADC 治疗：罕见突变的精准破冰",
    subtitle: "RAS/BRAF 全野生型耐药后的隐匿突破口：曲妥珠单抗联合吡咯替尼或图卡替尼",
    icon: "Target",
    riskLevel: "moderate",
    priorityOrder: 75,
    visualComponent: "Her2AdcVisual",
    searchKeywords: ["HER2扩增", "肠癌HER2", "曲妥珠单抗", "图卡替尼", "吡咯替尼", "德曲妥珠单抗", "MyPathway", "MOUNTAINEER"],
    metaphor: "如果把结直肠癌比作一把精密的防盗锁，大部分患者是用 RAS/BRAF 这几把钥匙开门的；而 3%~5% 的特殊锁芯上密密麻麻装满了 HER2 的钥匙孔。识别出这个隐藏漏洞，就可以直接借调乳腺癌领域大名鼎鼎的双靶抗体将其一击必杀。",
    clinicalTruth: "在 RAS/BRAF 野生型的转移性结直肠癌中，约 3%~5% 存在 HER2 基因扩增或蛋白过表达。这部分患者往往对西妥昔单抗等 EGFR 靶向药天然耐药，但在抗 HER2 双靶治疗（如曲妥珠单抗联合帕妥珠单抗、或曲妥珠单抗联合图卡替尼 MOUNTAINEER 研究）及新型 ADC 药物（T-DXd）中展现出高达 35%~40% 的高客观缓解率。",
    tactics: [
      "既往常规化疗联合靶向药耐药后，必须复检组织样本的 HER2 免疫组化 (IHC) 及 FISH 扩增；",
      "确认 HER2 阳性（IHC 3+ 或 IHC 2+ 且 FISH+）且 RAS 野生型者，积极争取抗 HER2 双靶或 ADC 临床治疗；",
      "治疗期间每 3 个月监测心脏超声左心室射血分数 (LVEF)，警惕可逆的心肌收缩力波动。"
    ],
    reassurance: "精准基因检测的普及让少见罕见突变无所遁形，哪怕是 3% 的小众靶点，也能匹配上最顶尖的前沿创新药。",
    keyMetric: {
      label: "MOUNTAINEER 研究双靶方案客观缓解率 (ORR)",
      value: "38.1%",
      source: "Lancet Oncology / FDA Accelerated Approval"
    },
    faq: [
      {
        question: "HER2 阳性不是乳腺癌特有的吗？肠癌怎么也会有？",
        answer: "HER2 是广泛存在于多种上皮细胞表面的人类表皮生长因子受体，除了乳腺癌和胃癌，在部分肠癌、胆道癌和肺癌中也会发生异常扩增。"
      }
    ]
  },
  {
    id: "colorectal_thirdline_fruquintinib_tas102",
    category: "genetics",
    subcategory: "后线靶向新选择",
    title: "三线靶向攻坚：呋喹替尼与 TAS-102 (朗斯弗) 口服管理",
    subtitle: "一线二线化疗耐药后的坚实后盾：服用周期、手足皮肤反应与血象监测",
    icon: "Zap",
    riskLevel: "moderate",
    priorityOrder: 74,
    visualComponent: "AdjuvantDecisionTreeVisual",
    searchKeywords: ["呋喹替尼", "爱优特", "TAS-102", "朗斯弗", "三线治疗", "手足皮肤反应", "中性粒细胞减少", "口服靶向"],
    metaphor: "后线靶向药就像主力兵团拼刺刀后的轻骑兵包抄——不用天天去医院住院吊水，只需在家按周期规范口服药丸，就能持续掐断肿瘤的生命补给线。",
    clinicalTruth: "呋喹替尼（高选择性 VEGFR 1/2/3 抑制剂，FRESCO 研究）与 TAS-102（曲氟尿苷替匹嘧啶，RECOURSE 研究）是国际指南一致推荐的晚期结直肠癌标准三线方案。两者作用机制互补：呋喹替尼侧重抗血管生成，需警惕手足皮肤反应和高血压；TAS-102 侧重细胞毒直接抗癌，需重点关注骨髓造血抑制。",
    tactics: [
      "呋喹替尼标准用法：每日一次口服 5mg，连服 3 周，停药 1 周（28 天为一个周期）；",
      "服用呋喹替尼期间，手脚经常涂抹高浓度尿素乳膏，穿柔软宽松纯棉鞋袜，避免长时间徒步摩擦；",
      "TAS-102 服药期间必须在每周期第 14 天和第 21 天化验血常规，警惕白细胞和血小板下降。"
    ],
    reassurance: "即使前两线化疗方案出现耐药，现代肿瘤学依然准备了多款有效的口服武器，能帮助患者维持高质量的无瘤或带瘤慢病化生活。",
    keyMetric: {
      label: "FRESCO 全球研究呋喹替尼相比安慰剂降低死亡风险",
      value: "34%",
      source: "JAMA / CSCO 晚期结直肠癌诊疗指南"
    },
    faq: [
      {
        question: "口服靶向药漏服了一次，第二天需要吃双倍剂量补回来吗？",
        answer: "绝对不能吃双倍剂量！若发现漏服且距下次服药已不足 12 小时，跳过该次漏服，按原计划时间正常服用下一次剂量即可。"
      }
    ]
  },
  {
    id: "colorectal_stoma_leakage_care",
    category: "recovery",
    subcategory: "造口防漏实操",
    title: "造口防漏可塑贴环与皮肤保护：终结粪水接触性皮炎五步法",
    subtitle: "底盘老是漏、造口周围皮肤红肿溃烂刺痛？打造滴水不漏的黄金防漏垫圈",
    icon: "ShieldAlert",
    riskLevel: "safe",
    priorityOrder: 73,
    visualComponent: "StomaCareLarsVisual",
    searchKeywords: ["造口防漏", "可塑贴环", "造口皮炎", "底盘裁剪", "皮肤保护膜", "造口粉", "粪水渗漏", "造口护理实操"],
    metaphor: "造口底盘粘贴就像给潜水艇舱门安装密封橡胶圈。造口周围的皮肤不是平整的玻璃板，而是凹凸不平的褶皱山丘；可塑防漏贴环就像柔软如橡皮泥的面团垫圈，能把所有的皮肤沟壑彻底填平塞实，把具有强腐蚀性的排泄物死死挡在门外。",
    clinicalTruth: "回肠及结肠造口最痛苦的并发症是粪水接触性皮炎，其根源几乎全在「底盘渗漏」。预防渗漏的关键是「造口三件套（造口粉+皮肤保护膜+可塑贴环）」的规范运用。底盘中心孔径裁剪必须严格契合造口根部，仅预留 1~2mm 间隙；搭配可塑贴环紧密贴附于造口根部，能让底盘使用时间从 1 天延长至 4~7 天，杜绝皮肤溃烂。",
    tactics: [
      "底盘裁剪原则：测量造口根部最大径，裁剪孔径仅比实际尺寸大 1~2mm（太小勒坏黏膜，太大裸露皮肤受腐蚀）；",
      "皮炎处理黄金流程：清洗晾干 ➔ 溃破处轻扑造口粉吸干渗液 ➔ 喷涂无刺激皮肤保护膜锁死粉末 ➔ 贴上揉捏拉伸好的可塑贴环 ➔ 贴紧底盘；",
      "贴上新底盘后，用手掌心温热按压底盘 10~15 分钟，水胶体遇体温软化后粘性达到峰值；",
      "造口袋排出物达到袋体 1/3~1/2 容量时立即排空，严禁重力拖拽导致底盘下半部分拉脱翘边。"
    ],
    reassurance: "只要熟练掌握可塑贴环与底盘温热按压技巧，即使是凹陷或褶皱造口也能做到滴水不漏，重新找回干爽舒适的日常生活。",
    keyMetric: {
      label: "规范使用防漏贴环后造口接触性皮炎改善率",
      value: "超 92%",
      source: "WCET 国际造口治疗师协会指南"
    },
    faq: [
      {
        question: "底盘已经漏了一点点排泄物，拿透明胶布粘一下能凑合用吗？",
        answer: "绝对不行！只要底盘边缘开始渗漏，粪水已经在底盘下方大面积蚕食腐蚀正常皮肤，拖延几小时就会导致整圈皮肤重度溃烂，必须立刻彻底揭除更换新底盘！"
      }
    ]
  },
  {
    id: "colorectal_bowel_obstruction_stent",
    category: "nodule",
    subcategory: "恶性肠梗阻急诊处置",
    title: "晚期结直肠恶性梗阻：自膨胀金属支架 (SEMS) 桥接手术 vs 急诊造口",
    subtitle: "停止排气排便、肚子剧痛胀大时如何化解危机？微创支架撑开生命通道",
    icon: "AlertTriangle",
    riskLevel: "high",
    priorityOrder: 72,
    visualComponent: "RectalAnatomyRulerVisual",
    searchKeywords: ["肠梗阻", "金属支架", "SEMS", "急诊手术", "桥接手术", "梗阻缓解", "造口避免", "左半结肠梗阻"],
    metaphor: "肠梗阻就像下水管道被水泥块彻底堵死，上游污水排不出去导致水管几乎胀破。金属支架就像在内镜引导下把弹簧伞推进堵塞狭窄处并撑开，瞬间排空积水积气，避免开腹紧急切肠打洞。",
    clinicalTruth: "结直肠癌急性完全性梗阻属于外科急症，极易发生回盲瓣闭合性肠襻高压穿孔。针对左半结直肠梗阻，放置内镜下自膨胀金属支架 (SEMS) 作为「桥接手术 (Bridge-to-Surgery)」策略，可使肠道迅速减压消肿，使原本只能急诊造口的患者转为择期一期切除吻合微创手术，极大降低永久性造口率。",
    tactics: [
      "若突发数日无排气排便、伴剧烈腹胀、呕吐宿食，严禁擅自服用泻药，立即前往急诊拍腹部立位平片或急诊 CT；",
      "由消化内镜与结直肠外科医生联合评估肿瘤位置与穿孔风险，符合指征者优先考虑内镜支架置入；",
      "支架置入后 48 小时内进食无渣温流质，避免高纤维食物团块重新堵塞支架网眼。"
    ],
    reassurance: "微创支架技术让 80% 以上的左半结直肠急性梗阻患者摆脱了仓促急诊开腹手术的痛苦，赢得了从容检查与规范择期手术的宝贵窗口期。",
    keyMetric: {
      label: "SEMS 支架桥接手术后一期吻合成功率",
      value: "超 75%",
      source: "Lancet Oncology / ESGE 胃肠内镜指南"
    },
    faq: [
      {
        question: "放了金属支架后多久可以做根治性手术？",
        answer: "通常在支架置入后 1~2 周左右，待肠壁水肿完全消退、患者水电解质和营养状态全面改善后，即可择期进行微创根治性手术。"
      }
    ]
  },
  {
    id: "colorectal_peritoneal_carcinomatosis_hipec",
    category: "pathology",
    subcategory: "腹膜转移与减灭手术",
    title: "结直肠癌腹膜转移评估：PCI 腹膜癌指数与完全细胞减灭 (CRS)",
    subtitle: "癌细胞掉落腹腔如满天星？HIPEC 腹腔热灌注化疗的科学适应证与禁忌",
    icon: "Layers",
    riskLevel: "high",
    priorityOrder: 71,
    visualComponent: "RectalCrmMriVisual",
    searchKeywords: ["腹膜转移", "PCI指数", "细胞减灭术", "CRS", "HIPEC", "腹腔热灌注", "腹膜癌", "恶性腹水"],
    metaphor: "腹膜转移就像杂草种子随风吹落散布在整个农田草皮上。普通静脉输液由于「血-腹膜屏障」很难让农药渗透进腹膜结节，需要外科医生把肉眼可见的草根逐个拔光（CRS），再用温热农药水直接在田地里冲刷浸泡（HIPEC）。",
    clinicalTruth: "腹膜是结直肠癌仅次于肝脏的第二大转移靶器官。国际公认采用腹膜癌指数 (PCI，0~39 分) 评估病灶范围。对于 PCI 评分较低（通常 ≤15~20 分）、全身其他器官无广泛转移的患者，由经验丰富的专科中心实施完全肿瘤细胞减灭术 (CRS) 达到 CC-0/1 切除，配合腹腔热灌注化疗 (HIPEC)，能为这部分既往被认为无药可救的患者带来长生存希望。",
    tactics: [
      "术前通过全腹部增强薄层 CT 或高分辨率弥散 MRI 精准计算 PCI 评分；",
      "严禁在不可切除或广泛肝肺转移晚期患者中盲目跟风做超大创伤 CRS+HIPEC，防止严重吻合口瘘与肠瘘；",
      "若腹水或病理提示印戒细胞癌或高分化侵袭型，需多学科审慎评估化疗敏感性。"
    ],
    reassurance: "腹膜转移治疗正从过去的单纯对症引流，转变为积极的精准根治性减灭新时代，经过严格筛选的患者同样能够实现高质量长期生存。",
    keyMetric: {
      label: "低 PCI 达到完全细胞减灭后 5 年生存率",
      value: "超 30%",
      source: "PRODIGE 7 试验 / Lancet Oncology"
    },
    faq: [
      {
        question: "腹膜转移做热灌注化疗会不会烫伤肠子？",
        answer: "HIPEC 使用的恒温灌注液通常严格恒定在 42℃~43℃，这个温度下热休克效应能精准杀死对热敏感的癌细胞，而正常肠道黏膜耐热耐受阈值可达 45℃，不会被烫伤坏死。"
      }
    ]
  },
  {
    id: "colorectal_ctdna_mrd_surveillance",
    category: "genetics",
    subcategory: "分子残留病灶早警报",
    title: "结直肠癌 ctDNA 微小残留病灶 (MRD)：血液里的纳米级复发雷达",
    subtitle: "根治术后血液肿瘤 DNA 监测：能否预测复发与指导化疗精准减负？",
    icon: "Dna",
    riskLevel: "moderate",
    priorityOrder: 70,
    visualComponent: "MrdCtdnaVisual",
    searchKeywords: ["ctDNA", "MRD", "微小残留病灶", "液体活检", "复发风险预测", "化疗降阶梯", "提前预警", "术后监测"],
    metaphor: "ctDNA 就像是肿瘤细胞在全身血液高速公路上掉落的微小指纹碎屑。CT 就像望远镜，只能看清已经长成拳头或黄豆大小的实体肿块；而 ctDNA 就像纳米级嗅探犬，在影像学还一无所知的无声阶段，就能嗅到微观残留的一丝气息。",
    clinicalTruth: "循环肿瘤 DNA (ctDNA) 监测的微小残留病灶 (MRD) 是评估根治术后复发风险的最前沿生物标志物。术后 ctDNA 持续呈阴性的 II/III 期结直肠癌患者，远期无复发生存率高达 85%~90% 以上；反之，若术后 ctDNA 呈阳性，其复发风险比阴性者高出近 10 倍，且平均比常规 CT 提前 4~9 个月预警复发。",
    tactics: [
      "术前保留新鲜手术或穿刺肿瘤组织样本，作为未来个体化定制 ctDNA 追踪面板的基准模板；",
      "手术根治后 4~6 周完成首次外周血 MRD 采血检测；",
      "若术后 MRD 持续阴性且分期早，可在多学科医生审慎评估下探讨是否适当降低后续辅助化疗强度；若阳性则需强化全身治疗与密切影像排查。"
    ],
    reassurance: "MRD 阴性结果能给患者吃下一颗强效定心丸，让更多患者免受不必要的高强度过度化疗折磨，迈向更加精准绿色的个性化康复。",
    keyMetric: {
      label: "术后 ctDNA 持续阴性患者 2 年无复发率",
      value: "超 88%",
      source: "Nature Medicine / GALAXY Study (CIRCULATE-Japan)"
    },
    faq: [
      {
        question: "抽血查 ctDNA 能代替做肠镜和增强 CT 吗？",
        answer: "不能完全替代！ctDNA 是全身微观转移的敏锐哨兵，而肠镜和 CT 负责把关局部吻合口与重要脏器解剖结构，两者相辅相成才是最立体的防护网。"
      }
    ]
  },
  {
    id: "colorectal_postop_diet_rehabilitation",
    category: "recovery",
    subcategory: "术后营养与消化代偿",
    title: "结直肠切除术后饮食阶梯进阶：低渣饮食、肠道菌群代偿与防肠粘连",
    subtitle: "从清流质、半流质到软食过渡：哪些产气与粗纤维食物需要暂时远离？",
    icon: "Heart",
    riskLevel: "safe",
    priorityOrder: 69,
    visualComponent: "GastricDumpingNutritionVisual",
    searchKeywords: ["术后饮食", "低渣饮食", "肠切除营养", "肠道菌群", "产气食物", "肠粘连", "少食多餐", "膳食纤维过渡"],
    metaphor: "刚做完手术的肠道就像刚刚经历翻修铺路的水渠，水渠接缝处的泥浆（吻合口）还很娇嫩，经不起大石块和枯树枝（粗硬膳食纤维）的猛烈撞击，必须用清澈的水流和细腻的流沙慢慢浸润磨合。",
    clinicalTruth: "大肠具有重吸收水分和无机盐的关键功能。部分结肠与直肠切除术后早期，患者常出现大便次数增多、水样便或不成形便。饮食调整应严格遵循「无渣流质 ➔ 少渣半流质 ➔ 低纤维软食 ➔ 普食」的 4~6 周阶梯路径。术后 1 个月内应避免芹菜、韭菜、笋干等高不可溶性粗纤维食物，以防食糜团块在吻合口处滞留甚至诱发机械性肠梗阻。",
    tactics: [
      "出院初期遵循少食多餐原则，每日进食 5~6 次，每次七分饱，细嚼慢咽（每口咀嚼 20 次以上）；",
      "术后前 4 周避免产气过多的食物（如洋葱、大蒜、黄豆、碳酸饮料、红薯），减轻术后腹胀与吻合口张力；",
      "补充高品质优质蛋白（清蒸鱼肉、去皮鸡肉、蛋羹、乳清蛋白粉）促进腹壁切口与肠道吻合口胶原合成；",
      "若术后数月腹泻仍不见好转，可在医生指导下补充双歧杆菌等活菌制剂调节失衡的肠道微生态。"
    ],
    reassurance: "剩余肠道具有极其强大的代偿能力，绝大部分患者在术后 3~6 个月后，排便习惯和吸收能力都会逐步恢复至接近常人水平。",
    keyMetric: {
      label: "规范阶梯饮食后吻合口机械梗阻发生率降低",
      value: "超 60%",
      source: "ESPEN 临床外科营养指南"
    },
    faq: [
      {
        question: "出院后能喝乌鸡汤、鸽子汤进补吗？",
        answer: "可以适量喝去油后的清汤，但更关键的是吃肉！汤里的蛋白质含量不到 1%~2%，绝大部分优质营养和氨基酸都在肉渣蛋白中，吃软烂的肉类才是真正的营养来源。"
      }
    ]
  }
];

export const COLORECTAL_WIKI_CATEGORIES: Record<WikiCategory, { label: string; icon: string; desc: string; color: string; badgeBg: string }> = {
  nodule: {
    label: "肠镜早筛与直肠保肛",
    icon: "colorectal",
    desc: "结直肠息肉腺瘤阻断、直肠解剖三段分水岭、距肛缘厘米数与极限保肛决策指南",
    color: "text-emerald-700",
    badgeBg: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  pathology: {
    label: "浸润病理与核磁切缘",
    icon: "microscope",
    desc: "破译 T分期肠壁浸润、骨盆高分辨核磁 CRM环周切缘(<=1mm)、mrEMVI脉管侵犯与肿瘤沉积TD",
    color: "text-blue-700",
    badgeBg: "bg-blue-50 border-blue-200 text-blue-700",
  },
  genetics: {
    label: "驱动基因与靶向免疫",
    icon: "dna",
    desc: "dMMR/MSI-H 新辅助免疫免手术新突破、RAS/BRAF 靶向指征与左右半结直肠用药分流",
    color: "text-purple-700",
    badgeBg: "bg-purple-50 border-purple-200 text-purple-700",
  },
  recovery: {
    label: "TNT新辅助与造口康复",
    icon: "recovery",
    desc: "全程新辅助 TNT 器官保留与 Watch & Wait 观察等待、造口防漏水护理、术后 LARS 排便综合征康复与 IDEA 减毒",
    color: "text-amber-700",
    badgeBg: "bg-amber-50 border-amber-200 text-amber-700",
  },
};
