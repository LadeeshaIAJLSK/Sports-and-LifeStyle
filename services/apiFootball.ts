// services/apiFootball.ts
// API-Football (RapidAPI) - Better coverage for football/soccer matches

const API_KEY = '7cc55c0198msh42e5c5e78e10c11p16a3f2jsnfd1d88c1a3c9'; // Free tier key
const BASE_URL = 'https://api-football-v3.p.rapidapi.com';

const headers = {
  'x-rapidapi-key': API_KEY,
  'x-rapidapi-host': 'api-football-v3.p.rapidapi.com',
};

export interface FootballTeam {
  id: number;
  name: string;
  code: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
}

export interface FootballFixture {
  id: number;
  referee: string;
  timezone: string;
  date: string;
  timestamp: number;
  periods: {
    first: number;
    second: number;
  };
  venue: {
    id: number;
    name: string;
    city: string;
  };
  status: {
    long: string;
    short: string;
    elapsed: number;
  };
}

export interface FootballScore {
  halftime: {
    home: number;
    away: number;
  };
  fulltime: {
    home: number;
    away: number;
  };
  extratime: {
    home: number;
    away: number;
  };
  penalty: {
    home: number;
    away: number;
  };
}

export interface FootballMatch {
  fixture: FootballFixture;
  league: {
    id: number;
    name: string;
    country: string;
    logo: string;
    flag: string;
    season: number;
    round: string;
  };
  teams: {
    home: FootballTeam & { goals: number };
    away: FootballTeam & { goals: number };
  };
  goals: {
    home: number;
    away: number;
  };
  score: FootballScore;
  events: any[];
  lineups: any[];
  statistics: any[];
  players: any[];
}

export class ApiFootball {
  // Get fixtures for today and next 7 days
  async getUpcomingFixtures(days: number = 7): Promise<FootballMatch[]> {
    try {
      const allMatches: FootballMatch[] = [];
      const today = new Date();

      // Fetch for multiple days
      for (let i = 0; i < days; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() + i);
        const dateStr = date.toISOString().split('T')[0];

        try {
          const url = `${BASE_URL}/fixtures?date=${dateStr}&league=39,140,135,78,61,2,3,4,5&season=2024&status=NS,1H,HT,2H,ET,P,FT`;
          console.log('Fetching from:', url);
          
          const response = await fetch(url, { headers });
          
          console.log('Response status:', response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('API response:', data);
            
            if (data.response && Array.isArray(data.response)) {
              console.log(`Found ${data.response.length} matches for ${dateStr}`);
              allMatches.push(...data.response);
            }
          } else {
            console.error('API Error:', response.status, response.statusText);
            const text = await response.text();
            console.error('Error response:', text);
          }
        } catch (err) {
          console.error(`Error fetching fixtures for ${dateStr}:`, err);
          continue;
        }
      }

      console.log('Total matches fetched:', allMatches.length);
      return allMatches;
    } catch (error) {
      console.error('Error fetching upcoming fixtures:', error);
      return [];
    }
  }

  // Get live fixtures (currently playing)
  async getLiveFixtures(): Promise<FootballMatch[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/fixtures?live=all&league=39,140,135,78,61,2,3,4,5`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.response || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching live fixtures:', error);
      return [];
    }
  }

  // Get fixtures by league and season
  async getLeagueFixtures(leagueId: number, season: number, last: number = 20): Promise<FootballMatch[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/fixtures?league=${leagueId}&season=${season}&last=${last}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.response || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching league fixtures:', error);
      return [];
    }
  }

  // Get team details
  async getTeamDetails(teamId: number): Promise<FootballTeam | null> {
    try {
      const response = await fetch(`${BASE_URL}/teams?id=${teamId}`, { headers });

      if (response.ok) {
        const data = await response.json();
        return data.response?.[0]?.team || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching team details:', error);
      return null;
    }
  }

  // Search teams by name
  async searchTeams(teamName: string): Promise<FootballTeam[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/teams?search=${encodeURIComponent(teamName)}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.response?.map((item: any) => item.team) || [];
      }
      return [];
    } catch (error) {
      console.error('Error searching teams:', error);
      return [];
    }
  }

  // Get fixture details
  async getFixtureDetails(fixtureId: number): Promise<FootballMatch | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/fixtures?id=${fixtureId}`,
        { headers }
      );

      if (response.ok) {
        const data = await response.json();
        return data.response?.[0] || null;
      }
      return null;
    } catch (error) {
      console.error('Error fetching fixture details:', error);
      return null;
    }
  }

  // Convert API-Football match to common format
  static convertToEvent(match: FootballMatch): any {
    return {
      idEvent: match.fixture.id.toString(),
      strEvent: `${match.teams.home.name} vs ${match.teams.away.name}`,
      strHomeTeam: match.teams.home.name,
      strAwayTeam: match.teams.away.name,
      intHomeScore: match.goals.home,
      intAwayScore: match.goals.away,
      strLeague: match.league.name,
      dateEvent: match.fixture.date.split('T')[0],
      strTime: new Date(match.fixture.date).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      strHomeTeamBadge: match.teams.home.logo,
      strAwayTeamBadge: match.teams.away.logo,
      strVenue: match.fixture.venue?.name || 'TBD',
      strStatus: match.fixture.status.long,
    };
  }
}

export class ApiFootballClass extends ApiFootball {}

export const apiFootball = new ApiFootball();

// Popular league IDs:
export const LEAGUES = {
  PREMIER_LEAGUE: 39,
  LA_LIGA: 140,
  BUNDESLIGA: 78,
  SERIE_A: 135,
  LIGUE_1: 61,
  EREDIVISIE: 88,
  CHAMPIONS_LEAGUE: 1,
  EUROPA_LEAGUE: 3,
  WORLD_CUP: 1,
  MLS: 148,
};
