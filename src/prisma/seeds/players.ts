import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface PlayerDataInput {
  players: {
    playerData: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      shareContactInfo?: boolean;
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
      playerData: {
        firstName: 'Adam',
        lastName: 'Apple',
        email: 'adam@example.com',
        phone: '253-555-0000',
        shareContactInfo: true,
      },
      referredBy: { firstName: 'Adam', lastName: 'Apple' },
    },
    {
      playerData: {
        firstName: 'Bobby',
        lastName: 'Banana',
        email: 'bobby@example.com',
        phone: '253-555-0001',
      },
      referredBy: { firstName: 'Bobby', lastName: 'Banana' },
    },
    {
      playerData: {
        firstName: 'Charlie',
        lastName: 'Cherry',
        email: 'charlie@example.com',
        phone: '253-555-0002',
        shareContactInfo: true,
      },
      referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
    },
    {
      playerData: {
        firstName: 'Dana',
        lastName: 'Date',
        email: 'dana@example.com',
        phone: '253-555-0003',
      },
      referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
    },
    {
      playerData: {
        firstName: 'Emily',
        lastName: 'Elderberry',
        email: 'emily@example.com',
        phone: '253-555-0004',
      },
      referredBy: { firstName: 'Adam', lastName: 'Apple' },
    },
    {
      playerData: {
        firstName: 'Frankie',
        lastName: 'Fig',
        email: 'frankie@example.com',
        phone: '253-555-0005',
      },
      referredBy: { firstName: 'Adam', lastName: 'Apple' },
    },
    {
      playerData: {
        firstName: 'Gwen',
        lastName: 'Grape',
        email: 'gwen@example.com',
        phone: '253-555-0006',
      },
      referredBy: { firstName: 'Bobby', lastName: 'Banana' },
    },
    {
      playerData: {
        firstName: 'Helen',
        lastName: 'Huckleberry',
        email: 'helen@example.com',
        phone: '253-555-0007',
      },
      referredBy: { firstName: 'Charlie', lastName: 'Cherry' },
    },
  ],
};

const addPlayers = async ({ players }: PlayerDataInput) => {
  for (const player of players) {
    await prisma.player.create({ data: player.playerData });
  }
};

const addPlayerReferrals = async ({ players }: PlayerDataInput) => {
  for (const player of players) {
    const referredPlayer = await prisma.player.findFirst({
      where: {
        firstName: player.playerData.firstName,
        lastName: player.playerData.lastName,
      },
    });

    const referringPlayer = await prisma.player.findFirst({
      where: {
        firstName: player.referredBy.firstName,
        lastName: player.referredBy.lastName,
      },
    });

    if (!referredPlayer || !referringPlayer) {
      return;
    }

    await prisma.player.update({
      where: { id: referredPlayer.id },
      data: { referredByPlayerId: referringPlayer.id },
      include: { referredByPlayer: true },
    });
  }
};

const seedPlayers = async (playerData: PlayerDataInput) => {
  console.log('Deleting existing players...');
  await prisma.player.deleteMany();

  console.log('Seeding players...');
  await addPlayers(playerData);

  console.log('Adding player referrals...');
  await addPlayerReferrals(playerData);
};

export default seedPlayers.bind(null, seedData);
