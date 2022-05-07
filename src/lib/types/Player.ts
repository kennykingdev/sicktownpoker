// Customize Prisma generated type to include relations
import { Prisma } from '@prisma/client';

const playerWithRelations = Prisma.validator<Prisma.PlayerArgs>()({
	include: { referrals: true, referredBy: true },
});

type AdditionalPlayerProperties = {
	fullName?: string;
};

export type Player = Prisma.PlayerGetPayload<typeof playerWithRelations> &
	AdditionalPlayerProperties;
