import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface ESPN_TEAMS_RESPONSE {
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
}

async function main() {
  await prisma.poolType.create({
    data: {
      name: "NFL Pick 'Em",
    },
  });
  
  try {
    for (let index = 1; index <= 34; index++) {
      // hacky but lets us skip the AFC and NFC divisions that the espn api returns on this endpoint
      // so we don't get a bunch of ugly errors from the seed script
      if (index === 31 || index === 32) {
        continue;
      }
      
      const url = `http://sports.core.api.espn.com/v2/sports/football/leagues/nfl/seasons/2023/teams/${index}?lang=en&region=us`;

      const response = await fetch(url);
      const data = await response.json() as ESPN_TEAMS_RESPONSE;

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

    console.log("Competitors successfully seeded.");
  } catch (error) {
    console.error("Error seeding competitor:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
