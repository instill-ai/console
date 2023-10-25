import * as React from "react";
import * as z from "zod";
import { InstillFormTree, InstillJSONSchema } from "./type";
import {
  transformInstillJSONSchemaToFormTree,
  transformInstillJSONSchemaToZod,
  transformInstillFormTreeToInitialSelectedCondition,
  transformInstillFormTreeToDefaultValue,
} from "./transform";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pickFieldComponentFromInstillFormTree } from "./pick";
import { useInstillSelectedConditionMap } from "./useInstillSelectedConditionMap";
import { GeneralRecord } from "../type";

export function useInstillForm({
  schema,
  data,
  disabledAll,
  checkIsHiddenByFormTree,
  checkIsHiddenBySchema,
}: {
  schema: InstillJSONSchema | null;
  data: GeneralRecord | null;
  disabledAll?: boolean;
  checkIsHiddenByFormTree?: (tree: InstillFormTree) => boolean;
  checkIsHiddenBySchema?: (schema: InstillJSONSchema) => boolean;
}) {
  const [formTree, setFormTree] = React.useState<InstillFormTree | null>(null);

  const [selectedConditionMap, setSelectedConditionMap] =
    useInstillSelectedConditionMap(formTree, data);

  const [ValidatorSchema, setValidatorSchema] = React.useState<z.ZodTypeAny>(
    z.any()
  );

  const form = useForm<z.infer<typeof ValidatorSchema>>({
    resolver: zodResolver(ValidatorSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
    defaultValues: data,
  });

  // The first render will come to here
  React.useEffect(() => {
    if (!schema) return;

    const _formTree = transformInstillJSONSchemaToFormTree({
      parentSchema: schema,
      targetSchema: schema,
    });

    setFormTree(_formTree);

    const _selectedConditionMap =
      transformInstillFormTreeToInitialSelectedCondition({
        tree: _formTree,
      });

    const _ValidatorSchema = transformInstillJSONSchemaToZod({
      parentSchema: schema,
      targetSchema: schema,
      selectedConditionMap: _selectedConditionMap,
      checkIsHiddenBySchema,
    });

    setValidatorSchema(_ValidatorSchema);

    const _data = transformInstillFormTreeToDefaultValue(_formTree);

    const _defaultValues = data ? data : _data;

    form.reset(_defaultValues);
  }, [schema, checkIsHiddenBySchema, data, form]);

  React.useEffect(() => {
    if (!schema || !selectedConditionMap) return;

    const _ValidatorSchema = transformInstillJSONSchemaToZod({
      parentSchema: schema,
      targetSchema: schema,
      selectedConditionMap,
    });

    setValidatorSchema(_ValidatorSchema);
  }, [schema, selectedConditionMap]);

  const { fields } = React.useMemo(() => {
    if (!schema || !formTree) {
      return { fields: null, formTree: null };
    }

    return {
      fields: pickFieldComponentFromInstillFormTree({
        form,
        tree: formTree,
        selectedConditionMap,
        setSelectedConditionMap,
        checkIsHiddenByFormTree,
        disabledAll,
      }),
      formTree,
    };
  }, [
    schema,
    selectedConditionMap,
    formTree,
    checkIsHiddenByFormTree,
    form,
    selectedConditionMap,
    disabledAll,
  ]);

  return {
    form,
    fields,
    ValidatorSchema,
    formTree,
  };
}
