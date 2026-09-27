"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  X, 
  Download, 
  Share2, 
  Check, 
  Users, 
  Scan, 
  Ruler, 
  Microscope, 
  Activity, 
  AlertTriangle,
  Sun,
  Dna,
  ClipboardList,
  Copy,
  Printer,
  CheckSquare,
  Square,
  HelpCircle,
  FileText,
  Stethoscope,
  Info,
  Star
} from "lucide-react";
import { toPng } from "html-to-image";
import type { PatientProfile } from "@/lib/types";
import { getClinicalCohortUnified } from "@/lib/stagingRegistry";
import { ZHIAIWIKI_LOGO_DATA_URI } from "@/lib/brandLogo";
import ExportBrandFooter from "@/components/common/ExportBrandFooter";

interface ProfileExportModalProps {
  profile: PatientProfile;
  onClose: () => void;
}

interface QuestionItem {
  id: string;
  category: string;
  text: string;
  rationale: string;
  priority: "high" | "normal";
}

export default function ProfileExportModal({ profile, onClose }: ProfileExportModalProps) {
  const [activeMode, setActiveMode] = useState<"poster" | "consultation">("poster");
  const [isExporting, setIsExporting] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [checkedQuestionIds, setCheckedQuestionIds] = useState<string[]>([]);
  const offscreenPosterRef = useRef<HTMLDivElement>(null);

  const cohort = getClinicalCohortUnified(profile);

  // Safe Factor Checks
  const isStasSafe = profile.stas === 'negative' || (profile.stas as any) === false;
  const isLviSafe = profile.lvi === 'negative' || (profile.lvi as any) === false;
  const isVpiSafe = profile.vpi === 'negative' || (profile.vpi as any) === false;
  const isMarginSafe = profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false;
  const isN0Safe = profile.nStage === 'N0' || profile.lymphNodes === 'N0';
  const isGrade3 = profile.iaslcGrade === '3' || profile.grade === '3';
  const _isAllSafe = isStasSafe && isLviSafe && isVpiSafe && isN0Safe && isMarginSafe && !isGrade3;
  const isFemale = (profile.gender as string) === 'female' || (profile.sex as string) === 'female' || (profile.gender as string) === '女' || (profile.sex as string) === '女';
  const isMale = (profile.gender as string) === 'male' || (profile.sex as string) === 'male' || (profile.gender as string) === '男' || (profile.sex as string) === '男';
  const genderText = isFemale ? '女性' : isMale ? '男性' : '患者';

  const isBreast = profile.cancerType === 'breast';

  const noduleLabel = profile.noduleType === 'pure_ggo' 
    ? '纯磨玻璃结节 (pGGO)' 
    : profile.noduleType === 'pure_solid' 
    ? '纯实性结节 (Solid)' 
    : '混合磨玻璃结节 (mGGO)';

  const currentDateStr = new Date().toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).replace(/\//g, "-");

  // Dynamic Consultation Questions Engine
  const consultationQuestions = useMemo<QuestionItem[]>(() => {
    const isPostSurgery = Boolean(
      profile.surgeryType || 
      profile.histology || 
      profile.margin || 
      (profile.stage && !['0', 'Tis', '结节随访期', '待定'].includes(profile.stage))
    );

    if (isBreast) {
      if (isPostSurgery) {
        return [
          {
            id: "q_b_receptor",
            category: "受体与分型",
            text: "病理报告中 ER / PR 阳性百分比是多少？HER2 属于阳性 (3+)、低表达 (HER2-Low: 1+ 或 2+/FISH-) 还是纯阴性？若为 HER2-Low，未来是否有使用德曲妥珠单抗 (T-DXd) 的后线指征？",
            rationale: "依据 DESTINY-Breast04 顶刊证据，HER2-Low 改变了传统阴性分类，为抗体偶联药物 (ADC) 提供了精准治疗靶点。",
            priority: "high"
          },
          {
            id: "q_b_margin",
            category: "切缘与淋巴结",
            text: "保乳手术标本切缘是否达到国家规范'No Ink on Tumor（墨汁未染癌）'标准？前哨淋巴结 (SLNB) 是否排查了微转移或孤立肿瘤细胞 (ITC)？",
            rationale: "阴性切缘是保乳局部根治基石；淋巴结微转移决定后续是否需要加做腋窝清扫或局部放疗。",
            priority: "high"
          },
          {
            id: "q_b_genomic",
            category: "化疗豁免评估",
            text: "针对 HR+ HER2- 早期病灶，是否建议送检 21 基因复发风险评分 (Oncotype DX RS) 以科学评估能否免除辅助化疗？",
            rationale: "依据 TAILORx 与 RxPONDER 大型前瞻性 III 期 RCT 证据，RS 低危者化疗获益极小，单纯行内分泌治疗可获得极高生存，避免过度化疗副作用。",
            priority: "high"
          },
          {
            id: "q_b_endocrine",
            category: "内分泌强化",
            text: "针对当前绝经状态（绝经前/后），内分泌方案选择他莫昔芬还是芳香化酶抑制剂 (AI)？绝经前是否需要联用卵巢功能抑制 (OFS 停经针)？高危淋巴结阳性患者是否建议联合 CDK4/6 抑制剂（阿贝西利 2 年）强化？",
            rationale: "依据 SOFT/TEXT 与 monarchE 试验证实，高危人群强化内分泌或联合靶向能显著降低远期复发转移风险。",
            priority: "high"
          },
          {
            id: "q_b_followup",
            category: "随访与骨健康",
            text: "服药期间多长时间复查一次乳腺超声、钼靶与子宫内膜超声？如何监测双能骨密度 (DXA) 以预防内分泌药物引起的骨质疏松与关节酸痛？如何预防患侧上肢淋巴水肿？",
            rationale: "芳香化酶抑制剂易致骨量流失，他莫昔芬需警惕内膜增厚，需建立个体化长程随访台账。",
            priority: "normal"
          }
        ];
      } else {
        return [
          {
            id: "q_b_birads",
            category: "穿刺指征",
            text: "超声或钼靶提示 BI-RADS 分类为几类？是否达到建议空心针穿刺活检 (CNB) 的指征？",
            rationale: "BI-RADS 4 类以上恶性风险明显上升，粗针穿刺活检是病理确诊与受体鉴定的金标准。",
            priority: "high"
          },
          {
            id: "q_b_biopsy_ihc",
            category: "受体检测",
            text: "穿刺活检标本能否同步完成 ER、PR、HER2 与 Ki-67 核心四项免疫组化？",
            rationale: "分子受体分型直接决定术前新辅助治疗方案或手术切除决策。",
            priority: "high"
          },
          {
            id: "q_b_mri",
            category: "影像评估",
            text: "致密型腺体或多发结节，是否建议加做乳腺增强 MRI 进一步评估病灶范围与多中心病灶？",
            rationale: "乳腺增强 MRI 对微小卫星灶及对侧病灶有极高灵敏度，辅助精准手术切缘规划。",
            priority: "normal"
          }
        ];
      }
    } else {
      // Lung Cancer
      if (isPostSurgery) {
        return [
          {
            id: "q_l_margin",
            category: "根治切缘",
            text: "病理报告确认切缘为充分的 R0 根治性阴性吗？切缘距肿瘤边缘的安全距离是否 ≥2cm 或大于肿瘤最大径？",
            rationale: "确保局部无残留显微肿瘤细胞，达到根治性切除金标准。",
            priority: "high"
          },
          {
            id: "q_l_highrisk",
            category: "病理高危排查",
            text: "病理切片是否排查了气道播散 (STAS)、脏层胸膜侵犯 (VPI) 或脉管癌栓 (LVI)？组织学亚型中是否含有微乳头或实体型高危成分？",
            rationale: "微观高危浸润因素直接影响术后复发风险分层及后续随访监控密度。",
            priority: "high"
          },
          {
            id: "q_l_driver",
            category: "驱动基因靶向",
            text: "是否完成了 EGFR / ALK / ROS1 等核心驱动基因 NGS 检测？如果存在 EGFR 敏感突变，依据 ADAURA 试验，术后是否有辅助靶向（奥希替尼）获益及医保报销政策？",
            rationale: "明确是否存在靶向治疗靶点，评估术后靶向强化是否优于纯规律随访。",
            priority: "high"
          },
          {
            id: "q_l_followup",
            category: "随访复查节奏",
            text: "术后复查按多大间隔做薄层高分辨 HRCT（3 个月还是 6 个月）？CEA、CYFRA21-1 等血清肿瘤标志物是否建议同步复查作为动态基线对比？",
            rationale: "建立规范随访节奏，以胸部 CT 影像为金标准，结合标志物长程趋势辅助排查。",
            priority: "normal"
          }
        ];
      } else {
        return [
          {
            id: "q_l_trend",
            category: "影像对比",
            text: "对比往年体检 CT 老片，当前结节全径与实性成分 (CTR) 是否有明显增大或密度增高？",
            rationale: "评估病灶生长动力学（体积倍增时间 VDT）。",
            priority: "high"
          },
          {
            id: "q_l_interval",
            category: "随访间隔",
            text: "根据 Fleischner 结节指南与结节体积倍增时间 (VDT)，建议下次复查薄层 HRCT 的间隔时间是 3 个月还是 6 个月？",
            rationale: "明确复查节奏，避免过频辐射暴露或延误干预时机。",
            priority: "high"
          },
          {
            id: "q_l_signs",
            category: "征象评估",
            text: "当前结节形态是否伴有分叶、毛刺或胸膜凹陷征？是否有微创手术干预或穿刺指征？",
            rationale: "评估病灶恶性概率与微创胸外科干预窗口。",
            priority: "normal"
          }
        ];
      }
    }
  }, [profile, isBreast]);

  // Default check all questions on load
  useEffect(() => {
    if (consultationQuestions.length > 0) {
      setCheckedQuestionIds(consultationQuestions.map((q) => q.id));
    }
  }, [consultationQuestions]);

  const handleToggleQuestion = (id: string) => {
    setCheckedQuestionIds((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAllQuestions = () => {
    if (checkedQuestionIds.length === consultationQuestions.length) {
      setCheckedQuestionIds([]);
    } else {
      setCheckedQuestionIds(consultationQuestions.map((q) => q.id));
    }
  };

  const handleCopyQuestions = () => {
    const selected = consultationQuestions.filter((q) => checkedQuestionIds.includes(q.id));
    const listToCopy = selected.length > 0 ? selected : consultationQuestions;

    const content = [
      `【知癌维基 门诊就诊问询清单】`,
      `患者信息：${genderText} · ${profile.age ? `${profile.age}岁 · ` : ''}${isBreast ? '乳腺专区' : '肺癌专区'} · 临床分期: ${profile.stage || '待定'}`,
      `生成日期：${currentDateStr}`,
      `----------------------------------------`,
      ...listToCopy.map((q, idx) => `${idx + 1}. [${q.category}] ${q.text}\n   临床依据：${q.rationale}`),
      `----------------------------------------`,
      `（由 知癌维基 (ZhiaiWiki) 临床循证对照系统生成，供门诊向主治医师咨询沟通使用）`
    ].join('\n\n');

    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2500);
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleGenerateImage = async (): Promise<string | null> => {
    if (!offscreenPosterRef.current) return null;
    try {
      setIsExporting(true);
      setGenerationError(null);

      const element = offscreenPosterRef.current;
      
      // Ensure document fonts and layouts are settled
      if (typeof document !== "undefined" && (document as any).fonts) {
        try {
          await (document as any).fonts.ready;
        } catch {}
      }
      await new Promise((r) => setTimeout(r, 150));

      let imgData = "";
      
      // Engine 1: html-to-image with fontEmbedCSS bypass for Next.js/Tailwind CORS protection
      try {
        imgData = await toPng(element, {
          quality: 0.98,
          pixelRatio: 2,
          skipAutoScale: true,
          fontEmbedCSS: "",
          backgroundColor: "#ffffff",
          cacheBust: true,
        });
      } catch (primaryErr) {
        console.warn("Primary html-to-image failed, trying html2canvas fallback:", primaryErr);
      }

      // Engine 2: html2canvas fallback with precise viewport bounds
      if (!imgData || imgData.length < 500) {
        try {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await html2canvas(element, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#ffffff",
            logging: false,
            scrollX: 0,
            scrollY: 0,
            x: 0,
            y: 0,
            width: 600,
            windowWidth: 1200,
          });
          imgData = canvas.toDataURL("image/png");
        } catch (secondaryErr) {
          console.error("Secondary html2canvas also failed:", secondaryErr);
        }
      }

      if (imgData && imgData.length >= 500) {
        setExportedImageUrl(imgData);
        return imgData;
      } else {
        throw new Error("生成长图数据为空");
      }
    } catch (err: any) {
      console.error("Failed to generate profile export poster:", err);
      setGenerationError("生成长图遇到限制，请点击下方重试或使用系统截图。");
      return null;
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleGenerateImage();
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  // Support Esc key to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleDownload = async () => {
    let imgUrl = exportedImageUrl;
    if (!imgUrl) {
      imgUrl = await handleGenerateImage();
    }
    if (!imgUrl) return;

    try {
      const a = document.createElement("a");
      a.href = imgUrl;
      a.download = `ZhiaiWiki-患者数字档案-${profile.stage || "临床"}-${currentDateStr}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch (downloadErr) {
      console.error("Download failed:", downloadErr);
    }
  };

  return (
    <>
      <div 
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 bg-slate-950/60 backdrop-blur-md animate-fade-in overflow-hidden sm:overflow-y-auto print:hidden"
      >
      {/* Modal Container */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className={`relative w-full ${
          activeMode === "consultation" ? "max-w-2xl" : "max-w-lg"
        } bg-white border-t sm:border border-slate-200 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] max-h-[92dvh] text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0 transition-[max-width] duration-200`}
      >
        {/* iOS HIG Sheet Grabber for Mobile */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
          <div className="sheet-grabber !my-0" />
        </div>
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-100 bg-white shrink-0 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-bold shrink-0 ${
                isBreast ? "bg-pink-50 text-pink-600" : "bg-blue-50 text-blue-600"
              }`}>
                {activeMode === "poster" ? <Share2 className="w-4 h-4" /> : <Stethoscope className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-snug">
                  患者数字档案 · 临床沟通与多模态导出
                </h2>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  一站式生成高清全景速览长图与门诊就诊问询清单
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors cursor-pointer shrink-0"
              aria-label="关闭"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Dual-Mode Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveMode("poster")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeMode === "poster"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <Share2 className="w-3.5 h-3.5 shrink-0 text-blue-600" />
              <span>临床档案长图</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveMode("consultation")}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all cursor-pointer ${
                activeMode === "consultation"
                  ? "bg-white text-slate-900 shadow-xs font-extrabold"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <ClipboardList className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
              <span>门诊就诊问询单</span>
              <span className="text-[10px] px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full font-mono">
                {consultationQuestions.length}
              </span>
            </button>
          </div>
        </div>

        {/* ================= MODE 1: POSTER PREVIEW ================= */}
        {activeMode === "poster" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/80 flex flex-col items-center justify-center min-h-[360px]">
              {isExporting && (
                <div className="flex flex-col items-center justify-center py-16 space-y-3">
                  <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-600 rounded-full animate-spin" />
                  <div className="text-xs font-bold text-slate-700">
                    正在高保真渲染患者数字档案长图...
                  </div>
                  <div className="text-[11px] text-slate-400">
                    已自动整合 T/N/M 临床分期、病理指标与 5 年生存率
                  </div>
                </div>
              )}

              {generationError && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-rose-900 text-xs text-center space-y-3 max-w-sm shadow-xs">
                  <AlertTriangle className="w-5 h-5 text-rose-600 mx-auto" />
                  <p className="font-medium">{generationError}</p>
                  <button
                    type="button"
                    onClick={() => handleGenerateImage()}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    点击重试生成
                  </button>
                </div>
              )}

              {exportedImageUrl && !isExporting && (
                <div className="w-full flex flex-col items-center space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl max-h-[58vh] overflow-y-auto bg-slate-100">
                    <img
                      src={exportedImageUrl}
                      alt="患者临床数字档案全景速览卡"
                      className="w-full h-auto object-contain rounded-2xl"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                    <span>手机端可长按上方图片直接保存到相册；电脑端请点击下方下载按钮。</span>
                  </p>
                </div>
              )}
            </div>

            {/* Footer for Poster Mode */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                关闭窗口
              </button>

              <button
                type="button"
                onClick={handleDownload}
                disabled={isExporting}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  downloadSuccess 
                    ? "bg-emerald-600 text-white shadow-emerald-500/20" 
                    : "btn-primary text-white shadow-blue-500/20 disabled:opacity-60"
                }`}
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>已成功保存到本地</span>
                  </>
                ) : isExporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin shrink-0" />
                    <span>正在渲染高清长图...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>保存档案长图 (PNG)</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* ================= MODE 2: DOCTOR CONSULTATION SHEET ================= */}
        {activeMode === "consultation" && (
          <>
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 space-y-4 min-h-[360px]">
              {/* Patient Quick Context Card */}
              <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm">
                      {isBreast ? "乳腺肿瘤专区" : "肺部肿瘤专区"}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-600">{genderText}</span>
                    {profile.age && <span className="font-mono text-slate-600">{profile.age} 岁</span>}
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs border ${
                    isBreast ? "bg-pink-50 text-pink-700 border-pink-200" : "bg-teal-50 text-teal-700 border-teal-200"
                  }`}>
                    当前分期: {profile.stage || "临床待评"}
                  </span>
                </div>

                {/* Doctor Visit Rule Tip */}
                <div className="p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/80 flex items-start gap-2 text-[11px] text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed font-medium">
                    <strong>门诊高效沟通法则：</strong>三甲医院门诊平均交流时间为 3~5 分钟。系统已根据您的临床档案预筛核心关键问题，建议勾选最关心的 3~4 条重点向主治医师当面咨询。
                  </p>
                </div>
              </div>

              {/* Checklist Group */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-indigo-600" />
                    <span>门诊建议咨询清单（已选 {checkedQuestionIds.length} / {consultationQuestions.length} 项）</span>
                  </span>
                  <button
                    type="button"
                    onClick={handleSelectAllQuestions}
                    className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                  >
                    {checkedQuestionIds.length === consultationQuestions.length ? "清空勾选" : "全部勾选"}
                  </button>
                </div>

                <div className="space-y-2.5">
                  {consultationQuestions.map((item, idx) => {
                    const isChecked = checkedQuestionIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleQuestion(item.id)}
                        className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer select-none space-y-2 ${
                          isChecked 
                            ? "bg-white border-indigo-400 ring-2 ring-indigo-100 shadow-xs" 
                            : "bg-slate-50/70 border-slate-200 opacity-75 hover:opacity-100 hover:bg-white"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <button
                            type="button"
                            className="mt-0.5 text-indigo-600 shrink-0 cursor-pointer"
                            aria-label={isChecked ? "取消勾选" : "勾选问题"}
                          >
                            {isChecked ? (
                              <CheckSquare className="w-4 h-4 text-indigo-600" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          <div className="flex-1 min-w-0 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                                #{idx + 1} {item.category}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                item.priority === "high" 
                                  ? "bg-rose-50 text-rose-700 border border-rose-200" 
                                  : "bg-blue-50 text-blue-700 border border-blue-200"
                              }`}>
                                {item.priority === "high" && <Star className="w-2.5 h-2.5 fill-rose-500 text-rose-500 shrink-0" />}
                                <span>{item.priority === "high" ? "高优先级必问" : "常规随访问询"}</span>
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-snug">
                              {item.text}
                            </p>

                            <p className="text-[11px] text-slate-500 leading-relaxed">
                              <strong className="text-slate-600">循证依据：</strong>
                              {item.rationale}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer for Consultation Mode */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                关闭
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all flex items-center gap-1.5 cursor-pointer border border-slate-200"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印 A4 单</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyQuestions}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md active:scale-95 ${
                    copySuccess 
                      ? "bg-emerald-600 text-white shadow-emerald-500/20" 
                      : "btn-primary text-white shadow-blue-500/20"
                  }`}
                >
                  {copySuccess ? (
                    <>
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>已复制问询清单</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>一键复制清单</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* OFFSCREEN DOM TO RENDER FOR HIGH RES POSTER (Fixed 600px Width, Precise Geometry at 0,0) */}
      <div 

        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "600px",
          zIndex: -9999,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <div
          ref={offscreenPosterRef}
          className="w-[600px] text-slate-900 p-7 font-sans relative overflow-hidden"
          style={{
            fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            background: "#FFFFFF",
            border: "1.5px solid #E2E8F0",
            boxSizing: "border-box",
            margin: 0,
          }}
        >
          {/* Header Brand */}
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-white border border-slate-200">
                <img src={ZHIAIWIKI_LOGO_DATA_URI} alt="ZhiaiWiki Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                  <span>知癌维基 ZhiaiWiki</span>
                  <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    循证医学
                  </span>
                </div>
                <div className="text-[10px] text-slate-500">
                  患者临床数字档案 · 循证全景速览卡
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] text-slate-400 font-mono">
                档案生成日期
              </div>
              <div className="text-xs font-bold text-slate-700 font-mono">
                {currentDateStr}
              </div>
            </div>
          </div>

          {/* SECTION 1: Patient Basic Profile & Clinical Diagnosis */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 relative z-10 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <div className="flex items-center gap-2">
                <div className="text-sm font-extrabold text-slate-900">
                  {(profile as any).name || "患者数字档案"}
                </div>
                <span className="text-[11px] text-slate-700 font-semibold px-2 py-0.5 bg-slate-200/80 rounded-md">
                  {profile.age ? `${profile.age} 岁 · ` : ''}{genderText}
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                {profile.stage ? `${profile.stage} 期` : "待定分期"} ({profile.tStage || "Tx"} {profile.nStage || "N0"} {profile.mStage || "M0"})
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Scan className="w-3 h-3 text-blue-600" />
                  <span>{isBreast ? "肿块部位与影像" : "结节形态与部位"}</span>
                </span>
                <div className="font-bold text-slate-800 text-[11px]">
                  {isBreast
                    ? `${profile.noduleLocation || (profile.cancerSpecificData as any)?.breastLaterality || "乳腺病灶"} · ${profile.biRads ? `BI-RADS ${profile.biRads}类` : "待影像学确认"}`
                    : `${profile.noduleLocation || "肺部病灶"} · ${profile.tumorSize != null ? noduleLabel.split(" ")[0] : "待影像学确认"}`
                  }
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white border border-slate-200 space-y-1">
                <span className="text-[10px] text-slate-500 flex items-center gap-1">
                  <Ruler className="w-3 h-3 text-teal-600" />
                  <span>{isBreast ? "肿块大小与伴随钙化" : "结节全径与实性浸润"}</span>
                </span>
                <div className="font-bold text-slate-800 text-[11px]">
                  {isBreast
                    ? `病灶全径 ${profile.tumorSize != null ? `${profile.tumorSize} cm` : "待测"} ${profile.calcificationType ? `· ${profile.calcificationType}` : ""}`
                    : (profile.tumorSize == null && profile.solidSize == null
                      ? "未提供 CT 报告 · 结节大小待查"
                      : profile.noduleType === 'pure_solid' || (profile.ctr != null && profile.ctr >= 1.0)
                      ? `病灶全径 ${profile.tumorSize != null ? `${profile.tumorSize} cm` : "未录入"} · 纯实性 (CTR: 1.0)`
                      : profile.noduleType === 'pure_ggo' || (profile.ctr != null && profile.ctr === 0)
                      ? `结节全径 ${profile.tumorSize != null ? `${profile.tumorSize} cm` : "未录入"} · 纯磨玻璃 (CTR: 0)`
                      : `全径 ${profile.tumorSize != null ? `${profile.tumorSize} cm` : "未录入"} / 实性 ${profile.solidSize != null ? `${profile.solidSize} cm` : "微小"} (CTR: ${profile.ctr != null ? profile.ctr : (profile.solidSize && profile.tumorSize ? Math.round((profile.solidSize / profile.tumorSize) * 100) / 100 : '未定')})`
                    )
                  }
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: 5-Year Survival Benchmark (Prognosis High-Light Card) */}
          <div className="bg-gradient-to-br from-blue-50/80 via-white to-teal-50/80 rounded-2xl p-4.5 border border-teal-200 mb-4 relative z-10 space-y-3">
            <div className="flex items-center justify-between border-b border-teal-100 pb-2">
              <div>
                <span className="text-[10px] font-bold text-teal-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-teal-600" />
                  <span>SIMILAR CLINICAL COHORTS · 国际顶刊相似队列</span>
                </span>
                <div className="text-xs font-extrabold text-slate-900 mt-0.5">
                  匹配到 {cohort.cohortSize.toLocaleString()} 例特征相似的真实世界患者
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                {cohort.confidenceRating} {cohort.confidenceLevel.split(" ")[0]}
              </span>
            </div>

            {/* Large 2-Metric High-Gloss Grid */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3.5 bg-white rounded-xl border border-blue-200">
                <div className="text-[10px] text-blue-700 font-bold">5年无复发生存率 (RFS)</div>
                <div className="text-2xl sm:text-3xl font-black text-blue-700 font-mono tracking-tight my-0.5">
                  {cohort.rfs5Year}
                </div>
                <div className="text-[9px] text-slate-500">临床治愈与无瘤生存指标</div>
              </div>

              <div className="p-3.5 bg-white rounded-xl border border-emerald-200">
                <div className="text-[10px] text-emerald-700 font-bold">5年总生存率 (OS)</div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-700 font-mono tracking-tight my-0.5">
                  {cohort.os5Year}
                </div>
                <div className="text-[9px] text-slate-500">长期健在终极金标准</div>
              </div>
            </div>

            <div className="text-[10px] text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200">
              <span className="text-slate-400">文献来源：</span>
              <strong className="text-blue-700">{cohort.source}</strong> · {cohort.description}
            </div>
          </div>

          {/* SECTION 3: Micro Pathology & Invasive Factors Matrix */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 relative z-10 space-y-2.5">
            <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Microscope className="w-3.5 h-3.5 text-purple-600" />
                <span>{isBreast ? "组织病理与分子免疫组化 (IHC)" : "组织病理与浸润微观指标排查"}</span>
              </span>
              <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                {isBreast 
                  ? (profile.surgeryType ? (profile.surgeryType === 'lumpectomy' ? '保乳术式' : profile.surgeryType === 'mastectomy' ? '全切术式' : '手术病理') : '病理金标准')
                  : (profile.surgeryType ? (profile.surgeryType === 'segmentectomy' ? '解剖性肺段' : '根治术式') : '金标准')
                }
              </span>
            </div>

            {isBreast ? (
              <>
                <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-[11px] text-purple-900">
                  <span>分子分型: <strong className="text-purple-800">{profile.molecularSubtype ? profile.molecularSubtype.replace(/_/g, ' ') : '待病理评估'}</strong></span>
                  <span>浸润大小: <strong className="text-purple-800">{profile.pathologyInvasiveSize != null ? `${profile.pathologyInvasiveSize} cm` : (profile.tumorSize ? `${profile.tumorSize} cm` : '待测')}</strong></span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">ER 雌激素受体</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${profile.erStatus === 'positive' ? "text-emerald-700" : "text-slate-500"}`}>
                      {profile.erPercent != null ? `${profile.erPercent}% (${profile.erStatus === 'positive' ? '阳性' : '阴性'})` : (profile.erStatus === 'positive' ? '阳性' : profile.erStatus === 'negative' ? '阴性' : '待查')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">PR 孕激素受体</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${profile.prStatus === 'positive' ? "text-emerald-700" : "text-slate-500"}`}>
                      {profile.prPercent != null ? `${profile.prPercent}% (${profile.prStatus === 'positive' ? '阳性' : '阴性'})` : (profile.prStatus === 'positive' ? '阳性' : profile.prStatus === 'negative' ? '阴性' : '待查')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">HER2 状态</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${profile.her2Fish === 'amplified' || profile.her2Status === '3+' ? "text-amber-700" : profile.her2Low ? "text-blue-700" : "text-emerald-700"}`}>
                      {profile.her2Fish === 'amplified' ? '阳性 (FISH)' : profile.her2Status === '3+' ? '阳性 (3+)' : profile.her2Low ? 'HER2 低表达' : (profile.her2Status === '0' || profile.her2Status === 'negative' ? '阴性 (0)' : profile.her2Status || '待查')}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">切缘状态 (R0)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${isMarginSafe ? "text-emerald-700" : "text-rose-600"}`}>
                      {isMarginSafe ? "R0 阴性安全" : "阳性 (有残留)"}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">前哨淋巴结 (SLNB)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${isN0Safe ? "text-emerald-700" : "text-amber-700"}`}>
                      {profile.sentinelNodesTotal != null ? `${profile.sentinelNodesPositive ?? 0}/${profile.sentinelNodesTotal} 阳性` : (isN0Safe ? "0 阳性 (N0)" : profile.nStage || "待活检")}
                    </div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">组织学分级</div>
                    <div className="font-bold text-[11px] mt-0.5 text-slate-800">
                      {profile.nottinghamGrade ? `Grade ${profile.nottinghamGrade}` : (profile.grade ? `G${profile.grade}` : "待确认")}
                    </div>
                  </div>
                </div>

                {profile.oncotypeDxScore != null ? (
                  <div className="p-2 bg-indigo-50 rounded-xl border border-indigo-200 flex items-center justify-between text-[11px]">
                    <span className="text-indigo-900 font-semibold flex items-center gap-1">
                      <Dna className="w-3 h-3 text-indigo-600" />
                      <span>21 基因复发评分：<strong className="text-indigo-950">RS = {profile.oncotypeDxScore}</strong></span>
                    </span>
                    <span className="text-indigo-700 text-[10px]">
                      {Number(profile.oncotypeDxScore) < 11 ? "极低风险 (降为 IA 期 · 免化疗)" : Number(profile.oncotypeDxScore) <= 25 ? "中低风险 (单纯内分泌)" : "高风险 (化疗获益)"}
                    </span>
                  </div>
                ) : profile.ki67 != null && profile.ki67 !== "" ? (
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-[11px]">
                    <span className="text-purple-800 font-semibold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-purple-600" />
                      <span>Ki-67 增殖指数：<strong className="text-purple-900">{profile.ki67}%</strong></span>
                    </span>
                    <span className="text-purple-700 text-[10px]">
                      {Number(profile.ki67) <= 14 ? "惰性分裂 · Luminal A 典型" : "常规代谢增殖"}
                    </span>
                  </div>
                ) : null}
              </>
            ) : (
              /* Existing lung pathology markup */
              <>
                {(profile.pathologyTumorSize != null || profile.pathologyInvasiveSize != null) && (
                  <div className="p-2 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-between text-[11px] text-purple-900">
                    <span>标本大体全径: <strong className="text-purple-800">{profile.pathologyTumorSize != null ? `${profile.pathologyTumorSize} cm` : '未单独标注'}</strong></span>
                    <span>镜下浸润大小: <strong className="text-purple-800">{profile.pathologyInvasiveSize != null ? `${profile.pathologyInvasiveSize} cm` : '未标明'}</strong></span>
                  </div>
                )}

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">切缘状态 (Margin)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isMarginSafe ? "text-emerald-700" :
                      profile.marginStatus === 'positive' || profile.margin === 'positive' ? "text-rose-600" : "text-slate-400"
                    }`}>
                      {isMarginSafe ? "R0 阴性安全" : profile.marginStatus === 'positive' || profile.margin === 'positive' ? "阳性 (有残留)" : "未检测 / 待查"}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">淋巴结 (N分期)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isN0Safe ? "text-emerald-700" :
                      profile.nStage === 'N1' || profile.nStage === 'N2a' ? "text-amber-700" :
                      profile.nStage === 'Nx' || !profile.nStage ? "text-slate-400" : "text-rose-600"
                    }`}>
                      {isN0Safe ? "N0 无转移" : profile.nStage === 'Nx' || !profile.nStage ? "Nx 待查" : profile.nStage}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">胸膜侵犯 (VPI)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isVpiSafe ? "text-emerald-700" :
                      profile.vpi === 'positive' || (profile.vpi as any) === true ? "text-amber-700" : "text-slate-400"
                    }`}>
                      {isVpiSafe ? "PL0 未侵犯" : profile.vpi === 'positive' || (profile.vpi as any) === true ? "阳性 (侵犯)" : "未检测"}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">气道播散 (STAS)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isStasSafe ? "text-emerald-700" :
                      profile.stas === 'positive' || (profile.stas as any) === true ? "text-amber-700" : "text-slate-400"
                    }`}>
                      {isStasSafe ? "阴性 / 无" : profile.stas === 'positive' || (profile.stas as any) === true ? "阳性 (高危)" : "未检测"}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">脉管癌栓 (LVI)</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isLviSafe ? "text-emerald-700" :
                      profile.lvi === 'positive' || (profile.lvi as any) === true ? "text-amber-700" : "text-slate-400"
                    }`}>
                      {isLviSafe ? "阴性 / 无" : profile.lvi === 'positive' || (profile.lvi as any) === true ? "阳性 (高危)" : "未检测"}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                    <div className="text-[9px] text-slate-500">IASLC 分级</div>
                    <div className={`font-bold text-[11px] mt-0.5 ${
                      isGrade3 ? "text-rose-600" :
                      profile.iaslcGrade === '1' || profile.grade === '1' ? "text-emerald-700" :
                      profile.iaslcGrade === '2' || profile.grade === '2' ? "text-blue-700" : "text-slate-400"
                    }`}>
                      {profile.iaslcGrade || profile.grade ? `G${profile.iaslcGrade || profile.grade}` : "未分级"}
                    </div>
                  </div>
                </div>

                {profile.ki67 != null && profile.ki67 !== "" && (
                  <div className="p-2 bg-purple-50 rounded-xl border border-purple-200 flex items-center justify-between text-[11px]">
                    <span className="text-purple-800 font-semibold flex items-center gap-1">
                      <Activity className="w-3 h-3 text-purple-600" />
                      <span>Ki-67 增殖指数：<strong className="text-purple-900">{profile.ki67}%</strong></span>
                    </span>
                    <span className="text-purple-700 text-[10px]">
                      {Number(profile.ki67) <= 5 ? "惰性分裂 · 极高预后安全性" : "常规代谢"}
                    </span>
                  </div>
                )}
              </>
            )}
          </div>

          {/* SECTION 4: Molecular Biomarkers & Gene Mutations */}
          {(() => {
            if (isBreast) {
              return (
                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 relative z-10 space-y-2">
                  <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Dna className="w-3.5 h-3.5 text-rose-600" />
                      <span>分子特征与靶向适应证 (Breast Biomarkers)</span>
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      St. Gallen / NCCN 2024
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    <div className="px-2.5 py-1 rounded-lg bg-white border border-rose-200 font-mono text-[11px]">
                      <span className="text-rose-900 font-bold">受体表型: </span>
                      <span className="text-rose-700">{profile.erStatus === 'positive' ? 'ER+' : 'ER-'} / {profile.prStatus === 'positive' ? 'PR+' : 'PR-'}</span>
                    </div>
                    <div className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 font-mono text-[11px]">
                      <span className="text-indigo-900 font-bold">HER2: </span>
                      <span className="text-indigo-700">{profile.her2Status || '待定'}</span>
                    </div>
                    {(profile.brca1 === 'positive' || profile.brca2 === 'positive') && (
                      <div className="px-2.5 py-1 rounded-lg bg-white border border-amber-200 font-mono text-[11px]">
                        <span className="text-amber-900 font-bold">BRCA: </span>
                        <span className="text-amber-700">致病突变 (PARP抑制剂获益)</span>
                      </div>
                    )}
                    {profile.pik3ca === 'positive' && (
                      <div className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 font-mono text-[11px]">
                        <span className="text-teal-900 font-bold">PIK3CA: </span>
                        <span className="text-teal-700">突变型 (PI3Kα抑制剂获益)</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            }

            const mutations = (Array.isArray(profile.geneMutations) && profile.geneMutations.length > 0)
              ? profile.geneMutations
              : (Array.isArray(profile.molecular?.mutations) && profile.molecular.mutations.length > 0)
              ? profile.molecular.mutations
              : (profile.egfr === 'positive' ? [{ id: 'mut_egfr', gene: 'EGFR', subtype: '敏感突变', status: 'positive' }] : []);
            const testStatus = profile.molecularTestStatus || profile.molecular?.testStatus || (mutations.length > 0 ? "tested" : (profile.egfr === 'positive' ? "tested" : (profile.egfr === 'negative' ? 'negative' : "not_tested")));
            const pdl1 = profile.pdl1Tps || profile.molecular?.pdl1Tps;

            return (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 mb-4 relative z-10 space-y-2.5">
                <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Dna className="w-3.5 h-3.5 text-indigo-600" />
                    <span>驱动基因突变与分子靶向 (NGS Panel)</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {testStatus === "tested" ? `已检出 ${mutations.length} 项突变` : testStatus === "negative" ? "全野生型 (未检出敏感突变)" : "未做检测"}
                  </span>
                </div>

                {testStatus === "tested" && mutations.length > 0 ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                      {mutations.map((m: any, idx: number) => (
                        <div
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 flex items-center gap-1.5 text-xs font-mono"
                        >
                          <span className="font-extrabold text-indigo-900">{m.gene}</span>
                          {m.subtype && <span className="text-indigo-600 text-[10.5px]">({m.subtype})</span>}
                          {m.abundance && <span className="text-slate-500 text-[10px]">{m.abundance}%</span>}
                          {m.isComutation && (
                            <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-1 rounded">伴随突变</span>
                          )}
                        </div>
                      ))}
                      {pdl1 && pdl1 !== "unknown" && (
                        <div className="px-2.5 py-1 rounded-lg bg-white border border-teal-200 flex items-center gap-1.5 text-xs font-mono">
                          <span className="font-extrabold text-teal-800">PD-L1</span>
                          <span className="text-teal-600 text-[10.5px]">{pdl1}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : testStatus === "negative" ? (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-emerald-700">
                    全基因野生型（EGFR / ALK / ROS1 / KRAS 等常见靶点均阴性无突变）
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500">
                    当前档案未做基因大 Panel 检测（IA 期早期手术根治后常规无需靶向辅助用药）
                  </div>
                )}
              </div>
            );
          })()}

          {/* SECTION 5: Decision Engine Next Step */}
          <div className="bg-blue-50/70 rounded-2xl p-3.5 border border-blue-200 mb-4 relative z-10 flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Stethoscope className="w-3.5 h-3.5" />
            </div>
            <div className="space-y-0.5 text-xs">
              <div className="font-bold text-blue-900 text-[11px]">
                临床随访与行动建议：
              </div>
              <p className="text-slate-700 text-[11px] leading-relaxed">
                {profile.nextAction || profile.clinicalRecommendation || (
                  isBreast 
                    ? "建议遵医嘱按时规范内分泌/靶向用药，每 6 个月规律复查乳腺超声、钼靶与盆腔内膜/骨密度评估。" 
                    : "建议遵医嘱于术后 6 个月复查胸部薄层 CT（层厚 ≤1mm），按指南规律随访即可。"
                )}
              </p>
            </div>
          </div>

          {/* SECTION 6: Warm Empathy Banner */}
          <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-[10px] text-amber-900 leading-relaxed mb-4 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>温暖寄语：</strong>数据是群体的历史，而奇迹由您亲自书写。保持营养摄入与乐观从容的心态，享受充满生机的每一天。
            </span>
          </div>

          {/* Bottom Stamp & Standardized Verification Footer */}
          <ExportBrandFooter variant="light" />
        </div>
      </div>
    </div>

    {/* ================= DEDICATED PRINTABLE A4 CONSULTATION SHEET (print:block hidden) ================= */}
    <div className="hidden print:block p-8 bg-white text-slate-900 max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-slate-900">
        <div>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">
            知癌维基 门诊就诊循证沟通单
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            个人临床档案精选问诊清单 · 医患协同辅助决策
          </p>
        </div>
        <div className="text-right text-xs">
          <div className="font-mono font-bold text-slate-900">{currentDateStr}</div>
          <div className="text-slate-500 text-[10px]">仅供门诊当面交流参考</div>
        </div>
      </div>

      {/* Patient Synopsis */}
      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs grid grid-cols-4 gap-2">
        <div>
          <span className="text-slate-500">就诊病种:</span>
          <span className="font-bold ml-1 text-slate-900">{isBreast ? "乳腺肿瘤专区" : "肺部肿瘤专区"}</span>
        </div>
        <div>
          <span className="text-slate-500">患者信息:</span>
          <span className="font-bold ml-1 text-slate-900">{genderText}{profile.age ? ` · ${profile.age}岁` : ""}</span>
        </div>
        <div>
          <span className="text-slate-500">临床分期:</span>
          <span className="font-bold ml-1 text-slate-900">{profile.stage || "待定期"}</span>
        </div>
        <div>
          <span className="text-slate-500">切缘/淋巴结:</span>
          <span className="font-bold ml-1 text-slate-900">
            {profile.marginStatus === 'negative' || profile.margin === 'negative' ? 'R0阴性' : '待评估'} · {profile.nStage || 'N0'}
          </span>
        </div>
      </div>

      {/* Selected Questions */}
      <div className="space-y-3">
        <h2 className="text-xs font-black text-slate-900 border-b border-slate-200 pb-1 flex items-center justify-between">
          <span>门诊建议向主治医师重点咨询问题 ({consultationQuestions.filter(q => checkedQuestionIds.includes(q.id)).length} 项)</span>
          <span className="text-[10px] font-normal text-slate-500">建议优先咨询高优先级关键问题</span>
        </h2>

        <div className="space-y-2.5">
          {consultationQuestions.filter(q => checkedQuestionIds.includes(q.id)).map((q, idx) => (
            <div key={q.id} className="p-2.5 rounded-xl border border-slate-200 space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-slate-900 text-xs">Q{idx + 1}.</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  [{q.category}]
                </span>
                {q.priority === "high" && (
                  <span className="text-[10px] font-bold text-rose-700">高优先级</span>
                )}
              </div>
              <div className="text-xs font-bold text-slate-900 pl-4 leading-relaxed">
                {q.text}
              </div>
              <div className="text-[10px] text-slate-500 pl-4 leading-snug">
                <strong>循证依据：</strong>{q.rationale}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Doctor's Outpatient Notes Section */}
      <div className="p-3 rounded-xl border border-slate-300 space-y-2 mt-4">
        <div className="text-xs font-bold text-slate-900 flex items-center justify-between">
          <span>主治医师门诊指导与备忘记录：</span>
          <span className="text-slate-400 font-normal text-[11px]">接诊医师签字: __________________</span>
        </div>
        <div className="h-14 border-b border-dashed border-slate-300"></div>
        <div className="h-8 border-b border-dashed border-slate-300"></div>
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
        <span>知癌维基 ZhiaiWiki · 循证医学知识服务系统 · zhiaiwiki.org</span>
        <span>严格保护个人就诊隐私 · 请遵医嘱</span>
      </div>
    </div>
  </>
  );
}
