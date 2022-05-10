import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Heading, Text } from '@chakra-ui/react';
import { dehydrate, useQuery } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import { getPlayerDetails, queryClient } from '@/lib/clients/api';
import { gql } from 'graphql-request';

gql`
	query getPlayerDetails($playerId: Int!) {
		player(id: $playerId) {
			fullName
			referredByPlayer {
				firstName
			}
		}
	}
`;

interface Params extends ParsedUrlQuery {
	playerId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
	const { playerId } = ctx.params as Params;

	await queryClient.prefetchQuery(['player', playerId], () =>
		getPlayerDetails({ playerId: parseInt(playerId) })
	);

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

const PlayerDetailPage: NextPage = () => {
	const router = useRouter();
	const playerId = router.query.playerId as string;

	const { data } = useQuery(['player', playerId], () =>
		getPlayerDetails({ playerId: parseInt(playerId) })
	);

	if (!data) {
		return <h1>loading...</h1>;
	}

	return (
		<>
			<Heading>Player Details</Heading>
			<Text>{data.player.fullName}</Text>
			<Text>Referred by: {`${data.player.referredByPlayer?.firstName}`}</Text>
		</>
	);
};

export default PlayerDetailPage;
