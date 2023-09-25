import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const poolTypesRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx }) => {
    try {
      const poolTypes = await ctx.prisma.poolType.findMany();

      return poolTypes;
    } catch (error) {
      throw new Error("Failed to get pool types");
    }
  }),
});
