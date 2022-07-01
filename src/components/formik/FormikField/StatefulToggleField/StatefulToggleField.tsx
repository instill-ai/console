import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicToggleFieldProps,
  StatefulToggleField,
} from "@instill-ai/design-system";
import { Nullable, State } from "@/types/general";

export type ToggleFieldProps = Omit<BasicToggleFieldProps, "onChangeInput"> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: boolean) => void>;
  state: State;
};

const StatefulToggleFieldWrapper: FC<ToggleFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  additionalMessageOnLabel,
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
    <StatefulToggleField
      {...props}
      id={id}
      error={error}
      onChangeInput={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
    />
  );
};

const StatefulToggleFieldFormikWrapper: FC<ToggleFieldProps> = ({
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
  state,
}) => {
  return (
    <Field
      id={id}
      name={name}
      component={StatefulToggleFieldWrapper}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      additionalMessageOnLabel={additionalMessageOnLabel}
      error={error}
      state={state}
    />
  );
};

export default StatefulToggleFieldFormikWrapper;
