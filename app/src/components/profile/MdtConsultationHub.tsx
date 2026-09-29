"use client";

import React, { useState, useEffect, useMemo } from "react";
import type { CancerType, PatientProfile } from "@/lib/types";
import {
  Users,
  Stethoscope,
  FileText,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Users2,
  ShieldCheck,
  Plus,
  Trash2,
  Compass,
  FileSpreadsheet,
  HeartHandshake,
} from "lucide-react";

interface MdtConsultationHubProps {
  profile: PatientProfile;
  className?: string;
}

interface SpecialistDept {
  name: string;
  role: string;
  focus: string;
  iconBg: string;
  iconText: string;
}

interface ControversyItem {
  id: string;
  title: string;
  controversy: string;
  options: {
    planA: { label: string; desc: string };
    planB: { label: string; desc: string };
  };
  clinicalConsensus: string;
}

interface DefaultQuestion {
  title: string;
  content: string;
  priority: "high" | "essential" | "followup";
}

export default function MdtConsultationHub({
  profile,
  className = "",
}: MdtConsultationHubProps) {
  const [activeTab, setActiveTab] = useState<"panel" | "readiness" | "crossroads" | "pocket">("crossroads");
  const [copiedAll, setCopiedAll] = useState(false);
  const [customQuestionInput, setCustomQuestionInput] = useState("");
  const [checkedQuestions, setCheckedQuestions] = useState<Record<string, boolean>>({});

  const cancerType: CancerType = (profile?.cancerType || "lung") as CancerType;
  const isBreast = cancerType === "breast";
  const isColon = cancerType === "colon";
  const isRectal = cancerType === "rectal";
  const isColorectal = cancerType === "colorectal" || isColon || isRectal;
  const isGastric = cancerType === "gastric";
  const isLiver = cancerType === "liver";
  const isEsophageal = cancerType === "esophageal";
  const isLung = !isBreast && !isColorectal && !isGastric && !isLiver && !isEsophageal;

  const rawData = useMemo(() => {
    return (profile as any)?.clinicalData || (profile as any)?.cancerSpecificData || (profile as any)?.liverData || (profile as any)?.gastricData || profile || {};
  }, [profile]);

  const currentStage = useMemo(() => {
    return (profile?.stage || rawData?.stage || rawData?.cnlcStage || "待评估").toUpperCase();
  }, [profile, rawData]);

  // 1. MDT 专科专家团队矩阵 (Specialist Panel)
  const specialistPanel: SpecialistDept[] = useMemo(() => {
    if (isEsophageal) {
      return [
        { name: "胸部食管外科", role: "微创根治与质控把关", focus: "评估腔镜 MIE 切除指征、二野/三野清扫范围与 ≥15 枚淋巴结质控达标", iconBg: "bg-purple-100", iconText: "text-purple-600" },
        { name: "胸部肿瘤放疗科", role: "新辅助与同步放化疗", focus: "制定 NEOCRTEC5010 (40Gy) 术前放化疗或颈段食管根治性同步放化疗靶区", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
        { name: "肿瘤消化内科", role: "靶免化疗与术后强化", focus: "一线中国原研 PD-1 联合方案制定，以及 CheckMate-577 术后辅助免疫评估", iconBg: "bg-sky-100", iconText: "text-sky-600" },
        { name: "消化内镜中心", role: "早期保食管与并发症处置", focus: "评估 cT1a 黏膜内癌 ESD 治愈性切除指征，排查气管瘘并指导覆膜支架", iconBg: "bg-teal-100", iconText: "text-teal-600" },
        { name: "胸部影像与核医学科", role: "解剖受侵与分期判定", focus: "评估气管软骨受压、主动脉间隙浸润角度（T4b 筛查）及锁骨上淋巴结", iconBg: "bg-blue-100", iconText: "text-blue-600" },
        { name: "临床营养与康复专科", role: "抗反流与空肠造瘘营养", focus: "规划术后管状胃抗反流半卧位管理、空肠造瘘泵注方案与吻合口保护", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
      ];
    }
    if (isLiver) {
      return [
        { name: "肝胆胰外科", role: "根治性切除与肝移植", focus: "评估 CNLC Ia/Ib 切除可行性、米兰标准移植受体筛选与残肝储备余量", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
        { name: "介入放射科 (TACE/HAIC)", role: "局部栓塞与动脉化疗灌注", focus: "针对门静脉癌栓 (Vp1-V4) 开展 HAIC-FO 持续灌注化疗或 cTACE 转化治疗", iconBg: "bg-amber-100", iconText: "text-amber-600" },
        { name: "肝病感染科", role: "乙肝阻断与终身抗病毒", focus: "高敏 HBV DNA 定量监测，规范恩替卡韦/TAF 防范致死性暴发性肝炎", iconBg: "bg-sky-100", iconText: "text-sky-600" },
        { name: "肿瘤内科 (靶免团队)", role: "系统靶向与免疫联合", focus: "制定 IMbrave150 (T+A) 或 ORIENT-32 (双达) 一线抗血管联合方案", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
        { name: "超声介入消融科", role: "局部微创根治消融", focus: "评估 ≤3cm 孤立性肝癌射频消融 (RFA) 或微波消融 (MWA) 治愈指征", iconBg: "bg-rose-100", iconText: "text-rose-600" },
        { name: "消化内镜中心", role: "门脉高压曲张静脉筛查", focus: "抗 VEGF 靶向治疗前常规筛查食管胃底静脉曲张，排查致死性破裂出血", iconBg: "bg-teal-100", iconText: "text-teal-600" },
      ];
    }
    if (isGastric) {
      return [
        { name: "胃肠外科", role: "D2 根治切除与质控", focus: "实施规范 D2 淋巴结清扫（检出 ≥16 枚）与全胃/远端胃消化道重建", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
        { name: "消化肿瘤内科", role: "围术期 FLOT4 与靶免", focus: "主导局部进展期围术期 FLOT4 方案，制定 HER2 / CLDN18.2 双靶免时序", iconBg: "bg-blue-100", iconText: "text-blue-600" },
        { name: "消化内镜中心", role: "早期微创保胃 (ESD)", focus: "评估 cT1a 黏膜内癌、无溃疡、<2cm 早期病灶 ESD 治愈性切除指征", iconBg: "bg-teal-100", iconText: "text-teal-600" },
        { name: "分子病理诊断中心", role: "靶标伴随诊断与微卫星", focus: "复核 HER2 (IHC/FISH)、Claudin 18.2 阳性比例、dMMR/MSI-H 及 PD-L1 CPS", iconBg: "bg-purple-100", iconText: "text-purple-600" },
        { name: "影像与腹膜转移科", role: "腹膜转移与深层浸润筛查", focus: "CT/MRI 排除腹水与网膜饼，高危进展期患者行诊断性腹腔镜探查 (DL)", iconBg: "bg-amber-100", iconText: "text-amber-600" },
        { name: "临床营养专科", role: "倾倒综合征防范与支持", focus: "指导毕I/毕II/Roux-en-Y 术后阶梯式进食、维生素 B12 补充及早期肠内营养", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
      ];
    }
    if (isRectal) {
      return [
        { name: "结直肠肛门外科", role: "TME 根治与极限保肛", focus: "距肛门距离评估、骨盆空间测量、ISR / Dixon 超低位保肛与造口设计", iconBg: "bg-orange-100", iconText: "text-orange-600" },
        { name: "盆腔放射治疗科", role: "长程/短程放疗与 TNT", focus: "主导 RAPIDO / PRODIGE 23 全程新辅助放化疗靶区勾画，争取最大肿瘤退缩", iconBg: "bg-rose-100", iconText: "text-rose-600" },
        { name: "直肠高分辨 MRI 影像科", role: "环周切缘 (CRM) 与 EMVI", focus: "评估直肠系膜筋膜 (MRF) 安全距离、壁外血管侵犯 (EMVI) 及侧方淋巴结", iconBg: "bg-blue-100", iconText: "text-blue-600" },
        { name: "消化肿瘤内科", role: "全程新辅助与系统化疗", focus: "制定 TNT 强化巩固化疗方案，MSI-H 患者评估一线 PD-1 单抗免化免放", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
        { name: "造口护理与伤口专科", role: "保护性造口与排便康复", focus: "回肠造口防漏护理、造口还纳时机评估及术后 LARS 综合征排便训练", iconBg: "bg-teal-100", iconText: "text-teal-600" },
      ];
    }
    if (isColon) {
      return [
        { name: "结直肠外科", role: "CME 完整结肠系膜切除", focus: "根治性切除结肠原发灶，中央血管高位结扎，保障 ≥12 枚淋巴结检出", iconBg: "bg-emerald-100", iconText: "text-emerald-600" },
        { name: "肝胆外科 / 介入科", role: "结直肠癌肝转移 (CRLM) MDT", focus: "协同评估肝脏寡转移灶一期或二期切除时序，制定局部消融与介入策略", iconBg: "bg-amber-100", iconText: "text-amber-600" },
        { name: "消化肿瘤内科", role: "IDEA 减毒与靶向联合", focus: "指导低危 III 期 3 个月 CAPOX 减毒方案，按左/右半与 RAS 状态选靶向", iconBg: "bg-sky-100", iconText: "text-sky-600" },
        { name: "分子病理中心", role: "全 RAS/BRAF 与 dMMR", focus: "测定 KRAS/NRAS/BRAF 突变及 MSI-H/dMMR，指导西妥昔/贝伐/帕博利珠", iconBg: "bg-purple-100", iconText: "text-purple-600" },
      ];
    }
    if (isBreast) {
      return [
        { name: "乳腺外科", role: "保乳手术与前哨淋巴结", focus: "评估保乳切缘安全距离、前哨淋巴结活检 (SLNB) 避免全腋窝清扫水肿", iconBg: "bg-pink-100", iconText: "text-pink-600" },
        { name: "乳腺肿瘤内科", role: "系统分型靶免与内分泌", focus: "HR+ 强化内分泌(CDK4/6)、HER2+ 双靶(HP)/ADC、TNBC 免疫联合化疗", iconBg: "bg-rose-100", iconText: "text-rose-600" },
        { name: "放疗科", role: "保乳术后全乳与胸壁放疗", focus: "保乳术后常规辅助放疗规划，腋窝阳性患者锁骨上淋巴结引流区照射", iconBg: "bg-purple-100", iconText: "text-purple-600" },
        { name: "乳腺病理中心", role: "受体定量与 21 基因检测", focus: "复核 ER/PR 百分比、HER2 (IHC/FISH)、Ki-67 指数与多基因复发风险评分", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
        { name: "淋巴水肿与形体康复", role: "患肢功能锻炼与塑形", focus: "指导术后肩关节爬墙训练、压力袖套佩戴，早筛早防患侧上肢淋巴水肿", iconBg: "bg-teal-100", iconText: "text-teal-600" },
      ];
    }
    // Default: Lung Cancer
    return [
      { name: "胸外科", role: "微创亚肺叶/肺叶切除", focus: "胸腔镜单孔微创保肺切除、切缘安全距离与系统性纵隔淋巴结清扫", iconBg: "bg-sky-100", iconText: "text-sky-600" },
      { name: "呼吸与危重症医学科", role: "气道评估与术后肺康复", focus: "术前通气功能测定 (FEV1/DLCO)、气道廓清与肺功能锻炼阶梯指引", iconBg: "bg-teal-100", iconText: "text-teal-600" },
      { name: "胸部肿瘤内科", role: "靶向驱动基因与免疫", focus: "指导三代 EGFR-TKI (奥希替尼) 术后辅助与晚期一线靶向/免疫联合", iconBg: "bg-indigo-100", iconText: "text-indigo-600" },
      { name: "胸部影像与 PET-CT 科", role: "薄层 CT 病灶浸润与随访", focus: "纯磨玻璃 (pGGO) 与混杂磨玻璃 (mGGO) 微观浸润与实性演变比对", iconBg: "bg-blue-100", iconText: "text-blue-600" },
      { name: "病理诊断与基因中心", role: "浸润高危征象与突变丰度", focus: "病理复核 STAS（气腔播散）、VPI（胸膜侵犯）、脉管癌栓与二代测序 NGS", iconBg: "bg-purple-100", iconText: "text-purple-600" },
      { name: "胸部放疗科", role: "立体定向 SBRT 根治", focus: "心肺功能极差无法耐受全麻手术患者的立体定向消融放疗 (SBRT)", iconBg: "bg-amber-100", iconText: "text-amber-600" },
    ];
  }, [cancerType, isEsophageal, isLiver, isGastric, isRectal, isColon, isBreast]);

  // 2. MDT 会诊资料齐备度智能核查 (Readiness Score & Checklist)
  const readinessAudit = useMemo(() => {
    const checks: Array<{ id: string; label: string; ready: boolean; hint: string }> = [];

    // Check 1: 原始影像资料
    const hasImaging = Boolean(profile.tStage || (profile as any).noduleSize || rawData.maxTumorSize || rawData.tumorDepth);
    checks.push({
      id: "dicom_scan",
      label: "原始薄层 CT / MRI / 消化内镜 DICOM 影像",
      ready: hasImaging,
      hint: hasImaging ? "已录入病灶影像特征数据" : "强烈建议携带原始 DICOM 光盘或高清影像二维码，供会诊专家二次读片",
    });

    // Check 2: 病理大报告与免疫组化白片
    const hasPathology = Boolean(profile.histology || rawData.differentiation || rawData.laurenType || rawData.subsite || rawData.biRads);
    checks.push({
      id: "pathology_report",
      label: "术后大病理 / 穿刺活检切片与免疫组化 (IHC) 报告",
      ready: hasPathology,
      hint: hasPathology ? "病理类型与分化指标已存档" : "跨院 MDT 常需借出病理白片 (10-15张) 至会诊医院病理科复核会诊",
    });

    // Check 3: 驱动基因测序与生物标志物
    const hasBiomarkers = Boolean(
      (profile.geneMutations && profile.geneMutations.length > 0) ||
      profile.egfr === "positive" ||
      rawData.pdl1Cps != null ||
      rawData.claudin182Status ||
      rawData.her2Status ||
      rawData.krasMutation ||
      rawData.msiStatus
    );
    checks.push({
      id: "molecular_biomarkers",
      label: "驱动基因突变检测 (NGS) 或核心蛋白靶点 (PD-L1/HER2/CLDN18.2)",
      ready: hasBiomarkers,
      hint: hasBiomarkers ? "关键分子标志物已配置" : "若未检测靶点，会诊专家将无法针对性给出靶向/免疫一线精准处方",
    });

    // Check 4: 器官储备与全身评估 (心肺功能、肝肾功能储备、感染指标)
    const hasReserve = Boolean(
      rawData.childPughScore != null ||
      rawData.childPughClass ||
      (profile as any).smokingHistory ||
      rawData.hbvDnaLoad ||
      rawData.nutritionRoute ||
      rawData.lymphNodesExamined != null
    );
    checks.push({
      id: "organ_reserve",
      label: "心肺肝肾重要器官储备功能与感染排查",
      ready: hasReserve,
      hint: hasReserve ? "器官耐受性指标已同步" : "涉及重大手术、大剂量化疗或肝脏介入，必须提供近期肝功能、凝血、心电图及肺功能报告",
    });

    const readyCount = checks.filter((c) => c.ready).length;
    const score = Math.round((readyCount / checks.length) * 100);

    return {
      checks,
      score,
      readyCount,
      totalCount: checks.length,
    };
  }, [profile, rawData]);

  // 3. MDT 核心争议决策树与研讨十字路口 (Controversies & Crossroads)
  const controversies: ControversyItem[] = useMemo(() => {
    if (isEsophageal) {
      return [
        {
          id: "escc_neoadjuvant_vs_upfront",
          title: "局部进展期：术前新辅助同步放化疗 (NEOCRTEC5010) vs 直接微创手术",
          controversy: "cT1-4N1-3 或 cT3-4N0 食管鳞癌是否应当优先新辅助？单纯切除复发率高，但放化疗有一定组织水肿与围术期并发症风险。",
          options: {
            planA: { label: "方案 A · 术前 NEOCRTEC5010 新辅助放化疗", desc: "长春瑞滨+顺铂联合 40Gy 放疗，pCR 率 43.2%，中位 OS 突破 100.1 个月（1级证据推荐）" },
            planB: { label: "方案 B · 直接行胸腹腔镜联合微创切除 (MIE)", desc: "仅适合 cT1b-T2N0 极早期、心肺功能极佳且拒绝放疗的严格筛选患者" },
          },
          clinicalConsensus: "CSCO 2024 与 NCCN 最高级别共识：只要无气管食管瘘 (TEF) 穿孔风险且心肺耐受，局部进展期 ESCC 首选新辅助放化疗！术后未达 pCR 者序贯 1 年纳武利尤单抗 (CheckMate-577)。",
        },
        {
          id: "escc_lymphadenectomy_qc",
          title: "清扫范围与质控：二野 (胸腹) vs 三野 (颈胸腹) 清扫与 ≥15 枚淋巴结红线",
          controversy: "三野清扫可彻底清扫双侧喉返神经旁与锁骨上淋巴结，但喉返神经麻痹与吻合口瘘概率增加；二野清扫更微创，但高位转移可能漏网。",
          options: {
            planA: { label: "二野淋巴结清扫 (胸腹两野)", desc: "适用于胸中下段、无高位颈部淋巴结肿大者，必须确保检出 ≥15 枚淋巴结" },
            planB: { label: "三野淋巴结清扫 (颈胸腹三野)", desc: "适用于胸上段病灶、或触及/可疑颈段喉返神经链转移者，追求纵向彻底根治" },
          },
          clinicalConsensus: "无论二野或三野，CSCO 与 AJCC 均明确要求清扫总枚数必须 ≥15 枚，以消除假性病理分期低估。",
        },
        {
          id: "escc_tef_aorta_danger",
          title: "生命红线排查：气管隆突受压 (TEF风险) 或降主动脉受侵的大出血与穿孔抢救",
          controversy: "T4b 肿瘤包绕大血管或压迫气管时，绝对禁忌盲目放疗或使用抗血管靶向药，否则肿瘤坏死可导致气管穿孔或主动脉破裂致死。",
          options: {
            planA: { label: "强化穿孔抢救与覆膜食管支架预置", desc: "存在饮水呛咳疑诊瘘管者，立即行气管镜与食管碘油造影，优先覆膜支架封堵" },
            planB: { label: "系统化疗联合 PD-1 缓和降期", desc: "避免直接超高剂量放疗引起急性坏死穿孔，在密切监护下平稳控制肿瘤负荷" },
          },
          clinicalConsensus: "MDT 胸外科、介入科、血管外科联合红线：凡伴明显主动脉或气管侵犯者，不可盲目追求手术切除，首选多学科转化与微创封堵保命。",
        },
      ];
    }
    if (isLiver) {
      return [
        {
          id: "liver_curative_vs_conversion",
          title: "门静脉癌栓与多发病灶：直接手术切除 vs 局部 HAIC-FO 靶免降期转化",
          controversy: "CNLC IIb/IIIa 期（伴门脉主干或分支癌栓、多发病灶）患者直接手术往往快速复发，而靶免联合 HAIC-FO 能否争取到根治切除机会？",
          options: {
            planA: { label: "方案 A · 经肝动脉持续灌注化疗 (HAIC-FO) + 靶免", desc: "高浓度奥沙利铂+5-FU局部杀灭癌栓，联合 PD-1+抗VEGF，转化率达 40%~55%" },
            planB: { label: "方案 B · 扩大切除联合术中取栓或 TACE 序贯", desc: "仅在癌栓局限于门脉二级分支且对侧健康肝体积足够时谨慎开展" },
          },
          clinicalConsensus: "国家卫健委 CNLC 2024 推荐：伴血管侵犯的局部晚期肝癌首选 HAIC 联合系统靶免开展“双药/三药转化”，待癌栓萎缩降期后再行根治性切除！",
        },
        {
          id: "liver_child_pugh_albi_cutoff",
          title: "肝功能储备双轴裁决：Child-Pugh 评分 vs ALBI 连续数学模型",
          controversy: "部分患者表面上是 Child-Pugh A 级，但 ALBI 已进入 2 级甚至 3 级（深层肝微循环受损），大范围切除后极易发生致死性术后肝衰竭 (PHLF)。",
          options: {
            planA: { label: "严格遵循 ALBI 1 级 (≤ -2.60) 根治标准", desc: "术后代偿功能极佳，发生肝衰竭概率 <5%，适合实施解剖性大范围切除" },
            planB: { label: "ALBI 2/3 级采取局部消融 (RFA) 或保护性 TACE", desc: "保住宝贵的正常肝实质，避免大手术摧毁剩余代偿功能" },
          },
          clinicalConsensus: "MDT 外科与肝病内科一致原则：宁可肿瘤局部多次介入消融，绝不让患者死于不可逆急性术后肝衰竭。",
        },
      ];
    }
    if (isGastric) {
      return [
        {
          id: "gastric_esd_vs_surgery",
          title: "极早期胃癌：内镜黏膜下剥离术 (ESD) 纯微创保胃 vs 外科胃大部切除",
          controversy: "cT1a 黏膜内癌是否必须切除大半个胃？ESD 能否在完全不破坏消化道完整性的前提下达到肿瘤学根治？",
          options: {
            planA: { label: "方案 A · 内镜 ESD 绝对/扩大适应证切除", desc: "黏膜内 (cT1a)、无溃疡、直径无论大小或分化型，完全保留胃容积与幽门功能" },
            planB: { label: "方案 B · 腹腔镜远端胃或全胃根治术 (D2 清扫)", desc: "伴黏膜下浸润 (cT1b) 或未分化印戒细胞癌高淋巴结转移风险时的规范底线" },
          },
          clinicalConsensus: "CSCO 早期胃癌指南：病理证实为整块治愈性切除 (eCuraA) 者，5 年生存率 >99%，无需追加任何外科扩大切除与术后化疗！",
        },
        {
          id: "gastric_flot4_perioperative",
          title: "局部进展期 (cT2-4 或 N+)：围手术期 FLOT4 方案 vs 直接手术切除",
          controversy: "直接开刀能快速切除原发灶，但术后复发率高达 50% 以上；围手术期 FLOT4 方案（术前4周期+术后4周期）病理完全缓解率达 16%，中位 OS 延长至 50 个月。",
          options: {
            planA: { label: "方案 A · 围手术期 FLOT4 标准方案", desc: "术前 4 周期多西他赛+奥沙利铂+亚叶酸钙+5-FU 降期缩瘤，术后再序贯 4 周期" },
            planB: { label: "方案 B · 术前直接手术 + 术后口服 SOX / XELOX", desc: "适用于急性穿孔/梗阻无法耐受强化化疗，或高龄基础病复杂的患者" },
          },
          clinicalConsensus: "国际 FLOT4 试验与 CSCO 指南：只要患者 PS 评分 0~1 且身体耐受，围手术期 FLOT 是局部进展期腺癌的全球最高级别金标准。",
        },
      ];
    }
    if (isRectal) {
      return [
        {
          id: "rectal_tnt_watch_and_wait",
          title: "超低位保肛极限抉择：全程新辅助 (TNT) 后 cCR 采纳 Watch & Wait 保留器官",
          controversy: "距肛门 <5cm 的局部进展期直肠癌，传统手术面临永久性结肠造口（切除肛门 Miles 手术）。经 TNT 强化放化疗后若肿瘤在肠镜和 MRI 上完全消失 (cCR)，能否不切肛门？",
          options: {
            planA: { label: "方案 A · 观察等待 (Watch & Wait) 器官保留", desc: "达到临床完全缓解 (cCR) 后免除开刀，每 3 个月严密复查直肠 MRI 与肠镜" },
            planB: { label: "方案 B · 规范 TME 根治术 (ISR 超低位保肛或保护性造口)", desc: "对未达到 cCR 或复发高危者行经肛超低位吻合，保留真实排便通路" },
          },
          clinicalConsensus: "国际 OnCoRe 与 OPRA 研究证实：严格评估达到 cCR 的患者采纳 Watch & Wait，5 年保肛成功率超 70%，且远处转移率与直接手术相当！",
        },
      ];
    }
    if (isColon) {
      return [
        {
          id: "colon_idea_short_course",
          title: "III 期结肠癌减毒革命：IDEA 协作组 3 个月 CAPOX vs 传统 6 个月化疗",
          controversy: "传统 6 个月含奥沙利铂化疗会导致严重不可逆手脚麻木外周神经毒性。3 个月方案能否在保障同样无病生存期 (DFS) 的前提下大幅减轻神经毒性？",
          options: {
            planA: { label: "方案 A · 3 个月 CAPOX (卡培他滨+奥沙利铂)", desc: "适用于低危组 (T1-3 N1)，3 年 DFS 97.4% 与 6 个月无差异，外周神经毒性降低 70%" },
            planB: { label: "方案 B · 6 个月 FOLFOX / CAPOX 强化治疗", desc: "适用于高危组 (T4 或 N2)，必须强化全身化疗周期控制远隔微转移" },
          },
          clinicalConsensus: "IDEA 全球里程碑共识：精准区隔 T1-3N1 低危与 T4/N2 高危，严禁所有患者无差别接受 6 个月过量神经毒性化疗！",
        },
      ];
    }
    if (isBreast) {
      return [
        {
          id: "breast_chemo_sparing_21gene",
          title: "HR+ 早期乳腺癌免化疗决策：21 基因复发风险评分 (Oncotype DX) 的分流",
          controversy: "雌激素受体强阳性、淋巴结阴性的患者，病理科常因 Ki-67 稍高推荐术后化疗。多基因评分能否安全指导免除化疗？",
          options: {
            planA: { label: "方案 A · 单纯强化内分泌治疗 (免除化疗)", desc: "21 基因评分 <25 或绝经后患者，单纯口服他莫昔芬/芳香化酶抑制剂 5 年生存率超 98%" },
            planB: { label: "方案 B · 辅助化疗序贯内分泌 + CDK4/6 抑制剂", desc: "21 基因评分 ≥26 或淋巴结转移 ≥4 枚高危患者，化疗联合靶向可降低 30% 复发风险" },
          },
          clinicalConsensus: "TAILORx 全球里程碑证实：70% 以上的 HR+ 早期患者可安全免除化疗毒性，绝不可仅凭年龄盲目全面上化疗！",
        },
      ];
    }
    // Default: Lung Cancer
    return [
      {
        id: "lung_sublobar_vs_lobectomy",
        title: "早期磨玻璃结节 (GGO)：微创亚肺叶切除 (肺段/楔形) vs 标准肺叶切除",
        controversy: "直径 ≤2cm、CTR ≤0.5 的早期肺癌，传统必须切除整个肺叶；JCOG0802 与 CALGB140503 证实亚肺叶切除可最大程度保留通气功能且 5 年生存率更高。",
        options: {
          planA: { label: "方案 A · 胸腔镜精准解剖性肺段切除", desc: "保留 70% 正常肺通气功能，5 年总生存率达 94.3%（优于全肺叶切除）" },
          planB: { label: "方案 B · 标准肺叶切除 + 系统纵隔清扫", desc: "适用于实性成分为主 (CTR >0.5) 或伴脉管侵犯/STAS 高危浸润性病灶" },
        },
        clinicalConsensus: "国际前瞻 RCT 金标准：≤2cm 外周型微浸润病灶首选肺段或楔形切除，前提是必须保证切缘距离 ≥2cm 或 ≥ 肿瘤最大径。",
      },
      {
        id: "lung_adjuvant_target_vs_chemo",
        title: "EGFR 突变阳性术后：第三代靶向药物辅助 (ADAURA 方案) vs 辅助化疗",
        controversy: "IB-IIIA 期术后伴 EGFR 敏感突变患者，是选择传统的 4 周期含铂化疗，还是口服 3 年奥希替尼靶向维持？",
        options: {
          planA: { label: "方案 A · 奥希替尼口服 3 年 (ADAURA 方案)", desc: "降低 80% 以上脑转移与复发风险，中位无病生存显著超越传统化疗" },
          planB: { label: "方案 B · 4 周期培美曲塞+顺铂辅助化疗", desc: "适合无敏感突变或拒绝长期口服靶向药物的特定患者" },
        },
        clinicalConsensus: "ADAURA 临床 III 期研究证实：EGFR 阳性 II-IIIA 期术后使用奥希替尼辅助治疗，5 年总生存率跃升至 88%，成为国家医保与指南最高级别推荐。",
      },
    ];
  }, [isEsophageal, isLiver, isGastric, isRectal, isColon, isBreast]);

  // 4. MDT 门诊 15 分钟就诊问答口袋卡 (Consultation Pocket Card)
  const defaultQuestions: DefaultQuestion[] = useMemo(() => {
    if (isEsophageal) {
      return [
        { title: "解剖段位与术前新辅助", content: "请问我的肿瘤位于食管哪个解剖段（颈段/胸上/中/下段）？是否推荐按照 NEOCRTEC5010 方案在开刀前先行 40Gy 放化疗来缩瘤保命？", priority: "essential" },
        { title: "气管瘘 (TEF) 与大出血排查", content: "增强 CT 与内镜下肿瘤是否压迫气管隆突或包绕降主动脉？放疗期间出现饮水呛咳如何第一时间排查穿孔与放置覆膜支架？", priority: "high" },
        { title: "外科质控与 ≥15 枚淋巴结", content: "术后病理报告检出淋巴结总数是否达到了 CSCO/AJCC 规定的 ≥15 枚质控红线？双侧喉返神经旁淋巴结是否有跳跃转移？", priority: "high" },
        { title: "空肠造瘘与半卧位防反流", content: "术中预置的空肠造瘘管营养液日常如何加温滴注？管状胃重建术后如何通过 30°~45° 半卧位睡眠防范夜间胃酸反流呛咳误吸？", priority: "followup" },
      ];
    }
    if (isLiver) {
      return [
        { title: "CNLC 2024 分期与转化手术指征", content: "请教医生我的肝癌按国家卫健委 CNLC 属于哪一期？如果合并门脉分支癌栓，能否通过 HAIC-FO 灌注化疗联合靶免逆转为根治手术？", priority: "essential" },
        { title: "Child-Pugh 与 ALBI 肝功能余量", content: "我的 Child-Pugh 得分与 ALBI 分级是多少？如果实施大范围肝叶切除或多次介入栓塞，发生急性术后肝衰竭 (PHLF) 的风险多高？", priority: "high" },
        { title: "高敏乙肝病毒与终身抗病毒", content: "我的高敏乙肝病毒 DNA 定量控制在多少 IU/mL？在靶免或化疗期间是否必须终身服用恩替卡韦或 TAF 预防致死性暴发性重症肝炎？", priority: "essential" },
        { title: "胃镜排查静脉曲张与靶免用药安全", content: "在使用阿替利珠+贝伐珠单抗等抗血管生成药前，是否已做胃镜确认无重度食管胃底静脉曲张？如何预防致命性消化道大出血？", priority: "high" },
      ];
    }
    if (isGastric) {
      return [
        { title: "ESD 保胃指征与切缘病理", content: "病灶浸润深度是否完全局限于黏膜内 (cT1a)？是否达到内镜黏膜下剥离术 (ESD) 治愈性切除标准而免除外科开腹大切胃？", priority: "essential" },
        { title: "围手术期 FLOT4 方案评估", content: "如果是局部进展期胃腺癌，是否应当在开刀前先接受 4 周期 FLOT 强化化疗以达到病理完全缓解 (pCR) 再行微创根治术？", priority: "high" },
        { title: "D2 淋巴结清扫 ≥16 枚核对", content: "外科大病理检出的区域淋巴结总数是否达到了 ≥16 枚质控标准？是否存在因清扫枚数偏少导致的假性分期低估？", priority: "high" },
        { title: "Claudin 18.2 / HER2 靶向配型", content: "组织免疫组化是否已经测定 Claudin 18.2 与 HER2 表达？如果出现远处转移或复发，能否匹配佐妥昔单抗或曲妥珠单抗靶向治疗？", priority: "followup" },
      ];
    }
    if (isRectal) {
      return [
        { title: "骨盆高分辨 MRI 与保肛评估", content: "根据骨盆薄层 HR-MRI，肿瘤距肛缘具体多少厘米？是否累及环周切缘 (CRM) 与壁外血管 (EMVI)？超低位保肛 (ISR) 概率多大？", priority: "essential" },
        { title: "全程新辅助 (TNT) 与 Watch & Wait", content: "是否推荐 RAPIDO 全程新辅助放化疗？如果放化疗结束后肠镜与核磁证实肿瘤完全消失 (cCR)，能否采取观察等待免除切除肛门？", priority: "high" },
        { title: "保护性造口防漏与还纳规划", content: "如果做低位保肛，是否需要做临时回肠造口保护吻合口？造口日常如何防渗漏发红？术后几个月可以评估还纳手术？", priority: "followup" },
        { title: "控便排便功能与 LARS 综合征", content: "保肛术后如果出现大便次数多、急迫失禁等低位前切除综合征 (LARS)，易蒙停止泻药与盆底肌提肛锻炼如何规范进行？", priority: "followup" },
      ];
    }
    if (isColon) {
      return [
        { title: "IDEA 3 个月减毒方案抉择", content: "结合我的病理分期（如 T1-3N1 低危组），推荐 3 个月 CAPOX 减毒方案还是 6 个月方案？如何最大程度防范奥沙利铂不可逆手脚麻木？", priority: "essential" },
        { title: "左右半结肠与靶向配型", content: "我的原发灶在左半结肠还是右半结肠？结合全 RAS/BRAF 与微卫星 (MSI) 状态，若需靶向是首选西妥昔单抗还是贝伐珠单抗？", priority: "high" },
        { title: "CME 手术与 ≥12 枚清扫核验", content: "大病理检出的淋巴结总数是否达到了结肠癌规定的 ≥12 枚质控红线？切除边缘与血管根部结扎是否彻底？", priority: "high" },
        { title: "肝转移排查与预防", content: "术后血清 CEA 标志物与全腹增强 CT 复查时间节点如何规划？如何第一时间预防或筛查结直肠癌肝转移 (CRLM)？", priority: "followup" },
      ];
    }
    if (isBreast) {
      return [
        { title: "21 基因评分与免化疗可能", content: "作为激素受体阳性 (HR+) 患者，是否推荐进行 21 基因或 70 基因复发风险测定，评估免除全身毒性化疗的安全概率？", priority: "essential" },
        { title: "保乳微创与放疗时序", content: "我的肿瘤大小与乳腺容积比是否支持保乳手术？保乳术后全乳腺调强放疗 (IMRT) 推荐在术后第几周启动？", priority: "high" },
        { title: "HER2 / CDK4/6 靶向联合", content: "免疫组化与 FISH 确定的 HER2 状态如何？若为中高危，术后是否推荐加用 CDK4/6 抑制剂（阿贝西利）或吡咯替尼辅助强化？", priority: "high" },
        { title: "患侧上肢水肿与康复锻炼", content: "前哨淋巴结活检是否完全替代了腋窝清扫？术后如何通过阶梯式爬墙训练与压力套早预防不可逆患侧上肢淋巴水肿？", priority: "followup" },
      ];
    }
    // Default: Lung
    return [
      { title: "亚肺叶切除与保留肺功能", content: "根据薄层 CT 的磨玻璃成分占比 (CTR)，是否达到 JCOG0802/CALGB140503 标准支持微创肺段或楔形切除，最大程度保留肺通气功能？", priority: "essential" },
      { title: "病理 STAS 与微浸润高危征象", content: "大病理报告是否详细排查了气腔播散 (STAS)、胸膜侵犯 (VPI) 或微血管癌栓？如果存在高危因素，术后是否需要追加辅助治疗？", priority: "high" },
      { title: "EGFR 驱动基因与靶向辅助", content: "基因检测确定的突变亚型（如 19del 或 L858R）丰度如何？是否符合 ADAURA 方案口服第三代靶向药物（奥希替尼）辅助降复发？", priority: "high" },
      { title: "复查随访与薄层 CT 时间节点", content: "第一次胸部薄层 CT 推荐在术后第几个月复查？随访期间若出现微小病灶变化，薄层 CT 随访节点与征象如何科学比对？", priority: "followup" },
    ];
  }, [isEsophageal, isLiver, isGastric, isRectal, isColon, isBreast]);

  // 从 localStorage 恢复自定义问题
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`oncopath_mdt_custom_q_${cancerType}`);
      if (saved) {
        setCustomQuestions(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load custom questions", e);
    }
  }, [cancerType]);

  const handleAddCustomQuestion = () => {
    if (!customQuestionInput.trim()) return;
    const next = [...customQuestions, customQuestionInput.trim()];
    setCustomQuestions(next);
    setCustomQuestionInput("");
    try {
      localStorage.setItem(`oncopath_mdt_custom_q_${cancerType}`, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save custom questions", e);
    }
  };

  const handleRemoveCustomQuestion = (idx: number) => {
    const next = customQuestions.filter((_, i) => i !== idx);
    setCustomQuestions(next);
    try {
      localStorage.setItem(`oncopath_mdt_custom_q_${cancerType}`, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to update custom questions", e);
    }
  };

  const handleToggleCheck = (key: string) => {
    setCheckedQuestions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCopyAllQuestions = () => {
    const lines: string[] = [
      `【知癌维基 多学科 MDT 问诊口袋清单 · ${(profile as any)?.name || "患者"}（${cancerType.toUpperCase()} ${currentStage}）】`,
      "────────────── 核心专家必问清单 ──────────────",
    ];
    defaultQuestions.forEach((q, idx) => {
      const checked = checkedQuestions[`default_${idx}`] ? "☑" : "☐";
      lines.push(`${checked} ${idx + 1}. [${q.title}] ${q.content}`);
    });

    if (customQuestions.length > 0) {
      lines.push("────────────── 个人重点关切提问 ──────────────");
      customQuestions.forEach((q, idx) => {
        const checked = checkedQuestions[`custom_${idx}`] ? "☑" : "☐";
        lines.push(`${checked} 自选 ${idx + 1}: ${q}`);
      });
    }

    lines.push("");
    lines.push("※ 提示：就诊时请携带原始影像 DICOM 光盘与病理切片白片，供 MDT 会诊专家二次阅片审定。");

    navigator.clipboard.writeText(lines.join("\n"));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden mb-6 ${className}`}>
      {/* 顶部质感渐变标题条 */}
      <div className="bg-linear-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/40 flex items-center justify-center shrink-0 shadow-xs">
              <Users className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <span>多学科联合会诊 (MDT) 决策协同支持</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 inline-flex items-center gap-1">
                    <Users2 className="w-2.5 h-2.5 text-indigo-300" />
                    专家联席研判
                  </span>
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                汇聚外科、内科、放疗、介入、病理与影像跨学科共识 · 告别单科就诊局限，掌握最关键会诊主权
              </p>
            </div>
          </div>

          {/* 准备度微型胶囊 */}
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/15 self-start sm:self-auto text-xs shrink-0">
            <span className="text-slate-300 font-medium">会诊准备度:</span>
            <span className="font-extrabold text-emerald-300 tabular-nums">
              {readinessAudit.score}%
            </span>
            <span className="text-white/40">|</span>
            <span className="text-slate-200 text-[11px]">
              {readinessAudit.readyCount}/{readinessAudit.totalCount} 资料齐备
            </span>
          </div>
        </div>

        {/* 4 维情景导航 Tab */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-white/10 overflow-x-auto pb-1 text-xs no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab("crossroads")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "crossroads"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>核心分歧决策树 ({controversies.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pocket")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "pocket"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>专家门诊问诊清单</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("panel")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "panel"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>会诊专家阵容 ({specialistPanel.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("readiness")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "readiness"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>资料齐备度自查</span>
          </button>
        </div>
      </div>

      {/* 选项卡内容区 */}
      <div className="p-4 sm:p-6">
        {/* TAB 1: 核心分歧决策树与十字路口 */}
        {activeTab === "crossroads" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-indigo-50/70 border border-indigo-200/70 flex items-start gap-3">
              <Compass className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-700 leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-0.5">
                  为什么需要多学科 MDT 会诊？
                </strong>
                单个科室医生看诊容易受本专业局限（外科偏好直接开刀、内科偏好直接化疗、放疗科偏好直接照射）。MDT 会诊汇聚各科专家，针对您当前的病程阶段，集体研讨以下最核心的<strong>争论十字路口</strong>，为您权衡最佳获益方案：
              </div>
            </div>

            <div className="space-y-4">
              {controversies.map((item, idx) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 transition-all hover:border-slate-300:border-slate-700"
                >
                  <div className="flex items-start gap-2.5 mb-2.5">
                    <span className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        <strong>专家争议点：</strong>{item.controversy}
                      </p>
                    </div>
                  </div>

                  {/* 对立方案对比卡 */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-3">
                    <div className="p-3 rounded-lg bg-white border border-slate-200/90 text-xs">
                      <div className="font-bold text-sky-700 flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                        {item.options.planA.label}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.options.planA.desc}
                      </p>
                    </div>

                    <div className="p-3 rounded-lg bg-white border border-slate-200/90 text-xs">
                      <div className="font-bold text-purple-700 flex items-center gap-1.5 mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                        {item.options.planB.label}
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {item.options.planB.desc}
                      </p>
                    </div>
                  </div>

                  {/* 权威指南共识总结 */}
                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200/60 text-[11px] text-emerald-800 flex items-start gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>MDT 循证共识导向：</strong>{item.clinicalConsensus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: 专家门诊问诊清单 (可勾选、可新增、可一键复制) */}
        {activeTab === "pocket" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2 border-b border-slate-100">
              <div className="text-xs text-slate-500">
                专为三甲医院主治专家门诊定制 · 点击左侧勾选框标记已询问事项
              </div>
              <button
                type="button"
                onClick={handleCopyAllQuestions}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer self-start sm:self-auto"
              >
                {copiedAll ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-300" />
                    <span>已复制整套问诊清单！</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>一键复制全套问诊清单</span>
                  </>
                )}
              </button>
            </div>

            {/* 默认专家核心问题列表 */}
            <div className="space-y-2.5">
              {defaultQuestions.map((q, idx) => {
                const key = `default_${idx}`;
                const isChecked = Boolean(checkedQuestions[key]);
                return (
                  <div
                    key={idx}
                    onClick={() => handleToggleCheck(key)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? "bg-slate-50 border-slate-200 opacity-60"
                        : "bg-white border-slate-200/90 hover:border-indigo-300:border-indigo-700 shadow-2xs"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {q.title}
                        </span>
                        {q.priority === "essential" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-50 text-rose-600 font-extrabold border border-rose-200">
                            门诊必问
                          </span>
                        )}
                        {q.priority === "high" && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-700 font-bold border border-amber-200">
                            重点核对
                          </span>
                        )}
                      </div>
                      <p className={`text-xs mt-1 leading-relaxed ${isChecked ? "line-through text-slate-400" : "text-slate-600"}`}>
                        “{q.content}”
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 用户自定义提问列表 */}
            {customQuestions.length > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-700">
                  我的个人备忘与私密提问 ({customQuestions.length})
                </h5>
                {customQuestions.map((q, idx) => {
                  const key = `custom_${idx}`;
                  const isChecked = Boolean(checkedQuestions[key]);
                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/60 flex items-start gap-3"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => handleToggleCheck(key)}
                        className="mt-0.5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs ${isChecked ? "line-through text-slate-400" : "text-slate-800"}`}>
                          {q}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCustomQuestion(idx)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1 cursor-pointer"
                        title="删除此提问"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 添加个人问题输入框 */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={customQuestionInput}
                onChange={(e) => setCustomQuestionInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddCustomQuestion();
                }}
                placeholder="在此输入您还想向医生询问的问题（如：某种靶向药的报销比例、术后能否吃中药等）..."
                className="flex-1 text-xs px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
              />
              <button
                type="button"
                onClick={handleAddCustomQuestion}
                disabled={!customQuestionInput.trim()}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-40 text-white text-xs font-bold transition-colors cursor-pointer flex items-center gap-1 shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>加入口袋卡</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: 会诊专家团队阵容 (Specialist Panel) */}
        {activeTab === "panel" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
              针对 <strong className="text-slate-900">{cancerType.toUpperCase()}</strong> 肿瘤特性，标准多学科会诊将由以下 5~6 个核心专业科室主治/主任医师联席审议。各专科在会诊中的分工如下：
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {specialistPanel.map((dept, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:shadow-xs transition-shadow"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${dept.iconBg} ${dept.iconText}`}>
                      <Stethoscope className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {dept.name}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {dept.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {dept.focus}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-200/60 flex items-center justify-between text-xs text-slate-600">
              <span className="flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-indigo-600" />
                <span>MDT 最终报告须由参与会诊的主任专家共同会签确认</span>
              </span>
              <span className="text-[11px] text-indigo-700 font-bold">
                国家卫生健康委标准 MDT 流程
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: 资料齐备度自查表 (Readiness Meter) */}
        {activeTab === "readiness" && (
          <div className="space-y-4">
            {/* 进度条大图 */}
            <div className="p-4 rounded-xl bg-linear-to-r from-slate-50 to-indigo-50/50 border border-slate-200/80">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                  <span className="text-sm font-bold text-slate-900">
                    MDT 病案资料齐备度自检
                  </span>
                </div>
                <div className="text-sm font-extrabold text-indigo-700 tabular-nums">
                  {readinessAudit.score}% 准备就绪
                </div>
              </div>

              {/* 进度槽 */}
              <div className="w-full h-2.5 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full rounded-full bg-linear-to-r from-sky-500 via-indigo-600 to-emerald-500 transition-all duration-500"
                  style={{ width: `${readinessAudit.score}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-2 flex items-center gap-1.5">
                {readinessAudit.score === 100 ? (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>资料非常齐全！已具备召开高级别专家多学科联合研讨的全部核心材料。</span>
                  </>
                ) : (
                  <span>部分核心检测材料尚未完备，建议携带原件或提前联系原住院科室补充调取，以保证专家准确判断。</span>
                )}
              </p>
            </div>

            {/* 核查清单项 */}
            <div className="space-y-2.5">
              {readinessAudit.checks.map((c) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-xl border transition-colors flex items-start gap-3 text-xs ${
                    c.ready
                      ? "bg-emerald-50/40 border-emerald-200/70"
                      : "bg-amber-50/40 border-amber-200/70"
                  }`}
                >
                  {c.ready ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`font-bold ${c.ready ? "text-slate-900" : "text-amber-900"}`}>
                        {c.label}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        c.ready
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}>
                        {c.ready ? "已录入档案" : "待带备原件"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                      {c.hint}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* 会诊前带备锦囊 */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1.5">
              <div className="font-bold text-slate-800 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-slate-600" />
                <span>患者家属赴 MDT 会诊必备实物随身包：</span>
              </div>
              <ul className="list-disc list-inside text-slate-600 space-y-1 pl-1 text-[11px] leading-relaxed">
                <li>原始医院放射科刻录的 <strong>DICOM 格式光盘/U盘</strong>（会诊影像专家需直接在专业工作站测量 CT 值与三维重建）；</li>
                <li>原手术或活检医院病理科借出的 <strong>未染色白片（约 10~15 张）与 HE 染色切片</strong>（供外院病理科重做免疫组化复读）；</li>
                <li>出院小结、手术记录单复印件及近 1 周内血常规、肝肾功生化检验单；</li>
                <li>目前正在服用的所有慢性病药物（降压药、抗凝药、降糖药）完整药品包装盒或照片。</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
