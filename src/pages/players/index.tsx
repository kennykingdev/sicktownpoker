import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { dehydrate, QueryClient } from 'react-query';
import { usePlayersIndexQuery, PlayersIndexQuery } from '@/generated/graphql';

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(
    usePlayersIndexQuery.getKey(),
    usePlayersIndexQuery.fetcher()
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const PlayerIndexPage: NextPage = () => {
  const { isLoading, isError, data } =
    usePlayersIndexQuery<PlayersIndexQuery>();

  {
    isLoading && <h1>Loading...</h1>;
  }
  {
    isError && <h1>Something went wrong!</h1>;
  }

  return (
    <>
      <h1>Players</h1>
      <Link href="/players/create" passHref>
        <button>Add New Player</button>
      </Link>

      <ul>
        {data!.players &&
          data!.players.map((player) => (
            <li key={player.id}>
              <Link href={`/players/${player.id}`}>{player.fullName}</Link>
            </li>
          ))}
      </ul>
    </>
  );
};

export default PlayerIndexPage;
