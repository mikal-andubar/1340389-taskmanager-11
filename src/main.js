import SiteMenuComponent, {Navigation} from "./components/site-menu";
import BoardComponent from "./components/board";

import TasksModel from "./model/tasks";

import BoardController from "./controllers/board";

import {generateTasks} from "./mock/task";
import {componentRender} from "./utils/render";

import {TASK_COUNT} from "./constants";
import FilterController from "./controllers/filter";

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
 * Меню сайта
 * @type {SiteMenu}
 */
const siteMenuComponent = new SiteMenuComponent();
componentRender(siteHeaderElement, siteMenuComponent);

/**
 * Задачи
 * @type {{}[]}
 */
const tasks = generateTasks(TASK_COUNT.TOTAL);

/**
 * Модель задач
 * @type {Tasks}
 */
const tasksModel = new TasksModel();
tasksModel.setTasks(tasks);

const filterController = new FilterController(siteMainElement, tasksModel);
filterController.render();

/**
 * Доска для карточек задач
 * @type {Board}
 */
const boardComponent = new BoardComponent();
componentRender(siteMainElement, boardComponent);

/**
 * Контроллер
 * @type {BoardController}
 */
const boardController = new BoardController(boardComponent, tasksModel);
boardController.render();

siteMenuComponent.setOnChange((menuItemId) => {
  const name = menuItemId.slice(`control__`.length);
  const menuItem = Object.values(Navigation).find((item) => item.name === name);
  switch (menuItem) {
    case Navigation.NEW_TASK:
      siteMenuComponent.setActiveItem(menuItem.name);
      boardController.createTask();
      break;
  }
});

