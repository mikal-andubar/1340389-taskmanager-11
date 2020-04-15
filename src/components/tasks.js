import {createElement} from "../utils";

/**
 * Создает шаблон для списка задач
 * @return {string}
 */
const createTasksTemplate = () => `<div class="board__tasks"></div>`;

/**
 * Класс для списка задач
 */
export default class Tasks {
  /**
   * Конструктор класса
   */
  constructor() {
    this._element = null;
  }


  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createTasksTemplate();
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
