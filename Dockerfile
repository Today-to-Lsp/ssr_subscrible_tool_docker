# 第一阶段：使用 node:alpine 构建
FROM node:alpine as builder

# 创建工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json
COPY package*.json ./

# 安装项目依赖
RUN npm install

# 复制项目文件
COPY . .

# 构建应用（如有必要）

# 第二阶段：创建最终镜像
FROM node:alpine

# 创建工作目录
WORKDIR /usr/src/app

# 从构建器中复制构建的文件
COPY --from=builder /usr/src/app .

# 暴露端口 3000
EXPOSE 3000

# 启动应用
CMD ["node", "app.js"]
