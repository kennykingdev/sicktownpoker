import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Heading, Button } from '@chakra-ui/react';
import { dehydrate, QueryClient } from 'react-query';
import { gql } from 'apollo-server-micro';
import { usePlayersIndexQuery, PlayersIndexQuery } from '@/generated/graphql';

gql`
	query PlayersIndex {
		players {
			id
			fullName
		}
	}
`;

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();
	await queryClient.prefetchQuery(usePlayersIndexQuery.getKey(), usePlayersIndexQuery.fetcher());

	return {
		props: {
			dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
		},
	};
};

const PlayerIndexPage: NextPage = () => {
	const { isLoading, isError, data } = usePlayersIndexQuery<PlayersIndexQuery>();

	{
		isLoading && <h1>Loading...</h1>;
	}
	{
		isError && <h1>Something went wrong!</h1>;
	}

	return (
		<>
			<Heading>Players</Heading>
			<NextLink href='/players/create' passHref>
				<Button>Add New Player</Button>
			</NextLink>

			<ul>
				{data!.players &&
					data!.players.map((player) => (
						<li key={player.id}>
							<NextLink href={`/players/${player.id}`}>{player.fullName}</NextLink>
						</li>
					))}
			</ul>
		</>
	);
};

export default PlayerIndexPage;
