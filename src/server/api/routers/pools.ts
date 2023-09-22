import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const poolInput = z.object({
  name: z.string(),
  typeId: z.string(),
  commissionerId: z.string(),
});


export const poolsRouter = createTRPCRouter({
  create: publicProcedure
    .input(poolInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const newPool = await ctx.prisma.pool.create({
          data: {
            name: input.name,
            type: {
              connect: {
                id: input.typeId,
              },
            },
            commissioner: {
              connect: {
                id: input.commissionerId,
              },
            },
          }
        });

        return newPool;
      } catch (error) {
        throw new Error("Failed to create pool");
      }
    }),
});
