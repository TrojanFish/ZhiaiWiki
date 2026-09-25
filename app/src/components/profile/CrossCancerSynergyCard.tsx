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
  AlertTriangle
} from "lucide-react";

interface CrossCancerSynergyCardProps {
  lungProfile?: PatientProfile | null;
  breastProfile?: PatientProfile | null;
  colonProfile?: PatientProfile | null;
  rectalProfile?: PatientProfile | null;
  colorectalProfile?: PatientProfile | null;
  gastricProfile?: PatientProfile | null;
  liverProfile?: PatientProfile | null;
  esophagealProfile?: PatientProfile | null;
  onOpenDdiChecker?: (recommendedDrugId?: string) => void;
  onSyncM0Checks?: () => void;
  className?: string;
}

export default function CrossCancerSynergyCard({
  lungProfile,
  breastProfile,
  colonProfile,
  rectalProfile,
  colorectalProfile,
  gastricProfile,
  liverProfile,
  esophagealProfile,
  onOpenDdiChecker,
  onSyncM0Checks,
  className = "",
}: CrossCancerSynergyCardProps) {
  const [activeTab, setActiveTab] = useState<"ddi" | "pathology" | "m0">("ddi");
  const [copiedSync, setCopiedSync] = useState(false);

  // 1. 动态识别已建档的全部原发癌种
  const presentCancers: Array<{ type: CancerType; label: string; profile: PatientProfile }> = [];
  if (lungProfile) presentCancers.push({ type: "lung", label: "原发性肺癌", profile: lungProfile });
  if (breastProfile) presentCancers.push({ type: "breast", label: "原发性乳腺癌", profile: breastProfile });
  if (colonProfile) presentCancers.push({ type: "colon", label: "原发性结肠癌", profile: colonProfile });
  if (rectalProfile) presentCancers.push({ type: "rectal", label: "原发性直肠癌", profile: rectalProfile });
  if (colorectalProfile && !colonProfile && !rectalProfile) {
    presentCancers.push({ type: "colorectal", label: "原发性结直肠癌", profile: colorectalProfile });
  }
  if (gastricProfile) presentCancers.push({ type: "gastric", label: "原发性胃癌", profile: gastricProfile });
  if (liverProfile) presentCancers.push({ type: "liver", label: "原发性肝癌", profile: liverProfile });
  if (esophagealProfile) presentCancers.push({ type: "esophageal", label: "原发性食管鳞癌", profile: esophagealProfile });

  if (presentCancers.length < 2) {
    return null;
  }

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

  const colorectalTargetDrug = React.useMemo(() => {
    const prof = colonProfile || rectalProfile || colorectalProfile;
    if (!prof) return null;
    const rawData = (prof as any).clinicalData || (prof as any).cancerSpecificData || {};
    const isRasMut = rawData.krasMutation && rawData.krasMutation !== "wildtype" && rawData.krasMutation !== "unknown";
    const isMsiH = rawData.msiStatus === "MSI-H" || rawData.dmmrStatus === "dMMR";
    if (isMsiH) {
      return { id: "pembrolizumab", name: "帕博利珠单抗 (MSI-H 免疫一线)" };
    }
    if (!isRasMut && rawData.primaryLocation === "left_colon") {
      return { id: "cetuximab", name: "西妥昔单抗 (抗 EGFR 单抗)" };
    }
    return { id: "bevacizumab", name: "贝伐珠单抗 (抗 VEGF 靶向)" };
  }, [colonProfile, rectalProfile, colorectalProfile]);

  const gastricTargetDrug = React.useMemo(() => {
    if (!gastricProfile) return null;
    const rawData = (gastricProfile as any).clinicalData || (gastricProfile as any).cancerSpecificData || (gastricProfile as any).gastricData || {};
    if (rawData.claudin182Status === "positive") {
      return { id: "zolbetuximab", name: "佐妥昔单抗 (Claudin 18.2 靶向)" };
    }
    if (rawData.her2Status === "positive") {
      return { id: "trastuzumab", name: "曲妥珠单抗 (HER2 靶向)" };
    }
    return { id: "capecitabine", name: "奥沙利铂+卡培他滨 (SOX/XELOX 方案)" };
  }, [gastricProfile]);

  const liverTargetDrug = React.useMemo(() => {
    if (!liverProfile) return null;
    const rawData = (liverProfile as any).clinicalData || (liverProfile as any).cancerSpecificData || (liverProfile as any).liverData || {};
    if (rawData.hbvStatus === "positive" || rawData.hbvDnaLoad) {
      return { id: "sintilimab", name: "信迪利单抗+贝伐珠单抗类似物 (双达方案)" };
    }
    return { id: "atezolizumab", name: "阿替利珠单抗+贝伐珠单抗 (T+A 靶免联合)" };
  }, [liverProfile]);

  const esophagealTargetDrug = React.useMemo(() => {
    if (!esophagealProfile) return null;
    const rawData = (esophagealProfile as any).clinicalData || (esophagealProfile as any).cancerSpecificData || {};
    if (rawData.pdl1Cps != null && Number(rawData.pdl1Cps) >= 10) {
      return { id: "camrelizumab", name: "卡瑞利珠单抗 (ESCORT-1st 一线联合)" };
    }
    return { id: "tislelizumab", name: "替雷利珠单抗 (RATIONALE-306 一线)" };
  }, [esophagealProfile]);

  const defaultDdiDrugId =
    lungTargetDrug?.id ||
    breastTargetDrug?.id ||
    colorectalTargetDrug?.id ||
    gastricTargetDrug?.id ||
    liverTargetDrug?.id ||
    esophagealTargetDrug?.id ||
    "osimertinib";

  // 3. 动态识别是否有高危重叠相互作用风险
  const hasAntiVegfOverlap = Boolean(
    (liverProfile || colorectalProfile || colonProfile) &&
    (esophagealProfile || gastricProfile)
  );

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
                  {presentCancers.length} 癌共存 · 协同评估
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
                    临床警示：多原发肿瘤患者同时接受多专科治疗时，必须严密防范跨科处方的药学相互作用 (DDI)。
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

              {/* 药学排雷点 2: 抗血管穿孔与出血风险 */}
              {hasAntiVegfOverlap ? (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-rose-900">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    消化道穿孔与食管胃底大出血高危预警
                  </div>
                  <p className="text-[11px] text-rose-700 mt-2 leading-relaxed">
                    肝癌或肠癌使用的抗血管靶向药（贝伐珠单抗、仑伐替尼、安罗替尼）可加重黏膜坏死。若患者合并食管癌（尤其侵犯气管/主动脉）或胃癌溃疡，严禁盲目联合强效抗凝药物！
                  </p>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center gap-2 font-bold text-xs text-slate-900">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    心脏 QTc 间期延长与电解质叠加监测
                  </div>
                  <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                    第三代肺癌 EGFR-TKI（奥希替尼）与乳腺癌 CDK4/6 抑制剂或胃癌氟尿嘧啶类均有引起 QTc 间期延长的报告，合用需在心内科指导下监测心电图。
                  </p>
                </div>
              )}
            </div>

            {/* 匹配用药卡 */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <div className="text-xs text-slate-500">
                检测到档案匹配用药：
                {[
                  lungTargetDrug && `肺癌: ${lungTargetDrug.name}`,
                  breastTargetDrug && `乳腺: ${breastTargetDrug.name}`,
                  colorectalTargetDrug && `肠癌: ${colorectalTargetDrug.name}`,
                  gastricTargetDrug && `胃癌: ${gastricTargetDrug.name}`,
                  liverTargetDrug && `肝癌: ${liverTargetDrug.name}`,
                  esophagealTargetDrug && `食管: ${esophagealTargetDrug.name}`,
                ].filter(Boolean).join(" + ")}
              </div>
              {onOpenDdiChecker && (
                <button
                  type="button"
                  onClick={() => onOpenDdiChecker(defaultDdiDrugId)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Pill className="w-3.5 h-3.5" />
                  <span>启动多原发联合用药自检</span>
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
                    在临床实践中，消化道或乳腺癌术后复查发现的新发单发病灶（如肺部磨玻璃结节、胃壁黏膜增厚或肝内孤立结节），病理证实 80% 以上为<strong>独立第二原发癌</strong>，处于早期可手术根治阶段，绝不可盲目自我判定为“晚期转移”而放弃根治机会！
                  </p>
                </div>
              </div>
            </div>

            {/* 免疫组化金标准对比表格 */}
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-100 px-3.5 py-2 text-xs font-bold text-slate-700">
                病理免疫组化 (IHC) 鉴别金标准对照表
              </div>
              <div className="divide-y divide-slate-200 text-xs">
                {/* 结直肠癌特征 */}
                {(colonProfile || rectalProfile || colorectalProfile) && (
                  <>
                    <div className="grid grid-cols-3 p-3 font-semibold text-slate-500 bg-slate-50/50 text-[11px]">
                      <span>病理标志物 (IHC)</span>
                      <span>结直肠原发癌特征</span>
                      <span>其他器官转移特征</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="font-bold text-slate-800">CDX-2 / SATB2</span>
                      <span className="text-emerald-600 font-bold">强弥漫阳性 (95%+)</span>
                      <span className="text-slate-400">肺癌/乳腺癌通常阴性 (-)</span>
                    </div>
                    <div className="grid grid-cols-3 p-3 items-center">
                      <span className="font-bold text-slate-800">CK20 / CK7</span>
                      <span className="text-emerald-600 font-bold">CK20(+) / CK7(-)</span>
                      <span className="text-sky-600 font-bold">肺/乳腺/胃常见 CK7(+)</span>
                    </div>
                  </>
                )}

                {/* 肺癌特征 */}
                {lungProfile && (
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-bold text-slate-800">TTF-1 / Napsin A</span>
                    <span className="text-sky-600 font-bold">原发肺腺癌强阳性 (90%+)</span>
                    <span className="text-slate-400">结直肠/乳腺转移灶绝对阴性 (-)</span>
                  </div>
                )}

                {/* 乳腺癌特征 */}
                {breastProfile && (
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-bold text-slate-800">GATA-3 / Mammaglobin</span>
                    <span className="text-pink-600 font-bold">原发乳腺癌强阳性 (85%+)</span>
                    <span className="text-slate-400">消化道原发灶通常阴性 (-)</span>
                  </div>
                )}

                {/* 肝癌特征 */}
                {liverProfile && (
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-bold text-slate-800">HepPar-1 / Arginase-1</span>
                    <span className="text-emerald-600 font-bold">原发性肝细胞癌强阳性 (90%+)</span>
                    <span className="text-slate-400">结肠/胃转移灶阴性 (辨识原发肝癌 vs 转移)</span>
                  </div>
                )}

                {/* 胃癌特征 */}
                {gastricProfile && (
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-bold text-slate-800">Claudin 18.2 / MUC5AC</span>
                    <span className="text-indigo-600 font-bold">胃腺癌特异性标志物</span>
                    <span className="text-slate-400">与其他实体瘤显著区分</span>
                  </div>
                )}

                {/* 食管鳞癌特征 */}
                {esophagealProfile && (
                  <div className="grid grid-cols-3 p-3 items-center">
                    <span className="font-bold text-slate-800">P40 / P63 / CK5/6</span>
                    <span className="text-purple-600 font-bold">鳞状细胞癌特异性强阳性 (95%+)</span>
                    <span className="text-slate-400">与腺癌（TTF-1/CDX2）完全阴阳分流</span>
                  </div>
                )}

                <div className="grid grid-cols-3 p-3 items-center bg-slate-50/50">
                  <span className="font-bold text-slate-800">临床战术定位</span>
                  <span className="text-purple-700 font-bold col-span-2">
                    通过病理白片多抗体染色，一锤定音判定为「第二原发早期」或「单器官寡转移」，精准指导根治手术切除或系统靶免维持。
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
                    胸外科、乳腺外科、普外科及肝胆外科开具的<strong>头部增强 MRI、全身骨扫描 (ECT) 或全腹增强 CT</strong>，在 3~6 个月有效期内均被各专科互认，无需在跨科转诊时重复开单。
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">脑部转移排查</div>
                <div className="font-bold mt-1 text-slate-800">增强 MRI</div>
                <div className="text-[10px] text-emerald-600 mt-1">两科互认共用</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">骨转移排查</div>
                <div className="font-bold mt-1 text-slate-800">全身 ECT 骨扫描</div>
                <div className="text-[10px] text-emerald-600 mt-1">两科互认共用</div>
              </div>

              <div className="p-2.5 rounded-xl border border-slate-200 bg-slate-50">
                <div className="text-[11px] text-slate-500">腹盆转移排查</div>
                <div className="font-bold mt-1 text-slate-800">全腹增强 CT / MRI</div>
                <div className="text-[10px] text-emerald-600 mt-1">两科互认共用</div>
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
                  className="px-3.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200:bg-slate-700 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
