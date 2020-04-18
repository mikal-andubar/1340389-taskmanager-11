import AbstractComponent from "./abstract-component";

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
export default class Sort extends AbstractComponent {
  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createSortingTemplate();
  }
}
