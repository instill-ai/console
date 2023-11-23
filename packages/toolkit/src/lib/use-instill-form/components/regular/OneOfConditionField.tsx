import cn from "clsx";
import {
  Form,
  Icons,
  ParagraphWithHTML,
  Select,
  Tooltip,
} from "@instill-ai/design-system";
import * as React from "react";
import { recursivelyResetFormData } from "../../transform";
import { Nullable } from "../../../type";
import {
  AutoFormFieldBaseProps,
  InstillFormTree,
  SelectedConditionMap,
} from "../../type";

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
  conditionComponentsMap: Record<string, React.ReactNode>;
  shortDescription?: string;
  disabled?: boolean;
} & AutoFormFieldBaseProps) => {
  const [prevSelectedConditionMap, setPrevSelectedConditionMap] =
    React.useState<Nullable<SelectedConditionMap>>(null);

  const conditionOptions = React.useMemo(() => {
    return Object.entries(conditionComponentsMap).map(([k]) => k);
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
                  {description ? (
                    <Tooltip.Provider>
                      <Tooltip.Root>
                        <Tooltip.Trigger asChild>
                          <Icons.HelpCircle className="my-auto h-[14px] w-[14px] cursor-pointer stroke-semantic-fg-secondary" />
                        </Tooltip.Trigger>
                        <Tooltip.Portal>
                          <Tooltip.Content
                            className="w-[360px]"
                            sideOffset={5}
                            side="top"
                          >
                            <div className="!rounded-sm !bg-semantic-bg-primary !px-3 !py-2">
                              <ParagraphWithHTML
                                text={description}
                                className="break-all text-semantic-fg-primary product-body-text-4-semibold"
                              />
                            </div>
                            <Tooltip.Arrow
                              className="fill-white"
                              offset={5}
                              width={9}
                              height={6}
                            />
                          </Tooltip.Content>
                        </Tooltip.Portal>
                      </Tooltip.Root>
                    </Tooltip.Provider>
                  ) : null}
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
                          key={option}
                          value={option}
                          className={cn(
                            "my-auto text-semantic-fg-primary group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary",
                            size === "sm"
                              ? "!product-body-text-4-regular"
                              : "product-body-text-4-regular"
                          )}
                        >
                          <p className="my-auto">{option}</p>
                        </Select.Item>
                      );
                    })}
                  </Select.Content>
                </Select.Root>
                <Form.Description
                  className={
                    size === "sm" ? "!product-body-text-4-regular" : ""
                  }
                  text={shortDescription ?? null}
                />
                <Form.Message
                  className={size === "sm" ? "!product-body-text-4-medium" : ""}
                />
              </Form.Item>
            );
          }}
        />
      )}
      <div className="flex flex-col gap-y-4">{conditionComponents}</div>
    </div>
  );
};
