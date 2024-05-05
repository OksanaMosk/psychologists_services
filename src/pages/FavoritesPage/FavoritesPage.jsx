import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import addFavorite from '../../redux/favorites/favorites.reducer';
import removeFavorite from '../../redux/favorites/favorites.reducer';
import { PsychologistsElement } from '../../components/PsychologistsElement/PsychologistsElement ';
import Loader from '../../components/Loader/Loader';
import Filter from 'components/Filter/Filter';
import { useDispatch } from 'react-redux';

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

  const handleAddToFavorites = (doctorsData, userId) => {
    return dispatch => {
      dispatch(addFavorite(doctorsData));
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
      const updatedFavorites = [...storedFavorites, doctorsData];
      localStorage.setItem(
        `favorites_${userId}`,
        JSON.stringify(updatedFavorites)
      );
    };
  };

  const handleRemoveFromFavorites = (name, userId) => {
    dispatch(removeFavorite(name));

    const storedFavorites =
      JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];

    const updatedFavorites = storedFavorites.filter(
      doctors => doctors.name !== name
    );

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
                    onAddToFavorites={() => handleAddToFavorites(doctors)}
                    onRemoveFromFavorites={() =>
                      handleRemoveFromFavorites(doctors.name)
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
