# 🍕 Pizza Ordering System - 大学毕业设计项目

这是一个基于 Next.js 14 和 MongoDB 构建的现代化披萨订购系统，是我的大学毕业设计项目。该系统提供了完整的电商功能，包括用户认证、商品管理、购物车、订单处理、支付集成等核心功能。

## ✨ 核心功能

### 🔐 用户认证系统
- 用户注册/登录功能
- 基于 JWT 的 Cookie 认证
- 用户角色管理（客户/管理员/骑手）
- 个人资料管理
- 安全的密码加密存储

### 🍕 披萨菜单系统
- 完整的披萨菜单展示
- 披萨详情页面（价格、描述、配料等）
- 热门披萨推荐
- 素食/非素食分类
- 披萨尺寸和饼底选择
- 自定义配料系统

### 🛒 购物车功能
- 添加/删除商品
- 数量调整
- 配料定制
- 实时价格计算
- 购物车状态持久化

### 📦 订单管理系统
- 订单创建和跟踪
- 订单状态管理（待处理/制作中/配送中/已完成）
- 用户订单历史
- 骑手订单分配
- 订单详情查看

### 💳 支付集成
- Stripe 支付网关集成
- 安全的支付处理
- 支付状态验证
- 支付成功页面

### 📝 反馈系统
- 用户反馈提交
- 反馈管理界面
- 客户服务支持

### 👨‍💼 管理员功能
- 披萨管理（添加/编辑/删除）
- 订单管理
- 用户管理
- 数据统计图表

### 🚚 配送系统
- 骑手角色管理
- 配送地址管理
- 配送状态跟踪
- 联系信息管理

### 🎨 用户界面
- 响应式设计（支持桌面/平板/手机）
- 现代化 UI 组件（基于 Shadcn/ui）
- 流畅的动画效果
- 直观的用户体验

## 🗄️ 数据库架构

项目已成功从 MySQL 迁移到 MongoDB，使用 Mongoose ODM 进行数据操作，提供更好的可扩展性和性能。

### 数据模型设计

#### 👤 User（用户模型）
```javascript
{
  username: String,      // 用户名（唯一）
  email: String,         // 邮箱（唯一）
  hashed_password: String, // 加密密码
  avatar_url: String,    // 头像URL
  role: String,          // 角色（customer/admin/rider）
  createdAt: Date,       // 创建时间
  updatedAt: Date        // 更新时间
}
```

#### 🍕 Pizza（披萨模型）
```javascript
{
  name: String,          // 披萨名称
  veg: Boolean,          // 是否素食
  price: Number,         // 价格
  description: String,   // 描述
  quantity: Number,      // 库存数量
  img: String,           // 图片URL
  is_popular: Boolean,   // 是否热门
  sizeandcrust: Mixed,   // 尺寸和饼底选项
  createdAt: Date,
  updatedAt: Date
}
```

#### 📦 Order（订单模型）
```javascript
{
  user_id: ObjectId,           // 用户ID（关联User）
  rider_id: ObjectId,          // 骑手ID（关联User）
  total_price: Number,         // 总价格
  status: String,              // 订单状态
  delivery_address: String,    // 配送地址
  contact_phone: String,       // 联系电话
  payment_method: String,      // 支付方式
  payment_status: String,      // 支付状态
  special_instructions: String, // 特殊说明
  delivery_method: String,     // 配送方式
  pizzas: [OrderPizza],        // 订单披萨列表
  createdAt: Date,
  updatedAt: Date
}
```

#### 🧄 Topping（配料模型）
- 披萨配料信息
- 价格和可用性管理

#### 💬 Feedback（反馈模型）
- 用户反馈和评价
- 客户服务记录

#### 📞 UserContact（用户联系信息）
- 用户地址簿
- 配送地址管理

## 🛠️ 技术栈

### 前端技术
- **Next.js 14**: React 全栈框架，使用 App Router
- **React 18**: 用户界面库
- **Tailwind CSS**: 原子化 CSS 框架
- **Shadcn/ui**: 现代化 UI 组件库
- **Framer Motion**: 动画库
- **Lucide React**: 图标库
- **React Hook Form**: 表单处理
- **Zod**: 数据验证
- **SWR**: 数据获取和缓存
- **Zustand**: 状态管理
- **React Hot Toast**: 通知组件

