export function transformConnectorDefinitionIDToComponentIDPrefix(
  connectorID: string
) {
  return connectorID
    .split("-")
    .filter((item) => {
      if (
        item === "ai" ||
        item === "data" ||
        item === "destination" ||
        item === "airbyte" ||
        item === "blockchain"
      ) {
        return false;
      }

      return true;
    })
    .join("_");
}
