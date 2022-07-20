import { createRouter } from '../createRouter';
import { playerRouter } from './playerRouter';
import { tournamentRouter } from './tournamentRouter';

// export type definition of API
export type AppRouter = typeof appRouter;

export const appRouter = createRouter()
  .merge('player.', playerRouter)
  .merge('tournament.', tournamentRouter);
