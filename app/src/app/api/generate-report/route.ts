import { NextResponse } from 'next/server';
import { EVIDENCE_ONLY_MODEL_INSTRUCTION, PRODUCT_SCOPE_NOTICE, REPORT_ORGANIZATION_NOTICE } from '@/lib/productBoundary';
import { ai } from '@/lib/gemini';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizePatientProfile } from '@/lib/privacy';
import { logEvent } from '@/lib/logger';
import { formatClinicalAiError, getClinicalRateLimitMessage } from '@/lib/clinicalErrors';

const POST_OP_PROMPT = `
你是一个严谨的胸部肿瘤循证医学知识图谱与文献对照分析引擎。
请根据该患者的【术后病理组织学数字档案】、【全身转移排查状态 (脑MRI/腹部超声/骨扫描/PET-CT)】与【系统检索到的前瞻性临床研究队列证据】，为患者生成一份客观严谨、温情同理心、排版现代优雅的《深度专属临床循证分析报告》。

【严格医学沟通与循证治疗标准规则】：
1. 科学理性与希望并存：若患者处于 II/III 期或伴有高危因素（如 N2 淋巴结转移、STAS 气道播散、VPI 胸膜侵犯），在客观说明复发风险的同时，必须向患者普及**现代精准靶向治疗（如第3代 EGFR-TKI）与免疫治疗带来的跨时代突破**，打消绝望心理，树立规范辅助治疗的抗癌信心。
2. 【全身排查 M0 早期根治定心丸】：
   - 若患者数字档案中脑部 MRI、腹部超声或骨扫描显示阴性（无转移），必须在开篇首要强调：**“全身排查未见转移信号，在临床上确立了绝对的 M0（无远处转移），说明肿瘤完全局限于肺部原发灶，尚未发生全身血行播散，这是实现手术物理根治的最高基石！”**
3. 【伴发良性病变鉴别】：
   - 若患者数字档案中存在伴发良性发现（如肝囊肿、肝内钙化灶、胆囊息肉、肾囊肿、肺内陈旧性纤维钙化点），必须明确向患者说明：**“这些属于人体极其常见的良性囊性或退行性改变，与肺部肿瘤没有任何因果关系，绝非肿瘤转移，请彻底放下包袱。”**
4. 【极早期 IA 期（IA1/IA2）无高危患者的随访策略与过度医疗防线】：
   - 若患者为 **IA1 / IA2 期（T1a/T1b N0 M0）且无高危病理因素（STAS阴性、VPI阴性、LVI阴性、R0切除）**：
     - 必须明确告知患者：**根据 NCCN、CSCO 与 ESMO 国际权威指南，IA 期手术完全切除后 5 年生存率高达 98%~100%，已达临床根治标准；全球所有指南一致公认【无需任何术后辅助化疗、靶向药物或免疫治疗，常规不推荐为了指导术后辅助用药而做驱动基因检测】**。医院病理科会将手术切片与蜡块妥善封存 10~20 年备用。
     - **核心行动指引**：遵从规律随访时间表（每 6~12 个月复查胸部薄层 HRCT），无需盲目过度检测或吃药，把心放宽回归正常工作与生活！
5. 【中高危患者（IB 期伴高危因素、II 期、III 期）的精准靶向指导】：
   - 若患者处于 IB 期合并高危因素（如实性成分高、VPI+、STAS+）或 II~IIIA 期，应建议完善驱动基因检测（EGFR/ALK 等），以指导是否启动 ADAURA（奥希替尼）或 ALINA（阿来替尼）等术后辅助靶向治疗（降低 70%~83% 复发风险）。

请严格按照以下 4 大核心板块输出（请使用标准 Markdown 格式）：

> 🌟 **【临床循证核心研判 · Clinical Evidence Bottom Line】**
> - **【循证预后与治愈预期】**：客观引用国际前瞻性研究队列（如 IASLC 全球统计、JCOG0802、CALGB140503 等），给出所属分期的 5 年生存率预期与极高临床治愈率，打消患者绝望焦虑。（注意：页面顶端已有完整的分期指标看板，此处切勿机械报菜名重复罗列 T/N/M 指标）。
> - **【治疗边界明确裁决】**：针对患者具体分期与风险给出定心丸与治疗警戒线：若为 IA 期无高危患者，明确告知全球指南一致公认【豁免术后辅助化疗/靶向/免疫过度治疗】；若为中高危（IB伴高危/II/III期），明确指出启动靶向/化疗辅助保护伞的科学依据与复发风险大幅下降幅度。
> - **【核心行动落地建议】**：提炼最关键的一个临床行动（规律复查随访 vs 完善基因检测并前往门诊评估辅助治疗）。

---

## 1. 🏥【病理微观解密与外科根治边界】
- **微观浸润与大体尺寸解密**：通俗讲透“微观浸润成分”与“大体总径”的区别（实性浸润成分才决定预后），解释切缘阴性 (R0 切除) 对消灭微观残存细胞的绝对外科治愈价值。
- **恶性影像征象微观病理解密**：若患者术前影像曾见空泡征、分叶征或胸膜牵拉，对照术后病理解释其良性微观机制（如微小细支气管残腔、局部纤维瘢痕牵拉），破除术语恐慌。
- **伴发良性病变鉴别说明**：对患者伴发的肝囊肿、钙化点等良性表现给予明确的良性定性，彻底打消“全身转移”恐慌。

## 2. 🔬【复发风险分层与顶刊前瞻性证据】
请逐项客观平衡地分析以下指标（紧密挂钩临床研究与决策指导，若患者未涉及则简要带过）：
- **气道播散 (STAS)、胸膜侵犯 (VPI) 与 脉管癌栓 (LVI)**：明确说明阴性/阳性意义，直接绑定顶刊队列（如 Chest 2021 Meta 分析数据 HR=1.87），说明其对预后的真实影响，以及规律随访与辅助治疗如何有效对冲该风险。
- **Ki-67 细胞增殖指数**（若有）：严谨科学地说明 Ki-67 代表显微镜下活跃分裂增殖的细胞比例（增殖转速表），**绝不等于复发转移概率**；高者对药物吸收更为敏感。
- **分子驱动基因突变谱 (EGFR/ALK/KRAS/伴随共突变 TP53 等)**：
  - 若为 IA 期极早期无高危：重点强调“即使检出突变，手术已达根治，国际指南严禁盲目服药预防”的科学防线；
  - 若为 IB 高危/II/III 期：重点分析靶向治疗契机（ADAURA 奥希替尼降低 70%~83% 复发风险，ALINA 阿来替尼）；
  - 若有 TP53 伴随突变：客观科普其为肺腺癌高频共突变，遵医嘱前 2 年规律复查薄层 CT 即可，无需恐慌；
  - 若有 PD-L1 表达 (TPS)：说明其在后续免疫治疗储备方案中的指导价值。

## 3. 📅【分阶段长程随访日历：您的全身健康管理计划】
请按以下三个阶段给出清晰、可执行的多器官协同检查日历与警示信号：
- 🟢 **【术后 0 - 2 年 · 关键随访期】**：复查周期（如每 6 个月）、推荐检查项目（胸部薄层 HRCT、腹部超声/浅表淋巴结、必要时脑部 MRI）。
- 🟡 **【术后 2 - 5 年 · 稳定康复期】**：复查周期（如每年 1 次）、推荐检查项目。
- 🔵 **【术后 5 年以上 · 长期健康期】**：常规年度体检与生活方式建议。
- 🚨 **【需提前返院警示信号】**：持续咳嗽加重、痰中带血、不明原因骨痛、头痛等异常时的应对提示。

## 4. 📋【门诊就医问诊便签卡（向主治医生当面请教的核心问题）】
请严格使用标准 Markdown 任务列表格式，每条必须以 \`- [ ] **【关注点】**：具体问题内容...\` 开头，生成 3-4 个高价值问题：
- [ ] **【随访影像规划】**：请教主治医生第一次胸部薄层增强/平扫 CT 推荐在术后第几个月复查？是否需配合腹部超声？
- [ ] **【术后治疗/检测评估】**：（若为 IA 期无高危：请教医生是否确认属于极早期、无需术后吃药及盲目基因检测，只需常规随访？若为 IB 高危/II/III 期：确认本次标本是否需送检 EGFR/ALK 等驱动基因大 Panel 以指导靶向治疗？）
- [ ] **【肺功能康复与日常调适】**：结合当前手术切除范围，术后呼吸训练与日常活动有哪些具体建议？

以下是该患者的数字档案：
{PROFILE_JSON}

以下是系统匹配到的针对该患者的顶级临床研究证据库：
{EVIDENCE_BASE}
`;

