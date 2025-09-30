# 部署指南

## 快速部署（Docker Compose）

### 步驟 1：環境準備

確保已安裝以下軟體：
- Docker 20+
- Docker Compose 2+
- Git

### 步驟 2：克隆專案

```bash
git clone <repository-url>
cd AI-Dev-Blog
```

### 步驟 3：環境變數配置

```bash
# 複製環境變數範本
cp .env.example .env

# 編輯 .env 檔案
nano .env
```

必須修改的配置項：

```env
# PostgreSQL 配置
POSTGRES_PASSWORD=your-strong-password-here

# Backend 配置
JWT_SECRET=your-jwt-secret-key-min-32-chars

# 其他可選配置
POSTGRES_USER=postgres
POSTGRES_DB=blog_db
BACKEND_PORT=3000
FRONTEND_PORT=5173
```

### 步驟 4：啟動服務

```bash
# 啟動所有服務
docker-compose up -d

# 等待服務啟動（約 30-60 秒）
docker-compose ps

# 查看日誌
docker-compose logs -f
```

### 步驟 5：驗證部署

```bash
# 檢查後端健康狀態
curl http://localhost:3000/health

# 檢查前端健康狀態
curl http://localhost:5173/health

# 訪問應用
open http://localhost:5173
```

## 生產環境部署

### 方案 1：單機 Docker 部署

#### 1. 伺服器準備

```bash
# 更新系統
sudo apt update && sudo apt upgrade -y

# 安裝 Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# 安裝 Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# 重新登入以應用群組變更
exit
```

#### 2. 配置防火牆

```bash
# UFW 防火牆
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable

# 或使用 iptables
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -A INPUT -p tcp --dport 443 -j ACCEPT
```

#### 3. SSL 證書配置（Let's Encrypt）

```bash
# 安裝 Certbot
sudo apt install certbot python3-certbot-nginx -y

# 獲取證書
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# 自動更新證書
sudo certbot renew --dry-run
```

#### 4. Nginx 反向代理配置

創建 `/etc/nginx/sites-available/blog`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

啟用站點：

```bash
sudo ln -s /etc/nginx/sites-available/blog /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 部署應用

```bash
# 克隆專案
git clone <repository-url>
cd AI-Dev-Blog

# 配置環境變數
cp .env.example .env
nano .env  # 修改生產環境配置

# 啟動服務
docker-compose up -d

# 檢查狀態
docker-compose ps
docker-compose logs -f
```

### 方案 2：Kubernetes 部署

準備 Kubernetes 配置文件（k8s/）：

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: blog-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: blog-backend
  template:
    metadata:
      labels:
        app: blog-backend
    spec:
      containers:
      - name: backend
        image: your-registry/blog-backend:latest
        ports:
        - containerPort: 3000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: blog-secrets
              key: database-url
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: blog-secrets
              key: jwt-secret
```

部署命令：

```bash
kubectl apply -f k8s/
kubectl get pods
kubectl get services
```

## 監控與維護

### 日誌查看

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres

# 導出日誌
docker-compose logs > logs.txt
```

### 資料庫備份

```bash
# 手動備份
docker exec blog-postgres pg_dump -U postgres blog_db > backup-$(date +%Y%m%d).sql

# 自動備份腳本
cat > backup.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/blog"
DATE=$(date +%Y%m%d-%H%M%S)
mkdir -p $BACKUP_DIR

docker exec blog-postgres pg_dump -U postgres blog_db | gzip > $BACKUP_DIR/backup-$DATE.sql.gz

# 保留最近 7 天的備份
find $BACKUP_DIR -name "backup-*.sql.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# 加入 crontab（每天凌晨 2 點備份）
echo "0 2 * * * /path/to/backup.sh" | crontab -
```

### 資料庫還原

```bash
# 還原備份
gunzip < backup-20250930.sql.gz | docker exec -i blog-postgres psql -U postgres -d blog_db
```

### 效能監控

#### 使用 Docker Stats

```bash
docker stats blog-backend blog-frontend blog-postgres
```

#### 使用 Prometheus + Grafana

1. 添加 Prometheus 到 docker-compose.yml
2. 配置指標收集
3. 在 Grafana 中創建儀表板

### 更新部署

```bash
# 拉取最新代碼
git pull origin main

# 重新構建並啟動
docker-compose down
docker-compose up -d --build

# 無停機更新
docker-compose up -d --no-deps --build backend
docker-compose up -d --no-deps --build frontend
```

## 故障排除

### 後端無法連接資料庫

```bash
# 檢查資料庫狀態
docker-compose ps postgres
docker-compose logs postgres

# 檢查連接
docker exec blog-postgres psql -U postgres -d blog_db -c "SELECT 1;"
```

### 前端無法訪問後端 API

```bash
# 檢查網絡
docker network ls
docker network inspect blog-network

# 檢查後端健康狀態
curl http://localhost:3000/health

# 查看後端日誌
docker-compose logs backend
```

### 容器頻繁重啟

```bash
# 查看重啟原因
docker-compose ps
docker inspect blog-backend

# 檢查資源限制
docker stats

# 增加資源限制
# 編輯 docker-compose.yml 中的 resources 配置
```

## 安全建議

### 1. 環境變數安全

- 不要將 .env 檔案提交到版本控制
- 使用強隨機密碼和密鑰
- 定期輪換密鑰

### 2. 網路安全

- 僅開放必要端口
- 使用 HTTPS
- 配置 WAF（Web Application Firewall）
- 啟用 Rate Limiting

### 3. 資料庫安全

- 使用強密碼
- 限制資料庫訪問 IP
- 定期備份
- 啟用審計日誌

### 4. 容器安全

- 使用非 root 使用者
- 定期更新鏡像
- 掃描安全漏洞
- 限制容器權限

## 效能優化

### 1. 資料庫優化

```sql
-- 創建索引
CREATE INDEX idx_articles_publish_date ON articles(publish_date DESC);
CREATE INDEX idx_articles_category_id ON articles(category_id);
CREATE INDEX idx_article_tags_article_id ON article_tags(article_id);
CREATE INDEX idx_article_tags_tag_id ON article_tags(tag_id);

-- 分析查詢效能
EXPLAIN ANALYZE SELECT * FROM articles WHERE category_id = 'xxx';
```

### 2. 快取策略

- 使用 Redis 快取熱門文章
- 啟用 Nginx 快取
- 使用 CDN 加速靜態資源

### 3. 負載均衡

- 部署多個後端實例
- 使用 Nginx 或 HAProxy 負載均衡
- 配置健康檢查

## 成本優化

### 雲端部署成本估算

**AWS EC2 範例**：
- t3.medium (2 vCPU, 4GB RAM): ~$30/月
- RDS PostgreSQL db.t3.micro: ~$15/月
- 流量費用: ~$10/月
- **總計**: ~$55/月

**降低成本建議**：
- 使用預留實例
- 啟用自動擴縮容
- 優化資源使用率
- 使用 Spot 實例（非生產環境）

## 支援與問題回報

如有問題或建議，請在 GitHub Issues 中提出。