import { TournamentStatus } from '@prisma/client';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { InferMutationInput, trpc } from '@/utils/trpc';

const TournamentUpdatePage: NextPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;

  const tournament = trpc.useQuery(['tournament.byId', { id: tournamentId }]);
  const updateTournament = trpc.useMutation('tournament.update');

  const { handleSubmit, register, control } = useForm<
    InferMutationInput<'tournament.update'>
  >({
    defaultValues: {
      id: tournamentId,
      data: {
        ...tournament.data,
        scheduledStart: tournament.data?.scheduledStart
          ? tournament.data.scheduledStart.toLocaleString()
          : undefined,
      },
    },
  });

  const onSubmit: SubmitHandler<InferMutationInput<'tournament.update'>> = (
    updateTournamentFormData
  ) => {
    updateTournament.mutate(
      { id: tournamentId, data: { ...updateTournamentFormData.data } },
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
          {...register('data.name', { required: true, minLength: 1 })}
        />
        <br />
        <label htmlFor="scheduledStart">Scheduled Date/Time</label>
        <Controller
          control={control}
          name="data.scheduledStart"
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
        <label htmlFor="status">Status: </label>
        <select id="status" {...register('data.status')}>
          {Object.keys(TournamentStatus).map((key: string) => {
            return (
              <option key={key}>
                {TournamentStatus[key as keyof typeof TournamentStatus]}
              </option>
            );
          })}
        </select>

        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TournamentUpdatePage;
