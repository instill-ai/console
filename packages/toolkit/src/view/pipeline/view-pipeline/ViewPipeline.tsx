import * as React from "react";
import {
  InstillStore,
  useEntity,
  useInstillStore,
  useShallow,
  useUserMe,
  useUserPipeline,
} from "../../../lib";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder";
import { Head } from "./Head";
import { InOutPut, InOutPutProps } from "./InOutPut";
import { Readme } from "./Readme";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = ({
  visitorCta,
}: {
  visitorCta?: InOutPutProps["visitorCta"];
}) => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const entityObject = useEntity();

  const pipeline = useUserPipeline({
    pipelineName: entityObject.pipelineName,
    accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
  });

  const isOwner = React.useMemo(() => {
    if (!pipeline.isSuccess || !me.isSuccess) {
      return false;
    }

    return pipeline.data.owner_name === me.data.name;
  }, [pipeline.isSuccess, pipeline.data, me.isSuccess, me.data]);

  return (
    <div className="flex h-full flex-col">
      <Head isOwner={isOwner} />
      <div className="mx-auto flex flex-1 flex-row px-8">
        <div className="flex h-full w-[718px] flex-col gap-y-6 py-10 pr-10">
          <ReadOnlyPipelineBuilder
            recipe={pipeline.isSuccess ? pipeline.data.recipe : null}
            metadata={pipeline.isSuccess ? pipeline.data.metadata : null}
            className="h-[378px] w-full"
          />
          <div className="w-full bg-semantic-bg-base-bg px-3 py-2 text-semantic-fg-primary product-body-text-1-semibold">
            Pipeline Readme
          </div>
          <Readme
            isOwner={isOwner}
            readme={pipeline.isSuccess ? pipeline.data.readme : null}
          />
        </div>
        <div className="flex w-[594px] flex-col py-10 pr-4">
          <InOutPut visitorCta={visitorCta} />
        </div>
      </div>
    </div>
  );
};
