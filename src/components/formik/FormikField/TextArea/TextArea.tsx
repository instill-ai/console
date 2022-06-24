import { Nullable } from "@/types/general";
import { BasicTextArea, BasicTextAreaProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextAreaProps = Omit<BasicTextAreaProps, "onChangeInput"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: string) => void>;
};

const TextArea: FC<TextAreaProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  additionalMessageOnLabel,
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
      id={id}
      error={error}
      onChangeInput={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
    />
  );
};

const TextAreaFormikWrapper: FC<TextAreaProps> = ({
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
  autoComplete,
  value,
  enableCounter,
  counterWordLimit,
  error,
}) => {
  return (
    <Field
      id={id}
      name={name}
      component={TextArea}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      additionalMessageOnLabel={additionalMessageOnLabel}
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
