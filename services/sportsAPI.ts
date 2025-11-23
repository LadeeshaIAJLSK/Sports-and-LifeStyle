// services/sportsAPI.ts

const BASE_URL = 'https://www.thesportsdb.com/api/v1/json/3';

export interface Team {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strTeamBanner?: string;
  strTeamJersey?: string;
  strTeamLogo?: string;
  strLeague: string;
  strSport: string;
  strDescriptionEN?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  strYoutube?: string;
  intFormedYear?: string;
}

export interface Event {
  idEvent: string;
  strEvent: string;
  strEventAlternate?: string;
  strFilename?: string;
  strSport: string;
  idLeague: string;
  strLeague: string;
  strSeason?: string;
  strDescriptionEN?: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore?: string;
  intAwayScore?: string;
  intRound?: string;
  strHomeTeamBadge?: string;
  strAwayTeamBadge?: string;
  strThumb?: string;
  strBanner?: string;
  dateEvent: string;
  strDate?: string;
  strTime?: string;
  strTimestamp?: string;
  strStatus?: string;
  strPostponed?: string;
  strVideo?: string;
}

export interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  strSport: string;
  strPosition?: string;
  strThumb?: string;
  strCutout?: string;
  strBanner?: string;
  strDescriptionEN?: string;
  dateBorn?: string;
  strNationality?: string;
  strHeight?: string;
  strWeight?: string;
  strNumber?: string;
}

export interface League {
  idLeague: string;
  strLeague: string;
  strSport: string;
  strLeagueAlternate?: string;
  strDivision?: string;
  strCurrentSeason?: string;
  intFormedYear?: string;
  strGender?: string;
  strCountry?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strYoutube?: string;
  strDescriptionEN?: string;
  strBadge?: string;
  strLogo?: string;
  strBanner?: string;
  strPoster?: string;
  strTrophy?: string;
}

class SportsAPI {
  // Search for teams
  async searchTeams(teamName: string): Promise<Team[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/searchteams.php?t=${encodeURIComponent(teamName)}`
      );
      const data = await response.json();
      return data.teams || [];
    } catch (error) {
      console.error('Error searching teams:', error);
      return [];
    }
  }

  // Get all teams in a league
  async getLeagueTeams(leagueName: string): Promise<Team[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/search_all_teams.php?l=${encodeURIComponent(leagueName)}`
      );
      const data = await response.json();
      return data.teams || [];
    } catch (error) {
      console.error('Error fetching league teams:', error);
      return [];
    }
  }

  // Get team details by ID
  async getTeamDetails(teamId: string): Promise<Team | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookupteam.php?id=${teamId}`);
      const data = await response.json();
      return data.teams?.[0] || null;
    } catch (error) {
      console.error('Error fetching team details:', error);
      return null;
    }
  }

  // Get last 15 events for a league
  async getLastLeagueEvents(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/eventspastleague.php?id=${leagueId}`
      );
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching past events:', error);
      return [];
    }
  }

  // Get next 15 events for a league
  async getNextLeagueEvents(leagueId: string): Promise<Event[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/eventsnextleague.php?id=${leagueId}`
      );
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching next events:', error);
      return [];
    }
  }

  // Search for events
  async searchEvents(eventName: string): Promise<Event[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/searchevents.php?e=${encodeURIComponent(eventName)}`
      );
      const data = await response.json();
      return data.event || [];
    } catch (error) {
      console.error('Error searching events:', error);
      return [];
    }
  }

  // Get event details by ID
  async getEventDetails(eventId: string): Promise<Event | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookupevent.php?id=${eventId}`);
      const data = await response.json();
      return data.events?.[0] || null;
    } catch (error) {
      console.error('Error fetching event details:', error);
      return null;
    }
  }

  // Get all players for a team
  async getTeamPlayers(teamId: string): Promise<Player[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/lookup_all_players.php?id=${teamId}`
      );
      const data = await response.json();
      return data.player || [];
    } catch (error) {
      console.error('Error fetching team players:', error);
      return [];
    }
  }

  // Search for players
  async searchPlayers(playerName: string): Promise<Player[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/searchplayers.php?p=${encodeURIComponent(playerName)}`
      );
      const data = await response.json();
      return data.player || [];
    } catch (error) {
      console.error('Error searching players:', error);
      return [];
    }
  }

  // Get player details by ID
  async getPlayerDetails(playerId: string): Promise<Player | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/lookupplayer.php?id=${playerId}`
      );
      const data = await response.json();
      return data.players?.[0] || null;
    } catch (error) {
      console.error('Error fetching player details:', error);
      return null;
    }
  }

  // Get all leagues
  async getAllLeagues(): Promise<League[]> {
    try {
      const response = await fetch(`${BASE_URL}/all_leagues.php`);
      const data = await response.json();
      return data.leagues || [];
    } catch (error) {
      console.error('Error fetching leagues:', error);
      return [];
    }
  }

  // Get league details by ID
  async getLeagueDetails(leagueId: string): Promise<League | null> {
    try {
      const response = await fetch(
        `${BASE_URL}/lookupleague.php?id=${leagueId}`
      );
      const data = await response.json();
      return data.leagues?.[0] || null;
    } catch (error) {
      console.error('Error fetching league details:', error);
      return null;
    }
  }

  // Get league table/standings
  async getLeagueTable(leagueId: string, season: string): Promise<any[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/lookuptable.php?l=${leagueId}&s=${season}`
      );
      const data = await response.json();
      return data.table || [];
    } catch (error) {
      console.error('Error fetching league table:', error);
      return [];
    }
  }

  // Get events on a specific date
  async getEventsByDate(date: string, sport?: string, league?: string): Promise<Event[]> {
    try {
      let url = `${BASE_URL}/eventsday.php?d=${date}`;
      if (sport) url += `&s=${encodeURIComponent(sport)}`;
      if (league) url += `&l=${encodeURIComponent(league)}`;
      
      const response = await fetch(url);
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching events by date:', error);
      return [];
    }
  }

  // Get events for a specific season
  async getSeasonEvents(leagueId: string, season: string): Promise<Event[]> {
    try {
      const response = await fetch(
        `${BASE_URL}/eventsseason.php?id=${leagueId}&s=${season}`
      );
      const data = await response.json();
      return data.events || [];
    } catch (error) {
      console.error('Error fetching season events:', error);
      return [];
    }
  }
}

// Export singleton instance
export const sportsAPI = new SportsAPI();

// Common league IDs for quick reference
export const LEAGUES = {
  PREMIER_LEAGUE: '4328',
  LA_LIGA: '4335',
  BUNDESLIGA: '4331',
  SERIE_A: '4332',
  LIGUE_1: '4334',
  NBA: '4387',
  NFL: '4391',
  MLB: '4424',
  NHL: '4380',
  UEFA_CHAMPIONS_LEAGUE: '4480',
};