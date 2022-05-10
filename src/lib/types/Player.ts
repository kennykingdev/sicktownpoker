// Customize Prisma generated type to include relations
import { Prisma } from '@prisma/client';

const playerWithRelations = Prisma.validator<Prisma.PlayerArgs>()({
	include: { referredPlayers: true, referredByPlayer: true },
});

type AdditionalPlayerProperties = {
	fullName?: string;
};

export type Player = Prisma.PlayerGetPayload<typeof playerWithRelations> &
	AdditionalPlayerProperties;
