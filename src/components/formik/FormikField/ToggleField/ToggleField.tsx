import { ChangeEvent, FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicToggleField,
  BasicToggleFieldProps,
} from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type ToggleFieldProps = Omit<BasicToggleFieldProps, "onChange"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: boolean) => void>;
};

const ToggleField: FC<ToggleFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  additionalMessageOnLabel,
  error,
  ...props
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(field.name, event.target.checked);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(event.target.checked);
    }
  };

  return (
    <BasicToggleField
      {...props}
      id={id}
      error={error}
      onChange={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
    />
  );
};

const ToggleFieldFormikWrapper: FC<ToggleFieldProps> = ({
  id,
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  additionalOnChangeCb,
  additionalMessageOnLabel,
  error,
  value,
}) => {
  return (
    <Field
      id={id}
      name={name}
      component={ToggleField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      additionalMessageOnLabel={additionalMessageOnLabel}
      error={error}
      value={value}
    />
  );
};

export default ToggleFieldFormikWrapper;
