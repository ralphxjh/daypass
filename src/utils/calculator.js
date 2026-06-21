// src/utils/calculator.js
import dayjs from 'dayjs';

/**
 * 计算单条行程在目标年份中的停留天数
 * @param {Object} trip - 行程对象 { enterDate, exitDate }
 * @param {number} targetYear - 目标年份，如 2024
 * @returns {number} - 在该年份的停留天数
 */
export const calculateDaysForYear = (trip, targetYear) => {
  const enter = dayjs(trip.enterDate);
  // 如果没有出境日期，默认为今天
  const exit = trip.exitDate ? dayjs(trip.exitDate) : dayjs();

  const yearStart = dayjs(`${targetYear}-01-01`);
  const yearEnd = dayjs(`${targetYear}-12-31`);

  // 如果行程完全在目标年份之外，返回 0
  if (exit.isBefore(yearStart, 'day') || enter.isAfter(yearEnd, 'day')) {
    return 0;
  }

  // 截断：取晚者作为有效开始，取早者作为有效结束
  const effectiveStart = enter.isBefore(yearStart) ? yearStart : enter;
  const effectiveEnd = exit.isAfter(yearEnd) ? yearEnd : exit;

  // 同日双算：1号入2号出，算2天。所以差值+1
  return effectiveEnd.diff(effectiveStart, 'day') + 1;
};

/**
 * 计算某个国家在目标年份的总停留天数
 * @param {Array} trips - 所有行程数组
 * @param {String} countryId - 国家ID
 * @param {number} targetYear - 目标年份
 * @returns {number} - 总天数
 */
export const calculateTotalDays = (trips, countryId, targetYear) => {
  return trips
    .filter(trip => trip.countryId === countryId)
    .reduce((total, trip) => total + calculateDaysForYear(trip, targetYear), 0);
};