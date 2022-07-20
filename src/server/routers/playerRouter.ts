import { validate } from '@/shared/validators';
import { Prisma } from '@prisma/client';
import { createRouter } from '../createRouter';

const defaultPlayerSelect = Prisma.validator<Prisma.PlayerArgs>()({
  select: {
    id: true,
    createdAt: true,
    updatedAt: true,
    firstName: true,
    lastName: true,
    email: true,
    phone: true,
    shareContactInfo: true,
    referredByPlayer: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    },
    referredPlayers: {
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    },
    _count: {
      select: { referredPlayers: true },
    },
  },
});

export const playerRouter = createRouter()
  .query('index', {
    resolve: ({ ctx }) => {
      return ctx.prisma.player.findMany({
        select: {
          id: true,
          firstName: true,
          lastName: true,
        },
      });
    },
  })
  .query('byId', {
    input: validate.findByIdInput,
    resolve({ input, ctx }) {
      return ctx.prisma.player.findUniqueOrThrow({
        where: { id: input.id },
        ...defaultPlayerSelect,
      });
    },
  })
  .mutation('create', {
    input: validate.player,
    resolve({ input, ctx }) {
      return ctx.prisma.player.create({ data: input });
    },
  })
  .mutation('update', {
    input: validate.playerUpdateInput,
    resolve({ input, ctx }) {
      return ctx.prisma.player.update({
        where: { id: input.id },
        data: input.data,
      });
    },
  })
  .mutation('delete', {
    input: validate.findByIdInput,
    resolve({ input, ctx }) {
      return ctx.prisma.player.delete({ where: { id: input.id } });
    },
  });
