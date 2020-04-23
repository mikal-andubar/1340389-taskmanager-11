import {KEY_CODE} from "../constants";
import {componentRender, replace} from "../utils/render";
import TaskComponent from "../components/task";
import TaskEditComponent from "../components/task-edit";

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
  }

  /**
   * Отрисовка карточки задачи
   * @param {{}} task
   */
  render(task) {

    /**
     * Обработчик события клика по кнопке FAVORITES
     */
    const onFavoritesButtonClick = () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isFavorite: !task.isFavorite,
      }));
    };

    /**
     * Обработчик события клика по кнопке ARCHIVE
     */
    const onArchiveButtonClick = () => {
      this._onDataChange(this, task, Object.assign({}, task, {
        isArchive: !task.isArchive,
      }));
    };

    /**
     * Обработчик события клика по кнопке EDIT
     */
    const onEditButtonClick = () => {
      this._replaceTaskToEdit();
      document.addEventListener(`keydown`, this._onEscKeyDown);
    };

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
    this._taskComponent.setEditButtonClickHandler(onEditButtonClick);
    this._taskComponent.setArchiveButtonClickHandler(onArchiveButtonClick);
    this._taskComponent.setFavoritesButtonClickHandler(onFavoritesButtonClick);

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
