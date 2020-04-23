import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

import TaskController from "./task";

import {componentRender, remove} from "../utils/render";

import {TASK_COUNT} from "../constants";

/**
 * Рендер списка задач
 * @param {Element} taskListElement
 * @param {{}[]} tasks
 * @param {function} onDataChange
 * @param {function} onViewChange
 * @return {TaskController[]}
 */
const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
};

/**
 * Возвращает массив задач, отсортированный в соответствии с видом сортировки
 * @param {{}[]} tasks
 * @param {string} sortType
 * @return {{}[]}
 */
const getSortedTasksBySortType = (tasks, sortType) => {
  const showingTasks = tasks.slice();
  switch (sortType) {
    case SortType.DATE_UP:
      return showingTasks.sort((a, b) => a.dueDate - b.dueDate);
    case SortType.DATE_DOWN:
      return showingTasks.sort((a, b) => b.dueDate - a.dueDate);
    default:
      return showingTasks;
  }
};

/**
 * Возвращает отсортированный массив задач
 * @param {{}[]}tasks
 * @param {string} sortType
 * @param {number} from
 * @param {number} to
 * @return {*[]}
 */
const getSortedTasks = (tasks, sortType, from, to) => {
  return getSortedTasksBySortType(tasks, sortType).slice(from, to);
};

/**
 * Класс контроллера для работы с доской задач
 */
export default class BoardController {
  /**
   * Конструктор класса
   * @param {{}} container
   */
  constructor(container) {
    this._container = container;

    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = TASK_COUNT.ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);

    this._showLoadMoreBtn = false;
  }

  /**
   * Рендер доски задач
   * @param {[]} tasks
   */
  render(tasks) {
    this._tasks = tasks;

    /**
     * Контейнер, в который будем рендерить все
     */
    const container = this._container.getElement();

    /**
     * Проверка, что задач нет или все в архиве
     * @type {boolean}
     */
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      componentRender(container, this._noTasksComponent);
      return;
    }

    // Рендер элементов сортировки и шаблона для списка задач
    componentRender(container, this._sortComponent);
    componentRender(container, this._tasksComponent);

    /**
     * Контейнер для списка задач
     * @type {Element}
     */
    const taskListElement = this._tasksComponent.getElement();

    // Рендер первых карточек
    const newTasks = renderTasks(taskListElement, this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  /**
   * Рендер кнопки "Load More"
   */
  _renderLoadMoreButton() {
    /**
     * Обработчик события клика по кнопке "Load More"
     */
    const onLoadMoreButtonClick = () => {
      const prevTaskCount = this._showingTasksCount;
      const taskListElement = this._tasksComponent.getElement();
      this._showingTasksCount = this._showingTasksCount + TASK_COUNT.ON_BUTTON;

      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTaskCount, this._showingTasksCount);
      const newTasks = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
        this._showLoadMoreBtn = false;
      }
    };

    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    // Рендер кнопки "Load More"
    componentRender(this._container.getElement(), this._loadMoreButtonComponent);

    // Добавляем к кнопе "Load More" обработчик события клика
    this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);

    this._showLoadMoreBtn = true;
  }

  /**
   * Обработчик изменения данных задачи
   * @param {TaskController} taskController
   * @param {{}} oldData
   * @param {{}} newData
   * @private
   */
  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  /**
   * Обработчик события смены вида карточки
   * @private
   */
  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  /**
   * Обработчик события смены вида сортировки
   * @param {string} sortType
   * @private
   */
  _onSortTypeChange(sortType) {
    this._showingTasksCount = TASK_COUNT.ON_START;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);

    const taskListElement = this._tasksComponent.getElement();
    taskListElement.innerHTML = ``;

    this._showedTaskControllers = renderTasks(taskListElement, sortedTasks, this._onDataChange, this._onViewChange);

    if (!this._showLoadMoreBtn) {
      this._renderLoadMoreButton();
    }
  }
}
