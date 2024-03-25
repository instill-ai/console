import * as React from "react";
import {
  PickComponentOutputFieldsFromInstillFormTreeProps,
  pickComponentOutputFieldsFromInstillFormTree,
} from "./pick";
import { InstillJSONSchema } from "./types";
import { GeneralRecord, Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";

export type UseComponentOutputFieldsProps = {
  schema: Nullable<InstillJSONSchema>;
  data: Nullable<GeneralRecord>;
} & Pick<
  PickComponentOutputFieldsFromInstillFormTreeProps,
  "chooseTitleFrom" | "hideField" | "mode"
>;

export function useComponentOutputFields({
  schema,
  data,
  chooseTitleFrom,
  hideField,
  mode,
}: UseComponentOutputFieldsProps) {
  const fields = React.useMemo(() => {
    if (!schema) {
      return null;
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(schema);

    const fields = pickComponentOutputFieldsFromInstillFormTree({
      tree: outputFormTree,
      data,
      chooseTitleFrom,
      hideField,
      mode,
    });

    return fields;
  }, [schema, data, chooseTitleFrom, hideField, mode]);

  return fields;
}
