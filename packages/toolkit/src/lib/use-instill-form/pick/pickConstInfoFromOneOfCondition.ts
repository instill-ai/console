import { InstillJSONSchema } from "../types";

export function pickConstInfoFromOneOfCondition(
  properties: Record<string, InstillJSONSchema>
) {
  let constKey: null | string = null;
  let constValue: null | string = null;

  for (const [key, value] of Object.entries(properties)) {
    if (typeof value === "object" && value.const) {
      constKey = key;
      constValue = value.const as string;
      break;
    }
  }

  return {
    constKey,
    constValue,
  };
}
