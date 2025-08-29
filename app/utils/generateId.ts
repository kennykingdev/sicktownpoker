import { customAlphabet } from "nanoid";

// With this alphabet and id length:
// generating 1000 ID's per hour, it would take about 224 years,
// or 1 billion IDs,
// to have a 1% chance of collision.

// custom alphabet is intended to have no lookalike characters
const ID_ALPHABET = "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz";
export const ID_LENGTH = 12;

// Will be used for validation
export const idRegex = new RegExp(`^[${ID_ALPHABET}]{${ID_LENGTH}}$`);

export const generateId = customAlphabet(ID_ALPHABET, ID_LENGTH);
