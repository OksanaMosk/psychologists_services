import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import axios from 'axios';
import { initializeApp } from 'firebase/app';

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

initializeApp(firebaseConfig, '[PSYCHOLOGISTS_APP]');

export const fetchDoctors = createAsyncThunk(
  'doctors/fetchAll',
  async (_, thunkApi) => {
    try {
      const databaseURL = firebaseConfig.databaseURL;

      const { data: allDoctors } = await axios.get(`${databaseURL}/.json`);

      return { allDoctors };
    } catch (err) {
      return thunkApi.rejectWithValue({ errorMessage: err.message });
    }
  }
);

const initialState = {
  doctors: [],
  isLoading: false,
  error: null,
};

const doctorsSlice = createSlice({
  name: 'doctors',
  initialState,
  extraReducers: builder =>
    builder
      .addCase(fetchDoctors.fulfilled, (state, { payload }) => {
        state.doctors = payload.allDoctors;
        state.isLoading = false;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchDoctors.pending), state => {
        state.isLoading = true;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchDoctors.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      }),
});

export const doctorsReducer = doctorsSlice.reducer;
