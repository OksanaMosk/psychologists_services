import React, { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  addFavorite,
  removeFavorite,
} from '../../redux/favorites/favorites.reducer';
import { PsychologistsElement } from '../../components/PsychologistsElement/PsychologistsElement ';
import Loader from '../../components/Loader/Loader';
import Filter from 'components/Filter/Filter';
import { useDispatch } from 'react-redux';
import Notiflix from 'notiflix';
import { selectFavorites } from 'redux/favorites/favorites.selector';

import {
  selectUserData,
  selectAuthenticated,
} from '../../redux/auth/auth.selector';

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
  const dispatch = useDispatch();
  const favoriteDoctorsRedux = useSelector(selectFavorites);

  const authenticated = useSelector(selectAuthenticated);

  const userData = useSelector(selectUserData);

  const userId = userData ? userData.uid : null;

  useEffect(() => {
    if (!authenticated) {
      navigate('/');
      localStorage.removeItem('favorites');
    }
    console.log('🚀 ~ FavoritesPage ~ userId :', userId);
  }, [authenticated, navigate, userId]);

  useEffect(() => {
    const storedFavoritesFromLocalStorage = localStorage.getItem(
      `favorites_${userId}`
    );
    if (storedFavoritesFromLocalStorage) {
      const parsedFavorites = JSON.parse(storedFavoritesFromLocalStorage);
      setFavoriteDoctors(parsedFavorites);
      setLoading(false);
    } else {
      setLoading(false);
    }
    console.log('🚀 ~ FavoritesPage ~ userId :', userId);
  }, [userId]);

  useEffect(() => {
    if (favoriteDoctorsRedux && favoriteDoctorsRedux.length > 0) {
      setLoading(false);
      setFavoriteDoctors(favoriteDoctorsRedux);
    } else {
      const storedFavoritesFromLocalStorage = localStorage.getItem('favorites');
      if (storedFavoritesFromLocalStorage) {
        const parsedFavorites = JSON.parse(storedFavoritesFromLocalStorage);
        setFavoriteDoctors(parsedFavorites);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [favoriteDoctorsRedux]);

  const handleAddToFavorites = useCallback(
    (doctorsData, userId) => {
      console.log('🚀 ~ handleAddToFavorites ~ doctorsData:', doctorsData);
      console.log('🚀 ~ handleAddToFavorites ~ doctor name:', doctorsData.name);

      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

      const isAlreadyFavorite = storedFavorites.some(
        doctor => doctor.name === doctorsData.name
      );

      if (isAlreadyFavorite) {
        Notiflix.Notify.warning(
          `This doctor ${doctorsData.name} is already in favorites`
        );
        return;
      }

      dispatch(addFavorite(doctorsData));
      console.log('🚀 ~ FavoritesPage ~ userId :', userId);
      console.log('🚀 ~ handleAddToFavorites ~ doctorsData:', doctorsData);
      const updatedFavorites = [...storedFavorites, doctorsData];
      localStorage.setItem(
        `favorites_${userId}`,
        JSON.stringify(updatedFavorites)
      );
    },
    [dispatch]
  );

  const handleRemoveFromFavorites = (name, userId) => {
    console.log('Name to be removed:', name);
    console.log('User ID:', userId);

    // Отримуємо список улюблених лікарів з локального сховища
    const storedFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

    console.log('Stored favorites:', storedFavorites);

    // Фільтруємо улюблених лікарів, щоб видалити того, якого ми хочемо
    const updatedFavorites = storedFavorites.filter(
      doctor => doctor.name !== name
    );

    console.log('Updated favorites after removal:', updatedFavorites);

    // Видаляємо елемент зі стору
    const favoriteToRemove = { name: name };
    dispatch(removeFavorite(favoriteToRemove));

    // Оновлюємо улюблені лікарів у локальному сховищі
    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify(updatedFavorites)
    );
  };

  const handleAllFilterChange = newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
  };

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
                paginatedDoctors.map(doctors => (
                  <PsychologistsElement
                    key={doctors.name}
                    {...doctors}
                    onAddToFavorites={() =>
                      handleAddToFavorites(doctors, userId)
                    }
                    onRemoveFromFavorites={() =>
                      handleRemoveFromFavorites(doctors.name, userId)
                    }
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

// useEffect(() => {
//   // Видалення всіх елементів зі списку фаворитів у редукторі
//   dispatch(removeAllFavorites());
// }, [dispatch]);
