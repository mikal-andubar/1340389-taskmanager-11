import AbstractComponent from "./abstract-component";

/**
 * Виды сортировки
 * @type {{}}
 */
export const SortType = {
  DATE_DOWN: `date-down`,
  DATE_UP: `date-up`,
  DEFAULT: `default`,
};

/**
 * Создание шаблона элементов сортировки
 * @return {string}
 */
const createSortingTemplate = () => (
  `<div class="board__filter-list">
      <a href="#" class="board__filter" data-sort-type="${SortType.DEFAULT}">SORT BY DEFAULT</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_UP}">SORT BY DATE up</a>
      <a href="#" class="board__filter" data-sort-type="${SortType.DATE_DOWN}">SORT BY DATE down</a>
    </div>`
);


/**
 * Класс для элементов сортировки
 */
export default class Sort extends AbstractComponent {

  /**
   * Конструктор класса
   */
  constructor() {
    super();

    this._currentSortType = SortType.DEFAULT;
  }

  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createSortingTemplate();
  }

  /**
   * Возвращает текущий вид сортировки
   * @return {string}
   */
  getSortType() {
    return this._currentSortType;
  }

  /**
   * Устанавливает обработчик для смены вида сортировки
   * @param {function} handler
   */
  setSortTypeChangeHandler(handler) {
    this.getElement().addEventListener(`click`, (event) => {
      event.preventDefault();

      if (event.target.tagName !== `A`) {
        return;
      }

      const sortType = event.target.dataset.sortType;

      if (this._currentSortType === sortType) {
        return;
      }

      this._currentSortType = sortType;

      handler(this._currentSortType);
    });
  }
}
