import {
  ConnectorDefinition,
  GeneralRecord,
  InstillStore,
  useInstillStore,
} from "../../lib";
import {
  PipelineComponentReference,
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveTransformToString,
} from "../pipeline-builder";
import { ResourceComponentForm } from "../resource";
import { useShallow } from "zustand/react/shallow";

export type AIComponentAutoFormProps = {
  connectorDefinition: ConnectorDefinition;
  configuration: GeneralRecord;
  disabledAll?: boolean;
  componentID?: string;
};

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const AIComponentAutoForm = (props: AIComponentAutoFormProps) => {
  const {
    nodes,
    updateNodes,
    updateEdges,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function onSubmit(data: any) {
    if (!selectedConnectorNodeId) return;
    const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(
      recursiveTransformToString(data)
    );

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
