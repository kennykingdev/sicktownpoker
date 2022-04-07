import players from './DUMMY_DATA';

export const getPlayers = () => {
	return players;
};

export const getPlayerIds = () => {
	const playerIds = players.map((player) => player.id);
	return playerIds;
};

export const getPlayerById = (playerId: string) => {
	const player = players.find((player) => player.id === playerId);
	return player;
};
