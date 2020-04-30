/**
 * Цвета
 * @type {{}}
 */
export const COLOR = {
  BLACK: `black`,
  YELLOW: `yellow`,
  BLUE: `blue`,
  GREEN: `green`,
  PINK: `pink`
};

/**
 * Сокращенные наименования дней недели
 * @type {string[]}
 */
export const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

/**
 * Возможные места для рендера
 * @type {{}}
 */
export const RENDER_PLACE = {
  BEFORE_END: `beforeend`,
  AFTER_END: `afterend`,
  BEFORE_BEGIN: `beforebegin`,
  AFTER_BEGIN: `afterbegin`,
};

/**
 * Константы, регулирующие количество отображаемых задач
 * @type {{}}
 */
export const TASK_COUNT = {
  TOTAL: 23,
  ON_START: 8,
  ON_BUTTON: 8,
};

/**
 * Коды нажатых клавиш для обработки событий
 * @type {{}}
 */
export const KEY_CODE = {
  ESCAPE: `Esc`,
  ESC: `Escape`,
};

/**
 * Данные для кнопок на карточке задачи
 * @type {{}}
 */
export const TaskButtons = {
  EDIT: {
    name: `edit`,
    property: null,
  },
  ARCHIVE: {
    name: `archive`,
    property: `isArchive`,
  },
  FAVORITE: {
    name: `favorites`,
    property: `isFavorite`
  },
};

/**
 * Типы фильтров
 * @type {{}}
 */
export const FilterType = {
  ALL: `all`,
  ARCHIVE: `archive`,
  FAVORITES: `favorites`,
  OVERDUE: `overdue`,
  REPEATING: `repeating`,
  TODAY: `today`,
};
