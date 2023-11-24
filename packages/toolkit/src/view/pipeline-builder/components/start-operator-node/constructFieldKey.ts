export function constructFieldKey(str: string) {
  let fieldKey = str.replaceAll(/[^a-zA-Z0-9 ]/g, "_");

  fieldKey = fieldKey.replaceAll(" ", "_").toLowerCase();

  // The first character of a field key cannot be a number
  if (fieldKey.match(/^[0-9]/)) {
    fieldKey = "_" + fieldKey;
  }

  // The first character of a field key cannot be a hyphen

  if (fieldKey.match(/^[-]/)) {
    fieldKey = "_" + fieldKey;
  }

  return fieldKey;
}
