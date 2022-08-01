import dot from "@/lib/dot";
import { Nullable } from "@/types/general";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { AirbyteFieldValues, AirbyteFormTree } from "../types";

const useAirbyteFieldValues = (formTree: Nullable<AirbyteFormTree>) => {
  const [fieldValues, setFieldValues] =
    useState<Nullable<AirbyteFieldValues>>(null);

  useEffect(() => {
    if (!formTree) return;
    if (fieldValues && fieldValues.configuration) return;
    console.log("let's pick");
    pickInitialValues(formTree, fieldValues, setFieldValues);
  }, [formTree, fieldValues, setFieldValues]);

  return { fieldValues, setFieldValues };
};

export default useAirbyteFieldValues;

export const pickInitialValues = (
  formTree: AirbyteFormTree,
  fieldValues: Nullable<AirbyteFieldValues>,
  setFieldValues: Dispatch<SetStateAction<Nullable<AirbyteFieldValues>>>
) => {
  if (formTree._type === "formGroup") {
    formTree.properties.map((e) =>
      pickInitialValues(e, fieldValues, setFieldValues)
    );
    return;
  }

  if (formTree._type === "formCondition") {
    Object.entries(formTree.conditions).map(([_, v]) => {
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
        console.log(configuration);
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
