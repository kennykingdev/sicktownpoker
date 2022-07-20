import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { InferMutationInput, trpc } from '@/utils/trpc';
import { NextPage } from 'next';

const CreatePlayerPage: NextPage = () => {
  const router = useRouter();

  const playerIndex = trpc.useQuery(['player.index']);
  const createPlayer = trpc.useMutation('player.create');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<InferMutationInput<'player.create'>>();

  const onSubmit: SubmitHandler<InferMutationInput<'player.create'>> = (
    newPlayerFormData
  ) => {
    createPlayer.mutate(
      { ...newPlayerFormData },
      {
        onSuccess: () => router.push('/players'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (!playerIndex.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Create Player</h1>

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
          {playerIndex.data.map((player) => (
            <option key={player.id} value={player.id}>
              {`${player.firstName} ${player.lastName}`}
            </option>
          ))}
        </select>

        <br />
        <input type="submit" />
      </form>
    </>
  );
};

export default CreatePlayerPage;
