import { FC } from "react";
import { FieldProps } from "formik";
import {
  BasicSingleSelect,
  SingleSelectOption,
} from "@instill-ai/design-system";

export type SingleSelectProps = FieldProps & {
  id: string;
  options: SingleSelectOption[];
  error: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
};

const SingleSelect: FC<SingleSelectProps> = ({
  id,
  field,
  form,
  options,
  error,
  disabled,
  readOnly,
  required,
  description,
  label,
}) => {
  const onChange = (_: string, option: SingleSelectOption) => {
    form.setFieldValue(field.name, option.value);
  };

  return (
    <BasicSingleSelect
      id={id}
      error={error}
      label={label}
      options={options}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeInput={onChange}
    />
  );
};

export default SingleSelect;
