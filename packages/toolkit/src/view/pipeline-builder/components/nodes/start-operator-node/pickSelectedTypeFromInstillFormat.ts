import { Nullable, StartOperatorInputType } from "../../../../../lib";

export function pickSelectedTypeFromInstillFormat(
  instillFormat: string
): Nullable<StartOperatorInputType> {
  switch (instillFormat) {
    case "string": {
      return "string";
    }
    case "array:string": {
      return "array:string";
    }
    case "audio/*": {
      return "audio/*";
    }
    case "array:audio/*": {
      return "array:audio/*";
    }
    case "boolean": {
      return "boolean";
    }
    case "image/*": {
      return "image/*";
    }
    case "array:image/*": {
      return "array:image/*";
    }
    case "video/*": {
      return "video/*";
    }
    case "array:video/*": {
      return "array:video/*";
    }
    case "number": {
      return "number";
    }
    case "*/*": {
      return "*/*";
    }
    case "array:*/*": {
      return "array:*/*";
    }
    case "semi-structured/json": {
      return "semi-structured/json";
    }
    default:
      return null;
  }
}
