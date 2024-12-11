"use client";

import * as React from "react";
import cn from "clsx";

import { Form, Select } from "@instill-ai/design-system";

import { dot } from "../../../dot";
import { Nullable } from "../../../type";
import { pickDefaultCondition } from "../../pick";
import { transformInstillFormTreeToDefaultValue } from "../../transform";
import {
  AutoFormFieldBaseProps,
  InstillFormConditionItem,
  SelectedConditionMap,
} from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const OneOfConditionField = ({
  form,
  constFullPath,
  formConditionLayerPath,
  title,
  tree,
  conditionComponentsMap,
  selectedConditionMap,
  setSelectedConditionMap,
  description,
  shortDescription,
  disabled,
  size,
  isHidden,
  isRequired,
  lowCodeComponentEraSchema,
}: {
  tree: InstillFormConditionItem;
  selectedConditionMap: Nullable<SelectedConditionMap>;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedConditionMap>>
  >;
  conditionComponentsMap: Record<
    string,
    { component: React.ReactNode; title: Nullable<string> }
  >;
  shortDescription?: string;
  disabled?: boolean;

  // something like foo.bar.baz
  // If we have array then it will be foo.0.bar.baz
  // If the formCondition layer's path is foo.bar.baz, and it's const fieldKey is type
  // then the constFullPath will be foo.bar.baz.type
  constFullPath: string;

  // In the above example, the formConditionLayerPath will be foo.bar.baz
  formConditionLayerPath: string;
  lowCodeComponentEraSchema?: boolean;
} & Omit<AutoFormFieldBaseProps, "path">) => {
  const conditionOptions = React.useMemo(() => {
    return Object.entries(conditionComponentsMap).map(([k, v]) => ({
      key: k,
      title: v.title,
    }));
  }, [conditionComponentsMap]);

  // Once the condition is changed, we need to reset the child form data
  // of the previous condition.

  const conditionComponents = React.useMemo(() => {
    if (!selectedConditionMap) return null;

    const selectedCondition = selectedConditionMap[constFullPath];

    return selectedCondition ? conditionComponentsMap[selectedCondition] : null;
  }, [conditionComponentsMap, selectedConditionMap, constFullPath]);

  const { reset, getValues } = form;

  // Leave for future reference
  // React.useEffect(() => {
  //   if (prevSelectedConditionMap && selectedConditionMap && tree.path) {
  //     const formValues = getValues();
  //     // recursivelyResetFormData(tree, selectedConditionMap, formValues);

  //     const defaultValue = transformInstillFormTreeToDefaultValue(tree, {
  //       selectedConditionMap: selectedConditionMap,
  //       parentIsFormCondition: true,
  //       parentIsObjectArray: false,
  //       parentPath: undefined,
  //     });

  //     const constLayerData = dot.getter(defaultValue, tree.path);
  //     const resetData = dot.setter(
  //       formValues,
  //       formConditionLayerPath,
  //       constLayerData,
  //     );

  //     console.log(
  //       "defaultValue",
  //       tree,
  //       selectedConditionMap,
  //       defaultValue,
  //       formValues,
  //       constLayerData,
  //       resetData,
  //     );

  //     setPrevSelectedConditionMap(null);
  //     reset(formValues);
  //   }
  // }, [
  //   prevSelectedConditionMap,
  //   selectedConditionMap,
  //   constFullPath,
  //   formConditionLayerPath,
  //   reset,
  //   tree,
  //   getValues,
  // ]);

  console.log(tree);

  return (
    <div key={constFullPath} className="flex flex-col gap-y-5">
      {isHidden ? null : (
        <Form.Field
          control={form.control}
          name={constFullPath}
          render={({ field }) => {
            return (
              <Form.Item>
                <div className="flex flex-row gap-x-2">
                  <Form.Label
                    className={
                      size === "sm" ? "!product-body-text-4-semibold" : ""
                    }
                  >
                    {isRequired ? `${title} *` : title}
                  </Form.Label>
                  <FieldDescriptionTooltip description={description} />
                </div>
                <Select.Root
                  onValueChange={(event) => {
                    if (!event || event === "") return;
                    field.onChange(event);

                    const newSelectedConditionMap = {
                      ...selectedConditionMap,
                      [constFullPath]: event,
                    };

                    setSelectedConditionMap(newSelectedConditionMap);

                    const defaultCondition = pickDefaultCondition(tree);
                    const constPath = defaultCondition?.path;

                    if (!constPath) {
                      return;
                    }

                    // use the constPath without array index since the default value
                    // we get will not recognize this
                    const staticSelectedConditionMap = {
                      [constPath]: event,
                    };

                    const defaultValue = transformInstillFormTreeToDefaultValue(
                      tree,
                      {
                        selectedConditionMap: staticSelectedConditionMap,
                      },
                    );

                    const formValues = getValues();

                    // If the tree.path is not exist, most likely it's a component.task
                    // formCondition, we need to deal with it differently
                    if (!tree.path) {
                      reset(defaultValue);
                      return;
                    }

                    const constLayerData = dot.getter(defaultValue, tree.path);
                    dot.setter(
                      formValues,
                      formConditionLayerPath,
                      constLayerData,
                    );

                    reset(formValues);
                  }}
                  value={field.value ?? undefined}
                  disabled={disabled}
                >
                  <Form.Control>
                    <Select.Trigger
                      className={cn(
                        "w-full",
                        size === "sm" ? "!product-body-text-4-regular" : "",
                      )}
                    >
                      <Select.Value />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    {conditionOptions.map((option) => {
                      let title = option.title ?? option.key;
                      const conditionItemSchema = tree.conditions[option.key];

                      if (
                        lowCodeComponentEraSchema &&
                        conditionItemSchema &&
                        conditionItemSchema.title
                      ) {
                        title = conditionItemSchema.title;
                      }

                      return (
                        <Select.Item
                          key={option.key}
                          value={option.key}
                          className={cn(
                            "my-auto text-semantic-fg-primary group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary",
                            size === "sm"
                              ? "!product-body-text-4-regular"
                              : "product-body-text-4-regular",
                          )}
                          label={title}
                        />
                      );
                    })}
                  </Select.Content>
                </Select.Root>
                <Form.Description
                  className={cn(
                    "nodrag nopan cursor-text select-text",
                    size === "sm" ? "!product-body-text-4-regular" : "",
                  )}
                  text={shortDescription ?? null}
                />
                <Form.Message
                  className={cn(
                    "nodrag nopan cursor-text select-text",
                    size === "sm" ? "!product-body-text-4-medium" : "",
                  )}
                />
              </Form.Item>
            );
          }}
        />
      )}
      <div className="flex flex-col gap-y-4">
        {conditionComponents?.component}
      </div>
    </div>
  );
};
