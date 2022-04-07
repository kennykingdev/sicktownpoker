import { Heading, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { getPlayers } from '@/services/player';
import { Player } from '@prisma/client';
import { GetStaticProps, NextPage } from 'next';

interface PlayerIndexProps {
	players: Player[];
}

export const getStaticProps: GetStaticProps = async () => {
	const players = await getPlayers();

	return {
		props: {
			players,
		},
	};
};

const PlayerIndexPage: NextPage<PlayerIndexProps> = ({ players }) => {
	return (
		<>
			<Heading>Players</Heading>
			<NextLink href='/players/create' passHref>
				<Button>Add New Player</Button>
			</NextLink>

			<ul>
				{players.map((player) => (
					<li key={player.id}>
						<NextLink href={`/players/${player.id}`}>{player.firstName}</NextLink>
					</li>
				))}
			</ul>
		</>
	);
};

export default PlayerIndexPage;
