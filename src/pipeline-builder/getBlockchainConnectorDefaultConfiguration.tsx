export function getBlockchainConnectorDefaultConfiguration(
  connector_definition_name: string
) {
  switch (connector_definition_name) {
    case "connector-definitions/blockchain-numbers":
      return {
        input: {
          images: null,
          asset_creator: null,
          abstract: null,
          custom: {
            digital_source_type: "trainedAlgorithmicMedia",
            mining_preference: "notAllowed",
            generated_through: null,
            generated_by: null,
            creator_wallet: null,
            license: {
              name: null,
              document: null,
            },
          },
        },
      };
    default:
      return null;
  }
}
