import { InstillHumanReadableFormat } from "../type";

export function transformInstillFormatToHumanReadableFormat(
  format: string
): InstillHumanReadableFormat {
  if (format.includes("array:")) {
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
  if (!primitive.includes("/")) {
    return primitive;
  }

  const [type, subType] = primitive.split("/");

  if (subType.includes("*")) {
    return type;
  }

  return primitive;
}
