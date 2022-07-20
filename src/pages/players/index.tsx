import { NextPage } from 'next';
import Link from 'next/link';
import { trpc } from '@/utils/trpc';

const PlayerIndexPage: NextPage = () => {
  const players = trpc.useQuery(['player.index']);

  if (!players.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Players</h1>
      <Link href="/players/create" passHref>
        <button>Add New Player</button>
      </Link>

      <ul>
        {players.data.map((player) => (
          <li key={player.id}>
            <Link
              href={`/players/${player.id}`}
            >{`${player.firstName} ${player.lastName}`}</Link>
          </li>
        ))}
      </ul>
    </>
  );
};

export default PlayerIndexPage;
