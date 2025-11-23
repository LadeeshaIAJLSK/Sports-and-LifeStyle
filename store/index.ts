import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import webStorage from '@/utils/webStorage';
import favoritesReducer from './slices/favoritesSlice';
import matchesReducer from './slices/matchesSlice';
import teamsReducer from './slices/teamsSlice';
import liveMatchesReducer from './slices/liveMatchesSlice';

const persistConfig = {
  key: 'root',
  storage: webStorage,
  whitelist: ['favorites'], // Only persist favorites
};

const persistedFavoritesReducer = persistReducer(persistConfig, favoritesReducer);

export const store = configureStore({
  reducer: {
    favorites: persistedFavoritesReducer,
    matches: matchesReducer,
    teams: teamsReducer,
    liveMatches: liveMatchesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;