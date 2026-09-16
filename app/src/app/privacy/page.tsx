"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  ChevronLeft, 
  Trash2, 
  EyeOff, 
  AlertCircle, 
  Mail, 
  CheckCircle2, 
  Copy, 
  Check 
} from "lucide-react";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
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
      <main className="flex-1 max-w-7xl mx-auto w-full space-y-8 pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-28 pb-12 sm:pb-16 px-3.5 sm:px-6 lg:px-8">
        
        {/* Navigation Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-slate-500" />
            <span>返回首页</span>
          </Link>
          <span className="text-xs text-slate-400 font-mono">生效日期：2026年9月 · 版本：2026-V2.0</span>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-sm border border-slate-200 space-y-10">
          
          {/* Header */}
          <div className="space-y-4 border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>数据安全与隐私保护 (PIPL / US HIPAA Safe Harbor) 体系</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              OncoPath 隐私政策与个人健康信息保护规则
            </h1>
            <p className="text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
              OncoPath（官方域名：<code>lung.dpdns.org</code>，以下简称“本平台”）深知个人健康医疗数据对您及家属的极端敏感性与重要性。本平台网络服务与算力节点<strong>物理部署于美利坚合众国（United States）</strong>。我们严格遵循<strong>《中华人民共和国个人信息保护法》(PIPL)</strong>、美国健康保险流通与责任法案去标识化标准（<strong>HIPAA Safe Harbor</strong>）以及国际公认的数据隐私规范，承诺为您的病理指标、影像参数及就诊记录构建<strong>金融级端侧去标识化、本地优先存储（Local-First）与零商业变现</strong>的严密隐私防线。
            </p>
          </div>

          {/* Core Sections (Unified Typography: text-sm sm:text-base leading-relaxed text-slate-700) */}
          <div className="space-y-8 text-sm sm:text-base leading-relaxed text-slate-700">
            
            {/* Section 1: Sensitive Personal Information Notice */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 flex items-center justify-center text-xs font-black shrink-0">1</span>
                <span>敏感个人健康信息处理的专门告知与知情同意</span>
              </h2>
              <p>
                根据《个人信息保护法》第二十八条规定，<strong>医疗健康信息属于“敏感个人信息”</strong>。一旦遭到泄露或非法使用，可能容易导致个人尊严受到侵害或人身、财产安全受到危害。
              </p>
              <div className="p-5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950 space-y-2 text-xs sm:text-sm">
                <div className="font-bold flex items-center gap-1.5 text-amber-900">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>处理敏感健康信息的必要性与保护承诺</span>
                </div>
                <p className="leading-relaxed">
                  本平台处理您的肺结节大小、TNM 分期、病理浸润指标（STAS/LVI/VPI）及基因突变结果，<strong>具有明确、充分的必要性——仅为了向您提供高精度的循证医学学术文献对照检索与就诊便签生成服务</strong>。本平台绝不会将此类信息用于任何商业画像、精准广告投放、信贷审核或向任何雇主/保险公司共享。
                </p>
              </div>
            </section>

            {/* Section 2: What Information We Collect */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">2</span>
                <span>我们收集与处理的信息范围（最小化原则）</span>
              </h2>
              <p>
                我们秉持《个人信息保护法》的<strong>最小必要原则（Minimization Principle）</strong>，绝不索取任何非必要的个人隐私。我们仅在您主动上传或表单录入时处理以下参数：
              </p>
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2.5 text-xs sm:text-sm text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>解剖病理参数</strong>：结节最大径 (cm)、实性成分直径 (cm)、CTR 浸润比、IASLC 9th 分期、切缘状态 (R0/R1) 及淋巴结转移站数；</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>微观组织浸润标志</strong>：气道播散 (STAS)、脉管瘤栓 (LVI)、胸膜侵犯 (VPI)、IASLC 分级 (G1/G2/G3) 及 Ki-67 增殖指数；</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>分子生物学特征</strong>：EGFR / ALK / ROS1 / KRAS 等基因突变检测状态与丰度、PD-L1 表达率（TPS/CPS）；</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>非直接身份关联统计信息</strong>：年龄段（如 55 岁）、生理性别、手术方式（肺叶/亚肺叶）。</span>
                </div>
              </div>
            </section>

            {/* Section 3: Extreme De-Identification (Core Security Lock) */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">3</span>
                <span>客户端瞬时不可逆“去标识化与脱敏”机制（核心安全锁）</span>
              </h2>
              <p>
                为彻底阻断身份信息泄露风险，本平台在代码架构上实现了<strong>客户端优先的自动脱敏过滤器</strong>：
              </p>
              <div className="bg-sky-50/70 p-4 sm:p-5 rounded-2xl border border-sky-200 text-sky-950 space-y-2 text-xs sm:text-sm">
                <div className="font-bold flex items-center gap-1.5 text-sky-900">
                  <EyeOff className="w-4 h-4 text-sky-700" />
                  <span>严格的数据掩码与过滤规则</span>
                </div>
                <ul className="space-y-1 text-sky-900/90 leading-relaxed">
                  <li>• <strong>身份证号</strong>：凡 18 位身份证号码，自动截断掩码为 <code>110101********1234</code>；</li>
                  <li>• <strong>手机号码</strong>：凡 11 位中国大陆手机号码，自动截断掩码为 <code>138****5678</code>；</li>
                  <li>• <strong>真实姓名</strong>：自动模糊化为单字姓氏 <code>张*峰</code> 或替换为通用匿名标识；</li>
                  <li>• <strong>住院号与病案号</strong>：自动清除条形码文字与流水序列号。</li>
                </ul>
                <p className="text-[11px] text-sky-800 pt-1 border-t border-sky-200">
                  注：经过客户端脱敏后，任何上传至检索流程的数据均为纯粹的脱敏临床参数，即使数据在网络传输中被截获，亦无法关联还原至您本人的真实身份。
                </p>
              </div>
            </section>

            {/* Section 4: Local-First Storage Architecture */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">4</span>
                <span>“端侧本地优先 (Local-First)”存储架构与无状态设计</span>
              </h2>
              <p>
                本平台最大化遵循<strong>无状态（Stateless）与本地优先（Local-First）</strong>工程哲学：
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <p>
                  • <strong>本地浏览器独享</strong>：您的病历画像与时间轴记录默认且仅保存于您个人设备的浏览器本地数据库（LocalStorage）中。关闭网页或清理浏览器后，数据完全由您本人掌管。
                </p>
                <p>
                  • <strong>海外节点无状态中继</strong>：服务器物理部署于美国，仅负责向客户端分发静态页面资源及处理无状态学术检索，不在服务器端持久化存储任何患者敏感健康档案。
                </p>
                <p>
                  • <strong>匿名访客免登模式</strong>：对于免注册体验的用户，系统仅分配一串无任何实名联系的伪随机字符（Guest ID），不与微信、手机号或任何第三方账号发生身份绑定。
                </p>
              </div>
            </section>

            {/* Section 5: Cookies and Local Storage Disclosure Table */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">5</span>
                <span>浏览器存储与 Cookie 使用明细清单（完全透明公开）</span>
              </h2>
              <p>
                为确保平台正常运行与语言偏好记忆，我们在您的终端设备上仅写入以下必要缓存：
              </p>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                      <th className="p-3 font-bold">键名 (Storage Key)</th>
                      <th className="p-3 font-bold">存储类型</th>
                      <th className="p-3 font-bold">用途说明</th>
                      <th className="p-3 font-bold">有效期 / 清除方式</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-600">
                    <tr>
                      <td className="p-3 font-mono text-blue-700 font-bold">onco_patient_profile</td>
                      <td className="p-3">LocalStorage</td>
                      <td className="p-3">缓存您录入的脱敏临床病理特征，用于页面刷新后恢复展示</td>
                      <td className="p-3">永久，或通过“清空档案”立即删除</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-blue-700 font-bold">onco_guest_id</td>
                      <td className="p-3">LocalStorage</td>
                      <td className="p-3">免登录访客的随机匿名设备标识符</td>
                      <td className="p-3">清除浏览器缓存时失效</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-blue-700 font-bold">onco_session</td>
                      <td className="p-3">HttpOnly Cookie</td>
                      <td className="p-3">加密的会话验证票据（采用 PBKDF2 与 HMAC 签名防伪）</td>
                      <td className="p-3">关闭会话或登出时失效</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-blue-700 font-bold">onco_lang</td>
                      <td className="p-3">LocalStorage</td>
                      <td className="p-3">用户语言偏好（简体中文 / 繁体中文）</td>
                      <td className="p-3">永久，可随时在导航栏切换</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 6: Third-Party APIs and Data Flow */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">6</span>
                <span>第三方接口调用与数据流转规则披露</span>
              </h2>
              <p>
                为了实现学术研究检索与语言转换，平台可能接入以下第三方技术接口：
              </p>
              <div className="bg-slate-50/90 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-2 text-xs sm:text-sm text-slate-700">
                <p>
                  • <strong>学术文献数据库 (Europe PMC / PubMed)</strong>：仅发送标准医学关键词（如 <code>&quot;EGFR L858R adjuvant osimertinib&quot;</code>），不传递任何用户个人属性；
                </p>
                <p>
                  • <strong>大语言模型解析接口 (LLM APIs)</strong>：若启用智能报告提取，上传的报告文本在客户端经过不可逆脱敏后，以纯医学语料形式经 TLS 1.3 传输至模型推理端。我们严格配置了<strong>“不用于模型二次训练（Zero Data Retention for Training）”</strong>的企业级防护策略；
                </p>
                <p>
                  • <strong>简繁转换引擎 (OpenCC)</strong>：完全在用户本地浏览器内存中即时执行，不发生任何外部网络传输。
                </p>
              </div>
            </section>

            {/* Section 7: Strict No-Sale Pledge */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">7</span>
                <span>严正承诺：绝不商业化变现或出售个人医疗健康数据</span>
              </h2>
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2 text-xs sm:text-sm">
                <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  <span>商业变现防火墙誓约</span>
                </div>
                <p className="leading-relaxed">
                  本平台做出终极法律承诺：<strong>绝不向任何跨国制药企业、国内药厂、医药销售代表、商业健康保险机构、广告营销商或大数据经纪中介出售、出租、共享或泄露您的任何就诊记录与病理参数</strong>。本平台的唯一合法用途是协助患者及其家属科学理解疾病、平等同等获取全球顶刊循证医学文献。
                </p>
              </div>
            </section>

            {/* Section 8: Rights of the Individual & Right to be Forgotten */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center text-xs font-black shrink-0">8</span>
                <span>您的个人信息权利：被遗忘权与一键销毁</span>
              </h2>
              <p>
                依据《个人信息保护法》第四章规定，您对自己的个人信息享有查阅、复制、更正、补充及<strong>删除权（被遗忘权）</strong>：
              </p>
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50/90 border border-slate-200 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>随时一键注销与彻底销毁档案</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  您可以随时前往【个人档案】页面，点击<strong>“清空档案 / 注销数据”</strong>按钮。该操作将在您的本地浏览器执行物理覆写清理，彻底销毁所有本地留存数据。
                </p>
              </div>
            </section>

            {/* Section 9: Minor Information Protection */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">9</span>
                <span>未成年人个人健康信息的特别保护规则</span>
              </h2>
              <p>
                本平台主要面向具有完全民事行为能力的成年患者及其法定照料者。<strong>若涉及不满 14 周岁未成年人的健康数据录入，必须由该未成年人的法定监护人亲自操作或在监护人的明示书面同意下进行</strong>。若我们发现未经监护人同意收集了未成年人的个人信息，我们将立即从存储介质中彻底清除相应数据。
              </p>
            </section>

            {/* Section 10: DPO Contact & Response SLA (Exact Match with About Page Copy Action) */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center text-xs font-black shrink-0">10</span>
                <span>数据安全官 (DPO)、行权联络与响应时限承诺</span>
              </h2>
              <p>
                本平台设立了专门的<strong>数据隐私与安全保护小组（Data Protection Officer, DPO）</strong>。若您对本隐私政策有任何疑问、投诉、建议，或希望正式行使您在法律项下的个人信息查阅/删除权利，欢迎随时通过专属渠道联系我们。
              </p>
              <div className="bg-gradient-to-r from-blue-50/70 to-teal-50/70 p-5 rounded-2xl border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-blue-900 flex items-center justify-center sm:justify-start gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-blue-700" />
                    <span>个人信息保护与数据安全官 (DPO) 通道</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    依据法规，我们将在完成身份核验后的 <strong>15 个工作日内</strong> 给予受理、核查并作出书面答复或执行完毕。
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 text-blue-700 text-xs font-bold border border-blue-200 shadow-2xs transition-all cursor-pointer flex items-center gap-1.5 active:scale-95"
                    title="点击一键复制隐私数据保护官邮箱"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700">邮箱已复制到剪贴板</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-blue-600" />
                        <span>复制个人信息保护邮箱</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </section>

          </div>

          {/* Quick Sub-Links */}
          <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <div>© 2026 OncoPath 隐私安全保护体系 · 官方网址：lung.dpdns.org</div>
            <div className="flex items-center gap-3">
              <Link href="/about" className="text-blue-600 hover:underline font-medium">关于系统初衷</Link>
              <span>·</span>
              <Link href="/terms" className="text-blue-600 hover:underline font-medium">查看《服务协议与免责声明》</Link>
            </div>
          </div>

        </div>

      </main>

      {/* Unified Global Footer */}
      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}
