# AI生活教练

这是一个基于Web的AI生活教练应用，旨在提供一个简洁、美观且功能丰富的聊天界面，帮助用户解决生活中的问题。该应用采用了类似Apple风格的UI设计，提供流畅的用户体验。

## 技术栈

- **前端**: HTML, CSS (Apple风格设计), JavaScript
- **后端**: Node.js (Express.js)
- **AI服务**: 火山引擎方舟平台 (Ark Platform)

## 功能特性

- **Apple风格UI**: 界面设计简洁、优雅，符合Apple产品的视觉风格。
- **实时聊天**: 用户可以与AI生活教练进行实时对话。
- **流式响应**: AI的回复以流式方式逐步显示，提升用户体验。
- **对话历史**: 自动保存和加载用户的对话历史，方便回顾。
- **响应式设计**: 界面在不同设备上均能良好显示（尽管已移除移动端特定适配，但基础布局仍适应Web）。

## 安装与运行

请按照以下步骤在本地安装和运行此项目：

### 1. 克隆仓库

```bash
git clone <仓库地址>
cd AI_life_coach
```

## 环境变量设置

为了保证API密钥的安全，本项目使用环境变量来存储 `ARK_API_KEY`。请按照以下步骤设置：

1. 在项目根目录下创建 `.env` 文件。
2. 在 `.env` 文件中添加以下内容，并将 `your_ark_api_key_here` 替换为你的实际API密钥：

   ```
   ARK_API_KEY=your_ark_api_key_here
   ```

3. 如果你使用的是 Vercel 部署，请在 Vercel 项目设置中添加 `ARK_API_KEY` 环境变量。

### 2. 安装依赖

在项目根目录下，安装后端和前端所需的Node.js依赖：

```bash
npm install
```



### 4. 运行后端服务器

在项目根目录下，启动Node.js后端服务器：

```bash
node server.js
```

服务器将运行在 `http://localhost:3000`。

### 5. 访问前端应用

在浏览器中打开 `index.html` 文件，或者通过访问 `http://localhost:3000/index.html` 来使用应用。

## 项目结构

- `index.html`: 前端主页面，包含聊天界面的HTML结构。
- `style.css`: 样式文件，定义了应用的视觉风格，包括Apple风格的UI元素。
- `app.js`: 前端JavaScript文件，处理用户交互、消息发送、流式响应处理和对话历史管理。
- `server.js`: 后端Node.js服务器，负责处理API请求，与火山引擎方舟平台进行通信，并提供静态文件服务。
- `package.json`: 项目依赖和脚本配置。
- `package-lock.json`: 记录了项目安装时确切的依赖版本。

## 许可证

[根据您的项目选择合适的许可证，例如 MIT, Apache 2.0 等]