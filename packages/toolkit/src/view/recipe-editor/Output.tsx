import {
  InstillJSONSchema,
  InstillStore,
  Nullable,
  useComponentOutputFields,
  useInstillStore,
  useShallow,
} from "../../lib";

const selector = (store: InstillStore) => ({
  triggerPipelineStreamMap: store.triggerPipelineStreamMap,
});

export const Output = ({
  outputSchema,
}: {
  outputSchema: Nullable<InstillJSONSchema>;
}) => {
  const { triggerPipelineStreamMap } = useInstillStore(useShallow(selector));

  const componentOutputFields = useComponentOutputFields({
    mode: "build",
    schema: outputSchema,
    data: triggerPipelineStreamMap?.pipeline?.output ?? null,
    chooseTitleFrom: "title",
  });

  return (
    <div className="flex flex-col py-4 w-full h-full">
      <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary">
        {componentOutputFields}
      </div>
    </div>
  );
};
