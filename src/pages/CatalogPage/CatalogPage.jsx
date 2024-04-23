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
  const [filters, setFilters] = useState({
    nameDec: false,
    nameInc: false,
    lessPrice: false,
    morePrice: false,
    maxRating: false,
    minRating: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalItemsResponse = await dispatch(
          fetchCars({ page: currentPage, limit })
        );
        const allCars = totalItemsResponse.payload.allCars;
        if (!allCars) {
          console.error('allCars is missing');
          return;
        }
        setLoading(false);
        setFilteredCars(allCars);
        const totalPages = Math.ceil(allCars.length / limit);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
        setHasMore(currentPage < totalPages);
      } catch (error) {
        console.error('Error fetching cars:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, limit]);

  const handleAllFilterChange = newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1); // Скидаємо сторінку на першу при зміні фільтра
  };

  const filtered = [...filteredCars];

  if (filters.nameDec) {
    console.log('Applying A to Z filter');
    filtered.sort((a, b) => a.name.localeCompare(b.name));
    console.log('Applying A to Z filter', filtered);
  } else if (filters.nameInc) {
    console.log('Applying Z to A filter');
    filtered.sort((a, b) => b.name.localeCompare(a.name));
    console.log('Applying Z to A filter', filtered);
  }

  // Filter by price
  if (filters.lessPrice) {
    filtered.sort(
      (a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour)
    );
    console.log('Lowest price per hour', filtered);
  } else if (filters.morePrice) {
    filtered.sort(
      (a, b) => parseFloat(b.price_per_hour) - parseFloat(a.price_per_hour)
    );
    console.log('Highest price per hour', filtered);
  }

  // Filter by rating

  if (filters.maxRating) {
    console.log('Applying filter for max rating');
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    console.log('Рейтинг  Від найменшого', filtered);
  } else if (filters.minRating) {
    console.log('Applying filter for min rating');
    filtered.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
    console.log('Рейтинг від найменшого', filtered);
  }

  const filteredPaginatedCars = filtered.slice(
    (currentPage - 1) * limit,
    currentPage * limit
  );

  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

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

      <Filter
        allCars={filteredCars}
        onAllFilterChange={handleAllFilterChange}
      />
      <CarList cars={filteredPaginatedCars} />
      {hasMore && filtered.length > currentPage * limit && (
        <button className={css.button} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default CatalogPage;
