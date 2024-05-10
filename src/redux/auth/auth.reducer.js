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
  instance.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const saveAuthDataToLocalstorage = ({ email, password, uid }) => {
  localStorage.setItem('auth1', JSON.stringify({ email, password, uid }));
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
      const payload = {
        email: user.email,
        password: user.password,
        uid: user.uid,
      };
      saveAuthDataToLocalstorage(payload);
      return { email: user.email, password: user.password, uid: user.uid };
    } catch (error) {
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

      const payload = {
        email: user.email,
        password: user.password,
        uid: user.uid,
      };
      saveAuthDataToLocalstorage(payload);

      return payload;
    } catch (error) {
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

      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyC2ORNd2-m6x_zOTq36zeaulONhSWUtib4`,
        {
          idToken: token,
        }
      );

      const { data } = response;

      return data;
    } catch (error) {
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

      localStorage.removeItem('auth');

      return { success: true };
    } catch (error) {
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
