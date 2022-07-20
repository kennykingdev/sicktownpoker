import { NextPage } from 'next';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

const TournamentIndexPage: NextPage = () => {
  const tournamentIndex = trpc.useQuery(['tournament.index']);

  if (!tournamentIndex.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Tournaments</h1>
      <Link href="/tournaments/create" passHref>
        <button>Add New Tournament</button>
      </Link>

      <ul>
        {tournamentIndex.data.map((tournament) => (
          <li key={tournament.id}>
            <Link href={`/tournaments/${tournament.id}`}>
              {tournament.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default TournamentIndexPage;
