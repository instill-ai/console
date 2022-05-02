import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicSingleSelect,
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
};

const SingleSelect: FC<SingleSelectProps & FieldProps> = ({
  field,
  form,
  options,
  name,
  onChangeCb,
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
      error={form.errors[field.name] as string}
      options={options}
      onChangeInput={onChange}
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
}) => {
  return (
    <Field
      name={name}
      component={SingleSelect}
      options={options}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
    />
  );
};

export default FormikWrapper;
