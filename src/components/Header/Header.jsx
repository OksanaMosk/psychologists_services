import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, NavLink } from 'react-router-dom';
import { logOutThunk } from 'redux/auth/auth.reducer';
import { selectUserData, selectAuthenticated } from 'redux/auth/auth.selector';
import ModalWindow from '../ModalWindow/ModalWindow';
import { useTheme } from '../Themes/Themes';

import css from './Header.module.css';

export const Header = ({ values }) => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const userData = useSelector(selectUserData);
  const location = useLocation();
  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);
  const { theme, setTheme } = useTheme();

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

  const handleGreenThemeClick = () => {
    setTheme('green');
  };
  const handleBlueThemeClick = () => {
    setTheme('blue');
  };
  const handleOrangeThemeClick = () => {
    setTheme('orange');
  };

  return (
    <div className={css.header}>
      <div className={css.mainTit}>
        <h3 className={css.mainTitle}>
          <span className={css.mainTitleSpan}>psychologists.</span>services
        </h3>
      </div>
      <div className={css.links}>
        <NavLink className={css.toLink} to="/">
          Home
        </NavLink>
        <NavLink className={css.toLink} to="/catalog">
          Psychologists
        </NavLink>

        {authenticated && (
          <NavLink className={css.toLink} to="/favorites">
            Faforites cars
          </NavLink>
        )}
      </div>

      {authenticated ? (
        <>
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

      <div>
        <button onClick={handleGreenThemeClick}>Green</button>
        <button onClick={handleBlueThemeClick}>Blue</button>
        <button onClick={handleOrangeThemeClick}>Orange</button>
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
