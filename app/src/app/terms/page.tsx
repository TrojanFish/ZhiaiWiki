"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Scale, 
  ChevronLeft, 
  AlertTriangle, 
  Mail, 
  Copy, 
  Check 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function TermsPage() {
  const [copied, setCopied] = useState(false);
  const contactEmail = "2909138455@qq.com";

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
      <main className="flex-1 max-w-7xl mx-auto w-full space-y-5 sm:space-y-6 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-8 sm:pb-12 px-3.5 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>返回首页</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono truncate max-w-[180px] sm:max-w-none text-right">知癌维基 ZhiaiWiki · 免责声明</span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200 space-y-10">
          
          {/* Header */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white border border-sky-200 text-sky-700 text-[11px] sm:text-xs font-bold shadow-xs max-w-full">
              <Scale className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="truncate">服务协议 · 医疗学术免责声明 · 法律保护条款</span>
            </div>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              知癌维基 ZhiaiWiki 用户服务协议与全方位医疗免责声明
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              欢迎访问 <strong>知癌维基 ZhiaiWiki</strong>（官方域名：<code>zhiaiwiki.org</code>，以下简称“本平台”）。本平台涵盖<strong>肺癌、乳腺癌、结直肠癌、胃癌、肝癌、食管癌、甲状腺癌等多癌种</strong>的临床文献导航与循证知识图谱。在您使用本平台提供的任何学术检索、病理结构化梳理、分期推演或便签生成功能前，<strong>请务必审慎、完整地阅读并充分理解本协议的全部条款，尤其是其中限制、免除开发者责任的粗体及高亮条款</strong>。如您不同意本协议的任何内容，请立即停止访问并终止使用本平台。您的任何浏览、录入、查询或导出行为均视为对本协议全部条款的无条件知情与完全同意。
            </p>
          </div>

          {/* Core Sections (Unified Typography: text-sm sm:text-base leading-relaxed text-slate-700) */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
            
            {/* EMERGENCY ALERT SECTION - TOP PRIORITY */}
            <div className="p-5 sm:p-6 rounded-3xl bg-rose-50 border-2 border-rose-200 text-rose-950 space-y-3">
              <div className="flex items-center gap-2.5 text-rose-900 font-black text-base sm:text-lg">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 animate-pulse" />
                <span>【特别紧急医疗警告】突发急性危重状况请立即就医</span>
              </div>
              <p className="text-xs sm:text-sm text-rose-900/90 leading-relaxed font-semibold">
                <strong>本平台绝非急诊或急救医疗系统！</strong>若您或您身边的患者出现<strong>剧烈胸腹痛、突发大咯血/消化道大出血、极度呼吸困难、严重紫绀、持续高热不退、急性休克或意识障碍</strong>等急性危重征象，<strong>请立即拨打 120 急救电话或以最快速度前往正规综合医院急诊科进行现场救治</strong>。在任何急性危急情况下，严禁等待、依赖或使用本平台的信息作为应急处置参考！
              </p>
            </div>

            {/* Section 1: Non-Medical Software Definition */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">1</span>
                <span>平台非医疗器械与非诊疗属性的法律定性（严正声明）</span>
              </h2>
              <p>
                <strong>1.1 非医疗机构与非互联网诊疗</strong>：本平台是由技术研究团队依据公开发表的国际学术文献独立研发的<strong>多癌种医学文献检索辅助与知识图谱导航学术软件</strong>。本平台<strong>不属于医疗机构，未取得任何医疗机构执业许可，不提供任何形式的互联网诊疗、电子处方开具、远程医疗诊断或临床处置服务</strong>。
              </p>
              <p>
                <strong>1.2 非医疗器械软件 (Non-SaMD)</strong>：依据国家药品监督管理局《医疗器械监督管理条例》及国际 SaMD 相关监管规范，本平台<strong>未经任何国家或地区的医疗器械监管机构注册或备案，不作为医疗器械使用</strong>。平台所展示的多癌种分期推演（TNM / FIGO）、复发风险分层（如甲状腺癌 ATA 分层）、结节倍增时间（VDT）估算、药物相互作用（DDI）查询及生存统计图谱等，仅供用户作为了解医学文献研究成果的知识性参考，严禁作为临床决策的法定医学依据。
              </p>
            </section>

            {/* Section 2: Core Medical Disclaimer */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center text-xs font-black shrink-0">2</span>
                <span>线下执业医师绝对主导原则与免责红线（核心条款）</span>
              </h2>
              <div className="bg-amber-50/80 p-5 rounded-2xl border border-amber-200 space-y-3 text-xs sm:text-sm text-amber-950">
                <p>
                  <strong>2.1 临床决策唯一主体</strong>：任何具体的肿瘤外科手术切除术式（如肺段/肺叶切除、乳腺保乳/改良根治术、结直肠癌 TME/CME 全系膜切除、胃癌 D2 根治切除、肝脏部分切除、甲状腺腺叶切除等）、淋巴结清扫范围、术后新辅助/辅助靶向与免疫药物方案、放化疗介入时机、药物配伍相互作用（DDI）核验及随访复查间隔，<strong>必须且只能由线下合法医疗机构中具有执业资格的主治医师或多学科诊疗团队 (MDT)，在全面结合患者体征、既往病史、病理切片及原始 DICOM 影像后最终制定与执行</strong>。
                </p>
                <p>
                  <strong>2.2 绝对禁止私自调整医疗方案</strong>：患者及其家属<strong>绝对不可依据本平台的任何分析结论、文献引用或评分结果自行决定用药、停药、更改服药剂量或拒绝规范的医学检查</strong>。凡因擅自调整治疗方案而导致的病情恶化、延误诊疗或产生不良后果的，由行为人自行承担全部责任，开发者及平台运营方不承担任何连带责任。
                </p>
                <p>
                  <strong>2.3 便签卡使用边界</strong>：本平台生成的《门诊就医问诊便签卡》、《患者全景档案速览卡》等，其核心目的仅在于<strong>辅助患者整理自身就医疑问、促进与门诊主治医生的沟通效率</strong>，绝不构成医嘱或临床诊断书。
                </p>
              </div>
            </section>

            {/* Section 3: AI & Algorithm Limitations */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">3</span>
                <span>人工智能与算法识别局限性免责告知</span>
              </h2>
              <p>
                依据国家《生成式人工智能服务管理暂行办法》及相关算法合规要求，本平台向您明确告知以下技术边界：
              </p>
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                <p>
                  • <strong>OCR 与大模型理解偏差</strong>：平台采用的计算机视觉 OCR 引擎与语言模型在解析复杂纸质病理报告时，可能受到打印清晰度、排版折叠、医院缩写差异或专有词汇多义性的影响，<strong>可能出现识别遗漏、数值偏差或上下文误判（包括 AI 幻觉）</strong>。
                </p>
                <p>
                  • <strong>用户最终核验责任</strong>：用户在获取分析结果前，<strong>必须逐一核对界面回填的各项指标（包括各癌种的肿瘤全径、实性大小、TNM / FIGO 分期、清扫淋巴结阳性数、脉管侵犯 LVI / 神经侵犯 PNI、胸腹膜侵犯、切缘状态、错配修复 MMR/MSI、关键驱动基因突变与免疫组化 IHC 指标等）是否与医院官方出具的盖章纸质原件 100% 一致</strong>。因用户未核验错误参数而导致的任何误导，开发者不承担任何责任。
                </p>
              </div>
            </section>

            {/* Section 4: Statistical Data vs Individual Reality */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">4</span>
                <span>群体统计数据与个体真实预后的本质差异</span>
              </h2>
              <p>
                平台展示的“5年总生存率 (OS)”、“无复发生存率 (RFS/DFS)”及复发危险度分层，源自公开发表的多癌种顶刊前瞻性临床试验（如肺癌 ADAURA、JCOG0802、CALGB 140503；乳腺癌 TAILORx、monarchE、KEYNOTE-522；结直肠癌 IDEA 协作组、KEYNOTE-177；胃癌 ToGA、KEYNOTE-859；肝癌 IMbrave150 等）或多中心回顾性大样本统计。
              </p>
              <p className="font-semibold text-slate-900">
                医学统计学反映的是既往特定受试人群的群体概率，绝不能简单机械地等同于任何特定个体的生存期限或治愈保证。每位患者的实际预后受到个体免疫功能、基因分型、基础慢性病、手术根治质量、靶向/免疫药物耐受性及后续医学进步等多重复杂因素综合影响。
              </p>
            </section>

            {/* Section 5: Geographical & Regulatory Disparities */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">5</span>
                <span>跨国指南适用性与药物监管获批差异说明</span>
              </h2>
              <p>
                本平台整合了国际主流肿瘤与专科学会（CSCO、NCCN、ASCO、ESMO、IASLC、ATA、FIGO 等）的现行临床指南与同行评审文献。用户须充分理解：不同国家和地区的药品监管机构（如中国 NMPA、美国 FDA、欧洲 EMA）在抗癌药物获批适应症、用药剂量、适应人群及医保报销目录上存在政策差异。<strong>在中国境内接受治疗的患者，一切用药指导必须以中国国家药品监督管理局 (NMPA) 批准的最新药品说明书及线下主管医师处方为准</strong>。
              </p>
            </section>

            {/* Section 6: Proxy & Family Inquiries */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">6</span>
                <span>亲友代查、知情同意与监护授权</span>
              </h2>
              <p>
                若您作为家属或照料者为患者代为录入病历信息并生成报告，<strong>您承诺并保证已事先取得患者本人（或其法定监护人）的明确书面或口头知情同意与充分授权</strong>。因代查人未获授权擅自处理他人健康数据或因家庭沟通不畅导致的任何争议，由代查人自行全权承担一切法律纠纷。
              </p>
            </section>

            {/* Section 7: Complete Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center justify-center text-xs font-black shrink-0">7</span>
                <span>开发者免责、责任上限与赔偿豁免（最高防线）</span>
              </h2>
              <div className="bg-slate-50/90 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs sm:text-sm text-slate-800">
                <p>
                  <strong>7.1 全面免责范围</strong>：在相关法律允许的最大限度内，本平台开发者、维护者、学术顾问及运营关联主体，<strong>对于因访问、使用、依赖或无法使用本平台所引起的任何形式的直接损失、间接损失、附带损害、特殊惩罚性赔偿（包括但不限于病情延误、生命健康损害、医疗纠纷费用、精神损害抚慰金或预期收入减少）均不承担任何民事赔偿或法律责任</strong>。
                </p>
                <p>
                  <strong>7.2 责任上限（Cap of Liability）</strong>：本平台为非营利性医学学术与公益文献检索系统，不向普通用户收取诊断服务费用。在任何管辖法域下，因本平台服务引发的所有索赔，开发团队对任何用户的<strong>最高累计赔偿责任限额均严格限制为人民币 0 元（零元整）</strong>。
                </p>
                <p>
                  <strong>7.3 平台免责抗辩</strong>：由于互联网网络瘫痪、不可抗力、第三方云服务宕机、恶意网络黑客攻击或浏览器本地缓存损坏导致的数据丢失、报告生成中断或误差，平台不承担补偿或维修责任。
                </p>
              </div>
            </section>

            {/* Section 8: Server Location, Governing Law & Jurisdiction */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">8</span>
                <span>服务器部署地、管辖法律与争议解决</span>
              </h2>
              <p>
                <strong>8.1 服务器部署地与适用法律</strong>：本平台的网络服务器及数据算力节点<strong>物理部署于美利坚合众国（United States）</strong>。本协议的订立、执行、解释及争议解决均适用<strong>服务器托管所在法域法律及通用互联网法律规范</strong>；涉及中国境内用户个人信息保护等强制性法定权利的，遵循《中华人民共和国个人信息保护法》(PIPL) 相关强制性规定。
              </p>
              <p>
                <strong>8.2 友好协商与管辖法院</strong>：如因本协议或使用本平台产生任何争议，双方应秉持医学人道主义与理性互信原则先行友好协商；协商不成的，任何一方均应将争议提交服务器物理托管所在地有管辖权的法院通过诉讼方式裁决。
              </p>
              <p>
                <strong>8.3 条款可分割性</strong>：若本协议中的任何条款被任何有管辖权的法庭认定为无效、非法或不可执行，该条款的无效不影响本协议其他条款的法律效力，其余条款仍对双方具有完全约束力。
              </p>
            </section>

            {/* Section 9: Academic Correction & Contact Card (Exact Match with About Page) */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">9</span>
                <span>学术纠错、异议受理与法务联系通道</span>
              </h2>
              <p>
                本平台始终坚持严肃同行评审与数据循证标准。若临床医师、科研人员或患者在阅读过程中发现任何文献出处著录误差、分期折算歧义或最新指南更新线索，欢迎随时与我们取得联系。
              </p>
              <div className="bg-gradient-to-r from-blue-50/70 to-teal-50/70 p-5 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>法务合规与学术纠错联络通道</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    为保障通信安全与防范垃圾爬虫，平台支持一键安全复制联系邮箱。我们承诺在收到邮件后及时查阅并审慎评估。
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="点击一键复制法务与纠错邮箱"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">邮箱已复制到剪贴板</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>复制法务联系邮箱</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* Quick Sub-Links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© 2026 知癌维基 ZhiaiWiki · 免责声明</div>
            <div className="flex items-center gap-3">
              <Link href="/about" className="text-blue-600 hover:underline font-medium">关于我们</Link>
              <span>·</span>
              <Link href="/love-relay" className="text-teal-700 hover:underline font-medium">抗癌爱心接力</Link>
              <span>·</span>
              <Link href="/privacy" className="text-blue-600 hover:underline font-medium">隐私政策</Link>
            </div>
          </div>

        </div>

      </main>

      {/* Unified Global Footer */}
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}
