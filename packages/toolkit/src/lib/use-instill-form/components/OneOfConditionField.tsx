import { Form, Icons, Select, Tooltip } from "@instill-ai/design-system";
import * as React from "react";
import { recursivelyResetFormData } from "../transform";
import { GeneralUseFormReturn, Nullable } from "../../type";
import { InstillFormTree, SelectedConditionMap } from "../type";

export const OneOfConditionField = ({
  form,
  path,
  title,
  tree,
  conditionComponents,
  selectedConditionMap,
  setSelectedConditionMap,
  description,
  additionalDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  tree: InstillFormTree;
  selectedConditionMap: Nullable<SelectedConditionMap>;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedConditionMap>>
  >;
  conditionComponents: Record<string, React.ReactNode>;
  title: Nullable<string>;
  description?: string;
  additionalDescription?: string;
  disabled?: boolean;
}) => {
  const [prevSelectedConditionMap, setPrevSelectedConditionMap] =
    React.useState<Nullable<SelectedConditionMap>>(null);

  const conditionOptions = React.useMemo(() => {
    return Object.entries(conditionComponents).map(([k]) => k);
  }, [conditionComponents]);

  // Once the condition is changed, we need to reset the child form data
  // of the previous condition.

  React.useEffect(() => {
    if (prevSelectedConditionMap) {
      const formValues = form.getValues();
      recursivelyResetFormData(tree, prevSelectedConditionMap, formValues);
      form.reset(formValues);
    }
  }, [prevSelectedConditionMap, selectedConditionMap]);

  return (
    <div key={path} className="flex flex-col">
      <Form.Field
        control={form.control}
        name={path}
        render={({ field }) => {
          return (
            <Form.Item>
              <div className="flex flex-row gap-x-2">
                <Form.Label>{title}</Form.Label>
                {additionalDescription ? (
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
                            <p className="break-all text-semantic-fg-primary product-body-text-4-semibold">
                              {additionalDescription}
                            </p>
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
                  <Select.Trigger className="w-full">
                    <Select.Value />
                  </Select.Trigger>
                </Form.Control>
                <Select.Content>
                  {conditionOptions.map((option) => {
                    return (
                      <Select.Item
                        key={option}
                        value={option}
                        className="my-auto text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                      >
                        <p className="my-auto">{option}</p>
                      </Select.Item>
                    );
                  })}
                </Select.Content>
              </Select.Root>
              <Form.Description>{description}</Form.Description>
              <Form.Message />
            </Form.Item>
          );
        }}
      />
      {conditionComponents[form.watch(path)] ? (
        <div className="flex flex-col gap-y-5">
          {conditionComponents[form.watch(path)]}
        </div>
      ) : null}
    </div>
  );
};