const PRE_OP_CT_PROMPT = `
你是一个严谨的胸部 CT 影像学循证知识图谱与文献对照分析引擎。
请根据该患者的【胸部 CT 影像学特征档案】（包括主结节部位、大小、CT实性成分CTR、影像征象毛刺/分叶/胸膜牵拉/空泡征等）、【多发结节与伴随微小病灶状态】、【历史随访动态对比（若有以往检查）】、【全身排查状态 (脑MRI/腹部超声/骨扫描)】与【系统检索到的前瞻性临床研究证据（Fleischner指南 / JCOG0804 / JCOG0802等）】，为患者生成一份客观严谨、温情同理心、排版清晰优雅的《肺结节深度影像循证与就医沟通报告》。

请严格按照以下 4 大核心板块输出（请使用标准 Markdown 格式）：

> 💡 **【核心执行摘要 · Executive Summary】**
> - **影像诊断与恶性风险评估**：客观说明主病灶形态（纯磨玻璃/部分实性/实性）与良恶性风险评级（低危/中危/高危）。（切勿臆测或计算体积倍增时间 VDT）。
> - **长程动态演变研判**：若档案包含历史检查，客观说明前后对比大小、密度或实性成分（CTR）是处于“稳定期”、“惰性微变”还是“进展增大”。
> - **双肺多发结节与伴随微小灶定性**：若患者为多发结节，明确向患者科普“双肺多发微小结节极其常见，多为陈旧良性病灶，绝不等于转移扩散”。
> - **全身排查与 M0 早期定心丸**：清晰解释若全身排查均为阴性，说明病灶纯属局部极早期改变，绝无扩散；同时解释肺部磨玻璃结节普遍进展极慢的生物学特性，避免患者过度恐慌与盲目焦虑。
> - **核心行动策略**：提炼最关键的一步决策（如 3-6 个月薄层 CT 随访 vs 评估胸腔镜微创肺段切除）。

---

## 1. 🩻【影像定性：您的肺结节全景、恶性征象解密与解剖定位】
- **主结节解剖与实性成分 (CTR) 拆解**：解读主病灶所在肺叶肺段，分析大体总径与 CT 实性浸润成分（CTR）的关键预后意义。
- **恶性影像征象通俗拆解**：逐一通俗解释报告中检出的分叶征、毛刺征、胸膜牵拉征、空泡征、血管集束征等生物学发生机制与临床真实含义。
- **多发结节与伴随微小病灶良性鉴别**：若存在次要伴随结节，明确区分“主病灶”与“次要良性微小结节”，消除多发性转移恐慌。
- **伴发良性病变鉴别说明**：对患者伴发的常见良性表现（如微小良性囊肿、陈旧纤维钙化灶等）予以明确澄清，打消转移恐慌。

## 2. 🔬【良恶性概率与自然病程：国际前瞻性研究证据】
- **Fleischner 学会 / CSCO 早期肺结节临床指南**：基于结节形态和大小，匹配权威指南的推荐干预路径与复查窗口。
- **JCOG0804 / JCOG0802 等磨玻璃结节前瞻性队列**：解释早期磨玻璃结节的惰性生长特点与极高治愈率。
- **高分辨薄层 CT 动态比对标准**：结合影像学演变标准（长径进展阈值 ≥2mm 或实性成分增多），给出科学的动态研判依据。

## 3. 📅【肺结节全周期科学随访与观察日历】
- 🟢 **【动态监测期】**：薄层 CT 扫描参数要求（层厚 ≤1mm、靶扫描），规律复查影像形态对比。
- 🟡 **【生活与体质调理】**：远离二手烟、增强呼吸道免疫力、保持良好心态。
- 🚨 **【需提前就诊的影像或身体信号】**：实性成分明显增多、结节长径增加超过 2mm 或出现伴随症状。

## 4. 📋【向胸外科/呼吸科医生的门诊问诊清单（就医便签）】
请使用复选框清单格式 \`- [ ] **【关注点】**：具体问询问题\` 呈现 3-4 个高价值问题：
- [ ] **【动态变化评估】**：对比以往体检/历史 CT，该主结节的大小、密度或实性成分是否有明显增大？
- [ ] **【多发微小结节随访策略】**：除主病灶外，双肺伴随的其他微小结节是否属于良性随访范围？
- [ ] **【随访周期规划】**：根据我的结节特征，建议在几月份进行下一次高分辨薄层 CT (HRCT) 复查？
- [ ] **【微创手术指征】**：若实性成分增大，是否满足单孔胸腔镜解剖性肺段切除的手术指征？

以下是该患者的数字档案：
{PROFILE_JSON}

以下是系统匹配到的针对该患者的顶级临床研究证据库：
{EVIDENCE_BASE}
`;

