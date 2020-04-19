import {COLORS, DAYS} from "../constants";

/**
 * Возможные значения для случайного заполнения поля description
 * @type {string[]}
 */
const descriptionItems = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`,
];

/**
 * Дефолтный список дней повторения на основе массива DAYS
 * @type {{}}
 */
const defaultRepeatingDays = Object.fromEntries(DAYS.map((it) => [it, false]));

/**
 * Возвращает псевдослучайное целое число из интервала min-max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomInt = (min, max) => min + Math.floor(Math.random() * (max - min));

/**
 * Возвращает случайное значение boolean
 * @return {boolean}
 */
const getRandomBool = () => Math.random() > 0.5;

/**
 * Возвращает случайный элемент массива
 * @param {[]} array
 * @return {*}
 */
const getRandomArrayItem = (array) => array[getRandomInt(0, array.length)];

/**
 * Возвращает случайную дату
 * @return {Date}
 */
const getRandomDate = () => {
  const targetDate = new Date();
  const sign = getRandomBool() ? 1 : -1;
  const diffValue = sign * getRandomInt(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);
  targetDate.setHours(getRandomInt(0, 24), 0, 0, 0);
  return targetDate;
};

/**
 * Генерирует случайный набор repeatingDays
 * @return {{}}
 */
const generateRepeatingDays = () => Object.fromEntries(DAYS.map((it) => [it, Math.random() <= 0.2]));

/**
 * Генерирует данные для задачи
 * @param {any} task
 * @param {number} id
 * @return {{}}
 */
const generateTask = (task, id) => {
  const dueDate = getRandomBool() ? null : getRandomDate();

  return {
    id,
    description: getRandomArrayItem(descriptionItems),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isArchive: getRandomBool(),
    isFavorite: getRandomBool(),
  };
};

/**
 * Генерирует заданное количество задач
 * @param {number} count
 * @return {[]}
 */
const generateTasks = (count) => new Array(count).fill(``).map(generateTask);

export {generateTasks};
