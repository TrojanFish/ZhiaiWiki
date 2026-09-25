/**
 * OncoPath Local Pre-commit Guard (Superpowers Verification Gate)
 * Millisecond-level local interception for:
 * 1. PII Leaks (Unmasked Chinese ID numbers, mobile phone numbers)
 * 2. Plaintext Secrets & API Keys
 * 3. Cross-Cancer Domain Term Contamination (GGO/STAS in non-lung files)
 * 4. Strict TypeScript Type Check (Zero Error Gate)
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

console.log('\x1b[1m\x1b[34m[Pre-Commit Guard]\x1b[0m 启动本地提交前合规与类型安全门禁...');

let hasErrors = false;

// 1. 获取暂存区文件列表
let stagedFiles: string[] = [];
try {
  const output = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
  stagedFiles = output
    .split('\n')
    .map(f => f.trim())
    .filter(Boolean);
} catch (err) {
  console.warn('\x1b[33m[Warn]\x1b[0m 无法获取 git 暂存区文件，将检查本地工作区状态。');
}

if (stagedFiles.length === 0) {
  console.log('\x1b[32m[Pass]\x1b[0m 暂存区无文件，跳过内容扫描。');
} else {
  console.log(`\x1b[36m[Info]\x1b[0m 正在扫描暂存区的 ${stagedFiles.length} 个文件...`);

  // 正则规则库
  const ID_CARD_REGEX = /(?<!\d)[1-9]\d{5}(?:18|19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx](?!\d)/g;
  const PHONE_REGEX = /(?<!\d)1[3-9]\d{9}(?!\d)/g;
  const SECRET_REGEX = /(?:sk-[a-zA-Z0-9]{20,}|AIzaSy[a-zA-Z0-9_-]{33}|ghp_[a-zA-Z0-9]{36})/g;

  // 忽略扫描的文件或测试 mock
  const IGNORED_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.svg', '.ico', '.pdf', '.lock', '.json'];

  for (const file of stagedFiles) {
    // 拦截不小心暂存生产机密文件
    if (file.endsWith('.env') || file.endsWith('.env.local') || file.endsWith('.env.production')) {
      console.error(`\x1b[31m[FAIL - 机密泄露]\x1b[0m 严禁将本地机密文件 ${file} 提交至版本库！`);
      hasErrors = true;
      continue;
    }

    const ext = path.extname(file).toLowerCase();
    if (IGNORED_EXTENSIONS.includes(ext)) continue;

    // 检查文件实际存在性（处理删除文件的情况）
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, 'utf-8');

    // 1. PII 泄露检测（忽略测试文件中的测试桩）
    const isTestFile = file.includes('__tests__') || file.includes('.test.') || file.includes('.spec.');
    if (!isTestFile) {
      const idMatches = content.match(ID_CARD_REGEX);
      if (idMatches && idMatches.length > 0) {
        console.error(`\x1b[31m[FAIL - PII 泄露]\x1b[0m ${file} 疑似包含未经脱敏的 18 位身份证号码！`);
        hasErrors = true;
      }

      const phoneMatches = content.match(PHONE_REGEX);
      if (phoneMatches && phoneMatches.length > 0) {
        // 过滤掉常用版本号或纯数值混淆
        const realPhones = phoneMatches.filter(p => !p.startsWith('10000000000'));
        if (realPhones.length > 0) {
          console.error(`\x1b[31m[FAIL - PII 泄露]\x1b[0m ${file} 疑似包含未经脱敏的 11 位手机号码！`);
          hasErrors = true;
        }
      }
    }

    // 2. 明文 API Key 泄漏检测
    const secretMatches = content.match(SECRET_REGEX);
    if (secretMatches && secretMatches.length > 0) {
      console.error(`\x1b[31m[FAIL - 机密泄漏]\x1b[0m ${file} 检测到硬编码 API 密钥凭据！`);
      hasErrors = true;
    }

    // 3. 专科提示词跨域防穿模检测
    // 如果是胃癌、甲状腺、乳腺、结直肠专科的系统提示词或分期文件，禁止混入肺癌特有概念
    const isNonLungSpecialty = 
      (file.includes('gastric') || file.includes('thyroid') || file.includes('liver') || file.includes('esophageal')) &&
      (file.includes('Staging') || file.includes('Data') || file.includes('Plugin'));

    if (isNonLungSpecialty) {
      const lungKeywords = ['磨玻璃结节', '气腔播散', 'STAS', '肺叶切除', '脏层胸膜侵犯'];
      for (const kw of lungKeywords) {
        if (content.includes(kw)) {
          console.error(`\x1b[31m[FAIL - 专科穿模]\x1b[0m 非肺癌专科文件 ${file} 中检测到肺癌特有术语 "${kw}"，违反专科解耦规范！`);
          hasErrors = true;
        }
      }
    }
  }
}

// 4. 快速执行 TypeScript 类型检查 (Zero Error Gate)
console.log('\x1b[36m[Info]\x1b[0m 正在执行全项目严格类型安全检查 (tsc --noEmit)...');
try {
  const appDir = path.resolve(__dirname, '..');
  execSync('npx tsc --noEmit', { cwd: appDir, stdio: 'pipe' });
  console.log('\x1b[32m[Pass]\x1b[0m TypeScript 类型检查通过，0 Error。');
} catch (err: any) {
  console.error('\x1b[31m[FAIL - 类型错误]\x1b[0m TypeScript 静态类型检查失败！请修复所有编译错误后再提交：');
  if (err.stdout) console.error(err.stdout.toString());
  if (err.stderr) console.error(err.stderr.toString());
  hasErrors = true;
}

if (hasErrors) {
  console.error('\n\x1b[1m\x1b[31m[Pre-Commit Blocked]\x1b[0m 本地提交已被阻断，请按上述提示修复问题后重新 git commit。');
  console.error('（如遇极特殊应急情况，可使用 git commit --no-verify 绕过）\n');
  process.exit(1);
} else {
  console.log('\x1b[1m\x1b[32m[Pre-Commit Guard]\x1b[0m 全部安全与类型检查通过，允许提交。\n');
  process.exit(0);
}
