import moment from "moment";

/**
 * Форматирование времени
 * @param {Date} date
 * @return {string}
 */
export const formatTime = (date) => moment(date).format(`hh:mm`);

/**
 * Форматирование даты
 * @param {Date} date
 * @return {string}
 */
export const formatDate = (date) => moment(date).format(`DD MMMM`);

/**
 * Ищет данные кнопки по переданному ключу
 * @param {{}} buttons
 * @param {string} name
 * @return {{}}
 */
export const findButtonByName = (buttons, name) => Object.values(buttons).find((btn) => btn.name === name);

/**
 * Проверка того, является ли задача периодической
 * @param {{}} repeatingDays
 * @return {boolean}
 */
export const isRepeating = (repeatingDays) => Object.values(repeatingDays).some(Boolean);

/**
 * Проверка того, что дата просрочена
 * @param {Date} dueDate
 * @param {Date} date
 * @return {boolean}
 */
export const isOverdueDate = (dueDate, date) => dueDate < date && !isOneDay(date, dueDate);

/**
 * Проверка того, что даты попадают на один день
 * @param {Date} date1
 * @param {Date} date2
 * @return {boolean|boolean}
 */
export const isOneDay = (date1, date2) => {
  const oneDate = moment(date1);
  const anotherDate = moment(date2);
  return oneDate.diff(anotherDate, `days`) === 0 && date1.getDate() === date2.getDate();
};
