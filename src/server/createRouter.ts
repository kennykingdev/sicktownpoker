import * as trpc from '@trpc/server';
import { Context } from './context';
import superjson from 'superjson';

export function createRouter() {
  return trpc.router<Context>().transformer(superjson);
}
