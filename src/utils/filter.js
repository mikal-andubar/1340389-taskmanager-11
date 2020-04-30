import {isOneDay, isOverdueDate, isRepeating} from "./common";
import {FilterType} from "../constants";

/**
 * Возвращает задачи, которые не в архиве
 * @param {{}[]}tasks
 * @return {{}[]}
 */
const getActiveTasks = (tasks) => tasks.filter((task) => !task.isArchive);

/**
 * Возвращает задачи которые в архиве
 * @param {{}[]} tasks
 * @return {{}[]}
 */
const getArchivedTasks = (tasks) => tasks.filter((task) => task.isArchive);

/**
 * Возвращает задачи, добавленные в избранное
 * @param {{}[]} tasks
 * @return {{}[]}
 */
const getFavoriteTasks = (tasks) => tasks.filter((task) => task.isFavorite);

/**
 * Возвращает просроченные задачи
 * @param {{}[]} tasks
 * @return {{}[]}
 */
export const getOverdueTasks = (tasks) => {
  return tasks.filter((task) => {
    if (!task.dueDate) {
      return false;
    }

    return isOverdueDate(task.dueDate, new Date());
  });
};

/**
 * Возвращает все периодические задачи
 * @param {{}[]} tasks
 * @return {{}[]}
 */
const getRepeatingTasks = (tasks) => tasks.filter((task) => isRepeating(task.repeatingDays));

/**
 * Возвращает сегодняшние задачи
 * @param {{}[]} tasks
 * @return {{}[]}
 */
const getTodayTasks = (tasks) => tasks.filter((task) => isOneDay(task.dueDate, new Date()));

/**
 * Возвращает задачи, соответствующие фильтру
 * @param {{}[]} tasks
 * @param {string} filterType
 * @return {{}[]}
 */
export const getTasksByFilter = (tasks, filterType) => {
  const activeTasks = getActiveTasks(tasks);

  switch (filterType) {
    case FilterType.ALL:
      return activeTasks;
    case FilterType.ARCHIVE:
      return getArchivedTasks(tasks);
    case FilterType.REPEATING:
      return getRepeatingTasks(activeTasks);
    case FilterType.FAVORITES:
      return getFavoriteTasks(activeTasks);
    case FilterType.TODAY:
      return getTodayTasks(activeTasks);
    case FilterType.OVERDUE:
      return getOverdueTasks(activeTasks);
    default:
      return tasks;
  }
};
