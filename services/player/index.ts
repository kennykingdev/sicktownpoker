import prisma from '@/lib/prisma';
import { PlayerWithReferrals, Player } from '@/types/Player';

export const getPlayers = async (): Promise<Player[]> => {
	try {
		return await prisma.player.findMany();
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getPlayerIds = async () => {
	try {
		const playerIds = await prisma.player.findMany({ select: { id: true } });
		return playerIds.map((playerId) => playerId.id);
	} catch (error) {
		return Promise.reject(error);
	}
};

export const getPlayerById = async (playerId: number | string): Promise<PlayerWithReferrals> => {
	// Allow us to pass playerId arg as a number or a string
	const id = typeof playerId === 'number' ? playerId : parseInt(playerId);

	try {
		const player = await prisma.player.findUnique({
			where: { id },
			include: { referrals: true, referredBy: true },
		});

		if (!player) {
			throw new Error('Player not found');
		}

		return player;
	} catch (error) {
		return Promise.reject(error);
	}
};
