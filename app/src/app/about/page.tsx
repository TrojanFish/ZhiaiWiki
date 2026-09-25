"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartHandshake, 
  ChevronLeft,
  BookOpen, 
  Microscope, 
  ClipboardList, 
  AlertTriangle, 
  Coffee, 
  Mail, 
  Check, 
  Copy, 
  X, 
  ZoomIn,
  Server,
  Globe,
  Lock,
  Receipt,
  MessageSquareHeart,
  Heart,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  PenLine
} from "lucide-react";
import Footer from "@/components/Footer";
import { OPERATING_COST_LEDGER, LOVE_RELAY_ITEMS, DONATION_TIERS, type LoveRelayItem } from "@/lib/loveRelayData";
import LoveRelaySubmitModal from "@/components/about/LoveRelaySubmitModal";

export default function AboutPage() {
  const [copied, setCopied] = useState(false);
  const [previewImage, setPreviewImage] = useState<{ src: string; title: string } | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [relayItems, setRelayItems] = useState<LoveRelayItem[]>(LOVE_RELAY_ITEMS);
  const contactEmail = "2909138455@qq.com";

  // Fetch live love relay items from server
  useEffect(() => {
    fetch("/api/love-relay")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.items) && data.items.length > 0) {
          setRelayItems(data.items);
        }
      })
      .catch((err) => {
        console.warn("Notice: Fallback to static love relay items:", err);
      });
  }, []);

  // Support Esc key to dismiss QR modal
  useEffect(() => {
    if (!previewImage) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPreviewImage(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [previewImage]);

  const handleCopyEmail = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(contactEmail)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        })
        .catch(() => fallbackCopy(contactEmail));
    } else {
      fallbackCopy(contactEmail);
    }
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement("textarea");
      textArea.value = text;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error("Fallback copy failed", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <main className="flex-1 max-w-7xl mx-auto w-full space-y-4 sm:space-y-5 md:space-y-6 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8">
        
        {/* Top Navigation */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>返回首页</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono truncate max-w-[180px] sm:max-w-none text-right">知癌维基 ZhiaiWiki · 关于我们</span>
        </div>

        {/* Main Article Card */}
        <div className="bg-white rounded-3xl p-5 sm:p-8 md:p-10 shadow-sm border border-slate-200 space-y-8">
          
          {/* Header Banner */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-[11px] sm:text-xs font-bold shadow-xs max-w-full">
              <HeartHandshake className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>创作者自白 · 致同行者</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              因为淋过雨，<br className="sm:hidden" />
              所以想为同样迷茫的你撑一把伞
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              —— 一个癌症亲历者的心路历程与 知癌维基 (ZhiaiWiki) 平台的诞生始末
            </p>
            <div className="pt-2 text-xs font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 border-t border-slate-100/80">
              <span className="text-blue-700">“知癌，方能治癌；每一次循证，皆因至爱。”</span>
            </div>
          </div>

          {/* Narrative Content (Unified Harmonious 3-Act Structure) */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
            
            {/* Act 1 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">1</span>
                <span>那张冰冷的病理报告，与漫长的黑夜</span>
              </h2>
              <p>
                几个月前，当我自己拿到那份印着<strong>“浸润性肺腺癌”、“实性成分”、“气道播散 (STAS)”、“脏层胸膜侵犯 (VPI)”</strong>等专业字眼的病理组织学诊断书时，内心同样被巨大的未知、恐慌与手足无措所吞没。
              </p>
              <p>
                在术后漫长的康复与求医历程中，我日夜穿梭在各大医学论坛、患者交流群和文献数据库里。我看到了太多病友和家属在深夜的帖子里辗转难眠：
              </p>
              <div className="bg-slate-50/80 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-2">
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>有人因为搜索到网络碎片化言论，误将极早期的原位/微浸润当成绝症，整日惶惶不可终日；</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>有人拿着复杂的病理指标，不知道该不该做基因检测、要不要做辅助化疗；</span>
                </div>
                <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>有人面对大医院专家短短几分钟的面诊时间，因为紧张而手足无措，走出诊室才发现最关键的问题一个都没来得及问。</span>
                </div>
              </div>
            </section>

            {/* Act 2 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">2</span>
                <span>为什么做知癌维基 (ZhiaiWiki) —— 用理性的证据，消解不必要的恐惧</span>
              </h2>
              <p>
                恐慌往往来源于对未知的想象。随着我深入研读了数百篇国际同行评审的前瞻性临床队列研究（如日本 JCOG0804/JCOG0802 系列研究、ADAURA 第三代靶向研究、IASLC / AJCC 第 9 版 TNM 分期指南），我发现：<strong>现代胸部肿瘤医学对早期肺癌的根治率、高危病理特征以及规范随访路径，已经有了极为清晰、严谨的统计学定论。</strong>
              </p>
              <p>
                作为一名技术开发者，我决定搭建 <strong>知癌维基 (ZhiaiWiki)</strong> 这个纯粹的公益工具：
              </p>
              <div className="grid sm:grid-cols-3 gap-3 pt-1">
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-blue-800 flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span>医学信息平权</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">把晦涩的顶刊论文翻译成患者和家属能轻松看懂的白话解读。</div>
                </div>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-teal-800 flex items-center gap-1.5">
                    <Microscope className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                    <span>杜绝算命式推测</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">每一个风险指标均可追溯至公开的 PubMed 顶刊文献，拒绝主观臆断。</div>
                </div>
                <div className="bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 space-y-1">
                  <div className="text-xs font-bold text-sky-800 flex items-center gap-1.5">
                    <ClipboardList className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span>赋能门诊高效沟通</span>
                  </div>
                  <div className="text-xs text-slate-600 leading-relaxed">生成一目了然的便签卡与问诊清单，让患者在面诊时不漏掉任何关键决策点。</div>
                </div>
              </div>
            </section>

            {/* Act 3 */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">3</span>
                <span>谦逊求教与专业共建声明</span>
              </h2>
              <p>
                我必须坦诚地向大家说明：<strong>我并非专业的执业临床医师，而是一名与你们走在同一条康复道路上的技术病友。</strong>
              </p>
              <p>
                尽管平台内的所有病理分期逻辑、影像 CTR 计算模型与文献均经过权威指南的严格校验，但医学领域浩瀚深邃，个体病情千差万别，平台内容难免存在理解局限或需要改进之处。
              </p>
              <div className="bg-amber-50/80 p-4 sm:p-5 rounded-2xl border border-amber-200/80 text-xs sm:text-sm text-amber-900 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong>重要声明</strong>：本平台提供的所有数据与建议<strong>仅供患者知情参考与就医辅助，绝不构成任何个性化临床诊断结论或处方指令</strong>。具体的治疗方案与随访检查，请务必以线下正规三甲医院主治医生的综合研判为准。
                </div>
              </div>
            </section>

          </div>

          {/* Connect & Sponsorship Cards Section */}
          <div className="pt-6 border-t border-slate-100 space-y-10">
            <div className="text-center max-w-xl mx-auto space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
                <Heart className="w-3.5 h-3.5 text-teal-600" />
                <span>非营利开源 · 阳光透明同行</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900">同路相伴 · 爱心接力与支持</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                本平台承诺所有核心功能对病友<strong>永久免费且无任何商业广告</strong>。每一份自愿赞助都用于分担刚性硬件与科研算力成本。
              </p>
            </div>

            {/* 1. Transparent Operational Ledger */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                  <Receipt className="w-4 h-4 text-teal-600" />
                  <span>平台刚性技术运维开支公开账单</span>
                </h4>
                <span className="text-[11px] text-slate-400 font-mono">100% 用于开源算力</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {OPERATING_COST_LEDGER.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5 hover:border-teal-300 transition-colors">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                        {idx === 0 ? <Server className="w-3.5 h-3.5 text-teal-600 shrink-0" /> : idx === 1 ? <Globe className="w-3.5 h-3.5 text-sky-600 shrink-0" /> : idx === 2 ? <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> : <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />}
                        <span>{item.name}</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200/60 shrink-0">
                        {item.monthlyCost}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Love-Relay Wall (Featured Showcase) */}
            <div className="space-y-3.5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/80 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-teal-600" />
                    <span>抗癌爱心接力</span>
                    <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                      已累计 {relayItems.length} 位温暖同行者
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1">
                    生命相托 · 温暖回响 · 欢迎在此留下您的康复大复查好消息与同路人祈福寄语
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSubmitModalOpen(true)}
                    className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 shrink-0"
                  >
                    <PenLine className="w-3.5 h-3.5" />
                    <span>留下抗癌寄语</span>
                  </button>

                  <Link
                    href="/love-relay"
                    className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-teal-800 text-xs font-semibold border border-slate-200/80 shadow-3xs transition-all flex items-center gap-1 shrink-0"
                  >
                    <span>抗癌爱心接力</span>
                    <ArrowRight className="w-3 h-3 text-teal-600" />
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {relayItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-3xs space-y-2 hover:border-slate-300 transition-colors flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-xs font-bold text-slate-900 truncate">{item.donorName}</span>
                          {item.isTest && (
                            <span className="text-[9px] font-medium text-slate-500 bg-slate-100 px-1 py-0.2 rounded border border-slate-200 shrink-0">
                              示范数据
                            </span>
                          )}
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded border shrink-0 ${item.cancerColor}`}>
                            {item.cancerTag}
                          </span>
                        </div>
                        <span className="text-xs font-black text-teal-700 font-mono shrink-0">
                          {item.amount?.includes("支持") || item.amount?.includes("祈福") ? item.amount : `支持 ${item.amount}`}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        “{item.message}”
                      </p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100 mt-1">
                      <span>{item.city ? `${item.city} · ` : ""}{item.date}</span>
                      {item.verified ? (
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>已验证爱心支持</span>
                        </span>
                      ) : (
                        <span className="text-slate-400 font-medium flex items-center gap-1">
                          <span>待站长微信账单核验</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom Jump Card to Dedicated Subpage */}
              <div className="pt-1">
                <Link
                  href="/love-relay"
                  className="w-full py-3 px-4 rounded-2xl bg-teal-50/70 hover:bg-teal-100/70 text-teal-900 border border-teal-200/80 text-xs font-bold flex items-center justify-between transition-all group shadow-3xs"
                >
                  <div className="flex items-center gap-2">
                    <HeartHandshake className="w-4 h-4 text-teal-700" />
                    <span>查看全部 {relayItems.length} 位病友的抗癌接力（支持 11 大实体瘤专区筛选）</span>
                  </div>
                  <div className="flex items-center gap-1 text-teal-700 font-semibold group-hover:translate-x-0.5 transition-transform text-xs">
                    <span>进入抗癌爱心接力专区</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              </div>
            </div>

            {/* 3. Upgraded QR & Tiers Sponsorship Card */}
            <div className="max-w-xl mx-auto w-full">
              <div className="bg-gradient-to-br from-slate-50 via-teal-50/20 to-white rounded-3xl p-6 sm:p-8 border border-slate-200 text-center flex flex-col items-center justify-between space-y-5 hover:border-teal-300 transition-colors shadow-2xs">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[11px] font-bold">
                    <Coffee className="w-3.5 h-3.5 text-teal-700" />
                    <span>自愿赞赏 · 请喝咖啡</span>
                  </div>
                  <h4 className="text-base sm:text-lg font-black text-slate-900">请喝咖啡 · 资助服务器与科研算力</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                    所有赞助将 100% 用于分担云服务器 VPS、全球文献检索 API 及 AI 安全质控 Token 成本
                  </p>
                </div>

                {/* Preset Tier Pills */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-md text-left">
                  {DONATION_TIERS.map((tier) => (
                    <div key={tier.id} className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-3xs">
                      <div className="text-[11px] font-bold text-slate-800 truncate">{tier.title}</div>
                      <div className="text-xs font-black text-teal-700 font-mono mt-0.5">
                        {tier.amount === "custom" ? "随心" : `¥${tier.amount}`}
                      </div>
                    </div>
                  ))}
                </div>

                {/* QR Slot */}
                <div 
                  onClick={() => setPreviewImage({ src: "/sponsor_qr.png?v=2026", title: "请喝咖啡 · 赞赏支持码" })}
                  className="w-48 h-48 sm:w-52 sm:h-52 rounded-2xl bg-white p-3 border border-slate-200 shadow-xs flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-teal-500 hover:shadow-md transition-all"
                  title="点击放大查看 / 微信扫码"
                >
                  <img 
                    src="/sponsor_qr.png?v=2026" 
                    alt="给 Keiyee 赞赏" 
                    className="w-full h-full object-contain rounded-xl group-hover:scale-105 transition-transform"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                      const fallback = document.getElementById('sponsor-qr-placeholder');
                      if (fallback) fallback.style.display = 'flex';
                    }}
                  />
                  <div id="sponsor-qr-placeholder" className="hidden flex-col items-center justify-center text-slate-400 text-center p-2">
                    <Coffee className="w-10 h-10 text-slate-400 mb-1.5" />
                    <span className="text-xs font-bold text-slate-600">自愿赞赏支持码</span>
                  </div>
                  <div className="absolute inset-0 bg-teal-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                    <span className="bg-white/90 text-teal-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-xs backdrop-blur-xs flex items-center gap-1">
                      <ZoomIn className="w-3 h-3" />
                      <span>点击放大</span>
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 max-w-sm leading-relaxed">
                  金额随心 · 感谢每一份让公益平台长久活下去的温暖鼓励。<br />
                  若正面临治疗支出压力，请千万不要打赏，多给自己补充营养！
                </div>

                {/* Direct Blessing Submission CTA */}
                <button
                  type="button"
                  onClick={() => setSubmitModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs hover:shadow-sm transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                >
                  <HeartHandshake className="w-4 h-4 text-teal-100" />
                  <span>已微信赞赏？点此留下抗癌寄语上墙</span>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-200" />
                </button>
              </div>
            </div>

            {/* Email Contact & Bug Report */}
            <div className="bg-gradient-to-r from-blue-50/70 to-teal-50/70 p-5 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div className="space-y-1">
                <div className="text-xs font-bold text-blue-900 flex items-center justify-center sm:justify-start gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-blue-700" />
                  <span>专业建议与纠错反馈</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  欢迎胸外科、病理科、肿瘤内科医师及病友提出宝贵指正。如有学术探讨、词条勘误或技术交流，欢迎随时联系作者。
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                  title="点击一键复制作者联系邮箱"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">邮箱已复制到剪贴板</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-blue-600" />
                      <span>复制联系邮箱</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Bottom Sign-off */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div className="italic text-slate-600">
              “愿每一个认真了解疾病的灵魂，都能在理性和科学的光芒中重获笃定与安宁。”
            </div>
            <div className="font-bold text-slate-700">
              —— 知癌维基 ZhiaiWiki 创作者 · 与您并肩同行
            </div>
          </div>

          {/* Quick Sub-Links */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© 2026 知癌维基 ZhiaiWiki · 关于我们</div>
            <div className="flex items-center gap-3">
              <Link href="/love-relay" className="text-teal-700 hover:underline font-medium">抗癌爱心接力</Link>
              <span>·</span>
              <Link href="/terms" className="text-blue-600 hover:underline font-medium">免责声明</Link>
              <span>·</span>
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium">隐私政策</Link>
            </div>
          </div>

        </div>

      {/* Full-Screen QR Preview Modal */}
      {previewImage && (

        <div 
          onClick={() => setPreviewImage(null)}
          className="fixed inset-0 z-[9999] bg-slate-950/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 cursor-pointer animate-fade-in overflow-hidden sm:overflow-y-auto"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-sm w-full border-t sm:border border-slate-200 shadow-2xl flex flex-col items-center text-center space-y-4 animate-slide-up-drawer sm:animate-fade-in-up pb-safe sm:pb-8"
          >
            {/* iOS HIG Sheet Grabber for Mobile */}
            <div className="sm:hidden -mt-3 pb-1 flex justify-center shrink-0 w-full">
              <div className="sheet-grabber !my-0" />
            </div>

            <div className="flex items-center justify-between w-full border-b border-slate-100 pb-3">
              <span className="text-sm font-bold text-slate-900">{previewImage.title}</span>
              <button 
                onClick={() => setPreviewImage(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
                aria-label="关闭预览"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-64 h-64 p-2 bg-white rounded-2xl border border-slate-200 shadow-inner flex items-center justify-center">
              <img 
                src={previewImage.src} 
                alt={previewImage.title} 
                className="w-full h-full object-contain rounded-xl" 
              />
            </div>
            
            <p className="text-xs text-slate-500">
              在手机上可<strong>长按图片</strong>识别二维码或保存到相册
            </p>
          </div>
        </div>
      )}

      {/* Love-Relay Blessing Submission Modal */}
      <LoveRelaySubmitModal
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        onSuccess={(newItem) => {
          setRelayItems((prev) => [newItem, ...prev]);
        }}
      />
      </main>

      {/* Unified Global Footer */}
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}




