import * as React from "react";
import { Icons, Select, SelectOption } from "@instill-ai/design-system";
import {
  dot,
  getConditionFormPath,
  type AirbyteFormConditionItemWithUiFields,
  type AirbyteFormItem,
  type AirbyteFieldValues,
  type SelectedItemMap,
  type AirbyteFieldErrors,
  type Nullable,
} from "../../lib";

export type OneOfConditionSectionProps = {
  formTree: AirbyteFormConditionItemWithUiFields;
  errors: Nullable<AirbyteFieldErrors>;
  setValues: React.Dispatch<React.SetStateAction<Nullable<AirbyteFieldValues>>>;
  selectedConditionMap: Nullable<SelectedItemMap>;
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedItemMap>>
  >;
  disableAll: boolean;
  formIsDirty: boolean;
  setFormIsDirty: React.Dispatch<React.SetStateAction<boolean>>;
};

export const OneOfConditionSection = ({
  formTree,
  errors,
  setValues,
  selectedConditionMap,
  setSelectedConditionMap,
  disableAll,
  formIsDirty,
  setFormIsDirty,
}: OneOfConditionSectionProps) => {
  // ##########################################################################
  // # 1 - Initialize state                                                   #
  // ##########################################################################

  // We store the uiFields in formTree and pass it to this component to preserve
  // the state of UI fields

  const [selectedConditionOption, setSelectedConditionOption] =
    React.useState<Nullable<SelectOption>>(null);

  const conditionOptions: SelectOption[] = React.useMemo(() => {
    // Sometimes the const field is missing, we need to find a workaround
    // TODO: Known issue: snowflake

    return Object.entries(formTree.conditions).map(([k, v]) => {
      return {
        label: k.toString(),
        value:
          ((v.properties.find((e) => "const" in e) as AirbyteFormItem)
            ?.const as string | undefined) ?? k.toString(),
      };
    });
  }, [formTree.conditions]);

  const options = Object.entries(formTree.conditions).map(([k, v]) => {
    return {
      label: k.toString(),
      value:
        ((v.properties.find((e) => "const" in e) as AirbyteFormItem)?.const as
          | string
          | undefined) ?? k.toString(),
    };
  });

  // We rely on the field inside of condition with const key and use its path
  // to set correct value. But sometimes Airbyte's conditionForm's condition
  // don't have proper const field We need to find the workaround. You can find
  // more information in the README.

  const [conditionPath, setConditionPath] =
    React.useState<Nullable<string>>(null);

  React.useEffect(() => {
    const conditionFormPath = getConditionFormPath(formTree);
    setConditionPath(conditionFormPath);
  }, [formTree]);

  React.useEffect(() => {
    // When create new destination, upon the initialize of the form, user haven't
    // chosen any condition, we have to choose default one. Be careful of the update,
    // make sure it won't cause infinite loop.
    // if (!selectedConditionMap || !selectedConditionMap[formTree.path]) {
    //   setSelectedConditionOption(conditionOptions[0]);

    //   const selectedCondition =
    //     formTree.conditions[conditionOptions[0].label] ?? null;

    //   const targetConstField = selectedCondition.properties.find(
    //     (e) => "const" in e
    //   ) as AirbyteFormItem;

    //   setConditionPath(targetConstField?.path ?? null);

    //   setSelectedConditionMap((prev) => ({
    //     ...(prev || {}),
    //     [formTree.path]: {
    //       selectedItem: selectedCondition
    //         ? selectedCondition.title ?? null
    //         : null,
    //     },
    //   }));

    //   if (targetConstField) {
    //     setValues((prev) => {
    //       const configuration = prev?.configuration ?? {};
    //       dot.setter(
    //         configuration,
    //         targetConstField.path,
    //         targetConstField.const
    //       );
    //       return {
    //         ...prev,
    //         configuration,
    //       };
    //     });
    //   } else {
    //     // Sometimes Airbyte doesn't have proper const field. We need to find a work around
    //     if (conditionPath) {
    //       setValues((prev) => {
    //         const configuration = prev?.configuration ?? {};
    //         dot.setter(configuration, conditionPath, selectedCondition.title);
    //         return {
    //           ...prev,
    //           configuration,
    //         };
    //       });
    //     }
    //   }
    //   return;
    // }

    // When user want to configure destination, they already had the initial value of conditionForm,
    // we need to display correct condition field.
    if (
      selectedConditionMap &&
      selectedConditionMap[formTree.path] &&
      !formIsDirty
    ) {
      const selectedCondition =
        conditionOptions.find(
          (e) => e.label === selectedConditionMap[formTree.path].selectedItem
        ) || null;
      setSelectedConditionOption(selectedCondition);
    }
  }, [selectedConditionMap, formTree.path, conditionOptions, formIsDirty]);

  const onConditionChange = React.useCallback(
    (value: string) => {
      const option = conditionOptions.find((e) => e.value === value) ?? null;

      if (option) {
        const selectedCondition = formTree.conditions[option.label];
        setSelectedConditionOption(option);

        const targetConstField = selectedCondition.properties.find(
          (e) => "const" in e
        ) as AirbyteFormItem;

        if (targetConstField) {
          setValues((prev) => {
            const configuration = prev?.configuration ?? {};
            dot.setter(
              configuration,
              targetConstField.path,
              targetConstField.const
            );
            return {
              ...prev,
              configuration,
            };
          });
        } else {
          // Airbyte's doesn't have proper const field. We need to find a work around
          if (conditionPath) {
            setValues((prev) => {
              const configuration = prev?.configuration ?? {};
              dot.setter(configuration, conditionPath, selectedCondition.title);
              return {
                ...prev,
                configuration,
              };
            });
          }
        }
      } else {
        setSelectedConditionOption(null);
      }

      setValues((prev) => ({
        ...prev,
        [formTree.path]: option ? option.value : null,
      }));

      setSelectedConditionMap((prev) => ({
        ...(prev || {}),
        [formTree.path]: {
          selectedItem: option ? (option.label as string) : null,
        },
      }));

      if (setFormIsDirty) {
        setFormIsDirty(true);
      }
    },
    [
      formTree.path,
      setSelectedConditionMap,
      setValues,
      conditionPath,
      formTree.conditions,
      setFormIsDirty,
      conditionOptions,
    ]
  );

  return (
    <div className="border-instillGrey50 flex w-full flex-col border p-5">
      <div className="mb-5 flex w-full flex-row gap-x-5">
        <h3 className="text-instill-h3 my-auto text-black">{formTree.title}</h3>
        <div className="flex flex-1 flex-col space-y-2">
          {/* 
            The reason we don't use the regular Select structure here is due to it 
            will cause a flashed UI issue.

          */}
          <Select.Root disabled={disableAll}>
            <Select.Trigger className="w-full !rounded-none">
              <p className="text-semantic-fg-primary">
                {selectedConditionOption?.value}
              </p>
            </Select.Trigger>
            <Select.Content>
              {options.map((option) => {
                if (!option.value || !option.label) {
                  return;
                }

                return (
                  <div
                    key={option.value}
                    onClick={() => {
                      if (option.value) {
                        onConditionChange(option.value);
                      }
                    }}
                    className="relative cursor-pointer py-1.5 pl-8 hover:bg-semantic-accent-bg"
                  >
                    {selectedConditionOption?.value === option.value ? (
                      <div className="absolute left-2 flex h-4 w-4 items-center justify-center">
                        <Icons.Check className="h-4 w-4 stroke-semantic-fg-primary" />
                      </div>
                    ) : null}
                    {option.label}
                  </div>
                );
              })}
            </Select.Content>
          </Select.Root>
          {/* <Select.Root
            onValueChange={onConditionChange}
            value={selectedConditionOption?.value}
            disabled={disableAll}
          >
            <Select.Trigger className="w-full !rounded-none">
              <Select.Value />
            </Select.Trigger>
            <Select.Content>
              {conditionOptions.map((option) => (
                <Select.Item
                  className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                  key={option.value}
                  value={option.value}
                >
                  <p className="my-auto">{option.label}</p>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root> */}
          <p className="text-[#1D243380] product-body-text-3-regular">
            {formTree.description ?? ""}
          </p>
          {errors ? (
            <p className="text-semantic-error-default product-body-text-3-regular">
              {conditionPath ? errors[conditionPath] : null}
            </p>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        {selectedConditionOption
          ? formTree.conditions[selectedConditionOption.label].uiFields ?? null
          : null}
      </div>
    </div>
  );
};
