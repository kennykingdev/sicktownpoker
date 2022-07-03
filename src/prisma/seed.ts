import seedPlayers from './seeds/players';
import seedTournaments from './seeds/tournaments';

async function main() {
  await seedPlayers();
  await seedTournaments();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
