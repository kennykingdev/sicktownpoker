import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InferMutationInput, trpc } from '@/utils/trpc';

const EditPlayerPage: NextPage = () => {
  const router = useRouter();
  const playerId = router.query.playerId as string;

  const player = trpc.useQuery(['player.byId', { id: playerId }]);
  const playerIndex = trpc.useQuery(['player.index']);
  const updatePlayer = trpc.useMutation('player.update');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<InferMutationInput<'player.update'>>({
    defaultValues: {
      id: playerId,
      data: {
        ...player.data,
        referredByPlayerId: player.data?.referredByPlayer?.id,
      },
    },
  });

  const onSubmit: SubmitHandler<InferMutationInput<'player.update'>> = (
    updatePlayerFormData
  ) => {
    updatePlayer.mutate(
      { id: playerId, data: updatePlayerFormData.data },
      {
        onSuccess: () => router.push('/players'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (!player.data || !playerIndex.data) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>Player Edit Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstName">First name:</label>
        <input
          type="text"
          id="firstName"
          {...register('data.firstName', { required: true, minLength: 1 })}
        />
        <br />
        <label htmlFor="lastName">Last name:</label>
        <input
          type="text"
          id="lastName"
          {...register('data.lastName', { required: true, minLength: 1 })}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register('data.email')} />
        <br />
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" {...register('data.phone')} />
        <br />
        <label htmlFor="referredByPlayerId">Referred by: </label>
        <select
          id="referredByPlayerId"
          {...register('data.referredByPlayerId')}
        >
          <option></option>
          {playerIndex.data.map((existingPlayer) => (
            <option key={existingPlayer.id} value={existingPlayer.id}>
              {`${existingPlayer.firstName} ${existingPlayer.lastName}`}
            </option>
          ))}
        </select>

        <br />
        <input type="submit" />
      </form>
    </>
  );
};

export default EditPlayerPage;
