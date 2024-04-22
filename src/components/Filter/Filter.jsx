import React, { useState } from 'react';

import css from './Filter.module.css';

const Filter = ({ onAllFilterChange, allCars }) => {
  const [selectedFilter, setSelectedFilter] = useState('');

  const [selectedNameDec, setSelectedNameDec] = useState('');
  const [selectedNameInc, setSelectedNameInc] = useState('');
  const [selectedLessPrice, setSelectedLessPrice] = useState('');
  const [selectedMorePrice, setSelectedMorePrice] = useState('');
  const [minRating, setMinRating] = useState('');
  const [maxRating, setMaxRating] = useState('');

  const handleNameDecChange = event => {
    setSelectedFilter('A to Z');
    setSelectedNameDec(event.target.value);
  };

  const handleNameIncChange = event => {
    setSelectedFilter('Z to A');
    setSelectedNameInc(event.target.value);
  };

  const handleLessThanTenDollars = event => {
    setSelectedFilter('Less than 10$');
    setSelectedLessPrice(event.target.value);
  };

  const handleMoreThanTenDollars = event => {
    setSelectedFilter('Greater than 10$');
    setSelectedMorePrice(event.target.value);
  };

  const handleMaxRating = event => {
    setSelectedFilter('Popular');
    setMaxRating(event.target.value);
  };

  const handleMinRating = event => {
    setSelectedFilter('Not popular');
    setMinRating(event.target.value);
  };

  const handleFilterClick = () => {
    const newFilters = {
      nameDec: selectedNameDec,
      nameInc: selectedNameInc,
      lessPrice: selectedLessPrice,
      morePrice: selectedMorePrice,
      maxRating: parseInt(maxRating),
      minRating: parseInt(minRating),
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
          onChange={event => {
            setSelectedFilter(event.target.value); // Оновлення значення selectedFilter
            handleFilterClick(); // Виклик функції фільтрації при зміні значення
          }}
        >
          <option value="">Select Filter</option>
          <option value="A to Z" onChange={handleNameDecChange}>
            A to Z
          </option>
          <option value="Z to A" onChange={handleNameIncChange}>
            Z to A
          </option>
          <option value="Less than 10$" onChange={handleLessThanTenDollars}>
            Less than 10$
          </option>
          <option value="Greater than 10$" onChange={handleMoreThanTenDollars}>
            Greater than 10$
          </option>
          <option value="Popular" onChange={handleMaxRating}>
            Popular
          </option>
          <option value="Not popular" onChange={handleMinRating}>
            Not popular
          </option>
          <option value="Show all">Show all</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default Filter;

// const Filter = ({ onAllFilterChange }) => {
//   const [selectedFilter, setSelectedFilter] = useState('');

//   const handleFilterChange = event => {
//     setSelectedFilter(event.target.value);
//   };

//   const handleFilterClick = () => {
//     const newFilters = {
//       nameDec: selectedFilter === 'A to Z' ? 'asc' : '',
//       nameInc: selectedFilter === 'Z to A' ? 'desc' : '',
//       lessPrice: selectedFilter === 'Less than 10$' ? '<10' : '',
//       morePrice: selectedFilter === 'Greater than 10$' ? '>10' : '',
//       maxRating: selectedFilter === 'Popular' ? 5 : '',
//       minRating: selectedFilter === 'Not popular' ? 1 : '',
//     };

//     onAllFilterChange(newFilters);
//   };

//   return (
//     <div className={css.filterform}>
//       <div className={css.filterLink}>
//         <h2 className={css.brandTitle}>Filters</h2>
//         <select
//           className={css.filterByBrand}
//           value={selectedFilter}
//           onChange={handleFilterChange}
//         >
//           <option value="">Select Filter</option>
//           <option value="A to Z">A to Z</option>
//           <option value="Z to A">Z to A</option>
//           <option value="Less than 10$">Less than 10$</option>
//           <option value="Greater than 10$">Greater than 10$</option>
//           <option value="Popular">Popular</option>
//           <option value="Not popular">Not popular</option>
//           <option value="Show all">Show all</option>
//         </select>
//       </div>
//     </div>
//   );
// };

// export default Filter;