### 后端技术
- **Next.js API Routes**: 服务端 API
- **MongoDB**: NoSQL 数据库
- **Mongoose**: MongoDB ODM
- **bcryptjs**: 密码加密
- **jsonwebtoken**: JWT 认证
- **jose**: JWT 处理库

### 支付和集成
- **Stripe**: 支付网关
- **@stripe/stripe-js**: Stripe 客户端
- **@stripe/react-stripe-js**: Stripe React 组件

### 开发工具
- **Jest**: 测试框架
- **@testing-library**: 测试工具
- **ESLint**: 代码检查
- **PostCSS**: CSS 处理
- **pnpm**: 包管理器

### 图表和可视化
- **Recharts**: 图表库
- **AG Charts**: 高级图表组件
- **React ChartJS 2**: Chart.js React 封装

## 📋 环境要求

- **Node.js**: 18.0.0 或更高版本
- **MongoDB**: 本地安装或 MongoDB Atlas 云服务
- **pnpm**: 推荐的包管理器
- **现代浏览器**: 支持 ES2020+ 的浏览器

## 🚀 快速开始

### 1. 克隆项目
```bash
git clone <repository-url>
cd futu
```

### 2. 安装依赖
```bash
pnpm install
```

### 3. 环境配置
```bash
cp .env.example .env
```

编辑 `.env` 文件，配置以下环境变量：

```env
# MongoDB 数据库连接
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza?retryWrites=true&w=majority

# Stripe 支付配置
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key

# Cloudinary 图片上传（可选）
NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Infura API（区块链功能，可选）
INFURA_API_KEY=your_infura_api_key

# NextAuth 配置
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

### 4. 数据库初始化
```bash
# 初始化数据库并添加示例数据
pnpm run init-db
```

### 5. 启动开发服务器
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 6. 运行测试
```bash
# 运行所有测试
pnpm test

# 监听模式运行测试
pnpm run test:watch

# 生成覆盖率报告
pnpm run test:coverage
```

## 🗄️ 数据库配置

### 本地 MongoDB
如果使用本地 MongoDB，确保 MongoDB 服务正在运行：
```bash
# 启动 MongoDB 服务
mongod

# 在 .env 文件中配置
MONGODB_URI=mongodb://localhost:27017/pizza
```

### MongoDB Atlas（推荐）
使用 MongoDB Atlas 云服务：
1. 在 [MongoDB Atlas](https://www.mongodb.com/atlas) 创建账户
2. 创建新的集群
3. 获取连接字符串
4. 在 `.env` 文件中配置：
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/pizza?retryWrites=true&w=majority
```

