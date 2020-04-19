import AbstractComponent from "./abstract-component";

/**
 * Создание шаблона доски задач
 * @return {string}
 */
const createBoardTemplate = () => `<section class="board container"></section>`;

/**
 * Класс для доски задач
 */
export default class Board extends AbstractComponent {

  /**
   * Возвращает шаблон доски задач
   * @return {string}
   */
  getTemplate() {
    return createBoardTemplate();
  }
}
