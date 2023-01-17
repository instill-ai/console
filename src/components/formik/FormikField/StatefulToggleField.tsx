import { ChangeEvent, FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicToggleFieldProps,
  StatefulToggleField,
} from "@instill-ai/design-system";
import { Nullable, State } from "@/types/general";

export type StatefulToggleFieldProps = Omit<
  BasicToggleFieldProps,
  "onChange"
> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: boolean) => void>;
  state: State;
};

const StatefulToggleFieldWrapper: FC<StatefulToggleFieldProps & FieldProps> = ({
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
    <StatefulToggleField
      {...props}
      id={id}
      error={error}
      onChange={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
      loadingLabelText="Loading..."
    />
  );
};

const StatefulToggleFieldFormikWrapper: FC<StatefulToggleFieldProps> = ({
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

export { StatefulToggleFieldFormikWrapper as StatefulToggleField };
