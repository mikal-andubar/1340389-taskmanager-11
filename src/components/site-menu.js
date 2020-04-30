import AbstractComponent from "./abstract-component";

/**
 * Массив с конфигом для меню
 * @type {{}}
 */
export const Navigation = {
  NEW_TASK: {
    name: `new-task`,
    label: `+ ADD NEW TASK`
  },
  TASKS: {
    name: `task`,
    label: `TASKS`
  },
  STATISTICS: {
    name: `statistic`,
    label: `STATISTICS`
  },
};

/**
 * создает шаблон для одного пункта меню
 * @param {{}} menuItem
 * @return {string}
 */
const createSiteMenuItemTemplate = (menuItem) => {
  const {name, label} = menuItem;

  return (
    `<input
      type="radio"
      name="control"
      id="control__${name}"
      class="control__input visually-hidden"
    />
    <label for="control__${name}" class="control__label control__label--${name}">${label}</label>`
  );
};

/**
 * Создание шаблона меню сайта
 * @return {string}
 */
export const createSiteMenuTemplate = () => (
  `<section class="control__btn-wrap">
    ${Object.values(Navigation).map((it) => createSiteMenuItemTemplate(it)).join(`\n`)}
  </section>`
);

/**
 * Класс для меню сайта
 */
export default class SiteMenu extends AbstractComponent {
  /**
   * Возвращает шаблон задачи
   * @return {string}
   */
  getTemplate() {
    return createSiteMenuTemplate();
  }

  /**
   * Устанавливает активный пункт меню
   * @param {string} itemName
   */
  setActiveItem(itemName) {
    const item = this.getElement().querySelector(`#control__${itemName}`);

    if (item) {
      item.checked = true;
    }
  }

  /**
   * Устанавливает обработчик изменения выбора меню
   * @param {function} handler
   */
  setOnChange(handler) {
    this.getElement().addEventListener(`change`, (event) => {
      if (event.target.tagName !== `INPUT`) {
        return;
      }

      const menuItem = event.target.id;

      handler(menuItem);
    });
  }
}
