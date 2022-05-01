import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { PlayerWithReferrals } from '@/types/Player';
import { Heading, Text } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getPlayerById } from '@/services/player';

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const playerId = ctx.params?.playerId as string;

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery('player', getPlayerById.bind(null, playerId));

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

const fetchPlayerById = async (playerId: string): Promise<PlayerWithReferrals> => {
	const playerData = await fetch(`/api/players/${playerId}`).then((res) => res.json());
	return playerData.player;
};

const PlayerDetailPage: NextPage = () => {
	const router = useRouter();
	const playerId = router.query.playerId as string;

	const {
		isLoading,
		isError,
		data: player,
	} = useQuery<PlayerWithReferrals>('player', fetchPlayerById.bind(null, playerId));

	if (isLoading) {
		return <span>loading...</span>;
	}
	if (isError) {
		return <span>error...</span>;
	}

	if (!player) {
		return <span>not found</span>;
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
