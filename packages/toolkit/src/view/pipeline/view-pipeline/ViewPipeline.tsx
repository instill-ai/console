import * as React from "react";
import {
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder";
import { Head } from "./Head";
import { InOutPut, InOutPutProps } from "./InOutPut";
import {
  PipelineDescription,
  PipelineDescriptionProps,
} from "./PipelineDescription";
import { useRouter } from "next/router";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = ({
  visitorCta,
  editor,
  hasUnsavedChanges,
}: {
  visitorCta?: InOutPutProps["visitorCta"];
} & PipelineDescriptionProps) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const router = useRouter();

  const entityObject = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entityObject.pipelineName,
    accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
  });

  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  return (
    <div className="flex h-full flex-col">
      <Head />
      <div className="mx-auto flex flex-1 flex-row px-8">
        <div className="flex h-full w-[718px] flex-col gap-y-6 py-10 pr-10">
          <ReadOnlyPipelineBuilder
            pipelineName={pipeline.isSuccess ? pipeline.data.name : null}
            recipe={pipeline.isSuccess ? pipeline.data.recipe : null}
            metadata={pipeline.isSuccess ? pipeline.data.metadata : null}
            className="h-[378px] w-full"
          />
          <div className="w-full bg-semantic-bg-base-bg px-3 py-2 text-semantic-fg-primary product-body-text-1-semibold">
            Pipeline Description
          </div>
          <PipelineDescription
            editor={editor}
            hasUnsavedChanges={hasUnsavedChanges}
          />
        </div>
        <div className="flex w-[594px] flex-col py-10 pr-4">
          <InOutPut visitorCta={visitorCta} />
        </div>
      </div>
    </div>
  );
};
