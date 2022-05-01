import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Player } from '@/types/Player';
import { Heading, Button } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getPlayers } from '@/services/player';

export const getServerSideProps: GetServerSideProps = async () => {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery('players', getPlayers);

	return {
		props: {
			dehydratedState: dehydrate(queryClient),
		},
	};
};

const fetchPlayers = async () => {
	const players = await fetch('/api/players').then((res) => res.json());
	return players;
};

const PlayerIndexPage: NextPage = () => {
	const { isLoading, isError, data: players } = useQuery<Player[]>('players', fetchPlayers);

	if (isLoading) {
		return <span>loading...</span>;
	}
	if (isError) {
		return <span>error...</span>;
	}

	return (
		<>
			<Heading>Players</Heading>
			<NextLink href='/players/create' passHref>
				<Button>Add New Player</Button>
			</NextLink>

			<ul>
				{players &&
					players.map((player) => (
						<li key={player.id}>
							<NextLink href={`/players/${player.id}`}>{player.firstName}</NextLink>
						</li>
					))}
			</ul>
		</>
	);
};

export default PlayerIndexPage;
