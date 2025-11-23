import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Team } from '@/types';

interface FavoritesState {
  favorites: Team[];
}

interface FavoritesState {
  favorites: Team[];
}

const initialState: FavoritesState = {
  favorites: [],
};

export const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Team>) => {
      if (!state.favorites.some(team => team.idTeam === action.payload.idTeam)) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<Team>) => {
      state.favorites = state.favorites.filter(
        team => team.idTeam !== action.payload.idTeam
      );
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;

export default favoritesSlice.reducer;
