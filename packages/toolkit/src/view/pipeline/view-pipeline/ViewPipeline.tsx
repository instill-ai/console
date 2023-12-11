import { useRouter } from "next/router";
import {
  InstillStore,
  useInstillStore,
  useShallow,
  useUserPipeline,
} from "../../../lib";
import { ReadOnlyPipelineBuilder } from "../../pipeline-builder";
import { Head } from "./Head";
import { InOutPut } from "./InOutPut";
import { Readme } from "./Readme";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = () => {
  const router = useRouter();
  const { id, entity } = router.query;
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const pipeline = useUserPipeline({
    pipelineName: `users/${entity}/pipelines/${id}`,
    accessToken,
    enabled: enabledQuery && !!accessToken,
  });

  return (
    <div className="flex h-full flex-col">
      <Head />
      <div className="mx-auto flex flex-1 flex-row px-8">
        <div className="flex h-full w-[718px] flex-col gap-y-6 py-10 pr-10">
          <ReadOnlyPipelineBuilder
            recipe={pipeline.isSuccess ? pipeline.data.recipe : null}
            metadata={pipeline.isSuccess ? pipeline.data.metadata : null}
            className="h-[378px] w-full"
          />
          <Readme />
        </div>
        <div className="flex w-[594px] flex-col py-10 pr-4">
          <InOutPut />
        </div>
      </div>
    </div>
  );
};
