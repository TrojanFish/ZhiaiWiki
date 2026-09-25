"use client";

import { useState, useEffect } from "react";
import KnowledgeMapPreview from "@/components/KnowledgeMapPreview";
import Footer from "@/components/Footer";
import type { PatientProfile } from "@/lib/types";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerRegistry } from "@/lib/cancerRegistry";
import { CancerIcon } from "@/components/common/CancerIcons";
import { getProfileBySlot } from "@/lib/profileStorage";

export default function KnowledgePage() {
  const { cancerType } = useCancerType();
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Attempt to read profile from URL hash (e.g., /knowledge#profile=<base64>)
    let loadedFromHash = false;
    try {
      const hash = window.location.hash;
      const match = hash.match(/profile=([^&]+)/);
      if (match) {
        const decoded = JSON.parse(atob(decodeURIComponent(match[1])));
        if (decoded && (!decoded.cancerType || decoded.cancerType === cancerType)) {
          setProfile(decoded);
          loadedFromHash = true;
        }
      }
    } catch {
      // Silently ignore malformed hash
    }

    // 2. Load profile strictly matching the active cancerType slot to avoid cross-cancer contamination
    if (!loadedFromHash) {
      try {
        const slotProfile = getProfileBySlot(cancerType);
        if (slotProfile) {
          setProfile(slotProfile);
        } else {
          // Fallback check legacy profile only if it belongs to the current cancer
          const cached = localStorage.getItem("oncopath_profile") || localStorage.getItem("patient_profile");
          if (cached) {
            const parsed = JSON.parse(cached);
            const profType = parsed?.cancerType || parsed?.organ || "lung";
            if (profType === cancerType && (parsed.stage || parsed.noduleType || parsed.tumorSize)) {
              setProfile(parsed);
            } else {
              setProfile(null);
            }
          } else {
            setProfile(null);
          }
        }
      } catch {
        setProfile(null);
      }
    }

    setProfileLoaded(true);
  }, [cancerType]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">

      {/* Hero Header */}
      <header className="pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-6 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        {/* Unified Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-bold text-sky-700 border border-sky-200 shadow-xs max-w-full">
          <CancerIcon type={cancerType} className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600 shrink-0" />
          <span className="truncate">4D 动态因果推演引擎</span>
          <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0" />
          <span className="hidden sm:inline shrink-0">100% 专区 1:1 循证图谱</span>
        </div>

        {/* Unified H1 */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          推演病理因果 · <span className="text-blue-600">洞悉 4D 证据网络</span>
        </h1>

        {/* Unified Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {cancerType === "breast" ? (
            <>基于全球顶刊队列与临床指南构建的<strong>乳腺癌结构化知识图谱</strong>。动态推演分子分型（ER/PR/HER2/21基因）到个体化治疗（内分泌/双靶向/CDK4/6i）与生存结局的<strong>完整因果链条</strong>。</>
          ) : cancerType === "colorectal" || cancerType === "colon" || cancerType === "rectal" ? (
            <>基于全球顶刊队列与临床指南构建的<strong>结直肠癌结构化知识图谱</strong>。动态推演上游特征（左右半分型/浸润深度/淋巴结TD/RAS/BRAF/MSI）到辅助化疗减毒与靶向免疫选择的<strong>完整因果链条</strong>。</>
          ) : cancerType === "gastric" ? (
            <>基于全球顶刊队列与临床指南构建的<strong>胃癌结构化知识图谱</strong>。动态推演病理组织学（Lauren分型/印戒细胞）、分子标志物（HER2/Claudin 18.2/dMMR）到 D2 根治、围手术期 FLOT 与精准靶向治疗的<strong>完整因果链条</strong>。</>
          ) : cancerType === "liver" ? (
            <>基于中国国家标准与国际指南构建的<strong>原发性肝癌结构化知识图谱</strong>。动态推演 CNLC 2024 分期、Child-Pugh/ALBI 肝储备、门脉癌栓到解剖切除、HAIC-FO 局部灌注与 T+A 双达靶免一线的<strong>完整因果链条</strong>。</>
          ) : cancerType === "esophageal" ? (
            <>基于中国国家级 III 期与全球顶刊构建的<strong>食管癌结构化知识图谱</strong>。动态推演组织学（鳞癌 ESCC）、浸润深度与喉返神经链到 NEOCRTEC5010 新辅助放化疗、微创根治与 CheckMate-577 辅助免疫的<strong>完整因果链条</strong>。</>
          ) : cancerType === "thyroid" ? (
            <>基于国际 ATA 与中国指南构建的<strong>甲状腺癌结构化知识图谱</strong>。动态推演 C-TIRADS 超声分级、BRAF V600E 突变到低危微小癌 (PTMC) 主动监测、腺叶切除、ESTIMABL2 免碘清甲与 TSH 抑制的<strong>完整因果链条</strong>。</>
          ) : cancerType === "endometrial" ? (
            <>基于 FIGO 2023 与 ESGO 指南构建的<strong>子宫内膜癌结构化知识图谱</strong>。动态推演 TCGA 四分子分型（POLE/MSI/p53）、肌层浸润深度到分期手术、PORTEC-3 辅助放化疗与仑伐替尼+帕博利珠单抗靶免的<strong>完整因果链条</strong>。</>
          ) : cancerType === "cervical" ? (
            <>基于 FIGO 与 NCCN 指南构建的<strong>宫颈癌结构化知识图谱</strong>。动态推演高危 HPV 16/18 感染、CIN 阶梯管理、肿瘤大小到锥切微创、根治性同步放化疗 (CCRT) 与 KEYNOTE-826 一线四联方案的<strong>完整因果链条</strong>。</>
          ) : cancerType === "pancreatic" ? (
            <>基于 NCCN 2024 与 CSCO 胰腺癌指南构建的<strong>胰腺癌结构化知识图谱</strong>。动态推演薄层增强 CT/MRI 血管浸润（可切除/交界可切除/局部晚期）、驱动基因（KRAS/gBRCA）到新辅助转化化疗、Whipple 腹膜后切缘 R0 质控与奥拉帕利维持的<strong>完整因果链条</strong>。</>
          ) : (
            <>基于全球顶刊队列与临床指南构建的<strong>肺癌结构化知识图谱</strong>。动态推演上游浸润特征（CTR / STAS / VPI / EGFR / 分期）到下游预后结局与辅助治疗方案的<strong>完整因果链条</strong>。</>
          )}
        </p>

        {/* Active Specialty Zone Indicator */}
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span>当前图谱专区：<strong className="text-slate-900 font-bold">{CancerRegistry.get(cancerType)?.name || "全景"}</strong></span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">切换其他专区请点击顶栏导航</span>
        </div>

        {/* Profile Matched Notification Bar if profile exists */}
        {profile && (
          <div className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-50 border border-teal-300 text-teal-950 text-xs font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-teal-500" />
            <span>已识别到您的个人数字档案（{profile.stage}期 · {profile.age}岁）· 专属因果推演路径已高亮激活</span>
          </div>
        )}
      </header>

      {/* Knowledge Map */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pb-12 sm:pb-16 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="bg-white rounded-3xl p-2 border border-slate-200/90 shadow-xl shadow-slate-900/5">
          {profileLoaded && <KnowledgeMapPreview profile={profile} cancerType={cancerType} />}
        </div>
      </main>

      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}

