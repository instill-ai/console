import { Form, Icons, Select, Tooltip } from "@instill-ai/design-system";
import * as React from "react";
import { recursivelyResetFormData } from "../transform";
import { GeneralUseFormReturn } from "../../type";
import { InstillFormTree, SelectedConditionMap } from "../type";

export const OneOfConditionField = ({
  form,
  path,
  title,
  tree,
  conditionComponents,
  setSelectedConditionMap,
  description,
  additionalDescription,
  disabled,
}: {
  form: GeneralUseFormReturn;
  path: string;
  tree: InstillFormTree;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<SelectedConditionMap | null>
  >;
  conditionComponents: Record<string, React.ReactNode>;
  description?: string;
  additionalDescription?: string;
  title?: string;
  disabled?: boolean;
}) => {
  const conditionOptions = React.useMemo(() => {
    return Object.entries(conditionComponents).map(([k]) => k);
  }, [conditionComponents]);

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
                        <Icons.HelpCircle className="w-[14px] my-auto cursor-pointer h-[14px] stroke-semantic-fg-secondary" />
                      </Tooltip.Trigger>
                      <Tooltip.Portal>
                        <Tooltip.Content
                          className="w-[360px]"
                          sideOffset={5}
                          side="top"
                        >
                          <div className="!px-3 !py-2 !rounded-sm !bg-semantic-bg-primary">
                            <p className="product-body-text-4-semibold break-all text-semantic-fg-primary">
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
                    // If the user change the condition, we will remove the
                    // data of the previous condition

                    const formValues = form.getValues();

                    if (prev) {
                      recursivelyResetFormData(tree, prev, formValues);
                    }

                    form.reset(formValues);

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
