import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";

import {componentRender, remove, replace} from "../utils/render";
import {findButtonByName} from "../utils/common";

import {COLOR, KEY_CODE, RENDER_PLACE, TaskButtons} from "../constants";

/**
 * Режим отображения карточки, обычный или редактирование
 * @type {{}}
 */
export const Mode = {
  ADDING: `adding`,
  DEFAULT: `default`,
  EDIT: `edit`
};

/**
 * Пустая задача
 * @type {{}}
 */
export const EmptyTask = {
  description: ``,
  dueDate: null,
  repeatingDays: {
    "mo": false,
    "tu": false,
    "we": false,
    "th": false,
    "fr": false,
    "sa": false,
    "su": false,
  },
  color: COLOR.BLACK,
  isFavorite: false,
  isArchive: false,
};

/**
 * Класс для контроллера задачи
 */
export default class TaskController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {function} onDataChange
   * @param {function} onViewChange
   */
  constructor(container, onDataChange, onViewChange) {
    this._container = container;
    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;
    this._mode = Mode.DEFAULT;

    this._taskComponent = null;
    this._taskEditComponent = null;

    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._onTaskCardButtonClick = this._onTaskCardButtonClick.bind(this);
    this._onEditFormSubmit = this._onEditFormSubmit.bind(this);
  }

  /**
   * Отрисовка карточки задачи
   * @param {{}} task
   * @param {string} mode
   */
  render(task, mode = Mode.DEFAULT) {
    this._task = task;
    this._mode = mode;

    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(this._task);
    this._taskComponent.setTaskCardButtonsHandler(this._onTaskCardButtonClick);

    this._taskEditComponent = new TaskEditComponent(this._task);
    this._taskEditComponent.setSubmitHandler(this._onEditFormSubmit);

    this._taskEditComponent.setDeleteButtonClickHandler(() => this._onDataChange(this, this._task, null));

    // Рендер карточки задачи
    switch (this._mode) {
      case Mode.ADDING:
        if (oldTaskEditComponent && oldTaskComponent) {
          remove(oldTaskComponent);
          remove(oldTaskEditComponent);
        }
        document.addEventListener(`keydown`, this._onEscKeyDown);
        componentRender(this._container, this._taskEditComponent, RENDER_PLACE.AFTER_BEGIN);
        break;
      default:
        if (oldTaskEditComponent && oldTaskComponent) {
          replace(this._taskComponent, oldTaskComponent);
          replace(this._taskEditComponent, oldTaskEditComponent);
          this._replaceEditToTask();
        } else {
          componentRender(this._container, this._taskComponent);
        }
        break;
    }
  }

  /**
   * Установка вида карточки по умолчанию
   */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  /**
   * Уничтожает карточку
   */
  destroy() {
    remove(this._taskEditComponent);
    remove(this._taskComponent);
    document.removeEventListener(`keydown`, this._onEscKeyDown);
  }

  /**
   * Обработчик события отправки формы
   * @param {Event} event
   */
  _onEditFormSubmit(event) {
    event.preventDefault();
    const data = this._taskEditComponent.getData();
    this._onDataChange(this, this._task, data);
  }

  /**
   * Универсальная функция обработки события нажатия на кнопку на карточке задачи
   * @param {Event} event
   * @private
   */
  _onTaskCardButtonClick(event) {
    const name = event.target.dataset.name;
    const taskButton = findButtonByName(TaskButtons, name);

    if (name === `edit`) {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    } else {
      this._onDataChange(this, this._task, Object.assign({}, this._task, {
        [taskButton.property]: !this._task[taskButton.property],
      }));
    }
  }

  /**
   * Переключение карточки с вида редактора на обычный
   * @private
   */
  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();

    if (document.contains(this._taskEditComponent.getElement())) {
      replace(this._taskComponent, this._taskEditComponent);
    }

    this._mode = Mode.DEFAULT;
  }

  /**
   * Перкючение карточки на вид редактора
   * @private
   */
  _replaceTaskToEdit() {
    this._onViewChange();
    replace(this._taskEditComponent, this._taskComponent);
    this._mode = Mode.EDIT;
  }

  /**
   * Обработчик события нажатия на кнопку ESC
   * @param {KeyboardEvent} event
   */
  _onEscKeyDown(event) {
    const isEscKey = event.key === KEY_CODE.ESCAPE || event.key === KEY_CODE.ESC;

    if (isEscKey) {
      if (this._mode === Mode.ADDING) {
        this._onDataChange(this, EmptyTask, null);
      }
      this._replaceEditToTask();
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
