import {TASK_COUNT} from "./constants";
import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filters";
import SortComponent from "./components/sort";
import BoardComponent from "./components/board";
import TaskEditComponent from "./components/task-edit";
import TaskComponent from "./components/task";
import TasksComponent from "./components/tasks";
import LoadMoreButtonComponent from "./components/load-more-button";
import {generateFilters} from "./mock/filters";
import {generateTasks} from "./mock/task";
import {render} from "./utils";

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
   * Обработчик события клика по кнопке "Edit"
   */
  const onEditButtonClick = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  /**
   * Обработчик события отправки формы
   * @param {Event} evt
   */
  const onEditFormSubmit = (evt) => {
    evt.preventDefault();
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
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

  // Рендер элементов сортировки и шаблона для списка задач
  render(boardComponent.getElement(), new SortComponent().getElement());
  render(boardComponent.getElement(), new TasksComponent().getElement());

  /**
   * Контейнер для списка задач
   * @type {Element}
   */
  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  // Реднер первых карточек
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

