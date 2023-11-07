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
  const { nodeType, schema, data } = props;
  const fields = React.useMemo(() => {
    if (!schema) {
      return null;
    }

    const outputFormTree = transformInstillJSONSchemaToFormTree(schema);

    const fields = pickComponentOutputFieldsFromInstillFormTree({
      ...props,
      tree: outputFormTree,
    });

    return fields;
  }, [schema, nodeType, data]);

  return fields;
}
