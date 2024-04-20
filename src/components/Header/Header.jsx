import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';
import { logOutThunk } from 'redux/auth/auth.reducer';
import { selectUserData, selectAuthenticated } from 'redux/auth/auth.selector';
import ModalWindow from '../ModalWindow/ModalWindow';

import css from './Header.module.css';

export const Header = ({ values }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const userData = useSelector(selectUserData);
  const location = useLocation();
  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);

  const onLogOut = () => {
    dispatch(logOutThunk());
  };

  const openRegisterModal = () => {
    if (!isLoginModalOpen) {
      setIsRegisterModalOpen(true);
    }
  };

  const openLoginModal = () => {
    if (!isRegisterModalOpen) {
      setIsLoginModalOpen(true);
    }
  };

  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div className={css.header}>
      <div className={css.links}>
        <NavLink className={css.toLink} to="/catalog">
          Catalog
        </NavLink>
        <NavLink className={css.toLink} to="/favorites">
          Faforites cars
        </NavLink>
        <div className={css.mainTit}>
          <h1 className={css.mainTitle}>Phonebook</h1>
        </div>

        {authenticated ? (
          <>
            <div className={css.menu}>
              <NavLink state={{ from: location }} to="/"></NavLink>

              <NavLink
                state={{ from: location }}
                className={css.title}
                to="/add"
              >
                Add contact
              </NavLink>
              <NavLink
                state={{ from: location }}
                className={css.title}
                to="/contacts"
              >
                My contacts
              </NavLink>
            </div>
            <span className={css.nameLogOutButton}>Hello, {userData.name}</span>
            <button className={css.logOutButton} onClick={onLogOut}>
              Log out
            </button>
          </>
        ) : (
          <div className={css.authorization}>
            <button className={css.titleAuthorization} onClick={openLoginModal}>
              Login
            </button>
            <button
              className={css.titleAuthorization}
              onClick={openRegisterModal}
            >
              Register
            </button>
          </div>
        )}
      </div>
      {isRegisterModalOpen && (
        <ModalWindow
          isOpen={isRegisterModalOpen}
          onClose={closeRegisterModal}
          type="register"
        />
      )}
      {isLoginModalOpen && (
        <ModalWindow
          isOpen={isLoginModalOpen}
          onClose={closeLoginModal}
          type="login"
        />
      )}
    </div>
  );
};
