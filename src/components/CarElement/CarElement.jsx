import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuthenticated } from 'redux/auth/auth.selector';
import { selectFavorites } from 'redux/favorites/favorites.selector';
import ModalMakeAnAppointment from '../ModalMakeAnAppointment/ModalMakeAnAppointment';
import Notiflix from 'notiflix';
import {
  addFavorite,
  removeFavorite,
} from '../../redux/favorites/favorites.reducer';

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
  onRemoveFromFavorites, // Додано обробник подій для видалення зі списку фаворитів
}) => {
  const dispatch = useDispatch();

  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMakeAnAppointment, setIsMakeAnAppointment] = useState(false);

  const authenticated = useSelector(selectAuthenticated);

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
    if (authenticated) {
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
        onRemoveFromFavorites(name); // Викликаємо обробник подій для видалення зі списку фаворитів
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
    } else {
      Notiflix.Notify.warning(
        'Welcome! Functionality is available only for authorized users.'
      );
    }
  };

  const [showFullDescription, setShowFullDescription] = useState(false);

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  const openMakeAnAppointment = () => {
    if (!isMakeAnAppointment) {
      setIsMakeAnAppointment(true);
    }
  };

  const closeMakeAnAppointment = () => {
    setIsMakeAnAppointment(false);
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
            <p className={css.title}>Rating: {rating}</p>
            <p className={css.price}>Price / 1 hour: {price_per_hour}$</p>

            <button
              className={css.imgButton}
              onClick={handleToggleFavorite}
              type="button"
            >
              <svg
                className={`${isFavorite ? css.favorIcon : ''}`}
                width="26"
                height="22"
                viewBox="0 0 26 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5766 2.99416C22.0233 2.44058 21.3663 2.00144 20.6433 1.70184C19.9202 1.40223 19.1452 1.24802 18.3625 1.24802C17.5798 1.24802 16.8047 1.40223 16.0817 1.70184C15.3586 2.00144 14.7016 2.44058 14.1483 2.99416L13 4.14249L11.8516 2.99416C10.734 1.87649 9.21809 1.2486 7.63747 1.2486C6.05685 1.2486 4.54097 1.87649 3.4233 2.99416C2.30563 4.11183 1.67773 5.62771 1.67773 7.20833C1.67773 8.78895 2.30563 10.3048 3.4233 11.4225L4.57163 12.5708L13 20.9992L21.4283 12.5708L22.5766 11.4225C23.1302 10.8692 23.5693 10.2122 23.869 9.48913C24.1686 8.76605 24.3228 7.99102 24.3228 7.20833C24.3228 6.42563 24.1686 5.65061 23.869 4.92753C23.5693 4.20445 23.1302 3.54748 22.5766 2.99416Z"
                  stroke="var( --primary-text-color)"
                  stroke-width="1"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <h3 className={css.title}>{name}</h3>
        <div className={css.aboutPart}>
          <p className={css.price}>Experience: {experience}</p>
          <p className={css.price}>License: {license}</p>
          <p className={css.price}>Specialization: {specialization}</p>
          <p className={css.price}>
            Initial Consultation: {initial_consultation}
          </p>
        </div>
        <div>{about}</div>

        <div className={css.moreDescription} onClick={toggleDescription}>
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
        </div>
        {showFullDescription && (
          <button
            type="button"
            className={css.makeAnAppointment}
            onClick={openMakeAnAppointment}
          >
            {isMakeAnAppointment ? (
              <ModalMakeAnAppointment
                isOpen={isMakeAnAppointment}
                onClose={closeMakeAnAppointment}
                name={name}
              />
            ) : (
              'Make an appointment'
            )}
          </button>
        )}
      </div>
    </li>
  );
};
