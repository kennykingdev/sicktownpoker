import SchemaBuilder from '@pothos/core';
import PrismaPlugin from '@pothos/plugin-prisma';
import type PrismaTypes from '@/generated/pothos-types';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/clients/prisma';
import { Context } from './context';

const builder = new SchemaBuilder<{
	Context: Context;
	PrismaTypes: PrismaTypes;
}>({
	plugins: [PrismaPlugin],
	prisma: {
		client: prisma,
		dmmf: (prisma as unknown as { _dmmf: Prisma.DMMF.Document })._dmmf,
	},
});

builder.prismaObject('Player', {
	findUnique: (player) => ({ id: player.id }),
	fields: (t) => ({
		id: t.exposeID('id'),
		firstName: t.exposeString('firstName'),
		lastName: t.exposeString('lastName'),
		fullName: t.string({ resolve: (player) => `${player.firstName} ${player.lastName}` }),
		email: t.exposeString('email', { nullable: true }),
		phone: t.exposeString('phone', { nullable: true }),
		shareContactInfo: t.exposeBoolean('shareContactInfo'),
		referredBy: t.relation('referredBy', { nullable: true }),
		referrals: t.relation('referrals'),
		referralCount: t.relationCount('referrals'),
	}),
});

builder.queryType({
	fields: (t) => ({
		players: t.prismaField({
			type: ['Player'],
			resolve: async (query, root, args, ctx, info) =>
				prisma.player.findMany({
					...query,
				}),
		}),
		player: t.prismaField({
			type: 'Player',
			args: {
				id: t.arg.int({ required: true }),
			},
			resolve: async (query, root, args, ctx, info) =>
				prisma.player.findUnique({
					...query,
					rejectOnNotFound: true,
					where: { id: args.id },
				}),
		}),
	}),
});

const schema = builder.toSchema({});

export default schema;
