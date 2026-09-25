---
name: Oncology Clinical Safety & Evidence Intelligence
description: Mandatory clinical safety guardrails, peer-reviewed evidence grounding, cancer-type prompt decoupling, DDI pharmacology verification, and PII de-identification standards across all AI agents and medical logic in OncoPath.
---

# Oncology Clinical Safety & Evidence Intelligence (肿瘤临床安全与循证防线技能)

本技能定义了 OncoPath 全栈平台（涵盖肺癌、乳腺癌、结肠癌、直肠癌、胃癌、肝癌、食管癌、甲状腺癌等 8 大实体瘤）的**临床安全红线、循证等级基准、多癌种提示词解耦规范、药理禁忌联锁机制与隐私合规要求**。

凡是涉及医学分期、临床报告生成、用药禁忌排查、生存率预测及数据持久化的 AI 协作与工程代码修改，**必须严格遵守本技能定义的全部准则**。

---

## 1. 核心安全铁律 (Clinical Hard Safety Rules)

### 1.1 严禁医学幻觉 (Zero-Hallucination & Peer-Reviewed Grounding)
- **顶刊证据链溯源**：系统内呈现的任何 5 年生存率（5-yr OS/RFS）、中位生存期（mOS/mPFS）或风险比（HR），必须具有真实顶刊前瞻队列来源（NEJM、Lancet/Lancet Oncology、JCO、JAMA/JAMA Oncology 等）。
- **四要素完备性**：所有临床队列数据必须包含以下四要素，严禁捏造或模糊推测：
  1. 试验/队列名称（如 `CheckMate-816`, `FLAURA2`, `TAILORx`, `PRODIGE 23`, `FLOT4`, `HIMALAYA`, `CROSS`, `ESTIMABL2` 等）
  2. 权威发表期刊与年份（如 `NEJM 2022`, `Lancet 2019`）
  3. 临床研究样本量 $n$（如 $n=358$, $n=716$）
  4. 明确终点指标（如 HR: 0.63, 3年 OS: 95.0%, pCR: 24.0%）
- **区间与不确定性**：临床预后推演必须告知患者群体统计学概念与个体异质性，禁止向患者做出“绝对保证”或“诊断性定论”。

### 1.2 专科上下文严格解耦与防穿模 (Strict Cancer Domain Decoupling)
- 8 大实体瘤的医学逻辑、提示词模板（System Prompts）与术语字典必须物理/逻辑隔离：
  - **肺癌独有术语**：`GGO (磨玻璃结节)`, `STAS (气腔播散)`, `VPI (脏层胸膜侵犯)`, `肺叶切除`, `EGFR 20ins`
  - **乳腺癌独有术语**：`BI-RADS`, `Luminal A/B`, `HER2-low (IHC 1+/2+)`, `21-Gene (Oncotype DX)`, `保乳手术`
  - **结直肠癌独有术语**：`CRM (环周切缘)`, `EMVI (壁外血管侵犯)`, `pMMR/dMMR`, `Watch & Wait (观察等待)`, `LARS`
  - **胃癌独有术语**：`JGCA`, `D2 根治术`, `Lauren 分型`, `Claudin 18.2`, `FLOT 方案`, `倾倒综合征`
  - **肝癌独有术语**：`CNLC 2024`, `Child-Pugh`, `MVI (微血管侵犯)`, `门脉癌栓 (VP1-VP4)`, `TACE/HAIC-FO`
  - **食管癌独有术语**：`CROSS`, `NEOCRTEC5010`, `胸段位置 (颈/胸上/中/下)`, `TEF (气管食管瘘风险)`
  - **甲状腺癌独有术语**：`ATA 2015`, `C-TIRADS`, `BRAF V600E`, `TSH 抑制治疗目标`, `碘-131 清甲`, `优甲乐`
  - **胰腺癌独有术语**：`Whipple 术`, `可切除性三分类 (可切/交界/局部进展)`, `SMV/PV 受累`, `SMA 侵犯`, `mFOLFIRINOX 方案`, `AG 方案 (白蛋白紫杉醇+吉西他滨)`, `POLO 研究`, `奥拉帕利维持`, `胰酶替代 (PERT)`, `胰腺外分泌功能不全 (PEI)`
- **红线测试**：生成非肺癌专科报告或知识库时，严禁出现任何肺癌专有概念（如在甲状腺癌报告中出现 GGO 或肺叶切除），必须通过自动化脚本 `test-guardrails.ts` 的词汇防穿模检测。

