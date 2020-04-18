import SiteMenuComponent from "./components/site-menu";
import FilterComponent from "./components/filters";
import BoardComponent from "./components/board";

import BoardController from "./controllers/board";

import {generateFilters} from "./mock/filters";
import {generateTasks} from "./mock/task";
import {render} from "./utils/render";

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

// Рендер меню сайта и фильтров
render(siteHeaderElement, new SiteMenuComponent());
render(siteMainElement, new FilterComponent(filters));

/**
 * Доска для карточек задач
 * @type {Board}
 */
const boardComponent = new BoardComponent();

/**
 * Контроллер
 * @type {BoardController}
 */
const boardController = new BoardController(boardComponent);

// Рендер доски задач и карточек в нее
render(siteMainElement, boardComponent);
boardController.render(tasks);