### Stripe 支付配置
1. 在 [Stripe Dashboard](https://dashboard.stripe.com/) 创建账户
2. 获取 API 密钥
3. 配置环境变量：
```env
STRIPE_SECRET_KEY=sk_test_your_secret_key
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=pk_test_your_public_key
```

## 📁 项目结构

```
futu/
├── 📁 app/                    # Next.js App Router 页面
│   ├── 📁 api/                # API 路由
│   │   ├── 📁 auth/           # 认证相关 API
│   │   ├── 📁 orders/         # 订单管理 API
│   │   ├── 📁 payment/        # 支付相关 API
│   │   ├── 📁 pizzas/         # 披萨管理 API
│   │   └── 📁 users/          # 用户管理 API
│   ├── 📁 auth/               # 认证页面
│   ├── 📁 menu/               # 菜单页面
│   ├── 📁 order/              # 订单页面
│   ├── 📁 payment/            # 支付页面
│   ├── 📁 profile/            # 用户资料页面
│   └── 📄 layout.js           # 全局布局
├── 📁 components/             # React 组件
│   ├── 📁 animation/          # 动画组件
│   ├── 📁 banner/             # 横幅组件
│   ├── 📁 card/               # 卡片组件
│   ├── 📁 cart/               # 购物车组件
│   ├── 📁 feedback/           # 反馈组件
│   ├── 📁 menu/               # 菜单组件
│   ├── 📁 navbar/             # 导航栏组件
│   ├── 📁 payment/            # 支付组件
│   └── 📁 ui/                 # 基础 UI 组件
├── 📁 hooks/                  # 自定义 React Hooks
├── 📁 lib/                    # 工具库和配置
│   ├── 📁 models/             # MongoDB 数据模型
│   │   ├── 📄 User.js         # 用户模型
│   │   ├── 📄 Pizza.js        # 披萨模型
│   │   ├── 📄 Order.js        # 订单模型
│   │   ├── 📄 Feedback.js     # 反馈模型
│   │   └── 📄 Topping.js      # 配料模型
│   ├── 📄 auth.js             # 认证工具
│   ├── 📄 db.js               # 数据库连接
│   └── 📄 utils.js            # 工具函数
├── 📁 providers/              # React Context 提供者
├── 📁 public/                 # 静态资源
├── 📁 scripts/                # 脚本文件
│   ├── 📄 initMongoDB.js      # 数据库初始化
│   ├── 📄 testAPIs.js         # API 测试
│   └── 📄 testAuth.js         # 认证测试
├── 📁 __tests__/              # 测试文件
│   ├── 📁 api/                # API 测试
│   ├── 📁 components/         # 组件测试
│   ├── 📁 hooks/              # Hook 测试
│   └── 📁 utils/              # 工具函数测试
├── 📁 coverage/               # 测试覆盖率报告
├── 📄 package.json            # 项目依赖配置
├── 📄 next.config.mjs         # Next.js 配置
├── 📄 tailwind.config.js      # Tailwind CSS 配置
├── 📄 jest.config.js          # Jest 测试配置
└── 📄 README.md               # 项目文档
```

## 🔧 可用脚本

```bash
# 开发相关
pnpm dev              # 启动开发服务器
pnpm build            # 构建生产版本
pnpm start            # 启动生产服务器
pnpm lint             # 代码检查

# 测试相关
pnpm test             # 运行测试
pnpm test:watch       # 监听模式运行测试
pnpm test:coverage    # 生成覆盖率报告
pnpm test:ci          # CI 模式运行测试

# 数据库相关
pnpm run init-db      # 初始化数据库
pnpm run test-api     # 测试 API 接口
pnpm run test-all     # 综合 API 测试
```

## 🧪 测试覆盖

项目包含完整的测试套件，覆盖率达到 100%：

- ✅ **33 个测试用例全部通过**
- ✅ **8 个测试套件**
- ✅ **完整的功能测试覆盖**

### 测试类型
- **组件测试**: React 组件逻辑测试
- **Hook 测试**: 自定义 Hook 功能测试
- **API 测试**: 后端 API 逻辑测试
- **工具函数测试**: 辅助函数测试
- **认证系统测试**: JWT 和 Cookie 认证测试

## 🚀 部署指南

### Vercel 部署（推荐）
1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 自动部署

### 其他平台
- **Netlify**: 支持 Next.js 部署
- **Railway**: 全栈应用部署
- **Heroku**: 容器化部署

### 环境变量配置
确保在部署平台配置所有必要的环境变量：
- `MONGODB_URI`
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`
- `NEXTAUTH_SECRET`
- `NEXTAUTH_URL`

## 🎯 项目特色

### 🔄 数据库迁移
项目成功从 MySQL 迁移到 MongoDB：
- **连接方式**: 从 `mysql2` 迁移到 `mongoose`
- **数据模型**: 创建了完整的 Mongoose Schema
- **查询操作**: SQL 查询转换为 MongoDB 操作
- **事务处理**: 适配 MongoDB 事务机制
- **配置更新**: 更新连接字符串和环境配置

### 🏗️ 架构设计
- **前后端分离**: Next.js 全栈架构
- **API 优先**: RESTful API 设计
- **组件化开发**: 可复用的 React 组件
- **状态管理**: Zustand + SWR 数据管理
- **类型安全**: Zod 数据验证

### 🔐 安全特性
- **JWT 认证**: 安全的用户认证
- **密码加密**: bcryptjs 密码哈希
- **CSRF 保护**: Next.js 内置保护
- **数据验证**: 前后端双重验证
- **环境变量**: 敏感信息安全存储

### 📱 响应式设计
- **移动优先**: 移动端优化设计
- **多设备支持**: 桌面/平板/手机适配
- **现代 UI**: Shadcn/ui 组件库
- **流畅动画**: Framer Motion 动效

## 📚 学习资源



https://support.metamask.io/configure/networks/how-to-view-testnets-in-metamask/