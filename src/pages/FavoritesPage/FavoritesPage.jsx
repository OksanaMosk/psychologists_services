import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import addFavorite from '../../redux/favorites/favorites.reducer';
import removeFavorite from '../../redux/favorites/favorites.reducer';
import { CarElement } from '../../components/CarElement/CarElement';
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
  const [favoriteCars, setFavoriteCars] = useState([]);
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
  const favoriteCarsRedux = useSelector(selectFavorites);

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
      setFavoriteCars(parsedFavorites);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (favoriteCarsRedux && favoriteCarsRedux.length > 0) {
      setLoading(false);
      setFavoriteCars(favoriteCarsRedux);
    } else {
      const storedFavoritesFromLocalStorage = localStorage.getItem('favorites');
      if (storedFavoritesFromLocalStorage) {
        const parsedFavorites = JSON.parse(storedFavoritesFromLocalStorage);
        setFavoriteCars(parsedFavorites);
        setLoading(false);
      } else {
        setLoading(false);
      }
    }
  }, [favoriteCarsRedux]);

  const handleAddToFavorites = (carData, userId) => {
    return dispatch => {
      dispatch(addFavorite(carData));
      const storedFavorites =
        JSON.parse(localStorage.getItem(`favorites_${userId}`)) || [];
      const updatedFavorites = [...storedFavorites, carData];
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

    const updatedFavorites = storedFavorites.filter(car => car.name !== name);

    localStorage.setItem(
      `favorites_${userId}`,
      JSON.stringify(updatedFavorites)
    );
  };

  const handleAllFilterChange = newFilters => {
    setFilters(prevFilters => ({ ...prevFilters, ...newFilters }));
    setCurrentPage(1);
  };

  let filteredCars = favoriteCars || [];

  if (filters.nameDec) {
    filteredCars.sort((a, b) => a.name.localeCompare(b.name));
  } else if (filters.nameInc) {
    filteredCars.sort((a, b) => b.name.localeCompare(a.name));
  }

  if (filters.lessPrice) {
    filteredCars.sort(
      (a, b) => parseFloat(a.price_per_hour) - parseFloat(b.price_per_hour)
    );
  } else if (filters.morePrice) {
    filteredCars.sort(
      (a, b) => parseFloat(b.price_per_hour) - parseFloat(a.price_per_hour)
    );
  }

  if (filters.maxRating) {
    filteredCars.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
  } else if (filters.minRating) {
    filteredCars.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating));
  }

  const startIndex = (currentPage - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedCars = filteredCars.slice(startIndex, endIndex);
  const totalPages = Math.ceil(filteredCars.length / limit);

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className={css.homeContainer}>
        <Filter
          allCars={filteredCars}
          onAllFilterChange={handleAllFilterChange}
        />
        <div className={css.homeList}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {paginatedCars.length > 0 ? (
                paginatedCars.map(car => (
                  <CarElement
                    key={car.name}
                    {...car}
                    onAddToFavorites={() => handleAddToFavorites(car)}
                    onRemoveFromFavorites={() =>
                      handleRemoveFromFavorites(car.name)
                    }
                  />
                ))
              ) : (
                <p>Your favorites are currently empty...</p>
              )}
              {currentPage < totalPages && (
                <button onClick={handleLoadMore}>Load More</button>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
