import { PrismaClient } from "@prisma/client";
import { type PrismaClientKnownRequestError } from "@prisma/client/runtime";
import {
  type Calendar,
  type ESPN_Data,
  type ESPN_CalendarPeriod,
  type ESPN_Schedule,
  type ESPN_Game,
} from "../src/types/espn";
const prisma = new PrismaClient();

type ESPN_TEAMS_RESPONSE = {
  id: string;
  slug: string;
  location: string;
  name: string;
  nickname: string;
  abbreviation: string;
  displayName: string;
  shortDisplayName: string;
  color: string;
  alternateColor: string;
  isActive: boolean;
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

const seedTeams = async () => {
  try {
    for (let index = 1; index <= 34; index++) {
      // hacky but lets us skip the AFC and NFC divisions that the espn api returns on this endpoint
      // so we don't get a bunch of ugly errors from the seed script
      if (index === 31 || index === 32) {
        continue;
      }

      const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2023/teams/${index}?lang=en&region=us`;

      const response = await fetch(url);
      const data = (await response.json()) as ESPN_TEAMS_RESPONSE;

      const {
        id,
        slug,
        location,
        name,
        nickname,
        abbreviation,
        displayName,
        shortDisplayName,
        color,
        alternateColor,
        isActive,
      } = data;

      await prisma.team.create({
        data: {
          id,
          slug,
          location,
          name,
          nickname,
          abbreviation,
          displayName,
          shortDisplayName,
          color,
          alternateColor,
          isActive,
        },
      });

      console.log(`${nickname} successfully seeded.`);
    }
  } catch (error) {
    console.error("Error seeding competitor:", error);
  }
};

const seedCompetitionStatuses = async () => {
  try {
    await prisma.competitionStatus.createMany({
      data: [
        { id: 1, name: "scheduled" },
        { id: 2, name: "in" },
        { id: 3, name: "final" },
        // { id: 4, name: "delayed" },
        { id: 5, name: "canceled" },
        { id: 6, name: "postponed"},
      ],
    });
  } catch (error) {
    console.error("Error seeding competition status:", error);
  }
};

const seedPoolTypes = async () => {
  try {
    await prisma.poolType.create({
      data: {
        name: "NFL Pick 'Em",
      },
    });
  } catch (error) {
    console.error("Error seeding pool type:", error);
  }
};

const seedSeasonTypes = async () => {
  try {
    await prisma.seasonType.createMany({
      data: [
        { id: 1, name: "pre" },
        { id: 2, name: "regular" },
        { id: 3, name: "post" },
        { id: 4, name: "off" },
      ],
    });
  } catch (error) {
    console.error("Error seeding season type:", error);
  }
};

const seedCompetitions = async () => {
  const startYear = 2002;
  const endYear = new Date().getFullYear();

  try {
    for (let year = startYear; year <= endYear; year++) {
      const calendar = await getCalendarByYear(year.toString());
      if (!calendar) continue;
  
      const periods = calendar.length - 1;
  
      for (let index = 0; index <= periods; index++) {
        const period = calendar[index] as ESPN_CalendarPeriod | undefined;
        if (!period) continue;
  
        const seasonType = period?.value ?? "1";
        const periodEntries = period?.entries;
  
        if (!periodEntries || seasonType !== "2") continue;
  
        const numberOfWeeks = periodEntries.length;
  
        for (let weekNumber = 1; weekNumber <= numberOfWeeks; weekNumber++) {
          console.log(`Seeding year: ${year} week: ${weekNumber}`);
          const data = await getFootballDataWithQuery(
            year.toString(),
            weekNumber.toString(),
            seasonType
          );
          if (!data) continue;
  
          const schedule: ESPN_Schedule = data.content?.schedule || {};
  
          const games: ESPN_Game[] = [];
          for (const key in schedule) {
            if (schedule[key]?.games) {
              games.push(...(schedule[key]?.games || []));
            }
          }
  
          for (const game of games) {
            let competition;
  
            try {
              competition = await prisma.competition.create({
                data: {
                  date: game.date,
                  year: year.toString(),
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
              const errorString = `Year: ${year} Week: ${weekNumber} Season Type: ${seasonType}. Error seeding competition: ${errorMessage.message}.`;
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
              const errorString = `Year: ${year} Week: ${weekNumber} Season Type: ${seasonType}. Error seeding competitor for competition ${competition.id}: ${errorMessage.message}.`;
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
            } catch (e) {
              const errorMessage = e as PrismaClientKnownRequestError;
              const errorString = `Year: ${year} Week: ${weekNumber} Season Type: ${seasonType}. Error seeding competitor for competition ${competition.id}: ${errorMessage.message}.`;
              console.error(errorString);
              continue;
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error seeding competitions:", error);
  }
};

const deleteData = async () => {
  await prisma.competitor.deleteMany({});
  await prisma.competition.deleteMany({});
  await prisma.competitionStatus.deleteMany({});
  await prisma.seasonType.deleteMany({});
  await prisma.poolType.deleteMany({});
  await prisma.team.deleteMany({});
};

async function main() {
  await deleteData().then(() => console.log("Data deleted."));

  await seedCompetitionStatuses().then(() => console.log("Competition statuses seeded."));
  await seedTeams().then(() => console.log("Teams seeded."));
  await seedPoolTypes().then(() => console.log("Pool types seeded."));
  await seedSeasonTypes().then(() => console.log("Season types seeded."));
  // await seedCompetitions().then(() => console.log("Competitions seeded."));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
