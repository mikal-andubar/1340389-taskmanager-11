import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filters";
import SortComponent from "./components/sort";
import BoardComponent from "./components/board";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import TasksComponent from "./components/tasks";
import NoTasksComponent from "./components/no-tasks";
import LoadMoreButtonComponent from "./components/load-more-button";

import {generateFilters} from "./mock/filters";
import {generateTasks} from "./mock/task";
import {render} from "./utils";

import {TASK_COUNT} from "./constants";

/**
 * Основной элемент страницы
 * @type {Element}
 */
const siteMainElement = document.querySelector(`.main`);

/**
 * Шапка сайта
 * @type {Element}
 */
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

/**
 * Задачи
 * @type {{}[]}
 */
const tasks = generateTasks(TASK_COUNT.TOTAL);

/**
 * Фильтры
 * @type {[]}
 */
const filters = generateFilters(tasks);

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
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  /**
   * Меняет карточку редактирования на карточку задачи
   */
  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
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
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, onEditButtonClick);

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, onEditFormSubmit);

  // Рендер карточки задачи
  render(taskListElement, taskComponent.getElement());
};

/**
 * Отрисовка доски задач
 * @param {Board} boardComponent
 * @param {[]} taskCards
 */
const renderBoard = (boardComponent, taskCards) => {
  /**
   * Обработчик события клика по кнопке "Load More"
   */
  const onLoadMoreButtonClick = () => {
    const prevTaskCount = showingTasksCount;
    showingTasksCount = showingTasksCount + TASK_COUNT.ON_BUTTON;

    taskCards.slice(prevTaskCount, showingTasksCount).forEach(
        (task) => renderTask(taskListElement, task)
    );

    if (showingTasksCount >= taskCards.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  };

  /**
   * Проверка, что задач нет или все в архиве
   * @type {boolean}
   */
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement());
    return;
  }

  // Рендер элементов сортировки и шаблона для списка задач
  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new TasksComponent().getElement());

  /**
   * Контейнер для списка задач
   * @type {Element}
   */
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  // Рендер первых карточек
  let showingTasksCount = TASK_COUNT.ON_START;
  taskCards.slice(0, showingTasksCount).forEach(
      (task) => renderTask(taskListElement, task)
  );

  /**
   * Кнопка "Load More"
   * @type {LoadMoreButton}
   */
  const loadMoreButtonComponent = new LoadMoreButtonComponent();

  // Рендер кнопки "Load More"
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

  // Добавляем к кнопе "Load More" обработчик события клика
  loadMoreButtonComponent.getElement().addEventListener(`click`, onLoadMoreButtonClick);
};

// Рендер меню сайта и фильтров
render(siteHeaderElement, new SiteMenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

/**
 * Доска для карточек задач
 * @type {Board}
 */
const boardComponent = new BoardComponent();

// Рендер доски задач и карточек в нее
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, tasks);

