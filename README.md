# FrRay 的项目小站

一个无需构建工具的静态个人作品集。页面通过 GitHub REST API 自动获取 FrRay 拥有的全部公开仓库，按最近更新排列；支持关键词搜索、语言筛选，并显示描述、星标、语言、更新时间和 fork 标识。

## 本地预览

在项目目录运行：

```bash
python -m http.server 8000
```

访问 http://localhost:8000。也可以使用任意静态文件服务器。无需安装依赖或配置密钥。

## Cloudflare Pages 部署

1. 将本项目提交并推送至 `https://github.com/FrRay/portfolio`。
2. 在 Cloudflare 控制台创建 Pages 项目，选择连接 GitHub 并选择 `FrRay/portfolio` 仓库。
3. 构建配置选择 **无框架**；构建命令留空，构建输出目录填 `/`（项目根目录）。
4. 保存并部署。后续推送到生产分支会触发自动部署。

## 修改配置

- 在 `app.js` 顶部修改 `GITHUB_USER` 可更换数据来源；页面中个人资料链接、头像和文案位于 `index.html`，更换账号时也需一并更新。
- 页面使用浏览器直接请求 GitHub 的公开 API，不需要令牌。GitHub 对未认证请求有速率限制；触发限制或网络不可用时，页面会显示重试入口和 GitHub 链接。
- 仓库新增、修改或删除后，刷新页面即可获取最新数据。包含 fork，不包含私有仓库。

## 仓库数据与备用快照

页面优先请求 GitHub 公开 API。若访问受限或网络不可用，会显示随网站发布的 `repositories.json` 快照及其更新时间，搜索和语言筛选仍可使用。GitHub Actions 每天 UTC 02:17（北京时间 10:17）获取公开仓库并提交新快照，也可在仓库 Actions 中手动运行 **Update public repository snapshot**。工作流只保存公开仓库；需要允许 Actions 写入仓库。Cloudflare 的 Git 集成需要在快照提交后重新部署，网站上的快照才会更新。实时 API 成功时仍显示实时结果。
