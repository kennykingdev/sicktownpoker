import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Player } from '@/types/Player';
import { Heading, Button } from '@chakra-ui/react';
import { dehydrate, QueryClient, useQuery } from 'react-query';
import { getPlayers } from '@/services/player';
import { gql } from 'apollo-server-micro';
import { queryClient, getPlayersIndex } from '@/lib/clients/api';

const GET_PLAYERS = gql`
	query getPlayersIndex {
		players {
			id
			fullName
			firstName
			lastName
		}
	}
`;

export const getServerSideProps: GetServerSideProps = async () => {
	await queryClient.prefetchQuery('players', () => getPlayersIndex());

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
	// const { isLoading, isError, data: players } = useQuery<Player[]>('players', fetchPlayers);
	const { data } = useQuery(['players'], () => getPlayersIndex());

	// if (isLoading) {
	// 	return <span>loading...</span>;
	// }
	// if (isError) {
	// 	return <span>error...</span>;
	// }

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
