import { Prisma } from '@prisma/client';

export type { Player } from '@prisma/client';

const playerWithReferrals = Prisma.validator<Prisma.PlayerArgs>()({
	include: { referrals: true, referredBy: true },
});

export type PlayerWithReferrals = Prisma.PlayerGetPayload<typeof playerWithReferrals>;
