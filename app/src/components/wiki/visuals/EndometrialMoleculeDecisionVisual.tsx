"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  ShieldCheck, 
  Dna
} from "lucide-react";

export function EndometrialMoleculeDecisionVisual() {
  const [activeTab, setActiveTab] = useState<"decision" | "subtypes">("decision");

  // 交互状态
  const [subtype, setSubtype] = useState<"POLEmut" | "MMRd" | "NSMP" | "p53abn">("POLEmut");
  const [grade, setGrade] = useState<"G1" | "G2" | "G3">("G1");
  const [myometrial, setMyometrial] = useState<"none" | "less_than_50" | "greater_equal_50">("less_than_50");
  const [lvsi, setLvsi] = useState<"negative" | "focal" | "substantial">("negative");
  const [cervix, setCervix] = useState<"none" | "stromal">("none");

  // FIGO 2023 分期推演
  let calculatedStage = "IA";
  let stageBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
  let recommendation = "";
  let recType: "deescalate" | "standard" | "escalate" = "standard";
  let survival5yr = "90% ~ 95%";

  if (subtype === "POLEmut") {
    // 🌟 FIGO 2023 规则：局限于子宫体（未侵犯宫颈间质或远处）的 POLE 突变型一律归入 IAm_POLEmut
    if (cervix === "none") {
      calculatedStage = "IAm_POLEmut";
      stageBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      recType = "deescalate";
      recommendation = "【PORTEC-4a 安全降阶梯】：预后极佳！无论组织学分级为 G1 还是 G3，无论肌层浸润深浅，国际权威指南一致推荐免除术后辅助放疗与全身化疗，仅需定期常规随访，避免过度医疗！";
      survival5yr = "96.8% (5年无复发生存率)";
    } else {
      calculatedStage = "IIA";
      stageBadgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/30";
      recType = "standard";
      recommendation = "肿瘤侵犯宫颈间质，建议个体化评估阴道近距离放疗或盆腔体外照射。";
      survival5yr = "92% ~ 95%";
    }
  } else if (subtype === "p53abn") {
    // ⚠️ FIGO 2023 规则：p53 异常型只要伴有肌层浸润，直接升期为 IICm_p53abn
    if (myometrial !== "none" || cervix === "stromal") {
      calculatedStage = "IICm_p53abn";
      stageBadgeColor = "text-rose-400 bg-rose-500/10 border-rose-500/30";
      recType = "escalate";
      recommendation = "【PORTEC-3 强化治疗】：FIGO 2023 明确规定升期为 IICm_p53abn！具有高侵袭性与远处播散潜能，强烈推荐系统性紫杉醇+卡铂 (TC) 辅助化疗联合盆腔体外放疗 (EBRT)，阻断微转移。";
      survival5yr = "75% ~ 82% (放化联合组)";
    } else {
      calculatedStage = "IA";
      stageBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
      recType = "standard";
      recommendation = "极少数局限于内膜无肌层浸润的 p53abn，术后密切随访或评估阴道后装放疗。";
      survival5yr = "85% ~ 88%";
    }
  } else if (subtype === "MMRd") {
    if (cervix === "stromal") {
      calculatedStage = "IIA";
      stageBadgeColor = "text-purple-400 bg-purple-500/10 border-purple-500/30";
      recType = "standard";
      recommendation = "盆腔体外放疗 (EBRT) ± 阴道后装放疗；若远期复发，PD-1 免疫治疗 (如多塔利单抗/帕博利珠单抗) 响应率超 60%！";
      survival5yr = "80% ~ 85%";
    } else if (myometrial === "greater_equal_50" || lvsi === "substantial" || grade === "G3") {
      calculatedStage = "IB (高中危)";
      stageBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
      recType = "standard";
      recommendation = "建议行阴道近距离放疗 (VBT)；若显著脉管浸润 (LVSI) 阳性，可考虑盆腔体外照射。";
      survival5yr = "85% ~ 90%";
    } else {
      calculatedStage = "IA (低危)";
      stageBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      recType = "deescalate";
      recommendation = "早期低危 MMRd 患者，规范手术彻底切除后无需任何辅助放化疗，长期观察随访即可。";
      survival5yr = "92% ~ 96%";
    }
  } else {
    // NSMP
    if (cervix === "stromal") {
      calculatedStage = "IIA";
      stageBadgeColor = "text-blue-400 bg-blue-500/10 border-blue-500/30";
      recType = "standard";
      recommendation = "累及宫颈间质，术后建议盆腔体外放疗 (EBRT)。";
      survival5yr = "82% ~ 86%";
    } else if (myometrial === "greater_equal_50" || lvsi === "substantial") {
      calculatedStage = "IB (高-中危)";
      stageBadgeColor = "text-amber-400 bg-amber-500/10 border-amber-500/30";
      recType = "standard";
      recommendation = "根据 GOG-99 危险分层标准，推荐行阴道近距离放疗 (VBT) 保护残端。";
      survival5yr = "86% ~ 90%";
    } else {
      calculatedStage = "IA (低危)";
      stageBadgeColor = "text-emerald-400 bg-emerald-500/10 border-emerald-500/30";
      recType = "deescalate";
      recommendation = "局限性浅肌层浸润，术后无需放化疗，保持常规随访。";
      survival5yr = "94% ~ 97%";
    }
  }

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/90 text-slate-100 p-5 shadow-xl">
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Dna className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-white tracking-wide">FIGO 2023 分子分型与降阶梯决策模拟器</h3>
              <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono">FIGO 2023 / TCGA</span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">交互模拟 POLEmut 降阶梯与 p53abn 升期对放化疗决策的革命性改变</p>
          </div>
        </div>

        {/* 模式切换 */}
        <div className="flex items-center bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 text-xs">
          <button
            onClick={() => setActiveTab("decision")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "decision" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            决策计算器
          </button>
          <button
            onClick={() => setActiveTab("subtypes")}
            className={`px-3 py-1.5 rounded-md font-medium transition-all ${
              activeTab === "subtypes" ? "bg-rose-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            四大分型全景对比
          </button>
        </div>
      </div>

      {activeTab === "decision" ? (
        <div className="space-y-6">
          {/* 输入配置区 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. 分子亚型选择 */}
            <div className="space-y-2 p-3.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>1. FIGO 2023 分子生物学亚型</span>
                <span className="text-[11px] text-rose-400 font-normal">核心权重第一位</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "POLEmut", label: "POLE 超突变型", badge: "预后极佳 (降阶梯)" },
                  { id: "MMRd", label: "错配修复缺陷 (dMMR)", badge: "免疫敏感型" },
                  { id: "NSMP", label: "无特定分子特征", badge: "中间型预后" },
                  { id: "p53abn", label: "p53 异常型", badge: "高危侵袭 (升期)" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSubtype(item.id as any)}
                    className={`p-2 rounded text-left transition-all border ${
                      subtype === item.id
                        ? "bg-rose-600/20 border-rose-500 text-white ring-1 ring-rose-500/50"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 肌层浸润深度 */}
            <div className="space-y-2 p-3.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>2. 子宫平滑肌层浸润深度</span>
                <span className="text-[11px] text-slate-400 font-normal">解剖学浸润深度</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "none", label: "无浸润", desc: "局限于内膜" },
                  { id: "less_than_50", label: "< 50% 浅肌层", desc: "未过半肌层" },
                  { id: "greater_equal_50", label: ">= 50% 深肌层", desc: "深部浸润" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setMyometrial(item.id as any)}
                    className={`p-2 rounded text-center transition-all border ${
                      myometrial === item.id
                        ? "bg-indigo-600/20 border-indigo-500 text-white ring-1 ring-indigo-500/50"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 3. 组织学分级 Grade */}
            <div className="space-y-2 p-3.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>3. 组织学病理分级 (Grade)</span>
                <span className="text-[11px] text-slate-400 font-normal">分化程度</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "G1", label: "G1 高分化", desc: "腺体分化好" },
                  { id: "G2", label: "G2 中分化", desc: "实性区域<50%" },
                  { id: "G3", label: "G3 低分化", desc: "实性区域>=50%" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setGrade(item.id as any)}
                    className={`p-2 rounded text-center transition-all border ${
                      grade === item.id
                        ? "bg-purple-600/20 border-purple-500 text-white ring-1 ring-purple-500/50"
                        : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                    }`}
                  >
                    <div className="text-xs font-medium">{item.label}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{item.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. 脉管浸润与宫颈受累 */}
            <div className="space-y-2 p-3.5 rounded-lg bg-slate-800/40 border border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>4. 脉管瘤栓 (LVSI) 与宫颈累及</span>
                <span className="text-[11px] text-slate-400 font-normal">局部侵袭指标</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setLvsi(lvsi === "negative" ? "substantial" : "negative")}
                  className={`p-2 rounded text-left transition-all border ${
                    lvsi === "substantial"
                      ? "bg-amber-600/20 border-amber-500 text-white ring-1 ring-amber-500/50"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="text-xs font-medium">脉管瘤栓 (LVSI)</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{lvsi === "substantial" ? "显著阳性 (复发高危)" : "阴性 / 局灶"}</div>
                </button>

                <button
                  onClick={() => setCervix(cervix === "none" ? "stromal" : "none")}
                  className={`p-2 rounded text-left transition-all border ${
                    cervix === "stromal"
                      ? "bg-rose-600/20 border-rose-500 text-white ring-1 ring-rose-500/50"
                      : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:border-slate-600"
                  }`}
                >
                  <div className="text-xs font-medium">宫颈间质侵犯</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{cervix === "stromal" ? "阳性 (升至 Stage II)" : "阴性 / 仅腺体"}</div>
                </button>
              </div>
            </div>
          </div>

          {/* 模拟器诊断与决策结果卡片 */}
          <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
              <div>
                <span className="text-xs text-slate-400 uppercase tracking-wider font-mono">FIGO 2023 分期重塑计算结果</span>
                <div className="flex items-center gap-3 mt-1">
                  <span className={`text-xl font-bold px-3 py-1 rounded-lg border font-mono ${stageBadgeColor}`}>
                    {calculatedStage}
                  </span>
                  <span className="text-xs text-slate-300">
                    分子生物学预后 5 年生存率：<strong className="text-emerald-400">{survival5yr}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {recType === "deescalate" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 循证安全降阶梯 (免除过度医疗)
                  </span>
                ) : recType === "escalate" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-rose-500/10 text-rose-400 border border-rose-500/30">
                    <AlertTriangle className="w-3.5 h-3.5" /> 升期强化放化联合
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    <Info className="w-3.5 h-3.5" /> 标准个体化辅助治疗
                  </span>
                )}
              </div>
            </div>

            {/* 临床策略指导 */}
            <div className="p-3.5 rounded-lg bg-slate-900/60 border border-slate-700/50 space-y-2">
              <div className="text-xs font-semibold text-rose-300 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" />
                <span>MDT 辅助治疗与随访战术推荐：</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{recommendation}</p>
            </div>
          </div>
        </div>
      ) : (
        /* 四大分子分型全景对比 */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            {
              title: "1. POLE 超突变型 (POLEmut)",
              share: "约 7% ~ 10%",
              color: "border-emerald-500/40 bg-emerald-500/5",
              titleColor: "text-emerald-400",
              prognosis: "超优良 (5年生存率 >95%)",
              feature: "新抗原负荷超高，自身 T 淋巴细胞免疫浸润极强",
              directive: "FIGO 2023 下调为 IAm_POLEmut；PORTEC-4a 推荐安全免除辅助放疗与化疗！",
            },
            {
              title: "2. 错配修复缺陷型 (MMRd / MSI-H)",
              share: "约 25% ~ 30%",
              color: "border-purple-500/40 bg-purple-500/5",
              titleColor: "text-purple-400",
              prognosis: "中等 (晚期免疫响应率极高)",
              feature: "微卫星高度不稳定，部分伴 Lynch 综合征家族遗传",
              directive: "常规按解剖分期放疗；若进入晚期/复发，首选多塔利单抗/帕博利珠单抗 PD-1 免疫联合 (RUBY方案)。",
            },
            {
              title: "3. 无特定分子特征型 (NSMP)",
              share: "约 45% ~ 50%",
              color: "border-blue-500/40 bg-blue-500/5",
              titleColor: "text-blue-400",
              prognosis: "中等 (受组织学分化支配)",
              feature: "激素受体 (ER/PR) 多为阳性，对内分泌治疗较敏感",
              directive: "依靠传统 GOG-99 标准评估肌层浸润与 LVSI，精准决定阴道近距离放疗 (VBT) 或观察。",
            },
            {
              title: "4. p53 异常型 (p53abn)",
              share: "约 15% ~ 20%",
              color: "border-rose-500/40 bg-rose-500/5",
              titleColor: "text-rose-400",
              prognosis: "高危 (易早期深浸润与腹膜播散)",
              feature: "几乎见于所有浆液性癌及部分侵袭性内膜样腺癌",
              directive: "FIGO 2023 规定伴肌层浸润即升期为 IICm_p53abn，必须行紫杉醇+卡铂化疗联合盆腔放疗！",
            },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 rounded-xl border ${item.color} space-y-2`}>
              <div className="flex items-center justify-between">
                <h4 className={`text-sm font-semibold ${item.titleColor}`}>{item.title}</h4>
                <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">{item.share}</span>
              </div>
              <div className="text-xs text-slate-300">
                预后评估：<strong className="text-white">{item.prognosis}</strong>
              </div>
              <div className="text-xs text-slate-400">
                分子特征：{item.feature}
              </div>
              <div className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
                <span className="text-rose-300 font-medium">临床决策：</span>{item.directive}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
