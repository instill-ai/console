import { Nullable, StartOperatorInputType } from "../../../../lib";

export function pickSelectedTypeFromInstillFormat(
  instillFormat: string
): Nullable<StartOperatorInputType> {
  switch (instillFormat) {
    case "string":
    case "array:string": {
      return "string";
    }
    case "audio/*":
    case "array:audio/*": {
      return "audio/*";
    }
    case "boolean":
    case "array:boolean": {
      return "boolean";
    }
    case "image/*":
    case "array:image/*": {
      return "image/*";
    }
    case "number":
    case "array:number": {
      return "number";
    }

    default:
      return null;
  }
}
