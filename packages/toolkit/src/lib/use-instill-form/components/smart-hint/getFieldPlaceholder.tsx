export const getFieldPlaceholder = (types: string[]) => {
  const supportPrimitives = types.includes("value");

  const supportReference = types.includes("reference");

  const supportTemplate = types.includes("template");

  let placeholder = "";

  if (supportPrimitives) {
    placeholder += "Enter a value";
  }

  if (supportReference || supportTemplate) {
    if (supportPrimitives) {
      placeholder += ", or use ${} to reference data";
    } else {
      placeholder += "Use ${} to reference data";
    }
  }

  return placeholder;
};
