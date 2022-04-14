import { Heading, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Player } from '@prisma/client';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';

const PlayerIndexPage: NextPage = () => {
	const [players, setPlayers] = useState<Player[]>([]);

	useEffect(() => {
		fetch('/api/players')
			.then((res) => res.json())
			.then((playerData) => {
				setPlayers(playerData.players);
			});
	}, []);

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
