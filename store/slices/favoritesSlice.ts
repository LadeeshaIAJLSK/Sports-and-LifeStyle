import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Favorite {
  idTeam?: string;
  idPlayer?: string;
  strTeam?: string;
  strPlayer?: string;
  strTeamBadge?: string;
  strThumb?: string;
  strLeague?: string;
  strPosition?: string;
}

interface FavoritesState {
  favorites: Favorite[];
}

const initialState: FavoritesState = {
  favorites: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addFavorite: (state, action: PayloadAction<Favorite>) => {
      const exists = state.favorites.some(
        (fav) =>
          (fav.idTeam && fav.idTeam === action.payload.idTeam) ||
          (fav.idPlayer && fav.idPlayer === action.payload.idPlayer)
      );
      if (!exists) {
        state.favorites.push(action.payload);
      }
    },
    removeFavorite: (state, action: PayloadAction<Favorite>) => {
      state.favorites = state.favorites.filter(
        (fav) =>
          fav.idTeam !== action.payload.idTeam &&
          fav.idPlayer !== action.payload.idPlayer
      );
    },
    clearFavorites: (state) => {
      state.favorites = [];
    },
  },
});

export const { addFavorite, removeFavorite, clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;
