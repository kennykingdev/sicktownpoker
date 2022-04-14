import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlayers } from '@/services/player/';
import { Player } from '@prisma/client';

type Data = {
	players: Player[];
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	switch (req.method) {
		case 'GET':
			const players = await getPlayers();

			if (!players) {
				return res.status(500);
			}

			return res.status(200).json({ players });
		default:
			res.setHeader('Allow', ['GET']);
			res.status(405).end(`Method ${req.method} Not Allowed`);
	}
};

export default handler;
