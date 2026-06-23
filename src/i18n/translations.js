// ============================================================
//  i18n 翻译数据
//  所有中文 / 英文文本集中管理
//  动态文本用 {{变量名}} 占位
// ============================================================

const translations = {
  zh: {
    app: {
      title: 'DayPass · 税务居住期',
      yearLabel: '税居 · {{year}}',
      storageWarning: '⚠️ 浏览器不支持数据存储，您的出入境记录无法保存。请关闭隐私/无痕模式后重新打开。',
      noCountries: '暂无国家，请点击左下角齿轮添加',
      noTripsThisYear: '该年度暂无记录',
      tripEntry: '入境停留',
      untilNow: '至今',
      disclaimerLabel: '免责声明',
      disclaimerText: '本工具仅供参考，不构成税务建议。税务居民身份还涉及住所、习惯性居所、高管身份等复杂因素，请以当地税法及专业税务师意见为准。',
      disclaimerMini: '仅按单自然年物理停留天数计算，不构成税务建议，请咨询专业税务师。',
    },
    taxStatusCard: {
      passportLabel: 'PASSPORT · 税务居住记录',
      dayThreshold: '天阈值',
      canStay: '还可停留 {{remaining}} 天 · 超过即触发税务居民判定',
      exceeded: '已超出 {{days}} 天 · 已达税务居民判定线',
      records: '{{count}} 条记录',
      noRecords: '无记录',
    },
    tripForm: {
      addTitle: '添加出入境记录',
      editTitle: '编辑出入境记录',
      selectCountry: '选择国家',
      enterDate: '入境日期',
      exitDate: '出境日期',
      stillInCountry: '目前仍在境内',
      note: '备注',
      notePlaceholder: '选填（最多50字）',
      save: '保存',
      deleteRecord: '删除此记录',
    },
    manage: {
      title: '设置与数据管理',
      countryThresholdHeader: '国家与阈值管理 (输入天数可修改)',
      daysUnit: '天',
      deleteBtn: '删',
      addCountryHeader: '添加新国家',
      namePlaceholder: '名称 (如: 美国)',
      emojiPlaceholder: 'Emoji',
      thresholdPlaceholder: '判定天数',
      addCountryBtn: '添加此国家',
      dataBackupHeader: '数据备份与恢复',
      exportData: '导出数据',
      exportDesc: '将所有记录导出为文件保存',
      importData: '导入数据',
      importDesc: '选择文件导入（覆盖前会自动暂存旧数据）',
      done: '完成',
      confirmDeleteCountry: '删除国家将同时删除该国家下的所有行程记录，确定吗？',
      exportFilename: '税务居住期备份',
    },
    toast: {
      selectCountry: '请选择国家',
      dateOrder: '出境日期不能早于入境日期',
      dateOverlap: '该时段与「{{dates}}」的记录重叠，请核查',
      modified: '修改成功',
      added: '添加成功',
      deleted: '已删除',
      invalidCountry: '请填写正确的名称和天数',
      duplicateCountry: '「{{name}}」已存在，请勿重复添加',
      countryAdded: '国家添加成功',
      exportSuccess: '导出成功',
      exportFailed: '导出失败',
      importSuccess: '导入成功！(旧数据已暂存)',
      importInvalid: '无效的备份文件格式',
      importParseError: '文件解析失败',
      importReadError: '读取文件失败',
      invalidThreshold: '天数必须为正整数',
    },
    statusText: {
      safe: 'SAFE 安全',
      watch: 'WATCH 警告',
      alert: 'ALERT 危险',
    },
    countryNames: {
      CN: '中国', JP: '日本', SG: '新加坡',
      KR: '韩国', TH: '泰国', MY: '马来西亚', ID: '印度尼西亚',
      PH: '菲律宾', VN: '越南', IN: '印度',
      GB: '英国', FR: '法国', DE: '德国',
      US: '美国', CA: '加拿大', MX: '墨西哥',
      AU: '澳大利亚', NZ: '新西兰',
      RU: '俄罗斯', BR: '巴西', ZA: '南非',
      AE: '阿联酋', IT: '意大利', ES: '西班牙',
    },
  },

  en: {
    app: {
      title: 'DayPass · Tax Residency',
      yearLabel: 'DayPass · {{year}}',
      storageWarning: '⚠️ Data storage is unavailable. Your trip records cannot be saved. Please exit private/incognito mode and reopen.',
      noCountries: 'No countries yet. Tap the gear icon to add one.',
      noTripsThisYear: 'No records for this year',
      tripEntry: 'Entry Stay',
      untilNow: 'Present',
      disclaimerLabel: 'Disclaimer',
      disclaimerText: 'This tool is for reference only and does not constitute tax advice. Tax residency also involves domicile, habitual abode, executive status and other complex factors. Please refer to local tax law and consult a professional tax advisor.',
      disclaimerMini: 'Based on physical days in a single calendar year only. Does not constitute tax advice. Please consult a tax professional.',
    },
    taxStatusCard: {
      passportLabel: 'PASSPORT · Tax Residency Record',
      dayThreshold: 'days threshold',
      canStay: '{{remaining}} days remaining · triggers residency determination',
      exceeded: 'Exceeded by {{days}} days · residency threshold reached',
      records: '{{count}} record(s)',
      noRecords: 'No records',
    },
    tripForm: {
      addTitle: 'Add Entry/Exit Record',
      editTitle: 'Edit Entry/Exit Record',
      selectCountry: 'Select Country',
      enterDate: 'Entry Date',
      exitDate: 'Exit Date',
      stillInCountry: 'Currently Still in Country',
      note: 'Note',
      notePlaceholder: 'Optional (max 100 chars)',
      save: 'Save',
      deleteRecord: 'Delete This Record',
    },
    manage: {
      title: 'Settings & Data Management',
      countryThresholdHeader: 'Countries & Thresholds (enter days to edit)',
      daysUnit: 'days',
      deleteBtn: 'Del',
      addCountryHeader: 'Add New Country',
      namePlaceholder: 'Name (e.g. USA)',
      emojiPlaceholder: 'Emoji',
      thresholdPlaceholder: 'Threshold Days',
      addCountryBtn: 'Add Country',
      dataBackupHeader: 'Data Backup & Restore',
      exportData: 'Export Data',
      exportDesc: 'Export all records as a file',
      importData: 'Import Data',
      importDesc: 'Import from file (old data auto-saved)',
      done: 'Done',
      confirmDeleteCountry: 'Deleting this country will also delete all its trip records. Continue?',
      exportFilename: 'TaxResidencyBackup',
    },
    toast: {
      selectCountry: 'Please select a country',
      dateOrder: 'Exit date cannot be earlier than entry date',
      dateOverlap: 'This period overlaps with "{{dates}}", please check',
      modified: 'Modified successfully',
      added: 'Added successfully',
      deleted: 'Deleted',
      invalidCountry: 'Please enter valid name and days',
      duplicateCountry: '"{{name}}" already exists',
      countryAdded: 'Country added',
      exportSuccess: 'Export successful',
      exportFailed: 'Export failed',
      importSuccess: 'Import successful! (old data backed up)',
      importInvalid: 'Invalid backup file format',
      importParseError: 'Failed to parse file',
      importReadError: 'Failed to read file',
      invalidThreshold: 'Days must be a positive integer',
    },
    statusText: {
      safe: 'SAFE',
      watch: 'WATCH',
      alert: 'ALERT',
    },
    countryNames: {
      CN: 'China', JP: 'Japan', SG: 'Singapore',
      KR: 'South Korea', TH: 'Thailand', MY: 'Malaysia', ID: 'Indonesia',
      PH: 'Philippines', VN: 'Vietnam', IN: 'India',
      GB: 'United Kingdom', FR: 'France', DE: 'Germany',
      US: 'United States', CA: 'Canada', MX: 'Mexico',
      AU: 'Australia', NZ: 'New Zealand',
      RU: 'Russia', BR: 'Brazil', ZA: 'South Africa',
      AE: 'UAE', IT: 'Italy', ES: 'Spain',
    },
  },
};

