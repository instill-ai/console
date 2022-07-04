import { Nullable } from "@/types/general";
import {
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  BasicToggleField,
  ProtectedBasicTextField,
} from "@instill-ai/design-system";
import { Dispatch, ReactNode, SetStateAction, useMemo } from "react";
import OneOfConditionSection from "../components/OneOfConditionSection";
import {
  AirbyteFormConditionItemWithUiFields,
  AirbyteFormErrors,
  AirbyteFormGroupItem,
  AirbyteFormItem,
  AirbyteFormTree,
  AirbyteFormValues,
} from "../types";

const useBuildForm = (
  formTree: Nullable<AirbyteFormTree>,
  disabledAll: boolean,
  values: AirbyteFormValues,
  setValues: Dispatch<SetStateAction<AirbyteFormValues>>,
  errors: AirbyteFormErrors
) => {
  const fields = useMemo(() => {
    if (!formTree) return <></>;
    return pickComponent(formTree, disabledAll, values, setValues, errors);
  }, [formTree, disabledAll, values, errors]);

  return fields;
};

export default useBuildForm;

export const pickComponent = (
  formTree: AirbyteFormTree,
  disabledAll: boolean,
  values: AirbyteFormValues,
  setValues: Dispatch<SetStateAction<AirbyteFormValues>>,
  errors: AirbyteFormErrors
): ReactNode => {
  if (formTree._type === "formGroup") {
    return (
      <div className="flex flex-col gap-y-5">
        {formTree.properties.map((e) =>
          pickComponent(e, disabledAll, values, setValues, errors)
        )}
      </div>
    );
  }

  if (formTree._type === "formCondition") {
    const conditionsWithUiFields: AirbyteFormConditionItemWithUiFields["conditions"] =
      Object.fromEntries(
        Object.entries(formTree.conditions).map(([k, v]) => {
          return [
            k,
            {
              ...v,
              uiFields: pickComponent(
                v,
                disabledAll,
                values,
                setValues,
                errors
              ),
            },
          ];
        })
      );

    return (
      <OneOfConditionSection
        formTree={{ ...formTree, conditions: conditionsWithUiFields }}
        values={values}
        setValues={setValues}
      />
    );
  }

  if (formTree._type === "objectArray") {
    return pickComponent(
      formTree.properties,
      disabledAll,
      values,
      setValues,
      errors
    );
  }

  // The const field is for condition render form, to represent the key of the condition itself
  // ref: https://github.com/airbytehq/airbyte/blob/59e20f20de73ced59ae2c782612fa7554fc1fced/airbyte-webapp/src/views/Connector/ServiceForm/components/Sections/FormSection.tsx#L28
  /**
   *  {
        "const": "SSH_KEY_AUTH",
        "description": "Connect through a jump server tunnel host using username and ssh key",
        "order": 0,
        "_type": "formItem",
        "path": "tunnel_method.tunnel_method",
        "fieldKey": "tunnel_method",
        "isRequired": true,
        "isSecret": false,
        "multiline": false,
        "type": "string"
      }
   */

  if (formTree.const !== undefined) {
    return null;
  }

  const placeholder = getPlaceholder(formTree);

  if (formTree.type === "boolean") {
    return (
      <BasicToggleField
        id={formTree.fieldKey}
        required={formTree.isRequired}
        description={formTree.description ?? ""}
        label={formTree.title ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        readOnly={false}
        error={errors[formTree.path] ?? null}
        value={(values[formTree.path] as boolean) ?? false}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            return {
              ...prev,
              [formTree.path]: value,
            };
          })
        }
      />
    );
  }

  if (formTree.type === "string" && formTree.enum && formTree.enum.length) {
    const options = formTree.enum.map((e) => {
      return {
        label: e?.toString() ?? "",
        value: e?.toString() ?? "",
      };
    });

    return (
      <BasicSingleSelect
        id={formTree.fieldKey}
        key={formTree.path}
        instanceId={formTree.fieldKey}
        required={formTree.isRequired}
        description={formTree.description ?? ""}
        label={formTree.title ?? null}
        disabled={disabledAll}
        error={errors[formTree.path] ?? null}
        options={options}
        value={
          options.find((e) => e.value === values[formTree.path]) ??
          options.find((e) => e.value === formTree.default) ??
          null
        }
        onChangeInput={(_, value) =>
          setValues((prev) => {
            return {
              ...prev,
              [formTree.path]: value,
            };
          })
        }
        readOnly={false}
        menuPlacement="auto"
        additionalMessageOnLabel={null}
      />
    );
  }

  if (formTree.type === "string" && formTree.multiline) {
    return (
      <BasicTextArea
        id={formTree.fieldKey}
        key={formTree.path}
        required={formTree.isRequired}
        description={formTree.description ?? ""}
        label={formTree.title ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        placeholder={placeholder ?? ""}
        error={errors[formTree.path] ?? null}
        value={(values[formTree.path] as string) ?? ""}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            return {
              ...prev,
              [formTree.path]: value,
            };
          })
        }
        autoComplete="off"
        enableCounter={false}
        counterWordLimit={0}
        readOnly={false}
      />
    );
  }

  if (formTree.type === "string" && formTree.isSecret) {
    return (
      <ProtectedBasicTextField
        id={formTree.fieldKey}
        key={formTree.path}
        required={formTree.isRequired}
        description={formTree.description ?? ""}
        label={formTree.title ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        placeholder={placeholder ?? ""}
        error={errors[formTree.path] ?? null}
        value={(values[formTree.path] as string) ?? ""}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            return {
              ...prev,
              [formTree.path]: value,
            };
          })
        }
        readOnly={false}
      />
    );
  }

  const inputType = formTree.type === "integer" ? "number" : "text";

  return (
    <BasicTextField
      id={formTree.fieldKey}
      key={formTree.path}
      required={formTree.isRequired}
      description={formTree.description ?? ""}
      label={formTree.title ?? null}
      additionalMessageOnLabel={null}
      disabled={disabledAll}
      placeholder={placeholder ?? ""}
      error={errors[formTree.path] ?? null}
      value={(values[formTree.path] as string) ?? ""}
      onChangeInput={(_, value) =>
        setValues((prev) => {
          return {
            ...prev,
            [formTree.path]: value,
          };
        })
      }
      autoComplete="off"
      readOnly={false}
      type={inputType}
    />
  );
};

const getPlaceholder = (
  formTree: AirbyteFormGroupItem | AirbyteFormItem
): string | null => {
  let placeholder: string | null;

  switch (typeof formTree.examples) {
    case "object":
      if (Array.isArray(formTree.examples)) {
        placeholder = `${formTree.examples[0]}`;
      }
      placeholder = null;
      break;
    case "number":
      placeholder = `${formTree.examples}`;
      break;
    case "string":
      placeholder = formTree.examples;
      break;
    default:
      placeholder = null;
  }

  return placeholder;
};
