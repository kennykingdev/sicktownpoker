import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface PlayerDataInput {
	players: {
		name: {
			firstName: string;
			lastName: string;
		};
		referredBy: {
			firstName: string;
			lastName: string;
		};
	}[];
}

const seedData: PlayerDataInput = {
	players: [
		{
			name: { firstName: 'Adam', lastName: 'Apple' },
			referredBy: { firstName: 'Adam', lastName: 'Apple' },
		},
		{
			name: { firstName: 'Bobby', lastName: 'Banana' },
			referredBy: { firstName: 'Bobby', lastName: 'Banana' },
		},
		{
			name: { firstName: 'Charlie', lastName: 'Cherry' },
			referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
		},
		{
			name: { firstName: 'Dana', lastName: 'Date' },
			referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
		},
		{
			name: { firstName: 'Emily', lastName: 'Elderberry' },
			referredBy: { firstName: 'Adam', lastName: 'Apple' },
		},
		{
			name: { firstName: 'Frankie', lastName: 'Fig' },
			referredBy: { firstName: 'Adam', lastName: 'Apple' },
		},
		{
			name: { firstName: 'Gwen', lastName: 'Grape' },
			referredBy: { firstName: 'Bobby', lastName: 'Banana' },
		},
		{
			name: { firstName: 'Helen', lastName: 'Huckleberry' },
			referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
		},
	],
};

const addPlayers = async ({ players }: PlayerDataInput) => {
	for (const player of players) {
		const user = await prisma.player.create({ data: player.name });
		console.log(`Created player ID: ${user.id} - ${user.firstName} ${user.lastName}`);
	}
};

const addPlayerReferrals = async ({ players }: PlayerDataInput) => {
	for (const player of players) {
		const referredPlayer = await prisma.player.findFirst({
			where: { firstName: player.name.firstName, lastName: player.name.lastName },
		});

		const referringPlayer = await prisma.player.findFirst({
			where: { firstName: player.referredBy.firstName, lastName: player.referredBy.lastName },
		});

		if (!referredPlayer || !referringPlayer) {
			return null;
		}

		const updatedPlayer = await prisma.player.update({
			where: { id: referredPlayer.id },
			data: { referredById: referringPlayer.id },
			include: { referredBy: true },
		});

		console.log(
			`${updatedPlayer.firstName} was referred by ${updatedPlayer.referredBy!.firstName}`
		);
	}
};

const seedPlayers = async (playerData: PlayerDataInput) => {
	console.log('Seeding players...');
	await addPlayers(playerData);
	console.log('Seeding players finished.');

	console.log('Adding player referrals...');
	await addPlayerReferrals(playerData);
	console.log('Adding player referrals finished.');
};

export default seedPlayers.bind(null, seedData);
