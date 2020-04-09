import {DAYS} from "../constants";

/**
 * Стартовый объект для подсчета задач для фильтров
 * @type {{}}
 */
const EMPTY_FILTERS = {
  all: 0,
  overdue: 0,
  today: 0,
  favorites: 0,
  repeating: 0,
  archive: 0
};

/**
 * Генератор фильтров
 * @param {[]} tasks
 * @return {[]}
 */
export const generateFilters = (tasks) => {
  /**
   * Количество подходящих под фильтры задач
   * @type {{}}
   */
  const filterCount = tasks.reduce((count, task) => {
    /**
     * Проверка просроченности задачи
     * @type {boolean}
     */
    const isExpired = task.dueDate instanceof Date && task.dueDate < Date.now();

    /**
     * Сегодняшняя дата для сравнения
     * @type {Date}
     */
    const todayDate = new Date();

    /**
     * Проверка того, что задача приходится на сегодня
     * @type {boolean}
     */
    const isToday = (task.repeatingDays[DAYS[todayDate.getDay() - 1]])
      || (
        task.dueDate instanceof Date
        && task.dueDate.setHours(0, 0, 0, 0) === todayDate.setHours(0, 0, 0, 0)
      );

    /**
     * Проверка того, что задача является периодической
     * @type {boolean}
     */
    const isRepeating = Object.values(task.repeatingDays).some(Boolean);

    count.all++;

    if (isExpired) {
      count.overdue++;
    }

    if (isToday) {
      count.today++;
    }

    if (task.isFavorite) {
      count.favorites++;
    }

    if (isRepeating) {
      count.repeating++;
    }

    if (task.isArchive) {
      count.archive++;
    }

    return count;
  }, EMPTY_FILTERS);

  /**
   * Итоговый массив фильтров
   * @type {*[]}
   */
  const filters = [];
  for (let value of Object.entries(filterCount)) {
    const filter = {
      name: value[0],
      count: value[1],
    };
    filters.push(filter);
  }
  return filters;

};

