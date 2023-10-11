import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import type { ESPN_Data, ESPN_Defaults } from "~/types/espn";
import moment from "moment";

export type GameForDisplay = {
  id: string;
  date: string;
  status: string;
  stadium: string;
  homeTeamName: string;
  homeTeamLocation: string;
  awayTeamName: string;
  awayTeamLocation: string;
  homeTeamScore: number;
  awayTeamScore: number;
};

export type GamesForDisplayGroupedByWeek = {
  [key: string]: GameForDisplay[];
};

export type ScheduleForDisplay = {
  week: string;
  year: string;
  groupedGames: GamesForDisplayGroupedByWeek;
};

function getDayOfWeekName(dayOfWeek: number) {
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return dayNames[dayOfWeek];
}

type GroupGamesByDayProps = {
  games: GameForDisplay[];
}

const groupGamesByDay = ({ games }: GroupGamesByDayProps) => {
  if (games.length === 0) return {} as GamesForDisplayGroupedByWeek;

  const groupedGames: GamesForDisplayGroupedByWeek = {
    Thursday: [],
    Sunday: [],
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Friday: [],
    Saturday: [],
  };

  games.forEach((game) => {
    const numericDayOfWeek = moment(game.date).day();
    const dayOfWeekName = getDayOfWeekName(numericDayOfWeek);

    groupedGames[dayOfWeekName ?? "Unknown"]?.push(game);
  });

  return groupedGames;
};

export const schedulesRouter = createTRPCRouter({
  getCurrentWeekAndYear: publicProcedure.query(async () => {
    try {
      const ESPN_SCHEDULE_URL = process.env.ESPN_SCHEDULE_URL;

      if (!ESPN_SCHEDULE_URL) return;

      const res = await fetch(`${ESPN_SCHEDULE_URL}?xhr=1`);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data: ESPN_Data = (await res.json()) as ESPN_Data;
      const defaultData: ESPN_Defaults = data.content.defaults ?? {} as ESPN_Defaults;

      return defaultData;
    } catch (error) {
      throw new Error("Failed to fetch data");
    }
  }),
  getScheduleForDisplay: publicProcedure
    .input(
      z.object({
        year: z.string(),
        week: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const { year, week } = input;
      try {
        const games = await ctx.prisma.competition.findMany({
          where: {
            year: {
              equals: year,
            },
            week: {
              equals: week,
            },
          },
          include: {
            competitors: true,
            competitionStatus: true,
          },
        });

        if (games.length > 0) {
          const gamesForDisplay: GameForDisplay[] = games.map((game) => {
            const { id, date, stadium, competitionStatus, competitors } = game;
            const homeTeam = competitors.find((c) => c.homeAway === "home");
            const awayTeam = competitors.find((c) => c.homeAway === "away");

            const homeTeamScore = homeTeam?.score ?? 0;
            const awayTeamScore = awayTeam?.score ?? 0;

            const homeTeamLocation = homeTeam?.location ?? "Unknown";
            const awayTeamLocation = awayTeam?.location ?? "Unknown";

            const homeTeamName = homeTeam?.name ?? "Unknown";
            const awayTeamName = awayTeam?.name ?? "Unknown";

            return {
              id,
              date,
              status: competitionStatus.name,
              stadium,
              homeTeamName,
              awayTeamName,
              homeTeamLocation,
              awayTeamLocation,
              homeTeamScore,
              awayTeamScore,
            } as GameForDisplay;
          });

          const groupedGames = groupGamesByDay({ games: gamesForDisplay });

          return {
            year,
            week,
            groupedGames,
          } as ScheduleForDisplay;
        }

        return {} as ScheduleForDisplay;
      } catch (error) {
        throw new Error("Failed to fetch data");
      }
    }),
});
