"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  ShieldCheck, 
  FileText, 
  HelpCircle, 
  Calculator, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Copy, 
  Check,
  HeartHandshake,
  MapPin,
  FileCheck,
  AlertOctagon,
  Filter,
  Info,
  Smartphone,
  Lightbulb
} from "lucide-react";
import Footer from "@/components/Footer";
import { BREAST_DRUG_POLICIES } from "@/lib/breastReimbursementData";
import { COLORECTAL_DRUG_POLICIES } from "@/lib/colorectalReimbursementData";
import { GASTRIC_DRUG_POLICIES } from "@/lib/gastricReimbursementData";
import { LIVER_DRUG_POLICIES } from "@/lib/liverReimbursementData";
import { ESOPHAGEAL_DRUG_POLICIES } from "@/lib/esophagealReimbursementData";
import { THYROID_DRUG_POLICIES } from "@/lib/thyroidReimbursementData";
import { ENDOMETRIAL_DRUG_POLICIES } from "@/lib/endometrialReimbursementData";
import { CERVICAL_DRUG_POLICIES } from "@/lib/cervicalReimbursementData";
import { PANCREATIC_DRUG_POLICIES } from "@/lib/pancreaticReimbursementData";
import { DRUG_POLICIES, type DrugPolicy } from "@/lib/reimbursementData";
import { useCancerType } from "@/components/common/CancerSwitch";
import { CancerIcon } from "@/components/common/CancerIcons";
import { CancerRegistry } from "@/lib/cancerRegistry";
import type { CancerType } from "@/lib/types";

interface CancerReimbursementMeta {
  badge: string;
  title: string;
  subtitle: string;
  calcTitle: string;
  tableTitle: string;
  appDiseaseName: string;
  sampleDrugName: string;
  categories: Array<{ id: string; label: string; activeColor?: string }>;
  materials: {
    pathologyReq: string;
    pathologyTip: string;
    geneticsTitle: string;
    geneticsReq: string;
    geneticsTip: string;
  };
  checklistText: string;
}

