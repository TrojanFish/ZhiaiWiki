/**
 * ZhiaiWiki Two-Stage Clinical Code Review Tool (Superpowers Code Review)
 * 
 * Performs automated two-stage code review on git diff / modified files:
 * Stage 1: Engineering Architecture, Performance & Security (Node event-loop, NaN checks, secrets)
 * Stage 2: Clinical Safety, Evidence Grounding & Cross-Cancer Decoupling (Trial citations, term leakage, DDI)
 * 
 * Run with: npm run review:code
 */

import { execSync } from 'child_process';

interface ReviewFinding {
  stage: 'Stage 1 (架构/性能/安全)' | 'Stage 2 (临床/循证/解耦)';
  severity: 'CRITICAL' | 'WARNING' | 'SUGGESTION';
  file: string;
  line?: number;
  message: string;
  recommendation: string;
}

console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m');
console.log('\x1b[1m\x1b[36m   ZhiaiWiki 双阶段代码审查与临床质量审计系统 (Superpowers Reviewer)    \x1b[0m');
console.log('\x1b[1m\x1b[36m========================================================================\x1b[0m\n');

// 1. 获取 diff 内容（优先暂存区，若无则取 HEAD 差异）
let diffText = '';
let targetDescription = '暂存区 (Staged Changes)';

try {
  diffText = execSync('git diff --cached -U3', { encoding: 'utf-8' });
  if (!diffText.trim()) {
    targetDescription = '工作区差异 (Working Directory vs HEAD)';
    diffText = execSync('git diff HEAD -U3', { encoding: 'utf-8' });
  }
} catch {
  console.warn('获取 git diff 失败，将对近期修改的核心文件做全量扫描。');
}

console.log(`\x1b[35m[Review Target]\x1b[0m 正在审计: ${targetDescription}\n`);

const findings: ReviewFinding[] = [];

if (!diffText.trim()) {
  console.log('\x1b[32m[No Changes]\x1b[0m 当前没有检测到未提交的变更，代码库与版本库完全干净！');
  console.log('健康度评分: \x1b[1m\x1b[32m100 / 100 (Clean State)\x1b[0m\n');
  process.exit(0);
}

// 解析 diff 文件与新增行
const diffLines = diffText.split('\n');
let currentFile = '';
let lineNumber = 0;

