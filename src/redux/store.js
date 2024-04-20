import { configureStore } from '@reduxjs/toolkit';

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { authReducer } from './auth/auth.reducer';

import { carsReducer } from './cars/cars.reducer';
import favoritesReducer from './favorites/favorites.reducer';

const authConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

const carsConfig = {
  key: 'cars',
  storage,
  whitelist: ['cars'],
};

const favoritesConfig = {
  key: 'favorites',
  version: 1,
  storage,
  whitelist: ['favorites'],
};

export const store = configureStore({
  reducer: {
    carsStore: persistReducer(carsConfig, carsReducer),
    favoritesStore: (favoritesConfig, favoritesReducer),
    auth: persistReducer(authConfig, authReducer),
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
