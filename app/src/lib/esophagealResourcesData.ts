import type { ResourceCategoryData } from "./breastResourcesData";

export const ESOPHAGEAL_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 患者友好",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威临床指南",
    subtitle: "由国内外权威胸外科与肿瘤学会出版，指导解剖分段、新辅助同步放化疗及微创外科手术。",
    links: [
      {
        name: "CSCO 食管癌诊疗指南（中国临床肿瘤学会）",
        url: "http://www.csco.org.cn",
        description: "中国食管鳞癌诊疗最权威的临床宝典，详述 NEOCRTEC5010 术前新辅助放化疗、胸腹腔镜微创切除及 PD-1 联合一线免疫治疗。",
        tip: "重点查阅新辅助放化疗适应证与双侧喉返神经链淋巴结清扫质控。",
        lang: "zh",
        free: true
      },
      {
        name: "NCCN 食管癌患者指南 (Esophageal Cancer)",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/esophageal-patient.pdf",
        description: "美国国家综合癌症网络出版的患者友好官方指南，全面介绍解剖位置、新辅助治疗、管状胃吻合及吞咽困难护理。",
        tip: "建议阅读术后半卧位睡眠抗反流与渐进式进食指导。",
        lang: "both",
        free: true
      },
      {
        name: "ESTS 欧洲胸外科医师学会指南",
        url: "https://www.ests.org",
        description: "国际顶尖胸外科协会关于微创食管切除术 (MIE) 与气道瘘管并发症防范的专业共识。",
        tip: "适合了解微创外科手术质控红线与围手术期呼吸管理。",
        lang: "en",
        free: true
      }
    ]
  },
  {
    id: "rehab",
    iconName: "BookOpen",
    level: "intermediate",
    levelLabel: "居家康复 · 实用技能",
    levelColor: "text-amber-700 border-amber-300 bg-amber-50",
    title: "胸胃抗反流睡眠与空肠造瘘护理专区",
    subtitle: "针对食管癌术后胃拉入胸腔后的 30°~45° 半卧位睡眠防反流误吸、细嚼慢咽与空肠造瘘泵注指导。",
    links: [
      {
        name: "中国抗癌协会 (CACA) 食管癌围手术期康复与营养指南",
        url: "http://www.caca.org.cn",
        description: "指导管状胃术后如何通过斜坡床垫防范夜间胃酸反流呛咳、空肠造瘘管日常温水冲管与防堵塞要诀。",
        tip: "牢记餐后严禁立即平卧，睡前 2 小时禁食饮水。",
        lang: "zh",
        free: true
      }
    ]
  }
];
