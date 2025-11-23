import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strStatus: string;
}

interface LiveMatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
}

const initialState: LiveMatchesState = {
  matches: [],
  loading: false,
  error: null,
};

export const fetchLiveMatches = createAsyncThunk(
  'liveMatches/fetchLiveMatches',
  async () => {
    const response = await fetch(
      'https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328'
    );
    const data = await response.json();
    return data.events || [];
  }
);

const liveMatchesSlice = createSlice({
  name: 'liveMatches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveMatches.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, action) => {
        state.loading = false;
        state.matches = action.payload;
      })
      .addCase(fetchLiveMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch matches';
      });
  },
});

export default liveMatchesSlice.reducer;
