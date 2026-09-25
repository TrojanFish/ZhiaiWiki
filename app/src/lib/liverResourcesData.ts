import type { ResourceCategoryData } from "./breastResourcesData";

export const LIVER_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 患者友好",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威临床指南",
    subtitle: "由国家卫健委与国际顶尖肝病与肿瘤学会出版，指导 CNLC 分期、手术与系统靶免。",
    links: [
      {
        name: "国家卫生健康委《原发性肝癌诊疗指南 (2024年版)》",
        url: "http://www.nhc.gov.cn",
        description: "中国肝癌诊疗国家最高法定标准，详细规范 CNLC 分期体系、HAIC-FO 灌注介入、靶向联合免疫及乙肝抗病毒综合管理。",
        tip: "重点查阅 CNLC 分期对应的规范治疗路径图，防范偏方盲信。",
        lang: "zh",
        free: true
      },
      {
        name: "AASLD 美国肝病研究学会肝细胞癌实践指南",
        url: "https://www.aasld.org",
        description: "国际肝病领域最具影响力的循证指南，详述高危人群半年度超声+AFP 筛查及消融/切除/移植标准。",
        tip: "适合深入了解微创射频消融 (RFA) 与肝移植米兰标准。",
        lang: "en",
        free: true
      },
      {
        name: "CSCO 原发性肝癌诊疗指南",
        url: "http://www.csco.org.cn",
        description: "中国临床肿瘤学会针对中国乙肝背景大肝癌与微血管侵犯 (MVI) 制定的个体化靶免与综合介入指南。",
        tip: "可查阅 ORIENT-32 及 IMbrave150 一线靶免联合推荐级别。",
        lang: "zh",
        free: true
      }
    ]
  },
  {
    id: "hepatitis_monitoring",
    iconName: "Database",
    level: "intermediate",
    levelLabel: "核心安全 · 生死红线",
    levelColor: "text-rose-700 border-rose-300 bg-rose-50",
    title: "乙肝病毒 (HBV) 复制控制与抗病毒监测专区",
    subtitle: "高敏 HBV DNA 动态监控、恩替卡韦/TAF 终身服药规范与防范爆发性肝衰竭指南。",
    links: [
      {
        name: "中华医学会肝病学分会《慢性乙型肝炎防治指南 (2022年版)》",
        url: "http://www.cma.org.cn",
        description: "权威阐释高敏 HBV DNA (<10~20 IU/mL) 控制对于阻断肝纤维化进展和降低肝癌术后复发的决定性价值。",
        tip: "务必牢记：抗癌治疗期间绝不可擅自漏服停用抗病毒药！",
        lang: "zh",
        free: true
      }
    ]
  }
];
