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
# 複製環境變數範本
cp .env.example .env

# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env

# 編輯 .env 檔案，修改以下重要配置：
# - POSTGRES_PASSWORD (生產環境必須修改)
# - JWT_SECRET (生產環境必須修改為強隨機字串)
```

#### 3. 資料庫設定

```bash
cd backend
npx prisma migrate dev
npx prisma generate
npx prisma db seed  # 可選：載入測試資料
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

### Docker 部署（推薦）

#### 快速啟動

```bash
# 1. 設定環境變數
cp .env.example .env
# 編輯 .env 修改生產環境配置

# 2. 啟動所有服務（一鍵部署）
docker-compose up -d

# 3. 查看日誌
docker-compose logs -f

# 4. 健康檢查
curl http://localhost:3000/health  # Backend
curl http://localhost:5173/health  # Frontend
```

#### 服務管理

```bash
# 停止服務
docker-compose down

# 停止並刪除資料卷（注意：會清除資料庫資料）
docker-compose down -v

# 重新構建並啟動
docker-compose up -d --build

# 查看服務狀態
docker-compose ps

# 進入容器
docker exec -it blog-backend sh
docker exec -it blog-frontend sh
docker exec -it blog-postgres psql -U postgres -d blog_db
```

訪問 http://localhost:5173

#### 生產環境部署建議

1. **安全配置**
   - 修改所有預設密碼
   - 使用強隨機 JWT_SECRET
   - 配置 HTTPS (使用 Let's Encrypt + Nginx)
   - 設定防火牆規則

2. **效能優化**
   - 啟用 Docker 資源限制
   - 配置資料庫連接池
   - 使用 CDN 加速靜態資源
   - 啟用 Redis 快取（可選）

3. **監控與備份**
   - 配置日誌收集 (ELK Stack)
   - 設定自動備份資料庫
   - 配置告警通知
   - 使用 Prometheus + Grafana 監控

4. **擴展性**
   - 使用 Docker Swarm 或 Kubernetes
   - 配置負載均衡器
   - 設定自動擴縮容

## API 端點

### 健康檢查
- `GET /health` - 服務健康狀態檢查

### 文章
- `GET /api/articles` - 獲取文章列表（分頁）
- `GET /api/articles/:id` - 獲取文章詳情
- `POST /api/articles` - 創建文章（需管理員權限）
- `PUT /api/articles/:id` - 更新文章（需管理員權限）
- `DELETE /api/articles/:id` - 刪除文章（需管理員權限）

### 分類
- `GET /api/categories` - 獲取所有分類
- `GET /api/categories/:slug` - 獲取分類詳情
- `GET /api/categories/:slug/articles` - 獲取分類下的文章
- `POST /api/categories` - 創建分類（需管理員權限）
- `PUT /api/categories/:id` - 更新分類（需管理員權限）
- `DELETE /api/categories/:id` - 刪除分類（需管理員權限）

### 標籤
- `GET /api/tags` - 獲取所有標籤
- `GET /api/tags/:slug` - 獲取標籤詳情
- `GET /api/tags/:slug/articles` - 獲取標籤下的文章
- `POST /api/tags` - 創建標籤（需管理員權限）
- `PUT /api/tags/:id` - 更新標籤（需管理員權限）
- `DELETE /api/tags/:id` - 刪除標籤（需管理員權限）

### 使用者
- `POST /api/users/register` - 使用者註冊
- `POST /api/users/login` - 使用者登入
- `GET /api/users/profile` - 獲取個人資料（需登入）
- `PUT /api/users/profile` - 更新個人資料（需登入）
- `PUT /api/users/password` - 修改密碼（需登入）
- `POST /api/users/avatar` - 上傳頭像（需登入）

### 留言
- `GET /api/comments/article/:articleId` - 獲取文章留言
- `POST /api/comments` - 發表留言（需登入）
- `DELETE /api/comments/:commentId` - 刪除留言（需登入，僅限本人或管理員）
- `GET /api/comments/user` - 獲取個人留言（需登入）

### 按讚
- `POST /api/likes` - 切換按讚狀態（需登入）
- `GET /api/likes/article/:articleId/check` - 檢查是否已按讚
- `GET /api/likes/article/:articleId/count` - 獲取按讚數
- `GET /api/likes/user` - 獲取已按讚文章（需登入）

### SEO
- `GET /api/sitemap.xml` - 動態生成網站地圖

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

## 功能驗收標準

### 增量 1：部落格核心功能
- [x] 使用者能夠瀏覽文章列表
- [x] 使用者能夠查看文章完整內容
- [x] 使用者能夠透過分類篩選文章
- [x] 使用者能夠透過標籤篩選文章
- [x] 響應式設計支援桌面與移動設備

### 增量 2：內容管理系統
- [x] 管理員能夠新增文章
- [x] 管理員能夠編輯文章
- [x] 管理員能夠刪除文章
- [x] 支援 Markdown 編輯器
- [x] 支援圖片上傳

### 增量 3：使用者系統
- [x] 使用者能夠註冊帳號
- [x] 使用者能夠登入/登出
- [x] 使用者能夠管理個人資料
- [x] 使用者能夠上傳頭像
- [x] 使用者能夠修改密碼

### 增量 4：互動功能
- [x] 使用者能夠發表留言
- [x] 使用者能夠刪除自己的留言
- [x] 使用者能夠按讚文章
- [x] 使用者能夠分享文章
- [x] 管理員能夠刪除任何留言

### 增量 5：部署與優化
- [x] Docker Compose 一鍵部署
- [x] 健康檢查機制
- [x] SEO 優化（Meta tags, Open Graph, Sitemap）
- [x] 靜態資源優化（Gzip, Cache）
- [x] 程式碼分割與 Lazy Loading
- [x] 日誌記錄中間件
- [x] API 回應時間優化
- [x] 完整部署文檔

## 開發團隊

基於 Formula-Contract 方法論自動生成。

## License

MIT