import { Nullable } from "@/types/general";
import { BasicTextField, BasicTextFieldProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextFieldProps = Omit<BasicTextFieldProps, "onChangeInput"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: string) => void>;
};

const TextField: FC<TextFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  error,
  ...props
}) => {
  const onChange = (_: string, value: string) => {
    form.setFieldValue(field.name, value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(value);
    }
  };

  return (
    <BasicTextField {...props} id={id} error={error} onChangeInput={onChange} />
  );
};

const TextFieldFormikWrapper: FC<TextFieldProps> = ({
  id,
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  additionalOnChangeCb,
  placeholder,
  type,
  autoComplete,
  value,
  error,
}) => {
  return (
    <Field
      id={id}
      name={name}
      component={TextField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
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
