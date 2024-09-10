import * as React from "react";

import { GeneralRecord, Nullable } from "../type";
import {
  pickComponentOutputFieldsFromInstillFormTree,
  PickComponentOutputFieldsFromInstillFormTreeProps,
} from "./pick";
import { transformInstillJSONSchemaToFormTree } from "./transform";
import { InstillJSONSchema } from "./types";

export type UseComponentOutputFieldsProps = {
  schema: Nullable<InstillJSONSchema>;
  data: Nullable<GeneralRecord>;
} & Pick<
  PickComponentOutputFieldsFromInstillFormTreeProps,
  "chooseTitleFrom" | "hideField" | "mode" | "forceFormatted"
>;

export function useComponentOutputFields({
  schema,
  data,
  chooseTitleFrom,
  hideField,
  mode,
  forceFormatted,
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
      forceFormatted,
    });

    return fields;
  }, [schema, data, chooseTitleFrom, hideField, mode, forceFormatted]);

  return fields;
}
