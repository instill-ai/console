export function transformConnectorDefinitionIDToComponentIDPrefix(id: string) {
  return id
    .split("-")
    .filter((item) => {
      if (
        item === "ai" ||
        item === "data" ||
        item === "destination" ||
        item === "airbyte" ||
        item === "application" ||
        item === "op"
      ) {
        return false;
      }

      return true;
    })
    .join("_");
}
