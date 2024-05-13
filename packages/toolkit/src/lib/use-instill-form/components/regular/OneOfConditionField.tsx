"use client";

import cn from "clsx";
import { Form, Select } from "@instill-ai/design-system";
import * as React from "react";
import { recursivelyResetFormData } from "../../transform";
import { Nullable } from "../../../type";
import {
  AutoFormFieldBaseProps,
  InstillFormTree,
  SelectedConditionMap,
} from "../../types";
import { FieldDescriptionTooltip } from "../common";

export const OneOfConditionField = ({
  form,
  path,
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
}: {
  tree: InstillFormTree;
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
} & AutoFormFieldBaseProps) => {
  const [prevSelectedConditionMap, setPrevSelectedConditionMap] =
    React.useState<Nullable<SelectedConditionMap>>(null);

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

    const selectedCondition = selectedConditionMap[path];

    return conditionComponentsMap[selectedCondition];
  }, [conditionComponentsMap, selectedConditionMap, path]);

  const { reset, getValues } = form;

  React.useEffect(() => {
    if (prevSelectedConditionMap && selectedConditionMap) {
      const formValues = getValues();
      recursivelyResetFormData(tree, selectedConditionMap, formValues);
      setPrevSelectedConditionMap(null);
      reset(formValues);
    }
  }, [prevSelectedConditionMap, selectedConditionMap, reset, tree, getValues]);

  return (
    <div key={path} className="flex flex-col gap-y-5">
      {isHidden ? null : (
        <Form.Field
          control={form.control}
          name={path}
          render={({ field }) => {
            return (
              <Form.Item>
                <div className="flex flex-row gap-x-2">
                  <Form.Label
                    className={
                      size === "sm" ? "!product-body-text-4-semibold" : ""
                    }
                  >
                    {title}
                  </Form.Label>
                  <FieldDescriptionTooltip description={description} />
                </div>
                <Select.Root
                  onValueChange={(event) => {
                    field.onChange(event);
                    setSelectedConditionMap((prev) => {
                      setPrevSelectedConditionMap(prev);
                      return {
                        ...prev,
                        [path]: event,
                      };
                    });
                  }}
                  value={field.value ?? undefined}
                  disabled={disabled}
                >
                  <Form.Control>
                    <Select.Trigger
                      className={cn(
                        "w-full",
                        size === "sm" ? "!product-body-text-4-regular" : ""
                      )}
                    >
                      <Select.Value />
                    </Select.Trigger>
                  </Form.Control>
                  <Select.Content>
                    {conditionOptions.map((option) => {
                      return (
                        <Select.Item
                          key={option.key}
                          value={option.key}
                          className={cn(
                            "my-auto text-semantic-fg-primary group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary",
                            size === "sm"
                              ? "!product-body-text-4-regular"
                              : "product-body-text-4-regular"
                          )}
                          label={option.title ?? option.key}
                        />
                      );
                    })}
                  </Select.Content>
                </Select.Root>

                <Form.Message
                  className={cn(
                    "nodrag nopan cursor-text select-text",
                    size === "sm" ? "!product-body-text-4-medium" : ""
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
