import { TournamentStatus } from '@prisma/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { trpc } from '@/utils/trpc';
import { zodResolver } from '@hookform/resolvers/zod';
import { validate } from '@/shared/validators';
import { TournamentDataSchema } from '@/shared/validators/tournament';

const TournamentUpdatePage: NextPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const tournament = trpc.useQuery(['tournament.byId', { id: tournamentId }]);
  const updateTournament = trpc.useMutation('tournament.update');

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<TournamentDataSchema>({
    defaultValues: { ...tournament.data },
    resolver: zodResolver(validate.tournament.data),
  });

  const onSubmit: SubmitHandler<TournamentDataSchema> = (
    updateTournamentFormData
  ) => {
    updateTournament.mutate(
      { id: tournamentId, data: updateTournamentFormData },
      {
        onSuccess: () => router.push('/tournaments'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (!tournament.data) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <h1>Tournament Update</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="name">Tournament Name:</label>
        <input
          type="text"
          id="name"
          {...register('name', { required: true, minLength: 1 })}
        />
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
        <label htmlFor="status">Status: </label>
        <select id="status" {...register('status')}>
          {Object.keys(TournamentStatus).map((key: string) => {
            return (
              <option key={key}>
                {TournamentStatus[key as keyof typeof TournamentStatus]}
              </option>
            );
          })}
        </select>
        <p>{errors.status?.message}</p>

        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TournamentUpdatePage;
