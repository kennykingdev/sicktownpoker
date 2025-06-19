import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { createPlayerSchema } from "@/lib/models";
import players from "@/lib/services/players";

export const createNewPlayer = createServerFn({ method: "POST" })
  .validator((player: unknown) => {
    return createPlayerSchema.parse(player);
  })
  .handler(async (ctx) => {
    return players.create(ctx.data);
  });

export const Route = createFileRoute("/players/create")({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>Hello "/players/create"!</div>;
}
