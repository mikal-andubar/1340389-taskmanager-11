import {createElement} from "../utils";

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
export default class NoTasks {
  /**
   * Конструктор класса
   */
  constructor() {
    this._element = null;
  }

  /**
   * Возвращает шаблон пустого списка задач
   * @return {string}
   */
  getTemplate() {
    return createNoTasksTemplate();
  }

  /**
   * Возвращает элемент DOM
   * @return {null}
   */
  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  /**
   * Очищает элемент DOM
   */
  removeElement() {
    this._element = null;
  }
}
