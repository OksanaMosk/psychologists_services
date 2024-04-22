import React, { useState } from 'react';
import css from './Filter.module.css';

const Filter = ({ onAllFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const handleFilterChange = event => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);

    const newFilters = {
      nameDec: selectedValue === 'A to Z',
      nameInc: selectedValue === 'Z to A',
      lessPrice: selectedValue === 'Less than 10$',
      morePrice: selectedValue === 'More than 10$',
      maxRating: selectedValue === 'Popular',
      minRating: selectedValue === 'Not popular',
    };

    onAllFilterChange(newFilters);
  };

  return (
    <div className={css.filterform}>
      <div className={css.filterLink}>
        <h2 className={css.brandTitle}>Filters</h2>
        <select
          className={css.filterByBrand}
          value={selectedFilter}
          onChange={handleFilterChange}
        >
          <option value="">Select Filter</option>
          <option value="A to Z">A to Z</option>
          <option value="Z to A">Z to A</option>
          <option value="Less than 10$">Less than 10$</option>
          <option value="More than 10$">Greater than 10$</option>
          <option value="Popular">Popular</option>
          <option value="Not popular">Not popular</option>
          <option value="Show all">Show all</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