// ============ 国旗 emoji 映射表 （ISO 代码 → 🇽🇽） ============
export const COUNTRY_FLAGS = {
  CN: '🇨🇳', JP: '🇯🇵', SG: '🇸🇬',
  KR: '🇰🇷', TH: '🇹🇭', MY: '🇲🇾', ID: '🇮🇩',
  PH: '🇵🇭', VN: '🇻🇳', IN: '🇮🇳',
  GB: '🇬🇧', FR: '🇫🇷', DE: '🇩🇪',
  US: '🇺🇸', CA: '🇨🇦', MX: '🇲🇽',
  AU: '🇦🇺', NZ: '🇳🇿',
  RU: '🇷🇺', BR: '🇧🇷', ZA: '🇿🇦',
  AE: '🇦🇪', IT: '🇮🇹', ES: '🇪🇸',
};

// ============ 名称 → ISO 代码（双向：中文 + 英文） ============
const NAME_TO_CODE = {
  // 中文名
  中国: 'CN', 日本: 'JP', 新加坡: 'SG',
  韩国: 'KR', 泰国: 'TH', 马来西亚: 'MY', 印度尼西亚: 'ID',
  菲律宾: 'PH', 越南: 'VN', 印度: 'IN',
  英国: 'GB', 法国: 'FR', 德国: 'DE',
  美国: 'US', 加拿大: 'CA', 墨西哥: 'MX',
  澳大利亚: 'AU', 新西兰: 'NZ',
  俄罗斯: 'RU', 巴西: 'BR', 南非: 'ZA',
  阿联酋: 'AE', 意大利: 'IT', 西班牙: 'ES',
  // 英文名（大小写不敏感，统一小写存储）
  china: 'CN', 'prc': 'CN',
  japan: 'JP',
  singapore: 'SG',
  'south korea': 'KR', korea: 'KR',
  thailand: 'TH',
  malaysia: 'MY',
  indonesia: 'ID',
  philippines: 'PH',
  vietnam: 'VN',
  india: 'IN',
  'united kingdom': 'GB', uk: 'GB', britain: 'GB', england: 'GB',
  france: 'FR',
  germany: 'DE',
  'united states': 'US', usa: 'US', 'united states of america': 'US',
  canada: 'CA',
  mexico: 'MX',
  australia: 'AU',
  'new zealand': 'NZ',
  russia: 'RU',
  brazil: 'BR',
  'south africa': 'ZA',
  'united arab emirates': 'AE', uae: 'AE',
  italy: 'IT',
  spain: 'ES',
};

