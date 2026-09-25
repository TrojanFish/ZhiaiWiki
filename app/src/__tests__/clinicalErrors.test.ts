import { describe, it, expect } from 'vitest';
import { 
  formatClinicalAiError, 
  getClinicalRateLimitMessage, 
  isRateLimitOrQuotaError 
} from '../lib/clinicalErrors';

describe('Clinical Errors & Empathetic Rate Limiting Engine', () => {
  it('correctly identifies rate limit and quota exhaustion errors', () => {
    expect(isRateLimitOrQuotaError('429 Too Many Requests')).toBe(true);
    expect(isRateLimitOrQuotaError('[GoogleGenerativeAI Error]: Resource has been exhausted (e.g. check quota).')).toBe(true);
    expect(isRateLimitOrQuotaError('RESOURCE_EXHAUSTED')).toBe(true);
    expect(isRateLimitOrQuotaError('您在短时间内请求过于频繁，请稍候 1 分钟后重试。')).toBe(true);
    expect(isRateLimitOrQuotaError('解析请求过于频繁，请稍候 1 分钟后重试。')).toBe(true);
    expect(isRateLimitOrQuotaError('普通网络错误')).toBe(false);
  });

  it('translates quota exhaustion to warm clinical guidance for report generation', () => {
    const rawError = new Error('[GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/... [429 Too Many Requests] Resource has been exhausted (e.g. check quota).');
    const result = formatClinicalAiError(rawError, 'generate');

    expect(result.isRateLimit).toBe(true);
    expect(result.retryAfter).toBe(60);
    expect(result.title).toBe('AI 循证医学算力资源调度中');
    expect(result.message).toContain('为保障每一份临床病理报告的多学科推演精度');
    expect(result.suggestion).toContain('门诊就医问诊便签卡');
  });

  it('translates rate limit for multimodal report parsing', () => {
    const rawError = { message: '解析请求过于频繁，请稍候 1 分钟后重试。' };
    const result = formatClinicalAiError(rawError, 'parse');

    expect(result.isRateLimit).toBe(true);
    expect(result.retryAfter).toBe(60);
    expect(result.title).toBe('多模态影像病理结构化引擎缓冲中');
    expect(result.message).toContain('医学影像与病理报告的多模态跨模态提取');
    expect(result.suggestion).toContain('手动核对/录入指标');
  });

  it('translates safety filter blocks to clinical compliance guidance', () => {
    const rawError = new Error('Candidate was blocked due to safety settings');
    const result = formatClinicalAiError(rawError, 'generate');

    expect(result.isRateLimit).toBe(false);
    expect(result.title).toBe('医学合规安全保护提示');
    expect(result.message).toContain('内容安全过滤');
  });

  it('translates network dropouts reassuringly', () => {
    const rawError = new Error('TypeError: fetch failed');
    const result = formatClinicalAiError(rawError, 'generate');

    expect(result.isRateLimit).toBe(false);
    expect(result.title).toBe('网络连接微弱提示');
    expect(result.message).toContain('您的病理档案已妥善保存在本地');
  });

  it('provides standard rate limit messages directly', () => {
    const res = getClinicalRateLimitMessage('generate');
    expect(res.title).toBe('AI 循证医学算力资源调度中');
    expect(res.retryAfter).toBe(60);
  });
});
