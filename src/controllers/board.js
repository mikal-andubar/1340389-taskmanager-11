import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

import TaskController, {EmptyTask, Mode as TaskControllerMode} from "./task";

import {componentRender, remove} from "../utils/render";

import {TASK_COUNT} from "../constants";

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
   * @param {{}} taskModel
   */
  constructor(container, taskModel) {
    this._container = container;
    this._tasksModel = taskModel;

    this._showedTaskControllers = [];
    this._showingTasksCount = TASK_COUNT.ON_START;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._creatingTask = null;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onLoadMoreButtonClick = this._onLoadMoreButtonClick.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._tasksModel.setFilterChangeHandler(this._onFilterChange);
  }

  /**
   * Рендер доски задач
   */
  render() {
    /**
     * Контейнер, в который будем рендерить все
     */
    const container = this._container.getElement();

    const tasks = this._tasksModel.getTasks();

    /**
     * Проверка, что задач нет или все в архиве
     * @type {boolean}
     */
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      componentRender(container, this._noTasksComponent);
      return;
    }

    // Рендер элементов сортировки и шаблона для списка задач
    componentRender(container, this._sortComponent);
    componentRender(container, this._tasksComponent);

    // Рендер первых карточек
    this._renderTasks(tasks.slice(0, this._showingTasksCount));

    this._renderLoadMoreButton();
  }

  createTask() {
    if (this._creatingTask) {
      return;
    }

    const taskListElement = this._tasksComponent.getElement();
    this._creatingTask = new TaskController(taskListElement, this._onDataChange, this._onViewChange);
    this._creatingTask.render(EmptyTask, TaskControllerMode.ADDING);
  }

  /**
   * Удаляет все задачи с доски
   * @private
   */
  _removeTasks() {
    this._showedTaskControllers.forEach((taskController) => taskController.destroy());
    this._showedTaskControllers = [];
  }

  /**
   * Возвращает массив контроллеров задач
   * @param {{}[]} tasks
   * @return {TaskController[]}
   */
  _prepareTaskControllers(tasks) {
    const taskListElement = this._tasksComponent.getElement();

    return tasks.map((task) => {
      const taskController = new TaskController(taskListElement, this._onDataChange, this._onViewChange);

      taskController.render(task);

      return taskController;
    });
  }

  /**
   * Рендер списка задач
   * @param {{}[]} tasks
   * @private
   */
  _renderTasks(tasks) {
    const newTasks = this._prepareTaskControllers(tasks);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);
    this._showingTasksCount = this._showedTaskControllers.length;
  }

  /**
   * Обновить текущий список задач
   * @param {number} count
   * @private
   */
  _updateTasks(count) {
    this._removeTasks();
    this._renderTasks(this._tasksModel.getTasks().slice(0, count));
    this._renderLoadMoreButton();
  }

  /**
   * Рендер кнопки "Load More"
   */
  _renderLoadMoreButton() {
    remove(this._loadMoreButtonComponent);

    if (this._showingTasksCount >= this._tasksModel.getTasks().length) {
      return;
    }

    // Рендер кнопки "Load More"
    componentRender(this._container.getElement(), this._loadMoreButtonComponent);

    // Добавляем к кнопе "Load More" обработчик события клика
    this._loadMoreButtonComponent.setClickHandler(this._onLoadMoreButtonClick);
  }

  /**
   * Обработчик события клика по кнопке "Load More"
   */
  _onLoadMoreButtonClick() {
    const prevTaskCount = this._showingTasksCount;
    const tasks = this._tasksModel.getTasks();
    this._showingTasksCount = this._showingTasksCount + TASK_COUNT.ON_BUTTON;

    const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTaskCount, this._showingTasksCount);
    this._renderTasks(sortedTasks);

    if (this._showingTasksCount >= tasks.length) {
      remove(this._loadMoreButtonComponent);
      this._showLoadMoreBtn = false;
    }
  }

  /**
   * Обработчик изменения данных задачи
   * @param {TaskController} taskController
   * @param {{}} oldData
   * @param {{}} newData
   * @private
   */
  _onDataChange(taskController, oldData, newData) {
    if (oldData === EmptyTask) {
      this._creatingTask = null;
      if (newData === null) {
        taskController.destroy();
        this._updateTasks(this._showingTasksCount);
      } else {
        this._tasksModel.addTask(newData);
        taskController.render(newData);

        if (this._showingTasksCount % TASK_COUNT.ON_BUTTON === 0) {
          const destroyedTask = this._showedTaskControllers.pop();
          destroyedTask.destroy();
        }

        this._showedTaskControllers = [].concat(taskController, this._showedTaskControllers);
        this._showingTasksCount = this._showedTaskControllers.length;

        this._renderLoadMoreButton();
      }
    } else if (newData === null) {
      this._tasksModel.removeTask(oldData.id);
      this._updateTasks(this._showingTasksCount);
    } else {
      const isSuccess = this._tasksModel.updateTask(oldData.id, newData);

      if (isSuccess) {
        taskController.render(newData);
      }
    }
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

    const sortedTasks = getSortedTasks(this._tasksModel.getTasks(), sortType, 0, this._showingTasksCount);

    this._removeTasks();
    this._renderTasks(sortedTasks);

    this._renderLoadMoreButton();
  }

  /**
   * Обработчик события смены фильтра
   * @private
   */
  _onFilterChange() {
    this._updateTasks(TASK_COUNT.ON_START);
  }
}
