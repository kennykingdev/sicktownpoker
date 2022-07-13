import {
  TournamentsIndexQuery,
  useTournamentsIndexQuery,
} from '@/generated/graphql';
import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { dehydrate, QueryClient } from 'react-query';

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    useTournamentsIndexQuery.getKey(),
    useTournamentsIndexQuery.fetcher()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const TournamentIndexPage: NextPage = () => {
  const { isLoading, isError, data } =
    useTournamentsIndexQuery<TournamentsIndexQuery>();

  {
    isLoading && <h1>Loading...</h1>;
  }
  {
    isError && <h1>Something went wrong!</h1>;
  }

  return (
    <>
      <h1>Tournaments</h1>
      <Link href="/tournaments/create" passHref>
        <button>Add New Tournament</button>
      </Link>

      <ul>
        {data?.tournaments &&
          data.tournaments.map((tournament) => (
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
