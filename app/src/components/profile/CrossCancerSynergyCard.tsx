"use client";

import React, { useState } from "react";
import type { CancerType, PatientProfile } from "@/lib/types";
import { 
  GitFork, 
  Share2, 
  Pill, 
  HeartHandshake, 
  Check, 
  Zap,
  ShieldCheck,
} from "lucide-react";

interface CrossCancerSynergyCardProps {
  lungProfile?: PatientProfile | null;
  breastProfile?: PatientProfile | null;
  onOpenDdiChecker?: (recommendedDrugId?: string) => void;
  onSyncM0Checks?: () => void;
  className?: string;
}

export default function CrossCancerSynergyCard({
  lungProfile,
  breastProfile,
  onOpenDdiChecker,
  onSyncM0Checks,
  className = "",
}: CrossCancerSynergyCardProps) {
  const [activeTab, setActiveTab] = useState<"ddi" | "pathology" | "m0">("ddi");
  const [copiedSync, setCopiedSync] = useState(false);

  // 1. 动态识别已建档的原发癌种 (肺癌与乳腺癌双原发)
  const presentCancers: Array<{ type: CancerType; label: string; profile: PatientProfile }> = [];
  if (lungProfile) presentCancers.push({ type: "lung", label: "原发性肺癌", profile: lungProfile });
  if (breastProfile) presentCancers.push({ type: "breast", label: "原发性乳腺癌", profile: breastProfile });

  const combinationTitle = presentCancers.map(c => c.label).join(" ✕ ");

  // 2. 跨癌种关键治疗药物识别
  const lungTargetDrug = React.useMemo(() => {
    if (!lungProfile) return null;
    const muts = Array.isArray(lungProfile.geneMutations) ? lungProfile.geneMutations : [];
    if (muts.some((m: any) => m.gene === "EGFR") || lungProfile.egfr === "positive") {
      return { id: "osimertinib", name: "奥希替尼 (EGFR-TKI 靶向)" };
    }
    if (muts.some((m: any) => m.gene === "ALK")) {
      return { id: "alectinib", name: "阿来替尼 (ALK-TKI 靶向)" };
    }
    return { id: "osimertinib", name: "肺癌常规靶向/系统治疗方案" };
  }, [lungProfile]);

  const breastTargetDrug = React.useMemo(() => {
    if (!breastProfile) return null;
    const isHer2Pos = breastProfile.her2Status === "positive" || breastProfile.her2Status === "3+";
    if (isHer2Pos) return { id: "trastuzumab", name: "曲妥珠单抗 (抗 HER2 单抗)" };
    if (breastProfile.erStatus === "positive") {
      return { id: "tamoxifen", name: "他莫昔芬 / 内分泌治疗" };
    }
    return { id: "abemaciclib", name: "阿贝西利 (CDK4/6 抑制剂)" };
  }, [breastProfile]);

  const defaultDdiDrugId = lungTargetDrug?.id || breastTargetDrug?.id || "osimertinib";

  if (presentCancers.length < 2) {
    return null;
  }

  return (
    <section className={`rounded-2xl bg-white border border-purple-200 shadow-xs overflow-hidden mt-6 mb-8 ${className}`}>
      {/* 顶部横幅 */}
      <div className="bg-linear-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600/30 border border-purple-400/40 flex items-center justify-center shrink-0">
              <HeartHandshake className="w-5 h-5 text-purple-200" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight">多原发肿瘤多学科协同支持 (Cross-Cancer MDT Support)</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-extrabold bg-purple-500/30 text-purple-200 border border-purple-400/30">
                  肺癌 ✕ 乳腺癌双原发 · 协同评估
                </span>
              </div>
              <p className="text-xs text-purple-200/80 mt-0.5">
                {combinationTitle} · 跨学科联合用药自检、多原发鉴别与全身排查共享
              </p>
            </div>
          </div>
        </div>

        {/* Tab 切换 */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-purple-800/60 overflow-x-auto pb-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("ddi")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "ddi"
                ? "bg-white text-purple-950 shadow-2xs"
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>跨癌种联合用药排查</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("pathology")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "pathology"
                ? "bg-white text-purple-950 shadow-2xs"
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span>多原发 vs 转移鉴别指南</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("m0")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 ${
              activeTab === "m0"
                ? "bg-white text-purple-950 shadow-2xs"
                : "text-purple-200 hover:text-white hover:bg-white/10"
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>全身 M0 排查跨科共享</span>
          </button>
        </div>
      </div>

      {/* 选项卡主体 */}
      <div className="p-4 sm:p-5">
        {/* TAB 1: 跨癌种联合用药排查 */}
        {activeTab === "ddi" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-200/70">
              <div className="flex items-start gap-3">
                <Zap className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-800">
                    临床警示：双原发肿瘤患者同时接受胸外科与乳腺外科/肿瘤内科治疗时，必须严密防范跨科处方的药学相互作用 (DDI)。
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    专科医生问诊时间有限，可能未全面掌握患者在另一医院或另一科室的处方清单。请利用 知癌维基 DDI 引擎在门诊前提前自检。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* 药学排雷点 1: 肝药酶代谢竞争 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  CYP2D6 & CYP3A4 肝药酶代谢竞争风险
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  乳腺癌他莫昔芬需经 CYP2D6 转化为高活性内皮昔芬；而肺癌靶向药、止痛药或止吐药若具有强酶抑制效应，可能导致乳腺癌内分泌疗效折损。
                </p>
              </div>

              {/* 药学排雷点 2: 心脏 QTc 与电解质监测 */}
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  心脏 QTc 间期延长与电解质叠加监测
                </div>
                <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                  第三代肺癌 EGFR-TKI（奥希替尼）与乳腺癌 CDK4/6 抑制剂（阿贝西利、哌柏西利）均有引起 QTc 间期延长的报告，合用需在专科指导下定期复查心电图与血生化。
                </p>
              </div>
            </div>

            {/* 匹配用药卡 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                检测到档案匹配用药：
                {[
                  lungTargetDrug && `肺癌: ${lungTargetDrug.name}`,
                  breastTargetDrug && `乳腺: ${breastTargetDrug.name}`,
                ].filter(Boolean).join(" + ")}
              </div>
              {onOpenDdiChecker && (
                <button
                  type="button"
                  onClick={() => onOpenDdiChecker(defaultDdiDrugId)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>启动双原发联合用药自检</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: 多原发 vs 转移鉴别指南 */}
        {activeTab === "pathology" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-sky-50/70 border border-sky-200/70">
              <div className="flex items-start gap-3">
                <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-800">
                    科学定心丸：新发孤立病灶不等于“晚期全身广泛转移”！
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    在临床实践中，乳腺癌术后复查发现的新发肺部结节（如磨玻璃结节 GGO），病理证实 80% 以上为<strong>独立原发早期肺癌</strong>，处于可胸腔镜微创根治阶段，绝不可盲目自我判定为“晚期肺转移”而放弃根治手术机会！
                  </p>
                </div>
              </div>
            </div>

            {/* 免疫组化金标准对比表格 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">
                肺癌 vs 乳腺癌病理免疫组化 (IHC) 鉴别金标准对照表
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                <div className="grid grid-cols-3 p-3 font-semibold text-slate-500 bg-slate-50/50 text-[11px]">
                  <span>病理标志物 (IHC)</span>
                  <span>原发肺癌特征</span>
                  <span>原发乳腺癌特征</span>
                </div>
                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-bold text-slate-800">TTF-1 / Napsin A</span>
                  <span className="text-sky-600 font-bold">原发肺腺癌强阳性 (90%+)</span>
                  <span className="text-slate-400">乳腺癌阴性 (-)</span>
                </div>
                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-bold text-slate-800">GATA-3 / Mammaglobin</span>
                  <span className="text-slate-400">肺癌阴性 (-)</span>
                  <span className="text-pink-600 font-bold">原发乳腺癌强阳性 (85%+)</span>
                </div>
                <div className="grid grid-cols-3 p-3 items-center">
                  <span className="font-bold text-slate-800">ER / PR / HER2</span>
                  <span className="text-slate-400">肺腺癌极少高表达</span>
                  <span className="text-pink-600 font-bold">分型关键指标 (阳性率高)</span>
                </div>
                <div className="grid grid-cols-3 p-3 items-center bg-slate-50/50">
                  <span className="font-bold text-slate-800">临床战术定位</span>
                  <span className="text-purple-700 font-bold col-span-2">
                    通过病理白片 TTF-1 与 GATA-3 等抗体联合染色，一锤定音判定为「第二原发早期」还是「单器官寡转移」，精准指导根治手术切除或系统靶免维持。
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: 全身 M0 排查跨科共享 */}
        {activeTab === "m0" && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/70">
              <div className="flex items-start gap-3">
                <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-800">
                    避免重复受照与奔波：各专科 M0 全身排查检查结果全面互认
                  </p>
                  <p className="text-slate-600 leading-relaxed">
                    胸外科与乳腺外科开具的<strong>头部增强 MRI、全身骨扫描 (ECT) 或全腹超声/CT</strong>，在 3~6 个月有效期内均被各专科互认，无需在跨科转诊时重复开单。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">脑部转移排查</div>
                <div className="font-bold mt-1 text-slate-800">增强 MRI</div>
                <div className="text-[10px] text-emerald-600 mt-1">胸外与乳腺互认</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">骨转移排查</div>
                <div className="font-bold mt-1 text-slate-800">全身 ECT 骨扫描</div>
                <div className="text-[10px] text-emerald-600 mt-1">胸外与乳腺互认</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">腹部转移排查</div>
                <div className="font-bold mt-1 text-slate-800">全腹超声 / 增强 CT</div>
                <div className="text-[10px] text-emerald-600 mt-1">胸外与乳腺互认</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">全身代谢排查</div>
                <div className="font-bold mt-1 text-slate-800">18F-FDG PET-CT</div>
                <div className="text-[10px] text-emerald-600 mt-1">高敏全面互认</div>
              </div>
            </div>

            {onSyncM0Checks && (
              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onSyncM0Checks();
                    setCopiedSync(true);
                    setTimeout(() => setCopiedSync(false), 2500);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>{copiedSync ? "排查检查单已同步" : "一键跨科同步全身排查数据"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
