export type ESPN_Game = {
  competitions: ESPN_Competition[];
  uid: string;
  date: string;
  week: {
    number: number;
  };
  name: string;
  season: object;
  links: object[];
  id: string;
  shortName: string;
  status: {
    period: number;
    displayClock: string;
    clock: number;
    type: {
      name: string;
      description: string;
      id: string;
      state: string;
      completed: boolean;
      detail: string;
      shortDetail: string;
    };
  };
}

export type ESPN_Competition = {
  date: string;
  attendance: number;
  competitors: ESPN_Competitor[];
  conferenceCompetition: boolean;
  format: {
    regulation: {
      periods: number;
    };
  };
  id: string;
  neutralSite: boolean;
  odds: ESPN_Odd[];
  playByPlayAvailable: boolean;
  recent: boolean;
  startDate: string;
  status: {
    period: number;
    displayClock: string;
    clock: number;
    type: {
      name: string;
      description: string;
      id: string;
      state: string;
      completed: boolean;
      detail: string;
      shortDetail: string;
    };
  };
  timeValid: boolean;
  type: {
    id: string;
    abbreviation: string;
  };
  uid: string;
  venue: ESPN_Venue;
}
export type ESPN_Competitor = {
  uid: string;
  homeAway: string;
  score: string;
  id: string;
  winner: boolean;
  team: {
    name: string;
    location: string;
    logo: string;
  }
}

type ESPN_Odd = {
  overUnder: number;
  provider: {
    name: string;
    id: string;
    priority: number;
  };
}

type ESPN_Venue = {
  address: {
    city: string;
    state: string;
  };
  fullName: string;
  // Add more properties as needed
}

export type ESPN_Data = {
  content: {
    schedule: {
      [key: string]: {
        games: ESPN_Game[];
      };
    };
    defaults: ESPN_Defaults;
    calendar: Calendar;
  };
}

export type ESPN_Schedule = {
  [key: string]: {
    games: ESPN_Game[];
  };
}

export type ESPN_Defaults = {
  week: number;
  year: number;
  seasonType: number;
}

export type ESPN_CalendarEntry = {
  endDate: string;
  alternateLabel: string;
  label: string;
  detail: string;
  value: string;
  startDate: string;
}

export type ESPN_CalendarPeriod = {
  entries: ESPN_CalendarEntry[];
  endDate: string;
  label: string;
  value: string;
  startDate: string;
}

export type Calendar = ESPN_CalendarPeriod[];
