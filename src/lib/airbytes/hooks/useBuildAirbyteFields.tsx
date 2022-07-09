import dot from "@/lib/dot";
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
  AirbyteFieldErrors,
  AirbyteFormGroupItem,
  AirbyteFormItem,
  AirbyteFormTree,
  AirbyteFieldValues,
  SelectedItemMap,
} from "../types";

const useBuildAirbyteFields = (
  formTree: Nullable<AirbyteFormTree>,
  disabledAll: boolean,
  values: Nullable<AirbyteFieldValues>,
  setValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>,
  errors: Nullable<AirbyteFieldErrors>,
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>
) => {
  const fields = useMemo(() => {
    if (!formTree) return <></>;
    return pickComponent(
      formTree,
      disabledAll,
      values,
      setValues,
      errors,
      setSelectedConditionMap
    );
  }, [
    formTree,
    disabledAll,
    values,
    errors,
    setSelectedConditionMap,
    setValues,
  ]);

  return fields;
};

export default useBuildAirbyteFields;

export const pickComponent = (
  formTree: AirbyteFormTree,
  disabledAll: boolean,
  values: Nullable<AirbyteFieldValues>,
  setValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>,
  errors: Nullable<AirbyteFieldErrors>,
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>
): ReactNode => {
  if (formTree._type === "formGroup") {
    return (
      <div key={formTree.path} className="flex flex-col gap-y-5">
        {formTree.properties.map((e) =>
          pickComponent(
            e,
            disabledAll,
            values,
            setValues,
            errors,
            setSelectedConditionMap
          )
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
                errors,
                setSelectedConditionMap
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
        setSelectedConditionMap={setSelectedConditionMap}
      />
    );
  }

  if (formTree._type === "objectArray") {
    return pickComponent(
      formTree.properties,
      disabledAll,
      values,
      setValues,
      errors,
      setSelectedConditionMap
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
        key={formTree.path}
        id={formTree.fieldKey}
        required={formTree.isRequired}
        description={formTree.description ?? ""}
        label={formTree.title ?? formTree.fieldKey ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        readOnly={false}
        error={errors ? errors[formTree.path] ?? null : null}
        value={values ? (values[formTree.path] as boolean) ?? false : false}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            const configuration = prev?.configuration ?? {};
            dot.setter(configuration, formTree.path, value);
            return {
              ...prev,
              configuration: configuration,
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
        label={formTree.title ?? formTree.fieldKey ?? null}
        disabled={disabledAll}
        error={errors ? errors[formTree.path] ?? null : null}
        options={options}
        value={
          values
            ? options.find((e) => e.value === values[formTree.path]) ??
              options.find((e) => e.value === formTree.default) ??
              null
            : null
        }
        onChangeInput={(_, option) =>
          setValues((prev) => {
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, option?.value ?? null);
            return {
              ...prev,
              configuration: configuration,
              [formTree.path]: option?.value ?? null,
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
        label={formTree.title ?? formTree.fieldKey ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        placeholder={placeholder ?? ""}
        error={errors ? errors[formTree.path] ?? null : null}
        value={values ? (values[formTree.path] as string) ?? "" : ""}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, value);
            return {
              ...prev,
              configuration: configuration,
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
        label={formTree.title ?? formTree.fieldKey ?? null}
        additionalMessageOnLabel={null}
        disabled={disabledAll}
        placeholder={placeholder ?? ""}
        error={errors ? errors[formTree.path] ?? null : null}
        value={values ? (values[formTree.path] as string) ?? "" : ""}
        onChangeInput={(_, value) =>
          setValues((prev) => {
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, value);
            return {
              ...prev,
              configuration: configuration,
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
      label={formTree.title ?? formTree.fieldKey ?? null}
      additionalMessageOnLabel={null}
      disabled={disabledAll}
      placeholder={placeholder ?? ""}
      error={errors ? errors[formTree.path] ?? null : null}
      value={values ? (values[formTree.path] as string) ?? "" : ""}
      onChangeInput={(_, value) =>
        setValues((prev) => {
          const configuration = prev?.configuration || {};
          dot.setter(configuration, formTree.path, value);
          return {
            ...prev,
            configuration: configuration,
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
