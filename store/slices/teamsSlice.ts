import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { Team, TeamDetails } from '@/types';
import { sportsAPI } from '../../services/sportsAPI';

interface TeamsState {
  teams: Team[];
  loading: boolean;
  error: string | null;
  selectedTeam: Team | null;
  teamDetails: TeamDetails | null;
}

const initialState: TeamsState = {
  teams: [],
  loading: false,
  error: null,
  selectedTeam: null,
  teamDetails: null,
};

export const fetchTeamsByLeague = createAsyncThunk(
  'teams/fetchByLeague',
  async (leagueName: string) => {
    const teams = await sportsAPI.getLeagueTeams(leagueName);
    return teams;
  }
);

export const fetchTeamDetails = createAsyncThunk(
  'teams/fetchDetails',
  async (teamId: string) => {
    const team = await sportsAPI.getTeamDetails(teamId);
    return team;
  }
);

export const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setSelectedTeam: (state, action) => {
      state.selectedTeam = action.payload;
    },
    clearSelectedTeam: (state) => {
      state.selectedTeam = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTeamsByLeague.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamsByLeague.fulfilled, (state, action) => {
        state.teams = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTeamsByLeague.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch teams';
      })
      .addCase(fetchTeamDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTeamDetails.fulfilled, (state, action) => {
        if (action.payload) {
          state.teamDetails = action.payload;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchTeamDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch team details';
      });
  },
});

export const { setSelectedTeam, clearSelectedTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
