# 專案結構說明

## 完整目錄結構

```
blog-system/
├── .claude/                          # Formula-Contract 工作目錄
│   ├── agents/                       # AI 代理配置
│   │   ├── formula-auto-planning.md
│   │   └── formula-auto-execution.md
│   ├── formula/
│   │   └── workflow/                 # 工作流程記錄
│   │       ├── formula-auto-planning.json
│   │       ├── formula-auto-execution.json
│   │       └── formula-auto-execution.log
│   └── settings.json
│
├── backend/                          # 後端應用
│   ├── prisma/
│   │   ├── schema.prisma            # 資料庫模型定義
│   │   ├── seed.ts                  # 資料庫種子資料
│   │   └── migrations/              # 資料庫遷移檔案
│   │
│   ├── src/
│   │   ├── controllers/             # 控制器層
│   │   │   ├── articleController.ts
│   │   │   ├── categoryController.ts
│   │   │   └── tagController.ts
│   │   │
│   │   ├── services/                # 業務邏輯層
│   │   │   ├── articleService.ts
│   │   │   ├── categoryService.ts
│   │   │   └── tagService.ts
│   │   │
│   │   ├── routes/                  # 路由定義
│   │   │   └── index.ts
│   │   │
│   │   ├── middleware/              # 中間件
│   │   │   └── errorHandler.ts
│   │   │
│   │   ├── types/                   # TypeScript 類型定義
│   │   │   └── index.ts
│   │   │
│   │   ├── utils/                   # 工具函數
│   │   │   └── prisma.ts
│   │   │
│   │   └── index.ts                 # 應用入口
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   ├── .dockerignore
│   └── Dockerfile
│
├── frontend/                         # 前端應用
│   ├── src/
│   │   ├── components/              # React 元件
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── Pagination.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── ErrorMessage.tsx
│   │   │
│   │   ├── pages/                   # 頁面元件
│   │   │   ├── HomePage.tsx
│   │   │   ├── ArticleDetailPage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── CategoryArticlesPage.tsx
│   │   │   ├── TagsPage.tsx
│   │   │   └── TagArticlesPage.tsx
│   │   │
│   │   ├── services/                # API 服務
│   │   │   └── api.ts
│   │   │
│   │   ├── types/                   # TypeScript 類型定義
│   │   │   └── index.ts
│   │   │
│   │   ├── styles/                  # 樣式檔案
│   │   │   └── index.css
│   │   │
│   │   ├── App.tsx                  # 應用根元件
│   │   └── main.tsx                 # 應用入口
│   │
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── nginx.conf
│   ├── .env.example
│   ├── .dockerignore
│   └── Dockerfile
│
├── docker-compose.yml               # Docker 編排配置
├── setup.sh                         # 快速安裝腳本
├── README.md                        # 專案說明文件
├── QUICKSTART.md                    # 快速啟動指南
├── FORMULA.md                       # 業務需求定義
├── PROJECT_STRUCTURE.md             # 本檔案
└── .gitignore

```

## 架構層次說明

### Backend 架構

```
Client Request
      ↓
   Express
      ↓
  Middleware (CORS, Helmet, Rate Limit)
      ↓
   Routes (/api/articles, /api/categories, /api/tags)
      ↓
 Controllers (Request Handling)
      ↓
  Services (Business Logic)
      ↓
 Prisma ORM
      ↓
  PostgreSQL
```

### Frontend 架構

```
Browser
   ↓
React Router
   ↓
Pages (HomePage, ArticleDetailPage, etc.)
   ↓
Components (Header, ArticleCard, etc.)
   ↓
API Services (axios)
   ↓
Backend API
```

## 資料模型關係

```
Category (1) ──< (N) Article (N) >── (N) ArticleTag (N) >── (N) Tag
```

- 一個 Category 可以有多篇 Article
- 一篇 Article 屬於一個 Category
- 一篇 Article 可以有多個 Tag（通過 ArticleTag 多對多關係）
- 一個 Tag 可以關聯多篇 Article

## API 路由結構

```
/api
├── /articles
│   ├── GET /           # 列表（分頁）
│   └── GET /:id        # 詳情
│
├── /categories
│   ├── GET /           # 列表
│   ├── GET /:slug      # 詳情
│   └── GET /:slug/articles  # 該分類的文章
│
└── /tags
    ├── GET /           # 列表（標籤雲）
    ├── GET /:slug      # 詳情
    └── GET /:slug/articles  # 該標籤的文章
```

## 前端路由結構

```
/
├── /                   # 首頁（文章列表）
├── /articles/:id       # 文章詳情
├── /categories         # 分類列表
├── /categories/:slug   # 分類文章列表
├── /tags               # 標籤雲
└── /tags/:slug         # 標籤文章列表
```

## 技術棧對應

### Backend
- **Language**: TypeScript
- **Runtime**: Node.js 20
- **Framework**: Express 4
- **ORM**: Prisma 5
- **Database**: PostgreSQL 16
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limit

### Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS 3
- **Routing**: React Router 6
- **Markdown**: React Markdown
- **HTTP Client**: Axios

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Web Server**: Nginx
- **Process Manager**: PM2 (選配)

## 檔案統計

- **總檔案數**: 50+
- **Backend 檔案**: 15+
- **Frontend 檔案**: 20+
- **配置檔案**: 10+
- **Docker 檔案**: 5
- **程式碼行數**: ~3000+ LOC

## Formula-Contract 對應

### 業務公式
```
BlogCoreFeature = (ArticleList + ArticleDetail) × (CategorySystem + TagSystem) × ResponsiveDesign × SEO
```

### 架構公式
```
BlogSystem = (React + TailwindCSS + Vite) × (Node.js + Express + TypeScript) × (PostgreSQL + Prisma) × (Docker + Nginx)
```

### 實作公式
```
Implementation = ProjectSetup -> DatabaseSchema -> BackendAPI -> FrontendUI -> Integration
```

### 資料模型公式
```
DataModel = Article(id, title, content, summary, author, publish_date, view_count, category_id)
          × Category(id, name, slug, article_count)
          × Tag(id, name, slug)
          × ArticleTag(article_id, tag_id)
```

### API 設計公式
```
API = GET(/articles) + GET(/articles/:id) + GET(/categories) + GET(/categories/:slug/articles) + GET(/tags) + GET(/tags/:slug/articles)
```

## 開發指南

### 新增功能

1. **新增 API 端點**:
   - 在 `backend/src/services/` 新增業務邏輯
   - 在 `backend/src/controllers/` 新增控制器
   - 在 `backend/src/routes/` 註冊路由

2. **新增前端頁面**:
   - 在 `frontend/src/pages/` 新增頁面元件
   - 在 `frontend/src/App.tsx` 註冊路由
   - 在 `frontend/src/services/api.ts` 新增 API 呼叫

3. **修改資料模型**:
   - 編輯 `backend/prisma/schema.prisma`
   - 執行 `npx prisma migrate dev`
   - 執行 `npx prisma generate`

### 測試流程

1. **API 測試**: 使用 curl 或 Postman
2. **UI 測試**: 使用瀏覽器開發者工具
3. **資料庫測試**: 使用 Prisma Studio

### 部署流程

1. **本地測試**: `npm run dev`
2. **建構**: `npm run build`
3. **Docker 部署**: `docker-compose up -d`
4. **健康檢查**: 訪問 `/health` 端點