import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import players from "@/services/players";
import { Button } from "@/components/ui";
import { UserPlus2Icon } from "lucide-react";

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
      <h1 className="text-3xl text-center mb-2">Players Index</h1>
      <div className="text-center">
        <Link to="/players/create">
          <Button>
            <UserPlus2Icon /> Create New Player
          </Button>
        </Link>
      </div>
      <ul className="m-4">
        {players.map((player) => {
          return (
            <li key={player.id}>
              <div className="">
                <Link
                  to="/players/$playerId"
                  params={{ playerId: player.id }}
                >{`${player.firstName} ${player.lastName}`}</Link>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
