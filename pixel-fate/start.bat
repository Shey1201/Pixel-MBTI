@echo off
echo 正在启动 Pixel Fate 开发服务器...
echo.

cd /d "%~dp0"

if not exist "package.json" (
    echo 错误: 请在 pixel-fate 目录下运行此脚本
    pause
    exit /b 1
)

if not exist "node_modules" (
    echo 正在安装依赖...
    call npm install
    echo.
)

echo 启动开发服务器...
echo 服务器启动后，请在浏览器中打开显示的地址（通常是 http://localhost:5173）
echo.
call npm run dev

pause
