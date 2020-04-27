import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";

import {componentRender, replace} from "../utils/render";

import {KEY_CODE, TaskButtons} from "../constants";

/**
 * Режим отображения карточки, обычный или редактирование
 * @type {{}}
 */
const Mode = {
  DEFAULT: `default`,
  EDIT: `edit`
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
  }

  /**
   * Отрисовка карточки задачи
   * @param {{}} task
   */
  render(task) {
    this._task = task;

    /**
     * Обработчик события отправки формы
     * @param {Event} event
     */
    const onEditFormSubmit = (event) => {
      event.preventDefault();
      this._replaceEditToTask();
    };

    const oldTaskComponent = this._taskComponent;
    const oldTaskEditComponent = this._taskEditComponent;

    this._taskComponent = new TaskComponent(task);
    this._taskComponent.setTaskCardButtonsHandler(this._onTaskCardButtonClick);

    this._taskEditComponent = new TaskEditComponent(task);
    this._taskEditComponent.setSubmitHandler(onEditFormSubmit);

    // Рендер карточки задачи
    if (oldTaskEditComponent && oldTaskComponent) {
      replace(this._taskComponent, oldTaskComponent);
      replace(this._taskEditComponent, oldTaskEditComponent);
    } else {
      componentRender(this._container, this._taskComponent);
    }
  }

  /**
   * Универсальная функция обработки события нажатия на кнопку на карточке задачи
   * @param {Event} event
   * @private
   */
  _onTaskCardButtonClick(event) {
    const name = event.target.dataset.name;
    const taskButton = Object.values(TaskButtons).find((btn) => btn.name === name);

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
   * Установка вида карточки по умолчанию
   */
  setDefaultView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditToTask();
    }
  }

  /**
   * Переключение карточки с вида редактора на обычный
   * @private
   */
  _replaceEditToTask() {
    document.removeEventListener(`keydown`, this._onEscKeyDown);
    this._taskEditComponent.reset();
    replace(this._taskComponent, this._taskEditComponent);
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
      replace(this._taskComponent, this._taskEditComponent);
      document.removeEventListener(`keydown`, this._onEscKeyDown);
    }
  }
}
