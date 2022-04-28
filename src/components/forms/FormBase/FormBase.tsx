import {
  AutoCompleteWithIconOption,
  BasicAutoCompleteWithIcon,
  BasicTextArea,
  BasicTextField,
  BasicToggleField,
} from "@instill-ai/design-system";
import { FC } from "react";
import { FormField } from "../FormData";

export type FormBaseProps = {
  onInputChangeHandler: (id: string, inputValue: any) => void;
  onSubmitHandler: () => void;
  fields: FormField[];
};

const FormBase: FC<FormBaseProps> = ({
  onSubmitHandler,
  fields,
  onInputChangeHandler,
}) => {
  return (
    <form onSubmit={onSubmitHandler}>
      {fields.map((field) => {
        if (field.component === "text") {
          return (
            <BasicTextField
              id={field.id}
              error=""
              description={field.description}
              label={field.label}
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
              id={field.id}
              error=""
              description={field.description}
              label={field.label}
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
              id={field.id}
              error=""
              description={field.description}
              label={field.label}
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
              id={field.id}
              error=""
              description={field.description}
              label={field.label}
              disabled={field.disabled}
              readOnly={field.readonly}
              required={field.required}
              defaultChecked={Boolean(field.default)}
              onChangeInput={onInputChangeHandler}
            />
          );
        }
      })}
    </form>
  );
};

export default FormBase;
