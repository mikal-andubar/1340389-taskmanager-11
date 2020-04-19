import AbstractComponent from "./abstract-component";

/**
 * Создает шаблон для списка задач
 * @return {string}
 */
const createTasksTemplate = () => `<div class="board__tasks"></div>`;

/**
 * Класс для списка задач
 */
export default class Tasks extends AbstractComponent {
  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createTasksTemplate();
  }
}
