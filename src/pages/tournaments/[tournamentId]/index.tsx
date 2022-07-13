import {
  GetTournamentDetailsQuery,
  useDeleteTournamentMutation,
  useGetTournamentDetailsQuery,
  useTournamentsIndexQuery,
} from '@/generated/graphql';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';

interface Params extends ParsedUrlQuery {
  tournamentId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { tournamentId } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useGetTournamentDetailsQuery.getKey({ tournamentId }),
    useGetTournamentDetailsQuery.fetcher({ tournamentId })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const TournamentDetailsPage: NextPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;
  const queryClient = useQueryClient();

  const { isLoading, data } =
    useGetTournamentDetailsQuery<GetTournamentDetailsQuery>({ tournamentId });

  const deleteMutation = useDeleteTournamentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(useTournamentsIndexQuery.getKey());
      queryClient.invalidateQueries(
        useGetTournamentDetailsQuery.getKey({ tournamentId })
      );
    },
  });

  const deleteTournamentHandler = () => {
    deleteMutation.mutate({ tournamentId });
    router.push('/tournaments');
  };

  {
    isLoading && <h1>Loading...</h1>;
  }

  if (data?.tournament) {
    const { tournament } = data;

    return (
      <>
        <h1>Tournament Details</h1>
        <h3>{tournament.name}</h3>
        <br />
        Date: {new Date(tournament.scheduledStart).toLocaleString()}
        <p>Status: {tournament.status}</p>
        <br />
        <Link href={`/tournaments/${tournamentId}/edit`} passHref>
          <button>Edit Tournament</button>
        </Link>
        <button onClick={deleteTournamentHandler}>Delete Tournament</button>
      </>
    );
  }

  return <h1>Something went wrong!</h1>;
};

export default TournamentDetailsPage;
