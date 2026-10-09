"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import { toPng } from "html-to-image";
import { 
  Download, 
  Printer, 
  FileText, 
  Share2, 
  ClipboardList, 
  GitBranch, 
  Check,
  AlertTriangle,
  RotateCcw,
  Copy,
  Scan,
  Activity,
  Ruler,
  Microscope,
  FileEdit,
  Info,
  X,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertOctagon,
  MinusCircle,
  Network,
  Heart
} from "lucide-react";
import type { PatientProfile, CancerType } from "@/lib/types";
import { getGuestId } from "@/lib/guest";
import { GlossaryTooltip } from "@/components/common/GlossaryTooltip";
import ReasoningTicker from "@/components/profile/ReasoningTicker";
import { ONCOPATH_LOGO_DATA_URI } from "@/lib/brandLogo";
import { exportElementToA4Pdf } from "@/lib/pdfExporter";
import { showToast } from "@/components/common/Toast";
import LangSwitch from "@/components/LangSwitch";
import ExportBrandFooter from "@/components/common/ExportBrandFooter";
import { 
  getActiveCancerSlot, 
  getProfileBySlot, 
  saveProfileToSlot,
  EVENT_SLOT_CHANGED 
} from "@/lib/profileStorage";
import { 
  formatClinicalAiError, 
  isRateLimitOrQuotaError, 
  type ClinicalErrorInfo 
} from "@/lib/clinicalErrors";

// Deterministic fingerprint for detecting calibrated profile modifications
function generateProfileFingerprint(p: PatientProfile | null): string {
  if (!p) return "";
  const keyValues = [
    p.cancerType || (p as any).organ || "",
    p.stage || "",
    p.tStage || "",
    p.nStage || "",
    p.mStage || "",
    p.tumorSize ?? "",
    p.solidSize ?? "",
    p.noduleType ?? "",
    p.surgeryType ?? "",
    p.margin ?? (p as any).marginStatus ?? "",
    p.lvi ?? "",
    p.stas ?? "",
    p.vpi ?? (p as any).pleuralInvasion ?? "",
    p.grade ?? (p as any).iaslcGrade ?? (p as any).nottinghamGrade ?? "",
    p.ki67 ?? "",
    JSON.stringify(p.cancerSpecificData || {})
  ];
  return keyValues.join("|");
}

