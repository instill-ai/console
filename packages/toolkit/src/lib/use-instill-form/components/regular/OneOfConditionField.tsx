import {
  Form,
  Icons,
  ParagraphWithHTML,
  Select,
  Tooltip,
} from "@instill-ai/design-system";
import * as React from "react";
import { recursivelyResetFormData } from "../../transform";
import { GeneralUseFormReturn, Nullable } from "../../../type";
import { InstillFormTree, SelectedConditionMap } from "../../type";

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
}: {
  form: GeneralUseFormReturn;
  path: string;
  tree: InstillFormTree;
  selectedConditionMap: Nullable<SelectedConditionMap>;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedConditionMap>>
  >;
  conditionComponentsMap: Record<string, React.ReactNode>;
  title: Nullable<string>;
  description?: string;
  shortDescription?: string;
  disabled?: boolean;
}) => {
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
      <Form.Field
        control={form.control}
        name={path}
        render={({ field }) => {
          return (
            <Form.Item>
              <div className="flex flex-row gap-x-2">
                <Form.Label>{title}</Form.Label>
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
              <Form.Description text={shortDescription ?? null} />
              <Form.Message />
            </Form.Item>
          );
        }}
      />
      <div className="flex flex-col gap-y-5">{conditionComponents}</div>
    </div>
  );
};
