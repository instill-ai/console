import { FC } from "react";
import { Field, FieldProps } from "formik";
import { BasicToggleField } from "@instill-ai/design-system";

export type ToggleFieldProps = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (value: boolean) => void;
  defaultChecked: boolean;
};

const ToggleField: FC<ToggleFieldProps & FieldProps> = ({
  field,
  form,
  name,
  defaultChecked,
  onChangeCb,
  ...props
}) => {
  const onChange = (_: string, value: boolean) => {
    form.setFieldValue(field.name, value);
    if (onChangeCb) {
      onChangeCb(value);
    }
  };

  return (
    <BasicToggleField
      {...props}
      id={name}
      error={form.errors[field.name] as string}
      onChangeInput={onChange}
      defaultChecked={defaultChecked}
    />
  );
};

const FormikWrapper: FC<ToggleFieldProps> = ({
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  onChangeCb,
  defaultChecked,
}) => {
  return (
    <Field
      name={name}
      component={ToggleField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
      defaultChecked={defaultChecked}
    />
  );
};

export default FormikWrapper;
