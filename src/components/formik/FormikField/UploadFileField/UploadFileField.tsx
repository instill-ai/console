import { Nullable } from "@/types/general";
import {
  BasicTextField,
  BasicUploadFileField,
} from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type UploadFileFieldProps = {
  name: string;
  disabled: boolean;
  readOnly: boolean;
  required: boolean;
  description: string;
  label: string;
  onChangeCb?: (value: string) => void;
  placeholder: string;
  uploadButtonText: string;
  error: Nullable<string>;
};

const UploadFileField: FC<UploadFileFieldProps & FieldProps> = ({
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
    <BasicUploadFileField
      {...props}
      id={name}
      error={error}
      onChangeInput={onChange}
    />
  );
};

const FormikWrapper: FC<UploadFileFieldProps> = ({
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  onChangeCb,
  placeholder,
  uploadButtonText,
  error,
}) => {
  return (
    <Field
      name={name}
      component={UploadFileField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      onChangeCb={onChangeCb}
      label={label}
      placeholder={placeholder}
      uploadButtonText={uploadButtonText}
      error={error}
    />
  );
};

export default FormikWrapper;
