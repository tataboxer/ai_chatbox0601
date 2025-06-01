# AI Life Coach 项目

这是一个 AI Life Coach 项目，旨在提供一个基于网页的 AI 助手。

## 项目结构

- `public/`: 包含前端静态文件，如 `index.html` (主页面), `app.js` (前端逻辑) 和 `style.css` (页面样式)。
- `server.js`: 后端服务器文件，处理 API 请求。
- `.env`: 环境变量文件，用于存储敏感信息，如 API 密钥。

## 页面用途

- `index.html`: 网页的主入口，负责加载 `app.js` 和 `style.css`。
- `app.js`: 包含与 AI 助手交互的 JavaScript 逻辑，例如发送请求和处理响应。
- `style.css`: 定义了页面的视觉样式，包括布局、颜色和字体。

## 布局结构

页面采用响应式设计，使用 CSS Flexbox 和 Grid 布局，以确保在不同设备上都能良好显示。

## 样式说明

所有 CSS 样式都添加了详细的中文注释，方便理解和修改。

## 优化建议

- 考虑使用 HTML5 的高级特性，如 Canvas、SVG 等，以增强用户体验。
- 优化页面加载性能，例如压缩 CSS 文件和优化图片资源。
- 确保网页在主流浏览器中都能正常显示和交互。