import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { logOutThunk } from 'redux/auth/auth.reducer';
import { selectUserData, selectAuthenticated } from 'redux/auth/auth.selector';
import ModalWindow from '../ModalWindow/ModalWindow';
import { useTheme } from '../Themes/Themes';
import { useNavigate } from 'react-router-dom';
import css from './Header.module.css';

export const Header = removeItem => {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const userData = useSelector(selectUserData);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);
  const { setTheme } = useTheme();

  const onLogOut = () => {
    dispatch(logOutThunk());
    localStorage.removeItem('favorites');
    navigate('/');
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

  const location = useLocation();
  const [currentPath, setCurrentPath] = useState(location.pathname);

  useEffect(() => {
    setCurrentPath(location.pathname);
  }, [location]);

  return (
    <div className={css.header}>
      <div className={css.mainTit}>
        <h3 className={css.mainTitle}>
          <span className={css.mainTitleSpan}>psychologists.</span>services
        </h3>
      </div>
      <div className={css.links}>
        <NavLink
          to="/"
          className={`${currentPath === '/' ? css.activeLink : css.toLink}`}
        >
          Home
        </NavLink>
        <NavLink
          className={`${
            currentPath === '/psychologists' ? css.activeLink : css.toLink
          }`}
          to="/psychologists"
        >
          Psychologists
        </NavLink>

        {authenticated && (
          <NavLink
            className={`${
              currentPath === '/favorites' ? css.activeLink : css.toLink
            }`}
            to="/favorites"
          >
            Faforites
          </NavLink>
        )}
      </div>
      <div className={css.left}>
        {authenticated ? (
          <div className={css.auth}>
            <svg
              className={css.log}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4C13.0609 4 14.0783 4.42143 14.8284 5.17157C15.5786 5.92172 16 6.93913 16 8C16 9.06087 15.5786 10.0783 14.8284 10.8284C14.0783 11.5786 13.0609 12 12 12C10.9391 12 9.92172 11.5786 9.17157 10.8284C8.42143 10.0783 8 9.06087 8 8C8 6.93913 8.42143 5.92172 9.17157 5.17157C9.92172 4.42143 10.9391 4 12 4ZM12 14C16.42 14 20 15.79 20 18V20H4V18C4 15.79 7.58 14 12 14Z"
                fill="#FBFBFB"
              />
            </svg>

            {authenticated && (
              <span className={css.nameLogOutButton}>{userData.name}</span>
            )}
            <button className={css.logOutButton} onClick={onLogOut}>
              Log out
            </button>
          </div>
        ) : (
          <div className={css.authorization}>
            <button className={css.login} onClick={openLoginModal}>
              Log In
            </button>
            <button className={css.register} onClick={openRegisterModal}>
              Registration
            </button>
          </div>
        )}
        <div className={css.theme}>
          <button
            className={css.greenTheme}
            onClick={handleGreenThemeClick}
          ></button>
          <button
            className={css.blueTheme}
            onClick={handleBlueThemeClick}
          ></button>
          <button
            className={css.orangeTheme}
            onClick={handleOrangeThemeClick}
          ></button>
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
    </div>
  );
};
