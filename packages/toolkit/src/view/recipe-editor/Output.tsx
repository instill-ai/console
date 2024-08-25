import { InstillJSONSchema, Nullable } from "../../lib";
import { ComponentOutputs } from "../pipeline-builder/components/ComponentOutputs";

export const Output = ({
  id,
  outputSchema,
}: {
  id: string;
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  return (
    <div className="flex flex-col py-4 w-full">
      <ComponentOutputs
        componentID={id}
        outputSchema={outputSchema}
        nodeType="end"
        chooseTitleFrom="title"
      />
    </div>
  );
};
