import { Nullable } from "@/types/general";
import {
  BasicUploadFileField,
  BasicUploadFileFieldProps,
} from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { FC } from "react";

export type UploadFileFieldProps = Omit<
  BasicUploadFileFieldProps,
  "onChangeInput"
> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: string) => void>;
};

const UploadFileField: FC<UploadFileFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  error,
  ...props
}) => {
  const onChange = (_: string, value: string) => {
    form.setFieldValue(field.name, value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(value);
    }
  };

  return (
    <BasicUploadFileField
      {...props}
      id={id}
      error={error}
      onChangeInput={onChange}
    />
  );
};

const UploadFileFieldFormikWrapper: FC<UploadFileFieldProps> = ({
  id,
  name,
  disabled,
  readOnly,
  required,
  description,
  label,
  additionalOnChangeCb,
  placeholder,
  uploadButtonText,
  error,
}) => {
  return (
    <Field
      id={id}
      name={name}
      component={UploadFileField}
      disabled={disabled}
      readOnly={readOnly}
      required={required}
      description={description}
      additionalOnChangeCb={additionalOnChangeCb}
      label={label}
      placeholder={placeholder}
      uploadButtonText={uploadButtonText}
      error={error}
    />
  );
};

export default UploadFileFieldFormikWrapper;
