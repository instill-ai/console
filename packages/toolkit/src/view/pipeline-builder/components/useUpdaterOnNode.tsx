import * as React from "react";
import {
  GeneralRecord,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  ZodAnyValidatorSchema,
  useInstillStore,
} from "../../../lib";
import isEqual from "lodash.isequal";
import { useShallow } from "zustand/react/shallow";
import { composeEdgesFromNodes } from "../lib";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateEdges: store.updateEdges,
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
});

export function useUpdaterOnNode({
  id,
  nodeType,
  form,
  ValidatorSchema,
  configuration,
}: {
  id: string;
  nodeType: "connector" | "operator";
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
  configuration: GeneralRecord;
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

    if (values.task !== configuration.task) {
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

    timer.current = setTimeout(() => {
      const newNodes = nodes.map((node) => {
        if (
          nodeType === "connector" &&
          node.data.nodeType === "connector" &&
          node.id === id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              component: {
                ...node.data.component,
                configuration:
                  parsed.data.task === node.data.component.configuration.task
                    ? {
                        ...node.data.component.configuration,
                        task: parsed.data.task,
                        input: {
                          ...node.data.component.configuration.input,
                          ...parsed.data.input,
                        },
                      }
                    : {
                        ...node.data.component.configuration,
                        task: parsed.data.task,
                        input: parsed.data.input,
                      },
              },
            },
          };
        }

        if (
          nodeType === "operator" &&
          node.data.nodeType === "operator" &&
          node.id === id
        ) {
          return {
            ...node,
            data: {
              ...node.data,
              component: {
                ...node.data.component,
                configuration:
                  parsed.data.task === node.data.component.configuration.task
                    ? {
                        ...node.data.component.configuration,
                        task: parsed.data.task,
                        input: {
                          ...node.data.component.configuration.input,
                          ...parsed.data.input,
                        },
                      }
                    : {
                        ...node.data.component.configuration,
                        task: parsed.data.task,
                        input: parsed.data.input,
                      },
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
    id,
    nodeType,
    updateNodes,
    updatePipelineRecipeIsDirty,
    updateCurrentAdvancedConfigurationNodeID,
    configuration,
    nodes,
    updateEdges,
  ]);
}
