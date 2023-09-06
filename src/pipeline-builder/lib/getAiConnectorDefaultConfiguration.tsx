export function getAiConnectorDefaultConfiguration(
  connector_definition_name: string
) {
  switch (connector_definition_name) {
    case "connector-definitions/ai-instill-model":
      return {
        input: {
          task: null,
        },
      };
    case "connector-definitions/ai-openai":
      return {
        input: {
          task: null,
        },
      };

    case "connector-definitions/ai-stability-ai":
      return {
        input: {
          task: null,
        },
      };
    default:
      return null;
  }
}
