<div align="center">
  <img src="https://raw.githubusercontent.com/TrojanFish/OncoPath/main/app/public/logo.png" width="90" alt="知癌维基 ZhiaiWiki Logo">
  <h1>知癌维基 ZhiaiWiki (OncoPath)</h1>
  <p><strong>多癌种全病程循证医学知识平台 & 临床就医决策支持系统</strong></p>
  <p><em>涵盖 8 大高发实体瘤，基于顶级临床同行评审文献、AJCC/IASLC 指南与真实多中心队列的严肃医学循证推演平台</em></p>

  <p>
    <a href="README.md"><strong>English Documentation</strong></a> |
    <a href="README.zh-CN.md"><strong>中文技术文档</strong></a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-16.2.12-blue?style=flat-square&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/Vitest-30_Suites_446_Passed-success?style=flat-square&logo=vitest" alt="Vitest" />
    <img src="https://img.shields.io/badge/Cancer_Types-8_Major_Tumors-rose?style=flat-square" alt="8 Cancers" />
    <img src="https://img.shields.io/badge/PubMed-Europe_PMC_API-blueviolet?style=flat-square" alt="PubMed API" />
    <img src="https://img.shields.io/badge/PostgreSQL-16_pgvector-336791?style=flat-square&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Nginx-SSE_Streaming-009639?style=flat-square&logo=nginx" alt="Nginx" />
    <img src="https://img.shields.io/badge/TailwindCSS-v4-38bdf8?style=flat-square&logo=tailwindcss" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/PIPL-Privacy_Compliant-10b981?style=flat-square" alt="PIPL" />
    <img src="https://img.shields.io/badge/Docker-Production_Ready-2496ED?style=flat-square&logo=docker" alt="Docker" />
    <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
  </p>
</div>

---

## 🌟 核心理念与医学原则 (Medical Philosophy)

知癌维基 (ZhiaiWiki) 致力于打破前沿肿瘤医学与患者/家属之间的认知壁垒，坚决恪守 **“循证第一，AI 辅助 (Evidence-First, AI-Second)”** 临床原则：

1. **杜绝 AI 幻觉与确定性算命**：核心 TNM 分期、高危复发因子、药物相互作用与指南路径全部采用确定性代码硬编码入库，严禁大语言模型擅自推测生存寿命或开具越权处方。
2. **100% 官方数据库与同行评审顶刊溯源**：直连 Europe PMC / MEDLINE / PubMed 官方数据库，所有风险比（HR）、5年无复发生存率（RFS）均来自 Lancet、JCO、JTO、NEJM、Chest 等顶刊临床试验，每条结论配备真实 DOI 与 PubMed 检索号直达链接。
3. **8 大高发实体瘤全覆盖**：全面支持肺癌、乳腺癌、结直肠癌、胃癌、肝癌、食管癌、甲状腺癌、前列腺癌的精准病理分期、危险度分层与证据对照。
4. **知情同意与门诊就医协同**：生成符合三甲医院规范的《门诊就医沟通便签卡》与 A4 打印单，赋能患者在复查门诊与主治医生高效沟通。

---

## ✨ 核心特性与系统架构 (Core Features)

### 1. 🧬 8 大实体瘤精准分期推演引擎
- **涵盖癌种**：🫁 肺癌 · 🎀 乳腺癌 · 🎗️ 结直肠癌 · 🥣 胃癌 · 🩺 肝癌 · 🥤 食管癌 · 🦋 甲状腺癌 · 🛡️ 前列腺癌。
- **确定性临床规则库**：集成 AJCC 第 8/9 版、CSCO、NCCN 指南与组织病理学标准（如肺癌 mGGO 实性成分折算/STAS/VPI，乳腺癌 TNBC/HR+/HER2 分型，结肠直肠 CRM/TNM，甲状腺 ATA 危险分层）。
- **多模态病理智能提取**：支持手机拍照上传或病理文本粘贴，毫秒级提取 TNM 分期、组织分级、浸润深度与驱动基因突变。

