import { SmartHint } from "./types";

export function pickSmartHintsFromAcceptFormats(
  hints: SmartHint[],
  instillAcceptFormats: string[]
): SmartHint[] {
  const pickHints: SmartHint[] = [];

  // Deal with */* -> means it accepts all types
  if (instillAcceptFormats.includes("*/*")) {
    return hints;
  }

  for (const hint of hints) {
    // Deal with array
    if (hint.type === "array") {
      // Deal with objectArray
      if (hint.properties) {
        const childPickHints = pickSmartHintsFromAcceptFormats(
          hint.properties,
          instillAcceptFormats
        );

        if (childPickHints.length > 0) {
          pickHints.push({
            ...hint,
            properties: childPickHints,
          });
        }
        // Deal with array type
      } else {
        if (instillAcceptFormats.includes(`array:${hint.instillFormat}`)) {
          pickHints.push(hint);
        }
      }
    }

    // Deal with <type>/<subtype>
    if (hint.instillFormat.includes("/")) {
      const [type, subtype] = hint.instillFormat.split("/");

      // Deal with glob type
      if (subtype === "*") {
        if (instillAcceptFormats.includes(type)) {
          pickHints.push(hint);
        }
      }
    }

    // Deal with primitives
    if (instillAcceptFormats.includes(hint.instillFormat)) {
      pickHints.push(hint);
    }
  }

  return pickHints;
}
