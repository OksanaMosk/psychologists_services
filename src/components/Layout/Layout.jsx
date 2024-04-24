import { Header } from '../Header/Header';

import css from './Layout.module.css';

import React from 'react';
import { useLocation } from 'react-router-dom'; // Імпорт хука з react-router-dom

const Layout = ({ children }) => {
  const location = useLocation();
  const isFirstPage = location.pathname === '/';

  return (
    <div
      className={`${css.container} ${
        isFirstPage ? css.firstPage : css.otherPage
      }`}
    >
      <Header />
      <main>{children}</main>
    </div>
  );
};

export default Layout;