### 2. 🔬 临床证据中台与官方 API 对接 (Admin Evidence Studio)
- **管理中台访问路径**：`/admin`，内置防暴力破解（15分钟限流）与 HMAC-SHA256 会话双通道鉴权。
- **PubMed / Europe PMC 官方接口直连**：对接欧洲生物信息研究所（EMBL-EBI）开放科研 API，支持通过 PMID/DOI 秒级拉取 MEDLINE 核心期刊论文，开箱即用、免申请 Key。
- **Gemini 多模态深度解析**：支持直接上传 Lancet/JCO 原文 PDF，大模型自动结构化提炼 17 项临床终点指标（样本量、HR、95% CI、5年RFS、靶点、干预组对比）。
- **人机协同复核 (Human-in-the-Loop)**：支持专家逐项二次校对微调并沉淀至 PostgreSQL 数据库。
- **平滑离线降级支持**：本地开发未启动数据库时，系统自动切换为演示模式，保证文献在线检索、AI 提炼与爱心审核均可顺畅体验。

### 3. 💊 肿瘤药物相互作用 (DDI) 排查引擎
- 涵盖奥希替尼、阿美替尼、曲妥珠单抗、帕博利珠单抗等百余种抗肿瘤靶向药/免疫抑制剂。
- 精准拦截与抑酸剂（PPI/H2RA）、CYP3A4 诱导剂/抑制剂、抗凝药、中药制剂的临床禁忌与给药时间隔离方案。

### 4. 📚 循证视觉百科 (Wiki) 与社交传播
- **全癌种深度临床图解词条**：涵盖结节生长演化、免疫副反应、术后淋巴水肿护理、造口康复等全周期。
- **门诊提问小抄一键同步**：词条疑问一键收藏，无缝汇入门诊就医便签卡。
- **2x Retina 视网膜级微信长图分享**：纯前端无损光栅化渲染，生成全量不截断的高清科普海报长图。

### 5. ❤️ 爱心公益与统一四大子页面
- 规范化全站页面与法律保障：`关于我们` (`/about`)、`抗癌爱心接力` (`/love-relay`)、`免责声明` (`/terms`)、`隐私政策` (`/privacy`)。
- **微信爱心接力墙与单号人工核验闭环**：病友扫码微信赞赏后填写的祈福寄语，管理员在后台输入微信账单单号末 4 位核对，一键点亮金色认证勋章。数据本地持久化存储（`data/love_relay.json`），免数据库依赖。

### 6. 🌐 国际化与安全隐私防护
- **全站简繁中文自适应转换 (`LangSwitch`)**：内置 OpenCC 纯前端简繁引擎，面向港澳台与海外华人社区，全 DOM、流式报告与图谱秒级平滑转换。
- **数据隐私合规 (PIPL / HIPAA 标准)**：内置 PII 脱敏算法，自动屏蔽身份证号、手机号、住院号；提供一键彻底销毁患者本地档案的被遗忘权保障。
- **生产级 Nginx 流式代理调优**：支持 `CF-Connecting-IP` 真实访客还原，为 Server-Sent Events (SSE) 流式打字机关闭内部缓冲，配置 1 年静态缓存与 IP 防刷限流。

---

## 🧪 自动化测试与工程质量保障 (Test Suite)

知癌维基内置严苛的自动化测试体系，覆盖临床规则、DDI 排查、鉴权安全与多癌种逻辑：

```bash
cd app
npm run test:unit
```

```text
 ✓ src/__tests__/staging.test.ts                        (38 tests) - 肺癌 AJCC/IASLC 9th TNM 分期
 ✓ src/__tests__/breastStaging.test.ts                  (43 tests) - 乳腺癌分子亚型与组织学分期
 ✓ src/__tests__/colorectalStaging.test.ts              (30 tests) - 结直肠癌 TNM 与高危病理
 ✓ src/__tests__/gastricStaging.test.ts                 (28 tests) - 胃癌浸润深度与淋巴结转移
 ✓ src/__tests__/liverStaging.test.ts                   (32 tests) - 原发性肝癌 CNLC 分期与血管侵犯
 ✓ src/__tests__/esophagealStaging.test.ts              (28 tests) - 食管癌解剖分段与分期
 ✓ src/__tests__/thyroidStaging.test.ts                 (20 tests) - 甲状腺癌危险分层与术式
 ✓ src/__tests__/gynecologicDdi.test.ts                 (17 tests) - 妇科肿瘤药物相互作用
 ✓ src/__tests__/colorectalDdi.test.ts                  (15 tests) - 结直肠癌靶向化疗 DDI
 ✓ src/__tests__/breastDdi.test.ts                      (11 tests) - 乳腺癌内分泌靶向 DDI
 ✓ src/__tests__/adminAuth.test.ts                      (8 tests)  - 管理中台 HMAC 鉴权与防伪造
 ✓ src/__tests__/userAuth.test.ts                       (6 tests)  - PBKDF2 哈希与 Cookie 安全
 ✓ src/__tests__/securityAccessControl.test.ts          (6 tests)  - 生产级越权阻断与脱敏
 ... (共 30 个测试套件)

 Test Files  30 passed (30)
      Tests  446 passed (446)
   Duration  45.51s
```

