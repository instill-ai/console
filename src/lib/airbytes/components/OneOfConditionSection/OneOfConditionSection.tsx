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
} from "react";
import {
  AirbyteFormConditionItemWithUiFields,
  AirbyteFormItem,
  AirbyteFieldValues,
  SelectedItemMap,
} from "../../types";

export type OneOfConditionSectionProps = {
  formTree: AirbyteFormConditionItemWithUiFields;
  values: AirbyteFieldValues;
  setValues: Dispatch<SetStateAction<AirbyteFieldValues>>;
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>;
};

const OneOfConditionSection: FC<OneOfConditionSectionProps> = ({
  formTree,
  values,
  setValues,
  setSelectedConditionMap,
}) => {
  const conditionOptions: SingleSelectOption[] = useMemo(() => {
    return Object.entries(formTree.conditions).map(([k, v]) => {
      return {
        label: k.toString(),
        value: (v.properties.find((e) => "const" in e) as AirbyteFormItem)
          ?.const as string,
      };
    });
  }, [formTree.conditions]);

  const selectedConditionOption = useMemo(() => {
    if (!conditionOptions) return null;

    if (!values[formTree.path]) {
      return conditionOptions[0];
    }

    return (
      conditionOptions.find((k) => k.value === values[formTree.path]) || null
    );
  }, [formTree.path, values[formTree.path], conditionOptions]);

  const selectedCondition = useMemo(() => {
    if (!selectedConditionOption) return null;

    return formTree.conditions[selectedConditionOption.label] ?? null;
  }, [selectedConditionOption, formTree.conditions]);

  const onConditionChange = useCallback(
    (_: string, option: Nullable<SingleSelectOption>) => {
      setValues((prev) => ({
        ...prev,
        [formTree.path]: option ? option.value : null,
      }));

      setSelectedConditionMap((prev) => ({
        ...(prev || {}),
        [formTree.path]: {
          selectedItem: option ? option.label : null,
        },
      }));
    },
    [formTree.path]
  );

  return (
    <div className="flex w-full flex-col border border-instillGrey50 p-5">
      <div className="mb-5 flex w-full flex-row gap-x-5">
        <h3 className="my-auto text-black text-instill-h3">{formTree.title}</h3>
        <div className="flex-1">
          <BasicSingleSelect
            id={formTree.path}
            instanceId={formTree.path}
            menuPlacement="auto"
            label={null}
            additionalMessageOnLabel={null}
            description=""
            disabled={false}
            readOnly={false}
            required={false}
            error={null}
            value={selectedConditionOption}
            options={conditionOptions}
            onChangeInput={onConditionChange}
          />
        </div>
      </div>
      {selectedCondition ? selectedCondition.uiFields : null}
    </div>
  );
};

export default OneOfConditionSection;
