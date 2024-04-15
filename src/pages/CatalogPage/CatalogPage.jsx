import React, { useState, useEffect, useRef } from 'react';
import { fetchCars } from 'redux/cars/cars.reducer';
import { useSelector, useDispatch } from 'react-redux';
import { CarList } from 'components/CarList/CarList';
import { useLocation } from 'react-router-dom';
import { Navigate, NavLink } from 'react-router-dom';
import Filter from 'components/Filter/Filter';
import Loader from 'components/Loader/Loader';
import { selectCars, selectError } from 'redux/cars/cars.selector';

import css from './CatalogPage.module.css';

const CatalogPage = () => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);
  const location = useLocation();
  const backLinkRef = useRef(location.state?.from ?? '/');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 12;
  const [loading, setLoading] = useState(true);
  const [filteredCars, setFilteredCars] = useState([]);
  const data = useSelector(selectCars);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalItemsResponse = await dispatch(
          fetchCars({ page: currentPage, limit })
        );
        const allCars = totalItemsResponse.payload.allCars;

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
    let filtered = data.allCars;

    if (filters.make) {
      filtered = filtered.filter(
        car => car.make.toLowerCase() === filters.make.toLowerCase()
      );
    }

    if (filters.price) {
      const numericPrice = parseFloat(filters.price);
      filtered = filtered.filter(
        car => parseFloat(car.rentalPrice.replace('$', '')) <= numericPrice
      );
    }

    if (filters.minMileage) {
      const minMileageNumber = parseFloat(filters.minMileage);
      filtered = filtered.filter(
        car => parseFloat(car.mileage) >= minMileageNumber
      );
    }

    if (filters.maxMileage) {
      const maxMileageNumber = parseFloat(filters.maxMileage);
      filtered = filtered.filter(
        car => parseFloat(car.mileage) <= maxMileageNumber
      );
    }

    setFilteredCars(filtered);
    setCurrentPage(1);
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
        onAllFilterChange={handleAllFilterChange}
        allCars={data.allCars}
      />

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