// 2字母/3字母代码 索引（加快 ISO 代码查找）
const ISO_NAMES = {
  cn: 'CN', jp: 'JP', sg: 'SG', kr: 'KR', th: 'TH',
  my: 'MY', id: 'ID', ph: 'PH', vn: 'VN', in: 'IN',
  gb: 'GB', uk: 'GB', fr: 'FR', de: 'DE', us: 'US',
  ca: 'CA', mx: 'MX', au: 'AU', nz: 'NZ',
  ru: 'RU', br: 'BR', za: 'ZA', ae: 'AE', it: 'IT', es: 'ES',
};

/**
 * 根据用户输入的名称返回国旗 emoji（自动匹配中文/英文/代码）
 * @param {string} name — 用户输入的国家名称或代码
 * @returns {string|null} 国旗 emoji，未找到返回 null
 */
export function getFlagByName(name) {
  const trimmed = name.trim();
  if (!trimmed) return null;
  // 1. 直接匹配中文名
  if (NAME_TO_CODE[trimmed]) return COUNTRY_FLAGS[NAME_TO_CODE[trimmed]];
  // 2. 小写匹配英文名
  if (NAME_TO_CODE[trimmed.toLowerCase()]) return COUNTRY_FLAGS[NAME_TO_CODE[trimmed.toLowerCase()]];
  // 3. ISO 代码匹配
  const code = ISO_NAMES[trimmed.toLowerCase()];
  if (code) return COUNTRY_FLAGS[code];
  // 4. 已经是 ISO 代码（如 CN、US）
  if (trimmed.length === 2 && trimmed === trimmed.toUpperCase() && COUNTRY_FLAGS[trimmed]) {
    return COUNTRY_FLAGS[trimmed];
  }
  return null;
}

/**
 * ISO 代码 → 国旗 emoji
 */
export function getFlagForCountryCode(code) {
  return COUNTRY_FLAGS[code] || null;
}

/**
 * 根据 ISO 代码 + 语言返回国家显示名称
 * @param {string} id — ISO 代码（CN, US...）或自定义 ID
 * @param {string} lang — 'zh' | 'en'
 * @returns {string}
 */
export function getCountryName(id, lang) {
  const names = translations[lang]?.countryNames || translations.zh.countryNames;
  return names[id] || id;
}

/**
 * 解析国家显示名：已知 ISO 代码用翻译，自定义国家用原名
 * @param {{ id: string, name: string }} country
 * @param {string} lang
 * @returns {string}
 */
export function resolveCountryName(country, lang) {
  const translated = translations[lang]?.countryNames?.[country.id];
  return translated || country.name || country.id;
}

export default translations;
