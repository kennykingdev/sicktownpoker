import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import players from "@/lib/services/players";

export const getAllPlayers = createServerFn().handler(async () => {
  return players.findAll();
});

export const Route = createFileRoute("/players/")({
  loader: () => getAllPlayers(),
  component: RouteComponent,
});

async function RouteComponent() {
  const players = Route.useLoaderData();

  return (
    <>
      <h1 className="text-3xl text-center">Players Index</h1>
      <ul>
        {players.map((player) => {
          return (
            <li
              key={player.id}
            >{`${player.firstName} ${player.lastName} - ${player.id}`}</li>
          );
        })}
      </ul>
    </>
  );
}
