import * as React from "react";
import * as z from "zod";
import { CheckIsHidden, InstillFormTree, InstillJSONSchema } from "./type";
import {
  transformInstillJSONSchemaToFormTree,
  transformInstillJSONSchemaToZod,
  transformInstillFormTreeToInitialSelectedCondition,
  transformInstillFormTreeToDefaultValue,
} from "./transform";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PickRegularFieldsFromInstillFormTreeOptions,
  pickRegularFieldsFromInstillFormTree,
} from "./pick";
import { useInstillSelectedConditionMap } from "./useInstillSelectedConditionMap";
import { GeneralRecord } from "../type";

export type UseInstillFormOptions = {
  disabledAll?: boolean;
  checkIsHidden?: CheckIsHidden;
  enableSmartHint?: boolean;
} & Pick<PickRegularFieldsFromInstillFormTreeOptions, "chooseTitleFrom">;

export function useInstillForm(
  schema: InstillJSONSchema | null,
  data: GeneralRecord | null,
  options?: UseInstillFormOptions
) {
  const disabledAll = options?.disabledAll ?? false;
  const chooseTitleFrom = options?.chooseTitleFrom ?? "title";
  const checkIsHidden = options?.checkIsHidden ?? undefined;
  const enableSmartHint = options?.enableSmartHint ?? false;

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
      checkIsHidden,
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
      checkIsHidden,
    });

    setValidatorSchema(_ValidatorSchema);

    const _data = transformInstillFormTreeToDefaultValue(_formTree);

    const _defaultValues = data ? data : _data;

    form.reset(_defaultValues);
  }, [schema, checkIsHidden, data, form]);

  React.useEffect(() => {
    if (!schema || !selectedConditionMap) return;

    const _ValidatorSchema = transformInstillJSONSchemaToZod({
      parentSchema: schema,
      targetSchema: schema,
      selectedConditionMap,
    });

    setValidatorSchema(_ValidatorSchema);
  }, [schema, selectedConditionMap]);

  const fields = React.useMemo(() => {
    if (!schema || !formTree) {
      return null;
    }

    const fields = pickRegularFieldsFromInstillFormTree(
      formTree,
      form,
      selectedConditionMap,
      setSelectedConditionMap,
      {
        disabledAll,
        chooseTitleFrom,
        enableSmartHint,
      }
    );

    return fields;
  }, [
    schema,
    formTree,
    form,
    selectedConditionMap,
    setSelectedConditionMap,
    disabledAll,
    chooseTitleFrom,
    enableSmartHint,
  ]);

  return {
    form,
    fields,
    ValidatorSchema,
    formTree,
  };
}
