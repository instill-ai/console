import { ConnectorDefinition, GeneralRecord } from "../../lib";
import {
  PipelineBuilderStore,
  PipelineComponentReference,
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
  recursiveReplaceNullAndEmptyStringWithUndefined,
  usePipelineBuilderStore,
} from "../pipeline-builder";
import { shallow } from "zustand/shallow";
import { ResourceComponentForm } from "../resource";

export type AIComponentAutoFormProps = {
  connectorDefinition: ConnectorDefinition;
  configuration: GeneralRecord;
  disabledAll?: boolean;
};

const pipelineBuilderSelector = (state: PipelineBuilderStore) => ({
  nodes: state.nodes,
  updateNodes: state.updateNodes,
  updateEdges: state.updateEdges,
  selectedConnectorNodeId: state.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: state.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: state.updatePipelineRecipeIsDirty,
});

export const AIComponentAutoForm = (props: AIComponentAutoFormProps) => {
  const {
    nodes,
    updateNodes,
    updateEdges,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
  } = usePipelineBuilderStore(pipelineBuilderSelector, shallow);

  function onSubmit(data: any) {
    if (!selectedConnectorNodeId) return;
    const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(data);

    const newNodes = nodes.map((node) => {
      if (
        node.id === selectedConnectorNodeId &&
        node.data.nodeType === "connector"
      ) {
        return {
          ...node,
          data: {
            ...node.data,
            component: {
              ...node.data.component,
              configuration: {
                ...modifiedData,
                connector_definition_name: undefined,
              },
            },
          },
        };
      }
      return node;
    });

    updateNodes(() => newNodes);

    const allReferences: PipelineComponentReference[] = [];

    newNodes.forEach((node) => {
      if (node.data.component?.configuration) {
        allReferences.push(
          ...extractReferencesFromConfiguration(
            node.data.component?.configuration,
            node.id
          )
        );
      }
    });

    const newEdges = composeEdgesFromReferences(allReferences, newNodes);

    updateEdges(() => newEdges);
    updateSelectedConnectorNodeId(() => null);
    updatePipelineRecipeIsDirty(() => true);
  }

  return <ResourceComponentForm {...props} onSubmit={onSubmit} />;
};
