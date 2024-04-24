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
  isOperatorNode,
} from "..";
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
  } = useInstillStore(useShallow(selector));

  const { getValues } = form;

  const values = getValues();

  const updatedValue = React.useRef<Nullable<GeneralRecord>>(null);

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

    // When the right panel is open we only update the configuration
    // on right-panel updater
    if (currentAdvancedConfigurationNodeID) {
      return;
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

    debounceUpdater(parsed.data);
  }, [
    values,
    ValidatorSchema,
    updateNodes,
    updatePipelineRecipeIsDirty,
    currentAdvancedConfigurationNodeID,
    updateCurrentAdvancedConfigurationNodeID,
    currentNodeData,
    nodes,
    updateEdges,
    debounceUpdater,
  ]);
}
