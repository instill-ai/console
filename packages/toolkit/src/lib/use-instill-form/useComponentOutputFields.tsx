import * as React from "react";
import { pickComponentOutputFieldsFromInstillFormTree } from "./pick";
import { InstillJSONSchema } from "./type";
import { PipelineTrace, TriggerUserPipelineResponse } from "../vdp-sdk";
import { Nullable } from "../type";
import { transformInstillJSONSchemaToFormTree } from "./transform";

export type UseComponentOutputFieldsProps =
  | {
      nodeType: "end";
      schema: Nullable<InstillJSONSchema>;
      data: Nullable<TriggerUserPipelineResponse["outputs"]>;
    }
  | {
      nodeType: "connector";
      schema: Nullable<InstillJSONSchema>;
      data: Nullable<PipelineTrace>;
    };

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
