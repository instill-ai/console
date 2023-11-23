import {
  InstillJSONSchema,
  Nullable,
  PipelineTrace,
  useComponentOutputFields,
} from "../../../lib";

export const ComponentOutputs = ({
  componentID,
  outputSchema,
  traces,
}: {
  componentID: string;
  outputSchema: Nullable<InstillJSONSchema>;
  traces: Nullable<Record<string, PipelineTrace>>;
}) => {
  const componentOutputFields = useComponentOutputFields({
    schema: outputSchema,
    data: traces ? traces[componentID].outputs[0] : null,
    nodeType: "connector",
  });

  return (
    <div className="flex flex-col">
      <div className="mb-1 product-body-text-4-medium">output</div>
      <div className="flex flex-col gap-y-1">{componentOutputFields}</div>
    </div>
  );
};
