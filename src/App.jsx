import React, { useState, useEffect, useRef } from 'react';
import { NavBar, Popup, DatePicker, Button, Selector, Toast, List, Switch } from 'antd-mobile';
import { LeftOutline, RightOutline, AddOutline, SetOutline } from 'antd-mobile-icons';
import TaxStatusCard from './components/TaxStatusCard';
import { calculateTotalDays } from './utils/calculator';
import dayjs from 'dayjs';

const currentYear = new Date().getFullYear();

const defaultCountries = [
  { id: 'CN', name: '中国', flag: '🇨🇳', thresholdDays: 183 },
  { id: 'JP', name: '日本', flag: '🇯🇵', thresholdDays: 365 },
  { id: 'SG', name: '新加坡', flag: '🇸🇬', thresholdDays: 183 },
];

// 常用国家国旗映射表（添加国家时自动匹配）
const COUNTRY_FLAGS = {
  CN: '🇨🇳', JP: '🇯🇵', SG: '🇸🇬',
  KR: '🇰🇷', TH: '🇹🇭', MY: '🇲🇾', ID: '🇮🇩', PH: '🇵🇭', VN: '🇻🇳', IN: '🇮🇳',
  GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪',
  US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽',
  AU: '🇦🇺', NZ: '🇳🇿',
  RU: '🇷🇺', BR: '🇧🇷', ZA: '🇿🇦', AE: '🇦🇪', IT: '🇮🇹', ES: '🇪🇸',
};

// 中文名 → 国旗（添加国家时通过名称匹配）
const COUNTRY_NAME_FLAGS = {
  中国: '🇨🇳', 日本: '🇯🇵', 新加坡: '🇸🇬',
  韩国: '🇰🇷', 泰国: '🇹🇭', 马来西亚: '🇲🇾', 印度尼西亚: '🇮🇩', 菲律宾: '🇵🇭',
  越南: '🇻🇳', 印度: '🇮🇳',
  英国: '🇬🇧', 法国: '🇫🇷', 德国: '🇩🇪',
  美国: '🇺🇸', 加拿大: '🇨🇦', 墨西哥: '🇲🇽',
  澳大利亚: '🇦🇺', 新西兰: '🇳🇿',
  俄罗斯: '🇷🇺', 巴西: '🇧🇷', 南非: '🇿🇦', 阿联酋: '🇦🇪', 意大利: '🇮🇹', 西班牙: '🇪🇸',
};

const getCountryFlag = (idOrName) => {
  return COUNTRY_FLAGS[idOrName] || COUNTRY_NAME_FLAGS[idOrName] || '🌍';
};

