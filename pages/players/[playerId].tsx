import { Heading, Text } from '@chakra-ui/react';
import { NextPage } from 'next';
import { PlayerWithReferrals } from 'types/Player';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const PlayerDetailPage: NextPage = () => {
	const router = useRouter();
	const { playerId } = router.query;
	const [player, setPlayer] = useState<PlayerWithReferrals>();

	useEffect(() => {
		fetch(`/api/players/${playerId}`)
			.then((res) => res.json())
			.then((playerData) => {
				setPlayer(playerData.player);
			});
	}, [playerId]);

	if (!player) {
		return <p>Loading...</p>;
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
