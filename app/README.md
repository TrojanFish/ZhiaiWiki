# 知癌维基 ZhiaiWiki (OncoPath) · Web Application

本目录包含知癌维基全栈 Web 应用程序代码（基于 Next.js 16 App Router、TypeScript 与 TailwindCSS v4）。

## 快速上手 (Quick Start)

### 1. 安装依赖
```bash
npm install
```

### 2. 启动本地开发服务
```bash
npm run dev
```
打开浏览器访问 [http://localhost:3000](http://localhost:3000)。
管理中台入口：[http://localhost:3000/admin](http://localhost:3000/admin)。

### 3. 执行自动化测试套件
```bash
# 执行单元测试套件 (32 Suites, 466 Tests)
npm run test:unit

# 执行全量生产与红线仿真测试
npm test
```

### 4. 生产环境编译打包
```bash
npm run build
npm run start
```

## 核心技术栈
- **Framework**: Next.js 16.2.12 (Turbopack, SSR, Standalone)
- **Language**: TypeScript 5
- **Database / ORM**: PostgreSQL 16 (pgvector) + Prisma ORM 5.22
- **Styling**: TailwindCSS v4 + Lucide Icons + Healthicons
- **Testing**: Vitest 1.6
- **Multimodal AI**: Google Gemini 2.5 Flash SDK (`@google/genai`)
- **Official Medical API**: Europe PMC / PubMed MEDLINE REST API
- **Internationalization**: OpenCC 纯前端简繁转换引擎

## 详细技术文档与部署指南
请参阅根目录技术文档：
- 中文文档：[README.zh-CN.md](../README.zh-CN.md)
- 英文文档：[README.md](../README.md)
- 环境变量规范：[.env.example](../.env.example)
