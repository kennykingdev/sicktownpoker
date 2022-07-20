import { trpc } from '@/utils/trpc';
import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TournamentDetailPage: NextPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const tournament = trpc.useQuery(['tournament.byId', { id: tournamentId }]);
  const deleteTournament = trpc.useMutation('tournament.delete');

  const deleteTournamentHandler = () => {
    deleteTournament.mutate(
      { id: tournamentId },
      {
        onSuccess: () => router.push('/tournaments'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (!tournament.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Tournament Details</h1>
      <h3>{tournament.data.name}</h3>
      <br />
      Date: {new Date(tournament.data.scheduledStart).toLocaleString()}
      <p>Status: {tournament.data.status}</p>
      <br />
      <Link href={`/tournaments/${tournamentId}/edit`} passHref>
        <button>Edit Tournament</button>
      </Link>
      <button onClick={deleteTournamentHandler}>Delete Tournament</button>
    </>
  );
};

export default TournamentDetailPage;
