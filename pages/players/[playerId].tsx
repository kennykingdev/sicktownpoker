import { Heading, Text } from '@chakra-ui/react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { getPlayerById, getPlayerIds } from '@/services/player';
import { PlayerWithReferrals } from 'types/Player';

interface PlayerDetailProps {
	player: PlayerWithReferrals;
}

interface ParamsWithPlayerId extends ParsedUrlQuery {
	playerId: string;
}

const PlayerDetailPage: NextPage<PlayerDetailProps> = ({ player }) => {
	if (!player) {
		return <p>Loading...</p>;
	}

	return (
		<>
			<Heading>Player Details</Heading>
			<Text>{`${player.firstName} ${player.lastName}`}</Text>
			<Text>Referred by: {`${player.referredBy?.firstName}`}</Text>
		</>
	);
};

export default PlayerDetailPage;

export const getStaticPaths: GetStaticPaths = async () => {
	const playerIds = await getPlayerIds();

	const paths = playerIds.map((playerId) => {
		return {
			params: { playerId: playerId.toString() },
		};
	});

	return {
		paths,
		fallback: true,
	};
};

export const getStaticProps: GetStaticProps = async (context) => {
	const { playerId } = context.params as ParamsWithPlayerId;

	const player = await getPlayerById(playerId);

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
