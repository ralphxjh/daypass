import React from 'react';
import { RightOutline } from 'antd-mobile-icons';
import styles from './TaxStatusCard.module.css';

const TaxStatusCard = ({ country, isExpanded, tripCount }) => {
  const { id, name, flag, currentDays, thresholdDays } = country;

  const percentage = Math.min((currentDays / thresholdDays) * 100, 100);
  const remaining = Math.max(thresholdDays - currentDays, 0);

  // 印章统一朱红
  const stampColor = 'var(--pp-vermilion)';
  // 数字和进度条保持墨绿
  const dataColor = 'var(--pp-ink)';
  let statusText = 'SAFE 安全';
  if (percentage >= 90) {
    statusText = 'ALERT 危险';
  } else if (percentage >= 60) {
    statusText = 'WATCH 警告';
  }

  const noteText =
    remaining > 0
      ? `还可停留 ${remaining} 天 · 超过即触发税务居民判定`
      : `已超出 ${currentDays - thresholdDays} 天 · 已达税务居民判定线`;

  // 仿护照机读码（MRZ）行
  const code = String(id || 'XXX').replace(/[^A-Za-z0-9]/g, '').toUpperCase().slice(0, 6) || 'XXX';
  const pad = (n) => String(Math.min(n, 999)).padStart(3, '0');
  const mrz = `P<${code}<<RESIDENCY<TIMER<<${pad(currentDays)}<${pad(thresholdDays)}<<<<<<<`;

  return (
    <div className={styles.card}>
      <div className={styles.top}>
        <div>
          <div className={styles.label}>PASSPORT · 税务居住记录</div>
          <h3 className={styles.countryName}>{flag} {name}</h3>
        </div>
        <div className={styles.stamp} style={{ color: stampColor }}>
          <span className={styles.stampText}>{statusText}</span>
          <span className={styles.stampSub}>{new Date().getFullYear()} · {Math.round(percentage)}%</span>
        </div>
      </div>

      <div className={styles.figs}>
        <div className={styles.days} style={{ color: dataColor }}>{currentDays}</div>
        <div className={styles.of}>/ {thresholdDays} 天阈值</div>
      </div>

      <div className={styles.bar}>
        <span
          className={styles.barFill}
          style={{
            width: `${percentage}%`,
            background: `repeating-linear-gradient(45deg, ${dataColor} 0 6px, color-mix(in srgb, ${dataColor} 70%, #ffffff) 6px 12px)`,
          }}
        />
      </div>

      <p className={styles.note}>{noteText}</p>

      <div className={styles.footer}>
        <div className={styles.mrz}>{mrz}</div>
        <div className={styles.expand}>
          {tripCount > 0 ? `${tripCount} 条记录` : '无记录'}
          <RightOutline className={`${styles.arrow} ${isExpanded ? styles.arrowOpen : ''}`} />
        </div>
      </div>
    </div>
  );
};

export default TaxStatusCard;
