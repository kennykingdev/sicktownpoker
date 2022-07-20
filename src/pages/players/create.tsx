import { SubmitHandler, useForm } from 'react-hook-form';
import { useRouter } from 'next/router';
import { trpc } from '@/utils/trpc';
import { NextPage } from 'next';
import { zodResolver } from '@hookform/resolvers/zod';
import { PlayerDataSchema } from '@/shared/validators/player';
import { validate } from '@/shared/validators';

const CreatePlayerPage: NextPage = () => {
  const router = useRouter();

  const playerIndex = trpc.useQuery(['player.index']);
  const createPlayer = trpc.useMutation('player.create');

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PlayerDataSchema>({
    resolver: zodResolver(validate.player.data),
  });

  const onSubmit: SubmitHandler<PlayerDataSchema> = (newPlayerFormData) => {
    createPlayer.mutate(
      { data: newPlayerFormData },
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
        <input type="text" id="firstName" {...register('firstName')} />
        <p>{errors.firstName?.message}</p>
        <br />
        <label htmlFor="lastName">Last name:</label>
        <input type="text" id="lastName" {...register('lastName')} />
        <p>{errors.lastName?.message}</p>
        <br />
        <label htmlFor="email">Email:</label>
        <input type="email" id="email" {...register('email')} />
        <p>{errors.email?.message}</p>
        <br />
        <label htmlFor="phone">Phone:</label>
        <input type="tel" id="phone" {...register('phone')} />
        <p>{errors.phone?.message}</p>
        <br />
        <label htmlFor="referredByPlayerId">Referred by: </label>
        <select id="referredByPlayerId" {...register('referredByPlayerId')}>
          <option></option>
          {playerIndex.data.map((player) => (
            <option key={player.id} value={player.id}>
              {`${player.firstName} ${player.lastName}`}
            </option>
          ))}
        </select>
        <p>{errors.referredByPlayerId?.message}</p>

        <br />
        <input type="submit" />
      </form>
    </>
  );
};

export default CreatePlayerPage;
