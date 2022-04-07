import prisma from '@/lib/prisma';
import { PlayerWithReferrals } from 'types/Player';

export const getPlayers = async () => {
	return prisma.player.findMany();
};

export const getPlayerIds = async () => {
	const playerIds = await prisma.player.findMany({ select: { id: true } });
	return playerIds.map((playerId) => playerId.id);
};

export const getPlayerById = async (
	playerId: number | string
): Promise<PlayerWithReferrals | null> => {
	// Allow us to pass playerId arg without worrying if it's a string or number when called
	const id = typeof playerId === 'number' ? playerId : parseInt(playerId);

	const player = await prisma.player.findUnique({
		where: { id },
		include: { referrals: true, referredBy: true },
	});

	if (!player) {
		return null;
	}

	return player;
};
