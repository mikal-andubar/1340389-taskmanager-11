import {createElement} from "../utils";

/**
 * Создание шаблона кнопки "Load More"
 * @return {string}
 */
const createLoadMoreButtonTemplate = () => `<button class="load-more" type="button">load more</button>`;

/**
 * Класс для кнопки "Load More"
 */
export default class LoadMoreButton {
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
    return createLoadMoreButtonTemplate();
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
