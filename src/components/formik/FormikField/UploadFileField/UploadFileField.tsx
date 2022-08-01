import { Nullable } from "@/types/general";
import {
  BasicUploadFileField,
  BasicUploadFileFieldProps,
} from "@instill-ai/design-system";
import { Field, FieldProps } from "formik";
import { ChangeEvent , FC } from "react";

export type UploadFileFieldProps = Omit<
  BasicUploadFileFieldProps,
  "onChange"
> & {
  name: string;
  additionalOnChangeCb: Nullable<(value: string) => void>;
};

const UploadFileField: FC<UploadFileFieldProps & FieldProps> = ({
  field,
  form,
  id,
  additionalOnChangeCb,
  additionalMessageOnLabel,
  error,
  ...props
}) => {
  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    form.setFieldValue(field.name, event.target.value);
    if (additionalOnChangeCb) {
      additionalOnChangeCb(event.target.value);
    }
  };

  return (
    <BasicUploadFileField
      {...props}
      id={id}
      error={error}
      onChange={onChange}
      additionalMessageOnLabel={additionalMessageOnLabel}
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
  additionalMessageOnLabel,
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
      additionalMessageOnLabel={additionalMessageOnLabel}
      placeholder={placeholder}
      uploadButtonText={uploadButtonText}
      error={error}
    />
  );
};

export default UploadFileFieldFormikWrapper;
