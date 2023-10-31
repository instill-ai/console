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
import {
  PickFieldComponentFromInstillFormTreeOptions,
  pickFieldComponentFromInstillFormTree,
} from "./pick";
import { useInstillSelectedConditionMap } from "./useInstillSelectedConditionMap";
import { GeneralRecord } from "../type";

export type UseInstillFormOptions = {
  disabledAll?: boolean;
  checkIsHiddenBySchema?: (schema: InstillJSONSchema) => boolean;
} & Pick<
  PickFieldComponentFromInstillFormTreeOptions,
  "checkIsHiddenByTree" | "chooseTitleFrom"
>;

export function useInstillForm(
  schema: InstillJSONSchema | null,
  data: GeneralRecord | null,
  {
    disabledAll,
    checkIsHiddenByTree,
    checkIsHiddenBySchema,
    chooseTitleFrom,
  }: UseInstillFormOptions
) {
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

    const _formTree = transformInstillJSONSchemaToFormTree(schema, {
      parentSchema: schema,
    });

    setFormTree(_formTree);

    const _selectedConditionMap =
      transformInstillFormTreeToInitialSelectedCondition(_formTree, {
        initialData: data ?? undefined,
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
      fields: pickFieldComponentFromInstillFormTree(
        formTree,
        form,
        selectedConditionMap,
        setSelectedConditionMap,
        {
          checkIsHiddenByTree,
          disabledAll,
          chooseTitleFrom,
        }
      ),
      formTree,
    };
  }, [
    schema,
    formTree,
    checkIsHiddenByTree,
    form,
    selectedConditionMap,
    setSelectedConditionMap,
    disabledAll,
    chooseTitleFrom,
  ]);

  return {
    form,
    fields,
    ValidatorSchema,
    formTree,
  };
}