function App() {
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

  const fileInputRef = useRef(null);

  useEffect(() => { localStorage.setItem('tax-trips', JSON.stringify(trips)); }, [trips]);
  useEffect(() => { localStorage.setItem('tax-countries', JSON.stringify(countries)); }, [countries]);

  const handleOpenAdd = () => {
    setEditingTrip(null);
    setSelectedCountry(countries.length > 0 ? [countries[0].id] : []);
    setEnterDate(new Date());
    setExitDate(new Date());
    setIsStillInCountry(false);
    setPopupVisible(true);
  };

  const handleOpenEdit = (trip) => {
    setEditingTrip(trip);
    setSelectedCountry([trip.countryId]);
    setEnterDate(dayjs(trip.enterDate).toDate());
    if (!trip.exitDate) {
      setIsStillInCountry(true);
      setExitDate(new Date());
    } else {
      setIsStillInCountry(false);
      setExitDate(dayjs(trip.exitDate).toDate());
    }
    setPopupVisible(true);
  };

  const handleSave = () => {
    if (selectedCountry.length === 0) { Toast.show('请选择国家'); return; }
    if (!isStillInCountry && dayjs(exitDate).isBefore(dayjs(enterDate), 'day')) {
      Toast.show('出境日期不能早于入境日期'); return;
    }
    const tripData = {
      countryId: selectedCountry[0],
      enterDate: dayjs(enterDate).format('YYYY-MM-DD'),
      exitDate: isStillInCountry ? null : dayjs(exitDate).format('YYYY-MM-DD')
    };
    if (editingTrip) {
      setTrips(trips.map(t => t.id === editingTrip.id ? { ...tripData, id: editingTrip.id } : t));
      Toast.show('修改成功');
    } else {
      setTrips([...trips, { ...tripData, id: Date.now() }]);
      Toast.show('添加成功');
    }
    setPopupVisible(false);
  };

  const handleDelete = () => {
    if (editingTrip) {
      setTrips(trips.filter(t => t.id !== editingTrip.id));
      setPopupVisible(false);
      Toast.show('已删除');
    }
  };

  const handleAddCountry = () => {
    const name = newCountryName.trim();
    const days = parseInt(newCountryDays, 10);
    if (!name || isNaN(days) || days <= 0) {
      Toast.show('请填写正确的名称和天数'); return;
    }
    // 拦截重复国家（不区分大小写）
    if (countries.some(c => c.name.trim().toLowerCase() === name.toLowerCase())) {
      Toast.show(`「${name}」已存在，请勿重复添加`); return;
    }
    // 自动匹配国旗：优先用户手动输入，其次按中文名查，最后按代码查
    const customFlag = newCountryFlag.trim();
    const autoFlag = customFlag || getCountryFlag(name) || getCountryFlag(name.toUpperCase().slice(0, 2));

    const newCountry = {
      id: 'CUST_' + Date.now(), name: name, flag: autoFlag, thresholdDays: days
    };
    setCountries(prev => [...prev, newCountry]);
    setNewCountryName(''); setNewCountryFlag(''); setNewCountryDays('183');
    Toast.show('国家添加成功');
  };

  const handleDeleteCountry = (countryId) => {
    if (window.confirm('删除国家将同时删除该国家下的所有行程记录，确定吗？')) {
      setCountries(prev => prev.filter(c => c.id !== countryId));
      setTrips(prev => prev.filter(t => t.countryId !== countryId));
      if (expandedCountryId === countryId) setExpandedCountryId(null);
      Toast.show('已删除');
    }
  };

  const handleUpdateCountryDays = (countryId, newDays) => {
    const val = parseInt(newDays, 10);
    if(isNaN(val) || val <= 0) return;
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
      link.download = `税务居住期备份_${dayjs().format('YYYYMMDD')}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      Toast.show('导出成功');
    } catch (error) {
      Toast.show('导出失败');
    }
  };

  // 极其纯粹，只为通过 iOS 的严格安全检查
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
          Toast.show('导入成功！(旧数据已暂存)');
        } else {
          Toast.show('无效的备份文件格式');
        }
      } catch (error) {
        Toast.show('文件解析失败');
      } finally {
        // 关键修复：必须在读取完毕后才清空 input value，否则 iOS 会中断读取
        event.target.value = '';
      }
    };
    reader.onerror = () => {
      Toast.show('读取文件失败');
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
        <span style={{ fontFamily: "'Noto Serif SC', serif", fontWeight: 900, letterSpacing: '1px', color: 'var(--pp-kraft)' }}>
          {activeYear} 税务居住期
        </span>
      </NavBar>
      
      <div style={{ padding: '20px 16px 0' }}>
        {countries.length === 0 ? (
           <div style={{ textAlign: 'center', color: 'rgba(236,226,201,0.7)', padding: '40px 0', fontFamily: "'Space Mono', monospace", letterSpacing: '0.5px' }}>暂无国家，请点击左下角齿轮添加</div>
        ) : (
          countries.map(country => {
            const currentDays = calculateTotalDays(trips, country.id, activeYear);
            const isExpanded = expandedCountryId === country.id;
            const countryTrips = filteredTrips.filter(t => t.countryId === country.id);
            return (
              <div key={country.id} style={{ marginBottom: '16px' }}>
                <div onClick={() => toggleExpand(country.id)} style={{ cursor: 'pointer' }}>
                  <TaxStatusCard country={{ ...country, currentDays }} isExpanded={isExpanded} tripCount={countryTrips.length} />
                </div>
                {isExpanded && (
                  <List className='trip-list' style={{ marginTop: '8px', borderRadius: '12px', overflow: 'hidden' }}>
                    {countryTrips.length === 0 ? (
                      <List.Item>该年度暂无记录</List.Item>
                    ) : (
                      countryTrips.map((trip, i) => (
                        <List.Item key={trip.id} prefix={<span className='trip-seq'>{String(i + 1).padStart(2, '0')}</span>} description={`${trip.enterDate}  →  ${trip.exitDate || '至今'}`} onClick={(e) => { e.stopPropagation(); handleOpenEdit(trip); }} style={{ cursor: 'pointer' }}>入境停留</List.Item>
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
        本工具仅供参考，不构成税务建议。税务居民身份还涉及住所、习惯性居所、高管身份等复杂因素，请以当地税法及专业税务师意见为准。
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
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>{editingTrip ? '编辑出入境记录' : '添加出入境记录'}</h3>
          <List>
            <List.Item><div style={{ marginBottom: '8px', color: '#666', fontSize: '13px' }}>选择国家</div><Selector options={countries.map(c => ({ label: `${c.flag} ${c.name}`, value: c.id }))} value={selectedCountry} onChange={setSelectedCountry} /></List.Item>
            <List.Item title='入境日期' extra={dayjs(enterDate).format('YYYY-MM-DD')} onClick={() => setEnterPickerVisible(true)} arrow />
            <DatePicker visible={enterPickerVisible} value={enterDate} onConfirm={val => { setEnterDate(val); setEnterPickerVisible(false); }} onCancel={() => setEnterPickerVisible(false)} />
            <List.Item title='目前仍在境内' extra={<Switch checked={isStillInCountry} onChange={val => { setIsStillInCountry(val); if(!val) setExitDate(new Date()); if(val) setExitPickerVisible(false); }} />} />
            {!isStillInCountry && (<><List.Item title='出境日期' extra={dayjs(exitDate).format('YYYY-MM-DD')} onClick={() => setExitPickerVisible(true)} arrow /><DatePicker visible={exitPickerVisible} value={exitDate} onConfirm={val => { setExitDate(val); setExitPickerVisible(false); }} onCancel={() => setExitPickerVisible(false)} min={enterDate} /></>)}
          </List>
          <Button block color='primary' size='large' onClick={handleSave} style={{ marginTop: '30px', borderRadius: '20px' }}>保存</Button>
          {editingTrip && <Button block color='danger' fill='outline' size='large' onClick={handleDelete} style={{ marginTop: '10px', borderRadius: '20px' }}>删除此记录</Button>}
          <p className='pp-disclaimer-mini'>仅按单自然年物理停留天数计算，不构成税务建议，请咨询专业税务师。</p>
        </div>
      </Popup>

      <Popup visible={manageVisible} onMaskClick={() => setManageVisible(false)} bodyStyle={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px', height: '85vh' }}>
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', height: '100%' }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>设置与数据管理</h3>
          
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: '20px' }}>
            <List header='数据备份与恢复' style={{ marginBottom: '15px' }}>
              <List.Item description='将所有记录导出为文件保存' onClick={handleExport} arrow>导出数据</List.Item>
              <List.Item description='选择文件导入（覆盖前会自动暂存旧数据）' onClick={handleImportClick} arrow>导入数据</List.Item>
            </List>

            <List header='国家与阈值管理 (点击天数可修改)'>
              {countries.map(c => (
                <List.Item 
                  key={c.id}
                  extra={
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input type='number' value={c.thresholdDays} onChange={(e) => handleUpdateCountryDays(c.id, e.target.value)} style={{ width: '50px', textAlign: 'right', border: '1px solid #eee', borderRadius: '4px', padding: '4px', marginRight: '10px' }} />
                      <span style={{ color: '#999', fontSize: '12px' }}>天</span>
                      <Button size='mini' color='danger' fill='outline' onClick={() => handleDeleteCountry(c.id)} style={{ marginLeft: '10px' }}>删</Button>
                    </div>
                  }
                >
                  {c.flag} {c.name}
                </List.Item>
              ))}
            </List>

            <div style={{ padding: '16px', marginTop: '12px', backgroundColor: '#fff', borderRadius: '12px' }}>
              <div style={{ fontSize: '14px', color: '#333', fontWeight: 500, marginBottom: '12px', marginLeft: '4px' }}>添加新国家</div>
              <div style={{ display: 'flex', marginBottom: '8px', alignItems: 'center' }}>
                <input type='text' placeholder='名称 (如: 美国)' value={newCountryName} onChange={(e) => setNewCountryName(e.target.value)} style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', marginRight: '8px' }} />
                <input type='text' placeholder='Emoji' value={newCountryFlag} onChange={(e) => setNewCountryFlag(e.target.value)} style={{ width: '60px', border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', textAlign: 'center' }} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <input type='number' placeholder='判定天数' value={newCountryDays} onChange={(e) => setNewCountryDays(e.target.value)} style={{ flex: 1, border: '1px solid #eee', borderRadius: '8px', padding: '8px 12px', marginRight: '8px' }} />
                <span style={{ color: '#999', fontSize: '14px' }}>天</span>
              </div>
              <Button color='primary' size='middle' onClick={handleAddCountry} style={{ marginTop: '12px', width: '100%', borderRadius: '20px' }}>添加此国家</Button>
            </div>
          </div>
          
          <p className='pp-disclaimer-mini'>本工具仅供参考，不构成税务建议，请以当地税法及专业税务师意见为准。</p>
          <Button block size='large' onClick={() => setManageVisible(false)} style={{ marginTop: '8px', borderRadius: '20px' }}>完成</Button>
        </div>
      </Popup>
    </div>
  );
}

export default App;