import {
  getDestinationDefinitionQuery,
  getDestinationQuery,
  getModelInstanceQuery,
  getSourceDefinitionQuery,
  getSourceQuery,
  ModelInstance,
  PipelineRecipe,
  RawPipelineRecipe,
} from "@/lib/instill";

const constructPipelineRecipeWithDefinition = async (
  rawRecipe: RawPipelineRecipe
): Promise<PipelineRecipe> => {
  try {
    const source = await getSourceQuery(rawRecipe.source);
    const sourceDefinition = await getSourceDefinitionQuery(
      source.source_connector_definition
    );
    const destination = await getDestinationQuery(rawRecipe.destination);
    const destinationDefinition = await getDestinationDefinitionQuery(
      destination.destination_connector_definition
    );
    const instances: ModelInstance[] = [];

    for (const modelInstanceName of rawRecipe.model_instances) {
      const modelInstance = await getModelInstanceQuery(modelInstanceName);
      instances.push(modelInstance);
    }

    const recipe: PipelineRecipe = {
      source: { ...source, source_connector_definition: sourceDefinition },
      destination: {
        ...destination,
        destination_connector_definition: destinationDefinition,
      },
      models: instances,
    };

    return Promise.resolve(recipe);
  } catch (err) {
    return Promise.reject(err);
  }
};

export default constructPipelineRecipeWithDefinition;
