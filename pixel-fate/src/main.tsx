import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// 添加错误处理
try {
  const rootElement = document.getElementById('root')
  if (!rootElement) {
    throw new Error('找不到 root 元素')
  }
  
  console.log('开始渲染应用...')
  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  console.log('应用渲染完成')
} catch (error) {
  console.error('应用启动错误:', error)
  document.body.innerHTML = `
    <div style="padding: 40px; color: red; background: #1e293b; min-height: 100vh; font-family: system-ui;">
      <h1>应用启动失败</h1>
      <p>错误信息: ${String(error)}</p>
      <p>请查看浏览器控制台获取详细信息</p>
    </div>
  `
}
