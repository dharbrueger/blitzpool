import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const getAllPicksForPoolMemberByYearAndWeekInput = z.object({
  membershipId: z.string(),
  poolId: z.string(),
  year: z.string(),
  week: z.string(),
});

export const picksRouter = createTRPCRouter({
  getAllPicksForPoolMemberByYearAndWeek: publicProcedure
    .input(getAllPicksForPoolMemberByYearAndWeekInput)
    .query(async ({ ctx, input }) => {
      try {
        const { membershipId, poolId } = input;
        const picks = await ctx.prisma.pick.findMany({
          where: {
            membershipId: {
              equals: membershipId,
            },
            poolId: {
              equals: poolId,
            },
            competition: {
              year: {
                equals: input.year,
              },
              week: {
                equals: input.week,
              },
            },
          },
        });


        if (!picks) {
          throw new Error("Picks not found");
        }

        return picks;
      } catch (error) {
        throw new Error("Failed to retrieve picks");
      }
    }),
});
