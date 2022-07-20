import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, Controller } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { validate } from '@/shared/validators';
import { TournamentDataSchema } from '@/shared/validators/tournament';

const TournamentCreatePage: NextPage = () => {
  const router = useRouter();

  const createTournament = trpc.useMutation('tournament.create');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
  } = useForm<TournamentDataSchema>({
    resolver: zodResolver(validate.tournament.data),
  });

  const onSubmit: SubmitHandler<TournamentDataSchema> = (
    newTournamentFormData
  ) => {
    createTournament.mutate(
      { data: newTournamentFormData },
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
        <input type="hidden" value={'Planning'} {...register('status')} />
        <label htmlFor="name">Tournament Name:</label>
        <input type="text" id="name" {...register('name')} />
        <p>{errors.name?.message}</p>
        <br />
        <label htmlFor="scheduledStart">Scheduled Date/Time</label>
        <Controller
          control={control}
          name="scheduledStart"
          render={({ field }) => (
            <DatePicker
              placeholderText="Select Date"
              onChange={(date) => field.onChange(date)}
              selected={field.value}
              showTimeSelect
              timeCaption="Time"
              dateFormat="MMMM d, yyyy h:mm aa"
            />
          )}
        />
        <p>{errors.scheduledStart?.message}</p>
        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TournamentCreatePage;
