"use client";

import React, { useState } from "react";
import { Dna, Target, Zap } from "lucide-react";

type SubtypeId = "luminalA" | "luminalB" | "her2" | "tnbc";

interface SubtypeConfig {
  id: SubtypeId;
  name: string;
  badge: string;
  badgeBg: string;
  textColor: string;
  er: string;
  pr: string;
  her2: string;
  ki67: string;
  description: string;
  therapy: string[];
  osRate: string;
  mechanismTitle: string;
  mechanismDetail: string;
}

export function ReceptorSubtypeVisual() {
  const [activeSubtype, setActiveSubtype] = useState<SubtypeId>("luminalA");

  const data: Record<SubtypeId, SubtypeConfig> = {
    luminalA: {
      id: "luminalA",
      name: "Luminal A 型 (管腔 A 型)",
      badge: "最温和 · 预后最佳",
      badgeBg: "bg-emerald-500 text-slate-950",
      textColor: "text-emerald-400",
      er: "强阳性 (通常 >50%~90%)",
      pr: "强阳性 (≥20%)",
      her2: "阴性 (-)",
      ki67: "低 (<14%)",
      description: "肿瘤细胞生长极慢，完全依赖雌激素喂养。如同「温和良民」，只需长程掐断雌激素粮草（内分泌治疗）即可牢牢控制，绝大多数患者免除辅助化疗。",
      therapy: [
        "内分泌治疗 5~10 年 (绝经前: 他莫昔芬 / 绝经后: 来曲唑/阿那曲唑)",
        "TAILORx 权威顶刊证实：绝大多数无需做化疗",
        "可结合 21 基因检测确认免化疗安全性"
      ],
      osRate: "5年总生存率 > 96%",
      mechanismTitle: "抗癌机理：饿死肿瘤 (内分泌断粮)",
      mechanismDetail: "内分泌药物如同精密药锁，封锁雌激素受体 (ER/PR)，使癌细胞失去养分供应自然萎缩凋亡。"
    },
    luminalB: {
      id: "luminalB",
      name: "Luminal B 型 (管腔 B 型)",
      badge: "次常见 · 需内分泌强化",
      badgeBg: "bg-sky-500 text-slate-950",
      textColor: "text-sky-400",
      er: "阳性 (+)",
      pr: "阴性或低表达 (<20%)",
      her2: "阴性 或 阳性 (+)",
      ki67: "高增殖 (≥20% 或灰区 14~20%)",
      description: "受体虽然也是阳性，但细胞增殖速度比 A 型快。需要更加积极的综合围剿策略，通常需要内分泌联合化疗或 CDK4/6 靶向抑制剂（阿贝西利）强化。",
      therapy: [
        "内分泌治疗 5~10 年 + 卵巢功能抑制 (OFS，绝经前打停经针)",
        "CDK4/6 抑制剂强化 (阿贝西利/瑞波西利) 满 2 年",
        "若 HER2 阳性需同步加用抗 HER2 靶向药物"
      ],
      osRate: "5年总生存率 88% ~ 92%",
      mechanismTitle: "抗癌机理：双靶向断粮 + 阻断细胞分裂周期",
      mechanismDetail: "CDK4/6 抑制剂阻断肿瘤细胞从 G1 期向 S 期分裂复制，与内分泌治疗形成 1+1>2 协同包围。"
    },
    her2: {
      id: "her2",
      name: "HER2 过表达型",
      badge: "抗 HER2 靶向获益人群",
      badgeBg: "bg-purple-500 text-white",
      textColor: "text-purple-400",
      er: "阴性 (-)",
      pr: "阴性 (-)",
      her2: "阳性 (IHC 3+ 或 FISH 扩增)",
      ki67: "高增殖 (常 >30%~50%)",
      description: "癌细胞表面密密麻麻布满了 HER2 酪氨酸激酶天线。过去因恶性度高让人闻之色变，如今随着曲妥珠单抗、帕妥珠单抗与 ADC 药物问世，已成为武器最丰富的亚型！",
      therapy: [
        "曲妥珠单抗 + 帕妥珠单抗 (HP 双靶向治疗满 1 年)",
        "术前新辅助化疗 + 双靶向，力争病理完全缓解 (pCR)",
        "二线 / 术后残存病灶：新一代 ADC 药物 (T-DXd 德曲妥珠单抗)"
      ],
      osRate: "5年总生存率 90% ~ 94%",
      mechanismTitle: "抗癌机理：生物制导导弹精准定点清除",
      mechanismDetail: "单抗像精准导弹识别 HER2 靶标，阻断增殖信号传导；ADC 药物更是将高毒素化疗分子精准空投进入癌细胞内部炸毁。"
    },
    tnbc: {
      id: "tnbc",
      name: "三阴性乳腺癌 (TNBC)",
      badge: "化疗敏感 · 免疫破局",
      badgeBg: "bg-rose-500 text-white",
      textColor: "text-rose-400",
      er: "阴性 (0%)",
      pr: "阴性 (0%)",
      her2: "阴性 (IHC 0 或 1+ 且 FISH-)",
      ki67: "极高活跃度 (常 >50%~80%)",
      description: "三个受体均为阴性，约占全乳腺癌 15%。虽然没有激素和 HER2 靶点，但对化疗药物极其敏感脆弱！近年来 PD-1 免疫治疗新突破已彻底重写其治愈曲线。",
      therapy: [
        "KEYNOTE-522 方案：新辅助化疗 + 帕博利珠单抗 (K药) 免疫治疗",
        "术后病理完全缓解率 (pCR) 高达 64.8%，度过 5 年基本宣告根治",
        "若伴有 BRCA 基因突变，可使用 PARP 抑制剂 (奥拉帕利)"
      ],
      osRate: "达 pCR 者 5年生存率 > 92%",
      mechanismTitle: "抗癌机理：免疫激活 + DNA 损伤双重合围",
      mechanismDetail: "PD-1 抑制剂摘除癌细胞的免疫逃逸面具，激活体内杀伤性 CD8+ T 细胞全盘消灭散在微转移灶。"
    }
  };

  const current = data[activeSubtype];

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-purple-400 flex items-center gap-1.5">
          <Dna className="w-4 h-4 text-purple-400" />
          <span>乳腺癌 4 大分子分型受体定位与现代精准打击靶向图谱</span>
        </span>
        <span className="text-[10px] text-slate-400">St. Gallen 国际共识</span>
      </div>

      {/* 4 Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 mb-3">
        {(["luminalA", "luminalB", "her2", "tnbc"] as SubtypeId[]).map((st) => {
          const item = data[st];
          const isSelected = activeSubtype === st;
          return (
            <button
              key={st}
              onClick={() => setActiveSubtype(st)}
              className={`p-2 rounded-xl text-left transition-all cursor-pointer border ${
                isSelected
                  ? `${item.badgeBg} border-white/30 shadow-lg scale-[1.02]`
                  : "bg-slate-800/80 border-slate-700/60 text-slate-300 hover:bg-slate-700 hover:border-slate-600"
              }`}
            >
              <div className={`text-xs font-bold ${isSelected ? "text-white font-extrabold" : "text-slate-200"}`}>
                {item.name.split(" (")[0]}
              </div>
              <div className={`text-[9px] mt-0.5 ${isSelected ? "text-white/90" : "text-slate-400"}`}>
                {item.badge}
              </div>
            </button>
          );
        })}
      </div>

      {/* Interactive SVG Cell Simulation */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 320 125" className="w-full h-auto">
          <rect width="320" height="125" fill="#0b1120" rx="8" />

          {/* Cancer Cell Body */}
          <ellipse cx="110" cy="62" rx="75" ry="50" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Cell Nucleus */}
          <ellipse cx="100" cy="62" rx="35" ry="24" fill="#0f172a" stroke="#475569" strokeWidth="1.5" strokeDasharray="3,2" />
          <text x="100" y="65" textAnchor="middle" fill="#64748b" fontSize="7" fontWeight="bold">细胞核 (DNA)</text>

          {/* ER / PR Nuclear Receptors */}
          {activeSubtype === "luminalA" || activeSubtype === "luminalB" ? (
            <g>
              <circle cx="85" cy="55" r="4" fill="#10b981" />
              <text x="85" y="58" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">ER</text>
              <circle cx="115" cy="55" r="4" fill="#10b981" />
              <text x="115" y="58" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">PR</text>
              <circle cx="100" cy="74" r="4" fill="#10b981" />
              <text x="100" y="77" textAnchor="middle" fill="#ffffff" fontSize="4.5" fontWeight="bold">ER</text>
              {/* Blocking drug (Tamoxifen) */}
              <rect x="70" y="48" width="6" height="6" fill="#38bdf8" rx="1" />
              <text x="73" y="60" textAnchor="middle" fill="#38bdf8" fontSize="4">内分泌药锁</text>
            </g>
          ) : (
            <g>
              <text x="100" y="74" textAnchor="middle" fill="#475569" fontSize="5.5">ER/PR 受体缺失 (-)</text>
            </g>
          )}

          {/* HER2 Receptors on Cell Membrane */}
          {activeSubtype === "her2" ? (
            <g>
              {/* Multiple protruding HER2 antennas */}
              <line x1="170" y1="45" x2="190" y2="40" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="192" cy="39" r="3.5" fill="#c084fc" />
              
              <line x1="180" y1="62" x2="202" y2="62" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="204" cy="62" r="3.5" fill="#c084fc" />

              <line x1="170" y1="80" x2="190" y2="85" stroke="#c084fc" strokeWidth="2.5" />
              <circle cx="192" cy="86" r="3.5" fill="#c084fc" />

              {/* Monoclonal Antibody (Trastuzumab Y shape) locking on */}
              <path d="M 218 57 L 208 62 L 218 67 M 218 62 L 228 62" fill="none" stroke="#f43f5e" strokeWidth="2" />
              <text x="235" y="64" fill="#fb7185" fontSize="5.5" fontWeight="bold">曲妥珠单抗 (靶向抗体)</text>

              {/* ADC missile */}
              <circle cx="210" cy="35" r="4" fill="#e11d48" />
              <circle cx="214" cy="31" r="1.5" fill="#facc15" />
              <circle cx="206" cy="31" r="1.5" fill="#facc15" />
              <text x="235" y="38" fill="#f43f5e" fontSize="5.5" fontWeight="bold">ADC 弹头 (T-DXd)</text>
            </g>
          ) : (
            <text x="180" y="65" fill="#475569" fontSize="6">HER2 受体阴性</text>
          )}

          {/* TNBC Immune Attack View */}
          {activeSubtype === "tnbc" && (
            <g>
              {/* CD8+ Killer T cell approaching */}
              <circle cx="215" cy="62" r="18" fill="#e11d48" opacity="0.85" />
              <text x="215" y="61" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">CD8+ T细胞</text>
              <text x="215" y="69" textAnchor="middle" fill="#fecdd3" fontSize="4.5">免疫杀伤部队</text>

              {/* PD-1 / PD-L1 blockade icon */}
              <line x1="185" y1="62" x2="197" y2="62" stroke="#38bdf8" strokeWidth="2" strokeDasharray="2,2" />
              <circle cx="191" cy="62" r="3" fill="#38bdf8" />
              <text x="191" y="52" textAnchor="middle" fill="#38bdf8" fontSize="5">PD-1 免疫抑制剂</text>
            </g>
          )}

          {/* Right Side Status Panel */}
          <rect x="250" y="10" width="62" height="105" fill="#111827" rx="5" stroke="#1f2937" />
          <text x="281" y="24" textAnchor="middle" fill="#94a3b8" fontSize="6.5" fontWeight="bold">IHC 指标参数</text>
          
          <text x="256" y="40" fill="#9ca3af" fontSize="5.5">ER 状态:</text>
          <text x="256" y="49" fill="#e2e8f0" fontSize="6" fontWeight="bold">
            {activeSubtype === "luminalA" || activeSubtype === "luminalB" ? "阳性 (+)" : "阴性 (-)"}
          </text>

          <text x="256" y="63" fill="#9ca3af" fontSize="5.5">PR 状态:</text>
          <text x="256" y="72" fill="#e2e8f0" fontSize="6" fontWeight="bold">
            {activeSubtype === "luminalA" ? "≥20% (+)" : activeSubtype === "luminalB" ? "低或阴性" : "阴性 (-)"}
          </text>

          <text x="256" y="86" fill="#9ca3af" fontSize="5.5">HER2 状态:</text>
          <text x="256" y="95" fill={activeSubtype === "her2" ? "#c084fc" : "#e2e8f0"} fontSize="6" fontWeight="bold">
            {activeSubtype === "her2" ? "阳性 (3+)" : "阴性 (-)"}
          </text>

          <text x="256" y="106" fill="#f43f5e" fontSize="5">
            Ki-67: {activeSubtype === "luminalA" ? "<14% (低)" : activeSubtype === "tnbc" ? ">50% (极高)" : "高增殖"}
          </text>
        </svg>
      </div>

      {/* Therapy Guidance & Detail Box */}
      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between flex-wrap gap-1">
          <span className={`text-xs font-bold ${current.textColor} flex items-center gap-1`}>
            <Target className="w-3.5 h-3.5" />
            <span>{current.mechanismTitle}</span>
          </span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {current.osRate}
          </span>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed">
          {current.description}
        </p>

        <div className="bg-slate-900/90 p-2.5 rounded-lg border border-slate-800 space-y-1">
          <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            <span>指南标准治疗武器库：</span>
          </div>
          <ul className="space-y-1 text-[11px] text-slate-200">
            {current.therapy.map((t, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-pink-400 shrink-0">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
