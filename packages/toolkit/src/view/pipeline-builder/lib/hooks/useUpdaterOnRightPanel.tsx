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
} from "..";
import { ConnectorNodeData, NodeData, OperatorNodeData } from "../../type";
import {
  isConnectorComponent,
  isIteratorComponent,
  isOperatorComponent,
} from "../checkComponentType";
import { Node } from "reactflow";

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
  } = form;

  const values = getValues();

  const updatedValue = React.useRef<Nullable<GeneralRecord>>(null);

  const timer = React.useRef<NodeJS.Timeout>();

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

    if (timer.current) {
      clearTimeout(timer.current);
    }

    timer.current = setTimeout(() => {
      const newNodes: Node<NodeData>[] = nodes.map((node) => {
        if (
          isConnectorComponent(currentNodeData) &&
          isConnectorComponent(node.data) &&
          node.id === currentNodeData.id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              connector_component: {
                ...node.data.connector_component,
                task: parsed.data.task,
                condition: parsed.data.condition,
                input: {
                  ...node.data.connector_component.input,
                  ...parsed.data.input,
                },
              },
            },
          };
        }

        if (
          isOperatorComponent(currentNodeData) &&
          isOperatorComponent(node.data) &&
          node.id === currentNodeData.id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              operator_component: {
                ...node.data.operator_component,
                task: parsed.data.task,
                condition: parsed.data.condition,
                input: {
                  ...node.data.operator_component.input,
                  ...parsed.data.input,
                },
              },
            },
          };
        }

        if (
          isIteratorComponent(currentNodeData) &&
          isIteratorComponent(node.data)
        ) {
          return node;
        }

        return node;
      });

      updateNodes(() => newNodes);
      const newEdges = composeEdgesFromNodes(newNodes);
      updateEdges(() => newEdges);
      updatePipelineRecipeIsDirty(() => true);
      updatedValue.current = parsed.data;
    }, 300);
    return () => {
      clearTimeout(timer.current);
    };
  }, [
    values,
    ValidatorSchema,
    updateNodes,
    updatePipelineRecipeIsDirty,
    nodes,
    updateEdges,
    currentNodeData,
    isDirty,
  ]);
}
