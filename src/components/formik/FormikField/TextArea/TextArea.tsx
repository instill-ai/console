import { Nullable } from "@/types/general";
import { BasicTextArea, BasicTextAreaProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextAreaProps = Omit<BasicTextAreaProps, "onChangeInput" | "id"> & {
  name: string;
  onChangeCb: Nullable<(value: string) => void>;
};

const TextArea: FC<TextAreaProps & FieldProps> = ({
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
    <BasicTextArea
      {...props}
      id={name}
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
  onChangeCb,
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
      onChangeCb={onChangeCb}
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
