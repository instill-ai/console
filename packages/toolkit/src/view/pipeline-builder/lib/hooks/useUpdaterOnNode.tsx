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
import { ConnectorNodeData, NodeData, OperatorNodeData } from "../../type";
import {
  isConnectorComponent,
  isOperatorComponent,
} from "../checkComponentType";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";
import { Node } from "reactflow";

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

  const { watch } = form;

  const debounceUpdater = React.useCallback(
    debounce(
      ({
        nodeID,
        updateData,
        nodes,
      }: {
        nodeID: string;
        updateData: GeneralRecord;
        nodes: Node<NodeData>[];
      }) => {
        const newNodes = nodes.map((node) => {
          if (isConnectorNode(node) && node.id === nodeID) {
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

          if (isOperatorNode(node) && node.id === nodeID) {
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
        prevValue.current = updateData;
      },
      300
    ),
    [currentNodeData, updateEdges, updateNodes, updatePipelineRecipeIsDirty]
  );

  const prevValue = React.useRef<Nullable<GeneralRecord>>(null);

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

      // RHF isDiry state is not working correctly, at the first input
      // the state won't be updated, so we need to check by ourselves
      if (!parsed.success || isEqual(prevValue.current, parsed.data)) {
        return;
      }

      form.handleSubmit(() => {
        debounceUpdater({
          updateData: parsed.data,
          nodes,
          nodeID: currentNodeData.id,
        });
      })();
    });

    return () => {
      sub.unsubscribe();
    };
  }, [
    nodes,
    watch,
    currentNodeData,
    ValidatorSchema,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    pipelineIsReadOnly,
    debounceUpdater,
    form,
  ]);
}
