import * as React from "react";
import Fuse from "fuse.js";
import { Button, Icons, Input } from "@instill-ai/design-system";

import {
  InstillStore,
  Nullable,
  Pipeline,
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

  const me = useUserMe({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const userPipelines = useUserPipelines({
    userName: me.isSuccess ? me.data.name : null,
    enabled: enabledQuery && me.isSuccess,
    accessToken,
  });

  const userPublicPipelines = React.useMemo(() => {
    if (!userPipelines.isSuccess) {
      return [];
    }

    return userPipelines.data.filter((pipeline) => {
      const toplevelRule = pipeline.sharing.users["*/*"];

      if (toplevelRule && toplevelRule.enabled) {
        return true;
      }

      return false;
    });
  }, [userPipelines.data, userPipelines.isSuccess]);

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

    const searchedResult = fuse.search(searchCode);

    // If user is logged in, we won't display user's owned public pipeline
    // in the hub page.

    if (me.isSuccess) {
      return searchedResult
        .map((result) => result.item)
        .filter((pipeline) => pipeline.owner_name === me.data.name);
    } else {
      return searchedResult.map((result) => result.item);
    }
  }, [pipelines.data, pipelines.isSuccess, searchCode, me.isSuccess, me.data]);

  return (
    <div className=" flex flex-row px-20">
      <div className="w-[288px] pr-4 pt-6">
        <UserProfileCard
          totalPipelines={null}
          totalPublicPipelines={userPublicPipelines.length}
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
                  ownerID={pipeline.owner_name.split("/")[1]}
                  pipeline={pipeline}
                  isOwner={pipeline.owner_name === me.data?.name}
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
