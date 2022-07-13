import { SubmitHandler, useForm } from 'react-hook-form';
import {
  PlayerCreateInput,
  PlayersIndexQuery,
  useCreatePlayerMutation,
  usePlayersIndexQuery,
} from '@/generated/graphql';
import { dehydrate, QueryClient, useQueryClient } from 'react-query';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import removeEmptyFormFields from '@/lib/utils/removeEmptyFormFields';

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

const CreatePlayer = () => {
  const router = useRouter();

  const playersIndexQuery = usePlayersIndexQuery<PlayersIndexQuery>();

  const queryClient = useQueryClient();
  const createPlayerMutation = useCreatePlayerMutation({
    onSuccess: () => queryClient.invalidateQueries('PlayersIndex'),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PlayerCreateInput>();

  const onSubmit: SubmitHandler<PlayerCreateInput> = (newPlayerFormData) => {
    removeEmptyFormFields(newPlayerFormData);

    createPlayerMutation.mutate(
      { input: newPlayerFormData },
      {
        onSuccess: () => router.push('/players'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (playersIndexQuery.data?.players) {
    return (
      <>
        <h1>Create Player</h1>

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
            {playersIndexQuery.data.players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.fullName}
              </option>
            ))}
          </select>

          <br />
          <input type="submit" />
        </form>
      </>
    );
  }
};

export default CreatePlayer;
