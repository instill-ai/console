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

  if (
    instillAcceptFormats.length === 1 &&
    instillAcceptFormats[0] === "string"
  ) {
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

    for (const hint of hints) {
      if (allowStringifyTypes.includes(hint.instillFormat)) {
        pickHints.push(hint);
      }

      if (hint.instillFormat.includes("/")) {
        // We will include both array and non-array semi-structured and structured
        const [type] = hint.instillFormat.replaceAll("array:", "").split("/");

        if (type === "semi-structured") {
          pickHints.push(hint);
        }

        if (type === "structured") {
          pickHints.push(hint);
        }
      }
    }
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

      // Deal with array:*
      if (instillAcceptFormats.includes("array:*")) {
        pickHints.push(hint);
      }

      // Deal with something like array:image/png, array:image/* or array:audio/*

      if (hint.instillFormat.includes("/")) {
        const [type, subtype] = hint.instillFormat.split("/");

        // If the instillFormat is array:image/* and the accept format is image/png
        // then we should pick this hint
        if (subtype === "*") {
          if (instillAcceptFormats.some((format) => format.includes(type))) {
            pickHints.push(hint);
          }
        }

        // If the instillFormat is array:image/png and the accept format is image/*
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
        }

        if (instillAcceptFormats.includes(`array:${hint.instillFormat}`)) {
          pickHints.push(hint);
        }
      } else {
        if (instillAcceptFormats.includes(`array:${hint.instillFormat}`)) {
          pickHints.push(hint);
        }
      }
    }

    // Deal with <type>/<subtype>
    if (hint.instillFormat.includes("/")) {
      const [type, subtype] = hint.instillFormat.split("/");

      // If the instillFormat is image/* and the accept format is image/png
      // then we should pick this hint
      if (subtype === "*") {
        if (instillAcceptFormats.includes(type)) {
          pickHints.push(hint);
        }
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
      }

      // Deal with semi-structured. Now we have semi-structured/object
      // and semi-structured/*, in the view of smart-hint they support the same
      // structure
      if (
        type === "semi-structured" &&
        instillAcceptFormats.some((format) =>
          format.includes("semi-structured")
        )
      ) {
        pickHints.push(hint);
      }
    }

    // Deal with primitives
    if (instillAcceptFormats.includes(hint.instillFormat)) {
      pickHints.push(hint);
    }
  }

  return pickHints;
}
