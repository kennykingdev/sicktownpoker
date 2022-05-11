import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { Heading, Text } from '@chakra-ui/react';
import { dehydrate, QueryClient } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import { gql } from 'apollo-server-micro';
import { useGetPlayerDetailsQuery, GetPlayerDetailsQuery } from '@/generated/graphql';

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
	// get playerId from params as a string, convert it to int for querying
	const { playerId: playerIdString } = ctx.params as Params;
	const playerId = parseInt(playerIdString);

	const queryClient = new QueryClient();

	await queryClient.prefetchQuery(
		useGetPlayerDetailsQuery.getKey({ playerId }),
		useGetPlayerDetailsQuery.fetcher({ playerId })
	);

	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
		},
	};
};

const PlayerDetailPage: NextPage = () => {
	const router = useRouter();
	const playerId = parseInt(router.query.playerId as string);

	const { isLoading, isError, data } = useGetPlayerDetailsQuery<GetPlayerDetailsQuery>({
		playerId,
	});

	{
		isLoading && <h1>Loading...</h1>;
	}
	{
		isError && <h1>Something went wrong!</h1>;
	}

	return (
		<>
			<Heading>Player Details</Heading>
			<Text>{data!.player.fullName}</Text>
			<Text>Referred by: {`${data!.player.referredByPlayer?.firstName}`}</Text>
		</>
	);
};

export default PlayerDetailPage;
