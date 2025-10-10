# JEE React 管理系统

基于 React + TypeScript + Vite + Ant Design 构建的现代化管理系统。

## 技术栈

- **前端框架**: React 19
- **构建工具**: Vite
- **语言**: TypeScript
- **UI组件库**: Ant Design
- **状态管理**: Zustand
- **路由**: React Router DOM
- **HTTP客户端**: Axios
- **表单处理**: React Hook Form + Zod
- **样式**: CSS + Ant Design

## 项目结构

```
src/
├── api/                 # API请求相关
│   └── request.ts       # Axios配置
├── components/          # 公共组件
├── pages/              # 页面组件
│   ├── Layout.tsx      # 布局组件
│   ├── Dashboard.tsx   # 仪表盘
│   ├── NotFound.tsx    # 404页面
│   └── User/           # 用户相关页面
├── router/             # 路由配置
│   └── AppRouter.tsx   # 路由定义
├── stores/             # 状态管理
│   └── useUserStore.ts # 用户状态
├── utils/              # 工具函数
├── App.tsx             # 根组件
└── main.tsx            # 入口文件
```

## 开发指南

### 环境要求

- Node.js >= 18
- pnpm (推荐) 或 npm

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm dev
```

### 构建生产版本

```bash
pnpm build
```

### 代码检查

```bash
pnpm lint
```

## 环境变量

创建 `.env` 文件并配置以下变量：

```env
VITE_API_BASE=http://localhost:3000/api
VITE_APP_TITLE=JEE React 管理系统
```

## 功能特性

- ✅ 现代化技术栈
- ✅ TypeScript 类型安全
- ✅ 响应式布局
- ✅ 状态管理
- ✅ 路由管理
- ✅ API请求封装
- ✅ 表单验证
- 🔄 权限管理 (开发中)
- 🔄 主题切换 (开发中)
- 🔄 国际化 (开发中)

## 开发规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 代码规范
- 组件采用函数式组件 + Hooks
- 状态管理使用 Zustand
- 样式优先使用 Ant Design 组件