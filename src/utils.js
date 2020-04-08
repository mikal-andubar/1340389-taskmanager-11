/**
 * Добавление ведущего нуля к времени
 * @param {number} value
 * @return {string}
 */
const castTimeFormat = (value) => {
  return value < 10 ? `0${value}` : String(value);
};

/**
 * Форматирование времени
 * @param {Date} date
 * @return {string}
 */
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};
