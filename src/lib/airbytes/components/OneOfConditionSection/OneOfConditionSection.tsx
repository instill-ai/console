import dot from "@/lib/dot";
import { Nullable } from "@/types/general";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";
import {
  Dispatch,
  FC,
  SetStateAction,
  useMemo,
  useCallback,
  useState,
  useEffect,
} from "react";
import getConditionFormPath from "../../getConditionFormPath";
import {
  AirbyteFormConditionItemWithUiFields,
  AirbyteFormItem,
  AirbyteFieldValues,
  SelectedItemMap,
  AirbyteFieldErrors,
} from "../../types";

export type OneOfConditionSectionProps = {
  formTree: AirbyteFormConditionItemWithUiFields;
  errors: Nullable<AirbyteFieldErrors>;
  setValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>;
  selectedConditionMap: Nullable<SelectedItemMap>;
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>;
  disableAll: boolean;
  formIsDirty: boolean;
  setFormIsDirty: Dispatch<SetStateAction<boolean>>;
};

const OneOfConditionSection: FC<OneOfConditionSectionProps> = ({
  formTree,
  errors,
  setValues,
  selectedConditionMap,
  setSelectedConditionMap,
  disableAll,
  formIsDirty,
  setFormIsDirty,
}) => {
  // ##########################################################################
  // # 1 - Initialize state                                                   #
  // ##########################################################################

  // We store the uiFields in formTree and pass it to this component to preserve
  // the state of UI fields

  const [selectedConditionOption, setSelectedConditionOption] =
    useState<Nullable<SingleSelectOption>>(null);

  const conditionOptions: SingleSelectOption[] = useMemo(() => {
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

  // We rely on the field inside of condition with const key and use its path
  // to set correct value. But sometimes Airbyte's conditionForm's condition
  // don't have proper const field We need to find the workaround. You can find
  // more information in the README.

  const [conditionPath, setConditionPath] = useState<Nullable<string>>(null);

  useEffect(() => {
    const conditionFormPath = getConditionFormPath(formTree);
    setConditionPath(conditionFormPath);
  }, [formTree]);

  useEffect(() => {
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

  const onConditionChange = useCallback(
    (option: Nullable<SingleSelectOption>) => {
      if (option) {
        const selectedCondition = formTree.conditions[option.label] ?? null;
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
    ]
  );

  return (
    <div className="flex w-full flex-col border border-instillGrey50 p-5">
      <div className="mb-5 flex w-full flex-row gap-x-5">
        <h3 className="my-auto text-black text-instill-h3">{formTree.title}</h3>
        <div className="flex-1">
          <BasicSingleSelect
            id={formTree.path}
            instanceId={formTree.path}
            disabled={disableAll}
            menuPlacement="auto"
            label={formTree.title ?? null}
            error={
              errors ? (conditionPath ? errors[conditionPath] : null) : null
            }
            value={selectedConditionOption}
            options={conditionOptions}
            onChange={onConditionChange}
          />
        </div>
      </div>
      {selectedConditionOption
        ? formTree.conditions[selectedConditionOption.label].uiFields ?? null
        : null}
    </div>
  );
};

export default OneOfConditionSection;
