import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { removeFavorite } from '../../redux/favorites/favorites.reducer';
import { PsychologistsElement } from '../../components/PsychologistsElement/PsychologistsElement ';
import Loader from '../../components/Loader/Loader';
import Filter from 'components/Filter/Filter';

import { selectFavorites } from 'redux/favorites/favorites.selector';

import css from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);

  const [favoriteDoctors, setFavoriteDoctors] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 3;
  const [filters, setFilters] = useState({
    nameDec: false,
    nameInc: false,
    lessPrice: false,
    morePrice: false,
    maxRating: false,
    minRating: false,
  });

  const navigate = useNavigate();
  const favoriteDoctorsRedux = useSelector(selectFavorites);
  const localStorageKeys = Object.keys(localStorage);
  const authKey = localStorageKeys.find(key => key.startsWith('auth1'));
  const authData = JSON.parse(localStorage.getItem(authKey));
  const userIdFromLocalStorage = authData?.uid;

  useEffect(() => {
    const authKey = localStorageKeys.find(key => key.startsWith('auth1'));
    const authData = JSON.parse(localStorage.getItem(authKey));
    const userIdFromLocalStorage = authData?.uid;
    if (!userIdFromLocalStorage && authKey) {
      localStorage.removeItem(authKey);
      navigate('/');
      return;
    }

    if (authKey && userIdFromLocalStorage && favoriteDoctors.length > 0) {
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(favoriteDoctors)
      );
      setLoading(false);
    }

    if (userIdFromLocalStorage && favoriteDoctors.length > 0) {
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,

        JSON.stringify(favoriteDoctors)
      );

      setLoading(false);
    }
  }, [favoriteDoctors, navigate, localStorageKeys]);

  useEffect(() => {
    if (userIdFromLocalStorage && favoriteDoctors.length > 0) {
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,

        JSON.stringify(favoriteDoctors)
      );

      setLoading(false);
    }

    console.log(`Key for local storage: favor_${userIdFromLocalStorage}`);
  }, [userIdFromLocalStorage, favoriteDoctors]);

  useEffect(() => {
    if (favoriteDoctorsRedux && favoriteDoctorsRedux.length > 0) {
      setFavoriteDoctors(favoriteDoctorsRedux);
    } else {
      const storedFavoritesFromLocalStorage = localStorage.getItem(
        `favor_${userIdFromLocalStorage}`
      );

      if (storedFavoritesFromLocalStorage) {
        const parsedFavorites = JSON.parse(storedFavoritesFromLocalStorage);

        setFavoriteDoctors(parsedFavorites);
      }
    }

    setLoading(false);
  }, [favoriteDoctorsRedux, userIdFromLocalStorage]);

  const handleRemoveFromFavorites = name => {
    removeFavorite({ doctorName: name });
  };

  const handleAllFilterChange = useCallback(newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));

    setCurrentPage(1);
  }, []);

  let filteredDoctors = favoriteDoctors || [];

  if (filters.nameDec) {
    filteredDoctors.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.nameInc) {
    filteredDoctors.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (filters.lessPrice) {
    filteredDoctors.sort(
      (a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour)
    );
  } else if (filters.morePrice) {
    filteredDoctors.sort(
      (a, b) => parseFloat(b.price_per_hour) - parseFloat(a.price_per_hour)
    );
  }

  if (filters.maxRating) {
    filteredDoctors.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (filters.minRating) {
    filteredDoctors.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedDoctors = filteredDoctors.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredDoctors.length / limit);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);

      window.scrollTo({
        top: document.documentElement.scrollHeight,

        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className={css.homeContainer}>
        <Filter
          allDoctors={filteredDoctors}
          onAllFilterChange={handleAllFilterChange}
        />

        <div className={css.homeList}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {paginatedDoctors.length > 0 ? (
                paginatedDoctors.map(doctor => (
                  <PsychologistsElement
                    key={doctor.name}
                    {...doctor}
                    onRemoveFromFavorites={handleRemoveFromFavorites}
                  />
                ))
              ) : (
                <p className={css.empty}>
                  Your favorites are currently empty...
                </p>
              )}

              {currentPage < totalPages && (
                <button className={css.button} onClick={handleLoadMore}>
                  Load More
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
