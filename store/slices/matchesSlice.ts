import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Event } from '../../services/sportsAPI';
import { sportsAPI } from '../../services/sportsAPI';

interface MatchesState {
  upcoming: Event[];
  past: Event[];
  loading: boolean;
  error: string | null;
  selectedEvent: Event | null;
}

const initialState: MatchesState = {
  upcoming: [],
  past: [],
  loading: false,
  error: null,
  selectedEvent: null,
};

export const fetchUpcomingMatches = createAsyncThunk(
  'matches/fetchUpcoming',
  async (leagueId: string) => {
    const events = await sportsAPI.getNextLeagueEvents(leagueId);
    return events;
  }
);

export const fetchPastMatches = createAsyncThunk(
  'matches/fetchPast',
  async (leagueId: string) => {
    const events = await sportsAPI.getLastLeagueEvents(leagueId);
    return events;
  }
);

export const matchesSlice = createSlice({
  name: 'matches',
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUpcomingMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUpcomingMatches.fulfilled, (state, action) => {
        state.upcoming = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchUpcomingMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch upcoming matches';
      })
      .addCase(fetchPastMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPastMatches.fulfilled, (state, action) => {
        state.past = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchPastMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch past matches';
      });
  },
});

export const { setSelectedEvent, clearSelectedEvent } = matchesSlice.actions;

export default matchesSlice.reducer;
