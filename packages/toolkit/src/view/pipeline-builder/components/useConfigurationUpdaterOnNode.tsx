import * as z from "zod";
import * as React from "react";
import {
  GeneralRecord,
  GeneralUseFormReturn,
  InstillStore,
  useDeepCompareEffect,
  useInstillStore,
} from "../../../lib";
import { useShallow } from "zustand/react/shallow";
import { Nullable } from "vitest";
import {
  recursiveReplaceNullAndEmptyStringWithUndefined,
  recursiveTransformToString,
} from "../lib";

const selector = (store: InstillStore) => ({
  updateNodes: store.updateNodes,
  updatePipelineRecipeIsDirty: store.updatePipelineRecipeIsDirty,
  updateCurrentAdvancedConfigurationNodeID:
    store.updateCurrentAdvancedConfigurationNodeID,
});

export function useConfigurationUpdaterOnNode({
  id,
  form,
  nodeType,
  ValidatorSchema,
}: {
  id: string;
  form: GeneralUseFormReturn;
  nodeType: "operator" | "connector";
  ValidatorSchema: z.ZodTypeAny;
}) {
  const { updateNodes, updatePipelineRecipeIsDirty } = useInstillStore(
    useShallow(selector)
  );

  const [tempValues, setTempValues] =
    React.useState<Nullable<GeneralRecord>>(null);

  const { getValues, handleSubmit, trigger, watch } = form;

  const values = getValues();
  const watchValues = watch();

  // This will make sure that we have the latest values
  const upToDateValues = {
    ...watchValues,
    ...values,
  };

  // upToDateValues is a proxy object (it will be re-created every single time)
  // so we need to deep compare it to avoid endless loop
  useDeepCompareEffect(() => {
    console.log("upToDateValues", upToDateValues);
  }, [upToDateValues]);

  // Our useDeepCompareEffect can't structureClone ValidatorSchema, so
  // We have to use tempValues and additional useEffect to workaround this
  React.useEffect(() => {
    if (!tempValues) {
      return;
    }

    const parsedResult = ValidatorSchema.safeParse(upToDateValues);

    // Instead of relying on isValid from react-hook-form, we will use our own
    // Validator to check whether the form is valid or not
    if (parsedResult.success) {
      handleSubmit(() => {
        console.log("tempValues", tempValues);

        const modifiedData = recursiveReplaceNullAndEmptyStringWithUndefined(
          recursiveTransformToString(upToDateValues)
        );

        updateNodes((nodes) => {
          return nodes.map((node) => {
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
                      node.data.component.configuration.task === values.task
                        ? {
                            ...node.data.component.configuration,
                            ...modifiedData,
                          }
                        : {
                            ...modifiedData,
                          },
                  },
                },
              };
            }

            if (
              nodeType === "connector" &&
              node.data.nodeType === "connector" &&
              node.id === id
            ) {
              console.log(
                "task diff",
                node.data.component.configuration.task,
                values.task
              );

              return {
                ...node,
                data: {
                  ...node.data,
                  component: {
                    ...node.data.component,
                    configuration:
                      node.data.component.configuration.task === values.task
                        ? {
                            ...node.data.component.configuration,
                            ...modifiedData,
                          }
                        : {
                            ...modifiedData,
                          },
                  },
                },
              };
            }

            return node;
          });
        });
        updatePipelineRecipeIsDirty(() => true);
        setTempValues(null);
      })();
    } else {
      for (const error of parsedResult.error.errors) {
        trigger(error.path.join("."));
      }
    }
  }, [tempValues, ValidatorSchema]);
}
