import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// 引入 antd-mobile 的基础样式
import 'antd-mobile/es/global';

// 护照主题全局样式（必须在 antd-mobile 之后，才能覆盖其变量）
import './index.css';

// 使用 vite-plugin-pwa 官方提供的注册虚拟模块
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // 当有新版本可用时触发
    if (confirm("有新版本可用，是否立即更新？")) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // 当离线缓存准备完毕时触发
    console.log('App 已准备好离线工作');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)