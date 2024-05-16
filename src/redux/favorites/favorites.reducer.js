import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    favorites: {},
    userId: null,
};

export const favoritesSlice = createSlice({
    name: 'favorites',
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            const { userId, doctor } = action.payload;
            const favoritesForUser = state.favorites[userId] || [];
            console.log('🚀 ~ favoritesForUser:', favoritesForUser);
            const isAlreadyFavorite = favoritesForUser.some(
                favorite => favorite.name === doctor.name
            );
            if (!isAlreadyFavorite) {
                favoritesForUser.push(doctor);
                state.favorites[userId] = favoritesForUser;
            } else {
                console.log('This doctor is already in favorites!');
            }
        },
        removeFavorite: (state, action) => {
            const { userId, doctorName } = action.payload;
            const favoritesForUser = state.favorites[userId] || [];
            console.log('🚀 ~ favoritesForUser:', favoritesForUser);
            const updatedFavorites = favoritesForUser.filter(
                doctor => doctor.name !== doctorName
            );
            state.favorites[userId] = updatedFavorites;
        },
        setUserId: (state, action) => {
            state.userId = action.payload;
        },
    },
});

export const { addFavorite, removeFavorite, setUserId } =
favoritesSlice.actions;

export default favoritesSlice.reducer;