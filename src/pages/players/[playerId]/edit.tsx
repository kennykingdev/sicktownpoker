import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQueryClient } from 'react-query';
import { ParsedUrlQuery } from 'querystring';
import {
  GetPlayerDetailsQuery,
  PlayersIndexQuery,
  PlayerUpdateInput,
  useGetPlayerDetailsQuery,
  usePlayersIndexQuery,
  useUpdatePlayerMutation,
} from '@/generated/graphql';
import { SubmitHandler, useForm } from 'react-hook-form';
import removeEmptyFormFields from '@/lib/utils/removeEmptyFormFields';

interface Params extends ParsedUrlQuery {
  playerId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { playerId } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    usePlayersIndexQuery.getKey(),
    usePlayersIndexQuery.fetcher()
  );

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

const EditPlayerPage: NextPage = () => {
  const router = useRouter();
  const playerId = router.query.playerId as string;

  const queryClient = useQueryClient();

  const playerDetailsQuery = useGetPlayerDetailsQuery<GetPlayerDetailsQuery>({
    playerId,
  });

  const playersIndexQuery = usePlayersIndexQuery<PlayersIndexQuery>();

  const updatePlayerMutation = useUpdatePlayerMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(
        useGetPlayerDetailsQuery.getKey({ playerId })
      );
      queryClient.invalidateQueries(usePlayersIndexQuery.getKey());
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PlayerUpdateInput>({
    defaultValues: {
      id: playerId,
      firstName: playerDetailsQuery.data?.player.firstName,
      lastName: playerDetailsQuery.data?.player.lastName,
      email: playerDetailsQuery.data?.player.email,
      phone: playerDetailsQuery.data?.player.phone,
      referredByPlayerId: playerDetailsQuery.data?.player.referredByPlayer?.id,
    },
  });

  const onSubmit: SubmitHandler<PlayerUpdateInput> = (updatePlayerFormData) => {
    removeEmptyFormFields(updatePlayerFormData);

    updatePlayerMutation.mutate(
      { input: updatePlayerFormData },
      {
        onSuccess: () => router.push('/players'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (playerDetailsQuery.isLoading || playersIndexQuery.isLoading) {
    return <h1>Loading...</h1>;
  }
  if (playerDetailsQuery.isError || playersIndexQuery.isError) {
    return <h1>Something went wrong...</h1>;
  }

  if (playerDetailsQuery.data && playersIndexQuery.data) {
    return (
      <>
        <h1>Player Edit Page</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <label htmlFor="firstName">First name:</label>
          <input
            type="text"
            id="firstName"
            {...register('firstName', { required: true, minLength: 1 })}
          />
          <br />
          <label htmlFor="lastName">Last name:</label>
          <input
            type="text"
            id="lastName"
            {...register('lastName', { required: true, minLength: 1 })}
          />
          <br />
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" {...register('email')} />
          <br />
          <label htmlFor="phone">Phone:</label>
          <input type="tel" id="phone" {...register('phone')} />
          <br />
          <label htmlFor="referredByPlayerId">Referred by: </label>
          <select id="referredByPlayerId" {...register('referredByPlayerId')}>
            <option></option>
            {playersIndexQuery.data.players.map((existingPlayer) => (
              <option key={existingPlayer.id} value={existingPlayer.id}>
                {existingPlayer.fullName}
              </option>
            ))}
          </select>

          <br />
          <input type="submit" />
        </form>
      </>
    );
  }
  return <h1>Something&apos;s broken...</h1>;
};

export default EditPlayerPage;
