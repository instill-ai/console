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
import { composeEdgesFromNodes, isIteratorNode } from "..";
import { GeneralNodeData, NodeData } from "../../type";

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
  nodeID,
  form,
  ValidatorSchema,
  currentNodeData,
}: {
  nodeID: string;
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
  currentNodeData: GeneralNodeData;
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
        id,
        updateData,
        nodes,
      }: {
        id: string;
        updateData: GeneralRecord;
        nodes: Node<NodeData>[];
      }) => {
        const newNodes: Node<NodeData>[] = nodes.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                task: updateData.task,
                condition: updateData.condition,
                input: updateData.input,
                connection: updateData.connection,
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
          id: nodeID,
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
    nodes,
    form,
    nodeID,
  ]);
}
