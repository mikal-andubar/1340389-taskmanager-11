import {createSiteMenuTemplate} from "./components/site-menu";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createBoardTemplate} from "./components/board";
import {createTaskEditTemplate} from "./components/task-edit";
import {createTaskTemplate} from "./components/task";
import {createLoadMoreButtonTemplate} from "./components/load-more-button";
import {generateFilters} from "./mock/filters";
import {generateTasks} from "./mock/task";

/**
 * Количество задач
 * @type {number}
 */
const TASK_COUNT = 23;

/**
 * Количество задач, показываемое изначально
 * @type {number}
 */
const SHOWING_TASKS_COUNT_ON_START = 8;

/**
 * Количество отбражаемых задач
 * @type {number}
 */
let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

/**
 * Количество задач, отрисовываемых при нажатии кнопки "Load More"
 * @type {number}
 */
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

/**
 * Возможные места для рендера
 * @type {{}}
 */
const RENDER_PLACE = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
};

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
const tasks = generateTasks(TASK_COUNT);

/**
 * Фильтры
 * @type {[]}
 */
const filters = generateFilters(tasks);

/**
 * Функция рендера
 * @param {Element} container
 * @param {string} template
 * @param {"beforebegin" | "afterbegin" | "beforeend" | "afterend"} place
 */
const render = (container, template, place = RENDER_PLACE.BEFORE_END) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовка меню в шапке сайта
render(siteHeaderElement, createSiteMenuTemplate());

// Отрисовка в основной блок фильтров и шаблона списка задач
render(siteMainElement, createFiltersTemplate(filters));
render(siteMainElement, createBoardTemplate());

/**
 * Блок для список задач. Объявляем переменную здесь, так как сооветствующий элемент только что отрисовался
 * @type {Element}
 */
const boardElement = siteMainElement.querySelector(`.board`);

/**
 * Непосредственно список задач. Объявляем переменную здесь, так как сооветствующий элемент только что отрисовался
 * @type {Element | any}
 */
const taskListElement = boardElement.querySelector(`.board__tasks`);

// Отрисовка элементов сортировки перед списком задач и редактора карточки задачи
render(boardElement, createSortingTemplate(), RENDER_PLACE.AFTER_BEGIN);
render(taskListElement, createTaskEditTemplate(tasks[0]));

// Отрисовка самих карточек задач
tasks.slice(1, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

// Отрисовка кнопки "Load More"
render(boardElement, createLoadMoreButtonTemplate());

/**
 * Кнопка "Load More"
 * @type {Element}
 */
const loadMoreButton = boardElement.querySelector(`.load-more`);

// Добавление обработчика события "click" к кнопке "Load More"
loadMoreButton.addEventListener(`click`, () => {
  /**
   * Количество показанных задач до нажати кнопки
   * @type {number}
   */
  const prevTasksCount = showingTasksCount;

  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount).forEach((task) => render(taskListElement, createTaskTemplate(task)));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});

