import * as React from "react";
import Fuse from "fuse.js";
import { Button, Icons, Input } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  Pipeline,
  useEntity,
  useInfinitePipelines,
  useInstillStore,
  useShallow,
  useUserMe,
  useUserPipelines,
} from "../../../lib";
import {
  LoadingSpin,
  UserProfileCard,
  CardPipeline,
  CardSkeletonPipeline,
  UserProfileCardProps,
} from "../../../components";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Body = ({
  visitorCta,
}: {
  visitorCta?: UserProfileCardProps["visitorCta"];
}) => {
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const pipelines = useInfinitePipelines({
    pageSize: 10,
    accessToken,
    enabledQuery,
  });

  const entityObject = useEntity();

  const allPipelines = useUserPipelines({
    userName: entityObject.entityName,
    accessToken,
    enabled: enabledQuery && entityObject.isSuccess,
  });

  const publicPipelines = React.useMemo(() => {
    if (!allPipelines.isSuccess) {
      return [];
    }

    return allPipelines.data.filter((pipeline) => {
      const toplevelRule = pipeline.permission.users["*/*"];

      if (toplevelRule && toplevelRule.enabled) {
        return true;
      }

      return false;
    });
  }, [allPipelines.data, allPipelines.isSuccess]);

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const searchedPipelines = React.useMemo(() => {
    if (!pipelines.isSuccess) {
      return [];
    }

    const all: Pipeline[] = [];

    for (const page of pipelines.data.pages) {
      all.push(...page.pipelines);
    }

    if (!searchCode) {
      return all;
    }

    const fuse = new Fuse(all, {
      keys: ["id"],
    });

    return fuse.search(searchCode).map((result) => result.item);
  }, [pipelines.data, pipelines.isSuccess, searchCode]);

  return (
    <div className=" flex flex-row px-20">
      <div className="w-[288px] pr-4 pt-6">
        <UserProfileCard
          totalPipelines={null}
          totalPublicPipelines={publicPipelines.length}
          visitorCta={visitorCta}
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
          </div>
        </div>
        <div className="mb-4 flex flex-col gap-y-4">
          {pipelines.isSuccess ? (
            searchedPipelines.length === 0 ? (
              <div className="flex h-[500px] w-full shrink-0 grow-0 items-center justify-center rounded-sm border border-semantic-bg-line">
                <p className="text-semantic-fg-secondary product-body-text-2-semibold">
                  Let&rsquo;s build your first pipline! 🙌
                </p>
              </div>
            ) : (
              searchedPipelines.map((pipeline) => (
                <CardPipeline
                  key={pipeline.id}
                  ownerID={pipeline.owner.name.split("/")[1]}
                  pipeline={pipeline}
                  isOrg={pipeline.owner.name.split("/")[0] === "organizations"}
                  isOwner={pipeline.owner.name === me.data?.name}
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
