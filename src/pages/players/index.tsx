import { GetServerSideProps, NextPage } from 'next';
import NextLink from 'next/link';
import { Heading, Button } from '@chakra-ui/react';
import { dehydrate, useQuery } from 'react-query';
import { gql } from 'graphql-request';
import { queryClient, getPlayersIndex } from '@/lib/clients/api';

gql`
	query getPlayersIndex {
		players {
			id
			fullName
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

const PlayerIndexPage: NextPage = () => {
	const { data } = useQuery(['players'], () => getPlayersIndex());

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
