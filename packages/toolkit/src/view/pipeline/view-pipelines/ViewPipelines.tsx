import { useRouter } from "next/router";
import { useInfiniteUserPipelines } from "../../../lib";
import { CardUserProfile } from "./CardUserProfile";
import { InstillStore, useInstillStore, useShallow } from "../../../lib";
import {
  CardPipeline,
  CardSkeletonPipeline,
} from "../../../components/card-pipeline";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipelines = () => {
  const router = useRouter();
  const { entity, id } = router.query;

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const pipelines = useInfiniteUserPipelines({
    userName: `users/${entity}`,
    pageSize: 10,
    accessToken,
  });

  console.log(pipelines);

  return (
    <div className="flex flex-row">
      <div className="w-[288px] pr-4 pt-6">
        <CardUserProfile />
      </div>
      <div className="flex w-[630px] flex-col gap-y-4 pt-6">
        {pipelines.isSuccess
          ? pipelines.data.pages.map((page) => {
              return page.pipelines.map((pipeline) => (
                <CardPipeline
                  key={pipeline.id}
                  ownerID={pipeline.owner?.split("/")[1]}
                  pipelineID={pipeline.id}
                  recipe={pipeline.recipe}
                  metadata={pipeline.metadata}
                />
              ));
            })
          : Array.from({ length: 10 }).map((_, index) => (
              <CardSkeletonPipeline key={`card-skelton-${index}`} />
            ))}
      </div>
    </div>
  );
};
