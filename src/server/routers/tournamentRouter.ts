import { validate } from '@/shared/validators';
import { Prisma } from '@prisma/client';
import { createRouter } from '../createRouter';

const defaultTournamentSelect = Prisma.validator<Prisma.TournamentArgs>()({
  select: {
    id: true,
    createdAt: true,
    updatedAt: true,
    scheduledStart: true,
    name: true,
    status: true,
  },
});

export const tournamentRouter = createRouter()
  .query('index', {
    resolve: ({ ctx }) => {
      return ctx.prisma.tournament.findMany({
        select: {
          id: true,
          name: true,
        },
      });
    },
  })
  .query('byId', {
    input: validate.findByIdInput,
    resolve({ input, ctx }) {
      return ctx.prisma.tournament.findUniqueOrThrow({
        where: { id: input.id },
        ...defaultTournamentSelect,
      });
    },
  })
  .mutation('create', {
    input: validate.tournament.createInput,
    resolve({ input, ctx }) {
      return ctx.prisma.tournament.create({ data: input.data });
    },
  })
  .mutation('update', {
    input: validate.tournament.updateInput,
    resolve({ input, ctx }) {
      return ctx.prisma.tournament.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: validate.findByIdInput,
    resolve({ input, ctx }) {
      return ctx.prisma.tournament.delete({ where: { id: input.id } });
    },
  });
