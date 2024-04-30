import * as React from "react";
import {
  GeneralRecord,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  ZodAnyValidatorSchema,
  useInstillStore,
} from "../../../../lib";
import { useShallow } from "zustand/react/shallow";
import { composeEdgesFromNodes, isConnectorNode, isOperatorNode } from "..";
import { ConnectorNodeData, OperatorNodeData } from "../../type";
import {
  isConnectorComponent,
  isOperatorComponent,
} from "../checkComponentType";
import debounce from "lodash.debounce";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateEdges: store.updateEdges,
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  currentAdvancedConfigurationNodeID: store.currentAdvancedConfigurationNodeID,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
});

export function useUpdaterOnNode({
  currentNodeData,
  form,
  ValidatorSchema,
}: {
  currentNodeData: OperatorNodeData | ConnectorNodeData;
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
}) {
  const {
    nodes,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    pipelineIsReadOnly,
  } = useInstillStore(useShallow(selector));

  const {
    formState: { isDirty },
    watch,
  } = form;

  const debounceUpdater = React.useCallback(
    debounce((updateData) => {
      const newNodes = nodes.map((node) => {
        if (isConnectorNode(node) && node.id === currentNodeData.id) {
          return {
            ...node,
            data: {
              ...node.data,
              connector_component: {
                ...node.data.connector_component,
                task: updateData.task,
                condition: updateData.condition,
                input: updateData.input,
                connection: updateData.connection,
              },
            },
          };
        }

        if (isOperatorNode(node) && node.id === currentNodeData.id) {
          return {
            ...node,
            data: {
              ...node.data,
              operator_component: {
                ...node.data.operator_component,
                input: updateData.input,
                task: updateData.task,
              },
            },
          };
        }

        return node;
      });

      updateNodes(() => newNodes);
      const newEdges = composeEdgesFromNodes(newNodes);
      updateEdges(() => newEdges);
      updatePipelineRecipeIsDirty(() => true);
    }, 300),
    [
      currentNodeData,
      nodes,
      updateEdges,
      updateNodes,
      updatePipelineRecipeIsDirty,
    ]
  );

  React.useEffect(() => {
    const sub = watch((values) => {
      if (pipelineIsReadOnly) {
        return;
      }

      const parsed = ValidatorSchema.safeParse(values);

      if (
        (isConnectorComponent(currentNodeData) &&
          values.task !== currentNodeData.connector_component.task) ||
        (isOperatorComponent(currentNodeData) &&
          values.task !== currentNodeData.operator_component.task)
      ) {
        updateCurrentAdvancedConfigurationNodeID(() => null);
      }

      // When the right panel is open we only update the configuration
      // on right-panel updater
      if (currentAdvancedConfigurationNodeID) {
        return;
      }

      if (!parsed.success || !isDirty) {
        return;
      }

      form.handleSubmit(() => {
        debounceUpdater(parsed.data);
      })();
    });

    return () => {
      sub.unsubscribe();
    };
  }, [
    watch,
    isDirty,
    currentNodeData,
    ValidatorSchema,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    pipelineIsReadOnly,
  ]);
}
