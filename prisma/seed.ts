import seedPlayers from './seeds/players';

async function main() {
	await seedPlayers();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
