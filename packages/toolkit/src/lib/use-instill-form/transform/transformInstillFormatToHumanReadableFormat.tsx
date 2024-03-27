import { InstillHumanReadableFormat } from "../types";

export function transformInstillFormatToHumanReadableFormat(
  format: string,
  arrayInArray?: boolean
): InstillHumanReadableFormat {
  if (format.includes("array:")) {
    if (arrayInArray) {
      return {
        isArray: true,
        format: "array:" + transformPrimitive(format.replace("array:", "")),
      };
    }

    return {
      isArray: true,
      format: transformPrimitive(format.replace("array:", "")),
    };
  }

  return {
    isArray: false,
    format: transformPrimitive(format),
  };
}

function transformPrimitive(primitive: string) {
  if (primitive === "*/*") {
    return "any";
  }

  if (!primitive.includes("/")) {
    return primitive;
  }

  const [type, subType] = primitive.split("/");

  if (subType.includes("*")) {
    return type;
  }

  return primitive;
}