### 1.3 药理毒理与药物配伍禁忌强校验 (DDI & Pharmacology Interlocking)
所有涉及靶向药物、免疫检查点抑制剂与化疗药物的建议，必须通过双向 DDI（Drug-Drug Interaction）规则库校验：
1. **致命性危险禁忌 (`danger`) - 必须强制拦截并报警**：
   - **肺癌**：奥希替尼 / 埃克替尼 + 利福平 / 圣约翰草（CYP3A4 强诱导剂导致血药浓度暴跌、靶向治疗失效）。
   - **乳腺癌**：他莫昔芬 + 帕罗西汀 / 氟西汀（CYP2D6 强抑制剂阻断他莫昔芬转化为活性代谢产物 Endoxifen，复发风险陡增；建议替代为文拉法辛）。
   - **结直肠癌**：呋喹替尼 + 利福平（CYP3A4 诱导致血药浓度暴跌 80%）。
   - **胰腺癌**：奥拉帕利 / 厄洛替尼 + 利福平（CYP3A4 强诱导导致血药浓度暴跌 87% / 67%，抗肿瘤维持彻底失效）。
   - **胃癌 / 肝癌 / 食管癌**：抗血管小分子 TKI（阿帕替尼、仑伐替尼、安罗替尼）+ 抗凝药（华法林、利伐沙班、阿司匹林），在溃疡型病灶、门脉高压胃底食管静脉曲张背景下存在消化道大出血与食管大动脉破裂致命风险。
2. **时序协同隔离 (`caution`) - 必须给出明确服药间隔提示**：
   - **甲状腺癌**：左甲状腺素钠片（优甲乐）与碳酸钙、硫酸亚铁、铝碳酸镁或质子泵抑制剂（PPI）同服会产生络合沉淀或改变胃内 pH 阻碍吸收，必须严格间隔 **4 小时以上**，推荐清晨空腹白开水送服。
   - **胰腺癌**：厄洛替尼口服依赖胃内酸性环境，质子泵抑制剂（PPI）使胃内 pH 升高导致靶向吸收下降 46%，必须错峰 **4~10 小时** 或换用短效 H2 受体拮抗剂。

### 1.4 PIPL 个人信息保护法与不可逆去标识化 (Strict PII De-identification)
- **零真实隐私入库**：患者姓名、18 位二代身份证号、11 位大陆手机号、真实住院号/就诊卡号绝对禁止明文传输或存储。
- **脱敏格式规范**：
  - 姓名：脱敏为“张\*强”或“王\*”。
  - 身份证号：`110101********1234`（仅保留前 6 位与后 4 位）。
  - 手机号：`138****5678`。
  - 病案号：`HA-2024-****`。
- **安全加固规范**：密码存储必须采用异步 `PBKDF2`（210,000 轮加盐，派发至 Node `libuv` 线程池），会话存储使用 HMAC 防篡改签名，杜绝单线程事件循环阻塞。

---

## 2. 国际权威临床分期标准基准 (Clinical Staging Standards)

