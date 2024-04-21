import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { selectFavorites } from 'redux/favorites/favorites.selector';
// import { getDatabase, ref, onValue, set } from 'firebase/database';
import { CarElement } from '../../components/CarElement/CarElement';

import Loader from '../../components/Loader/Loader';

import css from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteCars, setFavoriteCars] = useState([]);

  const favoriteCarsRedux = useSelector(selectFavorites);

  useEffect(() => {
    if (favoriteCarsRedux && favoriteCarsRedux.length > 0) {
      setFavoriteCars(favoriteCarsRedux);
      setLoading(false);
    } else {
      const storedFavoritesFromLocalStorage = localStorage.getItem('favorites');
      if (storedFavoritesFromLocalStorage) {
        const parsedFavorites = JSON.parse(storedFavoritesFromLocalStorage);
        setFavoriteCars(parsedFavorites);
      }
      setLoading(false);
    }
  }, [favoriteCarsRedux]);

  const handleAddToFavorites = carData => {
    if (!favoriteCars.some(car => car.name === carData.name)) {
      setFavoriteCars(prevFavorites => [...prevFavorites, carData]);
    }
  };

  const handleRemoveFromFavorites = name => {
    const updatedFavoriteCars = favoriteCars.filter(car => car.name !== name);
    setFavoriteCars(updatedFavoriteCars);
    localStorage.setItem('favorites', JSON.stringify(updatedFavoriteCars));
  };

  const uniqueFavoriteCars = favoriteCars.reduce((acc, current) => {
    const isCarExists = acc.some(car => car.name === current.name);
    if (!isCarExists) {
      return [...acc, current];
    }
    return acc;
  }, []);

  return (
    <>
      <div className={css.homeContainer}>
        <div className={css.homeList}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {uniqueFavoriteCars.length > 0 ? (
                uniqueFavoriteCars.map(car => (
                  <CarElement
                    key={car.name}
                    {...car}
                    onAddToFavorites={() => handleAddToFavorites(car)}
                    onRemoveFromFavorites={() =>
                      handleRemoveFromFavorites(car.name)
                    } // додайте цей рядок
                  />
                ))
              ) : (
                <p>Your favorites are currently empty...</p>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default FavoritesPage;
