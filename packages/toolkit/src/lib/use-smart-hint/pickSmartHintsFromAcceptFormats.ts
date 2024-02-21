import { SmartHint } from "./types";

export function pickSmartHintsFromAcceptFormats(
  hints: SmartHint[],
  instillAcceptFormats: string[]
): SmartHint[] {
  const pickHints: SmartHint[] = [];

  if (instillAcceptFormats.includes("*")) {
    return hints;
  }

  // Deal with */* -> means it accepts all types
  if (instillAcceptFormats.includes("*/*")) {
    return hints;
  }

  for (const hint of hints) {
    // Deal with objectArray
    if (hint.type === "array" && hint.properties) {
      const childPickHints = pickSmartHintsFromAcceptFormats(
        hint.properties,
        instillAcceptFormats
      );

      if (childPickHints.length > 0) {
        pickHints.push({
          ...hint,
          properties: childPickHints,
        });
        continue;
      }
    }

    // Deal with stringify hint
    if (
      instillAcceptFormats.length === 1 &&
      instillAcceptFormats[0] === "string" &&
      isAllowedStringifyHint(hint)
    ) {
      pickHints.push(hint);
      continue;
    }

    // Deal with array
    if (hint.type === "array") {
      // Deal with array type direct match
      if (instillAcceptFormats.includes(`array:${hint.instillFormat}`)) {
        pickHints.push(hint);
        continue;
      }

      // Deal with array:*
      if (instillAcceptFormats.includes("array:*")) {
        pickHints.push(hint);
        continue;
      }

      // Deal with array:image/png, array:image/* or array:audio/* ... etc
      if (hint.instillFormat.includes("/")) {
        const [type, subtype] = hint.instillFormat.split("/");

        // If the instillFormat is array:image/* and the accept format is array:image/png
        // then we should pick this hint
        if (subtype === "*") {
          if (instillAcceptFormats.some((format) => format.includes(type))) {
            pickHints.push(hint);
            continue;
          }
        }

        // If the instillFormat is array:image/png and the accept format is array:image/*
        // then we should pick this hint
        if (
          instillAcceptFormats.some((format) => {
            if (format.includes("array")) {
              const [formatType, formatSubtype] = format
                .replace("array:", "")
                .split("/");

              if (formatSubtype === "*") {
                return formatType === type;
              }
            }
          })
        ) {
          pickHints.push(hint);
          continue;
        }
      }
    }

    // Deal with <type>/<subtype>
    if (hint.instillFormat.includes("/")) {
      const [type, subtype] = hint.instillFormat.split("/");

      // If the instillFormat is image/* and the accept format is image/png
      // then we should pick this hint
      if (subtype === "*" && instillAcceptFormats.includes(type)) {
        pickHints.push(hint);
        continue;
      }

      // If the instillFormat is image/png and the accept format is image/*
      // then we should pick this hint
      if (
        instillAcceptFormats.some((format) => {
          if (!format.includes("array")) {
            const [formatType, formatSubtype] = format.split("/");

            if (formatSubtype === "*") {
              return formatType === type;
            }
          }
        })
      ) {
        pickHints.push(hint);
        continue;
      }

      // Deal with semi-structured. Now we have semi-structured/json
      // and semi-structured/*, in the view of smart-hint they support the same
      // structure
      if (
        type === "semi-structured" &&
        instillAcceptFormats.some((format) =>
          format.includes("semi-structured")
        )
      ) {
        pickHints.push(hint);
        continue;
      }

      console.log(instillAcceptFormats, hint.instillFormat, "here");

      // Deal with direct match
      if (instillAcceptFormats.includes(hint.instillFormat)) {
        pickHints.push(hint);
        continue;
      }
    }

    // Deal with primitives
    if (instillAcceptFormats.includes(hint.instillFormat)) {
      pickHints.push(hint);
    }
  }

  return pickHints;
}

export function isAllowedStringifyHint(hint: SmartHint): boolean {
  // If the the field's instillAcceptFormats is string, we will automatically
  // convert the hint's field value to string. So we also need to pick
  // various other types
  // These are the value that can be stringified
  // bool
  // number
  // integer
  // string
  // object
  // semi-structured/*
  // structured/*
  // These are the value that can't be stringified
  // image/*
  // audio/*
  // video/*

  const allowStringifyTypes = [
    "boolean",
    "array:boolean",
    "number",
    "array:number",
    "integer",
    "array:integer",
    "string",
    "array:string",
    "object",
    "array:object",
  ];

  if (allowStringifyTypes.includes(hint.instillFormat)) {
    return true;
  }

  if (hint.instillFormat.includes("/")) {
    // We will include both array and non-array semi-structured and structured
    const [type] = hint.instillFormat.replaceAll("array:", "").split("/");

    if (type === "semi-structured") {
      return true;
    }

    if (type === "structured") {
      return true;
    }
  }

  return false;
}
