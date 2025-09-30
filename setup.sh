#!/bin/bash
# Blog System Setup Script
# Setup = DependencyInstall + DatabaseSetup + EnvironmentConfig

set -e

echo "🚀 部落格系統初始化腳本"
echo "================================"

# Check prerequisites
echo ""
echo "📋 檢查前置需求..."
command -v node >/dev/null 2>&1 || { echo "❌ 需要 Node.js 20+"; exit 1; }
command -v docker >/dev/null 2>&1 || { echo "❌ 需要 Docker"; exit 1; }
echo "✅ 前置需求檢查通過"

# Backend setup
echo ""
echo "📦 安裝後端依賴..."
cd backend
cp .env.example .env
npm install
echo "✅ 後端依賴安裝完成"

# Generate Prisma client
echo ""
echo "🗄️  生成 Prisma Client..."
npx prisma generate
echo "✅ Prisma Client 生成完成"

# Frontend setup
echo ""
echo "📦 安裝前端依賴..."
cd ../frontend
cp .env.example .env
npm install
echo "✅ 前端依賴安裝完成"

cd ..

echo ""
echo "================================"
echo "✅ 初始化完成！"
echo ""
echo "🎯 下一步："
echo ""
echo "方式 1: Docker 部署（推薦）"
echo "  docker-compose up -d"
echo "  訪問 http://localhost:5173"
echo ""
echo "方式 2: 本地開發"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: cd frontend && npm run dev"
echo "  訪問 http://localhost:5173"
echo ""
echo "⚠️  注意: 首次使用需要執行資料庫 migration："
echo "  cd backend && npx prisma migrate dev"
echo ""