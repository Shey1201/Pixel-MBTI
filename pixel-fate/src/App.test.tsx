// 临时测试文件 - 验证 React 是否正常工作

function TestApp() {
  return (
    <div style={{ padding: '20px', color: 'white', background: '#1e293b', minHeight: '100vh' }}>
      <h1>测试页面</h1>
      <p>如果你看到这个，说明 React 正常工作</p>
      <p>时间: {new Date().toLocaleString()}</p>
    </div>
  )
}

// 如果主应用有问题，可以用这个测试
// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <TestApp />
//   </StrictMode>,
// )

export default TestApp
