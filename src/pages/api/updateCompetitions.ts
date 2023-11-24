import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { type PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  type Calendar,
  type ESPN_Data,
  type ESPN_CalendarPeriod,
  type ESPN_Schedule,
  type ESPN_Game,
} from "../../types/espn";
import moment from "moment";
import Cors from "cors";

const cors = Cors({
  methods: ["POST", "GET", "HEAD"],
});

const prisma = new PrismaClient();

function runMiddleware(
  req: NextApiRequest,
  res: NextApiResponse,
  // eslint-disable-next-line @typescript-eslint/ban-types
  fn: Function
) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: unknown) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}

type ResponseData = {
  updatedCompetitionCount: number;
};

const ESPN_SCHEDULE_URL = process.env.ESPN_SCHEDULE_URL || "";

const getFootballDataWithQuery = async (
  year: string,
  week: string,
  seasonType: string
) => {
  if (!ESPN_SCHEDULE_URL)
    throw new Error("No ESPN_SCHEDULE_URL env variable set");

  const res = await fetch(
    `${ESPN_SCHEDULE_URL}?xhr=1&year=${year}&week=${week}&seasontype=${seasonType}`
  );
  if (!res.ok) {
    throw new Error(
      `Failed to fetch data for ${year} week ${week} for season type ${seasonType}. Error: ${res.statusText}`
    );
  }
  const data: ESPN_Data = (await res.json()) as ESPN_Data;

  return data;
};

const getCalendarByYear = async (year: string) => {
  if (!ESPN_SCHEDULE_URL)
    throw new Error("No ESPN_SCHEDULE_URL env variable set");

  const res = await fetch(`${ESPN_SCHEDULE_URL}?xhr=1&year=${year}`);
  if (!res.ok) {
    throw new Error(
      `Failed to fetch data for ${year}. Error: ${res.statusText}`
    );
  }
  const data: ESPN_Data = (await res.json()) as ESPN_Data;
  const calendar: Calendar = data.content?.calendar;

  return calendar;
};

const seedCompetitions = async () => {
  const currentYear = 2023;

  await prisma.competitor.deleteMany({
    where: { competition: { year: { equals: currentYear.toString() } } },
  });
  await prisma.competition.deleteMany({
    where: { year: { equals: currentYear.toString() } },
  });
  let updatedCompetitionCount = 0;

  try {
    const calendar = await getCalendarByYear(currentYear.toString());
    if (!calendar) return updatedCompetitionCount;

    const periods = calendar.length - 1;

    for (let index = 0; index <= periods; index++) {
      const period = calendar[index] as ESPN_CalendarPeriod | undefined;
      if (!period) continue;

      const seasonType = period?.value ?? "1";
      const periodEntries = period?.entries;

      if (!periodEntries || seasonType !== "2") continue;

      const numberOfWeeks = periodEntries.length;

      for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
        const data = await getFootballDataWithQuery(
          currentYear.toString(),
          weekNumber.toString(),
          seasonType
        );
        if (!data) continue;

        const schedule: ESPN_Schedule = data.content?.schedule || {};

        for (const key in schedule) {
          let competition;

          const games = schedule[key]?.games ?? [];

          for (const game of games) {
            try {
              competition = await prisma.competition.create({
                data: {
                  date: moment(key).utc().format(),
                  year: currentYear.toString(),
                  week: weekNumber.toString(),
                  stadium: game?.competitions[0]?.venue?.fullName ?? "",
                  competitionStatus: {
                    connect: {
                      id: +(game?.competitions[0]?.status?.type?.id ?? "2"), //eek again lol
                    },
                  },
                  seasonType: {
                    connect: {
                      id: +seasonType,
                    },
                  },
                },
              });
            } catch (e) {
              const errorMessage = e as PrismaClientKnownRequestError;
              const errorString = `Year: ${currentYear} Week: ${weekNumber} Season Type: ${seasonType}. Error updating competition: ${errorMessage.message}.`;
              console.error(errorString);
              continue;
            }

            const competitorOne = game.competitions[0]?.competitors[0];
            const competitorTwo = game.competitions[0]?.competitors[1];

            try {
              await prisma.competitor.create({
                data: {
                  homeAway: competitorOne?.homeAway ?? "",
                  score: competitorOne?.score ?? "0",
                  winner: competitorOne?.winner?.toString() ?? "false",
                  team: {
                    connect: {
                      id: competitorOne?.id ?? "",
                    },
                  },
                  name: competitorOne?.team?.name ?? "",
                  location: competitorOne?.team?.location ?? "",
                  competition: {
                    connect: {
                      id: competition.id,
                    },
                  },
                },
              });
            } catch (e) {
              const errorMessage = e as PrismaClientKnownRequestError;
              const errorString = `Year: ${currentYear} Week: ${weekNumber} Season Type: ${seasonType}. Error updating competitor for competition ${competition.id}: ${errorMessage.message}.`;
              console.error(errorString);
              continue;
            }

            try {
              await prisma.competitor.create({
                data: {
                  homeAway: competitorTwo?.homeAway ?? "",
                  score: competitorTwo?.score ?? "0",
                  winner: competitorTwo?.winner?.toString() ?? "false",
                  team: {
                    connect: {
                      id: competitorTwo?.id ?? "",
                    },
                  },
                  name: competitorTwo?.team?.name ?? "",
                  location: competitorTwo?.team?.location ?? "",
                  competition: {
                    connect: {
                      id: competition.id,
                    },
                  },
                },
              });
              updatedCompetitionCount++;
            } catch (e) {
              const errorMessage = e as PrismaClientKnownRequestError;
              const errorString = `Year: ${currentYear} Week: ${weekNumber} Season Type: ${seasonType}. Error updating competitor for competition ${competition.id}: ${errorMessage.message}.`;
              console.error(errorString);
              continue;
            }
          }
        }
      }
    }
    return updatedCompetitionCount;
  } catch (error) {
    console.error("Error seeding competitions:", error);
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  await runMiddleware(req, res, cors);

  const updatedCompetitionCount = (await seedCompetitions()) || 0;

  res.status(200).json({ updatedCompetitionCount });
}
