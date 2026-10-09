/**
 * ZhiaiWiki Patient Privacy & PII (Personally Identifiable Information) Sanitizer
 * Compliant with PIPL (中国个人信息保护法) & Medical Data De-identification Standards.
 */

/**
 * Strips or masks high-risk PII from raw clinical/pathology text before sending to LLMs or storing in logs.
 */
export function sanitizeClinicalText(rawText: string): string {
  if (!rawText) return "";

  let cleaned = rawText;

  // 1. Mask 18-digit Chinese National ID numbers
  cleaned = cleaned.replace(/\b(\d{6})\d{8}(\d{3}[\dXx])\b/g, '$1********$2');

  // 2. Mask Chinese 11-digit mobile phone numbers
  cleaned = cleaned.replace(/\b(1[3-9]\d)\d{4}(\d{4})\b/g, '$1****$2');

  // 3. Mask Medical Record / Inpatient / Outpatient IDs (e.g., 住院号: 2024081699)
  cleaned = cleaned.replace(/(?:住院号|病案号|门诊号|检查号|放射号|病理号|流水号|申请单号)[\s:：]*([A-Za-z0-9-_]{4,20})/gi, (match, id) => {
    return match.replace(id, id.slice(0, 2) + '****' + id.slice(-2));
  });

  // 4. Mask Patient Names in common medical report formats without corrupting clinical complaints
  // 4a. Explicit delimiter with 姓名/患者姓名/病人姓名 (e.g. 姓名：张三丰, 患者姓名: 李建国, 姓名 张三)
  cleaned = cleaned.replace(/(?:姓名|患者姓名|病人姓名)[\s:：]+([\u4e00-\u9fa5]{2,4})/g, (_match, name: string) => {
    if (name.length === 2) return `姓名：${name[0]}*`;
    if (name.length === 3) return `姓名：${name[0]}*${name[2]}`;
    return `姓名：${name[0]}**${name[3]}`;
  });

  // 4b. Explicit colon after 患者 (e.g. 患者：张三, 患者: 李四)
  cleaned = cleaned.replace(/(?:患者)[\s]*[：:]+[\s]*([\u4e00-\u9fa5]{2,4})/g, (_match, name: string) => {
    if (name.length === 2) return `患者：${name[0]}*`;
    if (name.length === 3) return `患者：${name[0]}*${name[2]}`;
    return `患者：${name[0]}**${name[3]}`;
  });

  // 4c. Intake profile intro format (e.g. "患者张晓敏，女，46岁" or "患者李建国，男")
  // Excludes narrative complaints like "患者无明显诱因出现胸痛" or "患者自述..."
  cleaned = cleaned.replace(/(?:患者)[\s]*([\u4e00-\u9fa5]{2,4})(?=[\s，,]+(?:男|女|\d{1,3}岁|性别))/g, (_match, name: string) => {
    if (name.length === 2) return `患者${name[0]}*`;
    if (name.length === 3) return `患者${name[0]}*${name[2]}`;
    return `患者${name[0]}**${name[3]}`;
  });

  return cleaned;
}

/**
 * Sanitizes a patient profile object before persisting or submitting to AI prompt
 */
export function sanitizePatientProfile<T extends Record<string, any>>(profile: T): T {
  if (!profile) return profile;

  const sanitized: Record<string, any> = { ...profile };

  if (typeof sanitized.rawReportText === 'string') {
    sanitized.rawReportText = sanitizeClinicalText(sanitized.rawReportText);
  }

  if (typeof sanitized.patientName === 'string') {
    const name = sanitized.patientName.trim();
    if (name.length <= 2) {
      sanitized.patientName = name ? `${name[0]}*` : '';
    } else {
      sanitized.patientName = `${name[0]}*${name.slice(-1)}`;
    }
  }

  if (typeof sanitized.phone === 'string') {
    sanitized.phone = sanitized.phone.replace(/\b(1[3-9]\d)\d{4}(\d{4})\b/g, '$1****$2');
  }
  if (typeof sanitized.mobile === 'string') {
    sanitized.mobile = sanitized.mobile.replace(/\b(1[3-9]\d)\d{4}(\d{4})\b/g, '$1****$2');
  }
  if (typeof sanitized.idCard === 'string') {
    sanitized.idCard = sanitized.idCard.replace(/\b(\d{6})\d{8}(\d{3}[\dXx])\b/g, '$1********$2');
  }
  if (typeof sanitized.idNumber === 'string') {
    sanitized.idNumber = sanitized.idNumber.replace(/\b(\d{6})\d{8}(\d{3}[\dXx])\b/g, '$1********$2');
  }
  if (typeof sanitized.inpatientNo === 'string') {
    sanitized.inpatientNo = sanitized.inpatientNo.slice(0, 2) + '****' + sanitized.inpatientNo.slice(-2);
  }
  if (typeof sanitized.inpatientId === 'string') {
    sanitized.inpatientId = sanitized.inpatientId.slice(0, 2) + '****' + sanitized.inpatientId.slice(-2);
  }
  if (typeof sanitized.hospitalId === 'string') {
    sanitized.hospitalId = sanitized.hospitalId.slice(0, 2) + '****' + sanitized.hospitalId.slice(-2);
  }
  if (typeof sanitized.mrn === 'string') {
    sanitized.mrn = sanitized.mrn.slice(0, 2) + '****' + sanitized.mrn.slice(-2);
  }

  return sanitized as T;
}
