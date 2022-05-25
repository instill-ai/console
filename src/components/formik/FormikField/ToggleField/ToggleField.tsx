import { FC } from "react";
import { Field, FieldProps } from "formik";
import { BasicToggleField } from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type ToggleFieldProps = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (value: boolean) => void;
  defaultChecked: boolean;
  error: Nullable<string>;
};

const ToggleField: FC<ToggleFieldProps & FieldProps> = ({
  field,
  form,
  name,
  defaultChecked,
  onChangeCb,
  error,
  ...props
}) => {
  const onChange = (_: string, value: boolean) => {
    form.setFieldValue(field.name, value);
    if (onChangeCb) {
      onChangeCb(value);
    }
  };

  return (
    <BasicToggleField
      {...props}
      id={name}
      error={error}
      onChangeInput={onChange}
      defaultChecked={defaultChecked}
    />
  );
};

const FormikWrapper: FC<ToggleFieldProps> = ({
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  onChangeCb,
  defaultChecked,
  error,
}) => {
  return (
    <Field
      name={name}
      component={ToggleField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
      defaultChecked={defaultChecked}
      error={error}
    />
  );
};

export default FormikWrapper;
