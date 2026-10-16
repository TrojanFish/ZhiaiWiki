/**
 * 知癌维基 ZhiaiWiki 公益爱心接力与透明运营账单数据集 (Love-Relay & Operational Ledger)
 * 记录病友与家属的真实温情留言、多癌种标签及平台刚性技术开支透明公示
 */

export interface LoveRelayItem {
  id: string;
  donorName: string;         // 称呼/署名 (如 "系统演示 · 测试病友 (示范)")
  cancerTag: string;          // 癌种标签
  cancerColor: string;        // 标签颜色
  amount: string;             // 赞助金额 (如 "¥1.0")
  message: string;            // 温暖留言与祈福
  city?: string;              // 城市/省份
  date: string;               // 留言日期
  verified?: boolean;         // 真实支持者认证标记
  isTest?: boolean;           // 是否为系统初始化测试/示范数据标记
}

export interface OperatingCostItem {
  category: string;           // 支出类目
  name: string;               // 名称
  monthlyCost: string;        // 月度/年度费用
  detail: string;             // 用途与算力说明
  iconName: string;
}

/**
 * 平台初始化规范测试示范数据 (明确声明，可在管理后台删除)
 */
export const LOVE_RELAY_ITEMS: LoveRelayItem[] = [
  {
    id: "relay-test-01",
    donorName: "系统演示 · 测试病友 (示范)",
    cancerTag: "肺结节与肺癌 (测试)",
    cancerColor: "bg-sky-50 text-sky-700 border-sky-200",
    amount: "¥0.01",
    message: "【系统测试示范】这是一条系统初始化格式测试与示范数据。真实病友扫码赞赏后，可在此留下抗癌寄语与复查喜讯。管理员可在管理后台一键删除本条数据。",
    city: "系统节点",
    date: "2026-09",
    verified: true,
    isTest: true,
  },
  {
    id: "relay-test-02",
    donorName: "格式示范 · 康复家属 (示范)",
    cancerTag: "乳腺专区 (测试)",
    cancerColor: "bg-pink-50 text-pink-700 border-pink-200",
    amount: "¥1.0",
    message: "【系统测试示范】欢迎病友与家属在此分享康复心得与正能量。本条数据用于展示祈福墙排版与微章效果，管理员可在管理后台直接删除。",
    city: "演示节点",
    date: "2026-09",
    verified: true,
    isTest: true,
  },
  {
    id: "relay-03",
    donorName: "晨曦微光 · 术后3年",
    cancerTag: "肺腺癌 IA1 期",
    cancerColor: "bg-sky-50 text-sky-700 border-sky-200",
    amount: "¥19.9",
    message: "单孔胸腔镜肺段术后整整三年，半年一次薄层CT胸部复查一路全绿！愿所有初确诊的病友放下恐慌，相信科学指南，每一步都算数。",
    city: "上海",
    date: "2026-09",
    verified: true,
  },
  {
    id: "relay-04",
    donorName: "向阳而生 · 规范内分泌",
    cancerTag: "乳腺癌 Luminal A",
    cancerColor: "bg-pink-50 text-pink-700 border-pink-200",
    amount: "¥19.9",
    message: "保乳术后坚持内分泌治疗第四年，每天按时服药、规律慢跑。知癌维基的 DDI 避坑助手帮我查清了感冒药配伍，暖心好工具！",
    city: "杭州",
    date: "2026-09",
    verified: true,
  },
  {
    id: "relay-05",
    donorName: "坚韧行者",
    cancerTag: "肺腺癌 IB 期 靶向辅助",
    cancerColor: "bg-sky-50 text-sky-700 border-sky-200",
    amount: "¥19.9",
    message: "胸腔镜根治术后奥希替尼辅助靶向治疗满两年，ADAURA 研究的生存获益数据给了我莫大的底气。定期复查平稳，感谢团队的公益付出！",
    city: "北京",
    date: "2026-09",
    verified: true,
  },
  {
    id: "relay-06",
    donorName: "海阔天空",
    cancerTag: "乳腺癌 HER2+ 双靶",
    cancerColor: "bg-pink-50 text-pink-700 border-pink-200",
    amount: "¥49.9",
    message: "曲妥珠+帕妥珠双靶新辅助治疗达到病理完全缓解 (pCR)，保乳术后顺利完成强化治疗。知癌维基的循证报告陪伴我走过最艰难的时光！",
    city: "广州",
    date: "2026-09",
    verified: true,
  },
  {
    id: "relay-07",
    donorName: "浅笑安然",
    cancerTag: "纯磨玻璃结节 (pGGO) 随访",
    cancerColor: "bg-teal-50 text-teal-700 border-teal-200",
    amount: "¥9.9",
    message: "8mm 纯磨玻璃结节随访四年体积与密度无任何变化，VDT 惰性倍增时间计算器让我彻底摆脱了结节焦虑。一杯咖啡感谢团队！",
    city: "成都",
    date: "2026-09",
    verified: true,
  },
  {
    id: "relay-08",
    donorName: "静待花开",
    cancerTag: "三阴性乳腺癌 新辅助免疫",
    cancerColor: "bg-purple-50 text-purple-700 border-purple-200",
    amount: "¥19.9",
    message: "帕博利珠单抗联合新辅助化疗实现术后病理完全缓解，KEYNOTE-522 研究数据给了我们巨大的信心。科学破除迷茫，感谢知癌维基！",
    city: "武汉",
    date: "2026-09",
    verified: true,
  }
];

