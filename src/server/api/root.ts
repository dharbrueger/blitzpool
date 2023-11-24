import { createTRPCRouter } from "~/server/api/trpc";
import { dashboardRouter } from "./routers/dashboard";
import { gamesRouter } from "./routers/games";
import { schedulesRouter } from "./routers/schedules";
import { poolsRouter } from "./routers/pools";
import { poolTypesRouter } from "./routers/poolTypes";
import { competitionsRouter } from "./routers/competitions";
import { picksRouter } from "./routers/picks";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  games: gamesRouter,
  schedules: schedulesRouter,
  poolTypes: poolTypesRouter,
  pools: poolsRouter,
  competitions: competitionsRouter,
  picks: picksRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
