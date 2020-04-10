import {DAYS} from "../constants";

const EMPTY_FILTERS = [
  {name: `all`, count: 0},
  {name: `overdue`, count: 0},
  {name: `today`, count: 0},
  {name: `favorites`, count: 0},
  {name: `repeating`, count: 0},
  {name: `archive`, count: 0},
];

/**
 * Прибавляет к числу numeric заданное addingValue
 * @param {number} numeric
 * @param {number} addingValue
 * @return {number}
 */
const increaseInt = (numeric, addingValue = 1) => numeric + addingValue;

/**
 * Проверка того, что дата просрочена
 * @param {Date} date
 * @return {boolean}
 */
const isDateExpired = (date) => date instanceof Date && date < Date.now();

/**
 * Проверка того, что задача приходится на сегодня
 * @param {{}} task
 * @return {boolean}
 */
const isTodayTask = (task) => {
  /**
   * Сегодняшняя дата для сравнения
   * @type {Date}
   */
  const todayDate = new Date();

  return (task.repeatingDays[DAYS[todayDate.getDay() - 1]])
    || (
      task.dueDate instanceof Date
      && new Date(task.dueDate).setHours(0, 0, 0, 0) === todayDate.setHours(0, 0, 0, 0)
    );
};

/**
 * Проверка того, что задача является периодической
 * @param {{}} task
 * @return {boolean}
 */
const isRepeatingTask = (task) => Object.values(task.repeatingDays).some(Boolean);

/**
 * Генератор фильтров
 * @param {[]} tasks
 * @return {[]}
 */
export const generateFilters = (tasks) => {
  return tasks.reduce((acc, task) => {
    const [all, overdue, today, favorites, repeating, archive] = acc.map((it) => it.count);

    return [
      {
        name: `all`,
        count: increaseInt(all),
      },
      {
        name: `overdue`,
        count: isDateExpired(task.dueDate) ? increaseInt(overdue) : overdue,
      },
      {
        name: `today`,
        count: isTodayTask(task) ? increaseInt(today) : today,
      },
      {
        name: `favorites`,
        count: task.isFavorite ? increaseInt(favorites): favorites,
      },
      {
        name: `repeating`,
        count: isRepeatingTask(task) ? increaseInt(repeating) : repeating,
      },
      {
        name: `archive`,
        count: task.isArchive ? increaseInt(archive) : archive,
      },
    ];
  }, EMPTY_FILTERS);
};

