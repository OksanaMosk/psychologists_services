import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { NavLink, useLocation } from 'react-router-dom';
import { selectFavorites } from 'redux/favorites/favorites.selector';
import { CarElement } from '../../components/CarElement/CarElement';
import Loader from '../../components/Loader/Loader';
import css from './FavoritesPage.module.css';

const FavoritesPage = () => {
  const [loading, setLoading] = useState(true);
  const [favoriteCars, setFavoriteCars] = useState([]);

  const location = useLocation();
  const backLinkRef = location.state?.from ?? '/';

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
    if (!favoriteCars.some(car => car.id === carData.id)) {
      setFavoriteCars(prevFavorites => [...prevFavorites, carData]);
    }
  };

  const uniqueFavoriteCars = favoriteCars.reduce((acc, current) => {
    const isCarExists = acc.some(car => car.id === current.id);
    if (!isCarExists) {
      return [...acc, current];
    }
    return acc;
  }, []);

  return (
    <>
      <NavLink className={css.goBack} to={backLinkRef}>
        Go back
      </NavLink>
      <div className={css.homeContainer}>
        <div className={css.homeList}>
          {loading ? (
            <Loader />
          ) : (
            <>
              {uniqueFavoriteCars.length > 0 ? (
                uniqueFavoriteCars.map(car => (
                  <CarElement
                    key={car.id}
                    {...car}
                    onAddToFavorites={() => handleAddToFavorites(car)}
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
