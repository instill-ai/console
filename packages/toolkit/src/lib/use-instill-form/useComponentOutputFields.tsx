import * as React from "react";
import {
  PickComponentOutputFieldsFromInstillFormTreeProps,
  pickComponentOutputFieldsFromInstillFormTree,
} from "./pick";
import { InstillJSONSchema } from "./type";
import { GeneralRecord, Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";

export type UseComponentOutputFieldsProps = {
  schema: Nullable<InstillJSONSchema>;
  data: Nullable<GeneralRecord>;
} & Pick<
  PickComponentOutputFieldsFromInstillFormTreeProps,
  "chooseTitleFrom" | "hideField" | "mode"
>;

export function useComponentOutputFields(props: UseComponentOutputFieldsProps) {
  const fields = React.useMemo(() => {
    if (!props.schema) {
      return null;
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(props.schema);

    console.log(outputFormTree);

    const fields = pickComponentOutputFieldsFromInstillFormTree({
      ...props,
      tree: outputFormTree,
    });

    return fields;
  }, [props]);

  return fields;
}
