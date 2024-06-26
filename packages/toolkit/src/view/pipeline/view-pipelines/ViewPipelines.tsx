"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import debounce from "lodash.debounce";

import { Button, Icons, Input, Select } from "@instill-ai/design-system";

import {
  CardPipeline,
  CardSkeletonPipeline,
  LoadingSpin,
  UserProfileCard,
} from "../../../components";
import {
  InstillStore,
  Nullable,
  Pipeline,
  useAuthenticatedUser,
  useInfiniteUserPipelines,
  useInstillStore,
  useRouteInfo,
  useShallow,
  useUserPipelines,
  Visibility,
} from "../../../lib";
import { CreatePipelineDialog } from "./CreatePipelineDialog";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipelines = () => {
  const searchParams = useSearchParams();
  const visibility = searchParams.get("visibility");
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);

  const [selectedVisibilityOption, setSelectedVisibilityOption] =
    React.useState<Visibility>(
      visibility === "VISIBILITY_PUBLIC"
        ? "VISIBILITY_PUBLIC"
        : "VISIBILITY_UNSPECIFIED",
    );

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const routeInfo = useRouteInfo();

  const pipelines = useInfiniteUserPipelines({
    pageSize: 10,
    accessToken,
    userName: routeInfo.data.namespaceName,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
  });

  const myPipelines = useInfiniteUserPipelines({
    userName: me.isSuccess ? me.data.name : null,
    enabledQuery: enabledQuery && me.isSuccess,
    accessToken,
    pageSize: 10,
    visibility: null,
    filter: null,
  });

  const userPublicPipelines = useUserPipelines({
    userName: me.isSuccess ? me.data.name : null,
    enabled: enabledQuery && me.isSuccess,
    accessToken,
    filter: null,
    visibility: "VISIBILITY_PUBLIC",

    // Use these parameters to speed up request
    disabledViewFull: true,
    pageSize: 100,
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
  }, [pipelines.data, pipelines.isSuccess]);

  const debouncedSetSearchCode = React.useMemo(
    () =>
      debounce((value: string) => {
        setSearchCode(value);
      }, 300),
    [],
  );

  return (
    <div className="flex flex-row px-20">
      <div className="w-[288px] pr-4 pt-6">
        <UserProfileCard
          totalPipelines={
            myPipelines.isSuccess ? myPipelines.data.pages[0].totalSize : null
          }
          totalPublicPipelines={userPublicPipelines.data?.length ?? null}
        />
      </div>
      <div className="flex w-[630px] flex-col py-6">
        <div className="mb-4 grid grid-flow-row grid-cols-3 gap-x-3">
          <div className="flex flex-col gap-y-2.5">
            <p className="text-semantic-fg-primary product-body-text-3-semibold">
              Search Pipelines
            </p>
            <div className="mt-auto flex h-10 flex-row gap-x-4">
              <Input.Root className="flex-1 !rounded">
                <Input.LeftIcon>
                  <Icons.SearchSm className="my-auto h-4 w-4 stroke-semantic-fg-primary" />
                </Input.LeftIcon>
                <Input.Core
                  value={searchInputValue ?? ""}
                  placeholder="Search..."
                  onChange={(event) => {
                    setSearchInputValue(event.target.value);
                    debouncedSetSearchCode(event.target.value);
                  }}
                />
              </Input.Root>
            </div>
          </div>
          <div className="flex flex-col gap-y-2.5">
            <p className="text-semantic-fg-primary product-body-text-3-semibold">
              Visibility
            </p>
            <Select.Root
              value={selectedVisibilityOption}
              onValueChange={(value) => {
                setSelectedVisibilityOption(value as Visibility);
              }}
            >
              <Select.Trigger className="mt-auto w-full !rounded">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="VISIBILITY_UNSPECIFIED" label="All" />
                  <Select.Item value="VISIBILITY_PUBLIC" label="Public" />
                  <Select.Item value="VISIBILITY_PRIVATE" label="Private" />
                </Select.Group>
              </Select.Content>
            </Select.Root>
          </div>
          <CreatePipelineDialog className="mt-auto" />
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
                  ownerID={pipeline.ownerName.split("/")[1]}
                  pipeline={pipeline}
                  isOwner={
                    me.isSuccess ? pipeline.ownerName === me.data.name : false
                  }
                  ownerDisplayName={
                    "user" in pipeline.owner
                      ? pipeline.owner.user.profile?.displayName ?? null
                      : pipeline.owner.organization.profile?.displayName ?? null
                  }
                />
              ))
            )
          ) : (
            Array.from({ length: 1 }).map((_, index) => (
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