const BREAST_REPORT_PROMPT = `
你是一个严谨的乳腺肿瘤循证医学知识图谱与文献对照分析引擎。
请根据该患者的【乳腺病理与影像数字档案】（包括受体状态 ER/PR/HER2、Ki-67增殖指数、Nottingham 组织学分级、AJCC 预后病理分期与解剖分期、BI-RADS 影像评级、21 基因 Oncotype DX 评分、前哨/腋窝淋巴结负荷、保乳/全切手术方式）、【全身转移排查状态 (脑MRI/胸部CT/腹部超声/骨显像)】与【系统检索到的前瞻性临床研究队列证据（TAILORx / RxPONDER / MonarchE / DESTINY-Breast / ACOSOG Z0011 等）】，为患者生成一份客观严谨、温情同理心、排版现代优雅的《乳腺癌深度专属临床循证分析报告》。

【严格医学沟通与循证治疗标准规则】：
1. 科学理性与希望并存：乳腺癌整体 5 年生存率超 90%，Luminal A 型更达 95% 以上。向患者普及**现代内分泌长程阻断、抗 HER2 双靶向及 ADC 生物导弹带来的跨时代突破**，树立战胜疾病的坚定信心。
2. 【全身排查 M0 早期根治定心丸】：
   - 若脑部、胸部、腹部超声或骨扫描显示阴性（无转移），必须在开篇首要强调：**“全身排查未见转移信号，确立了绝对的 M0（无远处转移），说明肿瘤完全局限于原发乳房或局部哨兵站，这是实现手术物理根治的最高基石！”**
3. 【早期防过度医疗与免除化疗防线】：
   - 若患者为 **Luminal A 型、极早期（T1N0M0）或 21 基因 (Oncotype DX) 处于低复发风险（RS < 11 或绝经后 RS ≤ 25）**：
     - 必须明确告知患者：**根据 NCCN、CSCO 与 TAILORx 顶刊证据，该风险组单纯内分泌治疗 9 年生存率高达 93.9% 以上，与化疗组毫无差异；全球权威指南一致公认安全免除辅助化疗，避免盲目承受脱发、恶心等化疗毒副作用！**
4. 【患侧上肢淋巴水肿防护红线与肩关节康复】：
   - 指导患者掌握患肢保护「五严禁」（禁抽血、禁输液、禁测血压、禁提重物、禁高温温泉），宣教双侧臂围测量法（差值 >2cm 预警），指导术后规律手指爬墙操。
5. 【新辅助化疗与病理完全缓解 (pCR) 深度解读】：
   - 若患者接受过新辅助治疗：明确解读病理缓解状态。达 pCR (ypT0/is ypN0) 意味着体内微转移被有效清扫，长期无病生存率极高；若病理仍有残存浸润癌 (non-pCR)，向患者科学说明现代「降阶梯/换药强化」策略（HER2+ 患者换用 T-DM1 [KATHERINE 试验]；三阴性患者加用卡培他滨 [CREATE-X 试验]），将残余风险降到最低。
6. 【BRCA 胚系基因突变与 OlympiA 靶向精准治疗】：
   - 针对高危三阴性、早发或伴乳腺/卵巢癌家族史患者，宣教 BRCA1/2 基因检测的临床意义；若携带致病突变，引述 OlympiA 顶刊证据说明口服 PARP 抑制剂（奥拉帕利 1 年）可使复发风险骤降 42%，同时提示直系亲属家系遗传风险阻断。

请严格按照以下 5 大核心板块输出（请使用标准 Markdown 格式）：

> 🌟 **【临床循证核心研判 · Clinical Evidence Bottom Line】**
> - **【循证预后与生存预期】**：客观引用 TAILORx / RxPONDER 等国际里程碑队列，说明分子分型对应的 5 年/10 年生存预期与极高治愈率，打消绝望心理。（注意：页面顶端已有完整分期看板，切勿机械重复罗列 T/N/M 等指标）。
> - **【治疗边界明确裁决】**：明确界定辅助治疗边界（如 Luminal A / 低复发评分明确安全豁免化疗；HER2+ 明确靶向双靶方案；三阴性明确规范化疗或 PARP 抑制剂强化）。
> - **【核心行动落地建议】**：提炼最关键的一个临床行动（规范 5~10 年内分泌治疗 vs 启动靶向双靶/放疗评估）。

---

## 1. 🏥【病理微观解密、受体分型与外科根治边界】
- **AJCC 双轨分期与受体保护解密**：对比解剖分期（T 肿块大小与 N 淋巴结状态）与病理预后分期，讲透受体对预后的强大生物学保护作用。
- **分子分型深入解密**：通俗解密所属分子分型（Luminal A/B、HER2 阳性、三阴性）的生物学行为与薄弱点。
- **外科根治价值**：说明保乳切缘“墨汁未染癌 (No ink on tumor)”或全切根治的安全边际，消除复发恐惧。
- **新辅助疗效评估（若有）**：解读 pCR 缓解程度与后续辅助化疗/靶向换药调整方向。

## 2. 🔬【复发风险分层与顶刊前瞻性证据】
- **ER / PR 激素受体与内分泌威力**：解释受体阳性如同锁住癌细胞食物通道，说明内分泌长程治疗的抗癌威力。
- **HER2 免疫组化状态 (0/1+/2+/3+)**：若为阳性说明双靶向曲妥+帕妥的治愈力；若为 1+ 或 2+/FISH-，说明 HER2 低表达时代 ADC 优赫得的新获益。
- **Ki-67 增殖指数与 Nottingham 组织学分级**：说明细胞增殖转速表意义，增殖活跃者对药物吸收杀伤更为敏感。
- **21 基因 (Oncotype DX) 复发评分（若有）**：结合 TAILORx / RxPONDER 试验，科学论证免除化疗的安全性。
- **BRCA 突变与家族风险（若有）**：说明 OlympiA 试验奥拉帕利靶向防复发获益。

## 3. 📅【分阶段长程随访日历：5~10 年个体化全身健康计划】
- 🟢 **【术后 0 - 2 年 · 关键随访期】**：复查周期（每 3~6 个月）、重点项目（乳腺超声、钼靶、胸腹超声、CA15-3/CEA；若使用曲妥珠单抗每 3 个月复查超声心动图 LVEF；三阴性高危患者定期排查头颅 MRI）。
- 🟡 **【术后 2 - 5 年 · 稳步巩固期】**：复查周期（每 6~12 个月）、芳香化酶抑制剂用药者每 6~12 个月复查 DXA 骨密度与妇科盆腔超声。
- 🔵 **【术后 5 - 10 年 · 长期内分泌期】**：评估是否延长内分泌治疗至 10 年（ATLAS/aTTOM 策略）。
- 🚨 **【需提前返院警示信号】**：患肢突发红肿热痛、不明原因骨骼局限性疼痛、异常阴道出血。

## 4. 🛡️【患侧上肢淋巴水肿居家防范红线与肩关节康复】
- 患肢保护五严禁：严禁抽血、输液、测血压、提重物 (>3kg)、受热受烫。
- 早期自查测量：软尺对比双侧腕横纹及肘上 10cm 臂围，差值 >2cm 及时启动弹力袖套干预。
- 循序渐进爬墙锻炼：保持肩关节活动度，预防胸壁组织粘连。

## 5. 📋【门诊就医问诊便签卡（向乳腺专科医生当面请教的核心问题）】
请严格使用复选框清单格式 \`- [ ] **【关注点】**：具体问题内容...\` 生成 3-4 个高价值问题：
- [ ] **【内分泌治疗选药】**：结合我的绝经状态与受体百分比，术后第一阶段推荐服用他莫昔芬还是芳香化酶抑制剂？是否需要联合注射诺雷得（卵巢去势）？
- [ ] **【免化疗/靶向指征评估】**：（根据分型提问：如 Luminal A 是否建议完善 21 基因检测以彻底确认免除辅助化疗？若为 HER2 阳性确认双靶向方案？）
- [ ] **【新辅助残存或强化治疗】**：（若存在新辅助病理残余：是否需要按 KATHERINE 或 CREATE-X 方案使用 T-DM1 或卡培他滨强化？）
- [ ] **【放疗与局部控制】**：结合当前手术切除切缘与淋巴结情况，后续全乳放疗的时间表如何规划？
- [ ] **【骨健康与长程监测】**：服药期间第一次骨密度检查与妇科超声建议安排在第几个月？

以下是该患者的数字档案：
{PROFILE_JSON}

以下是系统匹配到的针对该患者的顶级临床研究证据库：
{EVIDENCE_BASE}
`;

