import { Heading, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { getPlayers } from '../../services/player/player';

interface PlayerIndexProps {
	players: {
		id: string;
		firstName: string;
		lastName: string;
	}[];
}

export async function getStaticProps() {
	const players = getPlayers();

	return {
		props: {
			players,
		},
	};
}

const PlayerIndex = ({ players }: PlayerIndexProps) => {
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

export default PlayerIndex;
