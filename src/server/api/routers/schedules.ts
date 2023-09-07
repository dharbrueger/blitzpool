import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export interface Game {
  competitions: Competition[];
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

interface Competition {
  date: string;
  attendance: number;
  broadcasts: Broadcast[];
  competitors: Competitor[];
  conferenceCompetition: boolean;
  format: {
    regulation: {
      periods: number;
    };
  };
  id: string;
  neutralSite: boolean;
  odds: Odd[];
  playByPlayAvailable: boolean;
  recent: boolean;
  startDate: string;
  status: {
    period: number;
    displayClock: string;
    clock: number;
  };
  tickets: Ticket[];
  timeValid: boolean;
  type: {
    id: string;
    abbreviation: string;
  };
  uid: string;
  venue: Venue;
}

interface Broadcast {
  market: string;
  names: string[];
}

interface Competitor {
  uid: string;
  homeAway: string;
  score: string;
  // Add more properties as needed
}

interface Odd {
  overUnder: number;
  provider: {
    name: string;
    id: string;
    priority: number;
  };
  // Add more properties as needed
}

interface Ticket {
  summary: string;
  numberAvailable: number;
  // links: TicketLink[];
}

// interface TicketLink {
//   // Define the properties of a ticket link if necessary
// }

interface Venue {
  address: {
    city: string;
    state: string;
  };
  fullName: string;
  // Add more properties as needed
}

interface Data {
  content: {
    schedule: {
      [key: string]: {
        games: Game[];
      };
    };
  };
}

interface Schedule {
  [key: string]: {
    games: Game[];
  };
}

export const schedulesRouter = createTRPCRouter({
  getData: publicProcedure
    .input(
      z.object({
        year: z.string(),
        week: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { year, week } = input;
      try {
        const ESPN_SCHEDULE_URL = process.env.ESPN_SCHEDULE_URL;

        if (!ESPN_SCHEDULE_URL) return;

        const res = await fetch(
          `${ESPN_SCHEDULE_URL}?xhr=1&year=${year}&week=${week}`
        );
        if (!res.ok) {
          throw new Error("Failed to fetch data");
        }
        const data: Data = await res.json() as Data;
        const schedule: Schedule = data.content?.schedule || {};

        const games: Game[] = [];
        for (const key in schedule) {
          if (schedule[key]?.games) {
            games.push(...(schedule[key]?.games || []));
          }
        }

        if (games.length > 0) {
          return games;
        }

        return undefined;
      } catch (error) {
        throw new Error("Failed to fetch data");
      }
    }),
});
