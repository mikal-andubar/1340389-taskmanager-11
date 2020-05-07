import {FilterType} from "../constants";
import {getTasksByFilter} from "../utils/filter";

/**
 * Модель данных для задач
 */
export default class Tasks {

  /**
   * Конструктор класса
   */
  constructor() {
    this._tasks = [];
    this._activeFilterType = FilterType.ALL;

    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  /**
   * Возвращает массив задач, соответствующих текущему фильтру
   * @return {[]}
   */
  getTasks() {
    return getTasksByFilter(this._tasks, this._activeFilterType);
  }

  /**
   * Возвращает все задачи, независимо от фильтров
   * @return {[]}
   */
  getAllTasks() {
    return this._tasks;
  }

  /**
   * Устанавливает массив задач
   * @param {{}[]} tasks
   */
  setTasks(tasks) {
    this._tasks = Array.from(tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * Устанавливает активный фильтр
   * @param {string} filterType
   */
  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  /**
   * Обновляет одну задачу
   * @param {number} id
   * @param {{}} task
   * @return {boolean}
   */
  updateTask(id, task) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), task, this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /**
   * Добавляет задачу в модель
   * @param {{}} task
   */
  addTask(task) {
    this._tasks = [].concat(task, this._tasks);
    this._callHandlers(this._dataChangeHandlers);
  }

  /**
   * Удаляет задачу из модели
   * @param {number} id
   * @return {boolean}
   */
  removeTask(id) {
    const index = this._tasks.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), this._tasks.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  /**
   * Устанавливает обработчик изменения фильтра
   * @param {function} handler
   */
  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  /**
   * Устанавливает обработчик изменения данных
   * @param {function} handler
   */
  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  /**
   * Вызывает переданные обработчики
   * @param {[]} handlers
   * @private
   */
  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

}
