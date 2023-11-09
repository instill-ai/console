import * as React from "react";
import {
  dot,
  type Nullable,
  type AirbyteFormConditionItemWithUiFields,
  type AirbyteFieldErrors,
  type AirbyteFormGroupItem,
  type AirbyteFormItem,
  type AirbyteFormTree,
  type AirbyteFieldValues,
  type SelectedItemMap,
} from "../../lib";
import {
  BasicTextArea,
  BasicTextField,
  BasicToggleField,
  ProtectedBasicTextField,
  Select,
} from "@instill-ai/design-system";
import { OneOfConditionSection } from ".";

export const useBuildAirbyteFields = (
  formTree: Nullable<AirbyteFormTree>,
  disabledAll: boolean,
  values: Nullable<AirbyteFieldValues>,
  setValues: React.Dispatch<React.SetStateAction<Nullable<AirbyteFieldValues>>>,
  errors: Nullable<AirbyteFieldErrors>,
  selectedConditionMap: Nullable<SelectedItemMap>,
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedItemMap>>
  >,
  formIsDirty: boolean,
  setFormIsDirty: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const fields = React.useMemo(() => {
    if (!formTree) return null;
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

export const pickComponent = (
  formTree: AirbyteFormTree,
  disabledAll: boolean,
  values: Nullable<AirbyteFieldValues>,
  setValues: React.Dispatch<React.SetStateAction<Nullable<AirbyteFieldValues>>>,
  errors: Nullable<AirbyteFieldErrors>,
  selectedConditionMap: Nullable<SelectedItemMap>,
  setSelectedConditionMap: React.Dispatch<
    React.SetStateAction<Nullable<SelectedItemMap>>
  >,
  formIsDirty: boolean,
  setFormIsDirty: React.Dispatch<React.SetStateAction<boolean>>
): React.ReactNode => {
  if (formTree._type === "formGroup") {
    return (
      <React.Fragment key={formTree.path}>
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
      </React.Fragment>
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
      <div key={formTree.path} className="flex flex-col space-y-2">
        <label className="text-semantic-fg-primary product-body-text-2-regular">
          {formTree.title ?? formTree.fieldKey ?? null}
        </label>
        <Select.Root
          required={formTree.isRequired}
          onValueChange={(value) => {
            if (setFormIsDirty) setFormIsDirty(true);
            setValues((prev) => {
              const configuration = prev?.configuration || {};
              dot.setter(configuration, formTree.path, value ?? null);
              return {
                ...prev,
                configuration: configuration,
                [formTree.path]: value ?? null,
              };
            });
          }}
          value={
            values
              ? options.find((e) => e.value === values[formTree.path])?.value ??
                options.find((e) => e.value === formTree.default)?.value ??
                undefined
              : undefined
          }
          disabled={disabledAll}
        >
          <Select.Trigger className="w-full !rounded-none">
            <Select.Value />
          </Select.Trigger>
          <Select.Content>
            {options.map((option) => (
              <Select.Item
                className="text-semantic-fg-primary product-body-text-2-regular group-hover:text-semantic-bg-primary data-[highlighted]:text-semantic-bg-primary"
                key={option.value}
                value={option.value}
              >
                <p className="my-auto">{option.label}</p>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <p className="text-[#1D243380] product-body-text-3-regular">
          {formTree.description ?? ""}
        </p>
        {errors ? (
          <p className="text-semantic-error-default product-body-text-3-regular">
            {errors[formTree.path] ?? null}
          </p>
        ) : null}
      </div>
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
        onFocus={() => {
          // When the user focus, we will remove the *****MASK***** value
          // This is a temp solution.

          if (setFormIsDirty) setFormIsDirty(true);
          setValues((prev) => {
            const value = "";
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
