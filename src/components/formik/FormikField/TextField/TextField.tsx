import { BasicTextField } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextFieldProps = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (value: string) => void;
  placeholder: string;
  type: string;
  autoComplete: string;
};

const TextField: FC<TextFieldProps & FieldProps> = ({
  field,
  form,
  name,
  onChangeCb,
  ...props
}) => {
  const onChange = (_: string, value: string) => {
    form.setFieldValue(field.name, value);
    if (onChangeCb) {
      onChangeCb(value);
    }
  };

  return (
    <BasicTextField
      {...props}
      id={name}
      error={form.errors[field.name] as string}
      onChangeInput={onChange}
    />
  );
};

const FormikWrapper: FC<TextFieldProps> = ({
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  onChangeCb,
  placeholder,
  type,
  autoComplete,
}) => {
  return (
    <Field
      name={name}
      component={TextField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
    />
  );
};

export default FormikWrapper;
