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
  AirbyteFormValues,
} from "../../types";

export type OneOfConditionSectionProps = {
  formTree: AirbyteFormConditionItemWithUiFields;
  values: AirbyteFormValues;
  setValues: Dispatch<SetStateAction<AirbyteFormValues>>;
};

const OneOfConditionSection: FC<OneOfConditionSectionProps> = ({
  formTree,
  values,
  setValues,
}) => {
  const conditionOptions: SingleSelectOption[] = useMemo(() => {
    return Object.entries(formTree.conditions).map(([k]) => {
      return {
        label: k.toString(),
        value: k.toString(),
      };
    });
  }, [formTree.conditions]);

  const selectedCondition = useMemo(() => {
    if (!conditionOptions) return null;

    if (!values[formTree.path]) {
      return conditionOptions[0];
    }

    return (
      conditionOptions.find((k) => k.value === values[formTree.path]) || null
    );
  }, [formTree.path, values[formTree.path], conditionOptions]);

  const onConditionChange = useCallback(
    (_: string, option: SingleSelectOption) => {
      setValues((prev) => ({
        ...prev,
        [formTree.path]: option.value,
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
            value={selectedCondition}
            options={conditionOptions}
            onChangeInput={onConditionChange}
          />
        </div>
      </div>
      {selectedCondition
        ? formTree.conditions[selectedCondition.value].uiFields
        : null}
    </div>
  );
};

export default OneOfConditionSection;
