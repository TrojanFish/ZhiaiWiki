"use client";

import React, { useState } from "react";
import { Ruler, ShieldCheck, AlertTriangle, Scissors, Activity, CheckCircle2, Stethoscope } from "lucide-react";

type RectalLevel = "low" | "mid" | "high";

interface LevelDetails {
  name: string;
  distanceRange: string;
  peritonealRelation: string;
  sphincterPreservationRate: string;
  surgicalOptions: string[];
  tntRecommendation: string;
  clinicalAdvice: string;
  riskColor: string;
  badgeBg: string;
  borderCol: string;
}

export function RectalAnatomyRulerVisual() {
  const [selectedLevel, setSelectedLevel] = useState<RectalLevel>("low");

  const levelData: Record<RectalLevel, LevelDetails> = {
    low: {
      name: "低位 / 超低位直肠 (距肛缘 < 5 cm)",
      distanceRange: "0 cm ~ 5 cm (齿状线上 0~3 cm)",
      peritonealRelation: "完全位于腹膜返折以下，无浆膜层，直接紧邻肛门括约肌复合体与盆底肛提肌",
      sphincterPreservationRate: "保肛挑战极大 (约 40% ~ 70%，取决于肿瘤距括约肌间沟深度)",
      surgicalOptions: [
        "经括约肌间切除术 (ISR，极限保肛)",
        "超低位吻合前切除术 (Ultra-low LAR + 预防性回肠造口)",
        "腹会阴联合切除术 (Miles 手术，需永久造口)"
      ],
      tntRecommendation: "强烈推荐术前全程新辅助治疗 (TNT: 放疗+化疗)，争取肿瘤退缩降期甚至临床完全缓解 (cCR) 避免切除肛门！",
      clinicalAdvice: "若肿瘤侵及外括约肌或耻骨直肠肌，切勿为了盲目保肛而牺牲根治切缘；现代 TNT 方案使近 30% 患者肿瘤完全消失，迎来免手术保肛希望。",
      riskColor: "text-rose-400",
      badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      borderCol: "border-rose-500/30 bg-rose-950/20"
    },
    mid: {
      name: "中段直肠 (距肛缘 5 cm ~ 10 cm)",
      distanceRange: "5 cm ~ 10 cm (腹膜返折下方 ~ 侧方)",
      peritonealRelation: "前壁有腹膜覆盖，后壁与两侧完全位于系膜筋膜 (MRF) 包裹内",
      sphincterPreservationRate: "保肛成功率极高 (> 85% ~ 95%)",
      surgicalOptions: [
        "全直肠系膜切除术 (TME) + 低位前切除术 (LAR)",
        "常行临时保护性回肠造口 (Loop Ileostomy) 预防吻合口漏"
      ],
      tntRecommendation: "cT3-4 或淋巴结转移 (N+) 患者推荐新辅助放化疗 (nCRT) 或 TNT，显著降低盆腔局部复发率。",
      clinicalAdvice: "保肛手术通常顺利，但因吻合口较低，术中常规加做保护性造口；术后 3~6 个月造影确认吻合口牢固后即可回纳恢复正常排便。",
      riskColor: "text-amber-400",
      badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      borderCol: "border-amber-500/30 bg-amber-950/20"
    },
    high: {
      name: "上段直肠 (距肛缘 10 cm ~ 15 cm)",
      distanceRange: "10 cm ~ 15 cm (直肠乙状结肠交界处下方)",
      peritonealRelation: "位于腹膜返折以上，前壁与两侧壁均有完整浆膜层覆盖，生物学行为更接近乙状结肠癌",
      sphincterPreservationRate: "几乎 100% 顺利保肛",
      surgicalOptions: [
        "部分直肠系膜切除术 (PME) / 高位 LAR 根治术",
        "吻合口距离肛门充足，绝大多数无需做保护性造口"
      ],
      tntRecommendation: "术前通常不需要常规放疗（除非巨大且直接侵及骨盆筋膜），主要以腹腔镜微创手术根治切除为主。",
      clinicalAdvice: "解剖位置较高，控便神经与肌肉群完全不受波及，术后极少发生排便失禁或前切除综合征 (LARS)，恢复最迅速。",
      riskColor: "text-emerald-400",
      badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      borderCol: "border-emerald-500/30 bg-emerald-950/20"
    }
  };

  const curr = levelData[selectedLevel];

  return (
    <div className="bg-slate-900 rounded-2xl p-3 sm:p-4 text-white select-none border border-slate-800">
      {/* 顶栏标题 */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
          <Ruler className="w-4 h-4 text-emerald-400" />
          <span>直肠癌三段解剖标尺与保肛决策模拟器</span>
        </span>
        <span className="text-[10px] text-slate-400">解剖标志 · 括约肌分水岭</span>
      </div>

      {/* 三段直肠切换按键 */}
      <div className="grid grid-cols-3 gap-1 mb-3">
        <button
          type="button"
          onClick={() => setSelectedLevel("low")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedLevel === "low"
              ? "bg-rose-500 text-white shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>低位 (&lt; 5cm)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedLevel("mid")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedLevel === "mid"
              ? "bg-amber-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>中段 (5~10cm)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedLevel("high")}
          className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
            selectedLevel === "high"
              ? "bg-emerald-500 text-slate-950 shadow-md font-extrabold"
              : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200"
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>上段 (10~15cm)</span>
        </button>
      </div>

      {/* 交互式直肠解剖 SVG 纵切示意图 */}
      <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 mb-3">
        <svg viewBox="0 0 340 170" className="w-full h-auto">
          {/* 标尺刻度背景轴 (0 ~ 15 cm) */}
          <line x1="35" y1="20" x2="35" y2="155" stroke="#475569" strokeWidth="2" />
          
          {/* 刻度标记 */}
          <line x1="28" y1="25" x2="35" y2="25" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="24" y="28" fill="#94a3b8" fontSize="7" textAnchor="end">15cm</text>
          
          <line x1="28" y1="65" x2="35" y2="65" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="24" y="68" fill="#94a3b8" fontSize="7" textAnchor="end">10cm</text>
          
          <line x1="28" y1="105" x2="35" y2="105" stroke="#94a3b8" strokeWidth="1.5" />
          <text x="24" y="108" fill="#94a3b8" fontSize="7" textAnchor="end">5cm</text>

          <line x1="28" y1="135" x2="35" y2="135" stroke="#f43f5e" strokeWidth="1.5" />
          <text x="24" y="138" fill="#fb7185" fontSize="7" textAnchor="end">2cm (齿状线)</text>

          <line x1="28" y1="155" x2="35" y2="155" stroke="#94a3b8" strokeWidth="2" />
          <text x="24" y="158" fill="#94a3b8" fontSize="7" textAnchor="end">0cm (肛缘)</text>

          {/* 直肠管腔与系膜解剖示意 */}
          {/* 上段直肠 (10-15cm) */}
          <path
            d="M 60 25 Q 70 45 75 65 L 115 65 Q 110 45 100 25 Z"
            fill={selectedLevel === "high" ? "#10b981" : "#1e293b"}
            fillOpacity={selectedLevel === "high" ? "0.35" : "0.5"}
            stroke={selectedLevel === "high" ? "#34d399" : "#334155"}
            strokeWidth={selectedLevel === "high" ? "2" : "1"}
          />
          <text x="90" y="48" textAnchor="middle" fill={selectedLevel === "high" ? "#6ee7b7" : "#64748b"} fontSize="8" fontWeight="bold">
            上段直肠 (腹膜返折上)
          </text>

          {/* 腹膜返折分界线 (约 7-8cm 处) */}
          <line x1="45" y1="85" x2="160" y2="85" stroke="#38bdf8" strokeWidth="1.2" strokeDasharray="3,3" />
          <text x="165" y="88" fill="#38bdf8" fontSize="7" fontWeight="bold">腹膜返折 (Peritoneal Reflection)</text>

          {/* 中段直肠 (5-10cm) */}
          <path
            d="M 75 65 Q 80 85 75 105 L 115 105 Q 120 85 115 65 Z"
            fill={selectedLevel === "mid" ? "#f59e0b" : "#1e293b"}
            fillOpacity={selectedLevel === "mid" ? "0.35" : "0.5"}
            stroke={selectedLevel === "mid" ? "#fbbf24" : "#334155"}
            strokeWidth={selectedLevel === "mid" ? "2" : "1"}
          />
          <text x="95" y="88" textAnchor="middle" fill={selectedLevel === "mid" ? "#fde68a" : "#64748b"} fontSize="8" fontWeight="bold">
            中段直肠 (TME金标准区)
          </text>

          {/* 低位/超低位直肠 (<5cm) */}
          <path
            d="M 75 105 Q 70 120 72 135 L 118 135 Q 120 120 115 105 Z"
            fill={selectedLevel === "low" ? "#f43f5e" : "#1e293b"}
            fillOpacity={selectedLevel === "low" ? "0.35" : "0.5"}
            stroke={selectedLevel === "low" ? "#f43f5e" : "#334155"}
            strokeWidth={selectedLevel === "low" ? "2" : "1"}
          />
          <text x="95" y="122" textAnchor="middle" fill={selectedLevel === "low" ? "#fda4af" : "#64748b"} fontSize="8" fontWeight="bold">
            低位直肠 (保肛挑战区)
          </text>

          {/* 括约肌与肛管区域 (0-2cm) */}
          {/* 内括约肌 (平滑肌) */}
          <rect x="70" y="135" width="8" height="20" fill="#f43f5e" opacity="0.8" rx="2" />
          <rect x="112" y="135" width="8" height="20" fill="#f43f5e" opacity="0.8" rx="2" />
          
          {/* 外括约肌 (骨骼肌) */}
          <rect x="60" y="138" width="8" height="17" fill="#be123c" rx="2" />
          <rect x="122" y="138" width="8" height="17" fill="#be123c" rx="2" />

          <text x="95" y="148" textAnchor="middle" fill="#fda4af" fontSize="6.5">肛管及齿状线</text>

          {/* 右侧解剖高亮指示卡 */}
          <g transform="translate(195, 20)">
            <rect width="135" height="42" fill="#0f172a" rx="6" stroke="#334155" strokeWidth="1" />
            <text x="8" y="16" fill="#38bdf8" fontSize="7.5" fontWeight="bold">解剖分水岭定义</text>
            <text x="8" y="28" fill="#94a3b8" fontSize="6.5">以腹膜返折为界：</text>
            <text x="8" y="38" fill="#cbd5e1" fontSize="6.5">返折以下无浆膜，复发易侵及系膜骨盆</text>
          </g>

          <g transform="translate(195, 70)">
            <rect width="135" height="50" fill="#0f172a" rx="6" stroke={selectedLevel === "low" ? "#e11d48" : "#334155"} strokeWidth="1" />
            <text x="8" y="16" fill={curr.riskColor} fontSize="7.5" fontWeight="bold">当前选中分段特征</text>
            <text x="8" y="28" fill="#f1f5f9" fontSize="7">{curr.name.split(' (')[0]}</text>
            <text x="8" y="40" fill="#94a3b8" fontSize="6.5">{curr.distanceRange}</text>
          </g>

          <g transform="translate(195, 126)">
            <rect width="135" height="34" fill="#0f172a" rx="6" stroke="#334155" strokeWidth="1" />
            <text x="8" y="14" fill="#a78bfa" fontSize="7" fontWeight="bold">齿状线与肛管 (0~2cm)</text>
            <text x="8" y="26" fill="#cbd5e1" fontSize="6.5">内括约肌(不自主)+外括约肌(自主控便)</text>
          </g>
        </svg>
      </div>

      {/* 临床决策详情面板 */}
      <div className={`p-3 rounded-xl border ${curr.borderCol} space-y-2.5`}>
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <span className={`text-xs font-bold ${curr.riskColor} flex items-center gap-1`}>
            <Scissors className="w-3.5 h-3.5" />
            <span>保肛预期与手术策略</span>
          </span>
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${curr.badgeBg}`}>
            {curr.sphincterPreservationRate}
          </span>
        </div>

        {/* 解剖毗邻 */}
        <div className="text-[11px] text-slate-300 leading-relaxed">
          <span className="text-slate-400 font-bold">解剖毗邻：</span>
          {curr.peritonealRelation}
        </div>

        {/* 规范术式 */}
        <div>
          <span className="text-[11px] text-slate-400 font-bold block mb-1">主流根治术式选项：</span>
          <div className="grid grid-cols-1 gap-1">
            {curr.surgicalOptions.map((opt, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-[10px] bg-slate-800/60 px-2 py-1 rounded text-slate-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>{opt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 新辅助 TNT 指征 */}
        <div className="bg-slate-950/70 p-2 rounded-lg border border-slate-800/80 text-[10px] text-sky-300 leading-relaxed">
          <span className="font-bold text-sky-400 block mb-0.5">TNT / 新辅助放化疗角色：</span>
          {curr.tntRecommendation}
        </div>

        {/* 专家暖心嘱托 */}
        <div className="text-[10px] text-slate-400 leading-relaxed pt-1 border-t border-slate-800/80">
          <span className="text-emerald-400 font-bold inline-flex items-center gap-1">
            <Stethoscope className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>专科医生建议：</span>
          </span>
          {curr.clinicalAdvice}
        </div>
      </div>
    </div>
  );
}