function getCancerMeta(prof: PatientProfile | null) {
  const type = prof?.cancerType || (prof as any)?.organ || "";
  if (type === "liver" || (prof as any)?.organ === "hcc") {
    return { name: "原发性肝癌", short: "肝癌报告", badge: "肝癌专案", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (type === "gastric" || (prof as any)?.organ === "stomach") {
    return { name: "胃癌", short: "胃癌报告", badge: "胃癌专案", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (type === "breast") {
    return { name: "乳腺癌", short: "乳腺报告", badge: "乳腺专案", badgeClass: "bg-pink-50 text-pink-700 border-pink-200" };
  }
  if (type === "colon") {
    return { name: "结肠癌", short: "结肠报告", badge: "结肠专案", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (type === "rectal") {
    return { name: "直肠癌", short: "直肠报告", badge: "直肠专案", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (type === "colorectal") {
    return { name: "结直肠癌", short: "结直肠报告", badge: "结直肠专案", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" };
  }
  if (type === "esophageal" || (prof as any)?.organ === "esophagus" || (prof as any)?.organ === "escc") {
    return { name: "食管鳞癌", short: "食管报告", badge: "食管专案", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" };
  }
  if (type === "thyroid") {
    return { name: "甲状腺癌", short: "甲状腺报告", badge: "甲状腺专案", badgeClass: "bg-teal-50 text-teal-700 border-teal-200" };
  }
  if (type === "endometrial" || (prof as any)?.organ === "uterine") {
    return { name: "子宫内膜癌", short: "内膜癌报告", badge: "内膜癌专案", badgeClass: "bg-purple-50 text-purple-700 border-purple-200" };
  }
  if (type === "cervical" || (prof as any)?.organ === "cervix") {
    return { name: "宫颈癌", short: "宫颈报告", badge: "宫颈专案", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" };
  }
  if (type === "pancreatic" || (prof as any)?.organ === "pancreas") {
    return { name: "胰腺癌", short: "胰腺报告", badge: "胰腺专案", badgeClass: "bg-orange-50 text-orange-700 border-orange-200" };
  }
  return { name: "肺腺癌", short: "肺癌报告", badge: "肺癌专案", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" };
}

export default function EvidenceReportPage() {
  const [profile, setProfile] = useState<PatientProfile | null>(null);
  const [reportMarkdown, setReportMarkdown] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadedFromCache, setIsLoadedFromCache] = useState(false);
  const [isReportStale, setIsReportStale] = useState(false);
  const [cachedTime, setCachedTime] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [errorInfo, setErrorInfo] = useState<ClinicalErrorInfo | null>(null);
  const [isReviewRequired, setIsReviewRequired] = useState(false);
  const [isConfirmingReview, setIsConfirmingReview] = useState(false);
  const [retryCountdown, setRetryCountdown] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isExportingCard, setIsExportingCard] = useState(false);
  const [isExportingDirectPdf, setIsExportingDirectPdf] = useState(false);
  const [exportedImageUrl, setExportedImageUrl] = useState<string | null>(null);
  const [cardDownloadSuccess, setCardDownloadSuccess] = useState(false);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const lastScrollTimeRef = useRef(0);
  const prevGeneratingRef = useRef(false);

  const hasLoadedRef = useRef(false);

  const contentEndRef = useRef<HTMLDivElement>(null);
  const reportContainerRef = useRef<HTMLDivElement>(null);
  const consultationCardRef = useRef<HTMLDivElement>(null);


  // Helper: Extract structured questions from Section 3 for the Consultation Card
  const extractChecklistItems = (markdown: string, prof?: PatientProfile | null) => {
    if (!markdown) return [];
    const isEsoph = prof?.cancerType === 'esophageal' || (prof as any)?.organ === 'esophageal' || (prof as any)?.organ === 'esophagus' || (prof as any)?.organ === 'escc';
    const isLiv = prof?.cancerType === 'liver' || (prof as any)?.organ === 'liver' || (prof as any)?.organ === 'hcc';
    const isGas = prof?.cancerType === 'gastric' || (prof as any)?.organ === 'gastric' || (prof as any)?.organ === 'stomach';
    const isBr = prof?.cancerType === 'breast' || (prof as any)?.organ === 'breast';
    const isCol = prof?.cancerType === 'colon' || (prof as any)?.organ === 'colon';
    const isRec = prof?.cancerType === 'rectal' || (prof as any)?.organ === 'rectal';
    const isCrc = prof?.cancerType === 'colorectal' || (prof as any)?.organ === 'colorectal' || isCol || isRec;
    const isThy = prof?.cancerType === 'thyroid' || (prof as any)?.organ === 'thyroid';
    const isEndometrial = prof?.cancerType === 'endometrial' || (prof as any)?.organ === 'endometrial' || (prof as any)?.organ === 'uterine';
    const isCervical = prof?.cancerType === 'cervical' || (prof as any)?.organ === 'cervical' || (prof as any)?.organ === 'cervix';
    const isPancreatic = prof?.cancerType === 'pancreatic' || (prof as any)?.organ === 'pancreatic' || (prof as any)?.organ === 'pancreas';

    // Agnostic checklist matcher: matches section whether it's section 3, 4, 5, or unnumbered
    const checklistMatch = 
      markdown.match(/##?\s*(?:\d+[\.\s、]|[一二三四五六七八][\.\s、])?[^\n]*?(?:问诊|便签|清单|咨询)[^\n]*?\n([\s\S]*?)(?=##?\s*(?:\d+[\.\s、]|[一二三四五六七八][\.\s、])|$)/i) ||
      markdown.match(/##?\s*(?:3|4|5)[\s\S]*?(?=##?\s*(?:4|5|6)|$)/);

    const text = checklistMatch ? checklistMatch[0] : markdown;
    const lines = text.split('\n');
    const items: { title: string; content: string }[] = [];
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- [ ]') || trimmed.startsWith('- ') || trimmed.startsWith('* ') || /^\d+\./.test(trimmed)) {
        const cleaned = trimmed.replace(/^-\s*\[\s*\]\s*/, '').replace(/^[-*]\s+/, '').replace(/^\d+\.\s*/, '');
        const titleMatch = cleaned.match(/\*\*【?([^】*]+)】?\*\*[：:]?\s*(.*)/) || cleaned.match(/【([^】]+)】[：:]?\s*(.*)/);
        if (titleMatch) {
          items.push({
            title: titleMatch[1].trim(),
            content: titleMatch[2].trim() || cleaned.replace(/\*\*.*?\*\*/, '').trim()
          });
        } else if (cleaned.length > 5 && !cleaned.includes('问诊清单') && !cleaned.includes('便签卡') && !cleaned.includes('##')) {
          items.push({
            title: `关注问题 ${items.length + 1}`,
            content: cleaned.replace(/\*\*/g, '').trim()
          });
        }
      }
    }

    // Incorporate custom questions saved by user from Wiki encyclopedia
    if (typeof window !== "undefined") {
      try {
        const savedCustom = localStorage.getItem("oncopath_clinic_questions");
        if (savedCustom) {
          const parsed = JSON.parse(savedCustom);
          if (Array.isArray(parsed)) {
            parsed.forEach((customItem: any) => {
              if (customItem && customItem.question) {
                // Prevent duplicates
                const exists = items.some((it) => it.content === customItem.question);
                if (!exists) {
                  items.push({
                    title: customItem.title ? `[百科] ${customItem.title}` : "百科关注疑问",
                    content: customItem.question,
                  });
                }
              }
            });
          }
        }
      } catch (e) {
        console.error("Failed to load custom clinic questions from wiki", e);
      }
    }

    if (items.length === 0) {
      if (isEndometrial) {
        return [
          { title: "分子分型与辅助治疗定案", content: "请教主治医生我的 FIGO 2023 分子分型（POLEmut / MMRd / NSMP / p53abn）结果如何？是否属于 POLE 突变可安全免除放化疗？" },
          { title: "辅助放化疗模式选择", content: "根据肌层浸润深度与脉管侵犯，若需辅助治疗，首选阴道残端后装放疗 (VBT) 还是全盆外放疗 (EBRT)？是否需联合 TC 化疗？" },
          { title: "Lynch 综合征遗传排查", content: "错配修复蛋白 (MMR) 状态如何？若为 dMMR 是否建议直系亲属进行 Lynch 综合征相关遗传咨询？" },
          { title: "残端细胞学与盆腔随访规划", content: "术后第一次阴道残端涂片细胞学脱落检查与盆腹增强 MRI 复查建议在第几个月进行？" }
        ];
      }
      if (isCervical) {
        return [
          { title: "治疗路径金标准确认", content: "请教主治医生根据肿瘤大小与宫旁状态，首选方案是开腹广泛切除还是顺铂增敏同步放化疗 (CCRT)？" },
          { title: "3D 近距离后装放疗实施", content: "若执行根治性放化疗，后装近距离放疗是否采用 MRI/CT 引导下的 3D 个体化插植技术？" },
          { title: "顺铂增敏水化与肾功能保护", content: "每周顺铂增敏化疗期间的水化方案如何安排？肌酐与内生肌酐清除率如何动态监测？" },
          { title: "盆底康复与阴道粘连防护", content: "放疗结束后何时启动规范阴道冲洗及扩张器维护以预防阴道挛缩狭窄？" }
        ];
      }
      if (isPancreatic) {
        return [
          { title: "强化辅助化疗方案选择", content: "请教主治医生根据术后体力恢复与病理切缘，推荐首选 mFOLFIRINOX 还是吉西他滨联合卡培他滨？" },
          { title: "BRCA 基因检测与靶向维持", content: "是否建议进行胚系 BRCA1/2 及 HRR 基因检测以评估后续奥拉帕利靶向维持治疗机遇？" },
          { title: "胰酶 (PERT) 剂量与餐中服药", content: "术后消化不良与腹泻，当前胰酶胶囊（如得每通）每餐推荐服用多少剂量？是否需正餐中顿服？" },
          { title: "薄层增强影像与 CA19-9 复查", content: "术后第一次薄层胰腺高分辨率增强 CT/MRI 与 CA19-9/CEA 联合复查建议安排在第几周？" }
        ];
      }
      if (isThy) {
        return [
          { title: "TSH 抑制目标设定", content: "请教主治医生根据我的术后病理分期及复发危险度分层（高/中/低危），TSH 应控制在何种抑制范围（如 <0.1 mU/L 或 0.1~0.5 mU/L）？" },
          { title: "左甲状腺素 (L-T4) 服药与吸收质控", content: "请教清晨空腹服药后是否需要严格间隔至少 4 小时再进食钙剂、铁剂、复合维生素或豆浆咖啡？如漏服次日如何补服？" },
          { title: "甲状旁腺保护与钙磷监测", content: "术后若出现口周及指尖麻木发紧，如何紧急排查血清离子钙与 PTH？门诊复查骨密度与血钙周期如何规划？" },
          { title: "Tg 与 TgAb 肿瘤标志物动态随访", content: "全切术后是否需要定期联合检测血清甲状腺球蛋白 (Tg) 与抗体 (TgAb)？颈部淋巴结高分辨率超声初次复查时间节点推荐？" }
        ];
      }
      if (isEsoph) {
        return [
          { title: "解剖分段与新辅助放化疗评估", content: "请教主治医生肿瘤位于哪个解剖段（颈段/胸上/中/下段）？是否推荐按照 NEOCRTEC5010 方案行术前长春瑞滨+顺铂+40Gy 同步放化疗再行微创手术？" },
          { title: "二野/三野清扫与 ≥15 枚淋巴结质控", content: "术后病理检出区域淋巴结总数是否达到 CSCO/AJCC 规定的 ≥15 枚质控红线？双侧喉返神经链淋巴结是否充分清扫？" },
          { title: "气管食管瘘 (TEF) 风险与气道保护", content: "增强 CT 或内镜下肿瘤是否浸润气管软骨或邻近降主动脉？治疗期间出现饮水呛咳如何排查穿孔瘘管？是否需要放置覆膜食管支架？" },
          { title: "空肠造瘘肠内营养与半卧位防反流", content: "术中预置的空肠造瘘管日常泵注加温如何规范维护？管状胃术后如何通过 30°~45° 半卧位睡眠防范胃酸反流呛咳误吸？" }
        ];
      }
      if (isLiv) {
        return [
          { title: "CNLC 分期与转化切除指征", content: "请教主治医生肿瘤按国家卫健委 CNLC 2024 标准属于哪一期？如果合并门脉分支癌栓或多发病灶，是否可以通过 HAIC-FO 持续灌注化疗或靶免联合降期逆转为根治手术？" },
          { title: "Child-Pugh / ALBI 肝功能储备", content: "术前评估的 Child-Pugh 评分（A/B级）与 ALBI 分级如何？大范围切除或介入栓塞后发生术后急性肝衰竭 (PHLF) 的安全余量是否充足？" },
          { title: "乙肝高敏 HBV DNA 与终身抗病毒", content: "我的高敏乙肝病毒量控制情况如何？抗肿瘤治疗期间是否需要严格保持恩替卡韦或 TAF 终身不间断服药以防致死性爆发性肝炎？" },
          { title: "胃镜排查静脉曲张与靶免用药安全", content: "在使用贝伐珠单抗等抗血管生成药前，是否已完成胃镜筛查重度食管胃底静脉曲张？如何防范突发性消化道大出血风险？" }
        ];
      }
      if (isGas) {
        return [
          { title: "ESD 保胃指征与切缘评估", content: "请教主治医生病灶浸润深度与分化类型是否符合内镜黏膜下剥离术 (ESD) 治愈性切除指征？术后是否需要追加外科开刀？" },
          { title: "D2 淋巴结清扫质控核对", content: "术后大病理检出区域淋巴结总数是否达到 ≥ 16 枚质控标准？是否存在假性分期低估需强化辅助化疗？" },
          { title: "Claudin 18.2 / HER2 靶向配型", content: "组织免疫组化报告是否已完成 HER2 (IHC/FISH) 与 Claudin 18.2 靶标检测？能否匹配佐妥昔单抗或曲妥珠单抗靶向治疗？" },
          { title: "倾倒综合征防范与营养支持", content: "消化道重建术后（毕I/毕II/Roux-en-Y）出现心慌出汗（早期倾倒）或进食后低血糖（晚期倾倒）如何调适？维生素 B12 贫血如何预防？" }
        ];
      }
      if (isBr) {
        return [
          { title: "术后/系统治疗规划", content: "请教主治医生是否需要辅助内分泌/靶向/化疗治疗，具体方案与周期如何安排？" },
          { title: "随访影像规划", content: "请教医生乳腺及区域淋巴结超声、钼靶与胸部CT复查时间节点？" },
          { title: "功能康复与淋巴水肿预防", content: "结合当前手术与腋窝处理方式，患侧上肢功能锻炼与水肿预防有哪些注意事项？" },
          { title: "不良反应与警示体征", content: "后续用药期间若出现骨痛、潮热或切口异常，应如何监测与及时回院复诊？" }
        ];
      }
      if (isRec) {
        return [
          { title: "TNT全程新辅助与保肛评估", content: "请教主治医生根据骨盆薄层 HR-MRI 评估结果，是否推荐 RAPIDO 或 PRODIGE 23 全程新辅助放化疗？保肛 (ISR/Dixon) 成功率多高？" },
          { title: "cCR 与 Watch & Wait 器官保留", content: "新辅助结束后若达到临床完全缓解 (cCR)，是否适合采取观察等待 (Watch & Wait) 策略免除根治切除手术？" },
          { title: "保护性造口防漏与还纳时机", content: "若需行临时保护性回肠造口，防漏护理核心要领是什么？一般术后几个月评估造口还纳？" },
          { title: "LARS 控便排便功能康复", content: "保肛术后出现便频、急迫等低位前切除综合征 (LARS) 时，易蒙停用药和 Kegel 提肛训练如何科学展开？" }
        ];
      }
      if (isCol) {
        return [
          { title: "IDEA 协作组 3 个月减毒方案", content: "请教主治医生根据我的病理分期（如 IDEA 协作组低危/高危标准），推荐采用 3 个月 CAPOX 减毒方案还是 6 个月方案？手脚麻木如何监测预防？" },
          { title: "左右半结肠与靶向药物选择", content: "请教医生原发部位（左半 vs 右半）结合全 RAS/BRAF/MSI 基因状态，若需靶向是首选西妥昔单抗还是贝伐珠单抗？" },
          { title: "CME 手术质控与淋巴结清扫", content: "病理报告检出淋巴结总数是否达到 ≥ 12 枚质控红线？若不足 12 枚辅助化疗如何加码？" },
          { title: "肝转移监测与 MDT 协同", content: "术后血清 CEA 标志物与腹盆增强 CT 复查时间表如何规划？如何早期预防肝转移？" }
        ];
      }
      if (isCrc) {
        return [
          { title: "辅助化疗周期与减毒评估", content: "请教主治医生根据我的病理分期（如 IDEA 协作组标准），推荐采用 3 个月 CAPOX 方案还是 6 个月方案？神经毒性如何监测预防？" },
          { title: "分子分型与靶向选择", content: "请教医生我的 MSI/MMR 状态以及 KRAS/NRAS/BRAF 基因检测结果，是否适合免疫治疗或靶向药物？" },
          { title: "造口护理与肠道功能康复", content: "（若为直肠癌或造口）请教造口护理规范，以及术后饮食过渡、排便功能恢复的具体指导？" },
          { title: "随访影像与肿瘤标志物规划", content: "请教医生术后 CEA、CA19-9 血液标志物以及胸腹盆增强 CT、肠镜的复查时间表？" }
        ];
      }
      return [
        { title: "随访影像规划", content: "请教主治医生第一次胸部薄层 CT 推荐在术后第几个月复查？" },
        { title: "术后治疗评估", content: "请教医生是否确认属于早期规范根治，无需过度吃药与盲目基因检测？" },
        { title: "肺功能康复指导", content: "结合当前手术切除范围，术后呼吸训练与日常活动有哪些具体建议？" },
        { title: "异常警示信号", content: "术后出现哪些体征（如发热、胸痛、持续咳痰）需要及时回院复诊？" }
      ];
    }

    return items;
  };

  const checklistItems = extractChecklistItems(reportMarkdown, profile);


  // Detect whether the user has scrolled up to read earlier content during streaming
  useEffect(() => {
    if (!isGenerating) {
      setUserScrolledUp(false);
      return;
    }

    const handleScroll = () => {
      const scrollBottom = window.innerHeight + window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      // If user is more than 260px above bottom, pause forced auto-scroll
      if (docHeight - scrollBottom > 260) {
        setUserScrolledUp(true);
      } else {
        setUserScrolledUp(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isGenerating]);

  // High-performance throttled auto-scroll using requestAnimationFrame and instant auto behavior
  useEffect(() => {
    if (!isGenerating || userScrolledUp || !contentEndRef.current) return;

    const now = performance.now();
    // Throttle scroll updates to at most once per 120ms to prevent main thread animation queue lock
    if (now - lastScrollTimeRef.current > 120) {
      lastScrollTimeRef.current = now;
      requestAnimationFrame(() => {
        if (!userScrolledUp && contentEndRef.current) {
          contentEndRef.current.scrollIntoView({ behavior: "auto", block: "end" });
        }
      });
    }
  }, [reportMarkdown, isGenerating, userScrolledUp]);

  // When generation completes, perform a single smooth final adjustment if user is near bottom
  useEffect(() => {
    if (prevGeneratingRef.current && !isGenerating && !userScrolledUp && contentEndRef.current) {
      contentEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
    }
    prevGeneratingRef.current = isGenerating;
  }, [isGenerating, userScrolledUp]);

  // Core Function: Execute Stream Generation & Save to Both LocalStorage and Cloud Database
  const startGeneratingReport = async (currentProfile: PatientProfile) => {
    setIsGenerating(true);
    setReportMarkdown("");
    setError("");
    setErrorInfo(null);
    setRetryCountdown(0);
    setIsLoadedFromCache(false);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      const reportRes = await fetch('/api/generate-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(currentProfile)
      });

      if (!reportRes.ok) {
        const errJson = await reportRes.json().catch(() => null);
        const reviewRequired = reportRes.status === 409 || errJson?.code === 'REPORT_REVIEW_REQUIRED' || errJson?.requiresReview || String(errJson?.error || '').includes('核对并确认报告解析出的关键临床字段');
        if (reviewRequired) {
          setIsReviewRequired(true);
        }
        const clinical = formatClinicalAiError(errJson || "报告生成失败", 'generate');
        const finalInfo: ClinicalErrorInfo = {
          title: errJson?.title || clinical.title,
          message: errJson?.error || clinical.message,
          isRateLimit: errJson?.isRateLimit ?? clinical.isRateLimit,
          retryAfter: errJson?.retryAfter ?? clinical.retryAfter,
          suggestion: errJson?.suggestion || clinical.suggestion,
          badge: errJson?.badge || clinical.badge,
        };
        setErrorInfo(finalInfo);
        setError(finalInfo.message);
        throw new Error(finalInfo.message);
      }

      const reader = reportRes.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      if (!reader) {
        throw new Error("无数据流返回");
      }

      let accumulatedText = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setReportMarkdown((prev) => prev + chunk);
      }

      const nowFormatted = new Date().toLocaleString("zh-CN", {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });

      setCachedTime(nowFormatted);
      setIsLoadedFromCache(true);
      setIsReportStale(false);

      // 1. Save to localStorage (Guest & Instant Cache strictly scoped by cancer slot)
      const cancerType = currentProfile.cancerType || (currentProfile as any).organ || getActiveCancerSlot();
      const reportCacheKey = currentProfile.id
        ? `oncopath_report_${currentProfile.id}`
        : `oncopath_report_${cancerType}_${getGuestId()}`;
      const timeCacheKey = currentProfile.id
        ? `oncopath_report_time_${currentProfile.id}`
        : `oncopath_report_time_${cancerType}_${getGuestId()}`;
      const fpKey = currentProfile.id
        ? `oncopath_report_fp_${currentProfile.id}`
        : `oncopath_report_fp_${cancerType}_${getGuestId()}`;

      if (typeof window !== "undefined") {
        localStorage.setItem(reportCacheKey, accumulatedText);
        localStorage.setItem(timeCacheKey, nowFormatted);
        localStorage.setItem(fpKey, generateProfileFingerprint(currentProfile));
        if (cancerType === "lung") {
          localStorage.setItem(`oncopath_report_${currentProfile.id || getGuestId()}`, accumulatedText);
          localStorage.setItem(`oncopath_report_time_${currentProfile.id || getGuestId()}`, nowFormatted);
          localStorage.setItem(`oncopath_report_fp_${currentProfile.id || getGuestId()}`, generateProfileFingerprint(currentProfile));
        }
      }

      // 2. Persist to Cloud Database (PostgreSQL) with cancerType
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            profileId: currentProfile.id,
            userId: getGuestId(),
            cancerType: cancerType,
            reportMarkdown: accumulatedText,
          })
        });
      } catch (dbErr) {
        console.warn("Cloud persistence notice (non-fatal):", dbErr);
      }

    } catch (err: any) {
      const clinical = formatClinicalAiError(err, 'generate');
      setErrorInfo((prev) => prev || clinical);
      setError((prev) => prev || clinical.message);
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleConfirmReviewAndGenerate = async () => {
    if (!profile) return;
    setIsConfirmingReview(true);
    try {
      const queryCancer = typeof window !== "undefined" 
        ? (new URLSearchParams(window.location.search).get("cancerType") as CancerType | null) 
        : null;
      const activeSlot = (queryCancer && ["lung", "breast", "colon", "rectal", "colorectal", "gastric", "liver"].includes(queryCancer)) 
        ? queryCancer 
        : profile.cancerType || (profile as any).organ || getActiveCancerSlot();

      const confirmedProfile: PatientProfile = {
        ...profile,
        cancerType: activeSlot,
        reportReviewStatus: "confirmed",
      };

      // 1. Sync to local storage slot
      saveProfileToSlot(confirmedProfile, activeSlot as any);
      setProfile(confirmedProfile);
      setIsReviewRequired(false);
      setError("");
      setErrorInfo(null);

      // 2. Persist to Cloud Database
      const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      try {
        await fetch('/api/profile', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify({
            profileId: profile.id,
            userId: getGuestId(),
            cancerType: activeSlot,
            reportReviewStatus: 'confirmed'
          })
        });
      } catch (cloudErr) {
        console.warn("Notice: cloud profile confirmation save warning:", cloudErr);
      }

      // 3. Immediately start generating report
      await startGeneratingReport(confirmedProfile);
    } catch (err: any) {
      console.error("Failed to confirm and generate report:", err);
      setError(err.message || "确认并生成报告失败，请稍后重试");
    } finally {
      setIsConfirmingReview(false);
    }
  };

  // Reassuring live countdown timer for rate limit buffer recovery
  useEffect(() => {
    if (errorInfo?.isRateLimit && (errorInfo?.retryAfter || 60)) {
      setRetryCountdown(errorInfo.retryAfter || 60);
      const timer = setInterval(() => {
        setRetryCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [errorInfo]);

  // Initial Load: Check Local Cache & Database Persistence First (0ms Instant Load)
  useEffect(() => {
    async function loadData() {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const queryCancer = typeof window !== "undefined" 
          ? (new URLSearchParams(window.location.search).get("cancerType") as CancerType | null) 
          : null;
        const activeSlot = (queryCancer && ["lung", "breast", "colon", "rectal", "colorectal", "gastric", "liver"].includes(queryCancer)) 
          ? queryCancer 
          : getActiveCancerSlot();

        // 1. Fetch Profile from API/DB strictly scoped by activeSlot
        let fetchedProfile: PatientProfile | null = null;
        try {
          const res = await fetch(`/api/profile?userId=${getGuestId()}&cancerType=${activeSlot}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (data && data.profile) {
            fetchedProfile = data.profile;
          }
        } catch (fetchErr) {
          console.warn("Notice: Fetching cloud profile failed, trying local storage:", fetchErr);
        }

        // Fallback to local storage slot profile if API did not return or offline
        if (!fetchedProfile) {
          const localSlot = getProfileBySlot(activeSlot);
          if (localSlot && (localSlot.stage || (localSlot as any).tStage || localSlot.noduleType || localSlot.tumorSize || localSlot.organ || (localSlot as any).biRads)) {
            fetchedProfile = localSlot;
          }
        }
        
        if (!fetchedProfile) {
          setError("未找到当前癌种病历档案，请先在档案页录入或上传报告。");
          return;
        }
        
        setProfile(fetchedProfile);
        setError("");

        const checkStaleness = (prof: PatientProfile, cacheKeyFp: string) => {
          let stale = false;
          if (prof.updatedAt && prof.reportGeneratedAt) {
            const updatedTime = new Date(prof.updatedAt).getTime();
            const genTime = new Date(prof.reportGeneratedAt).getTime();
            if (!isNaN(updatedTime) && !isNaN(genTime) && updatedTime - genTime > 10000) {
              stale = true;
            }
          }
          if (!stale && typeof window !== "undefined") {
            const savedFp = localStorage.getItem(cacheKeyFp);
            const currentFp = generateProfileFingerprint(prof);
            if (savedFp && savedFp !== currentFp) {
              stale = true;
            }
          }
          return stale;
        };

        // 2. Check Cloud Database for existing report
        if (fetchedProfile.reportMarkdown) {
          setReportMarkdown(fetchedProfile.reportMarkdown);
          setIsLoadedFromCache(true);
          const timeStr = fetchedProfile.reportGeneratedAt 
            ? new Date(fetchedProfile.reportGeneratedAt).toLocaleString("zh-CN", {
                year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
              })
            : null;
          setCachedTime(timeStr);
          const cancerType = fetchedProfile.cancerType || (fetchedProfile as any).organ || activeSlot;
          const fpKey = fetchedProfile.id
            ? `oncopath_report_fp_${fetchedProfile.id}`
            : `oncopath_report_fp_${cancerType}_${getGuestId()}`;
          setIsReportStale(checkStaleness(fetchedProfile, fpKey));
          return;
        }

        // 3. Check localStorage for slot-scoped offline cache
        const cancerType = fetchedProfile.cancerType || (fetchedProfile as any).organ || activeSlot;
        const reportCacheKey = fetchedProfile.id
          ? `oncopath_report_${fetchedProfile.id}`
          : `oncopath_report_${cancerType}_${getGuestId()}`;
        const timeCacheKey = fetchedProfile.id
          ? `oncopath_report_time_${fetchedProfile.id}`
          : `oncopath_report_time_${cancerType}_${getGuestId()}`;
        const fpKey = fetchedProfile.id
          ? `oncopath_report_fp_${fetchedProfile.id}`
          : `oncopath_report_fp_${cancerType}_${getGuestId()}`;

        let localCached = typeof window !== "undefined" ? localStorage.getItem(reportCacheKey) : null;
        let localTime = typeof window !== "undefined" ? localStorage.getItem(timeCacheKey) : null;

        if (!localCached && cancerType === "lung" && typeof window !== "undefined") {
          localCached = localStorage.getItem(`oncopath_report_${fetchedProfile.id || getGuestId()}`);
          localTime = localStorage.getItem(`oncopath_report_time_${fetchedProfile.id || getGuestId()}`);
        }

        if (localCached) {
          setReportMarkdown(localCached);
          setIsLoadedFromCache(true);
          setCachedTime(localTime);
          setIsReportStale(checkStaleness(fetchedProfile, fpKey));
          return;
        }

        // 4. No cached report exists -> Check review status or trigger first-time generation
        if (fetchedProfile.reportReviewStatus && fetchedProfile.reportReviewStatus !== "confirmed") {
          setIsReviewRequired(true);
          return;
        }

        await startGeneratingReport(fetchedProfile);

      } catch (err: any) {
        setError(err.message || "加载数据失败");
      }
    }

    loadData();

    const handleAuthChange = () => {
      hasLoadedRef.current = false;
      loadData();
    };

    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    window.addEventListener(EVENT_SLOT_CHANGED, handleAuthChange);
    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener(EVENT_SLOT_CHANGED, handleAuthChange);
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDirectPdfExport = async () => {
    if (!reportContainerRef.current || isExportingDirectPdf) return;
    try {
      setIsExportingDirectPdf(true);
      const cancerMeta = getCancerMeta(profile);
      const cancerName = cancerMeta.name;
      const dateStr = new Date().toISOString().split("T")[0];
      const success = await exportElementToA4Pdf(reportContainerRef.current, {
        fileName: `ZhiaiWiki-${cancerName}临床专属循证解读报告-${profile?.stage || "临床"}-${dateStr}.pdf`,
        headerTitle: `知癌维基 ZhiaiWiki · ${cancerName}临床数字档案 · 专属循证解读报告`,
        reportDate: dateStr,
      });
      if (!success) {
        window.print();
      }
    } catch (e) {
      console.warn("Direct PDF failed, fallback to print:", e);
      window.print();
    } finally {
      setIsExportingDirectPdf(false);
    }
  };

  const handleExportCardImage = async () => {
    if (!consultationCardRef.current || isExportingCard) return;
    try {
      setIsExportingCard(true);

      if (typeof document !== "undefined" && (document as any).fonts) {
        try {
          await (document as any).fonts.ready;
        } catch {}
      }
      await new Promise((r) => setTimeout(r, 100));

      // Fast, lightweight, pixel-perfect render of the Consultation Pocket Card (600px)
      let imgData = "";
      try {
        imgData = await toPng(consultationCardRef.current, {
          quality: 0.98,
          pixelRatio: 2,
          skipAutoScale: true,
          fontEmbedCSS: "",
          backgroundColor: "#ffffff",
          cacheBust: true,
        });
      } catch (primaryErr) {
        console.warn("Primary html-to-image engine hit error, trying html2canvas fallback:", primaryErr);
      }

      if (!imgData || imgData.length < 500) {
        try {
          const html2canvas = (await import("html2canvas")).default;
          const canvas = await html2canvas(consultationCardRef.current, {
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
      } else {
        throw new Error("未能生成问诊便签卡图片数据");
      }
    } catch (err: any) {
      console.error("Failed to generate consultation card image:", err);
      showToast("生成便签卡遇到浏览器限制，建议复制文本或直接导出 PDF", "warning");
    } finally {
      setIsExportingCard(false);
    }
  };

  // Support Esc key to dismiss image modal & ⌘P / Ctrl+P to trigger print view
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && exportedImageUrl) {
        setExportedImageUrl(null);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "p") {
        e.preventDefault();
        window.print();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [exportedImageUrl]);

  const handleDownloadImage = () => {
    if (!exportedImageUrl) return;
    try {
      const link = document.createElement("a");
      link.href = exportedImageUrl;
      const dateStr = new Date().toISOString().slice(0, 10);
      link.download = `ZhiaiWiki_门诊就医问诊便签卡_${dateStr}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setCardDownloadSuccess(true);
      setTimeout(() => setCardDownloadSuccess(false), 2500);
    } catch (err) {
      console.error("Download failed:", err);
    }
  };



  async function copyTextSafe(text: string): Promise<boolean> {
    if (typeof window === "undefined") return false;
    if (navigator?.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (e) {
        console.warn("navigator.clipboard failed, falling back to execCommand", e);
      }
    }

    // Fallback for non-HTTPS / iOS Safari / in-app WebViews
    return new Promise((resolve) => {
      try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "-9999px";
        textArea.setAttribute("readonly", "");
        document.body.appendChild(textArea);
        textArea.select();
        textArea.setSelectionRange(0, 99999);
        const successful = document.execCommand("copy");
        document.body.removeChild(textArea);
        resolve(successful);
      } catch (err) {
        console.error("Fallback copy failed:", err);
        resolve(false);
      }
    });
  }

  const handleCopyChecklist = async () => {
    if (!reportMarkdown) return;

    // Comprehensive regex extraction for consultation checklist regardless of section number
    const checklistMatch = 
      reportMarkdown.match(/##?\s*(?:\d+[\.\s、]|[一二三四五六七八][\.\s、])?[^\n]*?(?:问诊|便签|清单|咨询)[^\n]*?\n([\s\S]*?)(?=##?\s*(?:\d+[\.\s、]|[一二三四五六七八][\.\s、])|$)/i) ||
      reportMarkdown.match(/##?\s*(?:3|4|5)[\s\S]*?(?=##?\s*(?:4|5|6)|$)/);

    let textToCopy = "";
    if (checklistMatch) {
      textToCopy = checklistMatch[0].trim();
    } else {
      textToCopy = reportMarkdown;
    }

    const success = await copyTextSafe(textToCopy);
    if (success) {
      setCopied(true);
      showToast("门诊问诊清单已成功复制到剪贴板", "success");
      setTimeout(() => setCopied(false), 3000);
    } else {
      showToast("复制遇到浏览器限制，请长按文本手动选择复制", "warning");
    }
  };

  // Safe Clinical Helpers for Consultation Pocket Card Export
  const isLiver = profile?.cancerType === 'liver' || (profile as any)?.organ === 'liver' || (profile as any)?.organ === 'hcc';
  const isGastric = profile?.cancerType === 'gastric' || (profile as any)?.organ === 'gastric' || (profile as any)?.organ === 'stomach';
  const isBreast = profile?.cancerType === 'breast' || (profile as any)?.organ === 'breast';
  const isColon = profile?.cancerType === 'colon' || (profile as any)?.organ === 'colon';
  const isRectal = profile?.cancerType === 'rectal' || (profile as any)?.organ === 'rectal';
  const isCrc = profile?.cancerType === 'colorectal' || (profile as any)?.organ === 'colorectal' || isColon || isRectal;
  const isEsoph = profile?.cancerType === 'esophageal' || (profile as any)?.organ === 'esophageal' || (profile as any)?.organ === 'esophagus' || (profile as any)?.organ === 'escc';
  const isThyroid = profile?.cancerType === 'thyroid' || (profile as any)?.organ === 'thyroid';
  const isEndometrial = profile?.cancerType === 'endometrial' || (profile as any)?.organ === 'endometrial' || (profile as any)?.organ === 'uterine';
  const isCervical = profile?.cancerType === 'cervical' || (profile as any)?.organ === 'cervical' || (profile as any)?.organ === 'cervix';
  const isPancreatic = profile?.cancerType === 'pancreatic' || (profile as any)?.organ === 'pancreatic' || (profile as any)?.organ === 'pancreas';
  const isFemale = (profile?.gender as string) === 'female' || (profile?.sex as string) === 'female' || (profile?.gender as string) === '女' || (profile?.sex as string) === '女';
  const genderText = isFemale ? '女性' : '男性';

  const surgeryText = 
    profile?.currentStage === 'evaluation' || profile?.currentStage === 'discovery' || profile?.surgeryType === 'unknown' ? '尚未手术 / 动态随访' :
    isLiver ? (
      profile?.surgeryType === 'resection' ? '解剖性肝切除术 (R0)' :
      profile?.surgeryType === 'ablation' ? '微波/射频消融术 (MWA/RFA)' :
      profile?.surgeryType === 'transplant' ? '原位肝移植术 (米兰标准)' :
      profile?.surgeryType === 'tace' ? '经导管动脉化疗栓塞 (TACE)' :
      profile?.surgeryType === 'haic' ? '肝动脉灌注化疗 (HAIC-FO)' :
      profile?.surgeryType || '肝切除 / 介入转化治疗'
    ) :
    isGastric ? (
      profile?.surgeryType === 'esd' ? '内镜黏膜下剥离术 (ESD)' :
      profile?.surgeryType === 'distal_gastrectomy' ? '远端胃大部切除术 (D2)' :
      profile?.surgeryType === 'total_gastrectomy' ? '全胃切除术 (D2+Roux-en-Y)' :
      profile?.surgeryType === 'proximal_gastrectomy' ? '近端胃大部切除术' :
      profile?.surgeryType || '胃癌根治术 (D2)'
    ) :
    isBreast ? (
      profile?.surgeryType === 'lumpectomy' || profile?.surgeryType === 'bcs' ? '保乳手术 (BCS)' :
      profile?.surgeryType === 'mastectomy' ? '全乳切除术' :
      profile?.surgeryType === 'reconstruction' ? '乳腺切除+即刻重建' :
      profile?.surgeryType || '乳腺原发灶根治切除'
    ) : isCrc ? (
      profile?.surgeryType === 'right_hemicolectomy' ? '腹腔镜右半结肠切除术' :
      profile?.surgeryType === 'left_hemicolectomy' ? '腹腔镜左半结肠切除术' :
      profile?.surgeryType === 'sigmoidectomy' ? '乙状结肠切除术' :
      profile?.surgeryType === 'lar' ? '直肠低位前切除术 (LAR)' :
      profile?.surgeryType === 'miles' ? '腹会阴联合切除术 (Miles)' :
      profile?.surgeryType || '结直肠根治性切除术'
    ) : (
      profile?.surgeryType === 'segmentectomy' ? '解剖性肺段切除' :
      profile?.surgeryType === 'lobectomy' ? '标准肺叶切除' :
      profile?.surgeryType === 'wedge' ? '肺楔形切除' :
      profile?.surgeryType || '根治性切除'
    );

  const isStasSafe = profile?.stas === 'negative' || (profile?.stas as any) === false || !profile?.stas;
  const isLviSafe = profile?.lvi === 'negative' || (profile?.lvi as any) === false || !profile?.lvi;
  const isVpiSafe = (profile as any)?.pleuralInvasion === 'PL0' || (profile as any)?.pleuralInvasion === 'none' || (profile as any)?.pleuralInvasion === false || !(profile as any)?.pleuralInvasion;
  const isN0Safe = profile?.nStage === 'N0' || !profile?.nStage;
  const isMarginSafe = profile?.margin === 'negative' || (profile as any)?.marginStatus === 'negative' || (profile?.margin as any) === false || !profile?.margin;
  const isGrade3 = profile?.grade === 'grade3' || (profile as any)?.differentiation === 'poorly';
  const isAllSafe = isLiver
    ? (isMarginSafe && isN0Safe && ((profile?.cancerSpecificData as any)?.childPughClass === 'A' || !(profile?.cancerSpecificData as any)?.vascularInvasion || (profile?.cancerSpecificData as any)?.vascularInvasion === 'none'))
    : isGastric
    ? (isMarginSafe && isN0Safe && ((profile?.cancerSpecificData as any)?.lymphNodesExamined == null || (profile?.cancerSpecificData as any)?.lymphNodesExamined >= 16))
    : isBreast
    ? (isMarginSafe && isN0Safe && isLviSafe && !isGrade3)
    : isCrc
    ? (isMarginSafe && isN0Safe && isLviSafe && (profile?.cancerSpecificData as any)?.tumorDeposits !== 'present')
    : (isStasSafe && isLviSafe && isVpiSafe && isN0Safe && isMarginSafe && !isGrade3);

  const riskLabel = profile?.currentStage === 'evaluation' || profile?.currentStage === 'discovery'
    ? (profile?.riskLevel === 'high' ? (isLiver ? '建议肝脏专科MDT/介入评估' : isGastric ? '建议精细胃镜/ESD评估' : isBreast ? '建议穿刺活检' : isCrc ? '建议结肠镜/多学科评估' : '建议胸外科微创评估') : '建议随访观察 (低危)')
    : (isAllSafe ? '早期低复发风险组' : (isLiver ? '建议介入/靶免多学科转化' : isBreast ? '建议多学科综合治疗' : isCrc ? '需多学科/辅助评估' : '需积极辅助治疗'));

  const tumorVal = profile?.tumorSize != null ? profile.tumorSize : null;
  const solidVal = profile?.solidSize != null ? profile.solidSize : null;
  const calculatedCtr = profile?.ctr != null ? profile.ctr : (tumorVal && solidVal !== null && tumorVal > 0 ? Math.round((solidVal / tumorVal) * 100) / 100 : null);

  const isPureSolid = profile?.noduleType === 'pure_solid' || (calculatedCtr !== null && calculatedCtr >= 1.0) || (profile?.solidSize != null && profile?.tumorSize != null && profile.solidSize >= profile.tumorSize);
  const isPureGgo = profile?.noduleType === 'pure_ggo' || (calculatedCtr !== null && calculatedCtr === 0) || profile?.solidSize === 0;

  const histologyText = isLiver ? (
    profile?.histology === 'hcc' || (profile as any)?.histologyType === 'hcc' ? '肝细胞癌 (HCC)' :
    profile?.histology === 'icc' || (profile as any)?.histologyType === 'icc' ? '肝内胆管癌 (ICC)' :
    profile?.histology === 'combined' ? '混合型肝癌 (HCC-ICC)' :
    profile?.histology ? `原发性${profile.histology}` : '原发性肝细胞恶性肿瘤'
  ) : isGastric ? (
    profile?.histology === 'adenocarcinoma' || (profile as any)?.histologyType === 'adenocarcinoma' ? '胃腺癌' :
    profile?.histology === 'signet_ring' || (profile as any)?.histologyType === 'signet_ring' ? '印戒细胞癌' :
    profile?.histology ? `胃${profile.histology}` : '胃原发恶性肿瘤'
  ) : isBreast ? (
    profile?.histology === 'idc' || (profile as any)?.histologyType === 'idc' ? '浸润性导管癌 (IDC)' :
    profile?.histology === 'ilc' || (profile as any)?.histologyType === 'ilc' ? '浸润性小叶癌 (ILC)' :
    profile?.histology === 'dcis' || (profile as any)?.histologyType === 'dcis' ? '导管原位癌 (DCIS)' :
    profile?.histology ? `乳腺${profile.histology}` : '乳腺原发恶性肿瘤'
  ) : isCrc ? (
    profile?.histology === 'adenocarcinoma' || (profile as any)?.histologyType === 'adenocarcinoma' ? '结直肠腺癌' :
    profile?.histology === 'mucinous' || (profile as any)?.histologyType === 'mucinous' ? '黏液腺癌' :
    profile?.histology === 'signet_ring' || (profile as any)?.histologyType === 'signet_ring' ? '印戒细胞癌' :
    profile?.histology ? `结直肠${profile.histology}` : '结直肠原发恶性肿瘤'
  ) : (
    profile?.histology === 'squamous' ? '原发性肺鳞癌' :
    profile?.histology === 'sclc' ? '原发性小细胞肺癌' :
    profile?.histology === 'large_cell' ? '原发性大细胞肺癌' :
    profile?.histology === 'adenocarcinoma' ? '原发性肺腺癌' :
    (profile?.histology ? `原发性${profile.histology}` : '待病理组织学定性')
  );

  return (
    <div className="min-h-screen bg-slate-50/70 print:bg-white print:pb-0 text-slate-900">
      
      {/* Centered Floating Toast Notification for Copied */}
      {copied && (
        <div className="fixed top-16 sm:top-20 left-1/2 -translate-x-1/2 z-[999] bg-slate-900/95 backdrop-blur-md text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700/80 text-xs sm:text-sm max-w-[90vw] sm:max-w-md text-center pointer-events-none transition-all">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="leading-snug">门诊问诊清单已成功复制到剪贴板！可直接粘贴至微信或备忘录。</span>
        </div>
      )}

      {/* Immersive Pass-Through Navigation Header: Full-width Edge-to-Edge with Safe Area on Mobile, Floating Island on Desktop */}
      <div className="fixed top-0 left-0 right-0 z-50 pointer-events-none print:hidden md:top-3.5 md:px-6">
        <nav className="w-full max-w-7xl mx-auto flex items-center justify-between px-3.5 sm:px-6 pt-[calc(0.625rem+env(safe-area-inset-top,0px))] pb-2.5 md:py-2.5 md:rounded-full bg-white/85 md:bg-white/95 backdrop-blur-xl md:backdrop-blur-md border-b md:border border-slate-200/80 md:border-slate-200/90 shadow-xs md:shadow-lg shadow-slate-900/5 transition-all pointer-events-auto gap-2">
          <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0 min-w-0">
            <Link 
              href="/profile" 
              className="text-xs sm:text-sm font-bold text-slate-600 hover:text-accent-blue transition-colors px-1.5 py-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100 whitespace-nowrap flex-shrink-0"
            >
              <span className="sm:hidden">返回</span>
              <span className="hidden sm:inline">返回档案</span>
            </Link>
            <div className="w-px h-3.5 sm:h-4 bg-slate-200 flex-shrink-0"></div>
            <div className="font-extrabold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap flex-shrink-0">
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${isGenerating ? 'bg-amber-500 animate-pulse' : 'bg-accent-teal'}`} />
              <span className="sm:hidden">{getCancerMeta(profile).short}</span>
              <span className="hidden sm:inline">{getCancerMeta(profile).name}专属深度循证解读报告</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full border ${getCancerMeta(profile).badgeClass}`}>
                {getCancerMeta(profile).badge}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <LangSwitch />
            <Link
              href="/knowledge"
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-teal-700 bg-teal-50/80 hover:bg-teal-100/90 border border-teal-200 transition-all shadow-2xs group whitespace-nowrap"
            >
              <Network className="w-3.5 h-3.5 transition-transform group-hover:scale-110 shrink-0" />
              <span>4D图谱</span>
            </Link>

            {!isGenerating && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                {/* 0. Re-analyze / Regenerate Report Button */}
                {profile && reportMarkdown && (
                  <button
                    onClick={() => startGeneratingReport(profile)}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-200 hover:border-amber-300 transition-all shadow-2xs cursor-pointer group whitespace-nowrap disabled:opacity-50"
                    title="按当前最新病理指标重新生成循证报告"
                  >
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600 transition-transform group-hover:-rotate-90 flex-shrink-0" />
                    <span className="sm:hidden">重新分析</span>
                    <span className="hidden sm:inline">重新分析报告</span>
                  </button>
                )}

                {/* 1. Export / Print PDF Button */}
                <button 
                  onClick={handleDirectPdfExport}
                  disabled={isExportingDirectPdf}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-700 border border-slate-200 hover:border-blue-300 transition-all shadow-2xs cursor-pointer group whitespace-nowrap disabled:opacity-50"
                  title="一键直接下载 A4 PDF 文档 (零服务器消耗，适合物理打印与就医归档)"
                >
                  {isExportingDirectPdf ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                      <span className="sm:hidden">生成中</span>
                      <span className="hidden sm:inline">生成 PDF 中...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-3.5 h-3.5 text-blue-600 transition-transform group-hover:-translate-y-0.5 flex-shrink-0" />
                      <span className="sm:hidden">PDF</span>
                      <span className="hidden sm:inline">下载 A4 PDF</span>
                    </>
                  )}
                </button>

                {/* 2. Export Consultation Pocket Card Button */}
                <button
                  onClick={handleExportCardImage}
                  disabled={isExportingCard}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-all cursor-pointer shadow-2xs group whitespace-nowrap disabled:opacity-50"
                  title="生成门诊 3 分钟就医问诊便签卡 (轻便 2x 超清图)"
                >
                  {isExportingCard ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-teal-800 border-t-transparent rounded-full animate-spin" />
                      <span className="sm:hidden">生成中</span>
                      <span className="hidden sm:inline">生成中...</span>
                    </>
                  ) : (
                    <>
                      <ClipboardList className="w-3.5 h-3.5 text-teal-600 transition-transform group-hover:scale-110 flex-shrink-0" />
                      <span className="sm:hidden">问诊卡</span>
                      <span className="hidden sm:inline">问诊便签卡</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Main Page Layout Wrapper */}
      <div className="max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-8 sm:pb-12 print:pt-0 print:px-0">

        {/* Stale Report Alert Banner (When calibrated profile updates desynchronize with cached report) */}
        {isReportStale && !isGenerating && (
          <div className="mb-4 bg-gradient-to-r from-amber-50 via-amber-50/90 to-yellow-50 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 shadow-sm text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in print:hidden">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-900">
                    检测到病理指标已校对更新
                  </h4>
                  <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold">
                    当前展示为历史版本
                  </span>
                </div>
                <p className="text-xs text-amber-900/80 mt-0.5 leading-relaxed">
                  您最近在档案中微调或校对了病理指标，当前报告仍基于旧指标生成。建议立即按最新指标重新生成报告。
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <button
                onClick={() => profile && startGeneratingReport(profile)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>按最新指标重新生成</span>
              </button>
            </div>
          </div>
        )}

        {/* Pure printable & long-image exportable container (No trailing blank space) */}
        <div id="report-printable-area" ref={reportContainerRef} className="space-y-4 sm:space-y-5 bg-slate-50/90 p-3.5 sm:p-6 md:p-7 rounded-3xl border border-slate-200/90 shadow-sm print:bg-white print:border-none print:shadow-none print:p-0">
          
          {/* Professional Clinical Report Integrated Header (Streamlined, Brand + Sync Status + Edit Action) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 border-b border-slate-200/90 text-xs text-slate-500">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-2">
                <span className="font-black text-blue-700 text-sm sm:text-base tracking-tight">知癌维基 ZhiaiWiki</span>
                <span className="text-slate-300">|</span>
                <span className="font-bold text-slate-800 text-xs sm:text-sm">
                  {getCancerMeta(profile).name}临床专属循证解读报告
                </span>
              </div>
              {isLoadedFromCache && !isGenerating && cachedTime && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200/80 print:hidden">
                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500"></span>
                  <span>已同步档案 ({cachedTime})</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              <Link
                href="/profile?mode=calibrate"
                className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200 shadow-2xs hover:border-blue-200 transition-all cursor-pointer print:hidden group"
                title="若指标有更新，点击前往个人档案修改"
              >
                <FileEdit className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors shrink-0" />
                <span>校对病理指标</span>
              </Link>
              <div className="text-[11px] text-slate-400 font-medium font-mono whitespace-nowrap">
                <span className="hidden print:inline">报告归档时间: </span>
                <span className="print:hidden">报告时间: </span>
                <span suppressHydrationWarning>{new Date().toLocaleDateString('zh-CN')}</span>
              </div>
            </div>
          </div>


        {/* Patient Clinical Overview Hero Card */}
        {profile && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 md:p-6 border border-slate-200 shadow-sm mb-5 print:border-none print:shadow-none print:mb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h2 className="text-base sm:text-lg md:text-xl font-black text-slate-900">
                    {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging' || profile.reportType === 'ultrasound'
                      ? (isBreast
                          ? (profile.stage ? `c${profile.stage} 期乳腺病灶 (影像评估)` : '早期乳腺肿物 (待病理确诊)')
                          : isCrc
                          ? (profile.stage ? `c${profile.stage} 期结直肠病灶 (影像/内镜评估)` : '早期结直肠肿物 (待病理确诊)')
                          : (profile.stage ? `c${profile.stage} 期肺结节 (CT 影像初估)` : '早期肺结节 (待病理确诊)'))
                      : (profile.stage ? `${profile.stage} 期${histologyText}` : `早期${histologyText}`)
                    }
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full border text-xs font-black ${isBreast ? 'bg-pink-50 text-pink-700 border-pink-200' : isCrc ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                    {isBreast ? 'AJCC 第8版' : isCrc ? 'AJCC 第8版' : 'IASLC 第9版'} · {profile.tStage || (isBreast ? "T1c" : isCrc ? "T1" : "T1a")}{profile.nStage || "N0"}{profile.mStage || "M0"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-600">
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {profile.age ? `${profile.age} 岁 · ` : ''}{profile.sex === 'female' ? '女性' : profile.sex === 'male' ? '男性' : '性别未录入'}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-medium">
                    {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging' || profile.reportType === 'ultrasound'
                      ? (isBreast
                          ? (profile.noduleLocation || (profile as any).breastLaterality ? `方位: ${(profile as any).breastLaterality === 'left' ? '左乳' : (profile as any).breastLaterality === 'right' ? '右乳' : '双乳'} ${(profile as any).quadrant || ''}` : '乳腺原发灶 (随访中)')
                          : isCrc
                          ? `病灶部位: ${profile.noduleLocation || ((profile as any).primaryLocation === 'rectum' ? '直肠' : (profile as any).primaryLocation === 'right_colon' ? '右半结肠' : '结直肠')} (随访中)`
                          : `结节部位: ${profile.noduleLocation || '肺部结节'} (动态随访中)`)
                      : surgeryText
                    }
                  </span>
                </div>
                {profile.tumorSize != null ? (
                  <div className="text-[11px] sm:text-[12px] text-slate-500 mt-1">
                    {isBreast ? (
                      <span>
                        <Ruler className="w-3.5 h-3.5 text-blue-600 inline mr-1 -mt-0.5" />
                        <strong>肿瘤最大径</strong>: {profile.tumorSize} cm
                        {(profile as any).molecularSubtype && (
                          <span> · <strong>分子分型</strong>: <strong className="text-purple-700">{(profile as any).molecularSubtype}</strong></span>
                        )}
                        {(profile as any).biRads && (
                          <span> · <strong>BI-RADS</strong>: <strong className="text-pink-700">{(profile as any).biRads}类</strong></span>
                        )}
                      </span>
                    ) : isCrc ? (
                      <span>
                        <Ruler className="w-3.5 h-3.5 text-blue-600 inline mr-1 -mt-0.5" />
                        <strong>病灶最大浸润径</strong>: {profile.tumorSize} cm
                        {(profile as any).primaryLocation && (
                          <span> · <strong>原发解剖部位</strong>: <strong className="text-emerald-700">{(profile as any).primaryLocation === 'rectum' ? '直肠' : (profile as any).primaryLocation === 'right_colon' ? '右半结肠' : '左半结肠'}</strong></span>
                        )}
                        {(profile as any).distanceFromAnalVerge != null && (
                          <span> · <strong>距肛门缘</strong>: <strong className="text-teal-700">{(profile as any).distanceFromAnalVerge} cm</strong></span>
                        )}
                      </span>
                    ) : (
                      isPureSolid ? (
                        <span><Ruler className="w-3.5 h-3.5 text-blue-600 inline mr-1 -mt-0.5" /><strong>病灶最大径</strong>: {profile.tumorSize} cm · 性质: <strong className="text-blue-700">纯实性软组织结节</strong> (CTR: 1.0)</span>
                      ) : isPureGgo ? (
                        <span><Ruler className="w-3.5 h-3.5 text-emerald-600 inline mr-1 -mt-0.5" /><strong>结节最大径</strong>: {profile.tumorSize} cm · 性质: <strong className="text-emerald-700">纯磨玻璃密度/无实性成分</strong> (CTR: 0)</span>
                      ) : (
                        <span><Ruler className="w-3.5 h-3.5 text-teal-600 inline mr-1 -mt-0.5" /><strong>结节总全径</strong>: {profile.tumorSize} cm · CT 实性成分: <strong className="text-teal-700">{profile.solidSize != null ? `${profile.solidSize} cm` : '微量'}</strong> (CTR: {profile.ctr ?? (profile.solidSize && profile.tumorSize ? Math.round((profile.solidSize / profile.tumorSize) * 100) / 100 : '待核算')})</span>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-[11px] sm:text-[12px] text-slate-400 mt-1 flex items-center gap-1.5">
                    <Ruler className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{isBreast ? '未提供病理肿瘤浸润径' : isCrc ? '未提供原发灶大体浸润数据' : '未提供薄层胸部 CT 报告 · 结节大小待查'}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium hidden md:inline">
                  {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging' ? '恶性风险:' : '风险评级:'}
                </span>
                <span className={`px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1 ${
                  profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging'
                    ? (profile.riskLevel === 'high' ? 'bg-amber-50 text-amber-800 border border-amber-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200')
                    : (profile.nStage === 'N2' || profile.nStage === 'N2b' || profile.stas === 'positive' || (profile.stas as any) === true
                        ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200')
                }`}>
                  {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging'
                    ? (profile.riskLevel === 'high' ? (
                        <>
                          <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>{isBreast ? '建议穿刺活检' : isCrc ? '建议多学科/内镜评估' : '需胸外科微创评估'}</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>早期随访观察</span>
                        </>
                      ))
                    : (profile.nStage === 'N2' || profile.nStage === 'N2b' || profile.stas === 'positive' || (profile.stas as any) === true ? (
                        <>
                          <Zap className="w-3 h-3 text-amber-600 shrink-0" />
                          <span>需积极辅助治疗</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>早期低风险随访</span>
                        </>
                      ))
                  }
                </span>
              </div>
            </div>

            {profile.versionBridgeNotice && (
              <div className="mt-3.5 p-3 rounded-xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-2 print:hidden">
                <GitBranch className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <span className="font-bold">{isBreast ? 'AJCC 第 8 版预后病理分期演变：' : isCrc ? 'AJCC 第 8 版结直肠分期演变释疑：' : 'IASLC 第 9 版国际分期演变释疑：'}</span>
                  <span className="text-teal-900 leading-relaxed font-medium">{profile.versionBridgeNotice}</span>
                </div>
              </div>
            )}

            {/* CT Matrix vs Pathology Matrix */}
            {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging' ? (
              <div className="mt-3 sm:mt-4 pt-1">
                <div className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1.5">
                  <Scan className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>关键影像学评估矩阵</span>
                  <span className="text-slate-400 font-normal text-[10px] sm:text-[11px]">(基于薄层 CT 恶性征象与实性占比)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <MatrixBadge 
                    label="结节形态" 
                    value={profile.noduleType === 'pure_ggo' ? '纯磨玻璃(pGGO)' : profile.noduleType === 'pure_solid' ? '纯实性结节' : profile.noduleType === 'mixed_ggo' ? '混合磨玻璃(mGGO)' : (profile.noduleType || '未查/待定')} 
                    type={profile.noduleType === 'pure_solid' ? 'warning' : (profile.noduleType ? 'safe' : 'neutral')}
                  />
                  <MatrixBadge 
                    label="实性占比 (CTR)" 
                    value={profile.ctr != null ? `${Math.round(profile.ctr * 100)}%` : (profile.solidSize != null ? `实性 ${profile.solidSize}cm` : '未提供/待评估')} 
                    type={profile.ctr != null ? (profile.ctr > 0.5 ? 'warning' : 'safe') : 'neutral'}
                  />
                  <MatrixBadge 
                    label="高危影像征象" 
                    value={
                      profile.imagingFeatures && profile.imagingFeatures.length > 0
                        ? profile.imagingFeatures.slice(0, 2).join(' / ')
                        : '未见明显高危征象'
                    } 
                    type={profile.imagingFeatures && profile.imagingFeatures.length > 0 ? 'warning' : 'safe'}
                  />
                  <MatrixBadge 
                    label="Fleischner 指南" 
                    value={profile.ctr != null ? (profile.ctr >= 0.5 ? 'MDT多学科评估' : '3~6个月薄层CT') : '建议完善薄层CT'} 
                    type={profile.ctr != null ? (profile.ctr >= 0.5 ? 'warning' : 'safe') : 'neutral'}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-4 pt-1">
                <div className="text-xs font-semibold text-slate-500 mb-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>关键病理红绿灯矩阵</span>
                    <span className="text-slate-400 font-normal text-[11px]">(决定预后与辅助治疗的核心指标)</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-normal">6项标准化病理特征</span>
                </div>
                {isBreast ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <MatrixBadge 
                      label="切缘状态" 
                      value={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.margin as any) === true)
                          ? '阳性 (残留)'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false)
                              ? '阴性 (R0安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.margin as any) === true)
                          ? 'danger'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="淋巴结状态" 
                      value={
                        profile.nStage === 'N0' ? 'N0 (无转移)' :
                        profile.nStage === 'N1' ? 'N1 (1-3枚转移)' :
                        profile.nStage === 'N2' ? 'N2 (4-9枚转移)' :
                        (profile.nStage || '待分期')
                      } 
                      type={profile.nStage === 'N0' ? 'safe' : (profile.nStage ? 'danger' : 'neutral')}
                    />
                    <MatrixBadge 
                      label="ER / PR 状态" 
                      value={
                        `${(profile as any).erStatus === 'positive' ? 'ER+' : (profile as any).erStatus === 'negative' ? 'ER-' : 'ER待查'} / ${(profile as any).prStatus === 'positive' ? 'PR+' : (profile as any).prStatus === 'negative' ? 'PR-' : 'PR待查'}`
                      } 
                      type={(profile as any).erStatus === 'positive' ? 'safe' : 'neutral'}
                    />
                    <MatrixBadge 
                      label="HER2 状态" 
                      value={
                        (profile as any).her2StatusCategory === 'positive' ? '3+ (阳性)' :
                        (profile as any).her2StatusCategory === 'low' ? '低表达(1+/2+FISH-)' :
                        (profile as any).her2StatusCategory === 'zero' ? '0 (阴性)' :
                        ((profile as any).her2Status || '待查')
                      } 
                      type={(profile as any).her2StatusCategory === 'positive' ? 'warning' : 'safe'}
                    />
                    <MatrixBadge 
                      label="脉管癌栓 (LVI)" 
                      value={
                        (profile.lvi === 'positive' || (profile.lvi as any) === true)
                          ? '阳性 (高危)'
                          : ((profile.lvi === 'negative' || (profile.lvi as any) === false)
                              ? '阴性 (安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.lvi === 'positive' || (profile.lvi as any) === true)
                          ? 'warning'
                          : ((profile.lvi === 'negative' || (profile.lvi as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="Nottingham 分级" 
                      value={
                        (profile as any).nottinghamGrade === '3' || profile.grade === '3'
                          ? 'Grade 3 (低分化高危)'
                          : ((profile as any).nottinghamGrade === '1' || profile.grade === '1')
                              ? 'Grade 1 (高分化)'
                              : (((profile as any).nottinghamGrade === '2' || profile.grade === '2')
                                  ? 'Grade 2 (中分化)'
                                  : '未分级 / 待查')
                      } 
                      type={
                        (profile as any).nottinghamGrade === '3' || profile.grade === '3'
                          ? 'warning'
                          : 'safe'
                      }
                    />
                  </div>
                ) : isCrc ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <MatrixBadge 
                      label="切缘状态 (CRM)" 
                      value={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.cancerSpecificData as any)?.crmStatus === 'positive')
                          ? '阳性 (残留/高危)'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.cancerSpecificData as any)?.crmStatus === 'negative')
                              ? '阴性 (R0安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.cancerSpecificData as any)?.crmStatus === 'positive')
                          ? 'danger'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.cancerSpecificData as any)?.crmStatus === 'negative')
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="淋巴结 / TD" 
                      value={
                        profile.nStage === 'N0' ? 'N0 (无转移)' :
                        profile.nStage === 'N1c' ? 'N1c (见肿瘤沉积TD)' :
                        profile.nStage === 'N1' || profile.nStage === 'N1a' || profile.nStage === 'N1b' ? `${profile.nStage} (1-3枚)` :
                        profile.nStage === 'N2' || profile.nStage === 'N2a' || profile.nStage === 'N2b' ? `${profile.nStage} (≥4枚)` :
                        (profile.nStage || '待分期')
                      } 
                      type={profile.nStage === 'N0' ? 'safe' : (profile.nStage === 'N1c' ? 'warning' : profile.nStage ? 'danger' : 'neutral')}
                    />
                    <MatrixBadge 
                      label="MSI / MMR" 
                      value={
                        (profile.cancerSpecificData as any)?.dmmrStatus === 'dMMR' || (profile.cancerSpecificData as any)?.msiStatus === 'MSI-H' ? 'dMMR / MSI-H' :
                        (profile.cancerSpecificData as any)?.dmmrStatus === 'pMMR' || (profile.cancerSpecificData as any)?.msiStatus === 'MSS' ? 'pMMR / MSS' :
                        '待查'
                      } 
                      type={
                        (profile.cancerSpecificData as any)?.dmmrStatus === 'dMMR' || (profile.cancerSpecificData as any)?.msiStatus === 'MSI-H' ? 'safe' : 'neutral'
                      }
                    />
                    <MatrixBadge 
                      label="RAS / BRAF" 
                      value={
                        (profile.cancerSpecificData as any)?.krasMutation === 'wildtype' && (profile.cancerSpecificData as any)?.nrasMutation === 'wildtype' && (profile.cancerSpecificData as any)?.brafMutation === 'wildtype'
                          ? '全野生型 (WT)'
                          : (profile.cancerSpecificData as any)?.brafMutation === 'V600E'
                          ? 'BRAF V600E'
                          : (profile.cancerSpecificData as any)?.krasMutation && (profile.cancerSpecificData as any)?.krasMutation !== 'wildtype'
                          ? `KRAS ${(profile.cancerSpecificData as any)?.krasMutation}`
                          : '待检测'
                      } 
                      type={
                        (profile.cancerSpecificData as any)?.krasMutation === 'wildtype' ? 'safe' : 'warning'
                      }
                    />
                    <MatrixBadge 
                      label="脉管癌栓 (EMVI)" 
                      value={
                        (profile.cancerSpecificData as any)?.emviStatus === 'positive' || profile.lvi === 'positive'
                          ? '阳性 (高危)'
                          : ((profile.cancerSpecificData as any)?.emviStatus === 'negative' || profile.lvi === 'negative')
                          ? '阴性 (安全)'
                          : '未提及 / 待查'
                      } 
                      type={
                        (profile.cancerSpecificData as any)?.emviStatus === 'positive' || profile.lvi === 'positive'
                          ? 'warning'
                          : 'safe'
                      }
                    />
                    <MatrixBadge 
                      label="检出淋巴结质控" 
                      value={
                        (profile.cancerSpecificData as any)?.lymphNodesExamined != null
                          ? `${(profile.cancerSpecificData as any)?.lymphNodesExamined} 枚 ${(profile.cancerSpecificData as any)?.lymphNodesExamined >= 12 ? '(≥12枚达标)' : '(<12枚偏少)'}`
                          : '未统计 / 待查'
                      } 
                      type={
                        (profile.cancerSpecificData as any)?.lymphNodesExamined != null && (profile.cancerSpecificData as any)?.lymphNodesExamined >= 12
                          ? 'safe'
                          : 'warning'
                      }
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    <MatrixBadge 
                      label="切缘状态" 
                      value={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.margin as any) === true)
                          ? '阳性(有残留)'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false)
                              ? '阴性(R0安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.margin === 'positive' || profile.marginStatus === 'positive' || (profile.margin as any) === true)
                          ? 'danger'
                          : ((profile.margin === 'negative' || profile.marginStatus === 'negative' || (profile.margin as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="淋巴结状态" 
                      value={
                        profile.nStage === 'N0' ? 'N0 (无转移)' :
                        profile.nStage === 'N1' ? 'N1 (肺门累及)' :
                        profile.nStage === 'N2' ? 'N2 (纵隔转移)' :
                        (profile.nStage || '待分期')
                      } 
                      type={profile.nStage === 'N0' ? 'safe' : (profile.nStage === 'N1' || profile.nStage === 'N2' ? 'danger' : 'neutral')}
                    />
                    <MatrixBadge 
                      label="胸膜侵犯 (VPI)" 
                      value={
                        (profile.vpi === 'positive' || (profile.vpi as any) === true)
                          ? 'PL1/PL2 (阳性高危)'
                          : ((profile.vpi === 'negative' || (profile.vpi as any) === false)
                              ? 'PL0 (未侵犯)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.vpi === 'positive' || (profile.vpi as any) === true)
                          ? 'warning'
                          : ((profile.vpi === 'negative' || (profile.vpi as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="气道播散 (STAS)" 
                      value={
                        (profile.stas === 'positive' || (profile.stas as any) === true)
                          ? '阳性 (高危)'
                          : ((profile.stas === 'negative' || (profile.stas as any) === false)
                              ? '阴性 (安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.stas === 'positive' || (profile.stas as any) === true)
                          ? 'warning'
                          : ((profile.stas === 'negative' || (profile.stas as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="脉管癌栓 (LVI)" 
                      value={
                        (profile.lvi === 'positive' || (profile.lvi as any) === true)
                          ? '阳性 (高危)'
                          : ((profile.lvi === 'negative' || (profile.lvi as any) === false)
                              ? '阴性 (安全)'
                              : '未提及 / 待查')
                      } 
                      type={
                        (profile.lvi === 'positive' || (profile.lvi as any) === true)
                          ? 'warning'
                          : ((profile.lvi === 'negative' || (profile.lvi as any) === false)
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                    <MatrixBadge 
                      label="IASLC 病理分级" 
                      value={
                        (profile.iaslcGrade === '3' || profile.grade === '3')
                          ? 'Grade 3 (低分化高危)'
                          : ((profile.iaslcGrade === '1' || profile.grade === '1')
                              ? 'Grade 1 (高分化)'
                              : ((profile.iaslcGrade === '2' || profile.grade === '2')
                                  ? 'Grade 2 (中分化)'
                                  : '未分级 / 待查'))
                      } 
                      type={
                        (profile.iaslcGrade === '3' || profile.grade === '3')
                          ? 'warning'
                          : ((profile.iaslcGrade === '1' || profile.grade === '1' || profile.iaslcGrade === '2' || profile.grade === '2')
                              ? 'safe'
                              : 'neutral')
                      }
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {error && (
          (errorInfo?.isRateLimit || isRateLimitOrQuotaError(error)) ? (
            <div className="bg-gradient-to-br from-amber-50/95 via-sky-50/70 to-indigo-50/50 text-slate-800 p-5 sm:p-7 rounded-3xl border border-amber-200/90 mb-6 print:hidden shadow-sm space-y-4 animate-fade-in">
              <div className="flex items-start justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex items-center justify-center text-amber-700 shrink-0">
                    <Clock className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-extrabold text-[10px] sm:text-[11px] flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-600" />
                        <span>{errorInfo?.badge || "医学推理高负载保护 · 算力队列调度中"}</span>
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base sm:text-lg text-slate-900 mt-1">
                      {errorInfo?.title || "AI 循证医学算力资源调度中"}
                    </h3>
                  </div>
                </div>

                {retryCountdown > 0 && (
                  <div className="px-3 py-1.5 rounded-xl bg-white/90 border border-amber-200 text-amber-900 font-mono font-bold text-xs flex items-center gap-1.5 shadow-2xs">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>预计还需缓冲: {retryCountdown} 秒</span>
                  </div>
                )}
              </div>

              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {errorInfo?.message || error}
              </p>

              {/* Countdown Progress Card */}
              <div className="bg-white/85 p-3.5 sm:p-4 rounded-2xl border border-amber-200/80 space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-600" />
                    <span>算力队列恢复进度</span>
                  </span>
                  <span className={`font-mono text-xs ${retryCountdown === 0 ? "text-emerald-700 font-extrabold" : "text-amber-800"}`}>
                    {retryCountdown > 0 ? `通道缓冲中... (${retryCountdown}s)` : "✅ 算力通道已重新就绪"}
                  </span>
                </div>
                <div className="w-full bg-amber-100/70 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-500 via-sky-500 to-emerald-500 h-full transition-all duration-1000 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(5, ((60 - retryCountdown) / 60) * 100))}%` }}
                  />
                </div>
                {errorInfo?.suggestion && (
                  <p className="text-[11px] text-slate-600 leading-relaxed pt-0.5">
                    💡 <strong>贴心建议</strong>：{errorInfo.suggestion}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-1 flex items-center gap-2.5 flex-wrap">
                {profile && (
                  <button
                    onClick={() => startGeneratingReport(profile)}
                    disabled={isGenerating}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                      retryCountdown === 0
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white animate-pulse"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    <RotateCcw className={`w-3.5 h-3.5 ${retryCountdown > 0 ? "animate-spin-slow" : ""}`} />
                    <span>{retryCountdown === 0 ? "算力已就绪 · 立即生成报告" : `缓冲中 (${retryCountdown}s) · 提前重试`}</span>
                  </button>
                )}
                <Link
                  href="/wiki"
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>查阅专科循证百科</span>
                </Link>
                <Link
                  href="/profile"
                  className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-200 transition-colors text-xs flex items-center gap-1.5 shadow-2xs"
                >
                  <FileEdit className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                  <span>核对病理分期指标</span>
                </Link>
              </div>
            </div>
          ) : isReviewRequired || (profile?.reportReviewStatus && profile?.reportReviewStatus !== 'confirmed' && !reportMarkdown && !isGenerating) ? (
            <div className="bg-gradient-to-b from-blue-50/90 via-white to-slate-50 p-5 sm:p-7 rounded-3xl border border-blue-200 shadow-sm mb-6 print:hidden space-y-4 animate-fade-in">
              <div className="flex items-start sm:items-center justify-between gap-3 flex-wrap pb-3.5 border-b border-blue-100">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-5 h-5 text-white" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-sm sm:text-base text-slate-900 flex items-center gap-2">
                      <span>临床循证安全核对 · 关键临床指标确认</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      为确保生成的深度循证报告与长程随访方案完全基于您的真实病情，请核对下方关键临床指标
                    </p>
                  </div>
                </div>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  循证安全前置校验
                </span>
              </div>

              {/* Key Clinical Metrics Summary Grid */}
              {profile && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 py-1">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold block">确诊专科 / 癌种</span>
                    <span className="text-xs sm:text-sm font-extrabold text-blue-700 block truncate">
                      {isBreast ? "乳腺肿瘤" : isCrc ? "结直肠肿瘤" : isGastric ? "胃部肿瘤" : isLiver ? "原发性肝癌" : isEsoph ? "食管肿瘤" : isThyroid ? "甲状腺肿瘤" : isEndometrial ? "子宫内膜癌" : isCervical ? "宫颈癌" : isPancreatic ? "胰腺肿瘤" : "肺结节与肺腺癌"}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold block">当前分期 (TNM)</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
                      {profile.stage ? `${profile.stage} 期` : '早期待定'} ({profile.tStage || 'Tx'}{profile.nStage || 'Nx'}{profile.mStage || 'M0'})
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold block">病灶浸润大小 / 径长</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
                      {profile.tumorSize != null ? `${profile.tumorSize} cm` : '未录入/待核算'}
                      {profile.solidSize != null ? ` (实性 ${profile.solidSize}cm)` : ''}
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-1">
                    <span className="text-[11px] text-slate-500 font-semibold block">高危病理与转移排查</span>
                    <span className={`text-xs sm:text-sm font-extrabold block truncate ${isAllSafe ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {isAllSafe ? '未见高危因素 (低危)' : '存在高危/需关注因素'} · {profile.brainMri === 'negative' || profile.systemicStagingConfirmed ? 'M0无转移' : '排查就绪'}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={handleConfirmReviewAndGenerate}
                  disabled={isConfirmingReview || isGenerating}
                  className="btn-primary px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isConfirmingReview || isGenerating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>正在启动深度循证分析...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-white" />
                      <span>我已核对上述关键临床指标，确认无误并生成报告</span>
                    </>
                  )}
                </button>

                <Link
                  href="/profile?mode=calibrate"
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 transition-colors text-xs sm:text-sm flex items-center gap-1.5 shadow-2xs"
                >
                  <FileEdit className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>修改/微调指标</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="bg-rose-50 text-rose-800 p-5 sm:p-6 rounded-3xl border border-rose-200 mb-6 print:hidden shadow-xs space-y-3">
              <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2 text-rose-900">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorInfo?.title || "服务提示"}</span>
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed">{error}</p>
              {errorInfo?.suggestion && (
                <p className="text-xs text-rose-700 bg-white/60 p-2.5 rounded-xl border border-rose-200/60 leading-relaxed">
                  💡 <strong>建议指引</strong>：{errorInfo.suggestion}
                </p>
              )}
              <div className="pt-1 flex items-center gap-3 flex-wrap">
                <Link
                  href="/profile"
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <ClipboardList className="w-3.5 h-3.5 shrink-0" />
                  <span>前往患者临床档案页</span>
                </Link>
                {profile && (
                  <button
                    onClick={() => startGeneratingReport(profile)}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-rose-100/60 text-rose-700 font-bold border border-rose-300 transition-colors text-xs cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5 shrink-0" />
                    <span>重新尝试生成报告</span>
                  </button>
                )}
              </div>
            </div>
          )
        )}

        {/* Report Content Main Container */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[260px] print:border-none print:shadow-none print:m-0 print:p-0">
          
          {/* Top Decorative Gradient Accent Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-accent-blue via-accent-teal to-accent-blue print:hidden" />
          
          <div className="p-3.5 sm:p-7 md:p-9 print:p-0">
            {!reportMarkdown && isGenerating && (
              <div className="py-4 print:hidden">
                <ReasoningTicker isGenerating={isGenerating} />
              </div>
            )}

            
            {/* Custom Enhanced Medical ReactMarkdown Rendering Engine */}
            <div className="prose prose-slate max-w-none 
              prose-headings:font-bold prose-headings:text-slate-900
              prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm md:prose-p:text-[15px]
              prose-strong:text-slate-900 prose-strong:font-bold
              print:prose-p:text-black print:prose-headings:text-black print:text-sm"
            >
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ node: _node, children, ...props }) => {
                    const text = String(children || "");
                    const isChecklist = text.includes("问诊清单") || text.includes("就医便签") || text.includes("问诊便签") || text.includes("门诊就医");
                    return (
                      <div className="mt-7 mb-4 pt-3 border-t border-slate-100 first:border-none first:pt-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-slate-50/90 p-3 sm:p-3.5 rounded-2xl border border-slate-200/80">
                          <h2 className="flex items-center gap-2 text-slate-900 font-extrabold text-base sm:text-lg md:text-xl tracking-tight m-0" {...props}>
                            {children}
                          </h2>
                          {isChecklist && (
                            <button
                              type="button"
                              onClick={handleCopyChecklist}
                              className="self-start sm:self-center flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-all cursor-pointer print:hidden"
                            >
                              <Copy className="w-3.5 h-3.5 shrink-0" />
                              <span>一键复制此问诊清单</span>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  },
                  h3: ({ node: _node, ...props }) => (
                    <h3 className="text-base md:text-lg font-bold text-slate-800 mt-6 mb-2 flex items-center gap-1.5" {...props} />
                  ),
                  blockquote: ({ node: _node, children, ...props }) => {
                    const contentStr = String(children || "");
                    const isSummary = contentStr.includes("核心研判") || contentStr.includes("循证推演与文献对照") || contentStr.includes("🌟") || contentStr.includes("Executive Summary");
                    const isDisclaimer = contentStr.includes("免责声明") || contentStr.includes("🛡️");
                    const isWarning = contentStr.includes("警示信号") || contentStr.includes("🚨") || contentStr.includes("提前返院");

                    if (isSummary) {
                      return (
                        <div className="my-6 p-5 md:p-6 rounded-xl bg-slate-50/90 border border-slate-200/90 border-l-4 border-l-teal-600 shadow-xs text-slate-900">
                          <div className="flex items-center justify-between gap-2 text-xs font-bold uppercase tracking-wider text-teal-900 mb-2.5 flex-wrap">
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-4 h-4 text-teal-600 shrink-0" />
                              <span>临床特征与文献对照 · 循证速览</span>
                            </div>
                            <span className="text-[10px] font-mono font-bold text-teal-800 bg-teal-100/70 px-2 py-0.5 rounded border border-teal-200">
                              IASLC 第9版 / NCCN 2025 循证对照
                            </span>
                          </div>
                          <div className="text-sm md:text-[15px] font-medium leading-relaxed text-slate-800">
                            {children}
                          </div>
                        </div>
                      );
                    }

                    if (isWarning) {
                      return (
                        <div className="my-6 p-4 md:p-5 rounded-2xl bg-rose-50 border border-rose-200 shadow-xs text-rose-950">
                          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider mb-1.5">
                            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>需提前返院检查的警示信号</span>
                          </div>
                          <div className="text-sm leading-relaxed text-rose-900 font-medium">
                            {children}
                          </div>
                        </div>
                      );
                    }

                    if (isDisclaimer) {
                      return (
                        <div className="my-6 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed shadow-2xs">
                          {children}
                        </div>
                      );
                    }

                    return (
                      <blockquote className="bg-blue-50/70 border-l-4 border-blue-500 rounded-r-xl p-4 my-4 text-slate-800 not-italic shadow-xs text-sm" {...props}>
                        {children}
                      </blockquote>
                    );
                  },
                  ul: ({ node: _node, ...props }) => (
                    <ul className="space-y-2 my-3 pl-1 list-none" {...props} />
                  ),
                  li: ({ node, children, className, ...props }) => {
                    const isTaskListItem = className?.includes('task-list-item') || Boolean(node?.children?.some((c: any) => c.tagName === 'input'));
                    if (isTaskListItem) {
                      return (
                        <li className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50/80 hover:bg-blue-50/70 border border-slate-200 hover:border-blue-300 transition-all my-2.5 shadow-2xs group" {...props}>
                          <div className="flex-1 text-sm md:text-[15px] text-slate-800 leading-relaxed font-medium">{children}</div>
                        </li>
                      );
                    }
                    return (
                      <li className="flex items-start gap-2.5 text-sm md:text-[15px] text-slate-700 leading-relaxed my-1.5" {...props}>
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">{children}</div>
                      </li>
                    );
                  },
                  input: ({ node: _node, ...props }) => {
                    if (props.type === 'checkbox') {
                      return (
                        <input 
                          type="checkbox" 
                          defaultChecked={props.checked}
                          className="w-4 h-4 rounded-md text-blue-600 border-slate-300 focus:ring-blue-500 cursor-pointer accent-blue-600 mt-1 flex-shrink-0" 
                        />
                      );
                    }
                    return <input {...props} />;
                  },
                  table: ({ node: _node, ...props }) => (
                    <div className="overflow-x-auto my-5 rounded-2xl border border-slate-200 shadow-xs">
                      <table className="min-w-full divide-y divide-slate-200 text-sm" {...props} />
                    </div>
                  ),
                  thead: ({ node: _node, ...props }) => (
                    <thead className="bg-slate-100/80" {...props} />
                  ),
                  th: ({ node: _node, ...props }) => (
                    <th className="px-4 py-3 text-left font-bold text-slate-700 text-xs uppercase tracking-wider" {...props} />
                  ),
                  td: ({ node: _node, ...props }) => (
                    <td className="px-4 py-3 border-t border-slate-100 text-slate-700" {...props} />
                  ),
                  hr: ({ node: _node, ...props }) => (
                    <hr className="my-6 border-slate-200" {...props} />
                  ),
                  strong: ({ node: _node, ...props }) => (
                    <strong className="font-bold text-slate-900 bg-amber-50/90 text-amber-950 px-1 py-0.5 rounded" {...props} />
                  )
                }}
              >
                {reportMarkdown}
              </ReactMarkdown>
            </div>

            {isGenerating && reportMarkdown && (
              <div className="mt-6 flex gap-1.5 items-center justify-center text-accent-blue text-xs font-semibold print:hidden">
                <span className="w-2 h-2 bg-accent-blue rounded-full animate-ping" />
                <span>循证分析引擎正在整理文献与推演中...</span>
              </div>
            )}
            
            <div ref={contentEndRef} className="h-0.5 print:hidden" />
          </div>
        </div>

          {/* Native React UI Warmth & Medical Care Card (Replaces LLM boilerplate tokens with modern human-centric design) */}
          <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-teal-50/70 via-sky-50/50 to-blue-50/70 border border-teal-200/80 shadow-2xs text-slate-800">
            <div className="flex items-center gap-2 mb-2 text-teal-800 font-bold text-xs uppercase tracking-wide">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500 shrink-0" />
              <span>知癌维基 · 临床关怀与康复寄语</span>
            </div>
            <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
              现代实体瘤精准诊疗已取得突破性进展。规范的手术根治、分期评估与长程生活质量随访构成了最坚实的生命防线。请您遵从主治医师团队医嘱，规律随访，保持平和乐观心态与均衡作息，知癌维基愿全程陪伴您的每一步康复之路。
            </p>
            <div className="mt-2.5 pt-2 border-t border-teal-100 flex items-center justify-between text-[11px] text-teal-700 font-medium flex-wrap gap-1">
              <span>祝您早日康复，健康平安！</span>
              <span className="font-bold">知癌维基 (ZhiaiWiki) 临床循证知识库团队 敬上</span>
            </div>
          </div>

          {/* Medical Disclaimer Stamp Footer inside report */}
          <div className="border-t border-slate-200/90 pt-3 text-[10px] text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1">
            <span>免责声明：本报告由 知癌维基 (ZhiaiWiki) 临床循证推理引擎根据患者个体病理/影像与国际医学指南生成，仅供就医沟通参考。</span>
            <span className="font-mono font-bold text-slate-400">ZHIAIWIKI-EVIDENCE-REPORT</span>
          </div>
        </div>

        {/* Export Choice Hub Card (自由选择：PDF打印 / 全篇报告长图 / 门诊问诊卡 - 独立于长图容器) */}
        {!isGenerating && reportMarkdown && (
          <div className="mt-6 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/50 rounded-3xl p-3.5 sm:p-6 md:p-7 border border-blue-200/80 shadow-sm print:hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-blue-100/80">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                    报告导出与随访归档中心
                  </h3>
                  <p className="text-xs text-slate-500">
                    支持 A4 标准打印归档与门诊 3 分钟就医问诊便签卡自由选择
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Option 1: PDF Export / Print */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-blue-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3.5 group">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span>导出 / 打印 PDF 完整解读</span>
                    </span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                      标准 A4
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    适合纸质病历归档、门诊提交主治医生审阅、长期家庭健康档案留存。
                  </p>
                </div>
                <button
                  onClick={handlePrint}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-bold text-xs border border-slate-200 hover:border-blue-200 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>导出 / 打印 PDF 文档</span>
                </button>
              </div>

              {/* Option 2: Pocket Consultation Card */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 hover:border-sky-300 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-3.5 group">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm font-bold text-slate-900 flex items-center gap-1.5">
                      <ClipboardList className="w-4 h-4 text-sky-600" />
                      <span>门诊就医问诊便签卡</span>
                    </span>
                    <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
                      轻量 2x PNG
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    专为门诊 3 分钟高效面诊设计，浓缩提炼向主治医生请教的核心疑问清单，手机查看清晰流畅。
                  </p>
                </div>
                <button
                  onClick={handleExportCardImage}
                  disabled={isExportingCard}
                  className="w-full py-2.5 px-3 rounded-xl btn-primary text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isExportingCard ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>正在生成便签卡...</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-3.5 h-3.5" />
                      <span>导出就医问诊便签卡</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>



      {/* Dedicated Consultation Pocket Card Container (Fixed 560px for Instant Pixel-Perfect 2x Export) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "560px",
          zIndex: -9999,
          opacity: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
        aria-hidden="true"
      >
        <div
          ref={consultationCardRef}
          className="w-[600px] bg-white text-slate-900 rounded-3xl p-6 border border-slate-200 relative overflow-hidden font-sans"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 relative z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 bg-white border border-slate-200">
                <img src={ONCOPATH_LOGO_DATA_URI} alt="知癌维基 Logo" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-xs font-black tracking-wider text-slate-900">知癌维基 ZhiaiWiki · {getCancerMeta(profile).name}循证知识平台</div>
                <div className="text-[10px] text-slate-500">门诊就医问诊便签卡 · 医患高效协同</div>
              </div>
            </div>
            <div className="text-right">
              <span suppressHydrationWarning className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {new Date().toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>

          {/* Patient Overview & Clinical Parameters */}
          {profile && (
            <div className="mb-4 bg-slate-50 rounded-2xl p-4 border border-slate-200 relative z-10 space-y-3">
              {/* Row 1: Age, Gender, Stage & Risk Badge */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">
                      {profile.age ? `${profile.age}岁 · ` : ''}{genderText}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-black font-mono">
                      {profile.tStage || (isBreast ? "T1c" : isCrc ? "T1" : "T1a")}{profile.nStage || "N0"}{profile.mStage || "M0"}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-blue-700">
                    {profile.currentStage === 'evaluation' || profile.currentStage === 'discovery' || profile.reportType === 'ct_imaging' || profile.reportType === 'ultrasound'
                      ? (isBreast
                          ? (profile.stage ? `c${profile.stage} 期乳腺病灶` : '早期乳腺肿物')
                          : isCrc
                            ? (profile.stage ? `c${profile.stage} 期结直肠病灶` : '早期结直肠肿物')
                            : (profile.stage ? `c${profile.stage} 期肺结节` : '早期肺结节'))
                      : (profile.stage ? `${profile.stage} 期${histologyText}` : `早期${histologyText}`)
                    }
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg font-extrabold text-[11px] border ${
                    isAllSafe 
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {riskLabel}
                  </span>
                </div>
              </div>

              {/* Row 2: Surgery Type */}
              <div className="flex items-center justify-between text-xs bg-white px-3 py-2 rounded-xl border border-slate-200">
                <span className="text-slate-500 text-[11px]">手术术式</span>
                <span className="font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200 text-[11px]">
                  {surgeryText}
                </span>
              </div>

              {/* Row 3: Tumor Size & Details */}
              <div className="bg-white p-2.5 rounded-xl border border-slate-200 text-xs flex items-center justify-between flex-wrap gap-2 text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  {isBreast ? (
                    <span>
                      <strong>病灶最大径</strong>: {tumorVal != null ? `${tumorVal} cm` : '待病理确诊'}
                      {(profile as any).breastLaterality && (
                        <span> · <strong>方位</strong>: {(profile as any).breastLaterality === 'left' ? '左乳' : (profile as any).breastLaterality === 'right' ? '右乳' : '双乳'}</span>
                      )}
                      {(profile as any).molecularSubtype && (
                        <span> · <strong>亚型</strong>: {(profile as any).molecularSubtype}</span>
                      )}
                    </span>
                  ) : isCrc ? (
                    <span>
                      <strong>病灶最大浸润径</strong>: {tumorVal != null ? `${tumorVal} cm` : '待病理确诊'}
                      {(profile as any).primaryLocation && (
                        <span> · <strong>部位</strong>: {(profile as any).primaryLocation === 'rectum' ? '直肠' : (profile as any).primaryLocation === 'right_colon' ? '右半结肠' : '左半结肠'}</span>
                      )}
                      {(profile as any).distanceFromAnalVerge != null && (
                        <span> · <strong>距肛缘</strong>: {(profile as any).distanceFromAnalVerge} cm</span>
                      )}
                    </span>
                  ) : (
                    isPureSolid ? (
                      <span><strong>病灶最大径</strong>: {tumorVal} cm · <strong>性质</strong>: 纯实性软组织病变</span>
                    ) : isPureGgo ? (
                      <span><strong>结节最大径</strong>: {tumorVal} cm · <strong>性质</strong>: 纯磨玻璃密度 (无实性)</span>
                    ) : (
                      <span><strong>结节总全径</strong>: {tumorVal} cm · <strong>CT 实性成分</strong>: {solidVal} cm</span>
                    )
                  )}
                </span>
                {!isBreast && !isCrc && (
                  <span className="px-2 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 font-mono font-bold text-[11px] shrink-0">
                    CTR: {calculatedCtr}
                  </span>
                )}
                {isCrc && (profile as any).distanceFromAnalVerge != null && (
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-bold text-[11px] shrink-0">
                    距肛: {(profile as any).distanceFromAnalVerge}cm
                  </span>
                )}
                {isBreast && (profile as any).biRads && (
                  <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 border border-pink-200 font-mono font-bold text-[11px] shrink-0">
                    BI-RADS: {(profile as any).biRads}类
                  </span>
                )}
              </div>

              {/* Row 4: Core Pathology Indicators Pills */}
              {isBreast ? (
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">切缘状态</span>
                    <span className={`font-bold ${!isMarginSafe ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {!isMarginSafe ? '阳性(残留)' : '阴性(R0)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">淋巴结分期</span>
                    <span className={`font-bold ${isN0Safe ? 'text-emerald-700' : 'text-rose-600'}`}>
                      {profile.nStage || 'N0'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">ER / PR</span>
                    <span className="font-bold text-slate-800">
                      {(profile as any).erStatus === 'positive' ? 'ER+' : (profile as any).erStatus === 'negative' ? 'ER-' : 'ER未查'} / {(profile as any).prStatus === 'positive' ? 'PR+' : (profile as any).prStatus === 'negative' ? 'PR-' : 'PR未查'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">HER2状态</span>
                    <span className="font-bold text-purple-700">
                      {(profile as any).her2StatusCategory === 'positive' ? '阳性(3+)' : (profile as any).her2StatusCategory === 'low' ? '低表达' : (profile as any).her2StatusCategory === 'zero' ? '0(阴性)' : (profile as any).her2Status || '未查'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">脉管瘤栓</span>
                    <span className={`font-bold ${!isLviSafe ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {!isLviSafe ? '阳性(高危)' : '阴性(-)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">Nottingham</span>
                    <span className={`font-bold ${(profile as any).nottinghamGrade === '3' ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {(profile as any).nottinghamGrade ? `G${(profile as any).nottinghamGrade}` : '未分级'}
                    </span>
                  </div>
                </div>
              ) : isCrc ? (
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">切缘 (CRM)</span>
                    <span className={`font-bold ${!isMarginSafe ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {!isMarginSafe ? '阳性' : '阴性(R0)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">淋巴结 / TD</span>
                    <span className={`font-bold ${isN0Safe ? 'text-emerald-700' : profile.nStage === 'N1c' ? 'text-amber-700' : 'text-rose-600'}`}>
                      {profile.nStage === 'N1c' ? 'N1c (TD+)' : (profile.nStage || 'N0')}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">MSI / MMR</span>
                    <span className="font-bold text-slate-800">
                      {(profile.cancerSpecificData as any)?.dmmrStatus === 'dMMR' || (profile.cancerSpecificData as any)?.msiStatus === 'MSI-H' ? 'dMMR' : 'pMMR'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">RAS基因</span>
                    <span className="font-bold text-purple-700">
                      {(profile.cancerSpecificData as any)?.krasMutation === 'wildtype' ? '野生型' : ((profile.cancerSpecificData as any)?.krasMutation || '待查')}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">脉管瘤栓</span>
                    <span className={`font-bold ${!isLviSafe ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {!isLviSafe ? '阳性(高危)' : '阴性(-)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">检出淋巴结</span>
                    <span className={`font-bold ${(profile.cancerSpecificData as any)?.lymphNodesExamined != null && (profile.cancerSpecificData as any)?.lymphNodesExamined >= 12 ? 'text-emerald-700' : 'text-amber-700'}`}>
                      {(profile.cancerSpecificData as any)?.lymphNodesExamined != null ? `${(profile.cancerSpecificData as any)?.lymphNodesExamined}枚` : '待查'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">切缘状态</span>
                    <span className={`font-bold ${!isMarginSafe ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {!isMarginSafe ? '阳性(残留)' : '阴性(R0)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">淋巴结分期</span>
                    <span className={`font-bold ${isN0Safe ? 'text-emerald-700' : profile.nStage === 'N1' ? 'text-amber-700' : 'text-rose-600'}`}>
                      {profile.nStage === 'N0' || !profile.nStage ? 'N0 (无)' : profile.nStage === 'N1' ? 'N1 (肺门)' : profile.nStage === 'N2a' ? 'N2a (单站)' : profile.nStage === 'N2b' ? 'N2b (多站)' : profile.nStage}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">胸膜侵犯</span>
                    <span className={`font-bold ${!isVpiSafe ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {!isVpiSafe ? 'PL1/2 (阳性)' : 'PL0 (阴性)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">气道播散</span>
                    <span className={`font-bold ${!isStasSafe ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {!isStasSafe ? '阳性(高危)' : '阴性(-)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">脉管瘤栓</span>
                    <span className={`font-bold ${!isLviSafe ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {!isLviSafe ? '阳性(高危)' : '阴性(-)'}
                    </span>
                  </div>
                  <div className="bg-white px-2 py-1.5 rounded-lg border border-slate-200 flex items-center justify-between">
                    <span className="text-slate-500 text-[10px]">病理分级</span>
                    <span className={`font-bold ${isGrade3 ? 'text-amber-700' : 'text-emerald-700'}`}>
                      {isGrade3 ? 'G3(低分化)' : profile.iaslcGrade === '1' || profile.grade === '1' ? 'G1(高分化)' : 'G2(中分化)'}
                    </span>
                  </div>
                </div>
              )}

              {/* Row 5: Ki-67 Strip if available */}
              {profile.ki67 != null && profile.ki67 !== "" && (
                <div className="bg-purple-50 px-2.5 py-1 rounded-lg border border-purple-200 flex items-center justify-between text-[11px]">
                  <span className="text-purple-800 text-[10px] flex items-center gap-1">
                    <Microscope className="w-3 h-3 text-purple-600 shrink-0" />
                    <span>Ki-67 细胞增殖指数</span>
                  </span>
                  <span className="font-bold text-purple-900">
                    {profile.ki67}%
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Section 3 Consultation Checklist Items */}
          <div className="space-y-2.5 mb-4 relative z-10">
            <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <ClipboardList className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>向主管医生门诊咨询清单 (建议按序请教)</span>
            </div>

            {checklistItems.map((item, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-3 border border-slate-200 space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-black text-[11px] flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-900 text-xs">
                    {item.title}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed pl-7 font-normal">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {/* Doctor's Notes Area for Clinical Consultations */}
          <div className="mb-4 p-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 text-xs relative z-10">
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 mb-1.5">
              <span className="flex items-center gap-1.5">
                <FileEdit className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>主管医生门诊面诊指导 / 笔录备忘（支持打印后现场手写）：</span>
              </span>
              <span className="font-normal text-[10px] text-slate-400">医师签名：__________ 日期：____/__/__</span>
            </div>
            <div className="h-8 border-b border-dashed border-slate-200" />
          </div>

          {/* Footer with zhiaiwiki.org brand and QR code */}
          <ExportBrandFooter variant="light" compact />
        </div>
      </div>

      {/* Image Export Preview Modal */}
      {exportedImageUrl && (
        <div 
          onClick={() => setExportedImageUrl(null)}
          className="fixed inset-0 z-[1000] bg-slate-950/80 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 md:p-6 animate-fade-in overflow-hidden sm:overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border-t sm:border border-slate-200 overflow-hidden text-slate-900 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-0"
          >
            {/* iOS HIG Sheet Grabber for Mobile */}
            <div className="sm:hidden pt-2.5 pb-1 flex justify-center shrink-0">
              <div className="sheet-grabber !my-0" />
            </div>

            {/* Modal Header */}
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold shrink-0">
                  <ClipboardList className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    专属门诊问诊便签卡（高清 2x Retina）
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    专为门诊 3 分钟向主治医生高效就诊沟通设计
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setExportedImageUrl(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors cursor-pointer shrink-0"
                aria-label="关闭窗口 (Esc)"
                title="关闭窗口 (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tip banner for mobile users */}
            <div className="bg-amber-50 px-4 py-2 border-b border-amber-200/60 text-xs text-amber-900 flex items-center gap-2 shrink-0">
              <Info className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="text-[11px] leading-tight">
                <strong>移动端提示</strong>：在手机端可<strong>【长按图片】</strong>保存至相册或直接发送给主管医生与家属。
              </span>
            </div>

            {/* Scrollable Image Preview Area */}
            <div className="flex-1 overflow-y-auto p-4 bg-slate-950 flex justify-center items-start min-h-[220px]">
              { }
              <img
                src={exportedImageUrl}
                alt="知癌维基 门诊就医问诊便签卡"
                className="w-full max-w-md rounded-2xl shadow-2xl border border-slate-800 object-contain"
              />
            </div>

            {/* Modal Footer Actions (Standardized 3A Medical Standard) */}
            <div className="px-4 sm:px-6 py-3.5 sm:py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setExportedImageUrl(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                关闭窗口
              </button>

              <button
                type="button"
                onClick={handleDownloadImage}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  cardDownloadSuccess
                    ? "bg-emerald-600 text-white shadow-emerald-500/20"
                    : "btn-primary text-white shadow-blue-500/20"
                }`}
              >
                {cardDownloadSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[2.5]" />
                    <span>已成功保存到本地</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>保存问诊便签卡 (PNG)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Re-snap to Bottom Button if user scrolled up during streaming */}
      {isGenerating && userScrolledUp && (
        <button
          type="button"
          onClick={() => {
            setUserScrolledUp(false);
            contentEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
          }}
          className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0.75rem))] right-4 md:bottom-6 md:right-6 z-40 bg-blue-600/95 hover:bg-blue-700 text-white px-4 py-2.5 rounded-full shadow-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md animate-bounce cursor-pointer print:hidden transition-all border border-white/20"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
          <span>正在生成中 · 点击回到底部 ↓</span>
        </button>
      )}

    </div>
  );
}

function MatrixBadge({ label, value, type }: { label: string; value: string; type: 'safe' | 'warning' | 'danger' | 'neutral' }) {
  const styles = {
    safe: 'bg-emerald-50/90 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50/90 text-amber-800 border-amber-200',
    danger: 'bg-rose-50/90 text-rose-800 border-rose-200',
    neutral: 'bg-slate-50/90 text-slate-600 border-slate-200'
  };

  return (
    <div className={`p-2.5 rounded-xl border ${styles[type]} flex flex-col justify-between transition-all shadow-xs`}>
      <span className="text-[11px] font-medium opacity-80 mb-1">
        <GlossaryTooltip term={label}>
          <span>{label}</span>
        </GlossaryTooltip>
      </span>
      <span className="text-xs font-bold font-mono tabular-nums flex items-center gap-1.5">
        {type === 'safe' && (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        )}
        {type === 'warning' && (
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
        )}
        {type === 'danger' && (
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        )}
        {type === 'neutral' && (
          <MinusCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        )}
        <span className="truncate">{value}</span>
      </span>
    </div>
  );
}
