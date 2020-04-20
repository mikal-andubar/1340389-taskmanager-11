import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

import {remove, render, replace} from "../utils/render";

import {KEY_CODE, TASK_COUNT} from "../constants";

/**
 * Отрисовка карточки задачи
 * @param {Element} taskListElement
 * @param {{}} task
 */
const renderTask = (taskListElement, task) => {
  /**
   * Обработчик события нажатия на кнопку ESC
   * @param {KeyboardEvent} event
   */
  const onEscKeyDown = (event) => {
    const isEscKey = event.key === KEY_CODE.ESCAPE || event.key === KEY_CODE.ESC;

    if (isEscKey) {
      replace(taskComponent, taskEditComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  /**
   * Обработчик события клика по кнопке "Edit"
   */
  const onEditButtonClick = () => {
    replace(taskEditComponent, taskComponent);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  /**
   * Обработчик события отправки формы
   * @param {Event} event
   */
  const onEditFormSubmit = (event) => {
    event.preventDefault();
    replace(taskComponent, taskEditComponent);
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  const taskComponent = new TaskComponent(task);
  taskComponent.setEditButtonClickHandler(onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  taskEditComponent.setSubmitHandler(onEditFormSubmit);

  // Рендер карточки задачи
  render(taskListElement, taskComponent);
};

/**
 * Рендер списка задач
 * @param {Element} taskListElement
 * @param {{}[]} tasks
 */
const renderTasks = (taskListElement, tasks) => {
  tasks.forEach((task) => {
    renderTask(taskListElement, task);
  });
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
  let sortedTasks = [];
  const showingTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks = showingTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks = showingTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      sortedTasks = showingTasks;
      break;
  }

  return sortedTasks.slice(from, to);
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
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
  }

  /**
   * Рендер доски задач
   * @param {[]} tasks
   */
  render(tasks) {
    /**
     * Обработчик события клика по кнопке "Load More"
     */
    const onLoadMoreButtonClick = () => {
      const prevTaskCount = showingTasksCount;
      showingTasksCount = showingTasksCount + TASK_COUNT.ON_BUTTON;

      const sortedTasks = getSortedTasks(tasks, this._sortComponent.getSortType(), prevTaskCount, showingTasksCount);
      renderTasks(taskListElement, sortedTasks);

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    };

    /**
     * Рендер кнопки "Load More"
     */
    const renderLoadMoreButton = () => {
      if (showingTasksCount >= tasks.length) {
        return;
      }

      // Рендер кнопки "Load More"
      render(container, this._loadMoreButtonComponent);

      // Добавляем к кнопе "Load More" обработчик события клика
      this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
    };

    /**
     * Контейнер, в который будем рендерить все
     */
    const container = this._container.getElement();

    /**
     * Проверка, что задач нет или все в архиве
     * @type {boolean}
     */
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    // Рендер элементов сортировки и шаблона для списка задач
    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    /**
     * Контейнер для списка задач
     * @type {Element}
     */
    const taskListElement = this._tasksComponent.getElement();

    // Рендер первых карточек
    let showingTasksCount = TASK_COUNT.ON_START;

    renderTasks(taskListElement, tasks.slice(0, showingTasksCount));
    renderLoadMoreButton();

    // Добавляем обработку события смены вида сортировки
    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = TASK_COUNT.ON_START;

      const sortedTasks = getSortedTasks(tasks, sortType, 0, showingTasksCount);

      taskListElement.innerHTML = ``;

      renderTasks(taskListElement, sortedTasks);
      renderLoadMoreButton();
    });
  }
}
