export function getAiConnectorDefaultConfiguration(
  connector_definition_name: string
) {
  switch (connector_definition_name) {
    case "connector-definitions/ai-instill-model":
      return {
        task: null,
        input: {},
      };
    case "connector-definitions/ai-openai":
      return {
        task: null,
        input: {},
      };

    case "connector-definitions/ai-stability-ai":
      return {
        task: null,
        input: {},
      };
    default:
      return null;
  }
}
