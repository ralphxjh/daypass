import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Popup, DatePicker, Button, Selector, Toast, List, Switch } from 'antd-mobile';
import { LeftOutline, RightOutline, AddOutline, SetOutline } from 'antd-mobile-icons';
import TaxStatusCard from './components/TaxStatusCard';
import { calculateTotalDays } from './utils/calculator';
import { useLanguage } from './i18n/LanguageContext';
import { getFlagByName, getFlagForCountryCode, resolveCountryName } from './i18n/translations';
import dayjs from 'dayjs';

const currentYear = new Date().getFullYear();

const defaultCountries = [
  { id: 'CN', flag: '🇨🇳', thresholdDays: 183 },
  { id: 'JP', flag: '🇯🇵', thresholdDays: 365 },
  { id: 'SG', flag: '🇸🇬', thresholdDays: 183 },
];

function App() {
  const { lang, setLang, t } = useLanguage();

  const [trips, setTrips] = useState(() => {
    try {
      const savedTrips = localStorage.getItem('tax-trips');
      return savedTrips ? JSON.parse(savedTrips) : [];
    } catch (e) { return []; }
  });

  const [countries, setCountries] = useState(() => {
    try {
      const savedCountries = localStorage.getItem('tax-countries');
      return savedCountries ? JSON.parse(savedCountries) : defaultCountries;
    } catch (e) { return defaultCountries; }
  });

  const [storageAvailable, setStorageAvailable] = useState(true);
  const [popupVisible, setPopupVisible] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [activeYear, setActiveYear] = useState(currentYear);
  const [expandedCountryId, setExpandedCountryId] = useState(null);

  const [selectedCountry, setSelectedCountry] = useState([]);
  const [enterDate, setEnterDate] = useState(new Date());
  const [exitDate, setExitDate] = useState(new Date());
  const [isStillInCountry, setIsStillInCountry] = useState(false);
  const [enterPickerVisible, setEnterPickerVisible] = useState(false);
  const [exitPickerVisible, setExitPickerVisible] = useState(false);

  const [manageVisible, setManageVisible] = useState(false);
  const [newCountryName, setNewCountryName] = useState('');
  const [newCountryFlag, setNewCountryFlag] = useState('');
  const [newCountryDays, setNewCountryDays] = useState('183');
  const [formError, setFormError] = useState('');
  const [note, setNote] = useState('');

  const fileInputRef = useRef(null);

  // 动态更新页面标题
  useEffect(() => {
    document.title = t('app.title');
  }, [lang, t]);

  // 首次加载时检测 localStorage 是否可用
  useEffect(() => {
    try {
      const testKey = '__storage_test__';
      localStorage.setItem(testKey, '1');
      const result = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);
      if (result !== '1') setStorageAvailable(false);
    } catch (e) {
      setStorageAvailable(false);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('tax-trips', JSON.stringify(trips));
    } catch (e) {
      setStorageAvailable(false);
    }
  }, [trips]);

  useEffect(() => {
    try {
      localStorage.setItem('tax-countries', JSON.stringify(countries));
    } catch (e) {
      setStorageAvailable(false);
    }
  }, [countries]);

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setFormError('');
    setSelectedCountry(countries.length > 0 ? [countries[0].id] : []);
    setEnterDate(new Date());
    setExitDate(new Date());
    setIsStillInCountry(false);
    setNote('');
    setPopupVisible(true);
  };

  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setFormError('');
    setSelectedCountry([trip.countryId]);
    setEnterDate(dayjs(trip.enterDate).toDate());
    if (!trip.exitDate) {
      setIsStillInCountry(true);
      setExitDate(new Date());
    } else {
      setIsStillInCountry(false);
      setExitDate(dayjs(trip.exitDate).toDate());
    }
    setNote(trip.note || '');
    setPopupVisible(true);
  };

  // 检测是否与任何已有记录时间重叠（跨国家也检查）
  // 规则：同一天出入境允许（如 1/5 离开日本入境新加坡，1/5 两国都算 / 同一天离境又入境同一国家）
  //        超过一天的区间重叠禁止（人不可能同时在两个地方）
  const checkOverlap = (newEnter, newExit, excludeTripId) => {
    const newEnterDay = dayjs(newEnter);
    const newExitDay = newExit ? dayjs(newExit) : dayjs(); // "至今"用今天
    const allTrips = trips.filter(t => t.id !== excludeTripId);

    for (const trip of allTrips) {
      const existEnter = dayjs(trip.enterDate);
      const existExit = trip.exitDate ? dayjs(trip.exitDate) : dayjs();

      // 完全不重叠 → 跳过
      if (newExitDay.isBefore(existEnter, 'day') || newEnterDay.isAfter(existExit, 'day')) {
        continue;
      }
      // 仅在同一天相接 → 允许（出境A国 同日 入境B国）
      if (newEnterDay.isSame(existExit, 'day') || newExitDay.isSame(existEnter, 'day')) {
        continue;
      }
      // 真正重叠 → 返回冲突记录供提示
      return trip;
    }
    return null;
  };

  const handleSave = () => {
    if (selectedCountry.length === 0) {
      setFormError(t('toast.selectCountry'));
      return;
    }
    if (!isStillInCountry && dayjs(exitDate).isBefore(dayjs(enterDate), 'day')) {
      setFormError(t('toast.dateOrder'));
      return;
    }

    // 重叠检测（跨所有国家）
    const overlap = checkOverlap(
      enterDate,
      isStillInCountry ? null : exitDate,
      editingTrip?.id
    );
    if (overlap) {
      const overlapCountry = countries.find(c => c.id === overlap.countryId);
      const countryLabel = overlapCountry ? resolveCountryName(overlapCountry, lang) : overlap.countryId;
      const dates = overlap.exitDate
        ? `${countryLabel} ${overlap.enterDate} → ${overlap.exitDate}`
        : `${countryLabel} ${overlap.enterDate} → ${t('app.untilNow')}`;
      setFormError(t('toast.dateOverlap', { dates }));
      return;
    }

    const tripData = {
      countryId: selectedCountry[0],
      enterDate: dayjs(enterDate).format('YYYY-MM-DD'),
      exitDate: isStillInCountry ? null : dayjs(exitDate).format('YYYY-MM-DD'),
      note: note.trim() || null,
    };
    if (editingTrip) {
      setTrips(trips.map(t => t.id === editingTrip.id ? { ...tripData, id: editingTrip.id } : t));
      Toast.show(t('toast.modified'));
    } else {
      setTrips([...trips, { ...tripData, id: Date.now() }]);
      Toast.show(t('toast.added'));
    }
    setPopupVisible(false);
  };

  const handleDelete = () => {
    if (editingTrip) {
      setTrips(trips.filter(t => t.id !== editingTrip.id));
      setPopupVisible(false);
      Toast.show(t('toast.deleted'));
    }
  };

  const handleAddCountry = () => {
    const name = newCountryName.trim();
    const days = parseInt(newCountryDays, 10);
    if (!name || isNaN(days) || days <= 0) {
      Toast.show(t('toast.invalidCountry')); return;
    }
    // 拦截重复国家（不区分大小写）
    if (countries.some(c => (c.name || resolveCountryName(c, lang)).trim().toLowerCase() === name.toLowerCase())) {
      Toast.show(t('toast.duplicateCountry', { name })); return;
    }
    // 自动匹配国旗：优先用户手动输入，其次按中英文名查，最后按代码查
    const customFlag = newCountryFlag.trim();
    const autoFlag = customFlag || getFlagByName(name) || getFlagForCountryCode(name.toUpperCase().slice(0, 2)) || '🌍';

    const newCountry = {
      id: 'CUST_' + Date.now(), name: name, flag: autoFlag, thresholdDays: days
    };
    setCountries(prev => [...prev, newCountry]);
    setNewCountryName(''); setNewCountryFlag(''); setNewCountryDays('183');
    Toast.show(t('toast.countryAdded'));
  };

  const handleDeleteCountry = (countryId) => {
    if (window.confirm(t('manage.confirmDeleteCountry'))) {
      setCountries(prev => prev.filter(c => c.id !== countryId));
      setTrips(prev => prev.filter(t => t.countryId !== countryId));
      if (expandedCountryId === countryId) setExpandedCountryId(null);
      Toast.show(t('toast.deleted'));
    }
  };

  const handleUpdateCountryDays = (countryId, newDays) => {
    const val = parseInt(newDays, 10);
    if (isNaN(val) || val <= 0) {
      Toast.show(t('toast.invalidThreshold'));
      return;
    }
    setCountries(prev => prev.map(c => c.id === countryId ? { ...c, thresholdDays: val } : c));
  };

  const handleExport = () => {
    try {
      const dataToExport = { trips, countries };
      const jsonString = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${t('manage.exportFilename')}_${dayjs().format('YYYYMMDD')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      Toast.show(t('toast.exportSuccess'));
    } catch (error) {
      Toast.show(t('toast.exportFailed'));
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleImportFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target.result;
        const importedData = JSON.parse(text);

        if (importedData.trips && Array.isArray(importedData.trips) && importedData.countries && Array.isArray(importedData.countries)) {
          // 安全措施：覆盖前自动将当前数据存入备份区
          localStorage.setItem('tax-trips-backup', localStorage.getItem('tax-trips') || '[]');
          localStorage.setItem('tax-countries-backup', localStorage.getItem('tax-countries') || JSON.stringify(defaultCountries));

          // 直接覆盖状态
          setTrips(importedData.trips);
          setCountries(importedData.countries);
          Toast.show(t('toast.importSuccess'));
        } else {
          Toast.show(t('toast.importInvalid'));
        }
      } catch (error) {
        Toast.show(t('toast.importParseError'));
      } finally {
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      Toast.show(t('toast.importReadError'));
      event.target.value = '';
    };

    reader.readAsText(file);
  };

  const filteredTrips = trips.filter(trip => {
    const enterYear = dayjs(trip.enterDate).year();
    const exitYear = trip.exitDate ? dayjs(trip.exitDate).year() : currentYear;
    return enterYear <= activeYear && exitYear >= activeYear;
  });

  const toggleExpand = (countryId) => {
    setExpandedCountryId(prevId => prevId === countryId ? null : countryId);
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '110px' }}>
      <NavBar
        back={null}
        style={{
          backgroundColor: 'rgba(15,35,30,0.55)',
          borderBottom: '1px solid rgba(205,189,151,0.18)',
          backdropFilter: 'blur(6px)',
        }}
        left={<div onClick={() => setActiveYear(y => y - 1)} style={{ padding: '0 12px', fontSize: '18px', color: 'var(--pp-kraft)', cursor: 'pointer' }}><LeftOutline /></div>}
        right={<div onClick={() => setActiveYear(y => y + 1)} style={{ padding: '0 12px', fontSize: '18px', color: 'var(--pp-kraft)', cursor: 'pointer' }}><RightOutline /></div>}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 900, letterSpacing: '1px', color: 'var(--pp-kraft)' }}>
            {t('app.yearLabel', { year: activeYear })}
          </span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="nav-lang-select"
            style={{
              background: 'transparent',
              border: '1px solid rgba(205,189,151,0.35)',
              borderRadius: '4px',
              padding: '1px 5px 1px 3px',
              color: 'var(--pp-kraft)',
              fontSize: '11px',
              fontFamily: "'Space Mono', monospace",
              cursor: 'pointer',
              outline: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            <option value="zh">中</option>
            <option value="en">EN</option>
          </select>
        </div>
      </NavBar>

      {!storageAvailable && (
        <div style={{
          margin: '8px 16px 0', padding: '10px 12px',
          backgroundColor: '#fdecea', border: '1px solid #e74c3c',
          borderRadius: '8px', color: '#c0392b', fontSize: '13px',
          lineHeight: 1.5, textAlign: 'center'
        }}>
          {t('app.storageWarning')}
        </div>
      )}

      <div style={{ padding: '20px 16px 0' }}>
        {countries.length === 0 ? (
           <div style={{ textAlign: 'center', color: 'rgba(236,226,201,0.7)', padding: '40px 0', fontFamily: "'Space Mono', monospace", letterSpacing: '0.5px' }}>{t('app.noCountries')}</div>
        ) : (
          countries.map(country => {
            const currentDays = calculateTotalDays(trips, country.id, activeYear);
            const isExpanded = expandedCountryId === country.id;
            const countryTrips = filteredTrips.filter(t => t.countryId === country.id);
            return (
              <div key={country.id} style={{ marginBottom: '16px' }}>
                <div onClick={() => toggleExpand(country.id)} style={{ cursor: 'pointer' }}>
                  <TaxStatusCard country={{ ...country, name: resolveCountryName(country, lang), currentDays }} isExpanded={isExpanded} tripCount={countryTrips.length} />
                </div>
                {isExpanded && (
                  <List className='trip-list' style={{ marginTop: '8px', borderRadius: '12px', overflow: 'hidden' }}>
                    {countryTrips.length === 0 ? (
                      <List.Item>{t('app.noTripsThisYear')}</List.Item>
                    ) : (
                      countryTrips.map((trip, i) => (
                        <List.Item key={trip.id} prefix={<span className='trip-seq'>{String(i + 1).padStart(2, '0')}</span>} description={`${trip.enterDate}  →  ${trip.exitDate || t('app.untilNow')}`} onClick={(e) => { e.stopPropagation(); handleOpenEdit(trip); }} style={{ cursor: 'pointer' }}>{t('app.tripEntry')}</List.Item>
                      ))
                    )}
                  </List>
                )}
            </div>
            )
          })
        )}
      </div>

      <p className='pp-disclaimer'>
        <span className='pp-disclaimer-label'>— {t('app.disclaimerLabel')} —</span>
        {t('app.disclaimerText')}
      </p>

      {/* 关键修复：改用绝对定位移出屏幕，避免 iOS 对 display:none 的 input 读取失败 */}
      <input type="file" ref={fileInputRef} accept=".json" onChange={handleImportFile} style={{ position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 }} />

      <Button shape='rounded' style={{ position: 'fixed', bottom: '30px', left: '20px', width: '60px', height: '60px', fontSize: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 16px rgba(0,0,0,0.35)', zIndex: 100, backgroundColor: 'var(--pp-kraft)', color: 'var(--pp-ink)', border: '1px solid var(--pp-line)' }} onClick={() => setManageVisible(true)}>
        <SetOutline />
      </Button>

      <Button shape='rounded' color='primary' style={{ position: 'fixed', bottom: '30px', right: '20px', width: '60px', height: '60px', fontSize: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', zIndex: 100 }} onClick={handleOpenAdd}>
        <AddOutline />
      </Button>

      <Popup visible={popupVisible} onMaskClick={() => setPopupVisible(false)} bodyStyle={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}>
        <div style={{ padding: '20px' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>{editingTrip ? t('tripForm.editTitle') : t('tripForm.addTitle')}</h3>
          <List>
            <List.Item><div style={{ marginBottom: '8px', color: '#666', fontSize: '13px' }}>{t('tripForm.selectCountry')}</div><Selector options={countries.map(c => ({ label: `${c.flag} ${resolveCountryName(c, lang)}`, value: c.id }))} value={selectedCountry} onChange={setSelectedCountry} /></List.Item>
            <List.Item title={t('tripForm.enterDate')} extra={dayjs(enterDate).format('YYYY-MM-DD')} onClick={() => setEnterPickerVisible(true)} arrow />
            <DatePicker visible={enterPickerVisible} value={enterDate} onConfirm={val => { setEnterDate(val); setEnterPickerVisible(false); }} onCancel={() => setEnterPickerVisible(false)} />
            {!isStillInCountry && (<><List.Item title={t('tripForm.exitDate')} extra={dayjs(exitDate).format('YYYY-MM-DD')} onClick={() => setExitPickerVisible(true)} arrow /><DatePicker visible={exitPickerVisible} value={exitDate} onConfirm={val => { setExitDate(val); setExitPickerVisible(false); }} onCancel={() => setExitPickerVisible(false)} min={enterDate} /></>)}
            <List.Item title={t('tripForm.stillInCountry')} extra={<Switch checked={isStillInCountry} onChange={val => { setIsStillInCountry(val); if(!val) setExitDate(new Date()); if(val) setExitPickerVisible(false); }} />} />
          </List>
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '13px', color: '#666', marginBottom: '6px' }}>{t('tripForm.note')}</div>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              maxLength={lang === 'zh' ? 50 : 100}
              placeholder={t('tripForm.notePlaceholder')}
              rows={2}
              style={{
                width: '100%',
                border: '1px solid var(--pp-line)',
                borderRadius: '8px',
                padding: '8px 10px',
                fontSize: '16px',
                fontFamily: "'Noto Sans SC', sans-serif",
                resize: 'vertical',
                boxSizing: 'border-box',
              }}
            />
          </div>
          {formError && (
            <div style={{
              marginTop: '16px', padding: '10px 12px',
              backgroundColor: '#fdecea', border: '1px solid #e74c3c',
              borderRadius: '8px', color: '#c0392b', fontSize: '13px',
              lineHeight: 1.5, textAlign: 'center'
            }}>
              {formError}
            </div>
          )}
          <Button block color='primary' size='large' onClick={handleSave} style={{ marginTop: formError ? '12px' : '30px', borderRadius: '20px' }}>{t('tripForm.save')}</Button>
          {editingTrip && <Button block color='danger' fill='outline' size='large' onClick={handleDelete} style={{ marginTop: '10px', borderRadius: '20px' }}>{t('tripForm.deleteRecord')}</Button>}
          <p className='pp-disclaimer-mini'>{t('app.disclaimerMini')}</p>
        </div>
      </Popup>

      <Popup visible={manageVisible} onMaskClick={() => setManageVisible(false)} bodyStyle={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '85vh' }}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>{t('manage.title')}</h3>

          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
            <List header={t('manage.countryThresholdHeader')}>
              {countries.map(c => (
                <List.Item
                  key={c.id}
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type='number' value={c.thresholdDays} onChange={(e) => handleUpdateCountryDays(c.id, e.target.value)} style={{ width: '50px', textAlign: 'right', border: '1px solid #eee', borderRadius: '4px', padding: '4px', marginRight: '10px', fontSize: '16px' }} />
                      <span style={{ color: '#999', fontSize: '12px' }}>{t('manage.daysUnit')}</span>
                      <Button size='mini' color='danger' fill='outline' onClick={() => handleDeleteCountry(c.id)} style={{ marginLeft: '10px' }}>{t('manage.deleteBtn')}</Button>
                    </div>
                  }
                >
                  {c.flag} {resolveCountryName(c, lang)}
                </List.Item>
              ))}
            </List>

            <div style={{ padding: '16px', marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 500, marginBottom: '12px', marginLeft: '4px' }}>{t('manage.addCountryHeader')}</div>
              <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                <input type='text' placeholder={t('manage.namePlaceholder')} value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', marginRight: '8px', fontSize: '16px' }} />
                <input type='text' placeholder={t('manage.emojiPlaceholder')} value={newCountryFlag} onChange={(e) => setNewCountryFlag(e.target.value)} style={{ width: '60px', border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', textAlign: 'center', fontSize: '16px' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type='number' placeholder={t('manage.thresholdPlaceholder')} value={newCountryDays} onChange={(e) => setNewCountryDays(e.target.value)} style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', marginRight: '8px', fontSize: '16px' }} />
                <span style={{ color: '#999', fontSize: '14px' }}>{t('manage.daysUnit')}</span>
              </div>
              <Button color='primary' size='middle' onClick={handleAddCountry} style={{ marginTop: '12px', width: '100%', borderRadius: '20px' }}>{t('manage.addCountryBtn')}</Button>
            </div>

            <div style={{ padding: '16px', marginTop: '16px', backgroundColor: '#fff', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 500, marginBottom: '12px', marginLeft: '4px' }}>{t('manage.dataBackupHeader')}</div>
              <List style={{ marginBottom: 0 }}>
                <List.Item description={t('manage.exportDesc')} onClick={handleExport} arrow>{t('manage.exportData')}</List.Item>
                <List.Item description={t('manage.importDesc')} onClick={handleImportClick} arrow>{t('manage.importData')}</List.Item>
              </List>
            </div>

          </div>

          <Button block size='large' onClick={() => setManageVisible(false)} style={{ marginBottom: '8px', borderRadius: '20px' }}>{t('manage.done')}</Button>
          <p className='pp-disclaimer-mini'>{t('app.disclaimerMini')}</p>
        </div>
      </Popup>
    </div>
  );
}

export default App;
