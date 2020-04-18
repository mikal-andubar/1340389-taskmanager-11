import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";
import NoTasksComponent from "../components/no-tasks";
import SortComponent from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

import {remove, render, replace} from "../utils/render";

import {TASK_COUNT} from "../constants";

/**
 * Отрисовка карточки задачи
 * @param {Element} taskListElement
 * @param {{}} task
 */
const renderTask = (taskListElement, task) => {
  /**
   * Меняет карточку задачи на карточку редактирования
   */
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  /**
   * Меняет карточку редактирования на карточку задачи
   */
  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  /**
   * Обработчик события нажатия на кнопку ESC
   * @param {KeyboardEvent} event
   */
  const onEscKeyDown = (event) => {
    const isEscKey = event.key === `Escape` || event.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  /**
   * Обработчик события клика по кнопке "Edit"
   */
  const onEditButtonClick = () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  /**
   * Обработчик события отправки формы
   * @param {Event} event
   */
  const onEditFormSubmit = (event) => {
    event.preventDefault();
    replaceEditToTask();
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

      tasks.slice(prevTaskCount, showingTasksCount).forEach(
          (task) => renderTask(taskListElement, task)
      );

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
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
    tasks.slice(0, showingTasksCount).forEach(
        (task) => renderTask(taskListElement, task)
    );

    // Рендер кнопки "Load More"
    render(container, this._loadMoreButtonComponent);

    // Добавляем к кнопе "Load More" обработчик события клика
    this._loadMoreButtonComponent.setClickHandler(onLoadMoreButtonClick);
  }
}
