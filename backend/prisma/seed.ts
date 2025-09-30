// Database Seed Script
// Seed = Categories + Tags + Articles

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 開始播種資料庫...');

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'technology' },
      update: {},
      create: {
        name: '技術分享',
        slug: 'technology',
        description: '軟體開發、程式設計相關技術文章',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'life' },
      update: {},
      create: {
        name: '生活隨筆',
        slug: 'life',
        description: '日常生活、心得分享',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tutorial' },
      update: {},
      create: {
        name: '教學指南',
        slug: 'tutorial',
        description: '詳細的技術教學與實作指南',
      },
    }),
  ]);

  console.log('✅ 分類建立完成');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'react' },
      update: {},
      create: { name: 'React', slug: 'react' },
    }),
    prisma.tag.upsert({
      where: { slug: 'typescript' },
      update: {},
      create: { name: 'TypeScript', slug: 'typescript' },
    }),
    prisma.tag.upsert({
      where: { slug: 'nodejs' },
      update: {},
      create: { name: 'Node.js', slug: 'nodejs' },
    }),
    prisma.tag.upsert({
      where: { slug: 'prisma' },
      update: {},
      create: { name: 'Prisma', slug: 'prisma' },
    }),
    prisma.tag.upsert({
      where: { slug: 'docker' },
      update: {},
      create: { name: 'Docker', slug: 'docker' },
    }),
  ]);

  console.log('✅ 標籤建立完成');

  // Create sample articles
  const article1 = await prisma.article.create({
    data: {
      title: '使用 React 和 TypeScript 建立現代化 Web 應用',
      summary: '探索如何使用 React 18 和 TypeScript 5 建立型別安全的前端應用，包含最佳實踐和常見陷阱。',
      content: `# 使用 React 和 TypeScript 建立現代化 Web 應用

## 為什麼選擇 React + TypeScript？

React 是目前最流行的前端框架，而 TypeScript 提供了強大的型別系統。兩者結合能夠：

- 提供更好的開發體驗
- 減少運行時錯誤
- 提高代碼可維護性
- 更好的 IDE 支援

## 專案設定

使用 Vite 快速建立專案：

\`\`\`bash
npm create vite@latest my-app -- --template react-ts
cd my-app
npm install
npm run dev
\`\`\`

## 元件開發最佳實踐

### 1. 使用函數式元件

\`\`\`typescript
interface Props {
  title: string;
  count: number;
}

export function Counter({ title, count }: Props) {
  return <div>{title}: {count}</div>;
}
\`\`\`

### 2. 善用 Hooks

React Hooks 讓狀態管理更簡潔：

\`\`\`typescript
const [count, setCount] = useState<number>(0);
\`\`\`

## 總結

React + TypeScript 是建立現代化 Web 應用的最佳選擇。`,
      author: 'Claude',
      categoryId: categories[0].id,
    },
  });

  await prisma.articleTag.createMany({
    data: [
      { articleId: article1.id, tagId: tags[0].id },
      { articleId: article1.id, tagId: tags[1].id },
    ],
  });

  const article2 = await prisma.article.create({
    data: {
      title: 'Node.js 後端開發實戰指南',
      summary: '從零開始學習 Node.js 後端開發，包含 Express 框架、資料庫整合、API 設計等內容。',
      content: `# Node.js 後端開發實戰指南

## 什麼是 Node.js？

Node.js 是基於 Chrome V8 引擎的 JavaScript 運行環境，讓 JavaScript 可以在伺服器端運行。

## Express 框架快速入門

Express 是 Node.js 最流行的 Web 框架：

\`\`\`typescript
import express from 'express';

const app = express();

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello World' });
});

app.listen(3000);
\`\`\`

## RESTful API 設計原則

- 使用正確的 HTTP 方法
- 清晰的 URL 結構
- 適當的狀態碼
- 統一的錯誤處理

## 資料庫整合

使用 Prisma ORM 簡化資料庫操作：

\`\`\`typescript
const users = await prisma.user.findMany();
\`\`\`

## 總結

Node.js + Express + Prisma 是建立後端 API 的強大組合。`,
      author: 'Claude',
      categoryId: categories[2].id,
    },
  });

  await prisma.articleTag.createMany({
    data: [
      { articleId: article2.id, tagId: tags[2].id },
      { articleId: article2.id, tagId: tags[1].id },
      { articleId: article2.id, tagId: tags[3].id },
    ],
  });

  const article3 = await prisma.article.create({
    data: {
      title: 'Docker 容器化部署完整教學',
      summary: '學習如何使用 Docker 容器化你的應用，包含 Dockerfile 編寫、Docker Compose 多容器編排等。',
      content: `# Docker 容器化部署完整教學

## 為什麼要使用 Docker？

Docker 解決了「在我電腦上可以運行」的問題：

- 環境一致性
- 快速部署
- 易於擴展
- 資源隔離

## Dockerfile 基礎

\`\`\`dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
CMD ["npm", "start"]
\`\`\`

## Docker Compose 多容器編排

\`\`\`yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
  db:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: password
\`\`\`

## 最佳實踐

1. 使用多階段建構減少映像大小
2. 善用 .dockerignore
3. 不要在映像中儲存敏感資料
4. 定期更新基礎映像

## 總結

Docker 是現代應用部署的必備技能。`,
      author: 'Claude',
      categoryId: categories[2].id,
    },
  });

  await prisma.articleTag.createMany({
    data: [
      { articleId: article3.id, tagId: tags[4].id },
    ],
  });

  console.log('✅ 範例文章建立完成');
  console.log('');
  console.log('🎉 資料庫播種完成！');
  console.log(`   - ${categories.length} 個分類`);
  console.log(`   - ${tags.length} 個標籤`);
  console.log(`   - 3 篇文章`);
}

main()
  .catch((e) => {
    console.error('❌ 播種失敗:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });