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

  let filtered = [...filteredCars];
  const handleAllFilterChange = filters => {
    if (filters.nameDec) {
      console.log('Applying A to Z filter');
      filtered = filtered
        .map(car => ({
          ...car,
          name: car.name.replace('Dr. ', '').toLowerCase(),
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
    } else if (filters.nameInc) {
      console.log('Applying Z to A filter');
      filtered = filtered
        .map(car => ({
          ...car,
          name: car.name.replace('Dr. ', '').toLowerCase(),
        }))
        .sort((a, b) => b.name.localeCompare(a.name));
    }

    // Фільтруємо за ціною
    if (filters.lessPrice) {
      console.log('Applying filter for prices less than $180');
      filtered = filtered.filter(car => parseFloat(car.price_per_hour) < 180);
    } else if (filters.morePrice) {
      console.log('Applying filter for prices more than $180');
      filtered = filtered.filter(car => parseFloat(car.price_per_hour) > 180);
    }

    // Сортуємо за рейтингом
    if (filters.maxRating) {
      console.log('Applying filter for max rating');
      filtered = filtered.sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating)
      );
    } else if (filters.minRating) {
      console.log('Applying filter for min rating');
      filtered = filtered.sort(
        (a, b) => parseFloat(a.rating) - parseFloat(b.rating)
      );
    }

    setFilteredCars(filtered);
    console.log('Filtered cars after sorting:', filtered);
    console.log('🚀 ~ handleAllFilterChange ~ filteredCars:', filteredCars);
    setCurrentPage(1); // Скидаємо сторінку на першу при зміні фільтра

    return filtered;
  };

  if (loading) {
    return (
      <div className={css.loader}>
        <Loader />
      </div>
    );
  }
  const handleLoadMore = () => {
    if (hasMore) {
      setCurrentPage(prevPage => prevPage + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
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
        allCars={[...filteredCars]}
        onAllFilterChange={handleAllFilterChange}
      />
      <CarList
        cars={filtered.slice((currentPage - 1) * limit, currentPage * limit)}
      />
      {hasMore && filtered.length > currentPage * limit && (
        <button className={css.button} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default CatalogPage;
