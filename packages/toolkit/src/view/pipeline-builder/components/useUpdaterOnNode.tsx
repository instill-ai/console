import * as React from "react";
import * as z from "zod";
import {
  GeneralRecord,
  GeneralUseFormReturn,
  InstillStore,
  Nullable,
  useInstillStore,
} from "../../../lib";
import isEqual from "lodash.isequal";
import { useShallow } from "zustand/react/shallow";

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
});

export function useUpdaterOnNode({
  id,
  nodeType,
  form,
  ValidatorSchema,
}: {
  id: string;
  nodeType: "connector" | "operator";
  form: GeneralUseFormReturn;
  ValidatorSchema: z.ZodType<any, any, any>;
}) {
  const { updateNodes, updatePipelineRecipeIsDirty } = useInstillStore(
    useShallow(selector)
  );

  const { getValues, trigger } = form;

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
      });
      updatePipelineRecipeIsDirty(() => true);
      updatedValue.current = parsed.data;
    }, 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [values, ValidatorSchema]);
}
