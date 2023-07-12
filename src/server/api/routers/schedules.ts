import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export interface Game {
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
