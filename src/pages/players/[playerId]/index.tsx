import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import Link from 'next/link';

const PlayerDetailPage: NextPage = () => {
  const router = useRouter();
  const playerId = router.query.playerId as string;

  const player = trpc.useQuery(['player.byId', { id: playerId }]);
  const deletePlayer = trpc.useMutation('player.delete');

  const deletePlayerHandler = () => {
    deletePlayer.mutate(
      { id: playerId },
      {
        onSuccess: () => router.push('/players'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (!player.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Player Details</h1>
      <p>{`${player.data.firstName} ${player.data.lastName}`}</p>
      <p>Email: {player.data.email}</p>
      <p>Phone: {player.data.phone}</p>
      <p>
        Share Contact Info?: {player.data.shareContactInfo ? 'true' : 'false'}
      </p>
      <p>
        Referred by:{' '}
        {`${player.data.referredByPlayer?.firstName} ${player.data.referredByPlayer?.lastName}`}
      </p>
      <p>Referrals: {player.data._count.referredPlayers}</p>
      <Link href={`/players/${player.data.id}/edit`} passHref>
        <button>Edit Player</button>
      </Link>
      <button onClick={deletePlayerHandler}>Delete Player</button>
    </>
  );
};

export default PlayerDetailPage;
