"use client";

import React from "react";
import Link from "next/link";
import { 
  Dna, 
  ShieldCheck, 
  Check, 
  Activity, 
  Award, 
  ArrowRight, 
  Pill, 
  AlertTriangle 
} from "lucide-react";
import type { PatientProfile } from "@/lib/types";
import type { TimelineEventItem } from "@/lib/timelineTypes";

interface MolecularProfileCardProps {
  profile?: PatientProfile | null;
  events?: TimelineEventItem[];
  onOpenDdiModal?: () => void;
  onOpenEdit?: () => void;
}

export function MolecularProfileCard({
  profile,
  events = [],
  onOpenDdiModal,
  onOpenEdit,
}: MolecularProfileCardProps) {
  // Extract mutations
  let mutations = (Array.isArray(profile?.geneMutations) && profile.geneMutations.length > 0)
    ? profile.geneMutations
    : (Array.isArray(profile?.molecular?.mutations) && profile.molecular.mutations.length > 0)
    ? profile.molecular.mutations
    : (profile?.egfr === 'positive' ? [{ id: 'mut_egfr', gene: 'EGFR', subtype: '敏感突变', status: 'positive' }] : []);

  // Fallback: derive mutations from timeline events if profile has none
  if (mutations.length === 0 && events && events.length > 0) {
    const ngsEvent = events.find((e) => e.subType === "NGS" || (e.category === "pathology" && e.keyFindings?.driverGene));
    if (ngsEvent?.keyFindings?.driverGene) {
      const dg = ngsEvent.keyFindings.driverGene;
      const geneName = dg.includes("EGFR") ? "EGFR" : dg.includes("ALK") ? "ALK" : dg.includes("KRAS") ? "KRAS" : dg.includes("TP53") ? "TP53" : "EGFR";
      const subtype = dg.includes("19del") ? "19外显子缺失突变 (19del)" : dg.includes("L858R") ? "L858R 点突变" : dg;
      const vafMatch = dg.match(/(?:丰度|VAF)\s*([\d.]+%\s*)/i);
      mutations = [{
        id: "evt_ngs_driver",
        gene: geneName,
        subtype: subtype,
        abundance: vafMatch ? vafMatch[1] : (dg.includes("19.4%") ? "19.4%" : undefined),
        status: "positive"
      }];
    }
  }

  let pdl1 = profile?.pdl1Tps || profile?.molecular?.pdl1Tps;
  if (!pdl1 && events && events.length > 0) {
    const pEvent = events.find((e) => e.keyFindings?.pdl1Tps);
    if (pEvent?.keyFindings?.pdl1Tps) {
      pdl1 = pEvent.keyFindings.pdl1Tps;
    }
  }

  const testStatus = profile?.molecularTestStatus || profile?.molecular?.testStatus || (
    mutations.length > 0 ? "tested" : (profile?.egfr === 'positive' ? "tested" : (profile?.egfr === 'negative' ? 'negative' : (events.some((e) => e.subType === "NGS") ? "tested" : "not_tested")))
  );
  const isStageIA = Boolean(profile?.stage?.startsWith("IA") || ((profile?.tStage === "T1a" || profile?.tStage === "T1b" || profile?.tStage === "T1c" || profile?.tStage === "T1mi") && (profile?.nStage === "N0" || !profile?.nStage)));
  const hasEgfr = mutations.some((m: any) => m.gene === "EGFR");
  const hasAlk = mutations.some((m: any) => m.gene === "ALK");
  const hasTp53 = mutations.some((m: any) => m.gene === "TP53" || m.isComutation);

  const egfrMut = mutations.find((m: any) => m.gene === 'EGFR');
  const alkMut = mutations.find((m: any) => m.gene === 'ALK');
  const krasMut = mutations.find((m: any) => m.gene === 'KRAS');
  const metMut = mutations.find((m: any) => m.gene === 'MET');

  let matchedGeneLabel = '常规用药参考';
  if (egfrMut || profile?.egfr === 'positive') {
    matchedGeneLabel = `EGFR 突变 (${egfrMut?.subtype || '敏感突变'})`;
  } else if (alkMut) {
    matchedGeneLabel = `ALK 融合 (${alkMut?.subtype || '阳性'})`;
  } else if (krasMut) {
    matchedGeneLabel = `KRAS 突变 (${krasMut?.subtype || 'G12C'})`;
  } else if (metMut) {
    matchedGeneLabel = `MET 异常 (${metMut?.subtype || 'exon 14'})`;
  } else if (profile?.stage) {
    matchedGeneLabel = `${profile.stage}期常规辅助用药评估`;
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-sm hover:border-slate-300 transition-colors duration-200">
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 flex-wrap">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center shrink-0">
            <Dna className="w-4 h-4 shrink-0" />
          </div>
          <div className="min-w-0">
            <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
              分子病理与驱动基因分型
            </h3>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 truncate">
              MOLECULAR BIOMARKERS & PRECISION TARGETING · NGS PANEL
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 whitespace-nowrap">
            {(() => {
              if (testStatus === "negative") return "全野生型 (未检出敏感突变)";
              if (testStatus === "not_tested") return "未做基因检测";
              if (testStatus === "in_progress") return "送检中";
              return `检出 ${mutations.length > 0 ? mutations.length : (profile?.egfr === 'positive' ? 1 : 0)} 项基因变异`;
            })()}
          </span>
        </div>
      </div>

      {/* Content Body */}
      {(() => {
        if (testStatus === "not_tested") {
          return (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>当前档案未录入基因检测报告</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  {isStageIA ? (
                    <span><strong>IA 期极高治愈率保障</strong>：经微创根治手术后，IA 期 5 年生存率达 90%+，指南明确无需靶向辅助治疗，不强制要求昂贵的基因大 Panel 检测。</span>
                  ) : (
                    <span>若为主治医生评估需要评估靶向辅助治疗（如奥希替尼），可随时在临床档案或追加报告中补充检测结果。</span>
                  )}
                </p>
              </div>
              {onOpenEdit && (
                <button
                  type="button"
                  onClick={onOpenEdit}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:border-indigo-400 hover:text-indigo-600 font-bold text-slate-700 text-xs rounded-xl shadow-2xs transition-all shrink-0 cursor-pointer"
                >
                  录入基因报告
                </button>
              )}
            </div>
          );
        }

        if (testStatus === "negative") {
          return (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2 text-xs">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>全基因野生型（未见经典驱动靶点突变）</span>
              </div>
              <p className="text-[11px] text-emerald-800 leading-relaxed">
                EGFR、ALK、ROS1、KRAS 等常见驱动靶点均为野生型（阴性）。若未来需系统全身治疗，化疗联合免疫治疗（PD-1/PD-L1）通常为标准首选方向。
              </p>
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* Gene Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mutations.map((m: any, idx: number) => {
                const isComutation = m.isComutation || m.gene === "TP53" || m.gene === "RB1" || m.gene === "PIK3CA";
                return (
                  <div
                    key={m.id || m.gene + idx}
                    className={`p-3 rounded-2xl border flex flex-col justify-between ${
                      isComutation
                        ? "bg-amber-50/60 border-amber-300/80 shadow-2xs"
                        : "bg-indigo-50/50 border-indigo-200 shadow-2xs"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-extrabold text-xs flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${isComutation ? 'bg-amber-500' : 'bg-indigo-600'}`} />
                        <span className={isComutation ? 'text-amber-950' : 'text-indigo-950'}>{m.gene}</span>
                      </span>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        isComutation 
                          ? "bg-amber-200/80 text-amber-900" 
                          : "bg-indigo-200/70 text-indigo-900"
                      }`}>
                        {isComutation ? "伴随突变" : "驱动靶点"}
                      </span>
                    </div>

                    <div className="text-[11px] font-semibold text-slate-700 space-y-0.5">
                      <div className="truncate">{m.subtype || "检出变异"}</div>
                      {m.abundance && (
                        <div className="text-[10px] text-slate-500">
                          突变丰度 (VAF): <strong className="text-slate-800">{m.abundance}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* PD-L1 Badge if available */}
              {pdl1 && pdl1 !== "unknown" && (
                <div className="p-3 rounded-2xl border bg-slate-50 border-slate-200 flex flex-col justify-between shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-indigo-600" />
                      <span>PD-L1 TPS</span>
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-700">
                      免疫组化
                    </span>
                  </div>
                  <div className="text-xs font-bold text-slate-800">
                    {pdl1} {pdl1 === '>=50%' ? '(高表达)' : pdl1 === '1-49%' ? '(低表达)' : '(阴性)'}
                  </div>
                </div>
              )}
            </div>

            {/* Matched Targeted Drugs & Clinical Stage Guideline */}
            {isStageIA && (hasEgfr || hasAlk) ? (
              <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-extrabold text-emerald-950 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>权威指南 1 类强烈推荐：IA 期极早期术后无需辅助靶向治疗</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    虽然检出 {hasEgfr ? "EGFR" : "ALK"} 敏感驱动突变，但因您的病灶处于 <strong>IA 期根治性微创切除低危组</strong>（5年生存率 90%~100%），CSCO / NCCN 权威指南明文确立：<strong>严禁盲目服用靶向药辅助治疗</strong>（避免过度医疗、身体毒副作用及过早耐药），仅需遵医嘱规律复查即可。
                  </p>
                </div>
              </div>
            ) : (hasEgfr || hasAlk) ? (
              <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 rounded-2xl border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-1">
                  <div className="font-extrabold text-blue-950 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>匹配精准靶向药物与门特医保：</span>
                  </div>
                  <p className="text-[11px] text-blue-800">
                    {hasEgfr && "三代 EGFR-TKI（甲磺酸奥希替尼/泰瑞沙、阿美替尼/阿美乐、伏美替尼/艾弗沙等）"}
                    {hasAlk && "二代 ALK-TKI（阿来替尼/安圣莎、布格替尼、洛拉替尼等）"}
                    {" · 均已纳入国家医保门特报销目录"}
                  </p>
                </div>
                <Link
                  href="/reimbursement"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-2xs flex items-center gap-1 shrink-0 transition-all cursor-pointer"
                >
                  <span>查看门特报销指引</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : null}

            {/* DDI Drug Interaction Quick Action Banner */}
            {onOpenDdiModal && (
              <div className="p-3.5 bg-gradient-to-r from-purple-50/90 via-indigo-50/70 to-blue-50/80 rounded-2xl border border-purple-200/90 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="space-y-1">
                  <div className="font-extrabold text-purple-950 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>靶向药与慢病用药相互作用 (DDI) 排雷：</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      isStageIA 
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-200" 
                        : "bg-purple-200/80 text-purple-900"
                    }`}>
                      {isStageIA ? "IA期无需服药 · 仅供储备排雷" : `已关联 ${matchedGeneLabel}`}
                    </span>
                  </div>
                  <p className="text-[11px] text-purple-900/90 leading-relaxed">
                    {isStageIA
                      ? "由于您属于 IA 期极早期，指南明确无需术后吃靶向药。如您想了解平时吃的胃药（奥美拉唑）、降压降脂药与常见抗癌靶向药的相互作用机制，可自检储备常识。"
                      : "正在服用降压降脂药、胃药（奥美拉唑）、抗凝抗栓药或日常西柚？一键自检合并用药禁忌并生成 24 小时错峰服药规划。"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onOpenDdiModal}
                  className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>{isStageIA ? "探索用药排雷知识" : "一键自检当前用药"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Additional Mutation Guardrail & Guidance */}
            {!isStageIA && hasTp53 && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">伴随 TP53 抑癌基因共突变提示：</div>
                  <p className="text-[11px] text-amber-800 leading-relaxed mt-0.5">
                    TP53 突变可能削弱单药靶向治疗的无进展生存期（PFS）。若分期为中晚期，建议在临床医生指导下评估强化随访或靶向联合治疗策略。
                  </p>
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}

export default MolecularProfileCard;
