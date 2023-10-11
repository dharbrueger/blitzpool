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

const poolFindOneInput = z.object({
  id: z.string(),
});

const joinPoolInput = z.object({
  id: z.string(),
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
  findOne: publicProcedure
    .input(poolFindOneInput)
    .query(async ({ ctx, input }) => {
      try {
        const pool = await ctx.prisma.pool.findUnique({
          where: {
            id: input.id,
          },
          include: {
            commissioner: true,
            type: true,
            members: {
              include: {
                user: true,
              },
            },
          },
        });

        if (!pool) {
          throw new Error("Pool not found");
        }

        return pool;
      } catch (error) {
        throw new Error("Failed to retrieve pool");
      }
    }),
  joinPool: publicProcedure
    .input(joinPoolInput)
    .mutation(async ({ ctx, input }) => {
      try {
        // Assuming you've managed session and have user ID
        const userId = input.userId;
        const poolId = input.id;

        // Check if user is already a member
        const existingMembership = await ctx.prisma.membership.findFirst({
          where: {
            userId: userId,
            poolId: poolId,
          },
        });

        if (existingMembership) {
          throw new Error("You are already a member of this pool");
        }

        await ctx.prisma.membership.create({
          data: {
            userId: userId,
            poolId: poolId,
          },
        });

        return await ctx.prisma.pool.findMany({
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
      } catch (error) {
        throw new Error("Failed to retrieve pool");
      }
    }),
    deletePool: publicProcedure
    .input(poolFindOneInput)
    .mutation(async ({ ctx, input }) => {
      try {
        const pool = await ctx.prisma.pool.findUnique({
          where: {
            id: input.id,
          },
        });

        if (!pool) {
          throw new Error("Pool not found");
        }

        await ctx.prisma.membership.deleteMany({
          where: {
            poolId: input.id,
          },
        });

        await ctx.prisma.pool.delete({
          where: {
            id: pool.id,
          },
        });
      } catch (error) {
        throw new Error("Failed to retrieve pool");
      }
    }),
});
