export function constructFieldKey(str: string) {
  return str
    .replaceAll(/[^a-zA-Z0-9 ]/g, "")
    .replaceAll(" ", "_")
    .toLowerCase();
}
