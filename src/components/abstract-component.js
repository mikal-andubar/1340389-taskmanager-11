import {createElement} from "../utils/render";

/**
 * Абстрактный класс компонента, от которого наследуем настоящие компоненты
 */
export default class AbstractComponent {
  /**
   * Конструктор абстрактного класса, который предотвратит создание объекта данного класса
   */
  constructor() {
    if (new.target === AbstractComponent) {
      throw new Error(`Can't instantiate AbstractComponent, only concrete one.`);
    }

    this._element = null;
  }

  /**
   * Абстрактный метод, который требует переопределения в классе-потомке
   * @return {string}
   */
  getTemplate() {
    if (this instanceof AbstractComponent) {
      throw new Error(`Abstract method not implemented: getTemplate`);
    }

    return ``;
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
