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

import css from './PsychologistsElement.module.css';

export const PsychologistsElement = ({
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
  onRemoveFromFavorites,
  doctorsData,
  doctor,
}) => {
  const dispatch = useDispatch();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isMakeAnAppointment, setIsMakeAnAppointment] = useState(false);

  const favorites = useSelector(selectFavorites);

  const authenticated = useSelector(selectAuthenticated);

  const localStorageKeys = Object.keys(localStorage);

  // Знайти ключ, який містить інформацію про аутентифікацію
  const authKey = localStorageKeys.find(key => key.startsWith('auth1'));
  const authData = JSON.parse(localStorage.getItem(authKey));
  const userIdFromLocalStorage = authData?.uid;

  const collectionName = `favor_${userIdFromLocalStorage}`;
  const userIdFromCollection = collectionName.slice(6); // Обрізаємо перші 6 символів ("favor_")

  const userIdRedux = userIdFromCollection;

  useEffect(() => {
    if (favorites && userIdFromLocalStorage) {
      const isAlreadyFavorite = favorites.some(doctor => doctor.name === name);
      setIsFavorite(isAlreadyFavorite);
    }
  }, [favorites, name, userIdFromLocalStorage]);

  useEffect(() => {
    if (userIdFromLocalStorage) {
      const storedFavoritesFromLocalStorage =
        JSON.parse(localStorage.getItem(`favor_${userIdFromLocalStorage}`)) ||
        [];
      const isAlreadyFavorite = storedFavoritesFromLocalStorage.some(
        doctor => doctor.name === name
      );
      setIsFavorite(isAlreadyFavorite);
    }
  }, [name, userIdFromLocalStorage]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleToggleFavorite = () => {
    if (authenticated) {
      const doctorsData = {
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
        doctor,
      };
      if (isFavorite) {
        dispatch(removeFavorite({ userId: userIdRedux, doctorName: name }));
        setIsFavorite(false);
        console.log('🚀 ~ handleToggleFavorite ~ name:', name);
        if (doctor && doctor.name) {
          onRemoveFromFavorites(name);
        }
      } else {
        dispatch(addFavorite({ userId: userIdRedux, doctor: doctorsData }));
        setIsFavorite(true);
        console.log('🚀 ~ handleToggleFavorite ~ doctorsData :', doctorsData);
      }
      const favoritesFromLocalStorage =
        JSON.parse(localStorage.getItem(`favor_${userIdFromLocalStorage}`)) ||
        [];

      const updatedFavorites = isFavorite
        ? favoritesFromLocalStorage.filter(doctor => doctor.name !== name)
        : [...favoritesFromLocalStorage, doctorsData];
      localStorage.setItem(
        `favor_${userIdFromLocalStorage}`,
        JSON.stringify(updatedFavorites)
      );
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
      document.body.classList.add('body-no-scroll');
    }
  };

  const closeMakeAnAppointment = () => {
    setIsMakeAnAppointment(false);
    document.body.classList.remove('body-no-scroll');
  };

  return (
    <li
      className={`${css.item} ${imageLoaded ? css.imageLoaded : ''}`}
      key={name}
    >
      <div className={css.board}>
        <img
          className={css.name}
          src={avatar_url}
          alt={`doctor ${name}`}
          onLoad={handleImageLoad}
        />
        <svg
          className={css.svgName}
          width="10"
          height="10"
          viewBox="0 0 10 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="4.99992"
            cy="5.00009"
            r="4.66667"
            fill="#38CD3E"
            stroke="#FFF"
            strokeWidth="1"
          />
        </svg>
      </div>
      <div className={css.details}>
        <div className={css.titlePart}>
          <span className={css.titleSpan}>Psychologist</span>
          <div className={css.aboutPart}>
            <svg
              className={css.svgRating}
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.20021 4.69703L8 1.28579L9.79979 4.69703C9.95896 4.9987 10.2491 5.20947 10.5851 5.26762L14.3856 5.92519L11.6975 8.69103C11.4598 8.93563 11.3489 9.27666 11.3975 9.61427L11.9465 13.4319L8.48537 11.7301C8.17929 11.5795 7.82071 11.5795 7.51463 11.7301L4.05348 13.4319L4.6025 9.61427C4.65105 9.27666 4.54024 8.93563 4.30252 8.69103L1.6144 5.92519L5.41486 5.26762C5.75095 5.20947 6.04104 4.9987 6.20021 4.69703Z"
                fill="#FFC531"
                stroke="#FFC531"
                strokeWidth="1.2"
              />
            </svg>
            <p className={css.title}>Rating: {rating} | </p>
            <p className={css.price}>
              Price / 1 hour:<span> </span>
              <span className={css.priceSpan}>{price_per_hour}$</span>
            </p>
            <button
              className={css.imgButton}
              onClick={() =>
                handleToggleFavorite(doctorsData, userIdFromLocalStorage)
              }
              type="button"
            >
              <svg
                className={`${isFavorite ? css.favorIcon : css.nofavorIcon}`}
                width="26"
                height="22"
                viewBox="0 0 26 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.5766 2.99416C22.0233 2.44058 21.3663 2.00144 20.6433 1.70184C19.9202 1.40223 19.1452 1.24802 18.3625 1.24802C17.5798 1.24802 16.8047 1.40223 16.0817 1.70184C15.3586 2.00144 14.7016 2.44058 14.1483 2.99416L13 4.14249L11.8516 2.99416C10.734 1.87649 9.21809 1.2486 7.63747 1.2486C6.05685 1.2486 4.54097 1.87649 3.4233 2.99416C2.30563 4.11183 1.67773 5.62771 1.67773 7.20833C1.67773 8.78895 2.30563 10.3048 3.4233 11.4225L4.57163 12.5708L13 20.9992L21.4283 12.5708L22.5766 11.4225C23.1302 10.8692 23.5693 10.2122 23.869 9.48913C24.1686 8.76605 24.3228 7.99102 24.3228 7.20833C24.3228 6.42563 24.1686 5.65061 23.869 4.92753C23.5693 4.20445 23.1302 3.54748 22.5766 2.99416Z"
                  stroke="var( --primary-text-color)"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        <h3 className={css.maneName}>{name}</h3>
        <div className={css.aboutPart2}>
          <div className={css.about1}>
            <p className={css.experience}>
              Experience:{' '}
              <span className={css.experienceSpan}>{experience}</span>
            </p>
            <p className={css.experience}>
              License:<span className={css.experienceSpan}>{license}</span>
            </p>
          </div>
          <div className={css.about1}>
            <p className={css.experience}>
              Specialization:{' '}
              <span className={css.experienceSpan}>{specialization}</span>
            </p>
            <p className={css.experience}>
              Initial Consultation:{' '}
              <span className={css.experienceSpan}>{initial_consultation}</span>
            </p>
          </div>
        </div>
        <article className={css.article}>{about}</article>

        <div className={css.moreDescription} onClick={toggleDescription}>
          {showFullDescription ? (
            <div className={css.comments}>
              <ul className={css.reviewList}>
                {reviews.map((review, index) => (
                  <li key={index}>
                    <div className={css.itemRewiew}>
                      <div className={css.firstLet}>
                        {review.reviewer.slice(0, 1)}
                      </div>
                      <div className={css.let}>
                        <h4 className={css.reviewName}>{review.reviewer}</h4>
                        <div className={css.letRat}>
                          <svg
                            className={css.svgReview}
                            width="16"
                            height="15"
                            viewBox="0 0 16 15"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M6.20021 4.69703L8 1.28579L9.79979 4.69703C9.95896 4.9987 10.2491 5.20947 10.5851 5.26762L14.3856 5.92519L11.6975 8.69103C11.4598 8.93563 11.3489 9.27666 11.3975 9.61427L11.9465 13.4319L8.48537 11.7301C8.17929 11.5795 7.82071 11.5795 7.51463 11.7301L4.05348 13.4319L4.6025 9.61427C4.65105 9.27666 4.54024 8.93563 4.30252 8.69103L1.6144 5.92519L5.41486 5.26762C5.75095 5.20947 6.04104 4.9987 6.20021 4.69703Z"
                              fill="#FFC531"
                              stroke="#FFC531"
                              strokeWidth="1.2"
                            />
                          </svg>
                          <p className={css.reviewRating}>{review.rating}</p>
                        </div>
                      </div>
                    </div>
                    <p className={css.reviewComments}>{review.comment}</p>
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
                avatar_url={avatar_url}
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
