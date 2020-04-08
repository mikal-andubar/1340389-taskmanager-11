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
 * Дефолтный списка дней повторения на основе массива DAYS
 * @type {{}}
 */
const defaultRepeatingDays = Object.fromEntries(DAYS.map((it) => [it, false]));

/**
 * Возвращает псевдослучайное целое число из интервала min-max
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
const getRandomInt = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

/**
 * Возвращает случайный элемент массива
 * @param {[]} array
 * @return {*}
 */
const getRandomArrayItem = (array) => {
  const randomIndex = getRandomInt(0, array.length);

  return array[randomIndex];
};

/**
 * Возвращает случайную дату
 * @return {Date}
 */
const getRandomDate = () => {
  const targetDate = new Date();
  targetDate.setHours(getRandomInt(0, 24));
  const sign = Math.random() > 0.5 ? 1 : -1;
  const diffValue = sign * getRandomInt(0, 8);

  targetDate.setDate(targetDate.getDate() + diffValue);

  return targetDate;
};

/**
 * Генерирует случайный набор repeatingDays
 * @return {{}}
 */
const generateRepeatingDays = () => {
  return Object.fromEntries(DAYS.map((it) => [it, Math.random() <= 0.2]));
};

/**
 * Генерирует данные для задачи
 * @return {{}}
 */
const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayItem(descriptionItems),
    dueDate,
    repeatingDays: dueDate ? defaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

/**
 * Генерирует заданное количество задач
 * @param {number} count
 * @return {[]}
 */
const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};


export {generateTask, generateTasks};
