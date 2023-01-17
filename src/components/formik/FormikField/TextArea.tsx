import { Nullable } from "@/types/general";
import { BasicTextArea, BasicTextAreaProps } from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { ChangeEvent, FC } from "react";

export type TextAreaProps = Omit<BasicTextAreaProps, "onChange"> & {
  name: string;
  additionalOnChangeCb?: Nullable<(value: string) => void>;
};

const TextAreaWrapper: FC<TextAreaProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  additionalMessageOnLabel,
  error,
  ...props
}) => {
  const onChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    form.setFieldValue(field.name, event.target.value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(event.target.value);
    }
  };

  return (
    <BasicTextArea
      {...props}
      id={id}
      error={error}
      onChange={onChange}
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
      component={TextAreaWrapper}
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

export { TextAreaFormikWrapper as TextArea };
