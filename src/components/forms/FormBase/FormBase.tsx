import {
  AutoCompleteWithIconOption,
  BasicAutoCompleteWithIcon,
  BasicTextArea,
  BasicTextField,
  BasicToggleField,
} from "@instill-ai/design-system";
import { FC, ReactNode } from "react";
import { FormField } from "../FormData";

export type FormBaseProps = {
  onInputChangeHandler: (id: string, inputValue: any) => void;
  onSubmitHandler: (event: any) => void;
  fields: FormField[];
  error: Record<string, string>;
  submitButton: ReactNode;
};

const FormBase: FC<FormBaseProps> = ({
  onSubmitHandler,
  fields,
  error,
  onInputChangeHandler,
  submitButton,
}) => {
  return (
    <form className="flex flex-col gap-y-10" onSubmit={onSubmitHandler}>
      {fields.map((field) => {
        if (field.component === "text") {
          return (
            <BasicTextField
              key={field.id}
              id={field.id}
              error={error[field.id]}
              description={field.description}
              label={field.title}
              type={field.type as string}
              disabled={field.disabled}
              readOnly={field.readonly}
              placeholder={field.placeholder}
              required={field.required}
              autoComplete="on"
              onChangeInput={onInputChangeHandler}
            />
          );
        }

        if (field.component === "textarea") {
          return (
            <BasicTextArea
              key={field.id}
              id={field.id}
              error={error[field.id]}
              description={field.description}
              label={field.title}
              disabled={field.disabled}
              readOnly={field.readonly}
              placeholder={field.placeholder}
              required={field.required}
              autoComplete="off"
              onChangeInput={onInputChangeHandler}
              enableCounter={field.enableCounter ? field.enableCounter : false}
              counterWordLimit={
                field.counterWordLimit ? field.counterWordLimit : 0
              }
              value={typeof field.default === "string" ? field.default : ""}
            />
          );
        }

        if (field.component === "select") {
          return (
            <BasicAutoCompleteWithIcon
              key={field.id}
              id={field.id}
              error={error[field.id]}
              description={field.description}
              label={field.title}
              disabled={field.disabled}
              readOnly={field.readonly}
              required={field.required}
              onChangeInput={onInputChangeHandler}
              options={field.options as AutoCompleteWithIconOption[]}
              defaultValue={
                typeof field.default === "string" ? undefined : field.default
              }
            />
          );
        }

        if (field.component === "toggle") {
          return (
            <BasicToggleField
              key={field.id}
              id={field.id}
              error={error[field.id]}
              description={field.description}
              label={field.title}
              disabled={field.disabled}
              readOnly={field.readonly}
              required={field.required}
              defaultChecked={Boolean(field.default)}
              onChangeInput={onInputChangeHandler}
            />
          );
        }
      })}
      {submitButton}
    </form>
  );
};

export default FormBase;
