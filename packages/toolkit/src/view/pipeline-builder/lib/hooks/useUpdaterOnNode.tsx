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
import { ConnectorNodeData, OperatorNodeData } from "../../type";
import {
  isConnectorComponent,
  isOperatorComponent,
} from "../checkComponentType";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateEdges: store.updateEdges,
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
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
    updateCurrentAdvancedConfigurationNodeID,
  } = useInstillStore(useShallow(selector));

  const { getValues } = form;

  const values = getValues();

  const updatedValue = React.useRef<Nullable<GeneralRecord>>(null);

  const timer = React.useRef<NodeJS.Timeout>();

  // We don't rely on the react-hook-form isValid and isDirty state
  // because the isHidden fields make the formStart inacurate.
  React.useEffect(() => {
    const parsed = ValidatorSchema.safeParse(values);
    const configuration =
      getConnectorOperatorComponentConfiguration(currentNodeData);

    if (
      (isConnectorComponent(currentNodeData) &&
        values.task !== currentNodeData.connector_component.task) ||
      (isOperatorComponent(currentNodeData) &&
        values.task !== currentNodeData.operator_component.task)
    ) {
      updateCurrentAdvancedConfigurationNodeID(() => null);
    }

    if (!parsed.success) {
      return;
    }

    if (isEqual(configuration, parsed.data)) {
      return;
    }

    if (updatedValue.current && isEqual(updatedValue.current, parsed.data)) {
      return;
    }

    if (timer.current) {
      clearTimeout(timer.current);
    }

    console.log(parsed.data);

    timer.current = setTimeout(() => {
      const newNodes = nodes.map((node) => {
        if (
          isConnectorComponent(node.data) &&
          isConnectorComponent(currentNodeData) &&
          node.id === currentNodeData.id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              connector_component: {
                ...node.data.connector_component,
                input: {
                  ...node.data.connector_component.input,
                  ...parsed.data.input,
                },
                task: parsed.data.task,
              },
            },
          };
        }

        if (
          isOperatorComponent(node.data) &&
          isOperatorComponent(currentNodeData) &&
          node.id === currentNodeData.id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              operator_component: {
                ...node.data.operator_component,
                input: {
                  ...node.data.operator_component.input,
                  ...parsed.data.input,
                },
                task: parsed.data.task,
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
    updateCurrentAdvancedConfigurationNodeID,
    currentNodeData,
    nodes,
    updateEdges,
  ]);
}
