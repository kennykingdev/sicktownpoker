import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InferMutationInput, trpc } from '@/utils/trpc';

const TournamentCreatePage: NextPage = () => {
  const router = useRouter();

  const createTournament = trpc.useMutation('tournament.create');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<InferMutationInput<'tournament.create'>>();

  const onSubmit: SubmitHandler<InferMutationInput<'tournament.create'>> = (
    newTournamentFormData
  ) => {
    createTournament.mutate(
      { ...newTournamentFormData },
      {
        onSuccess: () => {
          router.push('/tournaments');
        },
        onError: () => alert('Something went wrong'),
      }
    );
  };

  return (
    <>
      <h1>Tournament Creation</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Tournament Name:</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: true, minLength: 1 })}
        />
        <br />
        <label htmlFor="scheduledStart">Scheduled Date/Time</label>
        <Controller
          control={control}
          name="scheduledStart"
          render={({ field }) => (
            <DatePicker
              placeholderText="Select Date"
              onChange={(date) => field.onChange(date)}
              selected={field.value ? new Date(field.value) : new Date()}
              showTimeSelect
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          )}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TournamentCreatePage;
