import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useForm, type AnyFieldApi } from "@tanstack/react-form";
import { type CreatePlayerInput, createPlayerSchema } from "@/models";
import players from "@/services/players";
import { Label, Input, Button } from "@/components/ui";

function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em>{field.state.meta.errors.map((err) => err.message).join(',')}</em>
      ) : null}
      {field.state.meta.isValidating ? 'Validating...' : null}
    </>
  )
}

export const createNewPlayer = createServerFn({ method: "POST" })
  .validator((player: unknown) => {
    return createPlayerSchema.parse(player);
  })
  .handler(async (ctx) => {
    const player = players.create(ctx.data);
    return player
  });

export const Route = createFileRoute("/players/create")({
  component: RouteComponent,
});

const defaultPlayer: CreatePlayerInput = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
};

function RouteComponent() {
  const navigate = useNavigate({ from: '/players/create' })

  const form = useForm({
    defaultValues: defaultPlayer,
    validators: {
      onChange: createPlayerSchema,
    },
    onSubmit: async (props) => {
      const { playerId } = await createNewPlayer({ data: props.value });
      navigate({ to: '/players/$playerId', params: { playerId } })
    },
  });

  return (
    <>
      <h1 className="text-3xl text-center m-4">Create New Player</h1>
      <form
        className="flex flex-col gap-4 w-4/5 mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="firstName"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>First Name: </Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        <form.Field
          name="lastName"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Last Name: </Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        <form.Field
          name="email"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Email: </Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        <form.Field
          name="phone"
          children={(field) => (
            <>
              <Label htmlFor={field.name}>Phone #: </Label>
              <Input
                id={field.name}
                type="text"
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
              <FieldInfo field={field} />
            </>
          )}
        />

        <Button
          type="button"
          onClick={() => {
            form.reset();
          }}
        >
          Reset
        </Button>
        <Button type="submit">
          Submit
        </Button>
      </form>
    </>
  );
}
