import {
  dot,
  Nullable,
  AirbyteFormTree,
  AirbyteFieldValues,
} from "@instill-ai/toolkit";
import * as React from "react";

export const useAirbyteFieldValues = (
  formTree: Nullable<AirbyteFormTree>,
  initialValue: Nullable<AirbyteFieldValues>
) => {
  const [fieldValues, setFieldValues] =
    React.useState<Nullable<AirbyteFieldValues>>(initialValue);

  React.useEffect(() => {
    if (!formTree) return;
    if (!fieldValues) {
      setFieldValues(initialValue);
      return;
    }

    if (!initialValue) {
      pickInitialValues(formTree, fieldValues, setFieldValues);
      return;
    }

    // When we switch the form value without triggering the rerender of the
    // whole component, we need to reset the field values to the new initial
    // value
    if (fieldValues.id !== initialValue.id) {
      setFieldValues(initialValue);
    }
  }, [formTree, fieldValues, setFieldValues, initialValue]);

  return { fieldValues, setFieldValues };
};

export const pickInitialValues = (
  formTree: AirbyteFormTree,
  fieldValues: Nullable<AirbyteFieldValues>,
  setFieldValues: React.Dispatch<
    React.SetStateAction<Nullable<AirbyteFieldValues>>
  >
) => {
  if (formTree._type === "formGroup") {
    formTree.properties.map((e) =>
      pickInitialValues(e, fieldValues, setFieldValues)
    );
    return;
  }

  if (formTree._type === "formCondition") {
    Object.entries(formTree.conditions).map(([, v]) => {
      pickInitialValues(v, fieldValues, setFieldValues);
    });
    return;
  }

  if (formTree._type === "objectArray") {
    pickInitialValues(formTree.properties, fieldValues, setFieldValues);
    return;
  }

  if (formTree.type === "boolean") {
    let setDefault = false;
    if (!fieldValues) {
      setDefault = true;
    } else {
      if (!fieldValues[formTree.path]) {
        setDefault = true;
      }
    }
    if ("default" in formTree && setDefault) {
      setFieldValues((prev) => {
        const defaultValue = formTree.default as boolean;
        const configuration = prev?.configuration ?? {};
        dot.setter(configuration, formTree.path, defaultValue);
        return {
          ...prev,
          configuration: configuration,
          [formTree.path]: defaultValue,
        };
      });
    }
    return;
  }

  if (formTree.type === "string" && formTree.enum && formTree.enum.length) {
    let setDefault = false;
    if (!fieldValues) {
      setDefault = true;
    } else {
      if (!fieldValues[formTree.path]) {
        setDefault = true;
      }
    }

    if ("default" in formTree && setDefault) {
      setFieldValues((prev) => {
        const defaultValue = formTree.default as string | boolean | number;
        const configuration = prev?.configuration || {};
        dot.setter(configuration, formTree.path, defaultValue);
        return {
          ...prev,
          configuration: configuration,
          [formTree.path]: defaultValue ?? null,
        };
      });
    }
    return;
  }

  if (formTree.type === "integer") {
    let setDefault = false;
    if (!fieldValues) {
      setDefault = true;
    } else {
      if (!fieldValues[formTree.path]) {
        setDefault = true;
      }
    }

    if ("default" in formTree && setDefault) {
      setFieldValues((prev) => {
        const defaultValue = formTree.default as number;
        const configuration = prev?.configuration || {};
        dot.setter(configuration, formTree.path, defaultValue);
        return {
          ...prev,
          configuration: configuration,
          [formTree.path]: defaultValue,
        };
      });
    }
    return;
  }

  let setDefault = false;
  if (!fieldValues) {
    setDefault = true;
  } else {
    if (!fieldValues[formTree.path]) {
      setDefault = true;
    }
  }
  if ("default" in formTree && setDefault) {
    setFieldValues((prev) => {
      const defaultValue = formTree.default as string;
      const configuration = prev?.configuration || {};
      dot.setter(configuration, formTree.path, defaultValue);
      return {
        ...prev,
        configuration: configuration,
        [formTree.path]: defaultValue,
      };
    });
  }
};
