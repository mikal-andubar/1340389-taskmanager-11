import AbstractComponent from "./abstract-component";

import {formatTime} from "../utils/common";

import {MONTH_NAMES} from "../constants";

/**
 * Создает шаблон кнопки на карточке
 * @param {string} name
 * @param {boolean} isActive
 * @return {string}
 */
const createButtonMarkup = (name, isActive = true) => (
  `<button
    type="button"
    class="card__btn card__btn--${name} ${isActive ? `` : `card__btn--disabled`}"
  >
    ${name}
  </button>`
);

/**
 * Создает шаблон карточки задачи
 * @param {{}} task
 * @return {string}
 */
const createTaskTemplate = (task) => {
  const {color, description, dueDate, repeatingDays, isArchive, isFavorite} = task;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const editButton = createButtonMarkup(`edit`);
  const archiveButton = createButtonMarkup(`archive`, isArchive);
  const favoriteButton = createButtonMarkup(`favorites`, isFavorite);

  const repeatClass = Object.values(repeatingDays).some(Boolean) ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  return (
    `<article class="card card--${color} ${repeatClass} ${deadlineClass}">
      <div class="card__form">
        <div class="card__inner">
          <div class="card__control">
            ${editButton}
            ${archiveButton}
            ${favoriteButton}
          </div>

          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <p class="card__text">${description}</p>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <div class="card__date-deadline">
                  <p class="card__input-deadline-wrap">
                    <span class="card__date">${date}</span>
                    <span class="card__time">${time}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>`
  );
};

/**
 * Класс для карточки задачи
 */
export default class Task extends AbstractComponent {
  /**
   * Конструктор класса
   * @param {{}} task
   */
  constructor(task) {
    super();

    this._task = task;
  }

  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createTaskTemplate(this._task);
  }

  /**
   * Добавляет обработчик события клика на кнопку EDIT
   * @param {function} handler
   */
  setEditButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--edit`)
        .addEventListener(`click`, handler);
  }

  /**
   * Добавляет обработчик события клика на кнопу FAVORITES
   * @param {function} handler
   */
  setFavoritesButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--favorites`)
        .addEventListener(`click`, handler);
  }

  /**
   * Добавляет обработчик события клика на кнопу ARCHIVE
   * @param {function} handler
   */
  setArchiveButtonClickHandler(handler) {
    this.getElement().querySelector(`.card__btn--archive`)
        .addEventListener(`click`, handler);
  }
}

