import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import {
  useGetPlayerDetailsQuery,
  GetPlayerDetailsQuery,
  useDeletePlayerMutation,
  usePlayersIndexQuery,
} from '@/generated/graphql';
import Link from 'next/link';

interface Params extends ParsedUrlQuery {
  playerId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // get playerId from params as a string
  const { playerId } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useGetPlayerDetailsQuery.getKey({ playerId }),
    useGetPlayerDetailsQuery.fetcher({ playerId })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const PlayerDetailPage: NextPage = () => {
  const router = useRouter();
  const playerId = router.query.playerId as string;
  const queryClient = useQueryClient();

  const { isLoading, isError, data } =
    useGetPlayerDetailsQuery<GetPlayerDetailsQuery>({
      playerId,
    });

  const deleteMutation = useDeletePlayerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(usePlayersIndexQuery.getKey());
      queryClient.invalidateQueries(
        useGetPlayerDetailsQuery.getKey({ playerId })
      );
    },
  });

  const deletePlayerHandler = () => {
    deleteMutation.mutate({ playerId });
    router.push('/players');
  };

  {
    isLoading && <h1>Loading...</h1>;
  }
  {
    isError && <h1>Something went wrong!</h1>;
  }

  return (
    <>
      <h1>Player Details</h1>
      <p>{data?.player.fullName}</p>
      <p>Email: {data?.player.email}</p>
      <p>Phone: {data?.player.phone}</p>
      <p>
        Share Contact Info?: {data?.player.shareContactInfo ? 'true' : 'false'}
      </p>
      <p>Referred by: {data?.player.referredByPlayer?.fullName}</p>
      <p>Referrals: {data?.player.referralCount}</p>
      <Link href={`/players/${data?.player.id}/edit`} passHref>
        <button>Edit Player</button>
      </Link>
      <button onClick={deletePlayerHandler}>Delete Player</button>
    </>
  );
};

export default PlayerDetailPage;
