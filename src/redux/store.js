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

import { doctorsReducer } from './doctors/doctors.reducer';
import favoritesReducer from './favorites/favorites.reducer';

const authConfig = {
  key: 'auth',
  storage,
  whitelist: ['token'],
};

const doctorsConfig = {
  key: 'doctors',
  storage,
  whitelist: ['doctors'],
};

const favoritesConfig = {
  key: 'favorites',
  version: 1,
  storage,
  whitelist: ['favorites'],
};

export const store = configureStore({
  reducer: {
    doctorsStore: persistReducer(doctorsConfig, doctorsReducer),
    favoritesStore: persistReducer(favoritesConfig, favoritesReducer),
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

persistor.purge(['favorites']);
