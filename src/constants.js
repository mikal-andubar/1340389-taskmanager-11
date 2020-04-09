/**
 * Цвета
 * @type {string[]}
 */
export const COLORS = [`black`, `yellow`, `blue`, `green`, `pink`];

/**
 * Сокращенные наименования дней недели
 * @type {string[]}
 */
export const DAYS = [`mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`];

/**
 * Названия месяцев
 * @type {string[]}
 */
export const MONTH_NAMES = [
  `January`,
  `February`,
  `March`,
  `April`,
  `May`,
  `June`,
  `July`,
  `August`,
  `September`,
  `October`,
  `November`,
  `December`,
];

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
