import * as React from "react";
import { Button, Icons, Input } from "@instill-ai/design-system";

import {
  Nullable,
  Pipeline,
  useInfiniteUserPipelines,
  InstillStore,
  useInstillStore,
  useShallow,
  useUserMe,
  useEntity,
} from "../../../lib";
import {
  LoadingSpin,
  CardPipeline,
  CardSkeletonPipeline,
  UserProfileCard,
  UserProfileCardProps,
} from "../../../components";
import { CreatePipelineDialog } from "./CreatePipelineDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipelines = ({
  organizations,
}: {
  organizations?: UserProfileCardProps["organizations"];
}) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const entityObject = useEntity();

  const pipelines = useInfiniteUserPipelines({
    pageSize: 10,
    accessToken,
    userName: entityObject.entityName,
    enabledQuery: enabledQuery && entityObject.isSuccess,
    filter: searchCode ? `q="${searchCode}"` : null,
  });

  const allPipelines = React.useMemo(() => {
    if (!pipelines.isSuccess) {
      return [];
    }

    const all: Pipeline[] = [];

    for (const page of pipelines.data.pages) {
      all.push(...page.pipelines);
    }

    return all;
  }, [pipelines.data, pipelines.isSuccess, searchCode]);

  return (
    <div className="flex flex-row px-20">
      <div className="w-[288px] pr-4 pt-6">
        <UserProfileCard
          totalPipelines={
            pipelines.isSuccess ? pipelines.data.pages[0].total_size : null
          }
          totalPublicPipelines={null}
          organizations={organizations}
        />
      </div>
      <div className="flex w-[630px] flex-col pt-6">
        <div className="mb-4 flex flex-col">
          <p className="mb-2.5 text-semantic-fg-primary product-body-text-3-semibold">
            Search Pipelines
          </p>
          <div className="flex flex-row gap-x-4">
            <Input.Root className="flex-1">
              <Input.LeftIcon>
                <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
              </Input.LeftIcon>
              <Input.Core
                value={searchCode ?? ""}
                placeholder="Search..."
                onChange={(event) => setSearchCode(event.target.value)}
              />
            </Input.Root>
            <CreatePipelineDialog />
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-y-4">
          {pipelines.isSuccess ? (
            allPipelines.length === 0 ? (
              <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                <p className=" text-semantic-fg-secondary product-body-text-2-semibold">
                  Let&rsquo;s build your first pipline! 🙌
                </p>
              </div>
            ) : (
              allPipelines.map((pipeline) => (
                <CardPipeline
                  key={pipeline.id}
                  ownerID={pipeline.owner_name.split("/")[1]}
                  pipeline={pipeline}
                  isOwner={
                    me.isSuccess ? pipeline.owner_name === me.data.name : false
                  }
                />
              ))
            )
          ) : (
            Array.from({ length: 10 }).map((_, index) => (
              <CardSkeletonPipeline key={`card-skelton-${index}`} />
            ))
          )}
        </div>
        {pipelines.hasNextPage ? (
          <Button
            onClick={() => {
              pipelines.fetchNextPage();
            }}
            variant="secondaryColour"
            size="md"
            className="w-full"
          >
            {pipelines.isFetchingNextPage ? <LoadingSpin /> : "Load More"}
          </Button>
        ) : null}
      </div>
    </div>
  );
};
