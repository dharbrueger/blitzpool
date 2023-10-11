import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const getGamesByWeekAndYearInput = z.object({
  week: z.string(),
  year: z.string(),
});

export const competitionsRouter = createTRPCRouter({
  getGamesByWeekAndYear: publicProcedure
    .input(getGamesByWeekAndYearInput)
    .query(async ({ ctx, input }) => {
      try {
        const { week, year } = input;
        const competitions = await ctx.prisma.competition.findMany({
          where: {
            week: {
              equals: week,
            },
            year: {
              equals: year,
            },
          },
        });

        if (!competitions) {
          throw new Error("Competitions not found");
        }

        return competitions;
      } catch (error) {
        throw new Error("Failed to retrieve pool");
      }
    }),
    getAllAvailableYearsAndWeeks: publicProcedure.query(async ({ ctx }) => {
      try {
        const years = await ctx.prisma.competition.findMany({
          distinct: ["year"],
          select: {
            year: true,
          },
        });

        const weeks = await ctx.prisma.competition.findMany({
          distinct: ["week"],
          select: {
            week: true,
          },
        });

        return {
          years,
          weeks,
        };
      } catch (error) {
        throw new Error("Failed to retrieve pool");
      }
    }),
});
