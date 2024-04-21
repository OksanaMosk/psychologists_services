import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';
import { initializeApp } from 'firebase/app';

import 'firebase/auth';

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyC2ORNd2-m6x_zOTq36zeaulONhSWUtib4',
  authDomain: 'psychologists-c4877.firebaseapp.com',
  databaseURL:
    'https://psychologists-c4877-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'psychologists-c4877',
  storageBucket: 'psychologists-c4877.appspot.com',
  messagingSenderId: '314712337204',
  appId: '1:314712337204:web:3732457517c482a111d361',
  measurementId: 'G-974RYKDNRL',
};

initializeApp(firebaseConfig);

export const instance = axios.create({
  baseURL: 'https://connections-api.herokuapp.com/',
});

const setToken = token => {
  console.log('Setting token:', token);
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

export const registerThunk = createAsyncThunk(
  'auth/register',
  async (userData, thunkApi) => {
    const { email, password, uid } = userData;

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        uid
      );
      const user = userCredential.user;

      console.log('Registration successful:', user.email);
      // Додайте код для збереження токену або іншої необхідної інформації про користувача

      return { email: user.email, password: user.password, uid: user.uid };
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error code:', error.code); // Код помилки
      console.error('Error message:', error.message); // Повідомлення про помилку
      return thunkApi.rejectWithValue('Registration failed');
    }
  }
);

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (userData, thunkApi) => {
    const { email, password, uid } = userData;
    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password,
        uid
      );
      const user = userCredential.user;

      console.log('User signed in:', user);

      return { email: user.email, password: user.password, uid: user.uid };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error code:', error.code); // Код помилки
      console.error('Error message:', error.message);
      console.error('Error message:', error.name); // Повідомлення про помилку
      return thunkApi.rejectWithValue('Login failed');
    }
  }
);

export const refreshThunk = createAsyncThunk(
  'auth/refresh',
  async (_, thunkApi) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return null;

      const token = await user.getIdToken();
      setToken(token);

      // Відправляємо запит на сервер для оновлення даних користувача
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyC2ORNd2-m6x_zOTq36zeaulONhSWUtib4`,
        {
          idToken: token,
        }
      );

      const { data } = response;

      // Повертаємо отримані дані користувача
      return data;
    } catch (error) {
      console.error('Refresh error:', error);
      console.error('Error code:', error.code); // Код помилки
      console.error('Error message:', error.message); // Повідомлення про помилку
      return thunkApi.rejectWithValue('Refresh failed');
    }
  }
);

export const logOutThunk = createAsyncThunk(
  'auth/logout',
  async (_, thunkApi) => {
    try {
      const auth = getAuth();
      await signOut(auth);

      // Очищення токену і даних користувача зі стану
      console.log('Logout successful');
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      return thunkApi.rejectWithValue('Logout failed');
    }
  }
);

const initialState = {
  isLoadingAuth: false,
  error: null,
  authenticated: false,
  token: null,
  userData: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: builder =>
    builder
      .addCase(loginThunk.fulfilled, (state, { payload }) => {
        state.authenticated = true;
        state.token = payload.token;
        state.userData = payload;
        state.isLoadingAuth = false;
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, { payload }) => {
        state.authenticated = true;
        state.token = payload.token;
        state.userData = payload;
        state.isLoadingAuth = false;
        state.error = null;
      })
      .addCase(refreshThunk.fulfilled, (state, { payload }) => {
        state.authenticated = true;
        state.userData = payload;
        state.isLoadingAuth = false;
        state.error = null;
      })
      .addCase(logOutThunk.fulfilled, state => {
        state.isLoadingAuth = false;
        state.error = null;
        state.authenticated = false;
        state.token = null;
        state.userData = null;
      })
      .addMatcher(
        isAnyOf(
          loginThunk.pending,
          registerThunk.pending,
          refreshThunk.pending,
          logOutThunk.pending
        ),
        state => {
          state.isLoadingAuth = true;
          state.error = null;
        }
      )
      .addMatcher(
        isAnyOf(
          loginThunk.rejected,
          registerThunk.rejected,
          refreshThunk.rejected,
          logOutThunk.rejected
        ),
        (state, { payload }) => {
          state.isLoadingAuth = false;
          state.error = payload;
        }
      ),
});

export const authReducer = authSlice.reducer;
