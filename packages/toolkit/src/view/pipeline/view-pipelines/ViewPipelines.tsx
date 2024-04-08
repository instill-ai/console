"use client";

import * as React from "react";
import { Button, Icons, Input, Select } from "@instill-ai/design-system";

import {
  Nullable,
  Pipeline,
  useInfiniteUserPipelines,
  InstillStore,
  useInstillStore,
  useShallow,
  useAuthenticatedUser,
  useAppEntity,
  Visibility,
} from "../../../lib";
import {
  LoadingSpin,
  CardPipeline,
  CardSkeletonPipeline,
  UserProfileCard,
  UserProfileCardProps,
} from "../../../components";
import { CreatePipelineDialog } from "./CreatePipelineDialog";
import debounce from "lodash.debounce";
import { useParams } from "next/navigation";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipelines = ({
  organizations,
}: {
  organizations?: UserProfileCardProps["organizations"];
}) => {
  const params = useParams();
  const visibility = params.visibility ? String(params.visibility) : null;
  const [searchCode, setSearchCode] = React.useState<Nullable<string>>(null);
  const [searchInputValue, setSearchInputValue] =
    React.useState<Nullable<string>>(null);

  const [selectedVisibilityOption, setSelectedVisibilityOption] =
    React.useState<Visibility>(
      visibility === "VISIBILITY_PUBLIC"
        ? "VISIBILITY_PUBLIC"
        : "VISIBILITY_UNSPECIFIED"
    );

  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const entity = useAppEntity();

  const pipelines = useInfiniteUserPipelines({
    pageSize: 10,
    accessToken,
    userName: entity.data.entityName,
    enabledQuery: enabledQuery && entity.isSuccess,
    filter: searchCode ? `q="${searchCode}"` : null,
    visibility: selectedVisibilityOption ?? null,
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
    []
  );

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
        <div className="mb-4 grid grid-flow-row grid-cols-3 gap-x-3">
          <div className="flex flex-col gap-y-2.5">
            <p className="text-semantic-fg-primary product-body-text-3-semibold">
              Search Pipelines
            </p>
            <div className="mt-auto flex flex-row gap-x-4">
              <Input.Root className="flex-1">
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
              <Select.Trigger className="mt-auto w-full">
                <Select.Value />
              </Select.Trigger>
              <Select.Content>
                <Select.Group>
                  <Select.Item value="VISIBILITY_UNSPECIFIED">All</Select.Item>
                  <Select.Item value="VISIBILITY_PUBLIC">Public</Select.Item>
                  <Select.Item value="VISIBILITY_PRIVATE">Private</Select.Item>
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
                  ownerID={pipeline.owner_name.split("/")[1]}
                  pipeline={pipeline}
                  isOwner={
                    me.isSuccess ? pipeline.owner_name === me.data.name : false
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
