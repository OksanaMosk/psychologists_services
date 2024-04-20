import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { selectFavorites } from 'redux/favorites/favorites.selector';
import {
  addFavorite,
  removeFavorite,
} from '../../redux/favorites/favorites.reducer';

import noFavor from '../../images/noFavor.png';
import favor from '../../images/favor.png';
import css from './CarElement.module.css';

export const CarElement = ({
  name,
  avatar_url,
  experience,
  reviews,
  price_per_hour,
  rating,
  license,
  specialization,
  initial_consultation,
  about,
  data,
}) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const favorites = useSelector(selectFavorites);

  useEffect(() => {
    if (favorites) {
      const isAlreadyFavorite = favorites.some(car => car.name === name);
      setIsFavorite(isAlreadyFavorite);
    }
  }, [favorites, name]);

  useEffect(() => {
    const storedFavoritesFromLocalStorage =
      JSON.parse(localStorage.getItem('favorites')) || [];
    const isAlreadyFavorite = storedFavoritesFromLocalStorage.some(
      car => car.name === name
    );
    setIsFavorite(isAlreadyFavorite);
  }, [name]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleToggleFavorite = () => {
    const carData = {
      name,
      avatar_url,
      experience,
      reviews,
      price_per_hour,
      rating,
      license,
      specialization,
      initial_consultation,
      about,
      data,
    };

    if (isFavorite) {
      dispatch(removeFavorite(name));
      setIsFavorite(false);
    } else {
      dispatch(addFavorite(carData));
      setIsFavorite(true);
    }

    const favoritesFromLocalStorage =
      JSON.parse(localStorage.getItem('favorites')) || [];

    const updatedFavorites = isFavorite
      ? favoritesFromLocalStorage.filter(car => car.name !== name)
      : [...favoritesFromLocalStorage, carData];

    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  return (
    <li
      className={`${css.itemHome} ${imageLoaded ? css.imageLoaded : ''}`}
      key={name}
    >
      <img
        className={css.name}
        src={avatar_url}
        alt={`Car ${name}`}
        onLoad={handleImageLoad}
      />

      <div className={css.details}>
        <div className={css.titlePart}>
          <span>Psychologist</span>
          <div className={css.aboutPart}>
            <p className={css.title}>Rating:{rating}</p>
            <p className={css.price}>Price / 1 hour:{price_per_hour}$</p>

            <button
              className={css.imgButton}
              onClick={handleToggleFavorite}
              type="button"
            >
              <img
                className={isFavorite ? css.favorIcon : css.noFavorIcon}
                src={isFavorite ? favor : noFavor}
                alt="favorite"
                width={18}
                height={16}
              />
            </button>
          </div>
        </div>
        <h3 className={css.title}>{name}</h3>
        <div className={css.aboutPart}>
          <p className={css.price}>Experience:{experience}</p>
          <p className={css.price}>License:{license}</p>
          <p className={css.price}>Specialization: {specialization}</p>
          <p className={css.price}>
            Initial_consultation: {initial_consultation}
          </p>
        </div>
        <div>{about}</div>

        <button onClick={toggleDescription}>
          {showFullDescription ? (
            <div>
              <h4>Reviews:</h4>
              <ul>
                {reviews.map((review, index) => (
                  <li key={index}>
                    <p>Reviewer: {review.reviewer}</p>
                    <p>Rating: {review.rating}</p>
                    <p>Comment: {review.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            'Read more'
          )}
        </button>
      </div>
    </li>
  );
};
