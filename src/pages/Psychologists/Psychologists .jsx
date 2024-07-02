import React, { useState, useEffect, useRef } from 'react';
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
  const contactContainerRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const limit = 3;
  const [loading, setLoading] = useState(true);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [shouldScroll, setShouldScroll] = useState(false);
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
        if (currentPage === 1) {
          setFilteredDoctors(allDoctors);
        } else {
          setFilteredDoctors(allDoctors);
        }

        const totalPages = Math.ceil(allDoctors.length / limit);
        setHasMore(currentPage < totalPages);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, currentPage, limit]);

  const handleAllFilterChange = newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
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
    0,
    Math.min(filtered.length, currentPage * limit)
  );

  useEffect(() => {
    if (shouldScroll && contactContainerRef.current) {
      const container = contactContainerRef.current;
      const containerHeight = container.clientHeight;

      const additionalScroll = 0.5 * containerHeight;
      const scrollPosition = container.scrollTop + additionalScroll;

      setTimeout(() => {
        container.scrollTo({
          top: scrollPosition,
          behavior: 'smooth',
        });
        setShouldScroll(false);
      }, 0);

      container.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
      });
    }
  }, [shouldScroll]);

  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
    setShouldScroll(true);
  };

  const handleNotLoadMore = () => {
    window.scrollTo({
      top: 0,
    });
  };

  if (loading) {
    return (
      <div className={css.loader}>
        <Loader />
      </div>
    );
  }

  return (
    <div ref={contactContainerRef} className={css.contactsContainer}>
      {error !== null && <Navigate to="psychologists/404" replace={true} />}

      <Filter
        className={css.filter}
        allDoctors={filteredDoctors}
        onAllFilterChange={handleAllFilterChange}
      />
      <PsychologistsList
        doctors={filteredPaginatedDoctors}
        handleAddToFavorites={handleAddToFavorites}
        handleRemoveFromFavorites={handleRemoveFromFavorites}
      />
      {hasMore && filtered.length > currentPage * limit ? (
        <button type="button" className={css.button} onClick={handleLoadMore}>
          Load more
        </button>
      ) : (
        <button
          type="button"
          className={css.buttonNot}
          onClick={handleNotLoadMore}
        >
          Go top
        </button>
      )}
    </div>
  );
};

export default Psychologists;
