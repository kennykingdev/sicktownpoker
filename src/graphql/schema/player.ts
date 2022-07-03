import builder from '../builder';

builder.prismaObject('Player', {
  findUnique: (player) => ({ id: player.id }),
  fields: (t) => ({
    id: t.exposeID('id'),
    firstName: t.exposeString('firstName'),
    lastName: t.exposeString('lastName'),
    fullName: t.string({
      resolve: (player) => `${player.firstName} ${player.lastName}`,
    }),
    email: t.exposeString('email', { nullable: true }),
    phone: t.exposeString('phone', { nullable: true }),
    shareContactInfo: t.exposeBoolean('shareContactInfo'),
    referredByPlayer: t.relation('referredByPlayer', { nullable: true }),
    referredPlayers: t.relation('referredPlayers'),
    referralCount: t.relationCount('referredPlayers'),
  }),
});

builder.queryFields((t) => ({
  players: t.prismaField({
    type: ['Player'],
    resolve: async (query, _root, _args, _ctx, _info) =>
      prisma.player.findMany({ ...query }),
  }),
  player: t.prismaField({
    type: 'Player',
    args: {
      id: t.arg.string({ required: true }),
    },
    resolve: (query, _root, args, _ctx, _info) =>
      prisma.player.findUnique({
        ...query,
        rejectOnNotFound: true,
        where: { id: args.id },
      }),
  }),
}));

const PlayerCreateInput = builder.inputType('PlayerCreateInput', {
  fields: (t) => ({
    firstName: t.string({ required: true }),
    lastName: t.string({ required: true }),
    email: t.string(),
    phone: t.string(),
    shareContactInfo: t.boolean(),
    referredByPlayerId: t.string(),
  }),
});

const PlayerUpdateInput = builder.inputType('PlayerUpdateInput', {
  fields: (t) => ({
    id: t.string({ required: true }),
    firstName: t.string(),
    lastName: t.string(),
    email: t.string(),
    phone: t.string(),
    shareContactInfo: t.boolean(),
    referredByPlayerId: t.string(),
  }),
});

builder.mutationFields((t) => ({
  createPlayer: t.field({
    type: 'Player',
    args: {
      input: t.arg({ type: PlayerCreateInput, required: true }),
    },
    resolve: async (_root, args) => {
      const {
        firstName,
        lastName,
        email,
        phone,
        shareContactInfo,
        referredByPlayerId,
      } = args.input;

      return prisma.player.create({
        data: {
          firstName: firstName,
          lastName: lastName,
          email: email,
          phone: phone,
          shareContactInfo:
            shareContactInfo !== null ? shareContactInfo : undefined,
          referredByPlayerId: referredByPlayerId,
        },
      });
    },
  }),
  deletePlayer: t.field({
    type: 'Player',
    args: { playerId: t.arg.string({ required: true }) },
    resolve: async (_root, args) =>
      prisma.player.delete({ where: { id: args.playerId } }),
  }),
  updatePlayer: t.field({
    type: 'Player',
    args: {
      input: t.arg({ type: PlayerUpdateInput, required: true }),
    },
    resolve: async (root, { input }) => {
      return prisma.player.update({
        where: {
          id: input.id,
        },
        data: {
          firstName: input.firstName ? input.firstName : undefined,
          lastName: input.lastName ? input.lastName : undefined,
          email: input.email,
          phone: input.phone,
          shareContactInfo: input.shareContactInfo
            ? input.shareContactInfo
            : undefined,
          referredByPlayerId: input.referredByPlayerId,
        },
      });
    },
  }),
}));
