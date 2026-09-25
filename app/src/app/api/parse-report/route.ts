import { NextResponse } from 'next/server';
import { ai } from '@/lib/gemini';
import { computeClinicalTnmStage } from '@/lib/staging';
import { computeBreastClinicalStage } from '@/lib/breastStaging';
import { computeColorectalStage } from '@/lib/colorectalStaging';
import { computeCancerStage, normalizeCancerType } from '@/lib/stagingRegistry';
import { evaluateBiRads } from '@/lib/biRadsCalculator';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { sanitizeClinicalText } from '@/lib/privacy';
import { logEvent } from '@/lib/logger';

const SYSTEM_PROMPT = `
你是一个专业的精准肿瘤医学报告结构化解析与信息提取引擎，精通从【胸部 CT / 肺癌病理】、【乳腺超声 / 钼靶 / BI-RADS / 乳腺病理免疫组化】、【结直肠镜 / 病理】、【胃镜活检 / 胃癌病理】、【肝脏影像 / HCC】、【食管镜 / 食管癌病理】、【甲状腺超声 TI-RADS / 病理】、【子宫内膜病理 / FIGO分子分型】、【宫颈TCT / 活检 / CCRT】、【全身转移排查报告（脑MRI、腹部B超、骨扫描、PET-CT）】与【血液肿瘤标志物检验】中高精度提取客观临床数据指标。
你的任务是从患者上传的医学报告中提取关键临床客观指标，严格输出为 JSON 格式。

【第零步：智能研判癌种类型 (cancerType)】
- "breast": 报告涉及乳房、乳房钼靶、乳腺超声、BI-RADS 分级、浸润性导管癌/小叶癌、ER/PR 雌孕激素受体、HER2 免疫组化、前哨淋巴结等；
- "colorectal": 报告涉及结肠（升结肠/横结肠/降结肠/乙状结肠/盲肠）、直肠、回盲部、肠镜、距肛缘距离、MSI/MMR (MLH1/MSH2/MSH6/PMS2)、KRAS/NRAS/BRAF、环周切缘 (CRM)、肠壁外脉管侵犯 (EMVI)、肿瘤沉积 (TD/癌结节)、检出淋巴结总数/阳性数、CEA/CA19-9 等；
- "gastric": 报告涉及胃、胃窦、胃体、贲门、胃镜活检、D2根治术、HER2/Claudin 18.2、印戒细胞癌等；
- "liver": 报告涉及肝脏占位、肝细胞癌 (HCC)、CNLC分期、肝硬化、Child-Pugh、门脉癌栓 (VP/PVTT)、AFP等；
- "esophageal": 报告涉及食管、食道、胸段/颈段、鳞状细胞癌、新辅助放化疗、喉返神经淋巴结等；
- "thyroid": 报告涉及甲状腺、彩超 TI-RADS、甲状腺乳头状癌/滤泡癌、中央区清扫、BRAF、TSH、Tg/TgAb等；
- "endometrial": 报告涉及子宫内膜、子宫体、绝经后流血、肌层浸润深度、POLE、MMR/MSI、p53、高剂量孕激素保育等；
- "cervical": 报告涉及宫颈、宫颈鳞癌/腺癌、HPV持续感染、TCT/CIN/SIL、锥切切缘、宫旁浸润、顺铂增敏同步放化疗(CCRT)、近距离后装放疗等；
- "pancreatic": 报告涉及胰腺（胰头/胰体/胰尾）、胰管扩张、主胰管、壶腹部、CA19-9、Whipple术式/胰十二指肠切除、肠系膜上动脉/静脉 (SMA/SMV) 侵犯、腹腔干包裹、门静脉包裹、可切除性三分类（可切除/交界可切除/局部晚期）、BRCA1/2突变、KRAS G12D/V、mFOLFIRINOX、奥拉帕利等；
- "lung": 报告涉及双肺、肺叶、肺段、胸膜、气道、磨玻璃结节 (GGO)、实性成分、Lung-RADS、STAS、EGFR/ALK等。

【第一步：智能判断报告模态 (reportType)】
- "ct_imaging": 术前/体检胸部 CT 或乳腺超声/钼靶影像报告。
- "pathology": 术后手术标本病理组织学诊断、穿刺活检、免疫组化报告。
- "systemic_staging": 脑部 MRI、腹部/浅表超声、骨扫描 ECT、全身 PET-CT 等全身转移排查报告。
- "comprehensive": 同时包含影像、病理或全身排查的多张联合报告或出院小结。

【第二步：CT 影像学特征、主病灶与多发结节 (Multiple Nodules) 提取规则】：
1. 主病灶认定（决定分期与恶性风险的核心）：
   - 提取最大、最可疑或实性成分最高的结节作为主病灶（noduleLocation, noduleType, tumorSize, solidSize, ctr）。
   - noduleLocation: 主结节所在肺叶与肺段（例如 "右肺上叶尖段"、"左肺下叶背段"）。
   - noduleType: "mixed_ggo" (混合磨玻璃) | "pure_ggo" (纯磨玻璃) | "pure_solid" (纯实性)。
   - tumorSize: 主结节全径厘米 (例如 1.5)。
   - solidSize: CT 实性成分最大径厘米 (例如 0.8；纯磨玻璃为 0；纯实性等同于 tumorSize)。
   - ctr: 实性成分比例 (solidSize ÷ tumorSize)。
   - imagingFeatures: 恶性影像征象数组 (如 ["分叶征", "毛刺征", "胸膜牵拉征", "空泡征", "血管集束征", "磨玻璃晕征", "支气管充气征"])。
   - lungRads: 放射科 Lung-RADS 分级 (如 "3", "4A", "4B", "4X"；若未提及填 null)。
   - malignancyRisk: 恶性概率预估 ("low" | "moderate" | "high")。
   - clinicalRecommendation: 随访或手术建议。
2. 多发性结节与伴随微小结节提取 (isMultipleNodules & secondaryNodules)：
   - 若报告中提及“双肺多发结节”、“另见数个微小结节”等，设 isMultipleNodules 为 true。
   - secondaryNodules 数组提取除主病灶外的其他次要结节，每项结构为：
     { "id": "sec_1", "location": "右肺下叶", "sizeMm": 4, "type": "pure_ggo" | "solid" | "calcification", "isBenignTendency": true, "note": "微小纯磨玻璃结节，考虑炎性或良性随访" }
3. 检查日期与时序随访提取 (reportDate & followUpHistory)：
   - reportDate: 提取报告上的检查日期 (如 "2024-03-12" 或 "2024-03"；若未提及填 null)。
   - 若报告中包含了历史多次对比数据（例如“2023-05月片示6mm，2024-03月片示8mm”），请提取至 followUpHistory 数组中。

【第三步：血液肿瘤标志物提取规则 (Tumor Markers - 支持单期与多期历史对比)】：
若报告或图片中包含血液生化/肿瘤标志物化验，提取数值（若未检测或未提及填 null）：
- cea: 癌胚抗原数值 (ng/mL，例如 2.8)
- cyfra211: 细胞角蛋白19片段 (ng/mL，例如 1.9)
- nse: 神经元特异性烯醇化酶 (ng/mL，例如 12.5)
- scc: 鳞状细胞癌抗原 (ng/mL，例如 0.8)
- proGrp: 胃泌素释放肽前体 (pg/mL，例如 35.2)
- ca125: 糖类抗原 125 (U/mL，例如 15.6)
- ca199: 糖类抗原 19-9 (U/mL，例如 18.2)
- ca153: 糖类抗原 15-3 (U/mL，例如 11.4)
- ferritin: 血清铁蛋白 (ng/mL，例如 145.0)
- 若患者上传了多张不同日期的化验单照片或包含历史多次化验对比，请将每一次化验完整提取至 tumorMarkersHistory 数组中；同时将最新一次化验结果填入 tumorMarkers 中！

【第四步：全身转移排查与伴发良性病变识别规则（M0 定心丸核心）】：
- 脑部增强 MRI (brainMri): "未见异常/未见转移" ➔ "negative"; "见转移灶/占位" ➔ "positive"; 未提及 ➔ "not_performed"
- 腹部与肾上腺超声/CT (abdominalUltrasound): "未见异常" ➔ "negative"; "见肝囊肿/血管瘤/胆囊息肉/肾囊肿等良性病变" ➔ "benign_findings"; "提示可疑转移" ➔ "positive"; 未提及 ➔ "not_performed"
- 全身骨显像 ECT (boneScan): "未见异常骨代谢/骨质完整" ➔ "negative"; "见转移骨破坏" ➔ "positive"; 未提及 ➔ "not_performed"
- 颈部/锁骨上淋巴结 (neckLymphNodes): "未见肿大淋巴结" ➔ "negative"; "提示转移 (N3)" ➔ "positive"; 未提及 ➔ "not_performed"
- 全身 PET-CT (petCt): "未见远处异常高代谢" ➔ "negative"; "提示远处转移 (M1)" ➔ "positive"; 未提及 ➔ "not_performed"
- 伴发良性病变提取 (benignFindings): 字符串数组，如 ["肝囊肿", "肝内钙化灶", "胆囊息肉", "肾囊肿", "甲状腺结节TI-RADS 2类", "肺内陈旧性纤维钙化灶"]
- 全身排查确认 (systemicStagingConfirmed): 若脑部、腹部或骨扫描中有至少一项确认阴性且无任何阳性转移，设为 true。

【第五步：病理报告阴阳性与浸润测量识别规则（术后确诊报告核心，分三种临床情形）】：
- 标本大体肿瘤全径 (pathologyTumorSize): 标本大体/肉眼肿物最大径（厘米，例如 1.4）
- 镜下微观浸润大小 (pathologyInvasiveSize): 显微镜下测得的浸润成分最大径（厘米，例如 0.6）；纯原位病变填 0；若未单列浸润径填 null
- 贴壁/伏壁生长型占比 (pathologyLepidicPercent): 若报告注明了各亚型成分百分比（如“贴壁型 70% / 伏壁型 60%”），提取贴壁亚型百分比（数字，例如 70）。系统将据此折算浸润径；未提及填 null
- 病理报告模式 (pathologyReportMode):
  * "explicit": 报告明确单列了镜下浸润成分最大径
  * "percentage": 报告未单列浸润径，但注明了贴壁型/腺泡型等成分百分比
  * "unspecified": 报告未写浸润径也未写成分百分比（基层简易报告）
- 气道播散 (STAS): "未见" / "STAS (-)" ➔ "negative"; "见" / "STAS (+)" ➔ "positive"; 未提及 ➔ "negative"
- 脉管内癌栓 (LVI): "未见" / "LVI (-)" ➔ "negative"; "见" / "LVI (+)" ➔ "positive"; 未提及 ➔ "negative"
- 脏层胸膜侵犯 (VPI): "未见" / "PL0" ➔ "negative"; "突破脏层胸膜" / "PL1" / "PL2" ➔ "positive"; 未提及 ➔ "negative"
- 切缘状态 (Margin): "切缘阴性" / "切缘未见癌" / "R0" ➔ "negative"; "切缘阳性" / "R1" ➔ "positive"; 未提及 ➔ "negative"

【第六步：分子驱动基因与伴随突变识别规则 (NGS / PCR / 免疫组化)】：
- 识别常见驱动基因：EGFR (19del, L858R, 20-ins, T790M, G719X/L861Q/S768I)、ALK (EML4-ALK 融合)、KRAS (G12C 等)、ROS1、MET (14外显子跳跃/扩增)、RET、HER2、BRAF (V600E) 等。
- 识别高危伴随突变 (Co-mutations)：TP53、RB1、PIK3CA 等，设置 isComutation 为 true。
- 提取突变丰度 (abundance / VAF 如 "24.5%")。
- 提取 PD-L1 表达 (pdl1Tps)："<1%" | "1-49%" | ">=50%" | "unknown"。
- 【未做基因检测默认规则与阴性绝对排除红线（极其重要）】：
  * 【绝对禁止无报告误判全野生型】：若用户上传的是单纯 CT 报告或常规石蜡切片病理报告，且报告未提及基因检测、未做 NGS/PCR、未列出靶点检测项目，molecularTestStatus 必须严格设为 "not_tested"（未做基因检测）！绝对严禁设为 "negative"（全野生型）！
  * 遇到 ALK 阴性 (-)、ALK (D5F3) 阴性 (-)、EGFR 未检出突变/野生型、KRAS (-)、ROS1 (-) 等未检出突变或阴性的基因，绝对严禁放入 geneMutations 数组！
  * geneMutations 数组中只允许包含【明确阳性 / 检出突变 (+)】的基因！
  * 只有在报告明确记载进行了基因检测且所有靶点均为阴性/全野生型时，才将 molecularTestStatus 设为 "negative"，且 geneMutations 为 []（空数组）！
【第七步：乳腺癌专病指标提取规则 (若为乳腺相关报告)】：
- 识别病灶侧别 (breastLaterality): "left" (左乳) | "right" (右乳) | "bilateral" (双乳) | null
- 识别 BI-RADS 分级 (biRads): "1" | "2" | "3" | "4A" | "4B" | "4C" | "5" | "6"
- 钙化形态 (calcificationType): "粗大良性" | "成簇泥沙样微钙化" | "多形性分支状" | null
- 雌激素受体 (erStatus & erPercent): "positive" | "negative", 阳性百分比数字如 90
- 孕激素受体 (prStatus & prPercent): "positive" | "negative", 阳性百分比数字如 70
- HER2 状态 (her2Status & her2Fish): "0" | "1+" | "2+" | "3+"; FISH 扩增: "positive" | "negative" | "not_performed"
- 组织学 Nottingham 分级 (nottinghamGrade): "1" | "2" | "3"
- 病理类型 (histologyType): "IDC" (浸润性导管癌) | "ILC" (小叶癌) | "DCIS" (导管原位癌) | "other"
- 淋巴结计数: sentinelNodesPositive / sentinelNodesTotal (前哨); axillaryNodesPositive / axillaryNodesTotal (腋窝)
- 21 基因复发评分 (oncotypeDxScore): 数字 0~100 (若未检测填 null)
- 绝经状态 (menopauseStatus): "pre" (绝经前) | "post" (绝经后) | "peri" (围绝经期)
- 新辅助化疗与病理缓解 (neoadjuvantChemo & pcrStatus):
  * 若术前接受过新辅助化疗/靶向，neoadjuvantChemo 设为 true；
  * 病理若提示完全缓解 (ypT0/is ypN0)，pcrStatus 设为 "ypT0isN0"；若有明显退缩残留设为 "partial_response"；若未达缓解设为 "non_pcr"；若未做新辅助填 null。
- 妇科超声与骨密度评估:
  * pelvicUltrasound: "normal" | "thickened_endometrium" | "not_performed" | null (子宫内膜厚度/盆腔超声)
  * dxaScan: "normal" | "osteopenia" | "osteoporosis" | "not_performed" | null (双能X射线骨密度)
- 手术方式 (surgeryType): "lumpectomy" (保乳) | "mastectomy" (全切) | "unknown"

【第八步：结直肠癌专病指标提取规则 (若为结直肠相关报告)】：
- 原发部位 (primaryLocation): "right_colon" (右半结肠: 盲肠/升结肠/肝曲/横结肠) | "left_colon" (左半结肠: 脾曲/降结肠/乙状结肠) | "rectum" (直肠) | null
- 距肛门缘距离 (distanceFromAnalVerge): 厘米 (数字，例如 5.0，直肠癌保肛研判核心)
- 微卫星状态 (msiStatus): "MSI-H" | "MSS" | "MSI-L" | "unknown" | null
- 错配修复蛋白 (dmmrStatus): "dMMR" (MLH1/MSH2/MSH6/PMS2 表达缺失) | "pMMR" (表达正常) | null
- KRAS 基因 (krasMutation): "wildtype" (野生型) | "G12D" | "G12V" | "G12C" | "mutated" (突变型) | null
- NRAS 基因 (nrasMutation): "wildtype" | "mutated" | null
- BRAF 基因 (brafMutation): "V600E" | "wildtype" | null
- HER2 状态 (her2Amplified): true | false | null
- 环周切缘 (crmStatus & crmDistance): "negative" (阴性, 净切缘>1mm) | "positive" (阳性, 肿瘤距CRM≤1mm); crmDistance: 毫米 (例如 2.5)
- 肠壁外脉管侵犯 (emviStatus): "negative" | "positive" | null
- 癌结节/肿瘤沉积 (tumorDeposits): "present" (见癌结节/TD+) | "absent" (未见) | 数字 (如 2) | null
- 检出淋巴结总数与阳性数 (lymphNodesExamined & lymphNodesPositive): 检出总数 (必须统计，指南质控标准要求 ≥12 枚)，阳性数
- 新辅助治疗与缓解 (neoadjuvantTherapy & pcrStatus):
  * 术前放化疗/全程新辅助 TNT: neoadjuvantTherapy (true | false)
  * pcrStatus: "pCR" | "non-pCR" | null
- 组织学分化 (differentiation): "well" (高分化) | "moderate" (中分化) | "poor" (低分化/未分化)
- 肠梗阻与穿孔 (bowelObstruction, bowelPerforation): Boolean

请严格遵守以下 JSON 结构输出，不要包含任何 Markdown 标记或多余的文字：
{
  "cancerType": "lung" | "breast" | "colorectal",
  "reportType": "ct_imaging" | "pathology" | "systemic_staging" | "comprehensive",
  "primaryLocation": "right_colon" | "left_colon" | "rectum" | null,
  "distanceFromAnalVerge": Number | null,
  "msiStatus": "MSI-H" | "MSS" | "MSI-L" | "unknown" | null,
  "dmmrStatus": "dMMR" | "pMMR" | "unknown" | null,
  "krasMutation": String | null,
  "nrasMutation": String | null,
  "brafMutation": String | null,
  "her2Amplified": Boolean | null,
  "crmStatus": "negative" | "positive" | "unknown" | null,
  "crmDistance": Number | null,
  "emviStatus": "negative" | "positive" | "unknown" | null,
  "tumorDeposits": "present" | "absent" | Number | null,
  "lymphNodesExamined": Number | null,
  "lymphNodesPositive": Number | null,
  "neoadjuvantTherapy": Boolean | null,
  "bowelObstruction": Boolean | null,
  "bowelPerforation": Boolean | null,
  "differentiation": String | null,
  "reportDate": String | null,
  "noduleLocation": String | null,
  "noduleType": "mixed_ggo" | "pure_ggo" | "pure_solid" | "unknown" | null,
  "tumorSize": Number | null (若未提供CT或报告未提及结节全径，必须返回 null，严禁假造),
  "solidSize": Number | null (若未提供CT或无实性成分数据，必须返回 null),
  "ctr": Number | null (若无法计算返回 null),
  "pathologyTumorSize": Number | null (术后病理标本肿瘤大体全径厘米，例如 1.4，未做病理返回 null),
  "pathologyInvasiveSize": Number | null (镜下微观浸润成分大小厘米，例如 0.6，未做病理返回 null),
  "pathologyLepidicPercent": Number | null (贴壁/伏壁生长型占比百分比，例如 70，未做病理返回 null),
  "pathologyReportMode": "explicit" | "percentage" | "unspecified" | null,
  "imagingFeatures": ["分叶征", "毛刺征", ...],
  "lungRads": String | null,
  "biRads": String | null,
  "breastLaterality": "left" | "right" | "bilateral" | null,
  "calcificationType": String | null,
  "erStatus": "positive" | "negative" | "unknown" | null,
  "erPercent": Number | null,
  "prStatus": "positive" | "negative" | "unknown" | null,
  "prPercent": Number | null,
  "her2Status": "0" | "1+" | "2+" | "3+" | "unknown" | null,
  "her2Fish": "positive" | "negative" | "equivocal" | "not_performed" | null,
  "nottinghamGrade": "1" | "2" | "3" | null,
  "histologyType": "IDC" | "ILC" | "DCIS" | "other" | null,
  "sentinelNodesPositive": Number | null,
  "sentinelNodesTotal": Number | null,
  "axillaryNodesPositive": Number | null,
  "axillaryNodesTotal": Number | null,
  "oncotypeDxScore": Number | null,
  "menopauseStatus": "pre" | "post" | "peri" | null,
  "neoadjuvantChemo": Boolean | null,
  "pcrStatus": "ypT0isN0" | "partial_response" | "non_pcr" | null,
  "pelvicUltrasound": "normal" | "thickened_endometrium" | "not_performed" | null,
  "dxaScan": "normal" | "osteopenia" | "osteoporosis" | "not_performed" | null,
  "malignancyRisk": "low" | "moderate" | "high" | null,
  "clinicalRecommendation": String | null,
  "isMultipleNodules": Boolean,
  "secondaryNodules": [
    {
      "id": "sec_1",
      "location": "右肺下叶",
      "sizeMm": Number | null,
      "type": "pure_ggo",
      "isBenignTendency": true,
      "note": "微小纯磨玻璃灶，考虑良性/定期随访"
    }
  ],
  "followUpHistory": [
    {
      "id": "hist_1",
      "date": "2023-05-10",
      "tumorSize": 1.2,
      "solidSize": 0.4,
      "ctr": 0.33,
      "note": "初次体检发现"
    }
  ],
  "tumorMarkers": {
    "cea": Number | null,
    "cyfra211": Number | null,
    "nse": Number | null,
    "scc": Number | null,
    "proGrp": Number | null,
    "ca125": Number | null,
    "ca199": Number | null,
    "ca153": Number | null,
    "ferritin": Number | null,
    "testDate": String | null
  },
  "tumorMarkersHistory": [
    {
      "id": "tm_1",
      "testDate": "2023-05-10",
      "cea": 2.1,
      "cyfra211": 1.5,
      "nse": 10.2,
      "scc": 0.8,
      "proGrp": 32.0,
      "ca125": 14.5,
      "ca199": 16.0,
      "ca153": 12.0,
      "ferritin": 120.0,
      "note": "历史化验单"
    }
  ],
  "geneMutations": [
    {
      "id": "mut_1",
      "gene": "EGFR" | "ALK" | "KRAS" | "TP53" | "ROS1" | "MET" | "RET" | "HER2" | "BRAF" | "RB1" | "PIK3CA" | String,
      "subtype": String | null,
      "abundance": String | null,
      "isComutation": Boolean,
      "status": "positive" | "negative"
    }
  ],
  "molecularTestStatus": "tested" | "negative" | "not_tested" | "in_progress",
  "pdl1Tps": "<1%" | "1-49%" | ">=50%" | "unknown",
  "brainMri": "negative" | "positive" | "not_performed",
  "abdominalUltrasound": "negative" | "benign_findings" | "positive" | "not_performed",
  "boneScan": "negative" | "positive" | "not_performed",
  "neckLymphNodes": "negative" | "positive" | "not_performed",
  "petCt": "negative" | "positive" | "not_performed",
  "benignFindings": String[],
  "systemicStagingConfirmed": Boolean,
  "age": Number | null,
  "sex": "male" | "female" | null,
  "organ": "lung" | "breast",
  "histology": String | null,
  "tStage": "Tis" | "T1mi" | "T1a" | "T1b" | "T1c" | "T2" | "T2a" | "T2b" | "T3" | "T4" | null,
  "nStage": "N0" | "N1" | "N1a" | "N2" | "N2a" | "N2b" | "N3" | "N3a" | null,
  "adjacentLobeInvasion": Boolean | null,
  "stas": "positive" | "negative" | null,
  "vpi": "positive" | "negative" | null,
  "lvi": "positive" | "negative" | null,
  "marginStatus": "positive" | "negative" | null,
  "surgeryType": "lobectomy" | "segmentectomy" | "wedge" | "lumpectomy" | "mastectomy" | "unknown" | null,
  "grade": "1" | "2" | "3" | null,
  "ki67": Number | String | null
}
`;