| 癌种 | 当前采用分期版本 | 关键分层决策点 | 核心防御边界与踩坑点 |
| :--- | :--- | :--- | :--- |
| **肺癌** | **IASLC 第 9 版 / AJCC 第 8 版** | 纯磨玻璃 (pGGO) vs 混杂磨玻璃 (mGGO)；实性成分直径 vs 全径；STAS 气腔播散；新辅助化免病理完全缓解 (pCR) | 磨玻璃结节分期实性成分决定 T 分期，严禁将全径直接套用浸润性 T 分期。 |
| **乳腺癌** | **AJCC 第 8/9 版** | 解剖学分期与预后综合双分期（结合 ER/PR、HER2、Ki-67 与组织学分级 Grade）；21-Gene 低危免化疗 | 预后分期中 Luminal A（高 ER/PR、HER2 阴性、低 Ki-67）即使 T2N0 仍可下调为 Stage IA；HER2 阳性术后残存需走 KATHERINE 强化。 |
| **结肠癌** | **AJCC 第 8 版** | II 期微卫星状态 (MSI-H/dMMR vs MSS/pMMR)；III 期 IDEA 协作网风险分层 (低危 T1-3N1 CAPOX 3月 vs 高危 T4/N2 6月) | dMMR 局部进展期优先推荐 NICHE-2 双免新辅助；II 期 dMMR 单纯氟尿嘧啶辅助无获益甚至有害。 |
| **直肠癌** | **AJCC 第 8 版 / NCCN 2024** | 距肛缘距离（中低位 ≤5cm）；高分辨率 MRI 环周切缘 (CRM) 与壁外血管侵犯 (EMVI)；全程新辅助治疗 (TNT) | CRM 阳性或低位保肛困难推荐 mFOLFIRINOX/CAPOX 序贯放化疗 (TNT)；达到临床完全缓解 (cCR) 可考虑 OPRA 方案“观察等待 (Watch & Wait)”。 |
| **胃癌** | **JGCA 第 15 版 / AJCC 第 8 版** | Lauren 分型（肠型 vs 弥漫型）；D2 淋巴结清扫范围；围手术期 FLOT 四周期；Claudin 18.2 / HER2 靶点 | 局部进展期（cT2-4b N+）首选围手术期 FLOT 三联化疗；晚期一线检测 HER2 与 Claudin 18.2 表达指导靶向免疫方案。 |
| **肝癌** | **国家卫健委 CNLC 2024 / BCLC** | 肝功能 Child-Pugh 分级；微血管侵犯 (MVI M0/M1/M2)；门脉主干/分支癌栓 (VP3/VP4) | 门脉主干癌栓患者优先采取 HAIC-FO 灌注联合靶免进行转化治疗；伴食管静脉曲张高出血风险者优选 HIMALAYA 双免而非抗 VEGF 药物。 |
| **食管癌** | **AJCC 第 8 版** | 组织学（鳞癌 ESCC 90%+ vs 腺癌 EAC）；解剖部位（颈段、胸上/中/下段）；CROSS / NEOCRTEC5010 新辅助同步放化疗 | 局部进展期可切除食管鳞癌标准方案为新辅助放化疗 (nCRT)；术后病理有残存病灶者规范序贯 CheckMate-577 纳武利尤单抗维持。 |
| **甲状腺癌**| **AJCC 第 8 版 / ATA 2015** | **55 岁年龄分水岭**；低危微小癌 (PTMC ≤10mm) 主动监测 (Active Surveillance)；ATA 复发风险（低/中/高危）；BRAF V600E | **AJCC 第 8 版分水岭为 55 岁（非 45 岁）**，无远处转移且年龄 <55 岁者均为 Stage I；$\ge 55$ 岁 T1/T2 N0 均为 Stage I（8版降期）；数值型参数须用 `Number.isFinite` 严格防御防 NaN。 |
| **子宫内膜癌**| **FIGO 2023 / TCGA 四分子分型** | POLE 超突变 / MSI-H / 低拷贝 CN-low / 高拷贝 p53abn；肌层浸润深度与脉管浸润 (LVSI)；PORTEC-3 辅助放化疗 | POLE 突变即使高危组织型仍属良好预后，可豁免过度放化疗；p53 异常高度恶性需系统强化。 |
| **宫颈癌** | **FIGO 2018 / NCCN 2024** | 高危型 HPV 16/18 阶梯分流；CIN 1~3 进展演变；微小浸润保宫 vs 根治性同步放化疗 (CCRT)；KEYNOTE-826 晚期一线四联靶免 | 局部晚期（IB3/IIA2~IVA）首选根治性同步放化疗 (CCRT)，严禁盲目直接开腹手术。 |

---

## 3. 医学人文与心理学沟通防线 (Communication Protocol)

1. **去恐慌化表述**：
   - 避免使用绝对绝望词汇（如“无药可救”、“随时复发”）。
   - 代之以临床循证维度的战术方案（如“规范治疗下拥有长期高质量带瘤生存机会”、“根据 KEYNOTE-811 / FLAURA2 试验，靶向免疫联合为晚期患者带来了中位生存期的数倍跃升”）。
2. **患者心理防御机制关怀**：
   - 强调肿瘤已步入**慢性病全程管理时代**。
   - 关键转折点（如新辅助未达 pCR、基因突变耐药）必须主动提示多学科会诊（MDT）与后续二线挽救靶点的科学逻辑，给予确定性心理锚点。

---

## 4. 基于 Superpowers 规范的工程验证要求 (Verification Contract)

任何对医学算法、分期逻辑、DDI 规则、报告生成提示词及档案存取的修改，**必须通过以下全套自动化验证方可合流**：

1. **类型安全性**：`npx tsc --noEmit` 保证 0 Error。
2. **单元测试网**：`npm run test:unit`（或 `npx vitest run`）保证 **29 个测试套件、438 项单元用例 100% 通过（0 失败）**。
3. **全景临床仿真**：
   - `tsx scripts/test-guardrails.ts`（护栏与专科解耦）
   - `tsx scripts/comprehensive-simulation.ts`（综合仿真）
   - `tsx scripts/exhaustive-local-simulation.ts`（7 维度 44 项仿真）
   - `tsx scripts/production-full-simulation.ts`（UI/UX 与生产审计 28 项仿真）
4. **生产构建检查**：`npm run build` 确保 Next.js 16 (Turbopack) 30 个路由打包成功，零水合错误，无废弃中间件警告。
