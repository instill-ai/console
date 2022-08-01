import { Nullable } from "@/types/general";
import { BasicTextField, BasicTextFieldProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { ChangeEvent, FC } from "react";

export type TextFieldProps = Omit<BasicTextFieldProps, "onChange"> & {
  name: string;
  additionalOnChangeCb?: Nullable<(value: string) => void>;
};

const TextField: FC<TextFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalMessageOnLabel,
  additionalOnChangeCb,
  error,
  ...props
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(field.name, event.target.value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(event.target.value);
    }
  };

  return (
    <BasicTextField
      {...props}
      id={id}
      error={error}
      onChange={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
    />
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
  additionalMessageOnLabel,
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
      additionalMessageOnLabel={additionalMessageOnLabel}
      placeholder={placeholder}
      type={type}
      autoComplete={autoComplete}
      value={value}
      error={error}
    />
  );
};

export default TextFieldFormikWrapper;
