/** Patient-facing product boundary for the public ZhiaiWiki workflow. */
export const PRODUCT_SCOPE_NOTICE =
  "本平台仅用于健康科普、报告字段整理和循证资料检索，不提供诊断、分期、治疗方案或在线诊疗。";
export const REPORT_ORGANIZATION_NOTICE =
  "以下内容是对您上传材料的机器整理与通用文献检索结果，请以医院原始报告和专业医务人员意见为准。";
export const EVIDENCE_ONLY_MODEL_INSTRUCTION = `产品边界（必须遵守）：本平台仅提供健康科普、报告字段整理和循证资料检索，不提供诊断、分期、治疗方案或在线诊疗。只能概括材料明确出现的原文字段并标记未提供/无法确认，只能提供可追溯的通用文献背景、研究对象、主要结局和适用限制。不得把患者归入诊断、TNM/FIGO/其他分期、风险等级或治疗获益人群，不得给出药物、剂量、疗程、手术、放疗、化疗、靶向、免疫、随访频率或检查安排建议，不得使用“建议您接受/应当/首选/需要治疗/根治窗口/适合某方案”等个体化措辞。结尾必须提醒用户携带原始报告向持证医务人员咨询。`;
