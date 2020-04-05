import {createSiteMenuTemplate} from "./components/site-menu";
import {createFiltersTemplate} from "./components/filters";
import {createSortingTemplate} from "./components/sorting";
import {createBoardTemplate} from "./components/board";
import {createTaskEditTemplate} from "./components/task-edit";
import {createTaskTemplate} from "./components/task";
import {createLoadMoreButtonTemplate} from "./components/load-more-button";

const TASK_COUNT = 3;

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
 * Функция рендера
 * @param {Element} container
 * @param {string} template
 * @param {"beforebegin" | "afterbegin" | "beforeend" | "afterend"} place
 */
const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

// Отрисовка меню в шапке сайта
render(siteHeaderElement, createSiteMenuTemplate());

// Отрисовка в основной блок фильтров и шаблона списка задач
render(siteMainElement, createFiltersTemplate());
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
render(boardElement, createSortingTemplate(), `afterbegin`);
render(taskListElement, createTaskEditTemplate());

// Отрисовка самих карточек задач
for (let i = 0; i < TASK_COUNT; i++) {
  render(taskListElement, createTaskTemplate());
}

// Отрисовка кнопки "Load More"
render(boardElement, createLoadMoreButtonTemplate());
