# 部落格系統 Blog System

基於 Formula-Contract 方法論開發的現代化部落格系統。

## 系統架構公式

```
BlogSystem = (React + TailwindCSS + Vite) × (Node.js + Express + TypeScript) × (PostgreSQL + Prisma) × (Docker + Nginx)
```

## 功能特性

- 文章列表與詳情展示
- 分類系統
- 標籤系統
- 響應式設計
- Markdown 支援
- SEO 優化

## 技術棧

### Frontend
- React 18
- TailwindCSS 3
- Vite 5
- React Router 6
- React Markdown
- Axios

### Backend
- Node.js 20
- Express 4
- TypeScript 5
- Prisma ORM
- PostgreSQL 16
- Zod (validation)

### DevOps
- Docker
- Docker Compose
- Nginx

## 快速開始

### 前置需求
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 16 (本地開發)

### 本地開發

#### 1. 安裝依賴

```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

#### 2. 設定環境變數

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

#### 3. 資料庫設定

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

#### 4. 啟動服務

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

訪問 http://localhost:5173

### Docker 部署

```bash
# 啟動所有服務
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

訪問 http://localhost:5173

## API 端點

### 文章
- `GET /api/articles` - 獲取文章列表（分頁）
- `GET /api/articles/:id` - 獲取文章詳情

### 分類
- `GET /api/categories` - 獲取所有分類
- `GET /api/categories/:slug` - 獲取分類詳情
- `GET /api/categories/:slug/articles` - 獲取分類下的文章

### 標籤
- `GET /api/tags` - 獲取所有標籤
- `GET /api/tags/:slug` - 獲取標籤詳情
- `GET /api/tags/:slug/articles` - 獲取標籤下的文章

## 專案結構

```
.
├── backend/
│   ├── src/
│   │   ├── controllers/      # 控制器層
│   │   ├── services/          # 業務邏輯層
│   │   ├── routes/            # 路由定義
│   │   ├── middleware/        # 中間件
│   │   ├── types/             # TypeScript 類型
│   │   └── utils/             # 工具函數
│   ├── prisma/
│   │   └── schema.prisma      # 資料庫模型
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # React 元件
│   │   ├── pages/             # 頁面元件
│   │   ├── services/          # API 服務
│   │   ├── types/             # TypeScript 類型
│   │   └── styles/            # 樣式檔案
│   └── package.json
└── docker-compose.yml
```

## 驗收標準

- [x] 使用者能夠瀏覽文章列表
- [x] 使用者能夠查看文章完整內容
- [x] 使用者能夠透過分類篩選文章
- [x] 使用者能夠透過標籤篩選文章
- [x] 響應式設計支援桌面與移動設備

## 開發團隊

基於 Formula-Contract 方法論自動生成。

## License

MIT