# 快速啟動指南

## 方式 1: Docker 部署（推薦）

最簡單的啟動方式，一鍵啟動所有服務：

```bash
# 啟動所有服務（PostgreSQL + Backend + Frontend）
docker-compose up -d

# 查看日誌
docker-compose logs -f

# 停止服務
docker-compose down
```

訪問 http://localhost:5173

## 方式 2: 本地開發

### 步驟 1: 安裝依賴

```bash
# 執行自動化安裝腳本
chmod +x setup.sh
./setup.sh

# 或手動安裝
cd backend && npm install
cd ../frontend && npm install
```

### 步驟 2: 設定環境變數

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.example frontend/.env
```

### 步驟 3: 資料庫設定

```bash
# 確保 PostgreSQL 正在運行
# 執行 migration
cd backend
npx prisma migrate dev --name init

# （可選）填充範例資料
npm run prisma:seed
```

### 步驟 4: 啟動服務

開啟兩個終端機：

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev
```

訪問 http://localhost:5173

## 驗證安裝

### 檢查 Backend API

```bash
curl http://localhost:3000/health
# 應該返回: {"status":"ok","timestamp":"..."}

curl http://localhost:3000/api/articles
# 應該返回文章列表
```

### 檢查 Frontend

訪問 http://localhost:5173，應該能看到：
- 文章列表頁面
- 分類列表
- 標籤雲

## 常見問題

### Q: 端口被佔用

```bash
# 檢查端口使用情況
lsof -i :3000  # Backend
lsof -i :5173  # Frontend
lsof -i :5432  # PostgreSQL

# 修改端口：編輯對應的配置檔案
```

### Q: 資料庫連線失敗

```bash
# 檢查 PostgreSQL 是否運行
docker ps | grep postgres

# 檢查 .env 中的 DATABASE_URL
cat backend/.env
```

### Q: Prisma Client 錯誤

```bash
# 重新生成 Prisma Client
cd backend
npx prisma generate
```

## API 端點一覽

- `GET /api/articles` - 文章列表（分頁）
- `GET /api/articles/:id` - 文章詳情
- `GET /api/categories` - 所有分類
- `GET /api/categories/:slug/articles` - 分類文章
- `GET /api/tags` - 所有標籤
- `GET /api/tags/:slug/articles` - 標籤文章

## 開發工具

### Prisma Studio

視覺化資料庫管理工具：

```bash
cd backend
npm run prisma:studio
```

訪問 http://localhost:5555

### 資料庫遷移

```bash
# 建立新的 migration
npx prisma migrate dev --name migration_name

# 重置資料庫（⚠️ 會刪除所有資料）
npx prisma migrate reset
```

## 下一步

- 查看 [README.md](./README.md) 了解完整文件
- 查看 [FORMULA.md](./FORMULA.md) 了解業務需求
- 修改樣式：編輯 `frontend/src/styles/index.css`
- 新增功能：參考現有程式碼結構