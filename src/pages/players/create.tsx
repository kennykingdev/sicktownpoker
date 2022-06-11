import { SubmitHandler, useForm } from 'react-hook-form';
import {
  PlayerCreationInput,
  useCreatePlayerMutation,
} from '@/generated/graphql';
import { useQueryClient } from 'react-query';
import { useRouter } from 'next/router';

const CreatePlayer = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { mutate } = useCreatePlayerMutation({
    onSuccess: () => queryClient.invalidateQueries('PlayersIndex'),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<PlayerCreationInput>();

  const onSubmit: SubmitHandler<PlayerCreationInput> = (newPlayerData) => {
    mutate({ input: newPlayerData });
    router.push('/players');
  };

  return (
    <>
      <h1>Create Player</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="firstName">First name:</label>
        <input
          type="text"
          id="firstName"
          placeholder="first name"
          {...register('firstName', { required: true })}
        />
        <label htmlFor="lastName">Last name:</label>
        <input
          type="text"
          id="lastName"
          placeholder="last name"
          {...register('lastName', { required: true })}
        />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default CreatePlayer;
