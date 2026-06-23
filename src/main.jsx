import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { LanguageProvider } from './i18n/LanguageContext'

// 引入 antd-mobile 的基础样式
import 'antd-mobile/es/global';

// 护照主题全局样式（必须在 antd-mobile 之后，才能覆盖其变量）
import './index.css';

// 使用 vite-plugin-pwa 官方提供的注册虚拟模块
import { registerSW } from 'virtual:pwa-register'

const updateSW = registerSW({
  onNeedRefresh() {
    // 当有新版本可用时触发（直接读 localStorage 决定双语）
    const lang = (() => {
      try { const v = localStorage.getItem('tax-lang'); return v === 'en' ? 'en' : 'zh'; }
      catch { return 'zh'; }
    })();
    const msg = lang === 'en'
      ? 'A new version is available. Update now?'
      : '有新版本可用，是否立即更新？';
    if (confirm(msg)) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    // 当离线缓存准备完毕时触发
    console.log('App ready for offline use');
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </React.StrictMode>,
)
