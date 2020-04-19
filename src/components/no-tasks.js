import AbstractComponent from "./abstract-component";

/**
 * Создает шаблон пустого списка
 * @return {string}
 */
const createNoTasksTemplate = () => (
  `<p class="board__no-tasks">
    Click «ADD NEW TASK» in menu to create your first task
  </p>`
);

/**
 * Класс для пустого списка задач
 */
export default class NoTasks extends AbstractComponent {
  /**
   * Возвращает шаблон пустого списка задач
   * @return {string}
   */
  getTemplate() {
    return createNoTasksTemplate();
  }
}
