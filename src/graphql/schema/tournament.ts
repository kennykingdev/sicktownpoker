import { TournamentStatus } from '@prisma/client';
import builder from '../builder';

builder.enumType(TournamentStatus, {
  name: 'TournamentStatus',
});

builder.prismaObject('Tournament', {
  findUnique: (tournament) => ({ id: tournament.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    createdAt: t.field({ type: 'Date', resolve: (tourn) => tourn.createdAt }),
    updatedAt: t.field({ type: 'Date', resolve: (tourn) => tourn.updatedAt }),
    date: t.field({
      type: 'Date',
      resolve: (tourn) => tourn.date,
      nullable: true,
    }),
    name: t.exposeString('name', { nullable: true }),
    TournamentStatus: t.exposeString('status'),
  }),
});

builder.queryFields((t) => ({
  tournaments: t.prismaField({
    type: ['Tournament'],
    resolve: async (_query, _root, _args, _ctx, _info) =>
      prisma.tournament.findMany(),
  }),
  tournament: t.prismaField({
    type: 'Tournament',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, _root, args, _ctx, _info) =>
      prisma.tournament.findUniqueOrThrow({
        ...query,
        where: { id: args.id },
      }),
  }),
}));

const TournamentCreateInput = builder.inputType('TournamentCreateInput', {
  fields: (t) => ({
    date: t.field({ type: 'Date' }),
    name: t.string(),
    status: t.field({ type: TournamentStatus }),
  }),
});

const TournamentUpdateInput = builder.inputType('TournamentUpdateInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    date: t.field({ type: 'Date' }),
    name: t.string(),
    status: t.field({ type: TournamentStatus }),
  }),
});

builder.mutationFields((t) => ({
  createTournament: t.field({
    type: 'Tournament',
    args: {
      input: t.arg({ type: TournamentCreateInput, required: true }),
    },
    resolve: async (_root, args) => {
      const { date, name, status } = args.input;

      return prisma.tournament.create({
        data: {
          date,
          name,
          status: status ? status : undefined,
        },
      });
    },
  }),
  updateTournament: t.field({
    type: 'Tournament',
    args: {
      input: t.arg({ type: TournamentUpdateInput, required: true }),
    },
    resolve: async (_root, { input }) => {
      return prisma.tournament.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          date: input.date,
          status: input.status ? input.status : undefined,
        },
      });
    },
  }),
  deleteTournament: t.field({
    type: 'Tournament',
    args: { tournamentId: t.arg.string({ required: true }) },
    resolve: async (_root, args) =>
      prisma.tournament.delete({ where: { id: args.tournamentId } }),
  }),
}));
