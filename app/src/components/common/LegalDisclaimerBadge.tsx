"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertCircle, FileText, ExternalLink, X, Scale } from "lucide-react";

interface LegalDisclaimerBadgeProps {
  variant?: "badge" | "card" | "banner";
  className?: string;
}

export default function LegalDisclaimerBadge({
  variant = "badge",
  className = "",
}: LegalDisclaimerBadgeProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);

  if (variant === "badge") {
    return (
      <>
        <button
          type="button"
          onClick={() => setShowDetailModal(true)}
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100/90 hover:bg-slate-200/90 text-slate-600 border border-slate-200 transition-colors shadow-2xs group cursor-pointer ${className}`}
          title="点击查看学术循证及合规法律声明"
        >
          <Scale className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-700" />
          <span>科研循证说明 · 非医疗诊断</span>
        </button>

        {showDetailModal && (
          <LegalComplianceModal onClose={() => setShowDetailModal(false)} />
        )}
      </>
    );
  }

  if (variant === "banner") {
    return (
      <>
        <div
          className={`bg-gradient-to-r from-slate-50 via-slate-100/70 to-slate-50 border border-slate-200/90 rounded-xl p-3 sm:p-4 text-xs text-slate-600 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 shadow-2xs ${className}`}
        >
          <div className="flex items-start gap-2 min-w-0">
            <Scale className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <span className="font-bold text-slate-800 mr-1.5">
                【学术文献检索与科研情报声明】
              </span>
              本平台展示的生存曲线及队列数据源于国际权威前瞻性临床试验公开发表文献，旨在提供客观循证情报与学术参考，
              <strong>不构成任何在线诊疗、会诊咨询或处方建议</strong>。
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowDetailModal(true)}
            className="shrink-0 text-xs text-teal-700 hover:text-teal-800 font-bold underline underline-offset-2 flex items-center gap-1 cursor-pointer"
          >
            <span>合规详情</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>

        {showDetailModal && (
          <LegalComplianceModal onClose={() => setShowDetailModal(false)} />
        )}
      </>
    );
  }

  // Card Variant
  return (
    <>
      <div
        className={`bg-slate-50/90 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-xs text-slate-600 space-y-2.5 shadow-2xs ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-800">
            <div className="w-6 h-6 rounded-lg bg-slate-200/80 text-slate-700 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
            <span>学术循证边界与合规免责声明</span>
          </div>
          <button
            type="button"
            onClick={() => setShowDetailModal(true)}
            className="text-teal-700 hover:text-teal-800 font-bold underline underline-offset-2 text-xs cursor-pointer"
          >
            完整条款
          </button>
        </div>
        <p className="leading-relaxed text-slate-600 text-xs">
          本平台为<strong>学术文献情报与循证数据检索工具</strong>，严格遵循《中华人民共和国医师法》及互联网医疗合规标准，不提供在线诊疗、处方开具或个体化医疗诊断服务。所有队列、生存率（OS/RFS）及风险比（HR）均来自公开发表的顶级医学同行评审期刊。实际治疗方案请务必前往正规医疗机构，由经治专科医生或多学科诊疗团队（MDT）制定。
        </p>
      </div>

      {showDetailModal && (
        <LegalComplianceModal onClose={() => setShowDetailModal(false)} />
      )}
    </>
  );
}

function LegalComplianceModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-2xl border border-slate-200 shadow-2xl p-5 sm:p-7 max-h-[85vh] overflow-y-auto space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                学术循证平台定位与合规法律声明
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                LEGAL COMPLIANCE & CLINICAL EVIDENCE NOTICE
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Clauses */}
        <div className="space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              <span>核心原则：恪守学术科研工具边界，坚决杜绝非法行医</span>
            </div>
            <p className="text-xs text-amber-800/90 leading-relaxed">
              根据《中华人民共和国医师法》第十四条与第二十三条规定，医师必须依法取得医师执业证书并在注册地点和执业范围内执业。本平台<strong>严禁且不提供任何形式的网络在线诊疗、医疗诊断、疾病确诊或开具处方等核心医疗行为</strong>。
            </p>
          </div>

          <div className="space-y-3">
            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-teal-600" />
                <span>1. 公开同行评审文献的二次客观检索与呈现</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                本平台所展示的所有临床队列数据、Kaplan-Meier 生存曲线拟合、风险比（Hazard Ratio）、5 年总生存率（OS）及无复发生存率（RFS），均严格摘录自国际公开发表的权威同行评议顶刊（如 NEJM, Lancet Oncology, Journal of Clinical Oncology, JAMA Oncology 等）与权威临床指南（如 CSCO, NCCN, ESMO）。每一项队列均标注真实的 PubMed PMID 编号与数字对象唯一标识符（DOI），供学术查证。
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>2. 统计学规律与个体化异质性区别</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                大样本临床试验反映的是特定入组人群在受控实验条件下的平均统计概率，不能直接等同于任何单个患者的绝对预后。癌症生物学具有高度异质性，真实预后受微环境、体能状态（ECOG PS）、基础并发症、术后病理分期及主治医生团队制定的综合治疗策略等多重因素深度影响。
              </p>
            </div>

            <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/60">
              <h4 className="font-bold text-slate-800 text-xs sm:text-sm mb-1 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>3. 临床决策权威归属</span>
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                用户在面对任何医疗疑虑或需要确定治疗路径时，应以实体医疗机构具备执业资格的主治医师、多学科专家会诊（MDT）出具的正式书面病历与医疗文书为准。任何人不应将本平台的文献检索分析结果作为自行调整用药剂量、擅自停药或变更手术方式的依据。
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="text-[11px] text-slate-400 font-mono">
            Compliance Standard: Medical Evidence Intelligence v2.0
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm cursor-pointer"
          >
            我已知晓并理解
          </button>
        </div>
      </div>
    </div>
  );
}
