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
      lessPrice: selectedValue === 'Lowest price per hour',
      morePrice: selectedValue === 'Highest price per hour',
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
          <option value="Lowest price per hour">Lowest price per hour</option>
          <option value="Highest price per hour">Highest price per hour</option>
          <option value="Popular">Popular</option>
          <option value="Not popular">Not popular</option>
          <option value="Show all">Show all</option>
        </select>
      </div>
    </div>
  );
};

export default Filter;
