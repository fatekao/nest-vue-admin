# NestJS Vue Admin 后端项目

基于 NestJS 构建的后台管理系统后端服务，提供 RESTful API 接口，支持用户认证、权限管理等功能。

## 技术栈

- [NestJS](https://nestjs.com/) - 基于 TypeScript 的 Node.js 框架
- [Prisma](https://www.prisma.io/) - Node.js 和 TypeScript 的 ORM
- [MySQL](https://www.mysql.com/) - 关系型数据库
- [Redis](https://redis.io/) - 内存数据库，用于缓存和会话管理
- [JWT](https://jwt.io/) - JSON Web Token 实现用户认证
- [Swagger](https://swagger.io/) - API 文档生成工具

## 项目结构

src/
├── common/ # 公共模块
│ ├── constants/ # 常量定义
│ ├── decorators/ # 自定义装饰器
│ ├── dto/ # 数据传输对象
│ ├── filters/ # 全局异常过滤器
│ ├── guards/ # 守卫
│ ├── interceptors/ # 拦截器
│ ├── interfaces/ # 接口定义
│ └── pipes/ # 管道
├── config/ # 配置文件
├── modules/ # 功能模块
│ ├── auth/ # 认证模块
│ ├── common/ # 公共模块（日志、Redis等）
│ └── system/ # 系统模块（用户、角色、菜单）
├── prisma/ # Prisma 数据库相关
└── main.ts # 应用入口文件

## 环境要求

- Node.js >= 16.x
- Docker & Docker Compose（推荐）
- MySQL >= 8.0（使用 Docker 时自动安装）
- Redis（使用 Docker 时自动安装）

## 快速开始

### 1. 克隆项目

```bash
git clone <项目地址>
cd back-end
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置环境变量

### 4. 启动数据库和缓存服务

```bash
docker-compose up -d
```

此命令将启动：

- MySQL 数据库（端口: 3306）
- Redis 缓存服务（端口: 6379）

### 5. 运行应用

```bash
# 开发模式
npm run start:dev

# 生产模式
npm run start:prod
```

## 数据库迁移

```bash
# 创建数据库迁移
npm run prisma:migrate-create

# 同步数据库结构
npm run prisma:push-DB

# 从现有数据库生成 Prisma schema
npm run prisma:pull-DB
```
