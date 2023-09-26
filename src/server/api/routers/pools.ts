import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

const poolCreationInput = z.object({
  name: z.string(),
  private: z.boolean(),
  typeId: z.string(),
  commissionerId: z.string(),
});

const userPoolsInput = z.object({
  userId: z.string(),
});

export const poolsRouter = createTRPCRouter({
  create: publicProcedure
    .input(poolCreationInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const newPool = await ctx.prisma.pool.create({
          data: {
            name: input.name,
            private: input.private,
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
          },
        });

        await ctx.prisma.membership.create({
          data: {
            pool: {
              connect: {
                id: newPool.id,
              },
            },
            user: {
              connect: {
                id: input.commissionerId,
              },
            },
          },
        });

        return await ctx.prisma.pool.findMany({
          where: {
            members: {
              some: {
                userId: input.commissionerId,
              },
            },
          },
          include: {
            commissioner: true,
            type: true,
            members: true,
          },
        });
      } catch (error) {
        throw new Error("Failed to create pool");
      }
    }),
  publicList: publicProcedure.query(async ({ ctx }) => {
    try {
      const pools = await ctx.prisma.pool.findMany({
        where: {
          private: false,
        },
        include: {
          commissioner: true,
          type: true,
          members: true,
        },
      });

      return pools;
    } catch (error) {
      throw new Error("Failed to get pools");
    }
  }),
  userPools: publicProcedure
    .input(userPoolsInput)
    .query(async ({ ctx, input }) => {
      try {
        const pools = await ctx.prisma.pool.findMany({
          where: {
            members: {
              some: {
                userId: input.userId,
              },
            },
          },
          include: {
            commissioner: true,
            type: true,
            members: true,
          },
        });

        return pools;
      } catch (error) {
        throw new Error("Failed to get pools");
      }
    }),
});
