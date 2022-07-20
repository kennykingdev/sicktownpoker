import { Prisma, PrismaClient } from '@prisma/client';
import { add } from 'date-fns';

const prisma = new PrismaClient();

type SeedData = Prisma.Enumerable<Prisma.TournamentCreateManyInput>;

let date = new Date('July 1, 2022 20:00');

const seedData: SeedData = [];

for (let i = 1; i <= 10; i++) {
  seedData.push({
    scheduledStart: date,
    name: `Game ${i}`,
    status: 'Planning',
  });

  date = add(date, { weeks: 2 });
}

const seedTournaments = async (seedData: SeedData) => {
  console.log('Deleting existing tournaments...');
  await prisma.tournament.deleteMany();

  console.log('Seeding tournaments...');
  await prisma.tournament.createMany({
    data: seedData,
  });
};

export default seedTournaments.bind(null, seedData);
