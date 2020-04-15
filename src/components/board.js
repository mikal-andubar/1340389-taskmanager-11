import {createElement} from "../utils";

/**
 * Создание шаблона доски задач
 * @return {string}
 */
const createBoardTemplate = () => `<section class="board container"></section>`;

/**
 * Класс для доски задач
 */
export default class Board {
  /**
   * Конструктор класса
   */
  constructor() {
    this._element = null;
  }

  /**
   * Возвращает шаблон доски задач
   * @return {string}
   */
  getTemplate() {
    return createBoardTemplate();
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
