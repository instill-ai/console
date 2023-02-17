import { FC } from "react";
import { Field, FieldProps } from "formik";
import {
  BasicSingleSelect,
  BasicSingleSelectProps,
  SingleSelectOption,
} from "@instill-ai/design-system";
import { Nullable } from "@/types/general";

export type SingleSelectProps = Omit<
  BasicSingleSelectProps,
  "onChange" | "instanceId"
> & {
  name: string;
  additionalOnChangeCb?: Nullable<(option: SingleSelectOption) => void>;
};

const SingleSelectWrapper: FC<SingleSelectProps & FieldProps> = ({
  field,
  form,
  options,
  id,
  additionalOnChangeCb,
  menuPlacement,
  value,
  error,
  additionalMessageOnLabel,
  ...props
}) => {
  const onChange = (option: Nullable<SingleSelectOption>) => {
    if (!option) return;
    form.setFieldValue(field.name, option.value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(option);
    }
  };

  return (
    <BasicSingleSelect
      {...props}
      id={id}
      instanceId={id}
      error={error}
      options={options}
      onChange={onChange}
      menuPlacement={menuPlacement}
      value={value}
      inputLabelType="inset"
      additionalMessageOnLabel={additionalMessageOnLabel}
    />
  );
};

const SingleSelectFieldFormikWrapper: FC<SingleSelectProps> = ({
  id,
  name,
  options,
  disabled,
  readOnly,
  required,
  description,
  label,
  additionalOnChangeCb,
  additionalMessageOnLabel,
  menuPlacement,
  value,
  error,
}) => {
  return (
    <Field
      name={name}
      id={id}
      component={SingleSelectWrapper}
      options={options}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      additionalMessageOnLabel={additionalMessageOnLabel}
      value={value}
      menuPlacement={menuPlacement}
      error={error}
    />
  );
};

export { SingleSelectFieldFormikWrapper as SingleSelect };
