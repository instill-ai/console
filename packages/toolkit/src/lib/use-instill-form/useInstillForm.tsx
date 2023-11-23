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
import { GeneralRecord, Nullable } from "../type";

export type UseInstillFormOptions = {
  disabledAll?: boolean;
  checkIsHidden?: CheckIsHidden;
  enableSmartHint?: boolean;
  componentID?: string;
  size?: "sm";
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
  const componentID = options?.componentID ?? "";
  const size = options?.size;

  const [formTree, setFormTree] = React.useState<InstillFormTree | null>(null);
  const [ValidatorSchema, setValidatorSchema] = React.useState<z.ZodTypeAny>(
    z.any()
  );
  const [initialValues, setInitialValues] =
    React.useState<Nullable<GeneralRecord>>(null);

  const [selectedConditionMap, setSelectedConditionMap] =
    useInstillSelectedConditionMap(formTree, data);

  const form = useForm<z.infer<typeof ValidatorSchema>>({
    resolver: zodResolver(ValidatorSchema),
    mode: "onChange",
    reValidateMode: "onChange",
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

    setSelectedConditionMap(_selectedConditionMap);

    const _ValidatorSchema = transformInstillJSONSchemaToZod({
      parentSchema: schema,
      targetSchema: schema,
      selectedConditionMap: _selectedConditionMap,
      checkIsHidden,
    });

    setValidatorSchema(_ValidatorSchema);

    const _data = transformInstillFormTreeToDefaultValue(_formTree);

    // Set initial values to the form. The data may be null or empty object
    const _defaultValues = data
      ? Object.keys(data).length !== 0
        ? data
        : _data
      : _data;

    setInitialValues(_defaultValues);
  }, [schema, checkIsHidden, data, form, setSelectedConditionMap]);

  // This will react to the first render and when the selectedConditionMap is changed
  React.useEffect(() => {
    if (!schema || !selectedConditionMap) return;

    const _ValidatorSchema = transformInstillJSONSchemaToZod({
      parentSchema: schema,
      targetSchema: schema,
      selectedConditionMap,
      checkIsHidden,
    });

    setValidatorSchema(_ValidatorSchema);
  }, [schema, selectedConditionMap, checkIsHidden]);

  // Delay the initialisation of the form after the first render
  React.useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const fields = React.useMemo(() => {
    if (!formTree) {
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
        componentID,
        size,
      }
    );

    return fields;
  }, [
    formTree,
    form,
    selectedConditionMap,
    setSelectedConditionMap,
    disabledAll,
    chooseTitleFrom,
    enableSmartHint,
    componentID,
    size,
  ]);

  return {
    form,
    fields,
    ValidatorSchema,
    formTree,
  };
}
