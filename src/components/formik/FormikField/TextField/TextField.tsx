import { Nullable } from "@/types/general";
import { BasicTextField, BasicTextFieldProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextFieldProps = BasicTextFieldProps & {
  name: string;
  onChangeCb: Nullable<(value: string) => void>;
};

const TextField: FC<TextFieldProps & FieldProps> = ({
  field,
  form,
  name,
  onChangeCb,
  error,
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
      error={error}
      onChangeInput={onChange}
    />
  );
};

const TextFieldFormikWrapper: FC<TextFieldProps> = ({
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
  value,
  error,
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
      value={value}
      error={error}
    />
  );
};

export default TextFieldFormikWrapper;
