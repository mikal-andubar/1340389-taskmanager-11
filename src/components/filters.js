/**
 * Создание разметки одного фильтра
 * @param {[]} filter
 * @param {boolean} isChecked
 * @return {string}
 */
const createFilterMarkup = (filter, isChecked) => {
  const {name, count} = filter;

  return (
    `<input
      type="radio"
      id="filter__${name}"
      class="filter__input visually-hidden"
      name="filter"
      ${isChecked ? `checked` : ``}
    />
    <label for="filter__${name}" class="filter__label">${name} <span class="filter__${name}-count">${count}</span></label>`
  );
};

/**
 * Создание шаблона для фильтров
 * @param {[]} filters
 * @return {string}
 */
export const createFiltersTemplate = (filters) => {
  const filtersMarkup = filters.map((it, i) => createFilterMarkup(it, i === 0)).join(`\n`);

  return (
    `<section class="main__filter filter container">
      ${filtersMarkup}
    </section>`
  );
};
