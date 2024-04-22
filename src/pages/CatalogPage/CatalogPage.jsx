import React, { useState, useEffect, useRef } from 'react';
import { fetchCars } from 'redux/cars/cars.reducer';
import { useSelector, useDispatch } from 'react-redux';
import { CarList } from 'components/CarList/CarList';
import { useLocation } from 'react-router-dom';
import { Navigate, NavLink } from 'react-router-dom';
import Filter from 'components/Filter/Filter';
import Loader from 'components/Loader/Loader';
import { selectError } from 'redux/cars/cars.selector';

import css from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const location = useLocation();
  const backLinkRef = useRef(location.state?.from ?? '/');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;
  const [loading, setLoading] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalItemsResponse = await dispatch(
          fetchCars({ page: currentPage, limit })
        );
        const allCars = totalItemsResponse.payload.allCars;
        console.log('allCars:', allCars);
        console.log('allCars.name:', allCars[1].name);

        setLoading(false);
        setFilteredCars(allCars);
        const totalPages = Math.ceil(allCars.length / limit);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
        setHasMore(currentPage < totalPages);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, limit]);

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  const handleAllFilterChange = filters => {
    let filtered = [...filteredCars];

    if (filters && filters.name === 'asc') {
      // Перевірка, чи існує властивість name у newFilters та чи вона дорівнює 'asc'
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name)); // Сортування за зростанням імені
    } else if (filters && filters.item === 'desc') {
      filtered = filtered.sort((a, b) => b.name.localeCompare(a.name));
    } else if (filters.name === '<10' && filters.minPrice !== '') {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(
        car => parseFloat(car.price_per_hour) >= minPrice
      );
    } else if (filters.name === '>10' && filters.maxPrice !== '') {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(
        car => parseFloat(car.price_per_hour) <= maxPrice
      );
    } else if (filters.name == '') {
      const minRatingNumber = parseFloat(filters.minRating);
      filtered = filtered.filter(
        car => parseFloat(car.rating) >= minRatingNumber
      );
    } else if (filters.name == '') {
      const maxRatingNumber = parseFloat(filters.maxRating);
      filtered = filtered.filter(
        car => parseFloat(car.rating) <= maxRatingNumber
      );
    } else {
      setFilteredCars(filtered);
      console.log('setFilteredCars:', filtered);
      setCurrentPage(1);
    }
  };

  console.log('filteredCars', filteredCars);
  if (loading) {
    return (
      <div className={css.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={css.contactsContainer}>
      {error !== null && <Navigate to="/catalog/404" replace={true} />}
      <NavLink
        state={{ from: location }}
        className={css.goBack}
        to={backLinkRef.current}
      >
        Go back
      </NavLink>
      <Filter onAllFilterChange={handleAllFilterChange} />

      <CarList
        cars={filteredCars.slice(
          (currentPage - 1) * limit,
          currentPage * limit
        )}
      />
      {hasMore && filteredCars.length > currentPage * limit && (
        <button className={css.button} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default CatalogPage;
