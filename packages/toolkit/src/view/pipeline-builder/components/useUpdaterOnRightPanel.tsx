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
import { PipelineComponentReference } from "../type";
import {
  composeEdgesFromReferences,
  extractReferencesFromConfiguration,
} from "../lib";

const selector = (store: InstillStore) => ({
  nodes: store.nodes,
  updateNodes: store.updateNodes,
  updateEdges: store.updateEdges,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export function useUpdaterOnRightPanel({
  id,
  nodeType,
  form,
  ValidatorSchema,
}: {
  id: string;
  nodeType: "connector" | "operator";
  form: GeneralUseFormReturn;
  ValidatorSchema: ZodAnyValidatorSchema;
}) {
  const { nodes, updateNodes, updateEdges, updatePipelineRecipeIsDirty } =
    useInstillStore(useShallow(selector));

  const { getValues } = form;

  const values = getValues();

  const updatedValue = React.useRef<Nullable<GeneralRecord>>(null);

  // We don't rely on the react-hook-form isValid and isDirty state
  // because the isHidden fields make the formStart inacurate.
  React.useEffect(() => {
    const parsed = ValidatorSchema.safeParse(values);

    if (!parsed.success) {
      return;
    }

    if (updatedValue.current && isEqual(updatedValue.current, parsed.data)) {
      return;
    }

    const timer = setTimeout(() => {
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
                configuration: {
                  ...node.data.component.configuration,
                  task: parsed.data.task,
                  input: {
                    ...node.data.component.configuration.input,
                    ...parsed.data.input,
                  },
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
                configuration: {
                  ...node.data.component.configuration,
                  task: parsed.data.task,
                  input: {
                    ...node.data.component.configuration.input,
                    ...parsed.data.input,
                  },
                },
              },
            },
          };
        }

        return node;
      });

      updateNodes(() => newNodes);

      const allReferences: PipelineComponentReference[] = [];

      newNodes.forEach((node) => {
        if (node.data.component?.configuration) {
          allReferences.push(
            ...extractReferencesFromConfiguration(
              node.data.component?.configuration,
              node.id
            )
          );
        }
      });

      const newEdges = composeEdgesFromReferences(allReferences, newNodes);
      updateEdges(() => newEdges);
      updatePipelineRecipeIsDirty(() => true);
      updatedValue.current = parsed.data;
    }, 1);
    return () => {
      clearTimeout(timer);
    };
  }, [
    values,
    ValidatorSchema,
    nodeType,
    id,
    updateNodes,
    updatePipelineRecipeIsDirty,
  ]);
}
