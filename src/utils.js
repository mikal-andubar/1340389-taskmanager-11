/**
 * Добавление ведущего нуля к времени
 * @param {number} value
 * @return {string}
 */
import {RENDER_PLACE} from "./constants";

const castTimeFormat = (value) => value < 10 ? `0${value}` : String(value);

/**
 * Форматирование времени
 * @param {Date} date
 * @return {string}
 */
export const formatTime = (date) => {
  const hours = castTimeFormat(date.getHours() % 12);
  const minutes = castTimeFormat(date.getMinutes());

  return `${hours}:${minutes}`;
};

/**
 * Создает и возвращает элемент DOM с переданным содержимым
 * @param {string} template
 * @return {ChildNode}
 */
export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};

/**
 * Функция рендера элемента
 * @param {Element} container
 * @param {Filter} element
 * @param {string} place
 */
export const render = (container, element, place = RENDER_PLACE.BEFORE_END) => {
  switch (place) {
    case RENDER_PLACE.AFTER_BEGIN:
      container.prepend(element);
      break;
    case RENDER_PLACE.BEFORE_END:
      container.append(element);
      break;
  }
};
