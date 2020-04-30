import AbstractComponent from "./abstract-component";

/**
 * Префикс элемента фильтра
 * @type {string}
 */
const FILTER_ID_PREFIX = `filter__`;

/**
 * Возвращает имя фильтра по переданному ID
 * @param {number} id
 * @return {string}
 */
const getFilterNameById = (id) => {
  return id.substring(FILTER_ID_PREFIX.length);
};

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
export default class Filter extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {[]} filters
   */
  constructor(filters) {
    super();

    this._filters = filters;
  }

  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createFiltersTemplate(this._filters);
  }

  /**
   * Устанавливает обработчик смены фильтра
   * @param {function} handler
   */
  setFilterChangeHandler(handler) {
    this.getElement().addEventListener(`change`, (event) => {
      const filterName = getFilterNameById(event.target.id);
      handler(filterName);
    });
  }

}
