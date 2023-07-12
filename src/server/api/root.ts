import { createTRPCRouter } from "~/server/api/trpc";
import { dashboardRouter } from "./routers/dashboard";
import { gamesRouter } from "./routers/games";
import { schedulesRouter } from "./routers/schedules";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  dashboard: dashboardRouter,
  games: gamesRouter,
  schedules: schedulesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
