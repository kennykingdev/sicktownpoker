import { customAlphabet } from "nanoid";

// With this alphabet and id length:
// generating 1000 ID's per hour, it would take about 224 years,
// or 1 billion IDs,
// to have a 1% chance of collision.

// custom alphabet is intended to have no lookalike characters
const idAlphabet = "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz";
const idLength = 12;

// Will be used for validation
export const idRegex = new RegExp(`^[${idAlphabet}]{${idLength}}$`);

export const generateId = customAlphabet(idAlphabet, idLength);
