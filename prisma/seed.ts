import { PrismaClient } from "@prisma/client";
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
        { id: 6, name: "postponed" },
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

const deleteData = async () => {
  await prisma.competitionStatus.deleteMany({});
  await prisma.seasonType.deleteMany({});
  await prisma.team.deleteMany({});
};

async function main() {
  await deleteData().then(() => console.log("Data deleted."));

  await seedCompetitionStatuses().then(() =>
    console.log("Competition statuses seeded.")
  );
  await seedTeams().then(() => console.log("Teams seeded."));
  await seedPoolTypes().then(() => console.log("Pool types seeded."));
  await seedSeasonTypes().then(() => console.log("Season types seeded."));
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
  });
