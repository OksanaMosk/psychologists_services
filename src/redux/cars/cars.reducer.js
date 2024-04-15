import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import axios from 'axios';

export const fetchCars = createAsyncThunk(
  'cars/fetchAll',
  async ({ page = 1, limit = 12 }, thunkApi) => {
    try {
      const { data: allCars } = await axios.get(
        `https://65e85b1c4bb72f0a9c4f090a.mockapi.io/cars`
      );

      const { data: limitedCars } = await axios.get(
        `https://65e85b1c4bb72f0a9c4f090a.mockapi.io/cars?limit=${limit}&page=${page}`
      );

      return { allCars, limitedCars };
    } catch (err) {
      return thunkApi.rejectWithValue(err.message);
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
