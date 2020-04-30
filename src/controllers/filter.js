import FilterComponent from "../components/filters";

import {getTasksByFilter} from "../utils/filter";

import {FilterType} from "../constants";
import {componentRender, replace} from "../utils/render";

/**
 * Контроллер для фильтров
 */
export default class FilterController {

  /**
   * Конструктор класса
   * @param {Element} container
   * @param {{}} tasksModel
   */
  constructor(container, tasksModel) {
    this._container = container;
    this._tasksModel = tasksModel;

    this._activeFilterType = FilterType.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._tasksModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const filters = Object.values(FilterType).map((filterType) => {
      return {
        name: filterType,
        count: getTasksByFilter(this._tasksModel.getAllTasks(), filterType).length,
        checked: filterType === this._activeFilterType,
      };
    });

    const oldComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldComponent) {
      replace(this._filterComponent, oldComponent);
    } else {
      componentRender(this._container, this._filterComponent);
    }
  }

  /**
   * Обработчик смены фильтра
   * @param {string} filterType
   * @private
   */
  _onFilterChange(filterType) {
    this._tasksModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  /**
   * Обработчик изменения данных
   * @private
   */
  _onDataChange() {
    this.render();
  }

}
