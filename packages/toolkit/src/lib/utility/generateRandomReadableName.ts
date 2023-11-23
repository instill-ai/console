import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function generateRandomReadableName() {
  return uniqueNamesGenerator({
    dictionaries: [adjectives, colors, animals],
    separator: "_",
  });
}
