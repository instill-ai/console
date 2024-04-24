import * as React from "react";
import {
  GeneralRecord,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  ZodAnyValidatorSchema,
  useInstillStore,
} from "../../../../lib";
import isEqual from "lodash.isequal";
import { useShallow } from "zustand/react/shallow";
import {
  composeEdgesFromNodes,
  getConnectorOperatorComponentConfiguration,
  isConnectorNode,
  isIteratorNode,
  isOperatorNode,
} from "..";
import { ConnectorNodeData, NodeData, OperatorNodeData } from "../../type";

import { Node } from "reactflow";
import debounce from "lodash.debounce";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
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
  const { nodes, updateNodes, updateEdges, updatePipelineRecipeIsDirty } =
    useInstillStore(useShallow(selector));

  const {
    getValues,
    formState: { isDirty },
    trigger,
  } = form;

  const values = getValues();

  const updatedValue = React.useRef<Nullable<GeneralRecord>>(null);

  const debounceUpdater = React.useCallback(
    debounce((updateData) => {
      const newNodes: Node<NodeData>[] = nodes.map((node) => {
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
      updatedValue.current = updateData;
    }, 300),
    [
      currentNodeData,
      nodes,
      updateEdges,
      updateNodes,
      updatePipelineRecipeIsDirty,
    ]
  );

  // We don't fully rely on the react-hook-form isValid and isDirty state
  // because the isHidden fields make the formStart inacurate.
  React.useEffect(() => {
    const parsed = ValidatorSchema.safeParse(values);

    const configuration =
      getConnectorOperatorComponentConfiguration(currentNodeData);

    if (!parsed.success) {
      return;
    }

    // We use the isDirty only for the initial render. After that we rely on the
    // isEqual to check if the configuration has changed.
    if (isEqual(configuration, parsed.data) || !isDirty) {
      return;
    }

    if (updatedValue.current && isEqual(updatedValue.current, parsed.data)) {
      return;
    }

    debounceUpdater(parsed.data);
  }, [
    values,
    ValidatorSchema,
    updateNodes,
    updatePipelineRecipeIsDirty,
    nodes,
    updateEdges,
    currentNodeData,
    isDirty,
    trigger,
    debounceUpdater,
  ]);
}
