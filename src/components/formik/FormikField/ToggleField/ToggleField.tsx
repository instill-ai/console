import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicToggleField,
  BasicToggleFieldProps,
} from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type ToggleFieldProps = Omit<BasicToggleFieldProps, "onChangeInput"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: boolean) => void>;
};

const ToggleField: FC<ToggleFieldProps & FieldProps> = ({
  field,
  form,
  id,
  defaultChecked,
  additionalOnChangeCb,
  error,
  ...props
}) => {
  const onChange = (_: string, value: boolean) => {
    form.setFieldValue(field.name, value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(value);
    }
  };

  return (
    <BasicToggleField
      {...props}
      id={id}
      error={error}
      onChangeInput={onChange}
      defaultChecked={defaultChecked}
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
  defaultChecked,
  error,
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
      defaultChecked={defaultChecked}
      error={error}
    />
  );
};

export default ToggleFieldFormikWrapper;
