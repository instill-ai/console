import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicSingleSelect,
  BasicSingleSelectProps,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type SingleSelectProps = {
  name: string;
  options: SingleSelectOption[];
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (option: SingleSelectOption) => void;
  instanceId: string;
  menuPlacement: BasicSingleSelectProps["menuPlacement"];
  value: BasicSingleSelectProps["value"];
  error: Nullable<string>;
};

const SingleSelect: FC<SingleSelectProps & FieldProps> = ({
  field,
  form,
  options,
  name,
  instanceId,
  onChangeCb,
  menuPlacement,
  value,
  error,
  ...props
}) => {
  const onChange = (_: string, option: SingleSelectOption) => {
    form.setFieldValue(field.name, option.value);
    if (onChangeCb) {
      onChangeCb(option);
    }
  };

  return (
    <BasicSingleSelect
      {...props}
      id={name}
      instanceId={instanceId}
      error={error}
      options={options}
      onChangeInput={onChange}
      menuPlacement={menuPlacement}
      value={value}
    />
  );
};

const SingleSelectFieldFormikWrapper: FC<SingleSelectProps> = ({
  name,
  options,
  disabled,
  readOnly,
  required,
  description,
  label,
  onChangeCb,
  instanceId,
  menuPlacement,
  value,
  error,
}) => {
  return (
    <Field
      name={name}
      instanceId={instanceId}
      component={SingleSelect}
      options={options}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
      value={value}
      menuPlacement={menuPlacement}
      error={error}
    />
  );
};

export default SingleSelectFieldFormikWrapper;
