import {createElement} from "../utils";

/**
 * Создание разметки одного фильтра
 * @param {[]} filter
 * @param {number} index
 * @return {string}
 */
const createFilterMarkup = (filter, index) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${index ? `` : `checked`}
    />
    <label for="filter__${name}" class="filter__label">${name} <span class="filter__${name}-count">${count}</span></label>`
  );
};

/**
 * Создание шаблона для фильтров
 * @param {[]} filters
 * @return {string}
 */
const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map(createFilterMarkup).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};

/**
 * Класс для фильтров
 */
export default class Filter {
  /**
   * Конструктор класса
   * @param {[]} filters
   */
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createFiltersTemplate(this._filters);
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
