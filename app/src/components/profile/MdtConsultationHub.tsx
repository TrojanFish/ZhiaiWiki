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
  const isLung = !isBreast;

  const rawData = useMemo(() => {
    return (profile as any)?.clinicalData || (profile as any)?.cancerSpecificData || profile || {};
  }, [profile]);

  const currentStage = useMemo(() => {
    return (profile?.stage || rawData?.stage || rawData?.cnlcStage || "待评估").toUpperCase();
  }, [profile, rawData]);

  // 1. MDT 专科专家团队矩阵 (Specialist Panel)
  const specialistPanel: SpecialistDept[] = useMemo(() => {
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
  }, [cancerType, isBreast]);

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
  }, [isBreast]);

  // 4. MDT 门诊 15 分钟就诊问答口袋卡 (Consultation Pocket Card)
  const defaultQuestions: DefaultQuestion[] = useMemo(() => {
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
  }, [isBreast]);

  // 从 localStorage 恢复自定义问题
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`zhiaiwiki_mdt_custom_q_${cancerType}`);
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
      localStorage.setItem(`zhiaiwiki_mdt_custom_q_${cancerType}`, JSON.stringify(next));
    } catch (e) {
      console.error("Failed to save custom questions", e);
    }
  };

  const handleRemoveCustomQuestion = (idx: number) => {
    const next = customQuestions.filter((_, i) => i !== idx);
    setCustomQuestions(next);
    try {
      localStorage.setItem(`zhiaiwiki_mdt_custom_q_${cancerType}`, JSON.stringify(next));
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
