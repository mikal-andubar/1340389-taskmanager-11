import AbstractComponent from "./abstract-component";

import {formatDate, formatTime, isOverdueDate} from "../utils/common";

import {TaskButtons} from "../constants";

/**
 * Создает шаблон кнопки на карточке
 * @param {{}} taskButton
 * @param {boolean} isActive
 * @return {string}
 */
const createButtonMarkup = (taskButton, isActive = true) => (
  `<button
    type="button"
    class="card__btn card__btn--${taskButton.name} ${isActive ? `` : `card__btn--disabled`}"
    data-name = "${taskButton.name}"
  >
    ${taskButton.name}
  </button>`
);

/**
 * Создает шаблон карточки задачи
 * @param {{}} task
 * @return {string}
 */
const createTaskTemplate = (task) => {
  const {color, description, dueDate, repeatingDays, isArchive, isFavorite} = task;

  const isExpired = dueDate instanceof Date && isOverdueDate(dueDate, new Date());
  const isDateShowing = !!dueDate;

  const date = isDateShowing ? formatDate(dueDate) : ``;
  const time = isDateShowing ? formatTime(dueDate) : ``;

  const editButton = createButtonMarkup(TaskButtons.EDIT);
  const archiveButton = createButtonMarkup(TaskButtons.ARCHIVE, isArchive);
  const favoriteButton = createButtonMarkup(TaskButtons.FAVORITE, isFavorite);

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
   * Устанавливает универсальный обработчик событий для каждой кнопки на карточке задачи
   * @param {function} handler
   */
  setTaskCardButtonsHandler(handler) {
    Object.values(TaskButtons).forEach(({name}) => {
      this.getElement()
          .querySelector(`.card__btn--${name}`)
          .addEventListener(`click`, handler);
    });
  }
}

