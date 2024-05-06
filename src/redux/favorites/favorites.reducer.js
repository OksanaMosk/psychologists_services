import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action) => {
      const { name } = action.payload;
      const isAlreadyFavorite = state.favorites.some(
        doctor => doctor.name === name
      );
      console.log('🚀 ~  doctor:', name);
      if (!isAlreadyFavorite) {
        state.favorites.push(action.payload);
        console.log('🚀 ~   addFavorite. favorites:', state.favorites);
      } else console.log('This doctor is already in favorites!');
    },
    removeFavorite: (state, action) => {
      const updatedFavorites = state.favorites.filter(
        item => item.name !== action.payload.name
      );
      state.favorites = updatedFavorites;
      console.log('🚀 ~ updatedFavorites. favorites:', state.favorites);
    },
  },
});

export const { addFavorite, removeFavorite } = favoritesSlice.actions;

export default favoritesSlice.reducer;

// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   favorites: [],
// };

// export const favoritesSlice = createSlice({
//   name: 'favorites',
//   initialState,
//   reducers: {
//     addFavorite: (state, action) => {
//       state.favorites.push(action.payload);
//     },
//     removeFavorite: (state, action) => {
//       const indexToRemove = state.favorites.findIndex(
//         item => item.name === action.payload.name
//       );
//       if (indexToRemove !== -1) {
//         state.favorites.splice(indexToRemove, 1);
//       }
//     },
//     removeAllFavorites: state => {
//       state.favorites = [];
//     },
//   },
// });

// export const { addFavorite, removeFavorite, removeAllFavorites } =
//   favoritesSlice.actions;

// export default favoritesSlice.reducer;
