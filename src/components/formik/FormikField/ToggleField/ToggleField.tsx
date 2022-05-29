import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicToggleField,
  BasicToggleFieldProps,
} from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type ToggleFieldProps = BasicToggleFieldProps & {
  name: string;
  onChangeCb: Nullable<(value: boolean) => void>;
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

const ToggleFieldFormikWrapper: FC<ToggleFieldProps> = ({
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

export default ToggleFieldFormikWrapper;