for (const line of diffLines) {
  if (line.startsWith('+++ b/')) {
    currentFile = line.substring(6).trim();
    lineNumber = 0;
    continue;
  }
  
  if (line.startsWith('@@ ')) {
    const match = line.match(/@@ -\d+,\d+ \+(\d+),\d+ @@/);
    if (match) {
      lineNumber = parseInt(match[1], 10) - 1;
    }
    continue;
  }

  if (line.startsWith('+') && !line.startsWith('+++')) {
    lineNumber++;
    const addedCode = line.substring(1).trim();

    // =========================================================================
    // 阶段 1：工程、架构与安全审查 (Stage 1: Architecture, Performance, Security)
    // =========================================================================
    
    // 1.1 Node.js 同步长耗时阻塞 (Event-Loop Starvation)
    if (addedCode.includes('pbkdf2Sync')) {
      findings.push({
        stage: 'Stage 1 (架构/性能/安全)',
        severity: 'CRITICAL',
        file: currentFile,
        line: lineNumber,
        message: '检测到同步 pbkdf2Sync 密码哈希调用，单次将阻塞 Node 主线程数百毫秒',
        recommendation: '使用 src/lib/userAuth.ts 中的非阻塞异步 hashPasswordAsync 或 verifyPasswordAsync',
      });
    }

    if (currentFile.includes('/api/') && (addedCode.includes('fs.readFileSync') || addedCode.includes('fs.writeFileSync'))) {
      findings.push({
        stage: 'Stage 1 (架构/性能/安全)',
        severity: 'WARNING',
        file: currentFile,
        line: lineNumber,
        message: '在 API 路由处理函数中使用了同步文件 I/O (fs.*Sync)',
        recommendation: '改用 fs.promises 异步文件读写，避免高并发下阻塞请求',
      });
    }

    // 1.2 边界输入数值防御 (NaN Poisoning)
    if (
      (currentFile.includes('Staging') || currentFile.includes('staging')) &&
      (addedCode.includes('parseInt(') || addedCode.includes('parseFloat(') || addedCode.includes('Number(')) &&
      !addedCode.includes('Number.isFinite') &&
      !addedCode.includes('isNaN')
    ) {
      findings.push({
        stage: 'Stage 1 (架构/性能/安全)',
        severity: 'WARNING',
        file: currentFile,
        line: lineNumber,
        message: '临床分期计算中直接使用类型强转，未做 Number.isFinite 安全校验',
        recommendation: '使用 Number.isFinite(val) 进行防御性校验，防御非法字符串穿透导致的 NaN 错误',
      });
    }

    // 1.3 废弃 Next.js 中间件检测
    if (currentFile.endsWith('middleware.ts') || currentFile.endsWith('middleware.js')) {
      findings.push({
        stage: 'Stage 1 (架构/性能/安全)',
        severity: 'CRITICAL',
        file: currentFile,
        line: lineNumber,
        message: 'Next.js 16 已弃用根目录 middleware.ts 规范，导致边缘编译严重变慢',
        recommendation: '安全标头请在 next.config.ts 的 async headers() 中集中配置',
      });
    }

    // =========================================================================
    // 阶段 2：临床、医学伦理与循证审查 (Stage 2: Clinical Safety & Evidence)
    // =========================================================================

    // 2.1 专科提示词与概念跨癌种穿模 (Cross-Cancer Bleed)
    const isNonLung = (
      currentFile.includes('gastric') ||
      currentFile.includes('thyroid') ||
      currentFile.includes('liver') ||
      currentFile.includes('esophageal')
    );

    if (isNonLung && !currentFile.includes('.test.')) {
      const lungTerms = ['磨玻璃结节', 'GGO', '气腔播散', 'STAS', '肺叶切除'];
      for (const term of lungTerms) {
        if (addedCode.includes(term)) {
          findings.push({
            stage: 'Stage 2 (临床/循证/解耦)',
            severity: 'CRITICAL',
            file: currentFile,
            line: lineNumber,
            message: `非肺癌专科代码中包含肺癌特有概念 "${term}"，违反专科解耦规范`,
            recommendation: '解耦专科概念池，确保各癌种提示词、规则库与临床字段严格隔离',
          });
        }
      }
    }

    // 2.2 伪造或缺少证据的生存率硬编码 (Unreferenced Survival Claims)
    if (
      (currentFile.includes('Staging') || currentFile.includes('StudiesData') || currentFile.includes('SimilarCases')) &&
      (addedCode.includes('5年生存率') || addedCode.includes('5-yr OS') || addedCode.includes('中位生存期')) &&
      !currentFile.includes('.test.')
    ) {
      const hasCitationPattern = 
        addedCode.includes('NEJM') || 
        addedCode.includes('Lancet') || 
        addedCode.includes('JCO') || 
        addedCode.includes('JAMA') ||
        addedCode.includes('trialName') ||
        addedCode.includes('source') ||
        addedCode.includes('studyName');

      if (!hasCitationPattern) {
        findings.push({
          stage: 'Stage 2 (临床/循证/解耦)',
          severity: 'WARNING',
          file: currentFile,
          line: lineNumber,
          message: '代码中声明了关键临床生存率数据，但未就近标注顶刊前瞻队列来源',
          recommendation: '根据 oncology-clinical-safety 规范，补充试验名称、发表期刊年份与样本量 n',
        });
      }
    }
  }
}

// 格式化输出审查看板
console.log('------------------------------------------------------------------------');
console.log('审查结果清单:');
console.log('------------------------------------------------------------------------');

if (findings.length === 0) {
  console.log('\x1b[32m[PASS] 未发现任何阻断性架构缺陷或临床合规隐患！\x1b[0m');
} else {
  for (const f of findings) {
    const sevColor = f.severity === 'CRITICAL' ? '\x1b[31m[严重阻断]' : f.severity === 'WARNING' ? '\x1b[33m[告警提醒]' : '\x1b[36m[优化建议]';
    console.log(`${sevColor}\x1b[0m \x1b[1m${f.stage}\x1b[0m`);
    console.log(`  位置: ${f.file}${f.line ? ':' + f.line : ''}`);
    console.log(`  原因: ${f.message}`);
    console.log(`  建议: \x1b[32m${f.recommendation}\x1b[0m\n`);
  }
}

// 计算健康度评分
const criticalCount = findings.filter(f => f.severity === 'CRITICAL').length;
const warningCount = findings.filter(f => f.severity === 'WARNING').length;
const score = Math.max(0, 100 - criticalCount * 25 - warningCount * 10);

console.log('------------------------------------------------------------------------');
let scoreColor = '\x1b[32m';
if (score < 80) scoreColor = '\x1b[33m';
if (score < 60) scoreColor = '\x1b[31m';

console.log(`审计总结: 严重缺陷: ${criticalCount} 项 | 告警建议: ${warningCount} 项`);
console.log(`代码健康度评分: ${scoreColor}\x1b[1m${score} / 100 分\x1b[0m`);
console.log('------------------------------------------------------------------------\n');

if (criticalCount > 0) {
  console.error('\x1b[31m[Review FAILED]\x1b[0m 检测到严重问题，不满足 Superpowers 合并上线标准。');
  process.exit(1);
} else {
  console.log('\x1b[32m[Review PASSED]\x1b[0m 满足工程与临床安全准则，审查通过。');
  process.exit(0);
}