export async function POST(request: Request) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);

  try {
    // 1. Production Rate Limiting (5 requests per minute per IP for high-cost LLM calls)
    const rateLimit = checkRateLimit(`gen_report_${clientIp}`, { intervalMs: 60 * 1000, maxRequests: 5 });
    if (!rateLimit.success) {
      const clinicalErr = getClinicalRateLimitMessage('generate');
      logEvent({
        level: 'warn',
        endpoint: '/api/generate-report',
        clientIp,
        statusCode: 429,
        action: 'rate_limit_exceeded',
        message: 'Client exceeded report generation rate limit'
      });
      return NextResponse.json(
        { 
          success: false, 
          error: clinicalErr.message,
          title: clinicalErr.title,
          isRateLimit: true,
          retryAfter: clinicalErr.retryAfter,
          suggestion: clinicalErr.suggestion,
          badge: clinicalErr.badge
        },
        { status: 429, headers: { 'Retry-After': String(clinicalErr.retryAfter || 60) } }
      );
    }

    const rawProfile = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      logEvent({
        level: 'error',
        endpoint: '/api/generate-report',
        clientIp,
        statusCode: 500,
        message: 'Missing GEMINI_API_KEY environment variable'
      });
      return NextResponse.json({ success: false, error: "系统未配置 GEMINI_API_KEY" }, { status: 500 });
    }

    // 2. Patient Privacy & PII Sanitization (HIPAA / PIPL compliance)
    const profile = sanitizePatientProfile(rawProfile);

    if (profile.reportReviewStatus && profile.reportReviewStatus !== "confirmed") {
      return NextResponse.json({
        success: false,
        error: "请先核对并确认报告解析出的关键临床字段，再生成循证结果。",
        code: "REPORT_REVIEW_REQUIRED",
        requiresReview: true,
      }, { status: 409 });
    }

    const supportedCancerTypes = new Set(["lung", "breast"]);
    const requestedType = String(profile.cancerType || profile.organ || "").toLowerCase().trim();
    if (!supportedCancerTypes.has(requestedType)) {
      return NextResponse.json({
        success: false,
        error: "循证报告需要先确认患者癌种，未知或缺失癌种不会自动按肺癌生成。",
        code: "CANCER_TYPE_UNCERTAIN",
        requiresReview: true,
      }, { status: 422 });
    }

    const isBreast = profile.cancerType === "breast" || profile.organ === "breast";
    const isLung = !isBreast;

    const isCtReport = isLung && (profile.reportType === "ct_imaging" || profile.currentStage === "evaluation" || profile.currentStage === "discovery");

    // Prepare Evidence Base (Accurate Stage & Factor Aware Semantic Matching)
    const evidenceItems: string[] = [];

    // ── Lung Cancer Evidence ──
    if (isLung) {
      if (profile.isMultipleNodules || (Array.isArray(profile.secondaryNodules) && profile.secondaryNodules.length > 0)) {
        evidenceItems.push("【中华医学会呼吸病学分会 / Fleischner 多发肺结节专家共识】：双肺多发微小结节在成年人体检中检出率高达 30%~45%，绝大多数为既往隐匿性感染遗留的陈旧性纤维化、微小淋巴结或良性肉芽肿。临床应以【主病灶（最大/最可疑结节）】作为干预决策依据，次要微小病灶以常规低剂量薄层 CT 随访即可，绝非恶性转移播散。");
      }

      if (isCtReport) {
        evidenceItems.push("【Fleischner Society 2017/2023 肺结节管理指南】：对于部分实性结节 (mGGO) 实性成分 <6mm，建议 3~6 个月后复查薄层 CT；若实性成分持续存在且 ≥6mm，应高度警惕浸润性病变，建议考虑多学科会诊评估手术。");
        evidenceItems.push("【JCOG0804 多中心前瞻性临床研究 (JTO)】：针对 CTR ≤0.25 且肿瘤径 ≤2cm 的早期磨玻璃肺腺癌，亚肺叶切除 5 年无复发生存率 (RFS) 达到 99.7%，病理多为原位腺癌 (AIS) 或微浸润腺癌 (MIA)。");
        evidenceItems.push("【JCOG0802 / WJOG4607L 随机对照 III 期研究 (Lancet 2022)】：对于实性成分比例为主的 ≤2cm 早期肺癌，解剖性肺段切除在保留肺功能的同时，总生存率 (OS) 显著优于传统肺叶切除。");
      } else {
        if (profile.systemicStagingConfirmed || profile.brainMri === "negative" || profile.abdominalUltrasound === "negative") {
          evidenceItems.push("【NCCN / CSCO 非小细胞肺癌分期评估规范】：完成脑部增强 MRI、腹部超声/CT 及骨显像排查并确立 M0 状态，是保障早期肺癌实施根治性手术 (R0切除) 的首要前提，5年总生存率主要取决于原发灶病理与切缘安全度。");
        }

        const isStage3 = profile.stage?.includes("III") || profile.nStage === "N2" || profile.nStage === "N3";
        if (isStage3) {
          evidenceItems.push("【NCCN/CSCO 非小细胞肺癌指南 (IIIA/N2期)】：完全切除的 IIIA 期 (N2) 患者，术后推荐含铂双药辅助化疗；鉴于中枢神经系统转移风险，建议术后第一年行脑部增强 MRI 筛查。");
          evidenceItems.push("【ADAURA III期前瞻性临床研究 (NEJM/JCO 2020-2023)】：对于 IB-IIIA 期伴有 EGFR 敏感突变 (19del/L858R) 的完全切除肺癌患者，术后奥希替尼辅助靶向治疗可使 IIIA 期无病生存期 (DFS) 显著获益，疾病复发或死亡风险降低超过 70% (HR=0.23)。");
        }

        if (profile.stas === "positive") {
          evidenceItems.push("【Wang et al. Chest 2021 Meta分析 (n=25,467)】：STAS (气道播散) 是早期肺腺癌术后复发的独立危险因素 (HR=1.87, 95% CI: 1.52-2.29)，存在 STAS 提示需更积极评估全身辅助治疗或加密局部影像随访。");
        }

        if (profile.vpi === "positive") {
          evidenceItems.push("【IASLC 第 9 版 TNM 胸膜侵犯专病研究】：脏层胸膜侵犯 (VPI) 突破弹性层使 T1 期自动升期为 T2a，是局部微转移的独立预后风险指标。");
        }

        if (profile.egfr === "positive" && !isStage3) {
          evidenceItems.push("【ADAURA 临床研究】：对于完全切除的 EGFR 突变患者，第三代 EGFR-TKI 靶向辅助治疗可显著降低中枢神经系统转移与术后复发风险。");
        }

        const isEarlyLowRisk = (profile.tStage === "T1a" || profile.tStage === "T1b" || profile.stage === "IA1" || profile.stage === "IA2" || profile.stage === "IA") && (profile.nStage === "N0" || !profile.nStage) && profile.stas !== "positive" && profile.vpi !== "positive" && profile.lvi !== "positive";
        if (isEarlyLowRisk) {
          evidenceItems.push("【NCCN / CSCO / ESMO 非小细胞肺癌临床指南 (IA1/IA2期)】：IA 期患者 R0 切除后 5 年总生存率高达 98%~100%，属于 100% 物理根治；全球所有权威指南一致明确：无需任何术后辅助化疗、靶向药物或放疗，常规不推荐做驱动基因检测以指导辅助治疗。规范薄层 CT 随访即为最优解。");
          evidenceItems.push("【JCOG0804 / JCOG0802 多中心前瞻性研究 (JTO/Lancet)】：切缘阴性且无高危病理因素的早期磨玻璃 (CTR≤0.25) 及小结节患者，亚肺叶/解剖性肺段切除 5 年 RFS 超 98.2%，术后以规律随访为主，无需过度化疗。");
        }
      }
    }

    // ── Breast Cancer Evidence ──
    if (isBreast) {
      if (profile.biRads) {
        evidenceItems.push("【ACR BI-RADS 第5版临床影像管理指南】：BI-RADS 3 类恶性概率严格 <2%，推荐 3~6 个月短期随访复查；4A 类恶性率 2%~10%（90%以上为良性）；4B及以上推荐空芯针穿刺活检明确病理。");
      }
      if (profile.oncotypeDxScore != null && profile.oncotypeDxScore <= 25) {
        evidenceItems.push("【TAILORx 万人前瞻性试验 (NEJM 2018)】：早期 HR+ HER2- 淋巴结阴性患者，21 基因评分 RS 0~25 分（绝经后）单纯内分泌治疗 9 年无浸润复发生存率 93.9%，与联合化疗组毫无统计学差异，确定免除化疗。");
      }
      if (profile.molecularSubtype === "Luminal_A" || (profile.erPercent != null && profile.erPercent >= 50)) {
        evidenceItems.push("【St. Gallen 国际乳腺癌共识 / CSCO 指南】：Luminal A 型预后极佳，以规范 5~10 年内分泌治疗（他莫昔芬/芳香化酶抑制剂）为基石，早期低危患者无需化疗。");
      }
      if (profile.her2Status === "3+" || profile.her2Fish === "positive" || profile.molecularSubtype === "Luminal_B_HER2_pos" || profile.molecularSubtype === "HER2_enriched") {
        evidenceItems.push("【APHINITY 试验 (NEJM) / NCCN 指南】：抗 HER2 双靶向治疗（曲妥珠单抗+帕妥珠单抗 HP 方案）使高危淋巴结阳性患者无浸润复发风险显著降低 24% (HR=0.76)。");
      }
      const isTnbc = profile.molecularSubtype === "TNBC" || profile.molecularSubtype === "Triple_Negative" || (profile.erStatus === "negative" && profile.prStatus === "negative" && (profile.her2Status === "0" || profile.her2Status === "1+"));
      if (isTnbc) {
        evidenceItems.push("【KEYNOTE-522 万人前瞻性试验 (NEJM 2022)】：早期三阴性乳腺癌新辅助使用帕博利珠单抗 (K药) 联合化疗，病理完全缓解率 (pCR) 达 64.8%，3 年 EFS 达 84.5% (HR=0.63, 降低复发转移 37%)。");
      }
      if (profile.brca1 === "positive" || profile.brca2 === "positive") {
        evidenceItems.push("【OlympiA 国际里程碑试验 (NEJM 2021)】：伴胚系 BRCA1/2 突变高危早期患者，辅助口服 PARP 抑制剂奥拉帕利 1 年，侵袭性复发或死亡风险大幅降低 42% (HR=0.58)。");
      }
      const pcrStatus = profile.cancerSpecificData?.pcrStatus;
      if (pcrStatus === "non_pcr" || pcrStatus === "partial_response") {
        if (profile.her2Status === "3+" || profile.her2Fish === "positive") {
          evidenceItems.push("【KATHERINE 前瞻性研究 (NEJM 2019)】：新辅助后存在残存病灶 (non-pCR) 的 HER2 阳性患者，换用 ADC 药物 T-DM1 辅助治疗，复发风险断崖式降低 50% (HR=0.50)。");
        } else {
          evidenceItems.push("【CREATE-X 试验 (NEJM 2017)】：新辅助后未达 pCR 的 HER2 阴性/三阴性患者，术后加用口服卡培他滨强化 6~8 周期，三阴性亚组死亡风险降低 48% (HR=0.52)。");
        }
      }
      if ((profile.axillaryNodesPositive != null && profile.axillaryNodesPositive >= 4) || (profile.stage?.includes("III") ?? false)) {
        evidenceItems.push("【MonarchE 5年随访 (Lancet Oncol 2023)】：高危早期 HR+ HER2- 患者（腋窝淋巴结阳性≥4枚，或1-3枚伴G3/≥5cm），加用 CDK4/6 抑制剂阿贝西利 2 年使 5 年 iDFS 获益达 7.6% (HR=0.68)。");
      }
      if (profile.systemicStagingConfirmed || profile.brainMri === "negative" || profile.boneScan === "negative") {
        evidenceItems.push("【NCCN/CSCO 乳腺癌分期评估规范】：完成骨扫描、胸部/腹部超声及头颅检查确立 M0 状态，是实现手术与综合物理根治的最高基石。");
      }
    }

    const evidence = evidenceItems.join("\n\n");
    const templatePrompt = isBreast 
      ? BREAST_REPORT_PROMPT 
      : (isCtReport ? PRE_OP_CT_PROMPT : POST_OP_PROMPT);

    const SURVIVAL_HORIZON_INSTRUCTION = `
【癌种特异性生存期时序终点 (Landmark Horizons) 严谨指令 · 严禁一刀切 5 年生存率】：
临床循证分析中，必须根据该癌种权威指南的生物学规律呈现针对性时序终点：
1. 【HR+ 乳腺癌】：必须强调 10~20 年超长随访与迟发复发预防 (TAILORx 12年随访, EBCTCG 20年随访)，说明 5 年后坚持内分泌治疗的必要性；TNBC 强调 3~5 年治愈平台期；
2. 【肺癌】：早期以 5 年无病生存率 (DFS/RFS · JCOG0802/CALGB 140503) 与治愈为导向；晚期/伴高危分子突变突出无进展生存期 (PFS) 与长生存管理。
`;

    const finalPrompt = EVIDENCE_ONLY_MODEL_INSTRUCTION + "\n" + SURVIVAL_HORIZON_INSTRUCTION + "\n" + templatePrompt
      .replace("{PROFILE_JSON}", JSON.stringify(profile, null, 2))
      .replace("{EVIDENCE_BASE}", evidence);

    // Call Gemini API with streaming
    const responseStream = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
    });

    // Create a ReadableStream to stream the response back
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              const text = chunk.text;
              controller.enqueue(new TextEncoder().encode(text));
            }
          }

          // Safety Appendix
          const safetyFooter = `\n\n---\n\n> **【知癌维基 医疗免责声明与使用边界】**：\n> ${PRODUCT_SCOPE_NOTICE}\n> ${REPORT_ORGANIZATION_NOTICE}\n> 文献中的治疗、分期或预后内容仅作为一般医学背景，不代表对您的判断或建议；请携带完整原始报告向持证医务人员咨询。\n`;
          controller.enqueue(new TextEncoder().encode(safetyFooter));

          controller.close();

          logEvent({
            level: 'info',
            endpoint: '/api/generate-report',
            clientIp,
            durationMs: Date.now() - startTime,
            statusCode: 200,
            aiModel: 'gemini-2.5-flash',
            action: 'report_stream_completed',
            meta: {
              reportType: profile.reportType || 'pathology',
              stage: profile.stage || 'unknown'
            }
          });
        } catch (e: any) {
          const clinicalErr = formatClinicalAiError(e, 'generate');
          logEvent({
            level: 'error',
            endpoint: '/api/generate-report',
            clientIp,
            durationMs: Date.now() - startTime,
            error: e.message || 'Stream processing error',
            action: 'report_stream_failed'
          });
          try {
            const errorAppendix = `\n\n> ⚠️ **【${clinicalErr.title}】**\n> ${clinicalErr.message}\n${clinicalErr.suggestion ? `> \n> 💡 *行动指引*：${clinicalErr.suggestion}\n` : ''}`;
            controller.enqueue(new TextEncoder().encode(errorAppendix));
          } catch {
            // ignore if stream closed
          }
          controller.error(e);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
      }
    });
  } catch (error: any) {
    const clinicalErr = formatClinicalAiError(error, 'generate');
    const statusCode = clinicalErr.isRateLimit ? 429 : 500;
    logEvent({
      level: 'error',
      endpoint: '/api/generate-report',
      clientIp,
      durationMs: Date.now() - startTime,
      statusCode,
      error: error.message || 'Unknown server error',
      action: 'generate_report_exception'
    });
    return NextResponse.json(
      { 
        success: false, 
        error: clinicalErr.message,
        title: clinicalErr.title,
        isRateLimit: clinicalErr.isRateLimit,
        retryAfter: clinicalErr.retryAfter,
        suggestion: clinicalErr.suggestion,
        badge: clinicalErr.badge
      }, 
      { 
        status: statusCode,
        headers: clinicalErr.isRateLimit ? { 'Retry-After': String(clinicalErr.retryAfter || 60) } : undefined
      }
    );
  }
}
