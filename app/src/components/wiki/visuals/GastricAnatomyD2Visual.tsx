"use client";

import React, { useState } from "react";
import { ShieldCheck, AlertTriangle, CheckCircle2, Layers, Crosshair } from "lucide-react";

type GastricRegion = "cardia" | "fundus" | "body" | "antrum" | "pylorus";
type BorrmannType = "I" | "II" | "III" | "IV";

export function GastricAnatomyD2Visual() {
  const [activeTab, setActiveTab] = useState<"regions" | "d2nodes">("regions");
  const [selectedRegion, setSelectedRegion] = useState<GastricRegion>("antrum");
  const [selectedBorrmann, setSelectedBorrmann] = useState<BorrmannType>("III");
  const [lymphNodeCount, setLymphNodeCount] = useState<number>(18);
  const [_clearedStation, _setClearedStation] = useState<"D1" | "D2">("D2");

  const regionDetails: Record<GastricRegion, {
    name: string;
    cnLocation: string;
    characteristics: string;
    commonCancer: string;
    surgicalApproach: string;
    color: string;
  }> = {
    cardia: {
      name: "贲门部 (Cardia / GEJ)",
      cnLocation: "食管与胃连接处 0~2cm",
      characteristics: "解剖空间狭窄，紧邻纵隔与下食管括约肌，易引起进行性吞咽困难与胸骨后哽噎感",
      commonCancer: "Siewert II/III 型食管胃结合部腺癌，浸润性高",
      surgicalApproach: "近端胃大部切除术或全胃切除术 + 经腹食管裂孔纵隔淋巴结清扫",
      color: "#f59e0b"
    },
    fundus: {
      name: "胃底部 (Fundus)",
      cnLocation: "贲门左侧向上的膨大穹窿",
      characteristics: "靠近左侧膈肌与脾脏，腔内空间巨大，早期病灶常无明显症状，体检胃镜容易漏诊",
      commonCancer: "巨块型胃腺癌、胃间质瘤 (GIST) 高发区域",
      surgicalApproach: "全胃切除术 (TG) 或近端胃切除 + 脾门第 10 组淋巴结审慎清扫",
      color: "#3b82f6"
    },
    body: {
      name: "胃体部 (Body)",
      cnLocation: "胃底下方至角切迹水平",
      characteristics: "胃壁主要腺体分布区，富含胃底腺壁细胞与主细胞，分泌胃酸与内因子 (吸收Vit B12)",
      commonCancer: "大溃疡浸润型腺癌，全层浸润易发展为「革囊胃 (Linitis Plastica)」",
      surgicalApproach: "标准全胃切除术 (Total Gastrectomy) + Roux-en-Y 消化道重建",
      color: "#10b981"
    },
    antrum: {
      name: "胃窦部 (Antrum)",
      cnLocation: "角切迹至幽门之间 (胃下 1/3)",
      characteristics: "幽门螺杆菌 (Hp) 重灾区与胃酸机械研磨区，也是中国胃癌最高发的解剖部位 (> 50%)",
      commonCancer: "管状腺癌、黏液腺癌、肠化生演变腺癌极高发",
      surgicalApproach: "腹腔镜远端胃大部切除术 (Distal Gastrectomy) + D2 淋巴结清扫，首选毕I或毕II/Roux-en-Y重建",
      color: "#ec4899"
    },
    pylorus: {
      name: "幽门管 (Pylorus)",
      cnLocation: "胃与十二指肠球部交界括约肌",
      characteristics: "环形括约肌形成的天然抗反流水闸，肿瘤进展易引发机械性幽门梗阻（大量呕吐宿食）",
      commonCancer: "溃疡浸润型环形狭窄腺癌",
      surgicalApproach: "根治性远端胃切除术，彻底切除幽门环并在远端切除十二指肠球部至少 2~3cm",
      color: "#8b5cf6"
    }
  };

  const borrmannDetails: Record<BorrmannType, {
    name: string;
    morphology: string;
    laurenTendency: string;
    riskTier: string;
    warning: string;
  }> = {
    I: {
      name: "Borrmann I 型 (结节隆起型)",
      morphology: "向胃腔内突出生长，呈息肉样或菜花样，与周围正常黏膜界限清晰，基地较宽",
      laurenTendency: "多为 Lauren 肠型，高分化或中分化腺癌",
      riskTier: "局限生长 · 预后相对良好",
      warning: "肉眼界限清晰，切缘容易达到 R0 安全切除，腹膜转移概率较低。"
    },
    II: {
      name: "Borrmann II 型 (局限溃疡型)",
      morphology: "中央有明显火山口状深溃疡，边缘结节状隆起堤岸，边界明确，溃疡无广泛外周浸润",
      laurenTendency: "多为肠型，少见弥漫型",
      riskTier: "局部侵润 · 标准根治切除",
      warning: "常规需切取溃疡边缘活检以鉴别良性胃溃疡，手术切缘距溃疡边缘至少 3~5cm。"
    },
    III: {
      name: "Borrmann III 型 (浸润溃疡型 - 临床最常见)",
      morphology: "火山口样溃疡，但边缘平坦或模糊隆起，癌组织向周围胃壁黏膜下层弥漫浸润延伸",
      laurenTendency: "肠型与弥漫型均可发生，中低分化",
      riskTier: "深层浸润 · 需宽切缘与D2清扫",
      warning: "占中晚期胃癌 60% 以上。黏膜下肉眼隐匿浸润范围往往远超内镜所见，需术中快速冰冻切片确保切缘阴性。"
    },
    IV: {
      name: "Borrmann IV 型 (弥漫浸润型 / 革囊胃)",
      morphology: "无明显溃疡或局限肿块，癌细胞在黏膜下全层弥漫生长，胃壁极度增厚、僵硬、胃腔萎缩",
      laurenTendency: "高度偏向 Lauren 弥漫型 (含印戒细胞癌)，E-cadherin 表达缺失",
      riskTier: "极度高危 · 腹膜种植极高发",
      warning: "【革囊胃 Linitis Plastica】属于极危急亚型！极易早期脱落发生腹膜种植 (CY1) 与大量腹水，切勿盲目直接手术，强烈推荐术前新辅助+腹腔探查。"
    }
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 text-slate-100 shadow-xl space-y-6">
      {/* 头部标题与切换 Tab */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Crosshair className="w-4 h-4" />
            <span>胃部解剖沙盘与 D2 质控交互模拟仪</span>
          </div>
          <h3 className="text-xl font-bold tracking-tight text-white mt-0.5">
            胃癌解剖分区、Borrmann分型与 D2 淋巴清扫标准
          </h3>
        </div>

        <div className="flex rounded-xl bg-slate-800/80 p-1 border border-slate-700/60 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("regions")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "regions"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            解剖分区与Borrmann分型
          </button>
          <button
            onClick={() => setActiveTab("d2nodes")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === "d2nodes"
                ? "bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            D2 淋巴结清扫质控 (≥16枚)
          </button>
        </div>
      </div>

      {activeTab === "regions" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧：胃部解剖矢量示意图 */}
          <div className="lg:col-span-6 bg-slate-950/60 rounded-xl border border-slate-800 p-4 flex flex-col items-center justify-center relative min-h-[340px]">
            <span className="absolute top-3 left-3 text-[11px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded border border-slate-700">
              胃壁精细解剖交互示意
            </span>

            {/* SVG 胃轮廓与分区渲染 */}
            <svg viewBox="0 0 340 320" className="w-full max-w-[280px] h-auto drop-shadow-lg">
              {/* 食管入口 */}
              <path d="M120,20 L140,20 L140,65 L120,65 Z" fill="#64748b" opacity="0.6" />
              <text x="130" y="38" fill="#cbd5e1" fontSize="9" textAnchor="middle">食管末端</text>

              {/* 胃大体轮廓路径 - 分段高亮 */}
              {/* 贲门区 */}
              <path
                d="M120,65 Q135,65 140,65 Q145,85 130,95 Q115,85 120,65 Z"
                fill={selectedRegion === "cardia" ? "#f59e0b" : "#475569"}
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => setSelectedRegion("cardia")}
              />

              {/* 胃底膨大穹窿 */}
              <path
                d="M120,65 C85,60 50,85 60,135 C65,150 90,140 100,120 C105,100 115,85 130,95 Z"
                fill={selectedRegion === "fundus" ? "#3b82f6" : "#334155"}
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => setSelectedRegion("fundus")}
              />

              {/* 胃体主部 (大弯 & 小弯) */}
              <path
                d="M130,95 C145,130 150,170 145,210 C125,230 85,220 70,185 C55,150 65,150 100,120 Z"
                fill={selectedRegion === "body" ? "#10b981" : "#1e293b"}
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => setSelectedRegion("body")}
              />

              {/* 胃窦部 */}
              <path
                d="M145,210 C165,225 200,235 220,210 C210,180 180,185 155,185 C150,195 145,200 145,210 Z"
                fill={selectedRegion === "antrum" ? "#ec4899" : "#334155"}
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => setSelectedRegion("antrum")}
              />

              {/* 幽门与十二指肠 */}
              <path
                d="M220,210 Q240,210 245,195 Q260,195 270,210 L255,225 Q235,225 220,210 Z"
                fill={selectedRegion === "pylorus" ? "#8b5cf6" : "#475569"}
                className="cursor-pointer transition-colors duration-300 hover:opacity-80"
                onClick={() => setSelectedRegion("pylorus")}
              />

              {/* 十二指肠接续 */}
              <path d="M260,195 L290,180 L295,200 L270,210 Z" fill="#64748b" opacity="0.4" />
              <text x="290" y="215" fill="#94a3b8" fontSize="8">十二指肠</text>

              {/* 标注锚点 */}
              <circle cx="130" cy="80" r="3" fill="#ffffff" />
              <text x="145" y="83" fill="#ffffff" fontSize="9" fontWeight="bold">贲门</text>

              <circle cx="85" cy="100" r="3" fill="#ffffff" />
              <text x="40" y="105" fill="#ffffff" fontSize="9" fontWeight="bold">胃底</text>

              <circle cx="110" cy="165" r="3" fill="#ffffff" />
              <text x="115" y="168" fill="#ffffff" fontSize="9" fontWeight="bold">胃体</text>

              <circle cx="185" cy="210" r="3" fill="#ffffff" />
              <text x="180" y="235" fill="#ffffff" fontSize="9" fontWeight="bold">胃窦 (高发)</text>

              <circle cx="235" cy="205" r="3" fill="#ffffff" />
              <text x="235" y="190" fill="#ffffff" fontSize="9" fontWeight="bold">幽门</text>
            </svg>

            {/* 解剖快速选择标签 */}
            <div className="flex flex-wrap justify-center gap-1.5 mt-2">
              {(Object.keys(regionDetails) as GastricRegion[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-all ${
                    selectedRegion === key
                      ? "bg-white text-slate-950 font-bold shadow"
                      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {regionDetails[key].name.split(" ")[0]}
                </button>
              ))}
            </div>
          </div>

          {/* 右侧：解剖与 Borrmann 组合解读面板 */}
          <div className="lg:col-span-6 space-y-4">
            {/* 当前选中分区卡片 */}
            <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">解剖分区特征</span>
                <span className="text-[11px] text-slate-400">{regionDetails[selectedRegion].cnLocation}</span>
              </div>
              <h4 className="text-base font-bold text-white mt-1">{regionDetails[selectedRegion].name}</h4>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{regionDetails[selectedRegion].characteristics}</p>
              
              <div className="mt-2.5 pt-2.5 border-t border-slate-700/60 text-xs flex flex-col gap-1">
                <div className="flex items-start gap-1 text-slate-300">
                  <span className="text-amber-300 shrink-0 font-medium">高发病理:</span>
                  <span>{regionDetails[selectedRegion].commonCancer}</span>
                </div>
                <div className="flex items-start gap-1 text-slate-300">
                  <span className="text-teal-300 shrink-0 font-medium">手术切除方案:</span>
                  <span>{regionDetails[selectedRegion].surgicalApproach}</span>
                </div>
              </div>
            </div>

            {/* Borrmann 大体分型选择器 */}
            <div className="p-3.5 rounded-xl border border-slate-700 bg-slate-800/60 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">Borrmann 大体浸润分型</span>
                <span className="text-[10px] text-slate-400">反映肿瘤宏观浸润与恶性度</span>
              </div>

              <div className="grid grid-cols-4 gap-1.5">
                {(["I", "II", "III", "IV"] as BorrmannType[]).map((b) => (
                  <button
                    key={b}
                    onClick={() => setSelectedBorrmann(b)}
                    className={`py-1.5 text-xs rounded-lg font-bold border transition-all ${
                      selectedBorrmann === b
                        ? b === "IV"
                          ? "bg-rose-500/20 border-rose-500 text-rose-300"
                          : "bg-amber-500/20 border-amber-500 text-amber-300"
                        : "border-slate-700 bg-slate-900/60 text-slate-400 hover:text-white"
                    }`}
                  >
                    Borrmann {b}
                  </button>
                ))}
              </div>

              <div className="rounded-lg bg-slate-900/80 p-2.5 border border-slate-700/60 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{borrmannDetails[selectedBorrmann].name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                    selectedBorrmann === "IV" ? "bg-rose-950 text-rose-300 border border-rose-800" : "bg-slate-800 text-amber-300"
                  }`}>
                    {borrmannDetails[selectedBorrmann].riskTier}
                  </span>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">{borrmannDetails[selectedBorrmann].morphology}</p>
                <div className="text-[11px] text-slate-400">
                  <span className="text-slate-300 font-medium">Lauren 关联: </span>{borrmannDetails[selectedBorrmann].laurenTendency}
                </div>
                <div className={`p-2 rounded text-[11px] leading-relaxed border ${
                  selectedBorrmann === "IV" ? "bg-rose-950/40 border-rose-800 text-rose-200" : "bg-slate-800/60 border-slate-700 text-slate-200"
                }`}>
                  {borrmannDetails[selectedBorrmann].warning}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Tab 2: D2 淋巴结清扫质控交互沙盘 */
        <div className="space-y-6">
          <div className="bg-slate-950/70 rounded-xl border border-slate-800 p-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h4 className="text-base font-bold text-white flex items-center gap-2">
                  <span>D2 根治术区域淋巴结检出质控滑块</span>
                  <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full">
                    国际金标准质控红线: ≥ 16 枚
                  </span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  滑动调节术后病理报告中实际检出的淋巴结总数，实时观察分期可靠性与临床辅助建议
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-amber-400">{lymphNodeCount}</span>
                <span className="text-xs text-slate-400">枚检出</span>
              </div>
            </div>

            {/* 滑块 */}
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="45"
                step="1"
                value={lymphNodeCount}
                onChange={(e) => setLymphNodeCount(Number(e.target.value))}
                className="w-full accent-amber-500 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>0 枚 (极度不全)</span>
                <span className="text-rose-400 font-bold">16 枚 (质控合格红线)</span>
                <span className="text-emerald-400 font-bold">30 枚 (精细区分N3a/b)</span>
                <span>45 枚+</span>
              </div>
            </div>

            {/* 质控状态提示条 */}
            {lymphNodeCount < 16 ? (
              <div className="flex items-start gap-3 p-3 bg-rose-950/40 border border-rose-800/80 rounded-xl text-rose-200 text-xs leading-relaxed">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-rose-300 text-sm">区域淋巴结质控未达标（&lt; 16 枚）—— 存在潜在分期低估风险</div>
                  <p className="mt-1">
                    当前标本仅检出 <strong>{lymphNodeCount} 枚</strong>淋巴结，未达到国际与 CSCO 质控红线（≥ 16 枚）。由于清扫或取材枚数不足，极易将隐匿的 N1/N2 微小转移误判为假性 N0 早期。临床常将其视为<strong>重大病理高危因素</strong>，强烈建议多学科讨论行足疗程术后辅助化疗（如 SOX 或 XELOX 方案）进行补救巩固。
                  </p>
                </div>
              </div>
            ) : lymphNodeCount < 30 ? (
              <div className="flex items-start gap-3 p-3 bg-emerald-950/40 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-emerald-300 text-sm">符合标准 D2 根治术质控标准（检出 {lymphNodeCount} 枚 ≥ 16 枚）</div>
                  <p className="mt-1">
                    手术彻底清扫了胃周第 1 站及各大血管根部第 2 站淋巴引流区，病理科取材细致，所获得的分期结论置信度极高，能够为术后是否需要化疗提供精准可靠的循证依据。
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-3 bg-teal-950/40 border border-teal-800/80 rounded-xl text-teal-200 text-xs leading-relaxed">
                <ShieldCheck className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-teal-300 text-sm">卓越级超高质量清扫（检出 {lymphNodeCount} 枚 ≥ 30 枚）</div>
                  <p className="mt-1">
                    检出淋巴结数量极为充沛，达到国际顶级胃肠专科医学中心标准！能够准确区分 N3a (7~15枚) 与 N3b (≥16枚) 的细微病理预后差别，复发隐患极低。
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* D1 与 D2 淋巴结站别详细对照表 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white text-sm">第 1 站淋巴结 (D1 清扫范围 - 胃周浅层)</h5>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">胃周紧邻组</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-amber-400">第 1 组</strong>：贲门右淋巴结 (引流胃食管结合部右侧)</li>
                <li><strong className="text-amber-400">第 2 组</strong>：贲门左淋巴结 (引流胃底贲门左侧)</li>
                <li><strong className="text-amber-400">第 3 组</strong>：胃小弯淋巴结 (胃左动脉胃支周围，最高危)</li>
                <li><strong className="text-amber-400">第 4 组</strong>：胃大弯淋巴结 (胃网膜左右血管旁)</li>
                <li><strong className="text-amber-400">第 5 组</strong>：幽门上淋巴结 (胃右动脉根部)</li>
                <li><strong className="text-amber-400">第 6 组</strong>：幽门下淋巴结 (胃网膜右动脉根部)</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h5 className="font-bold text-white text-sm">第 2 站淋巴结 (D2 根治扩围 - 血管根部深层)</h5>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded">东亚金标准核心</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                <li><strong className="text-teal-400">第 7 组</strong>：胃左动脉干周围淋巴结 (腹腔干起始部)</li>
                <li><strong className="text-teal-400">第 8a 组</strong>：肝总动脉前上组淋巴结 (通往肝门要道)</li>
                <li><strong className="text-teal-400">第 9 组</strong>：腹腔干根部周围淋巴结 (腹腔大血管核心中枢)</li>
                <li><strong className="text-teal-400">第 10 组</strong>：脾门淋巴结 (全胃切除高危侵犯区)</li>
                <li><strong className="text-teal-400">第 11 组</strong>：脾动脉干沿线淋巴结 (近端与远端)</li>
                <li><strong className="text-teal-400">第 12a 组</strong>：肝十二指肠韧带内肝动脉沿线淋巴结</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
