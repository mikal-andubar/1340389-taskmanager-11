import AbstractSmartComponent from "./abstract-smart-component";

import {formatTime} from "../utils/common";

import {COLORS, DAYS, MONTH_NAMES} from "../constants";

export const TaskEditButtons = {
  DATE_DEADLINE: {
    name: `date-deadline-toggle`,
    property: `isDateShowing`,
  },
  REPEAT: {
    name: `repeat-toggle`,
    property: `isRepeatingTask`,
  },
  COLOR: {
    name: `color-input`,
    property: `color`
  },
};

/**
 * Проверка того, является ли задача периодической
 * @param {{}} repeatingDays
 * @return {boolean}
 */
const isRepeating = (repeatingDays) => Object.values(repeatingDays).some(Boolean);

/**
 * Создает разметку для списка цветов
 * @param {[]} colors
 * @param {string} currentColor
 * @return {string}
 */
const createColorsMarkup = (colors, currentColor) => (
  colors.map((color, index) => (
    `<input
      type="radio"
      id="color-${color}-${index}"
      class="card__color-input card__color-input--${color} visually-hidden"
      name="color"
      value="${color}"
      data-name="${TaskEditButtons.COLOR.name}"
      ${currentColor === color ? `checked` : ``}
    />
    <label
      for="color-${color}-${index}"
      class="card__color card__color--${color}"
      >black</label
    >`
  )).join(`\n`)
);

/**
 * Создает разметку для списка дней недели
 * @param {{}} repeatingDays
 * @return {string}
 */
const createRepeatingDaysMarkup = (repeatingDays) => (
  DAYS.map((day, index) => {
    const isChecked = repeatingDays[day];
    return (
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${isChecked ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>`
    );
  }).join(`\n`)
);

/**
 * Создает шаблон редактора карточки задачи
 * @param {{}} task
 * @param {{}} options
 * @return {string}
 */
const createTaskEditTemplate = (task, options = {}) => {
  const {description, dueDate} = task;
  const {color, isDateShowing, isRepeatingTask, activeRepeatingDays} = options;

  const isExpired = dueDate instanceof Date && dueDate < Date.now();
  const isBlockSaveButton = (isDateShowing && isRepeatingTask) ||
      (isRepeatingTask && !isRepeating(activeRepeatingDays));

  const showDate = isDateShowing && dueDate;

  const date = showDate ? `${dueDate.getDate()} ${MONTH_NAMES[dueDate.getMonth()]}` : ``;
  const time = showDate ? formatTime(dueDate) : ``;

  const repeatClass = isRepeatingTask ? `card--repeat` : ``;
  const deadlineClass = isExpired ? `card--deadline` : ``;

  const colorsMarkup = createColorsMarkup(COLORS, color);
  const repeatingDaysMarkup = createRepeatingDaysMarkup(activeRepeatingDays);

  return (
    `<article class="card card--edit card--${color} ${repeatClass} ${deadlineClass}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__color-bar">
            <svg class="card__color-bar-wave" width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${description}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button 
                  class="card__date-deadline-toggle" 
                  type="button"
                  data-name="${TaskEditButtons.DATE_DEADLINE.name}"
                >
                  date: <span class="card__date-status">${isDateShowing ? `yes` : `no`}</span>
                </button>

                ${isDateShowing ?
      `<fieldset class="card__date-deadline">
        <label class="card__input-deadline-wrap">
          <input
            class="card__date"
            type="text"
            placeholder=""
            name="date"
            value="${date} ${time}"
          />
        </label>
      </fieldset>` : ``
    }

                <button 
                  class="card__repeat-toggle"
                   type="button"
                   data-name="${TaskEditButtons.REPEAT.name}"
                 >
                  repeat:<span class="card__repeat-status">${isRepeatingTask ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days">
                  <div class="card__repeat-days-inner">
                    ${repeatingDaysMarkup}
                  </div>
                </fieldset>
              </div>
            </div>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>
              <div class="card__colors-wrap">
                ${colorsMarkup}
              </div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit" ${isBlockSaveButton ? `disabled` : ``}>save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`
  );
};

/**
 * Класс для редактора карточки задачи
 */
export default class TaskEdit extends AbstractSmartComponent {
  /**
   * Конструктор класса
   * @param {{}} task
   */
  constructor(task) {
    super();

    this._task = task;
    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._color = task.color;
    this._submitHandler = null;

    this._subscribeOnEvents();
  }

  /**
   * Восстановление подписки на обработчики событий после ререндера
   */
  recoveryListeners() {
    this.setSubmitHandler(this._submitHandler);
    this._subscribeOnEvents();
  }

  /**
   * Ререндер карточки
   */
  rerender() {
    super.rerender();
  }

  /**
   * Сброс значений для карточки редактирования
   */
  reset() {
    const task = this._task;

    this._isDateShowing = !!task.dueDate;
    this._isRepeatingTask = isRepeating(task.repeatingDays);
    this._activeRepeatingDays = Object.assign({}, task.repeatingDays);
    this._color = task.color;

    this.rerender();
  }

  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createTaskEditTemplate(this._task, {
      color: this._color,
      isDateShowing: this._isDateShowing,
      isRepeatingTask: this._isRepeatingTask,
      activeRepeatingDays: this._activeRepeatingDays,
    });
  }

  /**
   * Добавляет обработчик события отправки формы редактирования
   * @param {function} handler
   */
  setSubmitHandler(handler) {
    this.getElement()
        .querySelector(`form`)
        .addEventListener(`submit`, handler);
    this._submitHandler = handler;
  }

  /**
   * Добавляет обработчики событий к элементам формы редактирования задачи
   * @private
   */
  _subscribeOnEvents() {
    const element = this.getElement();

    /**
     * Универсальный обработчик всех кликов на кнопки формы
     * @param {Event} event
     */
    const editTaskButtonClickHandler = (event) => {
      const name = event.currentTarget.dataset.name;
      if (undefined === name) {
        return;
      }
      const currentButton = Object.values(TaskEditButtons).find((btn) => btn.name === name);

      const value = event.currentTarget.value;
      if (value) {
        this[`_${currentButton.property}`] = value;
      } else {
        this[`_${currentButton.property}`] = !this[`_${currentButton.property}`];
      }
      this.rerender();
    };

    /**
     * Находит все элементы, удовлетворяющие условию и подписывает их на обработчик события
     * @param {Element} taskEditButton
     */
    const subscribeButtonsOnClickEvent = ({name}) => {
      const buttonElements = element.querySelectorAll(`.card__${name}`);
      buttonElements.forEach((buttonElement) => {
        buttonElement.addEventListener(`click`, editTaskButtonClickHandler);
      });
    };

    // Подписка кнопок формы редактирования на события click
    Object.values(TaskEditButtons).forEach(subscribeButtonsOnClickEvent);

    // Обработка кликов по дням недели
    const repeatDays = element.querySelector(`.card__repeat-days`);
    if (repeatDays) {
      repeatDays.addEventListener(`change`, (event) => {
        this._activeRepeatingDays[event.target.value] = event.target.checked;
        this.rerender();
      });
    }
  }
}