export async function POST(request: Request) {
  const startTime = Date.now();
  const clientIp = getClientIp(request);

  try {
    // 1. Production Rate Limiting (10 requests per minute per IP for OCR/Multimodal parsing)
    const rateLimit = checkRateLimit(`parse_report_${clientIp}`, { intervalMs: 60 * 1000, maxRequests: 10 });
    if (!rateLimit.success) {
      logEvent({
        level: 'warn',
        endpoint: '/api/parse-report',
        clientIp,
        statusCode: 429,
        action: 'parse_rate_limit_exceeded',
        message: 'Client exceeded report parsing rate limit'
      });
      return NextResponse.json(
        { success: false, error: "解析请求过于频繁，请稍候 1 分钟后重试。" },
        { status: 429, headers: { 'Retry-After': '60' } }
      );
    }

    const { reportText, images, imageBase64, imageMimeType, cancerType: requestedCancerType } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      logEvent({
        level: 'error',
        endpoint: '/api/parse-report',
        clientIp,
        statusCode: 500,
        message: 'Missing GEMINI_API_KEY environment variable'
      });
      return NextResponse.json({ success: false, error: "系统未配置 GEMINI_API_KEY" }, { status: 500 });
    }

    // 2. Patient Privacy & PII Sanitization for raw input text
    const sanitizedReportText = reportText ? sanitizeClinicalText(reportText) : "";

    // Construct multimodal contents
    const contents: any[] = [];
    if (sanitizedReportText) {
      contents.push(sanitizedReportText);
    }
    
    // Support multiple images
    if (Array.isArray(images) && images.length > 0) {
      for (const img of images) {
        if (img.base64) {
          contents.push({
            inlineData: {
              data: img.base64,
              mimeType: img.mimeType || "image/jpeg"
            }
          });
        }
      }
    } else if (imageBase64) {
      // Backward compatibility for single image
      contents.push({
        inlineData: {
          data: imageBase64,
          mimeType: imageMimeType || "image/jpeg"
        }
      });
    }

    if (contents.length === 0) {
      return NextResponse.json({ success: false, error: "未提供任何报告内容" }, { status: 400 });
    }

    // Call Gemini API
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: 'application/json',
        temperature: 0.1,
      }
    });

    let cleanedJson = (response.text || "").trim();
    if (!cleanedJson) {
      throw new Error("模型返回为空");
    }

    // Strip markdown code fences or extract { ... } object if present
    const jsonMatch = cleanedJson.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanedJson = jsonMatch[0];
    }

    const extracted = JSON.parse(cleanedJson);

    // Precise normalization of positive/negative strings without defaulting nulls to negative
    const normalizeFlag = (val: any): "positive" | "negative" | null => {
      if (val === true || val === "positive" || val === "yes" || val === "1") return "positive";
      if (val === false || val === "negative" || val === "no" || val === "0") return "negative";
      return null;
    };

    const isCtReport = extracted.reportType === "ct_imaging";
    const stas = normalizeFlag(extracted.stas);
    const vpi = normalizeFlag(extracted.vpi);
    const lvi = normalizeFlag(extracted.lvi);
    const marginStatus = normalizeFlag(extracted.marginStatus);

    // Auto-detect or respect requested cancerType
    const isBreastHint = Boolean(
      (sanitizedReportText && /乳腺|BI-?RADS|钼靶|导管癌|小叶癌|ER\s*[\(（\:\：\+]|PR\s*[\(（\:\：\+]|HER-?2|前哨淋巴|保乳/i.test(sanitizedReportText)) ||
      extracted.cancerType === "breast" ||
      extracted.organ === "breast" ||
      extracted.biRads
    );
    const isColorectalHint = Boolean(
      (sanitizedReportText && /结肠|直肠|结直肠|回盲|回肠|降结肠|乙状结肠|升结肠|横结肠|盲肠|肠镜|KRAS|NRAS|BRAF|MSI|dMMR|pMMR|CRM|EMVI|肿瘤沉积|癌结节/i.test(sanitizedReportText)) ||
      extracted.cancerType === "colorectal" ||
      extracted.organ === "colorectal" ||
      extracted.primaryLocation
    );
    const detectedCancerType = normalizeCancerType(
      requestedCancerType || extracted.cancerType || extracted.organ,
      isBreastHint ? "breast" : (isColorectalHint ? "colorectal" : sanitizedReportText)
    );

    // Compute Breast Staging if breast cancer
    const rawTumorSize = extracted.tumorSize != null && !isNaN(Number(extracted.tumorSize)) 
      ? Number(extracted.tumorSize) 
      : (extracted.pathologyTumorSize != null && !isNaN(Number(extracted.pathologyTumorSize)) ? Number(extracted.pathologyTumorSize) : null);

    const breastStaging = detectedCancerType === "breast" 
      ? computeBreastClinicalStage({
          tumorSize: rawTumorSize,
          tStage: extracted.tStage || null,
          nStage: extracted.nStage || null,
          mStage: extracted.mStage || null,
          erStatus: extracted.erStatus || null,
          erPercent: extracted.erPercent != null && !isNaN(Number(extracted.erPercent)) ? Number(extracted.erPercent) : null,
          prStatus: extracted.prStatus || null,
          prPercent: extracted.prPercent != null && !isNaN(Number(extracted.prPercent)) ? Number(extracted.prPercent) : null,
          her2Status: extracted.her2Status || null,
          her2Fish: extracted.her2Fish || null,
          her2Low: extracted.her2Status === "1+" || (extracted.her2Status === "2+" && extracted.her2Fish === "negative"),
          ki67: extracted.ki67 != null && !isNaN(Number(extracted.ki67)) ? Number(extracted.ki67) : null,
          grade: extracted.nottinghamGrade || extracted.grade || null,
          histologyType: extracted.histologyType || null,
          oncotypeDxScore: extracted.oncotypeDxScore != null && !isNaN(Number(extracted.oncotypeDxScore)) ? Number(extracted.oncotypeDxScore) : null,
          menopauseStatus: extracted.menopauseStatus || null,
          sentinelNodesPositive: extracted.sentinelNodesPositive != null ? Number(extracted.sentinelNodesPositive) : null,
          sentinelNodesTotal: extracted.sentinelNodesTotal != null ? Number(extracted.sentinelNodesTotal) : null,
          axillaryNodesPositive: extracted.axillaryNodesPositive != null ? Number(extracted.axillaryNodesPositive) : null,
          axillaryNodesTotal: extracted.axillaryNodesTotal != null ? Number(extracted.axillaryNodesTotal) : null,
          neoadjuvantChemo: extracted.neoadjuvantChemo ?? null,
          pcrStatus: extracted.pcrStatus || null,
        })
      : null;

    // Compute Colorectal Staging if colorectal cancer
    const colorectalStaging = detectedCancerType === "colorectal"
      ? computeColorectalStage({
          tStage: extracted.tStage || null,
          nStage: extracted.nStage || null,
          mStage: extracted.mStage || null,
          primaryLocation: extracted.primaryLocation || null,
          distanceFromAnalVerge: extracted.distanceFromAnalVerge != null && !isNaN(Number(extracted.distanceFromAnalVerge)) ? Number(extracted.distanceFromAnalVerge) : null,
          lymphNodesExamined: extracted.lymphNodesExamined != null && !isNaN(Number(extracted.lymphNodesExamined)) ? Number(extracted.lymphNodesExamined) : null,
          lymphNodesPositive: extracted.lymphNodesPositive != null && !isNaN(Number(extracted.lymphNodesPositive)) ? Number(extracted.lymphNodesPositive) : null,
          tumorDeposits: extracted.tumorDeposits || null,
          msiStatus: extracted.msiStatus || null,
          dmmrStatus: extracted.dmmrStatus || null,
          krasMutation: extracted.krasMutation || null,
          nrasMutation: extracted.nrasMutation || null,
          brafMutation: extracted.brafMutation || null,
          her2Amplified: extracted.her2Amplified ?? null,
          crmStatus: extracted.crmStatus || null,
          crmDistance: extracted.crmDistance != null && !isNaN(Number(extracted.crmDistance)) ? Number(extracted.crmDistance) : null,
          emviStatus: extracted.emviStatus || null,
          neoadjuvantTherapy: extracted.neoadjuvantTherapy ?? null,
          pcrStatus: extracted.pcrStatus || null,
          bowelObstruction: extracted.bowelObstruction ?? null,
          bowelPerforation: extracted.bowelPerforation ?? null,
          differentiation: extracted.differentiation || null,
          histologyType: extracted.histologyType || null,
        })
      : null;

    const biRadsAssessment = detectedCancerType === "breast" && extracted.biRads ? evaluateBiRads(extracted.biRads) : null;

    const rawPathologyTumor = extracted.pathologyTumorSize != null && !isNaN(Number(extracted.pathologyTumorSize)) ? Number(extracted.pathologyTumorSize) : null;
    const rawLepidicPct = extracted.pathologyLepidicPercent != null && !isNaN(Number(extracted.pathologyLepidicPercent)) ? Number(extracted.pathologyLepidicPercent) : null;
    let rawPathologyInvasive = extracted.pathologyInvasiveSize != null && !isNaN(Number(extracted.pathologyInvasiveSize)) ? Number(extracted.pathologyInvasiveSize) : null;
    if (rawPathologyInvasive == null && rawLepidicPct != null) {
      const gross = rawPathologyTumor || (extracted.tumorSize != null && !isNaN(Number(extracted.tumorSize)) ? Number(extracted.tumorSize) : null);
      if (gross != null && gross > 0) {
        rawPathologyInvasive = Math.max(0, Math.round(gross * (1 - rawLepidicPct / 100) * 100) / 100);
      }
    }

    const rawTumor = extracted.tumorSize != null && !isNaN(Number(extracted.tumorSize)) && Number(extracted.tumorSize) > 0 ? Number(extracted.tumorSize) : null;
    const rawSolid = extracted.solidSize != null && !isNaN(Number(extracted.solidSize)) ? Number(extracted.solidSize) : (isCtReport && extracted.noduleType === "pure_ggo" ? 0 : null);
    const rawCtr = extracted.ctr != null && !isNaN(Number(extracted.ctr)) ? Number(extracted.ctr) : (rawTumor != null && rawSolid != null && rawTumor > 0 ? Math.min(1, Math.round((rawSolid / rawTumor) * 100) / 100) : null);

    const pathologyReportMode = extracted.pathologyReportMode || (
      rawLepidicPct != null ? "percentage" : (rawPathologyInvasive != null ? "explicit" : "unspecified")
    );

    // Compute accurate TNM Stage using IASLC / AJCC 第 9 版 (2024) Solid Component Formula (if lung)
    const stagingCalc = detectedCancerType === "lung" 
      ? computeClinicalTnmStage({
          noduleType: extracted.noduleType || (rawTumor != null ? "mixed_ggo" : "unknown"),
          tumorSize: rawTumor,
          solidSize: rawSolid,
          ctr: rawCtr,
          pathologyTumorSize: rawPathologyTumor,
          pathologyInvasiveSize: rawPathologyInvasive,
          pathologyLepidicPercent: rawLepidicPct,
          pathologyReportMode: pathologyReportMode,
          tStage: extracted.tStage || null,
          nStage: extracted.nStage || "N0",
          vpi: vpi,
          adjacentLobeInvasion: extracted.adjacentLobeInvasion || false,
          stas: stas,
          lvi: lvi,
          marginStatus: marginStatus,
        })
      : null;

    // Unified Staging computation across all 10 clinical cancer types
    const unifiedStaging = computeCancerStage(detectedCancerType, {
      ...extracted,
      tumorSize: rawTumorSize ?? rawTumor,
      solidSize: rawSolid,
      ctr: rawCtr,
      pathologyTumorSize: rawPathologyTumor,
      pathologyInvasiveSize: rawPathologyInvasive,
      pathologyLepidicPercent: rawLepidicPct,
      pathologyReportMode: pathologyReportMode,
      tStage: extracted.tStage || null,
      nStage: extracted.nStage || "N0",
      mStage: extracted.mStage || "M0",
      vpi,
      adjacentLobeInvasion: extracted.adjacentLobeInvasion || false,
      stas,
      lvi,
      marginStatus,
    });

    // Determine State Engine stage & dynamic actions based on report modality & cancerType
    let currentStage = "post_op";
    let riskLevel = "low";
    let nextAction = "";
    let psychState = "understanding";

    if (detectedCancerType === "breast") {
      const isBiRadsReport = Boolean(extracted.biRads) && !extracted.pathologyTumorSize;
      if (isBiRadsReport) {
        currentStage = "evaluation";
        riskLevel = biRadsAssessment?.riskLevel === "safe" ? "low" : (biRadsAssessment?.riskLevel === "high" || biRadsAssessment?.riskLevel === "confirmed" ? "high" : "moderate");
        psychState = riskLevel === "high" ? "fear" : "understanding";
        nextAction = biRadsAssessment?.actionGuidance || "建议结合钼靶与高频超声互查或穿刺活检明确病理。";
      } else {
        currentStage = "post_op";
        const isLowRiskBreast = unifiedStaging?.stage === "IA" || unifiedStaging?.stage === "0" || unifiedStaging?.isDownstagedByGenomics;
        riskLevel = isLowRiskBreast ? "low" : (unifiedStaging?.stage?.startsWith("III") ? "high" : "moderate");
        psychState = riskLevel === "low" ? "hopeful" : "understanding";
        nextAction = unifiedStaging?.treatmentDirection || "建议遵医嘱按期复查并开展规范化内分泌/靶向等个体化治疗。";
      }
    } else if (detectedCancerType === "colorectal" || detectedCancerType === "colon" || detectedCancerType === "rectal") {
      const isPreOpCrc = (extracted.reportType === "ct_imaging" || extracted.reportType === "colonoscopy") && !extracted.pathologyTumorSize && !extracted.tStage;
      if (isPreOpCrc) {
        currentStage = "evaluation";
        riskLevel = extracted.malignancyRisk || "moderate";
        psychState = riskLevel === "high" ? "fear" : "understanding";
        nextAction = extracted.clinicalRecommendation || "建议结合肠镜病理活检、盆腔高分辨 MRI 及胸腹增强 CT 完善多学科术前评估。";
      } else {
        currentStage = "post_op";
        const isEarlySafeCrc = (unifiedStaging?.stage === "0" || unifiedStaging?.stage === "I" || (unifiedStaging?.stage === "IIA" && extracted.dmmrStatus === "dMMR"));
        riskLevel = isEarlySafeCrc ? "low" : (unifiedStaging?.stage?.startsWith("III") || unifiedStaging?.stage?.startsWith("IV") ? "high" : "moderate");
        psychState = isEarlySafeCrc ? "hopeful" : (riskLevel === "high" ? "decision" : "understanding");
        nextAction = unifiedStaging?.treatmentDirection || "建议遵医嘱开展多学科综合评估与规范随访治疗。";
      }
    } else if (detectedCancerType === "endometrial") {
      currentStage = "post_op";
      const isLowRiskEc = unifiedStaging?.stage === "IA" || unifiedStaging?.stage?.includes("POLEmut");
      riskLevel = isLowRiskEc ? "low" : (unifiedStaging?.stage?.startsWith("III") || unifiedStaging?.stage?.startsWith("IV") || unifiedStaging?.stage?.includes("p53abn") ? "high" : "moderate");
      psychState = isLowRiskEc ? "hopeful" : (riskLevel === "high" ? "decision" : "understanding");
      nextAction = unifiedStaging?.treatmentDirection || "建议遵照 FIGO 2023 分子分型指南规范随访或行辅助治疗。";
    } else if (detectedCancerType === "cervical") {
      currentStage = "post_op";
      const isLocallyAdvanced = unifiedStaging?.stage?.startsWith("IB3") || unifiedStaging?.stage?.startsWith("II") || unifiedStaging?.stage?.startsWith("III");
      riskLevel = unifiedStaging?.stage?.startsWith("IA") ? "low" : (isLocallyAdvanced ? "high" : "moderate");
      psychState = riskLevel === "low" ? "hopeful" : (riskLevel === "high" ? "decision" : "understanding");
      nextAction = unifiedStaging?.treatmentDirection || "建议遵医嘱规范开展同步放化疗 (CCRT) 或开腹术后随访。";
    } else if (detectedCancerType === "pancreatic") {
      const isResectable = extracted.resectabilityStatus === "resectable" || unifiedStaging?.stage === "I" || unifiedStaging?.stage === "IA" || unifiedStaging?.stage === "IB";
      currentStage = extracted.resectabilityStatus === "borderline_resectable" || extracted.resectabilityStatus === "locally_advanced" ? "peri_op" : "post_op";
      riskLevel = isResectable ? "moderate" : "high";
      psychState = isResectable ? "hopeful" : "decision";
      nextAction = unifiedStaging?.treatmentDirection || "建议由肝胆胰外科与肿瘤内科开展 MDT 多学科会诊，明确血管可切除性与转化化疗策略。";
    } else if (detectedCancerType === "gastric") {
      currentStage = "post_op";
      const isEarlyGastric = unifiedStaging?.stage === "I" || unifiedStaging?.stage === "IA";
      riskLevel = isEarlyGastric ? "low" : (unifiedStaging?.stage?.startsWith("III") || unifiedStaging?.stage?.startsWith("IV") ? "high" : "moderate");
      psychState = isEarlyGastric ? "hopeful" : (riskLevel === "high" ? "decision" : "understanding");
      nextAction = unifiedStaging?.treatmentDirection || "建议根据 D2 根治切除病理评估辅助化疗或靶向治疗方案。";
    } else if (detectedCancerType === "liver") {
      currentStage = "post_op";
      const isEarlyLiver = unifiedStaging?.stage === "Ia" || unifiedStaging?.cnlcStage === "Ia";
      riskLevel = isEarlyLiver ? "low" : "high";
      psychState = isEarlyLiver ? "hopeful" : "decision";
      nextAction = unifiedStaging?.treatmentDirection || "建议评估肝功能储备 (Child-Pugh) 并长期维持抗乙肝病毒治疗。";
    } else if (detectedCancerType === "esophageal") {
      currentStage = "post_op";
      riskLevel = unifiedStaging?.stage?.startsWith("I") ? "low" : "high";
      psychState = riskLevel === "low" ? "hopeful" : "decision";
      nextAction = unifiedStaging?.treatmentDirection || "建议评估新辅助放化疗缓解度与术后巩固治疗。";
    } else if (detectedCancerType === "thyroid") {
      currentStage = "post_op";
      riskLevel = unifiedStaging?.stage === "I" ? "low" : "moderate";
      psychState = "hopeful";
      nextAction = unifiedStaging?.treatmentDirection || "建议遵医嘱规范空腹服用优甲乐并设定个体化 TSH 抑制目标。";
    } else {
      if (isCtReport) {
        currentStage = "evaluation"; // Pre-op CT Evaluation Stage
        riskLevel = extracted.malignancyRisk || "moderate";
        psychState = riskLevel === "high" ? "fear" : "understanding";
        nextAction = extracted.clinicalRecommendation || (
          riskLevel === "high" 
            ? "CT 显示结节具有恶性浸润特征，建议尽早至三甲胸外科门诊进行多学科会诊，评估胸腔镜解剖性肺段/肺叶切除微创手术。"
            : "当前结节恶性度较低或处于早期随访范围。建议遵照 Fleischner 指南于 3~6 个月后复查薄层胸部 CT，对比结节大小与密度变化。"
        );
      } else {
        currentStage = "post_op"; // Post-op Pathology Stage
        const hasHighRiskPathology = stas === "positive" || vpi === "positive" || lvi === "positive" || (unifiedStaging ? unifiedStaging.nStage !== "N0" : false);
        riskLevel = hasHighRiskPathology ? "moderate" : "low";
        psychState = hasHighRiskPathology ? "decision" : "understanding";
        nextAction = unifiedStaging && (unifiedStaging.stage === "IA1" || unifiedStaging.stage === "IA2") && !hasHighRiskPathology
          ? "根据 NCCN/CSCO 国际指南，极早期 IA1/IA2 完整切除后 5 年生存率 >98%，指南一致公认无需任何术后化疗或靶向药。建议遵医嘱每 6~12 个月规律随访复查胸部 CT 即可。"
          : "病理存在中高危因素或淋巴结受累。建议尽早送检驱动基因检测 (EGFR/ALK 等)，并携完整病理切片前往胸外科或肿瘤内科门诊，评估是否启动辅助靶向治疗（如奥希替尼）或辅助化疗。";
      }
    }

    // Process Multiple Nodules
    const isMultipleNodules = Boolean(extracted.isMultipleNodules || (Array.isArray(extracted.secondaryNodules) && extracted.secondaryNodules.length > 0));
    const secondaryNodules = Array.isArray(extracted.secondaryNodules) ? extracted.secondaryNodules.map((sec: any, idx: number) => ({
      id: sec.id || `sec_${idx + 1}`,
      location: sec.location || "伴随结节",
      sizeMm: sec.sizeMm != null && !isNaN(Number(sec.sizeMm)) ? parseFloat(String(sec.sizeMm)) : null,
      type: sec.type || "pure_ggo",
      isBenignTendency: sec.isBenignTendency ?? true,
      imagingFeatures: Array.isArray(sec.imagingFeatures) ? sec.imagingFeatures : [],
      note: sec.note || "微小结节，考虑良性或随访"
    })) : [];

    // Process Follow-up History
    const followUpHistory = Array.isArray(extracted.followUpHistory) ? extracted.followUpHistory.map((hist: any, idx: number) => ({
      id: hist.id || `hist_${idx + 1}`,
      date: hist.date || new Date().toISOString().split('T')[0],
      tumorSize: hist.tumorSize != null && !isNaN(Number(hist.tumorSize)) ? parseFloat(String(hist.tumorSize)) : (stagingCalc?.tumorSize ?? rawTumor),
      solidSize: hist.solidSize != null && !isNaN(Number(hist.solidSize)) ? parseFloat(String(hist.solidSize)) : (stagingCalc?.solidSize ?? rawSolid),
      ctr: hist.ctr != null && !isNaN(Number(hist.ctr)) ? parseFloat(String(hist.ctr)) : (stagingCalc?.ctr ?? rawCtr),
      noduleType: hist.noduleType || stagingCalc?.noduleType || extracted.noduleType || "unknown",
      lungRads: hist.lungRads || extracted.lungRads || null,
      note: hist.note || ""
    })) : [];

    // Process Tumor Markers
    const rawTm = extracted.tumorMarkers || {};
    const tumorMarkers = {
      cea: rawTm.cea !== undefined && rawTm.cea !== null && rawTm.cea !== "" ? parseFloat(String(rawTm.cea)) : null,
      cyfra211: rawTm.cyfra211 !== undefined && rawTm.cyfra211 !== null && rawTm.cyfra211 !== "" ? parseFloat(String(rawTm.cyfra211)) : null,
      nse: rawTm.nse !== undefined && rawTm.nse !== null && rawTm.nse !== "" ? parseFloat(String(rawTm.nse)) : null,
      scc: rawTm.scc !== undefined && rawTm.scc !== null && rawTm.scc !== "" ? parseFloat(String(rawTm.scc)) : null,
      proGrp: rawTm.proGrp !== undefined && rawTm.proGrp !== null && rawTm.proGrp !== "" ? parseFloat(String(rawTm.proGrp)) : null,
      ca125: rawTm.ca125 !== undefined && rawTm.ca125 !== null && rawTm.ca125 !== "" ? parseFloat(String(rawTm.ca125)) : null,
      ca199: rawTm.ca199 !== undefined && rawTm.ca199 !== null && rawTm.ca199 !== "" ? parseFloat(String(rawTm.ca199)) : null,
      ca153: rawTm.ca153 !== undefined && rawTm.ca153 !== null && rawTm.ca153 !== "" ? parseFloat(String(rawTm.ca153)) : null,
      ferritin: rawTm.ferritin !== undefined && rawTm.ferritin !== null && rawTm.ferritin !== "" ? parseFloat(String(rawTm.ferritin)) : null,
      testDate: rawTm.testDate || extracted.reportDate || null,
      note: rawTm.note || null
    };

    const safeData = {
      reportType: extracted.reportType || "ct_imaging",
      reportDate: extracted.reportDate || null,
      noduleLocation: extracted.noduleLocation || "肺叶结节",
      imagingFeatures: Array.isArray(extracted.imagingFeatures) ? extracted.imagingFeatures : [],
      lungRads: extracted.lungRads || null,
      malignancyRisk: extracted.malignancyRisk || "moderate",
      clinicalRecommendation: extracted.clinicalRecommendation || nextAction,

      // P0-1 Multiple Nodules
      isMultipleNodules,
      secondaryNodules,

      // P0-2 Follow-up History
      followUpHistory,

      // P2-2 Tumor Markers
      tumorMarkers,

      // Molecular & Gene Mutations (Strict sanitization to eliminate false-positive negative flags)
      geneMutations: (() => {
        const rawList = Array.isArray(extracted.geneMutations) ? extracted.geneMutations : [];
        return rawList.filter((m: any) => {
          if (!m || !m.gene) return false;
          const statusStr = String(m.status || "").trim().toLowerCase();
          const subtypeStr = String(m.subtype || "").trim();
          if (statusStr === "negative" || statusStr === "-" || statusStr === "no") return false;
          if (subtypeStr.includes("阴性") || subtypeStr.includes("未见") || subtypeStr.includes("野生") || subtypeStr === "-" || subtypeStr === "(-)") return false;
          return true;
        }).map((m: any, idx: number) => ({
          id: m.id || `mut_${idx + 1}`,
          gene: String(m.gene).trim().toUpperCase(),
          subtype: m.subtype ? String(m.subtype).trim() : null,
          abundance: m.abundance ? String(m.abundance).trim() : null,
          isComutation: Boolean(m.isComutation || ["TP53", "RB1", "PIK3CA"].includes(String(m.gene).trim().toUpperCase())),
          status: "positive"
        }));
      })(),
      molecularTestStatus: (() => {
        const rawList = Array.isArray(extracted.geneMutations) ? extracted.geneMutations : [];
        const positiveList = rawList.filter((m: any) => {
          if (!m || !m.gene) return false;
          const statusStr = String(m.status || "").trim().toLowerCase();
          const subtypeStr = String(m.subtype || "").trim();
          if (statusStr === "negative" || statusStr === "-" || statusStr === "no") return false;
          if (subtypeStr.includes("阴性") || subtypeStr.includes("未见") || subtypeStr.includes("野生") || subtypeStr === "-" || subtypeStr === "(-)") return false;
          return true;
        });
        if (positiveList.length > 0) return "tested";
        
        // Strict guard: if report does NOT genuinely mention gene testing, default strictly to "not_tested"
        const reportContent = (reportText || "").toLowerCase();
        const hasExplicitGeneTesting = /基因|突变|egfr|alk|ros1|kras|ngs|pcr|野生型|扩增|融合|全外显子|二代测序|靶向|分子病理/i.test(reportContent);
        if (extracted.molecularTestStatus === "negative") {
          if (hasExplicitGeneTesting || (rawList.length > 0 && positiveList.length === 0)) {
            return "negative";
          }
        }
        if (extracted.molecularTestStatus === "in_progress") return "in_progress";
        return "not_tested";
      })(),
      molecular: (() => {
        const rawList = Array.isArray(extracted.geneMutations) ? extracted.geneMutations : [];
        const positiveList = rawList.filter((m: any) => {
          if (!m || !m.gene) return false;
          const statusStr = String(m.status || "").trim().toLowerCase();
          const subtypeStr = String(m.subtype || "").trim();
          if (statusStr === "negative" || statusStr === "-" || statusStr === "no") return false;
          if (subtypeStr.includes("阴性") || subtypeStr.includes("未见") || subtypeStr.includes("野生") || subtypeStr === "-" || subtypeStr === "(-)") return false;
          return true;
        }).map((m: any, idx: number) => ({
          id: m.id || `mut_${idx + 1}`,
          gene: String(m.gene).trim().toUpperCase(),
          subtype: m.subtype ? String(m.subtype).trim() : null,
          abundance: m.abundance ? String(m.abundance).trim() : null,
          isComutation: Boolean(m.isComutation || ["TP53", "RB1", "PIK3CA"].includes(String(m.gene).trim().toUpperCase())),
          status: "positive"
        }));
        const reportContent = (reportText || "").toLowerCase();
        const hasExplicitGeneTesting = /基因|突变|egfr|alk|ros1|kras|ngs|pcr|野生型|扩增|融合|全外显子|二代测序|靶向|分子病理/i.test(reportContent);
        const status = positiveList.length > 0 
          ? "tested" 
          : (extracted.molecularTestStatus === "negative" && (hasExplicitGeneTesting || rawList.length > 0) ? "negative" : "not_tested");
        return {
          testStatus: status,
          testMethod: "NGS_panel",
          mutations: positiveList,
          pdl1Tps: extracted.pdl1Tps || "unknown"
        };
      })(),
      pdl1Tps: extracted.pdl1Tps || undefined,
      egfr: (() => {
        const rawList = Array.isArray(extracted.geneMutations) ? extracted.geneMutations : [];
        const hasPositiveEgfr = rawList.some((m: any) => {
          if (String(m.gene).toUpperCase() !== "EGFR") return false;
          const statusStr = String(m.status || "").trim().toLowerCase();
          const subtypeStr = String(m.subtype || "").trim();
          if (statusStr === "negative" || statusStr === "-" || statusStr === "no") return false;
          if (subtypeStr.includes("阴性") || subtypeStr.includes("未见") || subtypeStr.includes("野生") || subtypeStr === "-" || subtypeStr === "(-)") return false;
          return true;
        });
        if (hasPositiveEgfr) return "positive";
        const reportContent = (reportText || "").toLowerCase();
        const hasExplicitGeneTesting = /基因|突变|egfr|alk|ros1|kras|ngs|pcr|野生型|扩增|融合|全外显子|二代测序|靶向|分子病理/i.test(reportContent);
        if (extracted.molecularTestStatus === "negative" && (hasExplicitGeneTesting || rawList.length > 0)) {
          return "negative";
        }
        return "not_tested";
      })(),

      age: extracted.age != null && !isNaN(Number(extracted.age)) ? Number(extracted.age) : null,
      sex: extracted.sex || null,
      gender: extracted.sex || null,
      cancerType: detectedCancerType,
      organ: detectedCancerType,
      histology: extracted.histology || extracted.histologyType || null,
      stage: unifiedStaging?.stage || (detectedCancerType === "breast" ? (breastStaging?.stage || "IA") : (detectedCancerType === "colorectal" ? (colorectalStaging?.stage || "I") : (stagingCalc?.stage || "IA1"))),
      prognosticStage: unifiedStaging?.prognosticStage || breastStaging?.prognosticStage,
      anatomicalStage: unifiedStaging?.anatomicalStage || breastStaging?.anatomicalStage,
      molecularSubtype: unifiedStaging?.molecularSubtype || breastStaging?.molecularSubtype,
      stageExplanation: unifiedStaging?.explanation || (detectedCancerType === "breast" ? (breastStaging?.explanation || "") : (detectedCancerType === "colorectal" ? (colorectalStaging?.explanation || "") : (stagingCalc?.explanation || ""))),
      tStage: unifiedStaging?.tStage || (detectedCancerType === "breast" ? (breastStaging?.tStage || "T1c") : (detectedCancerType === "colorectal" ? (colorectalStaging?.tStage || "T1") : (stagingCalc?.tStage || "T1a"))),
      nStage: unifiedStaging?.nStage || (detectedCancerType === "breast" ? (breastStaging?.nStage || "N0") : (detectedCancerType === "colorectal" ? (colorectalStaging?.nStage || "N0") : (stagingCalc?.nStage || "N0"))),
      mStage: unifiedStaging?.mStage || (detectedCancerType === "breast" ? (breastStaging?.mStage || "M0") : (detectedCancerType === "colorectal" ? (colorectalStaging?.mStage || "M0") : (stagingCalc?.mStage || "M0"))),

      // Breast Cancer Specific Fields
      biRads: extracted.biRads || null,
      biRadsAssessment: biRadsAssessment || null,
      calcificationType: extracted.calcificationType || null,
      erStatus: extracted.erStatus || null,
      erPercent: extracted.erPercent != null && !isNaN(Number(extracted.erPercent)) ? Number(extracted.erPercent) : null,
      prStatus: extracted.prStatus || null,
      prPercent: extracted.prPercent != null && !isNaN(Number(extracted.prPercent)) ? Number(extracted.prPercent) : null,
      her2Status: extracted.her2Status || null,
      her2Fish: extracted.her2Fish || null,
      her2Low: extracted.her2Status === "1+" || (extracted.her2Status === "2+" && extracted.her2Fish === "negative"),
      nottinghamGrade: extracted.nottinghamGrade || extracted.grade || null,
      histologyType: extracted.histologyType || null,
      oncotypeDxScore: extracted.oncotypeDxScore != null && !isNaN(Number(extracted.oncotypeDxScore)) ? Number(extracted.oncotypeDxScore) : null,
      sentinelNodesPositive: extracted.sentinelNodesPositive != null && !isNaN(Number(extracted.sentinelNodesPositive)) ? Number(extracted.sentinelNodesPositive) : null,
      sentinelNodesTotal: extracted.sentinelNodesTotal != null && !isNaN(Number(extracted.sentinelNodesTotal)) ? Number(extracted.sentinelNodesTotal) : null,
      axillaryNodesPositive: extracted.axillaryNodesPositive != null && !isNaN(Number(extracted.axillaryNodesPositive)) ? Number(extracted.axillaryNodesPositive) : null,
      axillaryNodesTotal: extracted.axillaryNodesTotal != null && !isNaN(Number(extracted.axillaryNodesTotal)) ? Number(extracted.axillaryNodesTotal) : null,
      menopauseStatus: extracted.menopauseStatus || null,
      neoadjuvantChemo: extracted.neoadjuvantChemo ?? null,
      pcrStatus: extracted.pcrStatus || null,
      cancerSpecificData: detectedCancerType === "breast" ? {
        breastLaterality: extracted.breastLaterality || null,
        pcrStatus: extracted.pcrStatus || null,
        neoadjuvantChemo: extracted.neoadjuvantChemo ?? null,
        pelvicUltrasound: extracted.pelvicUltrasound || null,
        dxaScan: extracted.dxaScan || null,
      } : detectedCancerType === "colorectal" ? {
        primaryLocation: extracted.primaryLocation || null,
        distanceFromAnalVerge: extracted.distanceFromAnalVerge != null && !isNaN(Number(extracted.distanceFromAnalVerge)) ? Number(extracted.distanceFromAnalVerge) : null,
        msiStatus: extracted.msiStatus || null,
        dmmrStatus: extracted.dmmrStatus || null,
        krasMutation: extracted.krasMutation || null,
        nrasMutation: extracted.nrasMutation || null,
        brafMutation: extracted.brafMutation || null,
        her2Amplified: extracted.her2Amplified ?? null,
        crmStatus: extracted.crmStatus || null,
        crmDistance: extracted.crmDistance != null && !isNaN(Number(extracted.crmDistance)) ? Number(extracted.crmDistance) : null,
        emviStatus: extracted.emviStatus || null,
        tumorDeposits: extracted.tumorDeposits || null,
        lymphNodesExamined: extracted.lymphNodesExamined != null && !isNaN(Number(extracted.lymphNodesExamined)) ? Number(extracted.lymphNodesExamined) : null,
        lymphNodesPositive: extracted.lymphNodesPositive != null && !isNaN(Number(extracted.lymphNodesPositive)) ? Number(extracted.lymphNodesPositive) : null,
        neoadjuvantTherapy: extracted.neoadjuvantTherapy ?? null,
        pcrStatus: extracted.pcrStatus || null,
        differentiation: extracted.differentiation || null,
        histologyType: extracted.histologyType || null,
        bowelObstruction: extracted.bowelObstruction ?? null,
        bowelPerforation: extracted.bowelPerforation ?? null,
      } : {
        breastLaterality: null,
        pcrStatus: null,
        neoadjuvantChemo: null,
        pelvicUltrasound: null,
        dxaScan: null,
      },

      // Lung & Colorectal Specific Fields
      noduleType: stagingCalc ? stagingCalc.noduleType : (detectedCancerType === "breast" ? "breast_mass" : (detectedCancerType === "colorectal" ? "colorectal_mass" : "mixed_ggo")),
      morphology: stagingCalc ? stagingCalc.noduleType : null,
      tumorSize: detectedCancerType === "breast" || detectedCancerType === "colorectal" ? rawTumorSize : (stagingCalc ? stagingCalc.tumorSize : rawTumor),
      solidSize: stagingCalc ? stagingCalc.solidSize : null,
      ctr: stagingCalc ? stagingCalc.ctr : null,
      pathologyTumorSize: stagingCalc ? stagingCalc.pathologyTumorSize : rawPathologyTumor,
      pathologyInvasiveSize: stagingCalc ? stagingCalc.pathologyInvasiveSize : rawPathologyInvasive,
      pathologyLepidicPercent: stagingCalc ? stagingCalc.pathologyLepidicPercent : null,
      pathologyReportMode: stagingCalc ? stagingCalc.pathologyReportMode : null,

      stas: stas,
      vpi: vpi,
      lvi: lvi,
      marginStatus: marginStatus,
      margin: marginStatus,
      surgeryType: extracted.surgeryType || "unknown",
      grade: extracted.grade || extracted.nottinghamGrade || null,
      iaslcGrade: extracted.grade || null,
      ki67: extracted.ki67 || null,
      
      // Systemic Staging & M0 Confirmation
      brainMri: extracted.brainMri || "not_performed",
      abdominalUltrasound: extracted.abdominalUltrasound || "not_performed",
      boneScan: extracted.boneScan || "not_performed",
      neckLymphNodes: extracted.neckLymphNodes || "not_performed",
      petCt: extracted.petCt || "not_performed",
      benignFindings: Array.isArray(extracted.benignFindings) ? extracted.benignFindings : [],
      systemicStagingConfirmed: Boolean(
        extracted.systemicStagingConfirmed || 
        (extracted.brainMri === 'negative' || extracted.abdominalUltrasound === 'negative' || extracted.abdominalUltrasound === 'benign_findings' || extracted.boneScan === 'negative' || extracted.petCt === 'negative')
      ),

      // State Engine
      currentStage: currentStage,
      riskLevel: riskLevel,
      nextAction: nextAction,
      psychologicalState: psychState
    };

    logEvent({
      level: 'info',
      endpoint: '/api/parse-report',
      clientIp,
      durationMs: Date.now() - startTime,
      statusCode: 200,
      aiModel: 'gemini-2.5-flash',
      action: 'report_parsing_completed',
      meta: {
        reportType: safeData.reportType,
        tStage: safeData.tStage,
        nStage: safeData.nStage
      }
    });

    return NextResponse.json({ success: true, data: safeData });
  } catch (error: any) {
    logEvent({
      level: 'error',
      endpoint: '/api/parse-report',
      clientIp,
      durationMs: Date.now() - startTime,
      statusCode: 500,
      error: error.message || 'Unknown parsing error',
      action: 'parse_report_exception'
    });
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
