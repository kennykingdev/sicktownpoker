import { generateId } from "@/lib/utils";
import type {
  Id,
  Player,
  EditPlayerInput,
  CreatePlayerInput,
} from "@/lib/models";

const DUMMY_PLAYERS: Player[] = [];

function createDummyPlayers() {
  players.create({
    firstName: "Adam",
    lastName: "Apple",
    phone: "2535550000",
    email: "adam@sicktownpoker.com",
  });
  players.create({
    firstName: "Bobby",
    lastName: "Banana",
    phone: "2535550001",
    email: "bobby@sicktownpoker.com",
  });
}

const players = {
  findAll: () => {
    // temp just seeding dummy data
    if (DUMMY_PLAYERS.length === 0) {
      createDummyPlayers();
    }
    return DUMMY_PLAYERS;
  },
  findById: (playerId: Id) => {
    return DUMMY_PLAYERS.find((player) => player.id === playerId);
  },
  create: (player: CreatePlayerInput) => {
    DUMMY_PLAYERS.push({ id: generateId(), ...player });
  },
  edit: ({ id: playerId, ...updatedData }: EditPlayerInput) => {
    console.log("do stuff to edit a player");
  },
  delete: (playerId: Id) => {
    console.log("do stuff to delete a player");
  },
};

export default players;
