import {
  BasicSingleSelect,
  BasicTextArea,
  BasicToggleField,
} from "@instill-ai/design-system";
import { Dispatch, ReactNode, SetStateAction } from "react";
import {
  AirbyteFormGroupItem,
  AirbyteFormItem,
  AirbyteFormTree,
  AirbyteFormValue,
} from "./types";

const useBuildForm = (
  formTree: AirbyteFormTree
  //formFieldValue: Record<string, any>,

  //disabledAll: boolean
) => {
  if (formTree._type === "formGroup") {
    console.log("hi");
  }
};

export default useBuildForm;

export const pickComponent = (
  formTree: AirbyteFormTree,
  disabledAll: boolean,
  values: AirbyteFormValue,
  setValues: Dispatch<SetStateAction<AirbyteFormValue>>,
  errors: Record<string, string>
): ReactNode => {
  if (formTree._type === "formGroup") {
    return (
      <>
        {formTree.properties.map((e) =>
          pickComponent(e, disabledAll, values, setValues, errors)
        )}
      </>
    );
  }

  if (formTree._type === "formCondition") {
    return <div></div>;
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

  const placeholder = getPlaceholder(formTree);

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
        instanceId={formTree.fieldKey}
        required={formTree.isRequired}
        description={formTree.description}
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
        required={formTree.isRequired}
        description={formTree.description}
        label={formTree.title ?? null}
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
        additionalMessageOnLabel={null}
        enableCounter={false}
        counterWordLimit={0}
        readOnly={false}
      />
    );
  }

  if (formTree.type === "boolean") {
    return (
      <BasicToggleField
        id={formTree.fieldKey}
        required={formTree.isRequired}
        description={formTree.description}
        label={formTree.title ?? null}
        disabled={disabledAll}
        readOnly={false}
        error={errors[formTree.path]}
      />
    );
  }
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
