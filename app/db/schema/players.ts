import { pgTable, char, varchar } from "drizzle-orm/pg-core";
import { ID_LENGTH } from "@/utils";

export const playersTable = pgTable("players", {
  id: char({ length: ID_LENGTH }),
  firstName: varchar(),
  lastName: varchar(),
})
