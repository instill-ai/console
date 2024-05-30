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
import { composeEdgesFromNodes, isGeneralNode } from "..";
import { GeneralNodeData, NodeData } from "../../type";

import debounce from "lodash.debounce";
import { Node } from "reactflow";
import { isPipelineGeneralComponent } from "../checkComponentType";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateEdges: store.updateEdges,
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  selectedConnectorNodeId: store.selectedConnectorNodeId,
  updateSelectedConnectorNodeId: store.updateSelectedConnectorNodeId,
  pipelineIsReadOnly: store.pipelineIsReadOnly,
  rightPanelIsOpen: store.rightPanelIsOpen,
});

export function useUpdaterOnNode({
  nodeID,
  currentNodeData,
  form,
  ValidatorSchema,
}: {
  nodeID: string;
  currentNodeData: GeneralNodeData;
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
}) {
  const {
    nodes,
    updateNodes,
    updateEdges,
    updatePipelineRecipeIsDirty,
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    pipelineIsReadOnly,
    rightPanelIsOpen,
  } = useInstillStore(useShallow(selector));

  const { watch } = form;

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
        const newNodes = nodes.map((node) => {
          if (isGeneralNode(node) && node.id === id) {
            return {
              ...node,
              data: {
                ...node.data,
                task: updateData.task,
                condition: updateData.condition,
                input: updateData.input,
                setup: updateData.setup,
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
      300,
    ),
    [currentNodeData, updateEdges, updateNodes, updatePipelineRecipeIsDirty],
  );

  const prevValue = React.useRef<Nullable<GeneralRecord>>(null);

  React.useEffect(() => {
    const sub = watch((values) => {
      console.log("debounceUpdater", values);
      if (pipelineIsReadOnly) {
        return;
      }

      // const parsed = ValidatorSchema.safeParse(values);

      if (
        isPipelineGeneralComponent(currentNodeData) &&
        values.task !== currentNodeData.task
      ) {
        updateSelectedConnectorNodeId(() => null);
      }

      // When the right panel is open we only update the configuration
      // on right-panel updater
      if (selectedConnectorNodeId && rightPanelIsOpen) {
        return;
      }

      // // RHF isDiry state is not working correctly, at the first input
      // // the state won't be updated, so we need to check by ourselves
      // if (!parsed.success || isEqual(prevValue.current, parsed.data)) {
      //   return;
      // }

      form.handleSubmit(() => {
        debounceUpdater({
          updateData: values,
          nodes,
          id: nodeID,
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
    selectedConnectorNodeId,
    updateSelectedConnectorNodeId,
    pipelineIsReadOnly,
    debounceUpdater,
    form,
    nodeID,
    rightPanelIsOpen,
  ]);
}
