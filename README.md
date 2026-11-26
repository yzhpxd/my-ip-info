# 🌐 我的 IP 信息 (My IP Info)

> 一套高性能的 IP 情报与网络连接诊断工具，基于统一的 Cloudflare Worker（含静态资源）构建。
>
> 🚀 **网站**：[https://ip.666200.xyz](https://ip.666200.xyz)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-F38020?logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Hono](https://img.shields.io/badge/Hono-E36002?logo=hono&logoColor=white)](https://hono.dev)
[![React 19](https://img.shields.io/badge/React_19-20232A?logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PWA Ready](https://img.shields.io/badge/PWA-Ready-5A0FC8?logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Biome](https://img.shields.io/badge/Linter-Biome-60a5fa?logo=biome&logoColor=white)](https://biomejs.dev)

大多数 IP 查询工具只查询一台远程服务器。**我的 IP 信息**会在你自建的 **Cloudflare 边缘后端**、公开 API（`Cloudflare Trace`、`ipify`、`ipwho.is`、`IP.SB`、`ip.guide`、`SeeIP`、`icanhazip.com`、`IPIP.net`）和浏览器 **WebRTC STUN 候选地址**之间交叉验证 IP 数据，用于检测 VPN/代理泄漏、排查不同地理位置数据库之间的坐标差异，并测量实时延迟。

---

## ✨ 功能

- ⚡ **统一的 Cloudflare Worker**：前端（React SPA）与边缘 API（Hono）在同一域名下一起部署。静态资源通过 Cloudflare 边缘缓存提供（免费且不限量），API 请求在边缘运行。
- ⚡ **零延迟边缘智能**：直接从边缘 TLS 连接自动提取城市、地区、坐标、ASN（`AS6327`）、ISP 机构和机场数据中心代码（`colo`），无需查询外部数据库。
- 🗺️ **地理位置汇聚地图**：交互式深色 Leaflet 地图，标出各服务商报告的坐标，直观展示数据库之间的差异。
- 🛡️ **双栈 WebRTC 与 DNS 泄漏检测**：查询 STUN ICE 候选地址（IPv4/IPv6），解析一次性随机子域名，揭示上游 DNS 解析器并检测 VPN/代理泄漏。
- 📜 **本地 IP 连接历史**：100% 设备本地的时间线记录，自动去重、手动快照，并支持安全的 CSV / JSON 数据导出。
- ⚙️ **自定义端点与服务商开关**：在应用设置中启用或禁用指定的公开服务商，或注册用户自定义的私有后端端点。
- ⏱️ **延迟与网络基准测试**：测量到全球 Anycast 边缘节点的往返时间（RTT）。
- 📱 **渐进式 Web 应用（PWA）**：可直接从浏览器安装到桌面和手机，支持独立窗口、离线界面缓存，网络重连后自动重新查询。
- 🤖 **AI 智能体与 SEO 就绪**：实现 [`/llms.txt`](https://ip.666200.xyz/llms.txt) 与 [`/llms-full.txt`](https://ip.666200.xyz/llms-full.txt) 机器可读标准、高清 Open Graph / Twitter 预览卡片、Schema.org `WebApplication` 与 `FAQPage` JSON-LD 结构化数据、XML 站点地图（`/sitemap.xml`），以及为爬虫准备的预渲染语义化 HTML 备用内容。

---

## 📱 渐进式 Web 应用（PWA）

**我的 IP 信息**可直接安装为独立的桌面或移动应用，无需通过第三方应用商店。

### 为什么使用 PWA？
- **零应用商店门槛**：无需在 Apple App Store 或 Google Play Store 中搜索、下载或验证，即可立即安装。
- **跨平台一致体验**：基于同一套 Web 标准，在 macOS、Windows、Linux、iOS 和 Android 上提供统一的原生应用体验。
- **快速启动与离线外壳**：应用外壳静态资源（HTML、CSS、JS、字体与图标）通过 Workbox Service Worker 预缓存到本地，即使在缓慢或不稳定的网络下也能近乎即时加载。
- **始终新鲜的网络诊断**：专门设计了严格的缓存清除与 API 绕过规则（`navigateFallbackDenylist`），动态 IP 与地理位置查询绝不会返回过期缓存。窗口聚焦与网络重连的实时监听会在你切换 VPN 或 Wi-Fi 网络时自动重新探测 IP。

### 如何安装与使用
- **桌面端（Chrome / Edge / Brave / Opera）**：点击浏览器地址栏中的**安装**图标（或打开菜单 `...` → **安装我的 IP 信息**）。应用会在自己专用的无边框桌面窗口中启动，并可固定到 Dock 或任务栏。
- **桌面端（macOS Sonoma+ 上的 Safari）**：点击**文件** → **添加到程序坞**。
- **移动端（iOS Safari）**：点击**分享**按钮（带向上箭头的方框）→ 向下滚动，点击**添加到主屏幕**。
- **移动端（Android Chrome）**：点击菜单 `⋮` → 选择**添加到主屏幕**或**安装应用**。

---

## 📁 项目结构

```text
my-ip-info/
├── src/
│   ├── client/       # React SPA (components, hooks, styling)
│   ├── server/       # Cloudflare Worker entrypoint & Hono API (/api/v1/*, CLI detection)
│   └── shared/       # Shared TypeScript types and IP utilities
├── public/           # Static assets, favicon, redirects
├── test/             # Unit tests (node:test)
├── index.html        # SPA entry HTML
├── vite.config.ts    # Client build configuration
├── wrangler.toml     # Unified Cloudflare Worker configuration with [assets]
└── Dockerfile        # Standalone Node/Docker server image
```

---

## 🚀 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 本地运行

```bash
# Boot frontend (http://localhost:5173) and Cloudflare Worker (http://localhost:8787) concurrently
pnpm dev

# Or run services individually:
pnpm dev:client  # Vite SPA with HMR (proxies /api to :8787)
pnpm dev:worker  # Cloudflare Worker via Wrangler / workerd
pnpm dev:node    # Standalone Node.js server (:3000)
```

### 3. 测试与代码质量

原生 git pre-commit 钩子（`.githooks/pre-commit`）会在提交前自动用 Biome 通过 `lint-staged` 格式化并检查已暂存的改动、运行 TypeScript 类型检查，并执行单元测试：

```bash
pnpm test           # Run 51 unit tests across core, worker pipeline, and providers
pnpm test:coverage  # Run tests with V8 code coverage report
pnpm typecheck      # Validate TypeScript types without emit
pnpm lint           # Check code against Biome rules
pnpm lint:fix       # Automatically apply Biome safe fixes
pnpm format         # Format codebase with Biome
pnpm format:check   # Verify code formatting
pnpm pre-commit     # Run pre-commit checks on staged files (lint-staged)
```

---

## ☁️ 部署

部署**不需要任何环境变量**：

```bash
# Build frontend and deploy unified worker
pnpm deploy
```

Wrangler 会通过浏览器完成认证，或使用你标准的 `CLOUDFLARE_API_TOKEN` 环境变量。

### 密钥与 API Key（例如 IP2Location）

Cloudflare Workers 会将本地开发环境变量与已部署的生产密钥隔离开：
- **本地开发**：`wrangler dev` 会自动读取 `.env`。
- **生产部署**：`wrangler deploy` 不会上传 `.env`。要直接从 `.env` 上传密钥而无需手动输入：
  ```bash
  pnpm run secret:ip2location
  ```
  也可以通过 Cloudflare 控制台添加密钥（**Workers & Pages > my-ip-info > Settings > Variables and Secrets**）。

### 自定义域名（可选）

要在 Cloudflare 区域中绑定自定义域名，取消 `wrangler.toml` 中路由的注释：

```toml
routes = [
  { pattern = "ip.yourdomain.com", custom_domain = true }
]
```

Cloudflare Workers 会自动配置 DNS 记录并签发 SSL 证书，无需任何外部工具。

---

## 🗑️ 卸载

要删除已部署的 Worker 及其资源：

```bash
pnpm undeploy # or: npx wrangler delete
```

---

## 📡 API 参考

所有后端 API 路由均以 `/api/v1` 为版本前缀，由 `https://ip.666200.xyz` 提供：

| 路由 | 方法 | 内容类型 | 说明 |
| :--- | :---: | :--- | :--- |
| `/` | `GET` | `text/html` or `text/plain` | 向浏览器提供 React SPA（`https://ip.666200.xyz`）；通过 Cloudflare Worker 向命令行工具返回原始客户端 IP（`curl -sL https://ip.666200.xyz`） |
| `/ip` | `GET` | `text/plain; charset=utf-8` | 返回原始公网 IP 的简写端点，带有防御性安全头（`curl -sL https://ip.666200.xyz/ip`） |
| `https://ip.666200.xyz/api/v1/info` | `GET` | `text/plain` or `application/json` or `text/yaml` | 智能内容协商：对命令行返回纯文本，对浏览器返回 JSON。支持显式查询参数覆盖：`?format=json`、`?format=yaml`、`?format=text`、`?format=ip` |
| `https://ip.666200.xyz/api/v1/ip` | `GET` | `text/plain; charset=utf-8` | 返回原始客户端公网 IP 地址，末尾带换行符 |
| `https://ip.666200.xyz/api/v1/geo` | `GET` | `application/json` | 地理位置数据（城市、地区、国家、经纬度、ASN、数据中心 colo） |
| `https://ip.666200.xyz/api/v1/yaml` | `GET` | `text/yaml; charset=utf-8` | 以安全的 YAML 格式呈现客户端元数据与网络详情 |
| `https://ip.666200.xyz/api/v1/health`| `GET` | `application/json` | 健康检查端点，返回状态与服务商标识 |
| `/llms.txt` | `GET` | `text/plain; charset=utf-8` | 面向大语言模型、搜索引擎与 AI 智能体的机器可读上下文摘要 |
| `/llms-full.txt` | `GET` | `text/plain; charset=utf-8` | 详尽的技术规范、API 结构与诊断算法，供 AI 推理使用 |
| `/sitemap.xml` | `GET` | `application/xml` | 面向搜索引擎爬虫的 XML 站点地图 |
| `/robots.txt` | `GET` | `text/plain` | 爬虫与 AI 机器人的访问策略 |

---

## 📄 许可证

MIT 许可证。欢迎贡献与 PR！
