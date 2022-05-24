import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicSingleSelect,
  BasicSingleSelectProps,
  SingleSelectOption,
} from "@instill-ai/design-system";

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
      error={form.errors[field.name] as string}
      options={options}
      onChangeInput={onChange}
      menuPlacement={menuPlacement}
      value={value}
    />
  );
};

const FormikWrapper: FC<SingleSelectProps> = ({
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
    />
  );
};

export default FormikWrapper;
