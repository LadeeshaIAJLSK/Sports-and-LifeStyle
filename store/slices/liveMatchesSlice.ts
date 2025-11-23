import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { sportsAPI } from '@/services/sportsAPI';

interface Match {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: number;
  intAwayScore: number;
  strLeague: string;
  dateEvent: string;
  strTime: string;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strVenue: string;
  strStatus: string;
}

interface LiveMatchesState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  lastUpdated: number | null;
}

const initialState: LiveMatchesState = {
  matches: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Thunk to fetch live matches from TheSportsDB
export const fetchLiveMatches = createAsyncThunk(
  'liveMatches/fetchLiveMatches',
  async () => {
    try {
      console.log('Starting to fetch live matches...');
      
      // Get today and next 7 days
      const allMatches: any[] = [];
      const today = new Date();
      
      // Popular leagues to fetch from
      const leagues = [
        'English Premier League',
        'La Liga',
        'Bundesliga', 
        'Serie A',
        'Ligue 1',
        'Dutch Eredivisie',
        'UEFA Champions League',
      ];
      
      // Fetch matches for today and next 6 days
      for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];
        
        console.log(`Fetching matches for ${dateStr}`);
        
        for (const league of leagues) {
          try {
            const matches = await sportsAPI.getEventsByDate(dateStr, undefined, league);
            if (matches && Array.isArray(matches)) {
              console.log(`Found ${matches.length} matches for ${league} on ${dateStr}`);
              allMatches.push(...matches);
            }
          } catch (err) {
            console.error(`Error fetching ${league}:`, err);
            continue;
          }
        }
      }
      
      console.log('Total matches fetched:', allMatches.length);
      
      // Remove duplicates based on idEvent
      const uniqueMatches = Array.from(
        new Map(allMatches.map((m: any) => [m.idEvent, m])).values()
      );
      
      console.log('Unique matches:', uniqueMatches.length);
      
      // Sort by date (upcoming first)
      return (uniqueMatches as any[]).sort((a, b) => {
        const dateA = new Date(a.dateEvent).getTime();
        const dateB = new Date(b.dateEvent).getTime();
        return dateA - dateB;
      });
    } catch (error) {
      console.error('Error fetching matches:', error);
      throw error;
    }
  }
);

const liveMatchesSlice = createSlice({
  name: 'liveMatches',
  initialState,
  reducers: {
    clearLiveMatches: (state) => {
      state.matches = [];
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveMatches.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveMatches.fulfilled, (state, action) => {
        state.matches = action.payload;
        state.loading = false;
        state.error = null;
        state.lastUpdated = Date.now();
      })
      .addCase(fetchLiveMatches.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch live matches';
      });
  },
});

export const { clearLiveMatches } = liveMatchesSlice.actions;
export default liveMatchesSlice.reducer;