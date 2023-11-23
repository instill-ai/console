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

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
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
  const { updateNodes, updatePipelineRecipeIsDirty } = useInstillStore(
    useShallow(selector)
  );

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
      updateNodes((nodes) => {
        return nodes.map((node) => {
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
      });
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
