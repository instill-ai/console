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
import {
  composeEdgesFromNodes,
  isConnectorNode,
  isIteratorNode,
  isOperatorNode,
} from "..";
import { ConnectorNodeData, NodeData, OperatorNodeData } from "../../type";

import { Node } from "reactflow";
import debounce from "lodash.debounce";
import isEqual from "lodash.isequal";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export function useUpdaterOnRightPanel({
  form,
  ValidatorSchema,
  currentNodeData,
}: {
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
  currentNodeData: ConnectorNodeData | OperatorNodeData;
}) {
  const {
    nodes,
    updateNodes,
    updateEdges,
    pipelineIsReadOnly,
    updatePipelineRecipeIsDirty,
  } = useInstillStore(useShallow(selector));

  const {
    formState: { isDirty },
    watch,
  } = form;

  const prevValue = React.useRef<Nullable<GeneralRecord>>(null);

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
        const newNodes: Node<NodeData>[] = nodes.map((node) => {
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
                  task: updateData.task,
                  condition: updateData.condition,
                  input: updateData.input,
                },
              },
            };
          }

          if (isIteratorNode(node)) {
            return node;
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
    [updateEdges, updateNodes, updatePipelineRecipeIsDirty]
  );

  React.useEffect(() => {
    const sub = watch((values) => {
      if (pipelineIsReadOnly) {
        return;
      }

      const parsed = ValidatorSchema.safeParse(values);

      // RHF isDiry state is not working correctly, at the first input
      // the state won't be updated, so we need to check by ourselves
      if (!parsed.success || isEqual(prevValue.current, parsed.data)) {
        return;
      }

      form.handleSubmit(() => {
        debounceUpdater({
          updateData: parsed.data,
          nodeID: currentNodeData.id,
          nodes,
        });
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
    pipelineIsReadOnly,
    debounceUpdater,
  ]);
}
