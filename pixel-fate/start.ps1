# Pixel Fate 启动脚本
Write-Host "正在启动 Pixel Fate 开发服务器..." -ForegroundColor Green
Write-Host ""

# 检查是否在正确的目录
if (-not (Test-Path "package.json")) {
    Write-Host "错误: 请在 pixel-fate 目录下运行此脚本" -ForegroundColor Red
    exit 1
}

# 检查依赖是否安装
if (-not (Test-Path "node_modules")) {
    Write-Host "正在安装依赖..." -ForegroundColor Yellow
    npm install
    Write-Host ""
}

# 启动开发服务器
Write-Host "启动开发服务器..." -ForegroundColor Cyan
Write-Host "服务器启动后，请在浏览器中打开显示的地址（通常是 http://localhost:5173）" -ForegroundColor Yellow
Write-Host ""
npm run dev
