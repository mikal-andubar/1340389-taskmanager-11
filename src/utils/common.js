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
