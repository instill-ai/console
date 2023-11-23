export function getAiConnectorDefaultConfiguration(
  connector_definition_name: string
) {
  switch (connector_definition_name) {
    case "connector-definitions/instill_model":
      return {
        task: null,
        input: {},
      };
    case "connector-definitions/openai":
      return {
        task: null,
        input: {},
      };

    case "connector-definitions/stability_ai":
      return {
        task: null,
        input: {},
      };
    default:
      return null;
  }
}
