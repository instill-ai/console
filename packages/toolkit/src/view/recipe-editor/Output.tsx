"use client";

import * as React from "react";
import Image from "next/image";

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
    forceFormatted: true,
  });

  const hasOutput = React.useMemo(() => {
    if (triggerPipelineStreamMap?.pipeline?.output) {
      return true;
    }
    return false;
  }, [triggerPipelineStreamMap]);

  return (
    <div className="flex flex-col py-4 w-full h-full">
      {hasOutput ? (
        <div className="flex flex-col gap-y-1 rounded bg-semantic-bg-primary">
          {componentOutputFields}
        </div>
      ) : (
        <div className="flex flex-row items-center justify-center gap-x-4 pt-24">
          <Image
            src="/images/models/no-result.svg"
            width={41}
            height={40}
            alt="Square shapes"
          />
          <p className="font-mono text-sm italic text-semantic-fg-disabled">
            Run the pipeline to view the results
          </p>
        </div>
      )}
    </div>
  );
};
