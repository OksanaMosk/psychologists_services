import React, { useState, useEffect } from 'react';
import { fetchDoctors } from 'redux/doctors/doctors.reducer';
import { useSelector, useDispatch } from 'react-redux';
import { PsychologistsList } from 'components/PsychologistsList/PsychologistsList';
import { Navigate } from 'react-router-dom';
import Filter from 'components/Filter/Filter';
import Loader from 'components/Loader/Loader';

import { selectAuthenticated } from '../../redux/auth/auth.selector';

import { selectError } from 'redux/doctors/doctors.selector';

import css from './Psychologists.module.css';

const Psychologists = (handleRemoveFromFavorites, handleAddToFavorites) => {
  const dispatch = useDispatch();
  const error = useSelector(selectError);

  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;
  const [loading, setLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filters, setFilters] = useState({
    nameDec: false,
    nameInc: false,
    lessPrice: false,
    morePrice: false,
    maxRating: false,
    minRating: false,
  });
  const authenticated = useSelector(selectAuthenticated);

  useEffect(() => {
    if (!authenticated) {
      localStorage.removeItem('favorites');
    }
  }, [authenticated]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const totalItemsResponse = await dispatch(
          fetchDoctors({ page: currentPage, limit })
        );
        const allDoctors = totalItemsResponse.payload.allDoctors;
        if (!allDoctors) {
          return;
        }
        setLoading(false);
        setFilteredDoctors(allDoctors);
        const totalPages = Math.ceil(allDoctors.length / limit);
        if (currentPage > totalPages) {
          setCurrentPage(totalPages);
        }
        setHasMore(currentPage < totalPages);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, limit]);

  const handleAllFilterChange = newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1); // Скидаємо сторінку на першу при зміні фільтра
  };

  const filtered = [...filteredDoctors];

  if (filters.nameDec) {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.nameInc) {
    filtered.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (filters.lessPrice) {
    filtered.sort(
      (a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour)
    );
  } else if (filters.morePrice) {
    filtered.sort(
      (a, b) => parseFloat(b.price_per_hour) - parseFloat(a.price_per_hour)
    );
  }

  if (filters.maxRating) {
    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (filters.minRating) {
    filtered.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
  }

  const filteredPaginatedDoctors = filtered.slice(
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
      {error !== null && <Navigate to="psychologists/404" replace={true} />}

      <Filter
        allDoctors={filteredDoctors}
        onAllFilterChange={handleAllFilterChange}
      />
      <PsychologistsList
        doctors={filteredPaginatedDoctors}
        handleAddToFavorites={handleAddToFavorites}
        handleRemoveFromFavorites={handleRemoveFromFavorites}
      />
      {hasMore && filtered.length > currentPage * limit && (
        <button className={css.button} onClick={handleLoadMore}>
          Load more
        </button>
      )}
    </div>
  );
};

export default Psychologists;
