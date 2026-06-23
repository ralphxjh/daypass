// ============================================================
//  语言上下文
//  提供 LanguageProvider + useLanguage() hook
// ============================================================
import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import translations from './translations';

const LanguageContext = createContext(null);

/**
 * 包裹根组件，注入语言上下文
 */
export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState(() => {
    try {
      const stored = localStorage.getItem('tax-lang');
      return stored === 'en' ? 'en' : 'zh';
    } catch {
      return 'zh';
    }
  });

  const setLang = useCallback((newLang) => {
    setLangState(newLang);
    try {
      localStorage.setItem('tax-lang', newLang);
    } catch {
      // 静默
    }
  }, []);

  /**
   * 翻译函数
   * @param {string} path — 点号分隔的路径，如 'toast.added'
   * @param {object} vars — 替换 {{变量}} 的值
   * @returns {string}
   */
  const t = useCallback(
    (path, vars = {}) => {
      const keys = path.split('.');
      let val = translations[lang];
      for (const k of keys) {
        if (val == null) break;
        val = val[k];
      }
      if (typeof val !== 'string') return path;
      return val.replace(/\{\{(\w+)\}\}/g, (_, key) =>
        vars[key] !== undefined ? String(vars[key]) : `{{${key}}}`
      );
    },
    [lang]
  );

  const value = useMemo(() => ({ lang, setLang, t }), [lang, setLang, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * 消费语言上下文的 hook
 * @returns {{ lang: string, setLang: (v: string) => void, t: (path: string, vars?: object) => string }}
 */
export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage() must be used inside <LanguageProvider>');
  }
  return ctx;
}

export default LanguageContext;
