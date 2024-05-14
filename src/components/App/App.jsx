import { Route, Routes } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { refreshThunk } from 'redux/auth/auth.reducer';
import HomePage from 'pages/HomePage/HomePage';
import Psychologists from 'pages/Psychologists/Psychologists ';
import FavoritesPage from 'pages/FavoritesPage/FavoritesPage';

import PrivateRoute from './PrivateRoute';
import Layout from 'components/Layout/Layout';
import css from './App.module.css';
import { selectAuthenticated } from 'redux/auth/auth.selector';

import NotFoundPage from 'pages/NotFoundPage/NotFoundPage';
import * as ROUTES from '../constants/routes';

const appRoutes = [
  {
    path: ROUTES.HOME_ROUTE,
    element: <HomePage />,
  },
  {
    path: ROUTES.FAVORITES_ROUTE,
    element: (
      <PrivateRoute>
        <FavoritesPage />
      </PrivateRoute>
    ),
  },
  {
    path: ROUTES.PSYCHOLOGISTS_ROUTE,
    element: <Psychologists />,
  },

  {
    path: ROUTES.NOTFOUNDPPAGE_ROUTE,
    element: <NotFoundPage />,
  },
];

export const App = () => {
  const dispatch = useDispatch();
  const authenticated = useSelector(selectAuthenticated);
  useEffect(() => {
    if (authenticated) {
      dispatch(refreshThunk(authenticated));
    }
  }, [authenticated, dispatch]);

  return (
    <Layout className={css.layout}>
      <Routes>
        <Route path="*" element={<NotFoundPage />} />
        {appRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Layout>
  );
};
