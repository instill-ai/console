import dot from "@/lib/dot";
import { Nullable } from "@/types/general";
import {
  BasicSingleSelect,
  BasicTextArea,
  BasicTextField,
  BasicToggleField,
  ProtectedBasicTextField,
} from "@instill-ai/design-system";
import { Dispatch, ReactNode, SetStateAction, useMemo, Fragment } from "react";
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
  selectedConditionMap: Nullable<SelectedItemMap>,
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>,
  formIsDirty: boolean,
  setFormIsDirty: Dispatch<SetStateAction<boolean>>
) => {
  const fields = useMemo(() => {
    if (!formTree) return <></>;
    return pickComponent(
      formTree,
      disabledAll,
      values,
      setValues,
      errors,
      selectedConditionMap,
      setSelectedConditionMap,
      formIsDirty,
      setFormIsDirty
    );
  }, [
    formTree,
    disabledAll,
    values,
    errors,
    selectedConditionMap,
    setSelectedConditionMap,
    setValues,
    formIsDirty,
    setFormIsDirty,
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
  selectedConditionMap: Nullable<SelectedItemMap>,
  setSelectedConditionMap: Dispatch<SetStateAction<Nullable<SelectedItemMap>>>,
  formIsDirty: boolean,
  setFormIsDirty: Dispatch<SetStateAction<boolean>>
): ReactNode => {
  if (formTree._type === "formGroup") {
    return (
      <Fragment key={formTree.path}>
        {formTree.properties.map((e) =>
          pickComponent(
            e,
            disabledAll,
            values,
            setValues,
            errors,
            selectedConditionMap,
            setSelectedConditionMap,
            formIsDirty,
            setFormIsDirty
          )
        )}
      </Fragment>
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
                selectedConditionMap,
                setSelectedConditionMap,
                formIsDirty,
                setFormIsDirty
              ),
            },
          ];
        })
      );

    return (
      <OneOfConditionSection
        key={formTree.path}
        formTree={{ ...formTree, conditions: conditionsWithUiFields }}
        setValues={setValues}
        selectedConditionMap={selectedConditionMap}
        setSelectedConditionMap={setSelectedConditionMap}
        errors={errors}
        disableAll={disabledAll}
        formIsDirty={formIsDirty}
        setFormIsDirty={setFormIsDirty}
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
      selectedConditionMap,
      setSelectedConditionMap,
      formIsDirty,
      setFormIsDirty
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
        onChange={(event) => {
          if (setFormIsDirty) setFormIsDirty(true);
          setValues((prev) => {
            const value = event.target.checked;
            const configuration = prev?.configuration ?? {};
            dot.setter(configuration, formTree.path, value);

            return {
              ...prev,
              configuration: configuration,
              [formTree.path]: value,
            };
          });
        }}
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
        onChange={(option) => {
          if (setFormIsDirty) setFormIsDirty(true);
          setValues((prev) => {
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, option?.value ?? null);
            return {
              ...prev,
              configuration: configuration,
              [formTree.path]: option?.value ?? null,
            };
          });
        }}
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
        onChange={(event) => {
          if (setFormIsDirty) setFormIsDirty(true);
          setValues((prev) => {
            const value = event.target.value;
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, value);
            return {
              ...prev,
              configuration: configuration,
              [formTree.path]: value,
            };
          });
        }}
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
        onChange={(event) => {
          if (setFormIsDirty) setFormIsDirty(true);
          setValues((prev) => {
            const value = event.target.value;
            const configuration = prev?.configuration || {};
            dot.setter(configuration, formTree.path, value);
            return {
              ...prev,
              configuration: configuration,
              [formTree.path]: value,
            };
          });
        }}
        readOnly={false}
      />
    );
  }

  const inputType = formTree.type === "integer" ? "number" : "text";

  return (
    <BasicTextField
      type={inputType}
      id={formTree.fieldKey}
      key={formTree.path}
      required={formTree.isRequired}
      description={formTree.description ?? ""}
      label={formTree.title ?? formTree.fieldKey ?? null}
      disabled={disabledAll}
      placeholder={placeholder ?? ""}
      error={errors ? errors[formTree.path] ?? null : null}
      value={values ? (values[formTree.path] as string) ?? "" : ""}
      onChange={(event) => {
        // In HTML type=number input, the value is still string, we need to transfer it into number
        // But in HTML number input, user can input e as exponential, parseInt will return NaN.
        // In this case, we pass the value to the Yup, and let it guard for us.
        if (setFormIsDirty) setFormIsDirty(true);
        setValues((prev) => {
          const value = event.target.value;
          const configuration = prev?.configuration || {};
          dot.setter(
            configuration,
            formTree.path,
            inputType === "number" ? parseInt(value) : value
          );
          return {
            ...prev,
            configuration: configuration,
            [formTree.path]: value,
          };
        });
      }}
      // Prevent type=number default behavior
      onWheel={(event) => {
        if (inputType === "number") {
          event.currentTarget.blur();
        }
      }}
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