---

## 🐳 VPS 生产环境一键部署指南 (VPS Runbook)

### 1. 服务器环境准备 (Ubuntu / Debian / CentOS)
登录您的 Linux VPS 终端，确保已安装 Docker 和 Docker Compose：

```bash
# 更新系统依赖并安装 Docker
sudo apt update && sudo apt install -y git curl docker.io docker-compose-v2
sudo systemctl enable --now docker
```

### 2. 云服务器安全组与端口配置
在云厂商控制台（阿里云/腾讯云/AWS/华为云）安全组入方向放行：
* **`80`** (HTTP) 与 **`443`** (HTTPS) - 生产 Nginx 统一接入网关

### 3. 克隆代码仓库
```bash
git clone https://github.com/TrojanFish/OncoPath.git
cd OncoPath
```

### 4. 配置生产环境变量 (`.env`)
```bash
cp .env.example .env
nano .env
```
修改核心生产参数：
```env
# 必填：Google Gemini API Key (用于多模态报告提取与 AI 报告生成)
GEMINI_API_KEY="AIzaSyYourActualApiKeyHere"

# 必填：生产环境管理员强密码（生产环境禁止使用默认弱密码）
ADMIN_PASSWORD="YourStrongAdminPassword2026!"

# 必填：生产环境数据库密码
POSTGRES_PASSWORD="YourStrongDbPassword2026!"

# 站点公开基准 URL
NEXT_PUBLIC_APP_URL="https://zhiaiwiki.org"
```

### 5. 一键构建并启动生产集群
```bash
docker compose -f docker-compose.prod.yml up -d --build
```
> 💡 **架构说明**：该命令会自动启动 **PostgreSQL 16 数据库**、**Next.js 16 Web 引擎** 与 **Nginx 生产反向代理**，挂载独立数据卷持久化数据库及爱心接力数据，并在容器就绪后自动推送 Prisma 表结构与种子数据。

### 6. 验证健康状态
```bash
# 查看容器状态（应全部显示 Up healthy）
docker compose -f docker-compose.prod.yml ps

# 测试生产健康探针
curl http://localhost/api/health
```
打开浏览器访问：`http://您的VPS公网IP` 即可进入知癌维基；访问 `/admin` 使用管理员账号登录中台。

---

## 💻 本地开发与调试 (Local Development)

```bash
# 1. 进入 Web 目录
cd app

# 2. 安装依赖并启动开发服务 (Turbopack 加速)
npm install
npm run dev

# 3. 运行自动化单元测试
npm run test:unit
```
* 患者前台：打开浏览器访问 [http://localhost:3000](http://localhost:3000)
* 管理中台：访问 [http://localhost:3000/admin](http://localhost:3000/admin)（本地开发初始凭据已提供一键填入：`admin` / `OncoPath2026!`）

---

## 🛡️ 临床合规与医学免责声明 (Disclaimer)

1. 知癌维基 (ZhiaiWiki / OncoPath) 严格遵守 **AJCC 第 8/9 版** 肿瘤 TNM 分期及 **CSCO / NCCN / ESMO** 临床实践指南。
2. 本平台定位为**严肃循证医学知识检索与医患沟通协同工具**，所有统计效应量来源于公开发表的同行评审学术论文，**不构成任何直接的个体化临床诊断结论或处方用药建议**。
3. 任何关于手术方式选择、辅助化疗方案、靶向耐药后线更换或随访周期的决策，均须严格遵循专科主治医生的线下面诊诊断意见。

---

## 📝 开源协议
本项目采用 [MIT License](LICENSE) 授权开源。
