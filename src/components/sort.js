import {createElement} from "../utils";

/**
 * Создание шаблона элементов сортировки
 * @return {string}
 */
const createSortingTemplate = () => (
  `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="default">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="date-up">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="date-down">SORT BY DATE down</a>
    </div>`
);


/**
 * Класс для элементов сортировки
 */
export default class Sort {
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
    return createSortingTemplate();
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
