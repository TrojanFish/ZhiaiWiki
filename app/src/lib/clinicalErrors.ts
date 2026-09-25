/**
 * ZhiaiWiki Clinical Error & Rate Limiting Empathy Engine
 * Transforms mechanical HTTP 429, quota exhaustion, and API exceptions
 * into compassionate, reassuring, and actionable clinical guidance.
 */

export interface ClinicalErrorInfo {
  title: string;
  message: string;
  isRateLimit: boolean;
  retryAfter: number; // in seconds
  suggestion?: string;
  badge?: string;
}

export const CLINICAL_RATE_LIMIT_MESSAGES = {
  generate: {
    title: "AI 循证医学算力资源调度中",
    badge: "医学推理高负载保护 · 算力队列调度中",
    message: "为保障每一份临床病理报告的多学科推演精度与前瞻文献交叉检索深度，系统当前正在进行密集的医学文献检索与高精度循证运算。为确保为您提供最严谨的临床随访与治疗指引，AI 算力通道已启动微歇缓冲保护，预计约 60 秒后通道重新就绪。",
    suggestion: "在此缓冲期间，建议您先查阅下方已生成的【门诊就医问诊便签卡】或前往【循证百科】查阅专科科普词条，知癌维基将持续守护您的健康旅程。",
    retryAfter: 60,
  },
  parse: {
    title: "多模态影像病理结构化引擎缓冲中",
    badge: "多模态解析负载保护 · 算力队列调度中",
    message: "医学影像与病理报告的多模态跨模态提取需经历光学字符高精识别、解剖器官定位及国际指南质控校验，当前同时段解析队列繁忙。为了确保您上传的每一项临床指标提取万无一失，AI 算力引擎正在进行短暂调度缓冲，预计约 60 秒后通道重新就绪。",
    suggestion: "如果您时间紧急，也可以直接点击下方【手动核对/录入指标】，快速补充关键病理分期数值，跳过排队等待。",
    retryAfter: 60,
  },
  auth: {
    title: "账户安全访问保护提示",
    badge: "账号安全防护 · 请求频率保护",
    message: "为了保障您的医疗健康档案与账户隐私安全，系统检测到连续验证尝试已达到安全保护阈值。防护机制已生效，请稍候休息 15 分钟后再试。",
    suggestion: "如忘记密码，请稍后重试或使用已绑定的安全邮箱重新登录。",
    retryAfter: 900,
  },
  evidence: {
    title: "文献检索通道缓冲中",
    badge: "文献检索调度 · 接口频率保护",
    message: "国际前瞻性医学文献检索与 PubMed/Europe PMC 数据同步通道当前访问较密集，接口正在进行短暂调度缓冲，请稍候约 60 秒后重试。",
    suggestion: "您也可以直接查阅本地缓存的精选顶刊文献库。",
    retryAfter: 60,
  }
};

export function getClinicalRateLimitMessage(context: 'generate' | 'parse' | 'auth' | 'evidence' = 'generate'): ClinicalErrorInfo {
  const item = CLINICAL_RATE_LIMIT_MESSAGES[context] || CLINICAL_RATE_LIMIT_MESSAGES.generate;
  return {
    title: item.title,
    message: item.message,
    isRateLimit: true,
    retryAfter: item.retryAfter,
    suggestion: item.suggestion,
    badge: item.badge
  };
}

/**
 * Checks whether an error (or error message) indicates rate limiting, quota exhaustion, or compute queue buffering.
 */
export function isRateLimitOrQuotaError(error: any): boolean {
  if (!error) return false;
  const str = typeof error === 'string' ? error : (error.message || error.error || error.detail || JSON.stringify(error));
  return /429|quota|resource_exhausted|resource has been exhausted|too many requests|rate limit|过于频繁|请求频繁|解析频繁|调度缓冲|算力队列|资源调度/i.test(str);
}

/**
 * Translates raw exceptions (such as Gemini 429, GoogleGenerativeAI Error, network dropouts)
 * into comforting, patient-first clinical guidance.
 */
export function formatClinicalAiError(
  error: any, 
  context: 'generate' | 'parse' | 'auth' | 'evidence' = 'generate'
): ClinicalErrorInfo {
  if (!error) {
    return {
      title: "提示信息",
      message: "服务暂时遇到微小波动，请稍后重试。",
      isRateLimit: false,
      retryAfter: 0,
      badge: "系统提示"
    };
  }

  const rawMsg = typeof error === 'string' ? error : (error.message || error.error || error.detail || String(error));

  // 1. Quota exhaustion or 429 rate limit
  if (isRateLimitOrQuotaError(error)) {
    return getClinicalRateLimitMessage(context);
  }

  // 2. Safety filter triggered
  if (/safety|blocked|harmful|candidate/i.test(rawMsg)) {
    return {
      title: "医学合规安全保护提示",
      badge: "医疗内容合规防护",
      message: "上传的病理文本或影像在进行医学大模型合规筛查时触发了内容安全过滤。为保障患者权益与信息安全，建议您核实报告内容是否包含非诊疗文本，或切换为手动录入病理分期指标。",
      suggestion: "您可以在个人中心直接勾选 T/N/M 分期与免疫组化指标。",
      isRateLimit: false,
      retryAfter: 0,
    };
  }

  // 3. Network or timeout issues
  if (/fetch failed|econnrefused|etimedout|timed out|network|timeout/i.test(rawMsg)) {
    return {
      title: "网络连接微弱提示",
      badge: "网络链路波动",
      message: "与医学循证智能服务器的通信遇到瞬时网络延迟或连接抖动。您的病理档案已妥善保存在本地，不会丢失。",
      suggestion: "请检查网络信号或 Wi-Fi 连接后，点击重新尝试。",
      isRateLimit: false,
      retryAfter: 0,
    };
  }

  // 4. Fallback for other errors - clean and remove raw technical prefixes
  const cleanMsg = rawMsg
    .replace(/^\[GoogleGenerativeAI Error\]:\s*/i, "")
    .replace(/^Error:\s*/i, "");

  return {
    title: "临床智能服务提示",
    badge: "服务提示",
    message: cleanMsg.length > 200 ? "分析计算过程中遇到瞬时波动，建议您稍后重新尝试。" : cleanMsg,
    suggestion: "若持续遇到问题，您可以随时在个人中心使用手动核对功能。",
    isRateLimit: false,
    retryAfter: 0,
  };
}
