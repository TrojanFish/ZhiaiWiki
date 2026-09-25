export interface ResourceLink {
  name: string;
  url: string;
  description: string;
  tip?: string;
  lang: "zh" | "en" | "both";
  free: boolean;
}

export interface ResourceCategoryData {
  id: string;
  iconName: "Building2" | "Newspaper" | "Database" | "Wrench" | "BookOpen";
  level: "beginner" | "intermediate" | "advanced";
  levelLabel: string;
  levelColor: string;
  title: string;
  subtitle: string;
  warning?: string;
  links: ResourceLink[];
}

export const BREAST_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 患者友好",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威临床指南",
    subtitle: "由国际与国内顶尖肿瘤学术机构出版，结论最为权威，提供简明指引。",
    links: [
      {
        name: "NCCN 早期乳腺癌患者指南（中文完整版）",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/breast-early-invasive-patient.pdf",
        description: "美国国家综合癌症网络（NCCN）发布的早期浸润性乳腺癌官方患者指南，图文并茂，详述保乳切除、放疗指征与 5~10 年内分泌规划。",
        tip: "推荐重点阅读「手术后辅助治疗决策」章节，搞清楚自己是否属于免化疗人群。",
        lang: "both",
        free: true
      },
      {
        name: "CSCO 乳腺癌诊疗指南（中国临床肿瘤学会）",
        url: "http://www.csco.org.cn",
        description: "结合中国女性致密腺体特征、国内医保报销红线与国产原研新药的权威指南，每年更新一次，是国内三甲医院医生的处方准则。",
        tip: "可查阅各分型的一类推荐方案，避免被非规范诊疗误导。",
        lang: "zh",
        free: true
      },
      {
        name: "圣加仑 (St. Gallen) 国际乳腺癌专家共识",
        url: "https://www.oncologypro.esmo.org",
        description: "每两年由全球数十位顶级乳腺癌专家投票形成的早期乳腺癌共识，是全球分子分型与降阶梯治疗的风向标。",
        tip: "主要指导 Luminal 分型与早期微创手术策略。",
        lang: "en",
        free: true
      }
    ]
  },
  {
    id: "calculators",
    iconName: "Wrench",
    level: "intermediate",
    levelLabel: "精准量化 · 辅助决策",
    levelColor: "text-blue-700 border-blue-300 bg-blue-50",
    title: "国际预后在线测算工具",
    subtitle: "由剑桥大学等顶尖科研院所开发的数学预测模型，量化辅助治疗净收益。",
    links: [
      {
        name: "Predict Breast (英国剑桥大学官方工具)",
        url: "https://breast.predict.cam",
        description: "全球应用最广的早期乳腺癌 10 年预后计算器。输入年龄、肿瘤大小、受体 (ER/HER2)、Ki67 与淋巴结数量，精确测算化疗与内分泌治疗带来的绝对获益百分比。",
        tip: "建议由患者家属协助录入，测算结果可打印带去门诊与主治医生共同探讨。",
        lang: "both",
        free: true
      },
      {
        name: "Oncotype DX 官方医师参考中心",
        url: "https://www.genomichealth.com",
        description: "21 基因复发评分 (Recurrence Score) 官方学术中心，提供 TAILORx 与 RxPONDER 临床试验的详细解读。",
        tip: "适合拿到了 21 基因报告的患者家属深入理解 RS 风险分层。",
        lang: "en",
        free: true
      }
    ]
  },
  {
    id: "communities",
    iconName: "BookOpen",
    level: "beginner",
    levelLabel: "温暖关爱 · 病友互助",
    levelColor: "text-pink-700 border-pink-300 bg-pink-50",
    title: "全球与国内患者关爱社群",
    subtitle: "高质量的患者自救与互助组织，提供术后心理疏导与生活康复指南。",
    links: [
      {
        name: "Breastcancer.org (全球最大乳腺癌患者社区)",
        url: "https://www.breastcancer.org",
        description: "全球历史最悠久、内容最详尽的循证乳腺癌非营利组织，涵盖术后义乳佩戴、淋巴水肿居家护理及心理健康。",
        tip: "其「生活与康复 (Living With Breast Cancer)」板块极为温情实用。",
        lang: "en",
        free: true
      },
      {
        name: "粉红丝带关爱基金 (Pink Ribbon)",
        url: "http://www.pinkribbon.org.cn",
        description: "国内知名乳腺健康公益项目，倡导早预防、早发现、早治疗，定期举办术后康复线下沙龙与心理支持活动。",
        tip: "可关注其义乳申领与淋巴水肿康复操推广。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "hospitals",
    iconName: "Building2",
    level: "advanced",
    levelLabel: "全国顶尖 · 专科就医",
    levelColor: "text-purple-700 border-purple-300 bg-purple-50",
    title: "全国乳腺专科顶尖医疗中心导航",
    subtitle: "复旦专科综合排名前列的三甲医疗机构，汇聚国内乳腺多学科 MDT 顶尖团队。",
    links: [
      {
        name: "复旦大学附属肿瘤医院 · 乳腺外科",
        url: "https://www.medline.com.cn",
        description: "邵志敏教授团队，中国乳腺癌临床与转化研究领军中心，在三阴性「复旦分型」个体化治疗领域享誉全球。",
        tip: "适合复杂疑难病理、三阴性或年轻患者寻求第二诊疗意见 (Second Opinion)。",
        lang: "zh",
        free: true
      },
      {
        name: "中国医学科学院肿瘤医院 · 乳腺内科",
        url: "http://www.cicams.ac.cn",
        description: "徐兵河院士团队，国家癌症中心核心所在，领衔了国内大部分新型靶向药、ADC与内分泌药物的前瞻性临床试验。",
        tip: "适合寻求前沿创新药物临床试验 (GCP) 评估的晚期或高危患者。",
        lang: "zh",
        free: true
      },
      {
        name: "中山大学肿瘤防治中心 (中肿) · 乳腺科",
        url: "https://www.sysucc.org.cn",
        description: "华南地区规模最大、质控最规范的乳腺诊疗中心之一，擅长微创保乳及即刻乳房再造手术。",
        tip: "保乳意愿强烈或希望行假体/自体皮瓣再造的患者首选就诊中心。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "genetics_and_trials",
    iconName: "Database",
    level: "advanced",
    levelLabel: "前沿科研 · 遗传筛查",
    levelColor: "text-indigo-700 border-indigo-300 bg-indigo-50",
    title: "遗传咨询与临床试验招募通道",
    subtitle: "针对伴家族史、BRCA 突变、三阴性或难治性患者的官方探索渠道。",
    links: [
      {
        name: "中国临床试验注册中心 (ChiCTR)",
        url: "https://www.chictr.org.cn",
        description: "国家卫健委官方临床试验注册平台，可按「乳腺癌」「ADC」「三阴性」「靶向」检索正在开展入组的国内前沿临床试验。",
        tip: "若常规药物耐药，可在此查询前沿新药临床招募 (GCP)，获得免费新药治疗机会。",
        lang: "zh",
        free: true
      },
      {
        name: "ClinicalTrials.gov (美国国立卫生研究院 NIH)",
        url: "https://clinicaltrials.gov",
        description: "全球最大临床试验注册数据库，涵盖所有全球跨国多中心乳腺癌临床试验设计方案与终点指标。",
        tip: "可查询全球最新双靶向、三特异性抗体及肿瘤疫苗临床进展。",
        lang: "en",
        free: true
      },
      {
        name: "中国遗传性乳腺癌/卵巢癌 (HBOC) 遗传咨询指南",
        url: "http://www.csco.org.cn",
        description: "面向具有早发乳腺癌 (<45岁)、双侧乳腺癌或卵巢癌家族史群体的 BRCA1/2 筛查与防范指导。",
        tip: "携带致病突变者可指导亲属进行家系基因筛查与风险阻断。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "fertility_and_survivorship",
    iconName: "Newspaper",
    level: "intermediate",
    levelLabel: "全程守护 · 生活品质",
    levelColor: "text-rose-700 border-rose-300 bg-rose-50",
    title: "年轻育龄期生育力保护与淋巴水肿专护",
    subtitle: "关注年轻患者术后生育愿望、更年期管理与患肢水肿阶梯康复。",
    links: [
      {
        name: "中国年轻乳腺癌患者生育保护专家共识",
        url: "https://www.cma.org.cn",
        description: "中华医学会发布的年轻育龄期女性诊疗共识，详述化疗前卵子/胚胎冷冻及促性腺激素释放激素类似物 (GnRHa) 卵巢保护。",
        tip: "有生育愿望的年轻患者必须在「化疗开始前」完成生育力保护咨询！",
        lang: "zh",
        free: true
      },
      {
        name: "国际淋巴学会 (ISL) 淋巴水肿阶梯评估与康复指引",
        url: "https://www.lymphology.org",
        description: "全球淋巴水肿评估与综合消肿治疗 (CDT) 金标准指引，涵盖手法引流、压力绷带、弹力袖套与皮肤护理。",
        tip: "患侧手臂出现沉重发胀时，尽早启动综合消肿治疗可完全逆转初期水肿。",
        lang: "en",
        free: true
      }
    ]
  }
];
