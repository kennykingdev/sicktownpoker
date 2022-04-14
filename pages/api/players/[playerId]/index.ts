import type { NextApiRequest, NextApiResponse } from 'next';
import { getPlayerById } from '@/services/player/';
import { PlayerWithReferrals } from 'types/Player';

type Data = {
	player?: PlayerWithReferrals;
	message?: string;
};

const handler = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
	const {
		query: { playerId },
		method,
	} = req;

	if (typeof playerId !== 'string') {
		return res.status(400).json({ message: 'Invalid Request' });
	}

	switch (method) {
		case 'GET':
			const player = await getPlayerById(playerId);

			if (player === null) {
				return res.status(404).json({ message: 'Not Found' });
			}

			return res.status(200).json({ player });
	}
};

export default handler;
