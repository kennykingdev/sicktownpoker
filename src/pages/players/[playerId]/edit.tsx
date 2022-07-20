import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm } from 'react-hook-form';
import { trpc } from '@/utils/trpc';
import { PlayerDataSchema } from '@/shared/validators/player';
import { zodResolver } from '@hookform/resolvers/zod';
import { validate } from '@/shared/validators';

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
  } = useForm<PlayerDataSchema>({
    defaultValues: { ...player.data },
    resolver: zodResolver(validate.player.data),
  });

  const onSubmit: SubmitHandler<PlayerDataSchema> = (updatePlayerFormData) => {
    updatePlayer.mutate(
      { id: playerId, data: updatePlayerFormData },
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
          {playerIndex.data.map((existingPlayer) => (
            <option key={existingPlayer.id} value={existingPlayer.id}>
              {`${existingPlayer.firstName} ${existingPlayer.lastName}`}
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

export default EditPlayerPage;
