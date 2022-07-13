import {
  GetTournamentDetailsQuery,
  useGetTournamentDetailsQuery,
  useUpdateTournamentMutation,
  useTournamentsIndexQuery,
  TournamentUpdateInput,
} from '@/generated/graphql';
import removeEmptyFormFields from '@/lib/utils/removeEmptyFormFields';
import { TournamentStatus } from '@prisma/client';
import { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { QueryClient, dehydrate, useQueryClient } from 'react-query';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Params extends ParsedUrlQuery {
  tournamentId: string;
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { tournamentId } = ctx.params as Params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useGetTournamentDetailsQuery.getKey({ tournamentId }),
    useGetTournamentDetailsQuery.fetcher({ tournamentId })
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};

const TournamentUpdatePage: NextPage = () => {
  const router = useRouter();
  const tournamentId = router.query.tournamentId as string;
  const queryClient = useQueryClient();

  const tournamentDetailsQuery =
    useGetTournamentDetailsQuery<GetTournamentDetailsQuery>({ tournamentId });

  const updateTournamentMutation = useUpdateTournamentMutation({
    onSuccess: () => {
      queryClient.invalidateQueries(
        useGetTournamentDetailsQuery.getKey({ tournamentId })
      );
      queryClient.invalidateQueries(useTournamentsIndexQuery.getKey());
    },
  });

  const { handleSubmit, register, control } = useForm<TournamentUpdateInput>({
    defaultValues: {
      id: tournamentId,
      name: tournamentDetailsQuery.data?.tournament.name,
      scheduledStart: tournamentDetailsQuery.data?.tournament.scheduledStart
        ? new Date(tournamentDetailsQuery.data.tournament.scheduledStart)
        : undefined,
      status: tournamentDetailsQuery.data?.tournament.status,
    },
  });

  const onSubmit: SubmitHandler<TournamentUpdateInput> = (
    updateTournamentData
  ) => {
    removeEmptyFormFields(updateTournamentData);

    updateTournamentMutation.mutate(
      { input: updateTournamentData },
      {
        onSuccess: () => router.push('/tournaments'),
        onError: () => alert('Something went wrong'),
      }
    );
  };

  if (tournamentDetailsQuery.isLoading) {
    return <h1>Loading...</h1>;
  }

  if (tournamentDetailsQuery.isError) {
    return <h1>Something went wrong...</h1>;
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

        <br />
        <button type="submit">Submit</button>
      </form>
    </>
  );
};

export default TournamentUpdatePage;
