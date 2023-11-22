import * as React from "react";
import {
  CheckIsHidden,
  GeneralRecord,
  InstillStore,
  OperatorDefinition,
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

export type OperatorComponentAutoFormProps = {
  definition: OperatorDefinition;
  configuration: GeneralRecord;
  disabledAll?: boolean;
  componentID?: string;
};

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export const OperatorComponentAutoForm = (
  props: OperatorComponentAutoFormProps
) => {
  const {
    nodes,
    updateNodes,
    updateEdges,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  const checkIsHidden: CheckIsHidden = React.useCallback(
    ({ parentSchema, targetPath, targetKey, targetSchema }) => {
      if (!targetKey || !targetPath) {
        return true;
      }

      // We don't want to showcase task selection on the right-panel
      if (targetPath && targetPath === "task") {
        return true;
      }

      if (
        targetKey &&
        parentSchema &&
        parentSchema.instillEditOnNodeFields &&
        parentSchema.instillEditOnNodeFields.includes(targetKey)
      ) {
        return true;
      }

      return false;
    },
    []
  );

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  function onSubmit(data: any) {
    if (!currentAdvancedConfigurationNodeID) return;
    const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(
      recursiveTransformToString(data)
    );

    const newNodes = nodes.map((node) => {
      if (
        node.id === currentAdvancedConfigurationNodeID &&
        node.data.nodeType === "operator"
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
    updateCurrentAdvancedConfigurationNodeID(() => null);
    updatePipelineRecipeIsDirty(() => true);
  }

  return (
    <ResourceComponentForm
      {...props}
      onSubmit={onSubmit}
      checkIsHidden={checkIsHidden}
    />
  );
};
