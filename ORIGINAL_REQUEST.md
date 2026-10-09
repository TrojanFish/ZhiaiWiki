# Original User Request

## 2026-10-09T02:00:56Z

ZhiaiWiki (知癌维基 / OncoPath) 平台生产环境上线前全方位完整审查与验收，识别并修复代码安全、临床循证防线、SSR水合稳定性、响应式交互及部署配置中的潜在缺陷，确保生产环境高可靠就绪。

Working directory: c:/Users/Administrator/Desktop/lung
Integrity mode: development

## Verification Resources
- 静态语法检查: `npm --prefix app run lint`
- TypeScript 类型门禁: `npx --prefix app tsc --noEmit`
- 生产安全合规扫描: `npm --prefix app run check:security`
- 临床与全栈仿真测试套件: `npm --prefix app test`
- 生产打包构建: `npm --prefix app run build`

## Requirements

### R1. 全面安全、PII 与临床防护栏审计及收敛
排查系统中的敏感数据处理、API 安全策略与临床安全红线。确保无凭证硬编码泄漏，患者 PII 数据脱敏合规，API 具有健全的输入校验与异常兜底；确保 DDI 药物相互作用检验、循证医学证据溯源及免责声明机制严密可靠。发现问题须直接实施源码级修复并回归。

### R2. 渲染稳定性与交互体验保障
排查 Next.js 16 + React 19 应用中潜在的 SSR 服务端/客户端水合不一致（Hydration Mismatch）隐患、浏览器控制台报错或关键路径渲染崩溃；排查多端响应式断点与安全区适配，消除视觉截断与交互异常。发现问题须直接实施源码级修复并回归。

### R3. 工程构建质量与全量测试门禁收敛
修复项目中所有的 TypeScript 类型错误、ESLint 规则违规与死代码。确保所有既有的单元测试与自动化仿真测试脚本全部执行通过且无断言失败。

### R4. 生产部署与运行就绪
检查 Dockerfile、部署配置、生产环境变量规范与静态资产策略，确保无致命缺漏，应用可安全无损地在生产环境构建并启动。输出一份清晰精炼的上线前审查总结报告。

## Acceptance Criteria

### 自动化构建与测试门禁
- [ ] `npm --prefix app run lint` 执行退出码为 0，无任何 error 报错
- [ ] `npx --prefix app tsc --noEmit` 执行退出码为 0，零 TypeScript 类型报错
- [ ] `npm --prefix app run check:security` 执行通过，无高危未处置安全漏洞
- [ ] `npm --prefix app test` 执行通过，所有自动化测试与临床仿真用例 100% 绿灯
- [ ] `npm --prefix app run build` 成功完成 Next.js 生产环境构建，无编译或水合阻断错误

### 交付物与修复闭环
- [ ] 针对审查中发现的所有阻断性及高危缺陷均已完成源码级修复并完成回归验证
- [ ] 输出清晰精炼的上线前审查与验收总结（涵盖排查发现、修改项、验证结果与生产就绪清单）
