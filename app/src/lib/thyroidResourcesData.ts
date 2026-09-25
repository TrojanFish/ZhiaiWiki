import type { ResourceCategoryData } from "./breastResourcesData";

export const THYROID_RESOURCE_CATEGORIES: ResourceCategoryData[] = [
  {
    id: "guidelines",
    iconName: "Building2",
    level: "beginner",
    levelLabel: "最推荐 · 患者友好",
    levelColor: "text-teal-700 border-teal-300 bg-teal-50",
    title: "权威临床指南",
    subtitle: "由国际与国内顶尖甲状腺与内分泌学术机构出版，结论最具权威，指导规范手术与TSH抑制。",
    links: [
      {
        name: "ATA 美国甲状腺学会成人甲状腺结节与分化型甲状腺癌诊疗指南 (2024年版)",
        url: "https://www.thyroid.org",
        description: "全球甲状腺领域的最高循证圣经，系统阐释超声 C-TIRADS 分级、低危微小癌主动监测、腺叶切除指征与动态复发风险分层。",
        tip: "重点查阅低危分化型甲状腺癌的复发危险度分层与 TSH 抑制目标范围。",
        lang: "both",
        free: true
      },
      {
        name: "CSCO 甲状腺癌诊疗指南（中国临床肿瘤学会）",
        url: "http://www.csco.org.cn",
        description: "紧密契合中国患者发病特征、甲状旁腺纳米碳负显影保护、喉返神经术中监测 (IONM) 及原研靶向新药规范。",
        tip: "适合深入了解中央区规范清扫范围与碘-131 清甲适应证。",
        lang: "zh",
        free: true
      },
      {
        name: "NCCN 甲状腺癌患者指南 (Thyroid Cancer)",
        url: "https://www.nccn.org/patients/guidelines/content/PDF/thyroid-patient.pdf",
        description: "美国国家综合癌症网络出版的患者友好官方指南，全面介绍乳头状癌、滤泡状癌、髓样癌与未分化癌的分型与随访日历。",
        tip: "图文通俗，建议全切术后患者重点阅读「甲状腺球蛋白 Tg 随访雷达」章节。",
        lang: "both",
        free: true
      }
    ]
  },
  {
    id: "medication_ddi",
    iconName: "Wrench",
    level: "intermediate",
    levelLabel: "用药必读 · 吸收质控",
    levelColor: "text-indigo-700 border-indigo-300 bg-indigo-50",
    title: "左甲状腺素 (L-T4) 吸收与药物食物相互作用 (DDI) 专区",
    subtitle: "优甲乐/雷替斯清晨空腹服药黄金法则、钙片铁剂 4 小时隔离红线及漏服科学补服指南。",
    links: [
      {
        name: "《甲状腺癌术后左甲状腺素钠抑制治疗中国专家共识》",
        url: "http://www.cma.org.cn",
        description: "权威阐释 L-T4 吸收对胃酸环境的依赖性，详述碳酸钙、硫酸亚铁、豆浆咖啡等螯合沉淀对 TSH 抑制波动的危害。",
        tip: "严格遵循「晨起空腹清水吞服，至少 30~60 分钟后进食早餐」铁律。",
        lang: "zh",
        free: true
      }
    ]
  }
];
