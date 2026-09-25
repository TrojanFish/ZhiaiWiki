import type { ResourceCategoryData } from "./breastResourcesData";

export const COLORECTAL_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 权威通俗",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威结直肠癌指南",
    subtitle: "由国际与国内顶尖学术机构编撰，临床分期、靶向用药与减毒方案的黄金准绳。",
    links: [
      {
        name: "CSCO 结直肠癌诊疗指南（中国临床肿瘤学会 2024）",
        url: "http://www.csco.org.cn",
        description: "中国结直肠肿瘤临床处方金标准，深度结合中国人群特征、国谈医保支付政策及 IDEA 协作组减毒标准。",
        tip: "推荐查看「III期辅助治疗」与「左右半结肠靶向分流」章节，了解标准化疗周期与适应症。",
        lang: "zh",
        free: true
      },
      {
        name: "NCCN 结肠癌 / 直肠癌患者指南（中文完整版）",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/colon-patient.pdf",
        description: "美国国家综合癌症网络官方患者科普指南，以通俗图文详细拆解分期意义、新辅助放疗与保肛决策树。",
        tip: "适合确诊初期的患者及家属通读，建立对全病程管理的清晰认知大图景。",
        lang: "both",
        free: true
      },
      {
        name: "CACA 中国肿瘤整合诊治指南 (结直肠癌篇)",
        url: "http://www.caca.org.cn",
        description: "中国抗癌协会组织编写，强调防-筛-诊-治-康一体化理念，突出结直肠癌微创外科及中西医结合康复策略。",
        tip: "指南内包含详细的术后快速康复 (ERAS) 与饮食过渡指导。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "centers",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "国家级专病中心",
    levelColor: "text-blue-700 border-blue-300 bg-blue-50",
    title: "国内顶尖结直肠肿瘤中心",
    subtitle: "国内年手术量与科研实力位居前列的三甲专科医院与结直肠癌外科团队。",
    links: [
      {
        name: "复旦大学附属肿瘤医院 · 大肠外科 / 结直肠癌 MDT 中心",
        url: "https://www.shca.org.cn",
        description: "国家癌症中心结直肠癌质控标杆，年大肠癌手术量逾万台，率先推广精准低位保肛与肝转移多学科综合切除。",
        tip: "复杂疑难、局部晚期或合并寡转移患者可申请其每周三的全国大肠癌疑难 MDT 会诊。",
        lang: "zh",
        free: true
      },
      {
        name: "中山大学肿瘤防治中心 · 结直肠科",
        url: "https://www.sysucc.org.cn",
        description: "华南肿瘤学国家重点实验室所在地，牵头多项国际顶级 CRC 临床研究，微创腹腔镜/达芬奇机器人手术经验极丰富。",
        tip: "在全程新辅助 (TNT) 治疗直肠癌领域积累了丰厚的科研随访队列。",
        lang: "zh",
        free: true
      },
      {
        name: "中国医学科学院肿瘤医院 · 结直肠外科",
        url: "https://www.cicams.ac.cn",
        description: "国家癌症中心依托单位，长期主编卫健委结直肠癌质控规范，规范化淋巴结清扫与全直肠系膜切除 (TME) 标杆。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "stoma_nutrition",
    iconName: "Wrench",
    level: "intermediate",
    levelLabel: "术后照护 · 居家实用",
    levelColor: "text-amber-700 border-amber-300 bg-amber-50",
    title: "造口护理与居家营养支持",
    subtitle: "国际造口治疗师协会认证指引，预防造口皮肤并发症与术后肠道功能重塑。",
    links: [
      {
        name: "国际造口治疗师协会 (WCET) 官方造口护理指南",
        url: "https://wcetn.org",
        description: "全球造口护理最高学术准则，针对临时性回肠造口水样便防护、造口底盘粘贴技巧及粪水性皮炎预防有详尽图解。",
        tip: "重点学习「造口周围皮肤保护剂与防漏膏」的规范涂抹手法，彻底杜绝渗漏发红。",
        lang: "both",
        free: true
      },
      {
        name: "中国抗癌协会肿瘤营养专业委员会 (CSNO)",
        url: "http://www.csno.org.cn",
        description: "由石汉平教授领衔的权威肿瘤营养组织，提供围手术期低渣饮食、化疗期胃肠道耐受管理与肠内营养剂选配方案。",
        tip: "术后化疗腹泻期切忌高纤维粗粮，应严格遵循「少渣、易吸收、高蛋白」过渡食谱。",
        lang: "zh",
        free: true
      }
    ]
  }
];
