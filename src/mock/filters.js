import {DAYS} from "../constants";

/**
 * Названия фильров
 * @type {{}}
 */
const FILTER_NAME = {
  ALL: `all`,
  OVERDUE: `overdue`,
  TODAY: `today`,
  FAVORITES: `favorites`,
  REPEATING: `repeating`,
  ARCHIVE: `archive`
};

/**
 * Генератор фильтров
 * @param {[]} tasks
 * @return {[]}
 */
export const generateFilters = (tasks) => {
  let allCount = 0;
  let overdueCount = 0;
  let todayCount = 0;
  let favoritesCount = 0;
  let repeatingCount = 0;
  let archiveCount = 0;

  tasks.forEach((task) => {
    allCount++;

    if (task.dueDate instanceof Date && task.dueDate < Date.now()) {
      overdueCount++;
    }

    if (task.repeatingDays[DAYS[new Date().getDay() - 1]]) {
      todayCount++;
    }

    if (task.isFavorite) {
      favoritesCount++;
    }

    if (Object.values(task.repeatingDays).some(Boolean)) {
      repeatingCount++;
    }

    if (task.isArchive) {
      archiveCount++;
    }
  });

  return [
    {
      name: FILTER_NAME.ALL,
      count: allCount,
    },
    {
      name: FILTER_NAME.OVERDUE,
      count: overdueCount,
    },
    {
      name: FILTER_NAME.TODAY,
      count: todayCount,
    },
    {
      name: FILTER_NAME.FAVORITES,
      count: favoritesCount,
    },
    {
      name: FILTER_NAME.REPEATING,
      count: repeatingCount,
    },
    {
      name: FILTER_NAME.ARCHIVE,
      count: archiveCount,
    },
  ];
};

