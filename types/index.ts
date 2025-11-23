export interface BaseTeam {
  idTeam: string;
  strTeam: string;
  strTeamBadge: string;
  strLeague: string;
  strTeamLogo?: string;
  strTeamBanner?: string;
}

export interface Team extends BaseTeam {
  strDescriptionEN?: string;
  strStadium?: string;
  strStadiumThumb?: string;
  strStadiumDescription?: string;
  strWebsite?: string;
  strFacebook?: string;
  strTwitter?: string;
  strInstagram?: string;
  intFormedYear?: string;
  strCountry?: string;
}

export interface TeamDetails extends Team {
  strDescriptionDE?: string;
  strDescriptionFR?: string;
  strDescriptionIT?: string;
  strDescriptionJP?: string;
  strDescriptionRU?: string;
  strDescriptionES?: string;
  strGender?: string;
  strSport?: string;
  strLeague2?: string;
  strLeague3?: string;
  strLeague4?: string;
  strLeague5?: string;
  strLeague6?: string;
  strLeague7?: string;
  strDivision?: string;
  strManager?: string;
  strKeywords?: string;
  strRSS?: string;
  strStadiumLocation?: string;
  intStadiumCapacity?: string;
  strYoutube?: string;
}