// 简化版 App - 用于调试
function SimpleApp() {
  return (
    <div style={{ 
      padding: '40px', 
      color: 'white', 
      background: '#0a0a0f', 
      minHeight: '100vh',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>Pixel Fate 测试页面</h1>
      <p style={{ fontSize: '18px', marginBottom: '10px' }}>如果你看到这个页面，说明 React 正常工作</p>
      <p style={{ fontSize: '14px', color: '#94a3b8' }}>当前时间: {new Date().toLocaleString()}</p>
      <div style={{ marginTop: '30px', padding: '20px', background: '#1e293b', borderRadius: '8px' }}>
        <p>如果页面是空白的，请：</p>
        <ol style={{ marginLeft: '20px', marginTop: '10px' }}>
          <li>按 F12 打开开发者工具</li>
          <li>查看 Console 标签中的错误信息</li>
          <li>查看 Network 标签，确认资源是否加载成功</li>
        </ol>
      </div>
    </div>
  )
}

export default SimpleApp
