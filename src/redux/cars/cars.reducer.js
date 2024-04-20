import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import axios from 'axios'; // Import the functions you need from the SDKs you need
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

export const fetchCars = createAsyncThunk(
  'cars/fetchAll',
  async (_, thunkApi) => {
    try {
      const databaseURL = firebaseConfig.databaseURL;

      const { data: allCars } = await axios.get(`${databaseURL}/.json`);
      console.log('allCars: ', allCars);
      return { allCars };
    } catch (err) {
      return thunkApi.rejectWithValue({ errorMessage: err.message });
    }
  }
);

const initialState = {
  cars: [],
  isLoading: false,
  error: null,
};

const carsSlice = createSlice({
  name: 'cars',
  initialState,
  extraReducers: builder =>
    builder
      .addCase(fetchCars.fulfilled, (state, { payload }) => {
        state.cars = payload;
        state.isLoading = false;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchCars.pending), state => {
        state.isLoading = true;
        state.error = null;
      })

      .addMatcher(isAnyOf(fetchCars.rejected), (state, { payload }) => {
        state.isLoading = false;
        state.error = payload;
      }),
});

export const carsReducer = carsSlice.reducer;
