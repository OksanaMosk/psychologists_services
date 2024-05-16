import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';

import axios from 'axios';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: 'AIzaSyA-VagGRiwRIzeu_rYL_zlZyWDgihcsTK8',
    authDomain: 'psychologists-b9905.firebaseapp.com',
    databaseURL: 'https://psychologists-b9905-default-rtdb.europe-west1.firebasedatabase.app',
    projectId: 'psychologists-b9905',
    storageBucket: 'psychologists-b9905.appspot.com',
    messagingSenderId: '412338087284',
    appId: '1:412338087284:web:fb9a8bdbfa629ea32b3821',
    measurementId: 'G-JJR2V04BWM',
};

initializeApp(firebaseConfig, '[PSYCHOLOGISTS_APP]');

export const fetchDoctors = createAsyncThunk(
    'doctors/fetchAll',
    async(_, thunkApi) => {
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