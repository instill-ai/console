import { Nullable } from "@/types/general";
import { BasicTextArea, BasicTextAreaProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type TextAreaProps = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (value: string) => void;
  placeholder: string;
  autoComplete: string;
  value: BasicTextAreaProps["value"];
  enableCounter: boolean;
  counterWordLimit: number;
  error: Nullable<string>;
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
