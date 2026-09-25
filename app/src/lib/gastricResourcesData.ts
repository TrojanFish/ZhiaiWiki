import type { ResourceCategoryData } from "./breastResourcesData";

export const GASTRIC_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 患者友好",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威临床指南",
    subtitle: "由国际与国内顶尖消化肿瘤机构出版，结论最具权威，指导精准分期与综合诊疗。",
    links: [
      {
        name: "CSCO 胃癌诊疗指南（中国临床肿瘤学会）",
        url: "http://www.csco.org.cn",
        description: "中国胃癌诊疗的最高临床准则，深度覆盖 ESD 早期保胃切除、D2 规范清扫、SOX/XELOX 辅助化疗及 HER2/Claudin 18.2 靶向用药。",
        tip: "重点查阅 D2 术后病理淋巴结清扫质控与辅助化疗方案推荐。",
        lang: "zh",
        free: true
      },
      {
        name: "JGCA 日本胃癌学会治疗指南（第6版）",
        url: "https://www.jgca.jp",
        description: "全球胃癌手术技术与内镜微创筛查的发源地，其 D2 淋巴结站别分组与内镜 ESD 治愈性切除标准被世界各国奉为圭臬。",
        tip: "推荐查阅胃周淋巴结 1~16 组解剖图谱与 ESD 绝对适应证。",
        lang: "both",
        free: true
      },
      {
        name: "NCCN 胃癌患者指南 (Gastric Cancer)",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/stomach-patient.pdf",
        description: "美国国家综合癌症网络出版的胃癌官方科普指南，详述消化道重建、化疗联合免疫及术后营养调理。",
        tip: "建议阅读术后进食过渡与倾倒综合征防范章节。",
        lang: "both",
        free: true
      }
    ]
  },
  {
    id: "nutrition",
    iconName: "BookOpen",
    level: "intermediate",
    levelLabel: "生活质量 · 康复必备",
    levelColor: "text-indigo-700 border-indigo-300 bg-indigo-50",
    title: "胃切除术后消化与营养支持专区",
    subtitle: "毕I/毕II/Roux-en-Y 术后胃容量改变后的少食多餐、贫血预防与肠道功能适应指南。",
    links: [
      {
        name: "中国抗癌协会 (CACA) 胃癌术后营养管理共识",
        url: "http://www.caca.org.cn",
        description: "详述胃大部切除或全胃切除后维生素 B12 肌肉注射频率、口服铁剂补充及倾倒综合征日常防治技巧。",
        tip: "牢记每日 5~6 餐少量多餐与饭后 20~30 分钟平卧原则。",
        lang: "zh",
        free: true
      },
      {
        name: "ESPEN 欧洲临床营养与代谢学会肿瘤营养指南",
        url: "https://www.espen.org",
        description: "国际权威围手术期肠内肠外营养指南，指导管饲造瘘与早期口服营养补充 (ONS)。",
        tip: "为术后消瘦患者提供标准热量与蛋白质阶梯计算模型。",
        lang: "en",
        free: true
      }
    ]
  }
];