const CANCER_REIMBURSEMENT_META: Record<CancerType, CancerReimbursementMeta> = {
  lung: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (肺癌专区)",
    title: "破除用药负担 · 肺癌特药医保与慈善赠药",
    subtitle: "系统梳理 16 大肺腺癌主流靶向与免疫药物官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "肺腺癌 16 大特药自负费用在线测算模拟器",
    tableTitle: "16 大主流肺腺癌特药国谈医保限定支付与红线全览表",
    appDiseaseName: "肺恶性肿瘤 / 肺癌",
    sampleDrugName: "奥希替尼 (泰瑞沙)",
    categories: [
      { id: "all", label: "全部 16 种特药", activeColor: "bg-slate-900" },
      { id: "egfr", label: "EGFR 靶向 (泰瑞沙/艾弗沙/阿美乐等)", activeColor: "bg-blue-600" },
      { id: "alk_ros1", label: "ALK / ROS1 (安圣莎/博瑞纳/罗圣全)", activeColor: "bg-purple-600" },
      { id: "rare_targets", label: "罕见靶点 MET/RET/KRAS/HER2", activeColor: "bg-teal-600" },
      { id: "immunotherapy", label: "免疫治疗 PD-1/PD-L1 (国产/进口)", activeColor: "bg-indigo-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性非小细胞肺癌/肺腺癌的病理切片报告单原件及复印件（注明病理组织学亚型）。",
      pathologyTip: "注明病理组织学亚型（如浸润性腺癌/鳞癌/微浸润）及关键免疫组化结果。",
      geneticsTitle: "4. 分子基因分型 / PD-L1 表达报告",
      geneticsReq: "具备资质的三甲医院或正规第三方实验室出具的 NGS / PCR 基因检测报告单。",
      geneticsTip: "注明 EGFR 19del/L858R、ALK 融合或 KRAS/RET/MET 等靶点突变丰度及 PD-L1 TPS 评分。",
    },
    checklistText: `【肺癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院住院病历、出院小结或门诊病历（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性非小细胞肺癌/肺腺癌的病理切片报告单（加盖公章）；
4. 分子基因分型：正规基因检测报告（注明 EGFR / ALK / ROS1 / MET / RET / KRAS 等突变或 PD-L1 表达单）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  breast: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (乳腺癌专区)",
    title: "破除用药负担 · 乳腺癌特药医保与慈善赠药",
    subtitle: "系统梳理乳腺癌主流靶向、CDK4/6、ADC 与内分泌特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "乳腺癌重大特药自负费用在线测算模拟器",
    tableTitle: "乳腺癌重大特药国谈医保限定支付与红线全览表",
    appDiseaseName: "乳腺恶性肿瘤 / 乳腺癌",
    sampleDrugName: "曲妥珠单抗 (赫赛汀)",
    categories: [
      { id: "all", label: "全部特药", activeColor: "bg-slate-900" },
      { id: "her2", label: "HER2 靶向 (赫赛汀/帕捷特)", activeColor: "bg-blue-600" },
      { id: "cdk46", label: "CDK4/6 抑制剂 (唯择/爱谱沙)", activeColor: "bg-purple-600" },
      { id: "endocrine", label: "内分泌/SERD (芙仕得)", activeColor: "bg-teal-600" },
      { id: "adc", label: "新型 ADC (优赫得 T-DXd)", activeColor: "bg-indigo-600" },
      { id: "parp_immuno", label: "PARP 抑制剂 (利普卓)", activeColor: "bg-rose-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性浸润性乳腺癌的病理切片报告单原件及复印件（注明浸润组织学分级）。",
      pathologyTip: "注明组织学浸润分级（Nottingham Grade）及脉管/神经侵犯情况。",
      geneticsTitle: "4. 免疫组化与分子分型报告",
      geneticsReq: "三甲医院出具的 ER、PR、HER2 (IHC/FISH)、Ki-67 或 21-基因 RS / BRCA1/2 报告单。",
      geneticsTip: "注明 HER2 状态 (IHC 3+ 或 FISH 阳性，或 IHC 1+/2+ 低表达) 及 ER/PR 阳性百分比。",
    },
    checklistText: `【乳腺癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院住院病历、出院小结或门诊病历（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性浸润性乳腺癌的病理切片报告单（加盖公章，注明浸润分级）；
4. 免疫组化与基因：ER/PR、HER2 (IHC/FISH)、Ki-67 报告单，或 21-基因 RS / BRCA1/2 报告；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  colorectal: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (结直肠癌专区)",
    title: "破除用药负担 · 结直肠癌特药医保与慈善赠药",
    subtitle: "系统梳理结直肠癌抗 EGFR、抗 VEGF、小分子抗血管、口服化疗与免疫特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "结直肠癌核心特药自负费用在线测算模拟器",
    tableTitle: "结直肠癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "结直肠恶性肿瘤 / 结肠癌 / 直肠癌",
    sampleDrugName: "西妥昔单抗 (爱必妥)",
    categories: [
      { id: "all", label: "全部 7 种肠癌特药", activeColor: "bg-slate-900" },
      { id: "egfr", label: "抗 EGFR 单抗 (爱必妥/西妥昔)", activeColor: "bg-blue-600" },
      { id: "vegf", label: "抗 VEGF 血管生成 (安维汀/贝伐珠)", activeColor: "bg-emerald-600" },
      { id: "anti_angiogenesis", label: "小分子抗血管 (爱优特/呋喹替尼)", activeColor: "bg-amber-600" },
      { id: "multitarget", label: "多靶点激酶 (拜万戈/瑞戈非尼)", activeColor: "bg-purple-600" },
      { id: "chemo_oral", label: "口服抗代谢 (朗斯弗/TAS-102)", activeColor: "bg-teal-600" },
      { id: "pd1", label: "dMMR/MSI-H 免疫 (K药/帕博利珠)", activeColor: "bg-rose-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性结直肠腺癌的病理组织报告单原件及肠镜检查出院小结。",
      pathologyTip: "注明左右半发生部位、组织分化程度、浸润深度及脉管癌栓/神经侵犯。",
      geneticsTitle: "4. RAS/BRAF 基因与 MMR/MSI 筛查报告",
      geneticsReq: "正规分子检测报告单（明确 KRAS/NRAS/BRAF 全外显子突变状态及 MMR/MSI 表达）。",
      geneticsTip: "西妥昔单抗报销必须提供全 RAS/BRAF 野生型报告；免疫单药报销须具备 dMMR 或 MSI-H 凭证。",
    },
    checklistText: `【结直肠癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院住院病历、肠镜活检或手术出院小结（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性结直肠腺癌的病理组织报告单（注明浸润分期及脉管浸润）；
4. 分子基因分型：正规基因检测报告（明确 RAS、BRAF 及 MSI/dMMR 状态，西妥昔单抗须提供左半野生型凭证）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  colon: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (结肠癌专区)",
    title: "破除用药负担 · 结肠癌特药医保与慈善赠药",
    subtitle: "系统梳理结肠癌左半/右半靶向分流、抗 EGFR、抗 VEGF、口服化疗与免疫特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "结肠癌核心特药自负费用在线测算模拟器",
    tableTitle: "结肠癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "结肠恶性肿瘤",
    sampleDrugName: "西妥昔单抗 (爱必妥)",
    categories: [
      { id: "all", label: "全部 7 种肠癌特药", activeColor: "bg-slate-900" },
      { id: "egfr", label: "抗 EGFR 单抗 (爱必妥/西妥昔)", activeColor: "bg-blue-600" },
      { id: "vegf", label: "抗 VEGF 血管生成 (安维汀/贝伐珠)", activeColor: "bg-emerald-600" },
      { id: "anti_angiogenesis", label: "小分子抗血管 (爱优特/呋喹替尼)", activeColor: "bg-amber-600" },
      { id: "multitarget", label: "多靶点激酶 (拜万戈/瑞戈非尼)", activeColor: "bg-purple-600" },
      { id: "chemo_oral", label: "口服抗代谢 (朗斯弗/TAS-102)", activeColor: "bg-teal-600" },
      { id: "pd1", label: "dMMR/MSI-H 免疫 (K药/帕博利珠)", activeColor: "bg-rose-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性结肠腺癌的病理切片报告单原件及结肠镜出院小结。",
      pathologyTip: "注明回盲部/升结肠/横结肠/降结肠/乙状结肠原发部位、浸润深度及脉管神经侵犯。",
      geneticsTitle: "4. RAS/BRAF 基因与 MMR/MSI 报告",
      geneticsReq: "正规分子检测报告单（明确 KRAS/NRAS/BRAF 全外显子及 MMR/MSI 状态）。",
      geneticsTip: "西妥昔单抗报销必须提供全 RAS/BRAF 野生型且原发于左半结肠凭证。",
    },
    checklistText: `【结肠癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院住院病历、结肠镜活检或手术出院小结（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性结肠腺癌的病理组织报告单（注明浸润分期及脉管浸润）；
4. 分子基因分型：正规基因检测报告（明确 RAS、BRAF 及 MSI/dMMR 状态，西妥昔单抗须提供左半野生型凭证）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  rectal: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (直肠癌专区)",
    title: "破除用药负担 · 直肠癌特药医保与慈善赠药",
    subtitle: "系统梳理直肠癌新辅助同步放化疗增敏、抗 EGFR、抗 VEGF、小分子抗血管与免疫特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "直肠癌核心特药自负费用在线测算模拟器",
    tableTitle: "直肠癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "直肠恶性肿瘤",
    sampleDrugName: "西妥昔单抗 / 贝伐珠单抗",
    categories: [
      { id: "all", label: "全部 7 种肠癌特药", activeColor: "bg-slate-900" },
      { id: "egfr", label: "抗 EGFR 单抗 (爱必妥/西妥昔)", activeColor: "bg-blue-600" },
      { id: "vegf", label: "抗 VEGF 血管生成 (安维汀/贝伐珠)", activeColor: "bg-emerald-600" },
      { id: "anti_angiogenesis", label: "小分子抗血管 (爱优特/呋喹替尼)", activeColor: "bg-amber-600" },
      { id: "multitarget", label: "多靶点激酶 (拜万戈/瑞戈非尼)", activeColor: "bg-purple-600" },
      { id: "chemo_oral", label: "口服抗代谢 (朗斯弗/TAS-102)", activeColor: "bg-teal-600" },
      { id: "pd1", label: "dMMR/MSI-H 免疫 (K药/帕博利珠)", activeColor: "bg-rose-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性直肠腺癌的病理切片报告单原件及直肠薄层 MRI 分期报告。",
      pathologyTip: "注明距齿状线距离、环周切缘 (CRM) 状态、EMVI 壁外血管侵犯及浸润深度。",
      geneticsTitle: "4. RAS/BRAF 基因与 MMR/MSI 报告",
      geneticsReq: "正规分子检测报告单（明确 KRAS/NRAS/BRAF 全外显子及 MMR/MSI 状态）。",
      geneticsTip: "全程新辅助 (TNT) 及转化治疗报销需结合直肠高分辨 MRI 阳性风险特征与基因报告。",
    },
    checklistText: `【直肠癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院住院病历、直肠镜活检或手术出院小结（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性直肠腺癌的病理组织报告单（注明浸润分期及 CRM/EMVI 状态）；
4. 分子基因分型：正规基因检测报告（明确 RAS、BRAF 及 MSI/dMMR 状态，西妥昔单抗须提供野生型凭证）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  gastric: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (胃癌专区)",
    title: "破除用药负担 · 胃癌特药医保与慈善赠药",
    subtitle: "系统梳理胃癌 HER2 / Claudin 18.2 靶向、PD-1 免疫、抗血管与口服化疗特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "胃癌核心特药自负费用在线测算模拟器",
    tableTitle: "胃癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "胃恶性肿瘤 / 胃腺癌",
    sampleDrugName: "曲妥珠单抗 (赫赛汀) / 纳武利尤单抗",
    categories: [
      { id: "all", label: "全部胃癌特药", activeColor: "bg-slate-900" },
      { id: "targeted", label: "分子靶向 (赫赛汀/佐妥昔/阿帕替尼)", activeColor: "bg-blue-600" },
      { id: "immuno", label: "PD-1 免疫 (欧狄沃/纳武利尤)", activeColor: "bg-purple-600" },
      { id: "chemo", label: "口服化疗 (希罗达/替吉奥 S-1)", activeColor: "bg-teal-600" },
    ],
    materials: {
      pathologyReq: "明确诊断为原发性胃腺癌（含胃食管结合部腺癌）的胃镜活检或手术病理报告单。",
      pathologyTip: "注明 Lauren 组织学分型（肠型/弥漫型/混合型）、印戒细胞占比及分化级别。",
      geneticsTitle: "4. HER2 / Claudin 18.2 / PD-L1 (CPS) 报告",
      geneticsReq: "病理科出具的 HER2 (IHC/FISH)、Claudin 18.2 免疫组化单及 PD-L1 CPS 评分报告。",
      geneticsTip: "赫赛汀报销需具备 HER2 IHC 3+ 或 FISH 扩增凭证；欧狄沃一线报销限定 PD-L1 CPS ≥ 5。",
    },
    checklistText: `【胃癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 病历依据：近半年经治三甲医院胃镜检查报告、住院病历或出院小结（须加盖医院病案室鲜章）；
3. 病理报告：明确诊断为原发性胃腺癌（含胃食管结合部）病理切片报告单（注明 Lauren 分型与印戒细胞占比）；
4. 分子靶标与免疫：HER2 (IHC/FISH) 报告单、Claudin 18.2 表达单、PD-L1 (CPS评分) 及 MMR/MSI 筛查报告；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  liver: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (原发性肝癌专区)",
    title: "破除用药负担 · 原发性肝癌特药医保与慈善赠药",
    subtitle: "系统梳理原发性肝细胞癌 T+A 双达方案、小分子多靶点 TKI 与 HAIC 特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "原发性肝癌核心特药自负费用在线测算模拟器",
    tableTitle: "原发性肝癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "原发性肝恶性肿瘤 / 肝细胞癌",
    sampleDrugName: "信迪利单抗 (达伯舒) / 仑伐替尼",
    categories: [
      { id: "all", label: "全部肝癌特药", activeColor: "bg-slate-900" },
      { id: "immuno", label: "免疫治疗 (达伯舒信迪利/泰圣奇阿替利珠)", activeColor: "bg-purple-600" },
      { id: "targeted", label: "抗血管与靶向 TKI (乐卫玛仑伐替尼/泽普生)", activeColor: "bg-blue-600" },
    ],
    materials: {
      pathologyReq: "肝穿刺活检组织病理学报告单，或三甲医院增强 CT/MRI + AFP 确立的 CNLC 诊断报告。",
      pathologyTip: "注明 CNLC 临床分期、门静脉主干及分支癌栓侵犯程度（Vp1~Vp4）与转移情况。",
      geneticsTitle: "4. 肝储备功能 (Child-Pugh/ALBI) 与乙肝定量",
      geneticsReq: "近一个月内肝功能生物化学全套（胆红素、白蛋白、INR）与 HBV-DNA / HCV 报告。",
      geneticsTip: "小分子 TKI 与免疫一线报销均限定肝功能储备良好（Child-Pugh A 级或较好的 B 级）。",
    },
    checklistText: `【原发性肝癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 影像病历依据：近半年增强 CT/MRI 动态造影报告、出院小结及门静脉系统超声造影（盖病案室鲜章）；
3. 临床/病理诊断：原发性肝细胞癌组织活检报告或三级甲等医院确立的 CNLC 临床诊断依据书；
4. 肝功能与病原学：Child-Pugh/ALBI 肝储备评级检验单、AFP 甲胎蛋白定量单、HBV-DNA / HCV 病毒载量报告；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  esophageal: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (食管癌专区)",
    title: "破除用药负担 · 食管癌特药医保与慈善赠药",
    subtitle: "系统梳理食管鳞癌一线 PD-1 免疫联合化疗、术后辅助免疫维持与放化疗特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "食管癌核心特药自负费用在线测算模拟器",
    tableTitle: "食管癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "食管恶性肿瘤 / 食管鳞癌",
    sampleDrugName: "卡瑞利珠单抗 (艾瑞卡) / 替雷利珠",
    categories: [
      { id: "all", label: "全部食管癌特药", activeColor: "bg-slate-900" },
      { id: "immuno", label: "PD-1 免疫一线与辅助 (艾瑞卡/百泽安/汉斯状)", activeColor: "bg-purple-600" },
      { id: "chemo", label: "系统化疗与新辅助 (白蛋白紫杉醇)", activeColor: "bg-teal-600" },
    ],
    materials: {
      pathologyReq: "胃镜咬检或手术切除食管鳞癌组织病理学报告单原件及复印件。",
      pathologyTip: "注明组织学类型（通常为鳞状细胞癌 ESCC）、分化程度及喉返神经链等淋巴结转移状态。",
      geneticsTitle: "4. PD-L1 表达 (CPS) 与手术残存病理评估",
      geneticsReq: "免疫组化 PD-L1 表达报告单（注明抗体克隆号及 CPS 评分）或术后残存病灶凭证。",
      geneticsTip: "CheckMate-577 术后辅助免疫报销须提供新辅助放化疗后手术切除标本有残存病灶 (non-pCR) 凭证。",
    },
    checklistText: `【食管癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 内镜病历依据：消化内镜咬检记录、胸部增强 CT/PET-CT 分期报告及出院小结（加盖病案室鲜章）；
3. 病理组织报告：明确诊断为食管鳞状细胞癌 (ESCC) 或腺癌的病理组织报告单（注明浸润深度）；
4. 免疫表达/手术残存：PD-L1 表达单（CPS 评分）或术后病理残存病灶凭证（CheckMate-577 non-pCR 依据）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  thyroid: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (甲状腺癌专区)",
    title: "破除用药负担 · 甲状腺癌特药医保与慈善赠药",
    subtitle: "系统梳理甲状腺癌术后终身 TSH 抑制优甲乐、放射性碘难治小分子靶向与副甲状腺保护特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "甲状腺癌核心特药自负费用在线测算模拟器",
    tableTitle: "甲状腺癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "甲状腺恶性肿瘤 / 甲状腺乳头状癌",
    sampleDrugName: "左甲状腺素钠片 (优甲乐) / 仑伐替尼",
    categories: [
      { id: "all", label: "全部甲状腺特药", activeColor: "bg-slate-900" },
      { id: "endocrine", label: "TSH 抑制与终身替代 (优甲乐/雷替斯)", activeColor: "bg-blue-600" },
      { id: "targeted", label: "小分子靶向与 RET 抑制剂 (乐卫玛/普吉华)", activeColor: "bg-purple-600" },
      { id: "supportive", label: "术后钙磷代谢支持 (骨化三醇/碳酸钙)", activeColor: "bg-teal-600" },
    ],
    materials: {
      pathologyReq: "甲状腺细针穿刺 (FNA) 细胞学报告或手术切除标本组织病理切片报告单。",
      pathologyTip: "注明 Bethesda 细胞学分级、乳头状癌/滤泡状癌/髓样癌亚型、被膜侵犯及淋巴结清扫转移枚数。",
      geneticsTitle: "4. 分子基因突变 (BRAF/RET) 与甲功五项报告",
      geneticsReq: "三甲医院或检验所出具的 BRAF V600E / RET 突变检测报告单及术后甲状腺功能（TSH/FT3/FT4/Tg）。",
      geneticsTip: "碘难治性靶向药（仑伐替尼）报销必须具备核医学科出具的放射性碘131摄取阴性或治疗进展评估。",
    },
    checklistText: `【甲状腺癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 术后病历依据：甲状腺手术记录、出院小结或细针穿刺 (FNA) 门诊病历（加盖病案室鲜章）；
3. 病理组织报告：明确诊断为甲状腺乳头状癌/滤泡状癌/髓样癌病理切片报告单（注明被膜侵犯与淋巴结转移）；
4. 分子基因与甲功：BRAF V600E / RET 突变检测报告单，近 1 个月甲状腺功能五项（TSH/FT3/FT4/Tg/TgAb）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  endometrial: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (子宫内膜癌专区)",
    title: "破除用药负担 · 子宫内膜癌特药医保与慈善赠药",
    subtitle: "系统梳理子宫内膜癌大剂量孕激素逆转保生育、TC 方案一线辅助化疗、MSI-H 免疫单药与靶免联合官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "子宫内膜癌核心特药自负费用在线测算模拟器",
    tableTitle: "子宫内膜癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "子宫内膜恶性肿瘤 / 子宫体癌",
    sampleDrugName: "醋酸甲地孕酮 (美适亚) / 仑伐替尼",
    categories: [
      { id: "all", label: "全部内膜癌特药", activeColor: "bg-slate-900" },
      { id: "endocrine", label: "高效孕激素 (美适亚/醋酸甲地孕酮)", activeColor: "bg-teal-600" },
      { id: "chemo", label: "术后辅助化疗 (紫杉醇+卡铂 TC方案)", activeColor: "bg-blue-600" },
      { id: "immune", label: "MSI-H/dMMR 免疫 (可瑞达 K 药)", activeColor: "bg-purple-600" },
      { id: "targeted", label: "晚期靶免联合 (乐卫玛仑伐替尼)", activeColor: "bg-indigo-600" },
    ],
    materials: {
      pathologyReq: "诊断性刮宫、宫腔镜活检或子宫切除术后组织病理切片报告单。",
      pathologyTip: "注明内膜样腺癌组织学分级（G1/G2/G3）、肌层浸润深度（<1/2 或 ≥1/2）及脉管癌栓 (LVSI)。",
      geneticsTitle: "4. FIGO 2023 四大分子分型 (POLE/MMR/p53) 报告",
      geneticsReq: "具备资质的病理分子实验室出具的 POLE 突变测序、MMR 免疫组化四项及 p53 表达报告。",
      geneticsTip: "免疫治疗（帕博利珠单抗）报销需具备 dMMR 或 MSI-H 凭证；保留生育功能需提供年轻与 PR 阳性依据。",
    },
    checklistText: `【子宫内膜癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 诊刮病历依据：诊断性刮宫、宫腔镜检查报告或子宫全切手术出院小结（加盖病案室鲜章）；
3. 病理组织报告：明确诊断为子宫内膜样腺癌的病理切片报告单（注明分化级别 G1~G3、肌层浸润深度及脉管癌栓）；
4. 分子分型报告：FIGO 2023 四分子分型报告（POLE 测序、MMR 免疫组化四项、p53 表达及 ER/PR 受体状态）；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  cervical: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (宫颈癌专区)",
    title: "破除用药负担 · 宫颈癌特药医保与慈善赠药",
    subtitle: "系统梳理局部进展期宫颈癌根治性同步放化疗顺铂增敏、抗血管贝伐珠单抗、双抗卡度尼利与 KEYNOTE-826 靶免四联特药官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "宫颈癌核心特药自负费用在线测算模拟器",
    tableTitle: "宫颈癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "子宫颈恶性肿瘤 / 宫颈鳞癌",
    sampleDrugName: "顺铂注射液 / 贝伐珠单抗",
    categories: [
      { id: "all", label: "全部宫颈癌特药", activeColor: "bg-slate-900" },
      { id: "chemo", label: "同步放化疗放射增敏 (顺铂注射液)", activeColor: "bg-blue-600" },
      { id: "targeted", label: "抗血管生成靶向 (安维汀/贝伐珠)", activeColor: "bg-emerald-600" },
      { id: "immune", label: "双特异性抗体与免疫联合 (开坦尼/可瑞达)", activeColor: "bg-purple-600" },
    ],
    materials: {
      pathologyReq: "宫颈活检、阴道镜咬检或冷刀锥切 (CKC) 组织病理切片报告单。",
      pathologyTip: "注明鳞癌/腺癌组织学分型、浸润深度（水平扩展与间质浸润深度）、切缘性质及盆腔增强 MRI 影像分期。",
      geneticsTitle: "4. 高危 HPV 亚型定量与 PD-L1 (CPS) 报告",
      geneticsReq: "高危型 HPV DNA 定量检测报告（重点排查 HPV 16/18）及 PD-L1 免疫组化 CPS 评分单。",
      geneticsTip: "晚期一线 KEYNOTE-826 方案（K药+化疗±贝伐珠）报销建议提供 PD-L1 CPS ≥ 1 表达证明。",
    },
    checklistText: `【宫颈癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 阴道镜病历依据：阴道镜活检记录、盆腔高分辨增强 MRI 分期报告或出院小结（加盖病案室鲜章）；
3. 病理组织报告：明确诊断为原发性宫颈鳞癌/腺癌组织病理切片报告单（注明组织学分级与浸润深度）；
4. 病毒与分子表达：高危型 HPV DNA 定量检测报告单、PD-L1 (CPS评分) 表达单或微卫星状态报告；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
  pancreatic: {
    badge: "国家医保谈判药品目录 · 门慢门特 · 官方 PAP 落地指南 (胰腺癌专区)",
    title: "破除用药负担 · 胰腺癌特药医保与慈善赠药",
    subtitle: "系统梳理胰腺癌胚系 BRCA 突变维持奥拉帕利、白蛋白紫杉醇集采、二线伊立替康脂质体及外分泌消化酶 (PERT) 官方医保限定支付标准。为您提供门慢门特 3 步办结、跨省异地直接结算、双通道定点药房刷卡与官方基金会 PAP 免费赠药的权威实操路径。",
    calcTitle: "胰腺癌核心特药自负费用在线测算模拟器",
    tableTitle: "胰腺癌核心特药国谈医保限定支付与红线全览表",
    appDiseaseName: "胰腺恶性肿瘤 / 胰腺癌",
    sampleDrugName: "奥拉帕利 (利普卓) / 白蛋白紫杉醇",
    categories: [
      { id: "all", label: "全部胰腺癌特药", activeColor: "bg-slate-900" },
      { id: "targeted", label: "PARP 靶向与维持 (利普卓/奥拉帕利)", activeColor: "bg-purple-600" },
      { id: "chemo", label: "系统化疗与集采基石 (白蛋白紫杉醇/吉西他滨/伊立替康脂质体)", activeColor: "bg-blue-600" },
      { id: "supportive", label: "外分泌消化酶支持 (得每通/胰酶胶囊)", activeColor: "bg-amber-600" },
    ],
    materials: {
      pathologyReq: "三甲医院出具的胰腺占位细针穿刺 (EUS-FNA) 细胞学或手术切除病理切片报告单原件及薄层胰腺增强 CT/MRI 分期报告。",
      pathologyTip: "注明导管腺癌组织分型、分化级别、腹膜后与脉管神经浸润情况及 R0/R1/R2 切缘性质。",
      geneticsTitle: "4. 胚系 BRCA 基因检测报告",
      geneticsReq: "国家认可的正规第三方或院内分子实验室出具的 gBRCA1/2 胚系致病突变检测报告单。",
      geneticsTip: "奥拉帕利医保报销严格限定胚系有害或疑似有害突变 (gBRCAm)，且需提供一线含铂化疗至少 16 周未进展依据。",
    },
    checklistText: `【胰腺癌门慢门特与特药报销申办官方材料清单 (医保办核验标准)】
1. 身份凭证：身份证、社保卡原件及复印件（或激活医保电子凭证二维码）；
2. 影像病历依据：薄层增强胰腺 CT / 磁共振 MRCP 影像报告、出院小结或内镜超声 EUS 记录（加盖病案室鲜章）；
3. 病理组织报告：明确诊断为原发性胰腺导管腺癌组织病理或 EUS-FNA 穿刺切片报告单（注明切缘与淋巴结转移）；
4. 基因检测报告：胚系 BRCA1/2 突变检测报告单（指导奥拉帕利维持）及 CA19-9 / 肝肾功能检验单；
5. 申请审批表：主诊主任/副主任医师填写的《基本医疗保险门诊慢特病待遇认定申请表》（医院医保办盖章）；
6. 选定定点：选定 1~2 家定点三甲医院及 1 家“双通道”定点零售药房备案回执。`,
  },
};

export default function ReimbursementPage() {
  const { cancerType, setCancerType } = useCancerType();
  const meta = CANCER_REIMBURSEMENT_META[cancerType] || CANCER_REIMBURSEMENT_META.lung;

  const currentPolicies = useMemo(() => {
    if (cancerType === "breast") return BREAST_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "colorectal" || cancerType === "colon" || cancerType === "rectal") return COLORECTAL_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "gastric") return GASTRIC_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "liver") return LIVER_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "esophageal") return ESOPHAGEAL_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "thyroid") return THYROID_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "endometrial") return ENDOMETRIAL_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "cervical") return CERVICAL_DRUG_POLICIES as DrugPolicy[];
    if (cancerType === "pancreatic") return PANCREATIC_DRUG_POLICIES as DrugPolicy[];
    return DRUG_POLICIES;
  }, [cancerType]);

  const defaultDrugForCancer = (type: string) => {
    switch (type) {
      case "breast": return "trastuzumab";
      case "colorectal":
      case "colon":
      case "rectal": return "cetuximab";
      case "gastric": return "trastuzumab_gastric";
      case "liver": return "sintilimab_liver";
      case "esophageal": return "camrelizumab_esophageal";
      case "thyroid": return "levothyroxine_thyroid";
      case "endometrial": return "megestrol_acetate_endometrial";
      case "cervical": return "cisplatin_cervical";
      case "pancreatic": return "olaparib";
      default: return "osimertinib";
    }
  };

  const [selectedDrugId, setSelectedDrugId] = useState<string>(defaultDrugForCancer(cancerType));
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [insuranceType, setInsuranceType] = useState<"urban_employee" | "urban_resident">("urban_employee");
  const [hasHuiminbao, setHasHuiminbao] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"reimbursement_table" | "calculator" | "materials" | "dual_channel" | "cross_province" | "pap_guide" | "faq">("reimbursement_table");
  const [checkedMaterials, setCheckedMaterials] = useState<string[]>([]);

  useEffect(() => {
    setSelectedDrugId(defaultDrugForCancer(cancerType));
    setSelectedCategory("all");
  }, [cancerType]);

  const toggleMaterial = (id: string) => {
    setCheckedMaterials(prev => 
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    );
  };

  const filteredDrugs = selectedCategory === "all" 
    ? currentPolicies 
    : currentPolicies.filter(d => d.categoryTag === selectedCategory);

  const currentDrug = currentPolicies.find(d => d.id === selectedDrugId) || currentPolicies[0];

  // Precise Copay Calculation Engine based on NHSA Rules
  const calcReimbursement = () => {
    const monthlyBase = currentDrug.negotiatedPrice;
    
    // Case 1: Drug Not in Basic Insurance (e.g., Enhertu DS-8201 or Keytruda K-drug)
    if (!currentDrug.inInsurance) {
      const papAnnualCap = (currentDrug.id === "pembrolizumab" || currentDrug.id === "trastuzumab_deruxtecan") ? 70000 : 80000;
      const huiminbaoCoverageRatio = hasHuiminbao ? 0.75 : 0;
      const effectiveAnnual = papAnnualCap * (1 - huiminbaoCoverageRatio);
      const effectiveMonthly = Math.round(effectiveAnnual / 12);
      return {
        monthlyBase,
        insurancePaid: 0,
        personalMonthly: effectiveMonthly,
        reimburseRatioDesc: hasHuiminbao ? "惠民保特药直报 75% + PAP 赠药" : "官方 PAP 赠药封顶",
        annualEstimated: Math.round(effectiveAnnual),
        savingsPercent: Math.round((1 - effectiveAnnual / (currentDrug.originalPrice * 12)) * 100)
      };
    }

    // Case 2: Drug in Basic Insurance (乙类/甲类 门慢门特统筹支付)
    const coverageRatio = insuranceType === "urban_employee" ? 0.80 : 0.65;
    const personalRatio = 1 - coverageRatio;
    
    let personalMonthly = Math.round(monthlyBase * personalRatio);
    if (hasHuiminbao && personalMonthly > 300) {
      personalMonthly = Math.round(personalMonthly * 0.5);
    }

    const insurancePaid = monthlyBase - personalMonthly;
    const annualEstimated = personalMonthly * 12;
    const savingsPercent = Math.round((1 - annualEstimated / (currentDrug.originalPrice * 12)) * 100);

    return {
      monthlyBase,
      insurancePaid,
      personalMonthly,
      reimburseRatioDesc: insuranceType === "urban_employee" 
        ? (hasHuiminbao ? "职工门特 80% + 惠民保二次报销" : "职工医保门特统筹约 80%") 
        : (hasHuiminbao ? "居民门特 65% + 惠民保二次报销" : "居民医保门特统筹约 65%"),
      annualEstimated,
      savingsPercent
    };
  };

  const stats = calcReimbursement();

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
    const checklistText = meta.checklistText;
    const ok = await copyTextSafe(checklistText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-500 selection:text-white">

      {/* Unified Hero Header (Aligned with /wiki, /studies, /resources, /knowledge) */}
      <header className="pt-[calc(4.25rem+env(safe-area-inset-top,0px))] md:pt-20 lg:pt-24 pb-4 sm:pb-6 px-3.5 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center space-y-3 sm:space-y-4">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-2xs sm:text-xs font-bold text-sky-700 border border-sky-200/80 shadow-xs max-w-full">
          <CancerIcon type={cancerType} className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span className="truncate">{meta.badge}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 hidden xs:inline-block" />
          <span className="hidden xs:inline-block">2024~2025 现行标准</span>
        </div>

        {/* Unified H1 */}
        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          <span className="inline-block">破除用药负担</span>
          <span className="hidden sm:inline"> · </span>
          <br className="sm:hidden" />
          <span className="text-blue-600 inline-block">{CancerRegistry.get(cancerType)?.name || "特药"}医保与慈善赠药</span>
        </h1>

        {/* Unified Subtitle */}
        <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
          {meta.subtitle}
        </p>

        {/* Active Specialty Zone Indicator */}
        <div className="inline-flex items-center gap-2 text-xs text-slate-500 bg-white/80 px-3.5 py-1.5 rounded-full border border-slate-200/90 shadow-2xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>当前专区：<strong className="text-slate-900 font-bold">{CancerRegistry.get(cancerType)?.name || "特药"}</strong></span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-400">切换其他专区请点击顶栏导航</span>
        </div>

        {/* Informational Guidance Banner */}
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs text-left">
          <div className="flex items-start sm:items-center gap-2.5">
            <Info className="w-5 h-5 text-blue-700 shrink-0 mt-0.5 sm:mt-0" />
            <div>
              <span className="font-black text-blue-950 text-sm">医保政策落地准则：</span>
              <span className="text-slate-600 ml-1">严格执行国家医保局“就医地目录、参保地政策”与双通道电子处方直报机制。</span>
            </div>
          </div>
          <button
            onClick={handleCopyChecklist}
            className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-blue-200 text-blue-700 font-bold hover:bg-blue-50 transition-colors cursor-pointer text-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "已复制材料清单" : "复制办门特材料"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area (Standard max-w-7xl) */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-3.5 sm:px-6 lg:px-8 pb-8 sm:pb-12 space-y-5 sm:space-y-6">
        
        {/* Segmented Navigation Tabs Bar (Scrollable) */}
        <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-2 overflow-x-auto no-scrollbar sticky top-20 z-20 backdrop-blur-md bg-white/95">
          <button
            onClick={() => setActiveTab("reimbursement_table")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "reimbursement_table" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>1. 特药目录与限定红线</span>
          </button>

          <button
            onClick={() => setActiveTab("calculator")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "calculator" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>2. 自负费用在线测算器</span>
          </button>

          <button
            onClick={() => setActiveTab("materials")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "materials" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" />
            <span>3. 门慢门特盖章材料包</span>
            {checkedMaterials.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-xs bg-white/20 text-white font-mono">
                {checkedMaterials.length}/6
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("dual_channel")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "dual_channel" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>4. 双通道药房与异地就医</span>
          </button>

          <button
            onClick={() => setActiveTab("pap_guide")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "pap_guide" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>5. 官方 PAP 慈善赠药</span>
          </button>

          <button
            onClick={() => setActiveTab("faq")}
            className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === "faq" 
                ? "bg-blue-600 text-white shadow-xs" 
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>6. 医保避坑 FAQ</span>
          </button>
        </div>

        {/* TAB 1: CALCULATOR & 4 CHANNELS OVERVIEW */}
        {activeTab === "calculator" && (
          <div className="space-y-8 animate-fade-in">
            {/* 4 Core Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-blue-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h3 className="text-sm font-bold text-slate-900">国谈医保与门慢门特</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  主流三代靶向药已降价 80%+ 纳入国家乙类目录。办妥门特后，无需住院在门诊即可享受 <strong>65%~85%</strong> 统筹报销。
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-teal-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h3 className="text-sm font-bold text-slate-900">“双通道”定点药房</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  医院药房缺药时，凭医生流转处方直接在定点药房刷医保电子凭证取药，享受与三甲医院完全同等的报销比例。
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-purple-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h3 className="text-sm font-bold text-slate-900">城市定制“惠民保”</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  百元保费、不限既往症。针对医保统筹后的个人自负部分及部分未进医保昂贵特药（如 DS-8201/K药）二次报销 <strong>50%~80%</strong>。
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2 hover:border-amber-300 transition-all">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <h3 className="text-sm font-bold text-slate-900">官方基金会 PAP 赠药</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  中华慈善总会/中国初保基金会官方项目。低保全免，非低保按周期自费达标后提供后续免费赠药，封顶年总支出。
                </p>
              </div>
            </div>

            {/* Interactive Calculator Section */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-blue-600" />
                    <span>{meta.calcTitle}</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    按国家医保局统一标准算法，模拟计算门特统筹支付、个人自负及惠民保/PAP 减负后真实月支出
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200 self-start sm:self-center">
                  2024~2025 现行医保目录
                </span>
              </div>

              {/* Target Category Filter for Drug Selection */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                  <Filter className="w-3.5 h-3.5 text-blue-600" />
                  <span>按靶点/药物大类筛选：</span>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  {meta.categories.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                          isActive
                            ? `${cat.activeColor || "bg-blue-600"} text-white shadow-xs`
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Calculator Form Controls */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">1. 选择具体药品：</label>
                  <select
                    value={selectedDrugId}
                    onChange={(e) => setSelectedDrugId(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:outline-blue-500 focus:bg-white"
                  >
                    {filteredDrugs.map((drug) => (
                      <option key={drug.id} value={drug.id}>
                        {drug.name} ({drug.genericName.split(" ")[0]}) - {drug.target}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">2. 选择基本医保类型：</label>
                  <select
                    value={insuranceType}
                    onChange={(e) => setInsuranceType(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-300 font-bold text-slate-900 focus:outline-blue-500 focus:bg-white"
                  >
                    <option value="urban_employee">城镇职工基本医疗保险 (门特统筹报销约 80%)</option>
                    <option value="urban_resident">城乡居民基本医疗保险 / 新农合 (门特统筹约 65%)</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1.5">3. 城市定制型商业险 (惠民保)：</label>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setHasHuiminbao(true)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer text-xs ${
                        hasHuiminbao ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      已参保 (二次报销)
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasHuiminbao(false)}
                      className={`flex-1 py-2 px-3 rounded-xl font-bold border transition-all cursor-pointer text-xs ${
                        !hasHuiminbao ? "bg-blue-600 text-white border-blue-600 shadow-xs" : "bg-slate-50 text-slate-700 border-slate-200"
                      }`}
                    >
                      未参保
                    </button>
                  </div>
                </div>
              </div>

              {/* Calculator Output Display Card (Dark Theme, Elegant) */}
              <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <span className="text-[11px] text-sky-400 font-mono font-bold">
                      {currentDrug.target} · {currentDrug.manufacturer}
                    </span>
                    <div className="text-base sm:text-lg font-extrabold text-white">
                      {currentDrug.name} ({currentDrug.genericName})
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-300 bg-amber-500/20 px-2.5 py-1 rounded-lg border border-amber-500/30">
                      {currentDrug.insuranceCategory}
                    </span>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30 font-mono tabular-nums">
                      综合减负约 {stats.savingsPercent}%
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">国谈前原自费</div>
                    <div className="text-sm sm:text-base font-bold text-slate-400 line-through font-mono tabular-nums">
                      ¥{currentDrug.originalPrice}/月
                    </div>
                  </div>

                  <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700/60">
                    <div className="text-[10px] text-slate-400">现行医保基准价</div>
                    <div className="text-sm sm:text-base font-bold text-sky-300 font-mono tabular-nums">
                      ¥{currentDrug.negotiatedPrice}/月
                    </div>
                  </div>

                  <div className="p-3 bg-blue-900/60 rounded-xl border border-blue-500/50">
                    <div className="text-[10px] text-blue-300">医保统筹报销预估</div>
                    <div className="text-sm sm:text-base font-bold text-blue-200 font-mono tabular-nums">
                      -¥{stats.insurancePaid}/月
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-950/80 rounded-xl border border-emerald-500/60">
                    <div className="text-[10px] text-emerald-300 font-bold">个人月自负预估</div>
                    <div className="text-lg sm:text-xl font-black text-emerald-400 font-mono tabular-nums">
                      ¥{stats.personalMonthly}
                      <span className="text-xs font-normal text-emerald-200">/月</span>
                    </div>
                  </div>
                </div>

                {/* Indication Limits & PAP Notice */}
                <div className="space-y-2.5 text-xs pt-1">
                  <div className="p-4 bg-sky-50/80 rounded-xl border border-sky-200 text-sky-950 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-sky-900 flex items-center gap-1.5 text-xs sm:text-sm">
                      <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
                      <span>国家医保限定支付范围（报销红线）：</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {currentDrug.reimbursementLimits}
                    </p>
                    {currentDrug.offLabelNotice && (
                      <p className="text-xs text-rose-800 bg-rose-50/90 p-2 rounded-lg border border-rose-200/80 leading-relaxed font-semibold">
                        报销提示：{currentDrug.offLabelNotice}
                      </p>
                    )}
                  </div>

                  <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-950 space-y-1.5 shadow-2xs">
                    <div className="font-bold text-amber-900 flex items-center gap-1.5 text-xs sm:text-sm">
                      <HeartHandshake className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>官方慈善援助 (PAP) 政策：{currentDrug.papProgram} ({currentDrug.papFoundation})</span>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed font-medium">
                      {currentDrug.papRule}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Step Chronic Disease Application Fast-Track */}
            <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>门诊慢特病 (门特) 3 步办结全流程</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    办好门特是享受 80%+ 医保报销的核心前提，绝大多数三甲医院支持“一站式”直办
                  </p>
                </div>
                <button
                  onClick={handleCopyChecklist}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "已复制材料清单" : "一键复制申办材料清单"}</span>
                </button>
              </div>

              <div className="space-y-4">
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-sm">
                    1
                  </div>
                  <div className="space-y-2 text-xs w-full">
                    <h3 className="font-bold text-slate-900 text-sm">主诊医生开具申请表并加盖公章</h3>
                    <p className="text-slate-600 leading-relaxed">
                      在主治医生处或医院便民服务窗口领取《门诊慢特病待遇认定申请表》，由主治医生填写临床诊断、基因突变分型及用药方案；随后在拿表窗口或病案室加盖公章（用于拍照上传）。
                    </p>

                    {/* 浙一医院拿表与盖章实操示例 */}
                    <div className="p-3 rounded-xl bg-blue-50/90 border border-blue-200/80 text-[11px] text-blue-950 flex items-start gap-2 shadow-2xs">
                      <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="leading-relaxed">
                        <span className="font-bold text-blue-800">浙一医院实操示范：</span>
                        <span>在浙大一院各院区一楼<strong>便民服务中心 / 医保咨询窗口</strong>拿取门特申请表 → 请主治医生填写临床诊断与签名 → 回到拿表处（便民服务中心）<strong>加盖公章</strong> → 手机拍照留存（用于浙里办线上上传）。</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shrink-0 mt-0.5 shadow-sm">
                    2
                  </div>
                  <div className="space-y-3 text-xs w-full">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2 flex-wrap">
                        <span>医院医保办一站式直报（或当地医保 APP 线上申报）</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                          掌上秒办 / 窗口 1~3 工作日
                        </span>
                      </h3>
                      <p className="text-slate-600 leading-relaxed mt-1">
                        携带材料前往就诊医院的<strong>医保服务办公室</strong>直接提交审核；绝大多数省市已支持在政务与医保 APP 进行线上“门慢门特申请”拍照上传审核。
                      </p>
                    </div>

                    {/* 标杆省份实操示例：浙江“浙里办”与浙一医院门特落地流程 */}
                    <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-indigo-50/90 via-sky-50/60 to-blue-50/50 border border-indigo-200/80 space-y-2.5">
                      <div className="flex items-center gap-2 text-indigo-950 font-bold">
                        <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="text-xs sm:text-sm font-extrabold text-indigo-900">
                          标杆实操示范 · 浙江“浙里办”APP 线上极速申报与浙大一院（浙一）就医直报
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-[11px] sm:text-xs text-slate-700">
                        <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                          <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>第一步：浙里办 APP 线上便捷申办</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            打开<strong>「浙里办」APP</strong> → 搜索<strong>「浙里医保」</strong> → 点击<strong>「门诊慢特病待遇备案」</strong> → 申请病种精准选择<strong>「{meta.appDiseaseName}」</strong> → 按提示拍照上传盖好公章的申请表、出院小结与病理报告 → 提交后通常 1 个工作日内即可完成认定生效。
                          </p>
                        </div>

                        <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 space-y-1.5 shadow-2xs">
                          <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>第二步：浙一医院挂号直接享受门特</span>
                          </div>
                          <p className="text-slate-600 leading-relaxed">
                            门特备案生效后，在<strong>浙大一院（浙一医院）官方微信公众号 / 支付宝小程序</strong>预约挂号，到院后在<strong>门诊自助机取号时，取号类型直接选择「特殊门诊」</strong>。医生开具靶向药（如{meta.sampleDrugName}等）或复查项目时，系统<strong>自动按门特标准统筹抵扣（报销约 80%~90%）</strong>，仅需支付自负差额！
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-[11px] text-indigo-900 font-medium flex items-center gap-1.5 pt-0.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        <span>其他省市（如江苏“江苏医保云”、上海“随申办”、广东“粤医保”等）流程基本一致，均支持掌上免跑腿线上直认。</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3.5 hover:border-slate-300 transition-all">
                  <div className="w-8 h-8 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0 mt-0.5">
                    3
                  </div>
                  <div className="space-y-1 text-xs">
                    <h3 className="font-bold text-slate-900 text-sm">选择定点医院与“双通道”定点药房直接联网结算</h3>
                    <p className="text-slate-600 leading-relaxed">
                      认定生效后，选择 1 家常就诊三甲医院及 1 家“双通道”定点特药零售药房备案。后续购药时，凭医生处方直接出示<strong>医保电子凭证码</strong>，系统自动统筹结算，患者仅需支付个人自负部分。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: COMPREHENSIVE 16 DRUGS REIMBURSEMENT LIMITS TABLE */}
        {activeTab === "reimbursement_table" && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" />
                <span>{meta.tableTitle}</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                依据国家医疗保障局 (NHSA) 现行《国家基本医疗保险药品目录》法定支付范围整理
              </p>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <th className="p-3.5">药品名称 / 通用名</th>
                    <th className="p-3.5">靶点 / 代系</th>
                    <th className="p-3.5">医保基准价</th>
                    <th className="p-3.5">医保限定支付范围 (绿灯可报销)</th>
                    <th className="p-3.5">自费红线提示 (红灯需自费)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentPolicies.map((drug) => (
                    <tr key={drug.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5">
                        <div className="font-bold text-slate-900">{drug.name}</div>
                        <div className="text-[11px] text-slate-500">{drug.genericName}</div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-mono text-slate-700 font-semibold">{drug.target}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="font-mono font-bold text-blue-600">¥{drug.negotiatedPrice}</div>
                        <span className="text-[10px] text-slate-400 font-normal">/月费用</span>
                      </td>
                      <td className="p-3.5 max-w-xs leading-relaxed text-slate-700">
                        {drug.reimbursementLimits}
                      </td>
                      <td className="p-3.5 max-w-xs leading-relaxed">
                        {drug.offLabelNotice ? (
                          <span className="text-rose-600 font-medium">{drug.offLabelNotice}</span>
                        ) : (
                          <span className="text-slate-400">无基因证据盲吃不予支付</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: HOSPITAL SEALED MATERIALS & INTERACTIVE CHECKLIST */}
        {activeTab === "materials" && (
          <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-blue-600" />
                  <span>门慢门特与特药报销 · 三甲医院盖章材料包全套清单</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  医保办审核标准全套材料 · 点击勾选已准备项，支持一键复制到便签
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                  备齐进度: {checkedMaterials.length} / 6 项
                </span>
                <button
                  type="button"
                  onClick={handleCopyChecklist}
                  className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "已复制" : "复制文字清单"}</span>
                </button>
              </div>
            </div>

            {/* Interactive Materials Checklist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs">
              {[
                {
                  id: "mat_id",
                  title: "1. 身份凭证与医保电子码",
                  req: "身份证、社保卡原件及复印件（或手机打开医保电子凭证二维码）。",
                  dept: "患者自备",
                  tip: "异地就医建议提前在国家医保服务平台 APP 完成实名激活。"
                },
                {
                  id: "mat_record",
                  title: "2. 出院小结与住院病案 (盖章件)",
                  req: "近半年经治三甲医院住院病历、出院小结或门诊病历。",
                  dept: "医院病案室 / 医保办盖章",
                  tip: "必须加盖医院病案室或医保办鲜章，复印件无章医保窗口不予受理。"
                },
                {
                  id: "mat_pathology",
                  title: "3. 组织病理学诊断切片报告",
                  req: meta.materials.pathologyReq,
                  dept: "病理科 / 病案室盖章",
                  tip: meta.materials.pathologyTip
                },
                {
                  id: "mat_genetics",
                  title: meta.materials.geneticsTitle,
                  req: meta.materials.geneticsReq,
                  dept: "分子病理中心 / 检验科",
                  tip: meta.materials.geneticsTip
                },
                {
                  id: "mat_form",
                  title: "5. 门慢门特待遇认定申请审批表",
                  req: "经治主诊副主任/主任医师亲笔填写诊断与用药方案并签名的《门诊慢特病待遇认定表》。",
                  dept: "主治医师填写 + 医院医保办盖章",
                  tip: "在医院门诊导医台或医保办窗口领取空白表格，主治医师签字后交医保办盖章。"
                },
                {
                  id: "mat_pharmacy",
                  title: "6. 定点医疗机构与“双通道”药房回执",
                  req: "选定 1~2 家就诊定点三甲医院及 1 家“双通道”医保定点特药零售药房。",
                  dept: "区县医保经办大厅 / 线上小程序",
                  tip: "若医院药房缺药，可凭流转电子处方在定点双通道药房直接刷医保卡结算。"
                }
              ].map((item) => {
                const isChecked = checkedMaterials.includes(item.id);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleMaterial(item.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                      isChecked 
                        ? "bg-slate-50/80 border-slate-300 opacity-75" 
                        : "bg-white border-slate-200/90 hover:border-blue-300 hover:shadow-2xs"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-lg flex items-center justify-center mt-0.5 border shrink-0 transition-colors ${
                      isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-slate-300 bg-slate-50"
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className={`font-extrabold text-xs ${isChecked ? "line-through text-slate-500" : "text-slate-900"}`}>
                          {item.title}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-800 border border-blue-200 shrink-0">
                          {item.dept}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        {item.req}
                      </p>
                      <div className="text-[10px] text-slate-500 bg-slate-50 p-2 rounded-xl border border-slate-100 mt-1 flex items-start gap-1">
                        <Lightbulb className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                        <span><strong>避坑提示：</strong>{item.tip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Fast Action Guidance */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">办妥门特后如何使用？</div>
                  <div className="text-[11px] text-amber-900 mt-0.5">
                    带齐上述材料交至参保地医保大厅或通过省政务小程序提交，审批通常需 1~3 个工作日。生效后在门诊开药出示医保码即享 65%~85% 直接统筹报销。
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("dual_channel")}
                className="px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white font-bold rounded-xl text-xs cursor-pointer shrink-0 transition-colors whitespace-nowrap"
              >
                查看双通道药房流转流程
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: DUAL-CHANNEL & CROSS-PROVINCE */}
        {activeTab === "dual_channel" && (
          <div className="space-y-6 animate-fade-in">
            {/* Cross-Province Block */}
            <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                  <span>跨省异地就医与门慢门特直接联网结算 4 步通</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  国家医保局“就医地目录、参保地政策”全国联网直接报销规则
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                    <span>就医前完成“异地就医线上备案”</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    打开<strong>“国家医保服务平台” APP</strong> 或微信小程序“国家异地就医备案”，选择参保地与就医地。选择“异地长期居住”或“临时就医转诊”，上传身份证与转诊单，<strong>即时或 1 工作日内办结生效</strong>。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                    <span>牢记国家结算核心原则</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    跨省直接结算遵循<strong>“就医地目录、参保地政策、就医地管理”</strong>：哪些药能报按就医地医院目录为准；报销起付线与比例按参保地老家政策执行。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                    <span>门慢门特跨省直接联网刷卡</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    异地三甲医院门诊开具特药靶向/免疫药物（如 {meta.sampleDrugName} 等）时，直接出示<strong>医保码或社保卡</strong>，系统自动按门特比例直接扣除报销金额，无需垫付现金拿回老家报销。
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-1.5">
                  <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                    <span>未提前备案的补救措施</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    若紧急就医未提前备案，可在<strong>出院或结算前完成补备案</strong>；全额自费结算保留好全国统一医疗收费发票、费用清单与病历原件，6 个月内回老家医保窗口办理手工零星报销。
                  </p>
                </div>
              </div>
            </div>

            {/* Dual Channel Section */}
            <div className="bg-white rounded-2xl p-4 sm:p-7 border border-slate-200 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-teal-600" />
                  <span>“双通道”定点药房处方流转与医院推诿破局攻略</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  保障患者能在定点特药药房享受与三甲医院完全同等的医保报销比例
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-1.5">
                  <div className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600" />
                    <span>什么是“双通道”？</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed text-[11px]">
                    “双通道”是指通过<strong>定点医疗机构（医院）</strong>和<strong>定点零售药房（特药药房）</strong>两个渠道，保障患者能买到国谈特药，并享受<strong>完全相同的医保报销待遇</strong>。
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: CROSS-PROVINCE DIRECT SETTLEMENT */}
        {activeTab === "cross_province" && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <span>跨省异地就医与门慢门特直接联网结算 4 步通</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                依据医保发〔2022〕22号《关于进一步做好基本医疗保险跨省异地就医直接结算工作的通知》
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">1</span>
                  <span>就医前完成“异地就医线上备案”</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  手机打开<strong>“国家医保服务平台” APP</strong> 或微信小程序“国家异地就医备案”，选择参保地与就医地（如北京、上海、广州）。选择“异地长期居住”或“跨省临时就医转诊”，拍照上传身份证与医院转诊单，<strong>即时或 1 个工作日内办结生效</strong>。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">2</span>
                  <span>牢记国家结算核心原则</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  跨省直接结算遵循<strong>“就医地目录、参保地政策、就医地管理”</strong>：
                  <br />• <strong>就医地目录</strong>：哪些药能报，按就医地医院的医保药品目录为准；
                  <br />• <strong>参保地政策</strong>：报销起付线、报销比例（如80%）与封顶线按您老家的医保政策执行。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">3</span>
                  <span>门慢门特跨省直接联网刷卡</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  全国已全面开通恶性肿瘤门诊放化疗与特药跨省联网结算。患者在异地三甲医院门诊开具特药靶向/免疫药物（如 {meta.sampleDrugName} 等）时，直接出示<strong>医保码或社保卡</strong>，系统自动按门特比例直接扣除报销金额，无需垫付现金拿回老家报销。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <div className="font-bold text-indigo-900 text-sm flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">4</span>
                  <span>未提前备案的补救措施</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  若紧急就医未提前备案，可在<strong>出院或结算前完成补备案</strong>；即使全额自费结算，保留好全国统一医疗收费发票、费用清单与病历原件，6 个月内回老家医保经办大厅窗口办理手工零星报销。
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DUAL-CHANNEL PHARMACY & BREAKTHROUGH */}
        {activeTab === "dual_channel" && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" />
                <span>“双通道”定点药房处方流转与医院推诿破局攻略</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                依据医保发〔2021〕28号《关于建立完善国家医保谈判药品“双通道”管理机制的指导意见》
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="p-5 rounded-2xl bg-teal-50/60 border border-teal-200 space-y-2">
                <div className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>什么是“双通道”？</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  “双通道”是指通过<strong>定点医疗机构（医院）</strong>和<strong>定点零售药房（特药药房）</strong>两个渠道，保障患者能买到国谈特药，并享受<strong>完全相同的医保报销待遇</strong>。
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-600" />
                  <span>遇到“医院药房没药 / 医生推诿开不出药”如何破局？</span>
                </div>
                <ul className="space-y-2.5 text-slate-700 leading-relaxed">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">方案 A (主动要求外配电子处方)：</span>
                    <span>明确告知主诊医生：“请帮我开具医保【双通道外配电子处方】，我直接去医院旁边的定点特药药房刷医保码取药。”这<strong>不计入医院的药占比与次均费用考核</strong>，医生非常愿意开具。</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-blue-600">方案 B (处方流转平台取药)：</span>
                    <span>处方开具后，医保系统会自动发送短信或在省医保小程序生成处方码，直接前往指定的双通道药房（如国药控股、大参林、老百姓、思派大药房等），出示医保码直接结算自负部分取药。</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: OFFICIAL PAP CHARITY ASSISTANCE */}
        {activeTab === "pap_guide" && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-purple-600" />
                <span>官方慈善基金会 PAP 患者援助项目买赠方案明细</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                由中华慈善总会 (CCF)、中国初级卫生保健基金会 (CPBPCF)、中国癌症基金会 (CFC) 官方管理
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                  <div className="font-bold text-purple-900 text-sm">中华慈善总会 (CCF)</div>
                  <div className="text-slate-600 text-[11px]">代表项目：泰瑞沙 (奥希替尼) 援助项目</div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    官方热线与微信公众号直接提交病历材料初审，全国各省会均设有慈善发药点。
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                  <div className="font-bold text-purple-900 text-sm">中国初保基金会</div>
                  <div className="text-slate-600 text-[11px]">代表项目：生命之钥 (可瑞达)、因飞凡、艾弗沙</div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    “生命之钥”公众号线上提交发票与随访 RECIST 评估报告，审核通过后顺丰包邮直达。
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                  <div className="font-bold text-purple-900 text-sm">中国癌症基金会 (CFC)</div>
                  <div className="text-slate-600 text-[11px]">代表项目：安圣莎 (阿来替尼)、多泽润、优赫得</div>
                  <p className="text-slate-700 leading-relaxed pt-1">
                    主诊医生入组注册，患者上传基因检测与购药发票，按周期给予后续免费药品。
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="font-bold text-amber-300 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>防诈骗严正警示：官方 PAP 赠药全程绝不收取任何“中介费/加速费”！</span>
                </div>
                <p className="text-slate-300 leading-relaxed text-[11px]">
                  所有官方 PAP 项目申请表格均可在上述基金会官方网站或认证微信公众号免费下载，严禁向任何第三方代办中介转账！
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: FAQ */}
        {activeTab === "faq" && (
          <div className="bg-white rounded-2xl p-3.5 sm:p-6 md:p-7 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
            <div className="border-b border-slate-100 pb-4">
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
                <span>医保特药报销政策高频避坑问答 (FAQ)</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                针对各地窗口政策差异、报销额度、年审与发票报销核心难点解答
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-all">
                <div className="font-bold text-slate-900 text-sm">Q1：门慢门特有有效期吗？需要每年重新去医院认定吗？</div>
                <p className="text-slate-600 leading-relaxed">
                  绝大多数省市针对<strong>恶性肿瘤门诊慢特病设定为 2~5 年有效期或长期有效</strong>。部分省市每年需在医保 APP 线上进行一次“生存认证”或刷卡一次自动续期，无需重新提供病理切片重复认定。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-all">
                <div className="font-bold text-slate-900 text-sm">Q2：靶向药在门诊拿和住院拿，哪个报销比例更高？</div>
                <p className="text-slate-600 leading-relaxed">
                  <strong>办好门特后，两者报销比例基本相同（均为 70%~85% 左右）</strong>！而且门诊走门特无需占用昂贵的床位费、诊疗费与住院押金，随开随走，极大节约综合时间与经济成本。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-all">
                <div className="font-bold text-slate-900 text-sm">Q3：医生开药时说属于“乙类先行自付”，是什么意思？</div>
                <p className="text-slate-600 leading-relaxed">
                  国家医保乙类药品在统筹报销前，按政策需患者<strong>先个人自付一定比例（通常为 5%~15%）</strong>，剩余的 85%~95% 费用再全额进入医保大病统筹按规定比例报销。这是完全正常的国家法定支付机制。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 hover:border-slate-300 transition-all">
                <div className="font-bold text-slate-900 text-sm">Q4：买了“城市惠民保”，怎么申请靶向药报销？</div>
                <p className="text-slate-600 leading-relaxed">
                  微信搜索参保城市的惠民保公众号（如“上海沪惠保”、“北京普惠健康保”、“西湖益联保”），进入【理赔服务 → 特药理赔申请】，拍照上传定点医院处方、病理与基因报告及购药发票，审核通过后 3~5 个工作日直接赔付到银行卡。
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200 space-y-2 hover:border-indigo-300 transition-all">
                <div className="font-bold text-indigo-950 text-sm flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Q5：以浙江省（浙里办）和浙大一院（浙一）为例，门特从申请到就医扣款的完整闭环是怎样的？</span>
                </div>
                <div className="space-y-1.5 text-slate-700 text-xs leading-relaxed">
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-indigo-700 shrink-0">1. 开表与盖章：</span>
                    <span>在浙大一院一楼便民服务中心领取门特纸质表 → 请主治医生填写诊断并签字 → 回到便民服务中心（拿表处）加盖公章并手机拍照；</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-indigo-700 shrink-0">2. 浙里办线上认定：</span>
                    <span>打开「浙里办」APP 搜索「浙里医保」→ 进入「门诊慢特病待遇备案」→ 申请病种精准选择<strong>「{meta.appDiseaseName}」</strong> → 上传盖章申请表、出院小结及病理报告，通常 1 个工作日内自动秒审生效；</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-indigo-700 shrink-0">3. 预约与自助机取号：</span>
                    <span>在浙大一院官方微信公众号或<strong>支付宝小程序</strong>预约挂号，就诊当日在<strong>门诊自助机取号时，取号类型直接选择「特殊门诊」</strong>；</span>
                  </div>
                  <div className="flex items-start gap-1.5">
                    <span className="font-bold text-indigo-700 shrink-0">4. 自动统筹扣款：</span>
                    <span>接诊医生开具靶向药（如 {meta.sampleDrugName} 等）或检查检验时，结算系统自动按门特标准统筹抵扣（报销约 80%~90%），患者仅需支付个人极少量自负差额！</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer maxWidth="max-w-7xl" />
    </div>
  );
}
