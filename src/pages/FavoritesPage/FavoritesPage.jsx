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

import { selectAuthenticated } from '../../redux/auth/auth.selector';

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

  const localStorageKeys = Object.keys(localStorage);

  const authKey = localStorageKeys.find(key => key.startsWith('auth1'));
  const authData = JSON.parse(localStorage.getItem(authKey));
  const userIdFromLocalStorage = authData.uid;

  useEffect(() => {
    const authKey = localStorageKeys.find(key => key.startsWith('auth1'));
    const authData = JSON.parse(localStorage.getItem(authKey));
    const userIdFromLocalStorage = authData?.uid;

    if (!userIdFromLocalStorage && authKey) {
      localStorage.removeItem(authKey);
      console.log('User data is corrupted. Redirecting to the home page...');
      navigate('/');
      return;
    }

    if (authKey && userIdFromLocalStorage && favoriteDoctors.length > 0) {
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(favoriteDoctors)
      );
      setLoading(false);
      console.log(
        '🚀 ~ FavoritesPage ~ userIdFromLocalStorage :',
        userIdFromLocalStorage
      );
      console.log(
        '🚀 ~ FavoritesPage ~ userIdFromLocalStorage):',
        userIdFromLocalStorage
      );
    }

    if (userIdFromLocalStorage && favoriteDoctors.length > 0) {
      console.log(`Key for local storage: favor_${userIdFromLocalStorage}`);
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(favoriteDoctors)
      );
      setLoading(false);
    }
    console.log(`Key for local storage: favor_${userIdFromLocalStorage}`);
  }, [favoriteDoctors, navigate, localStorageKeys]);

  useEffect(() => {
    // Перевіряємо, чи є userIdFromLocalStorageі чи є у нас улюблені лікарі для цього userIdFromLocalStorage
    if (userIdFromLocalStorage && favoriteDoctors.length > 0) {
      console.log(`Key for local storage: favor_${userIdFromLocalStorage}`);

      // Зберігаємо улюблені лікарі у локальному сховищі
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(favoriteDoctors)
      );
      setLoading(false);
    }
    console.log(`Key for local storage: favor_${userIdFromLocalStorage}`);
  }, [userIdFromLocalStorage, favoriteDoctors]);

  useEffect(() => {
    // Перевіряємо, чи є у нас дані в Redux для улюблених лікарів
    if (favoriteDoctorsRedux && favoriteDoctorsRedux.length > 0) {
      setFavoriteDoctors(favoriteDoctorsRedux);
    } else {
      // Якщо у нас немає даних в Redux, перевіряємо локальне сховище
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

  const handleAddToFavorites = useCallback(
    doctorsData => {
      const isAlreadyFavorite = favoriteDoctors.some(
        doctor => doctor.name === doctorsData.name
      );
      console.log('🚀 ~ handleAddToFavorites ~ doctorsData:', doctorsData);
      console.log('🚀 ~ handleAddToFavorites ~ doctor name:', doctorsData.name);
      if (isAlreadyFavorite) {
        Notiflix.Notify.warning(
          `This doctor ${doctorsData.name} is already in favorites`
        );

        return;
      }

      dispatch(addFavorite(doctorsData));

      const updatedFavorites = [...favoriteDoctors, doctorsData];
      setFavoriteDoctors(updatedFavorites);

      // Оновлення даних в Redux перед збереженням у localStorage
      dispatch(addFavorite(doctorsData));

      // Збереження улюблених лікарів у localStorage
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(updatedFavorites)
      );
    },
    [dispatch, favoriteDoctors, userIdFromLocalStorage]
  );

  const handleRemoveFromFavorites = useCallback(
    name => {
      const updatedFavorites = favoriteDoctors.filter(
        doctor => doctor.name !== name
      );

      dispatch(removeFavorite({ name }));

      console.log('Name to be removed:', name);
      console.log('User ID:', userIdFromLocalStorage);

      setFavoriteDoctors(updatedFavorites);

      // Оновлення даних в Redux перед збереженням у localStorage
      dispatch(removeFavorite({ name }));

      // Збереження улюблених лікарів у localStorage
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(updatedFavorites)
      );
    },
    [dispatch, favoriteDoctors, userIdFromLocalStorage]
  );

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
                    onAddToFavorites={() => handleAddToFavorites(doctor)}
                    onRemoveFromFavorites={() =>
                      handleRemoveFromFavorites(doctor.name)
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
  //   if (!authenticated) {
  //     console.log('User is not authenticated. Redirecting to the home page...');
  //     navigate('/');
  //     localStorage.removeItem(`favor_${userIdFromLocalStorage}`);
  //     console.log('Removed favorite doctors from local storage.');
  //   } else {
  //     console.log('User is authenticated.');
  //   }
  // }, []);

  // useEffect(() => {
  //   // Перевіряємо наявність ідентифікатора користувача у LocalStorage
  //   if (!userIdFromLocalStorage) {
  //     localStorage.removeItem(`favor_${userIdFromLocalStorage}`);
  //     console.log('User is not authenticated. Redirecting to the home page...');
  //     navigate('/');
  //     return;
  //   }

  //   // Додаткові дії, якщо користувача знайдено
  //   console.log('User is authenticated.');
  // }, [navigate, userIdFromLocalStorage]);