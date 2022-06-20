import { Nullable } from "@/types/general";
import { BasicTextArea, BasicTextAreaProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextAreaProps = Omit<BasicTextAreaProps, "onChangeInput" | "id"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: string) => void>;
};

const TextArea: FC<TextAreaProps & FieldProps> = ({
  field,
  form,
  name,
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
    <BasicTextArea
      {...props}
      id={field.name}
      error={error}
      onChangeInput={onChange}
    />
  );
};

const TextAreaFormikWrapper: FC<TextAreaProps> = ({
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  additionalOnChangeCb,
  placeholder,
  autoComplete,
  value,
  enableCounter,
  counterWordLimit,
  error,
}) => {
  return (
    <Field
      name={name}
      component={TextArea}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      placeholder={placeholder}
      autoComplete={autoComplete}
      value={value}
      enableCounter={enableCounter}
      counterWordLimit={counterWordLimit}
      error={error}
    />
  );
};

export default TextAreaFormikWrapper;