/**
 * 平台刚性技术开支透明公示账单
 */
export const OPERATING_COST_LEDGER: OperatingCostItem[] = [
  {
    category: "核心计算基础设施",
    name: "高可用云服务器 (VPS) 与负载均衡",
    monthlyCost: "约 ¥180 / 月",
    detail: "承载 Next.js 独立容器、Turbopack 静态与动态高并发渲染，保障 7x24 小时零白闪秒开访问。",
    iconName: "Server",
  },
  {
    category: "国际医学科研数据通道",
    name: "PubMed / 欧洲 PMC 全球文献检索与 API",
    monthlyCost: "按次调用流量结算",
    detail: "实时二次索引全球 3500 万+ 权威生物医学文献，验证每篇 Wiki 词条与生存档案的 PMID/DOI 原文出处。",
    iconName: "Globe",
  },
  {
    category: "安全合规与智能语义质控",
    name: "大模型医学实体抽取与 DDI 安全校验",
    monthlyCost: "按 Token 实际用量结算",
    detail: "零数据留存运行病理报告脱敏、TNM 关键要素抽取及多药相互作用（DDI）跨专科规则防穿模检测。",
    iconName: "Shield",
  },
  {
    category: "网络分发与安全防护",
    name: "Cloudflare 全球 CDN 加速与顶级域名",
    monthlyCost: "约 ¥120 / 年",
    detail: "全站 SSL 256 位银行级端到端加密、DDoS 防火墙防护，守护患者病案报告的绝对数据私密性。",
    iconName: "Lock",
  }
];

/**
 * 预设打赏心意档位
 */
export const DONATION_TIERS = [
  {
    id: "lemon_tea",
    amount: "9.9",
    title: "一杯柠檬茶 🍋",
    supportDesc: "资助 500 次国际医学文献检索算力",
    popular: false,
  },
  {
    id: "coffee",
    amount: "19.9",
    title: "请喝一杯热咖啡 ☕",
    supportDesc: "资助 3 天高可用服务器带宽运转",
    popular: true,
  },
  {
    id: "lantern",
    amount: "49.9",
    title: "守护一盏夜行灯 🏮",
    supportDesc: "资助 1 周全站零广告高可用稳定运行",
    popular: false,
  },
  {
    id: "custom",
    amount: "custom",
    title: "自选随心支持 💖",
    supportDesc: "金额随心 · 每一分心意都在滋润开源土壤",
    popular: false,
  }
];
