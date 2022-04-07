import { Heading, Text } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { FC } from 'react';
import { getPlayerById, getPlayerIds } from '../../services/player/player';

interface PlayerDetailProps {
	player: {
		id: string;
		firstName: string;
		lastName: string;
	};
}

interface ParamsWithPlayerId extends ParsedUrlQuery {
	playerId: string;
}

const PlayerDetailPage: FC<PlayerDetailProps> = ({ player }) => {
	if (!player) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Heading>Player Details</Heading>
			<Text>{`${player.firstName} ${player.lastName}`}</Text>
		</>
	);
};

export default PlayerDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
	const playerIds = getPlayerIds();

	const paths = playerIds.map((playerId) => ({ params: { playerId } }));

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { playerId } = context.params as ParamsWithPlayerId;

	const player = getPlayerById(playerId);

	if (!player) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			player,
		},
	};
};
