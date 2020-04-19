import AbstractComponent from "./abstract-component";

/**
 * Создание шаблона кнопки "Load More"
 * @return {string}
 */
const createLoadMoreButtonTemplate = () => `<button class="load-more" type="button">load more</button>`;

/**
 * Класс для кнопки "Load More"
 */
export default class LoadMoreButton extends AbstractComponent {
  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createLoadMoreButtonTemplate();
  }

  /**
   * Добавляет обработчик для события клика
   * @param {function} handler
   */
  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }
}
