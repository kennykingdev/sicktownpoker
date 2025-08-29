import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import players from "@/services/players";
import { idSchema } from "@/models";

export const getPlayerById = createServerFn()
  .validator((playerId: unknown) => idSchema.parse(playerId))
  .handler(async (ctx) => players.findById(ctx.data));

export const Route = createFileRoute("/players/$playerId")({
  loader: ({ params }) => getPlayerById({ data: params.playerId }),
  component: RouteComponent,
});

function RouteComponent() {
  const player = Route.useLoaderData();

  return (
    <div>
      <h1 className="text-3xl text-center">Player Details</h1>
      <div>Name: {`${player?.firstName} ${player?.lastName}`}</div>
      <div>Email: {`${player?.email}`}</div>
      <div>Phone: {`${player?.phone}`}</div>
    </div>
  );
}
