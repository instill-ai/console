"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSortedReleases } from "../../pipeline-builder";
import {
  Button,
  Icons,
  Tag,
  TabMenu,
  Skeleton,
  Popover,
  ScrollArea,
  toast,
} from "@instill-ai/design-system";
import {
  InstillStore,
  Nullable,
  isPublicPipeline,
  toastInstillError,
  useDeleteUserPipeline,
  useInstillStore,
  useOrganization,
  useShallow,
  useUser,
  useAuthenticatedUser,
  useUserPipeline,
  useAppEntity,
} from "../../../lib";
import { ClonePipelineDialog, EntityAvatar } from "../../../components";
import { EditMetadataDialog } from "./EditMetadataDialog";
import cn from "clsx";
import { Menu } from "./Menu";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const Head = ({
  currentVersion,
  handleVersion,
}: {
  handleVersion: (version: string) => void;
  currentVersion: Nullable<string>;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const [selectedTab, setSelectedTab] =
    React.useState<Nullable<string>>("overview");

  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const entity = useAppEntity();

  const user = useUser({
    userName: entity.isSuccess ? entity.data.entityName : null,
    accessToken,
    enabled:
      enabledQuery &&
      entity.isSuccess &&
      entity.data.namespaceType === "NAMESPACE_USER",
  });

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const organization = useOrganization({
    organizationID: entity.isSuccess ? entity.data.entity : null,
    accessToken,
    enabled:
      enabledQuery &&
      entity.isSuccess &&
      entity.data.namespaceType === "NAMESPACE_ORGANIZATION",
  });

  const pipeline = useUserPipeline({
    pipelineName: entity.isSuccess ? entity.data.pipelineName : null,
    accessToken,
    enabled: enabledQuery && entity.isSuccess,
    shareCode: shareCode ?? undefined,
  });

  const releases = useSortedReleases({
    pipelineName: entity.isSuccess ? entity.data.pipelineName : null,
    accessToken,
    enabledQuery: enabledQuery && entity.isSuccess,
    shareCode: shareCode ?? undefined,
  });

  const deletePipeline = useDeleteUserPipeline();
  async function handleDeletePipeline() {
    try {
      await deletePipeline.mutateAsync({
        pipelineName: pipeline.data?.name || "",
        accessToken: accessToken ? accessToken : null,
      });

      toast({
        title: "Pipeline deleted",
        variant: "alert-success",
        size: "large",
      });
      router.push(`/${entity.data.entity}/pipelines`);
    } catch (error) {
      toastInstillError({
        title: "Something went wrong when delete the pipeline",
        error,
        toast,
      });
    }
  }

  return (
    <React.Fragment>
      <style jsx={true}>{`
        .org-gradient {
          background: linear-gradient(45deg, #dce7fe, #fef1f2);
        }

        .user-gradient {
          background: linear-gradient(45deg, #efe7fe, #fef1f2);
        }
      `}</style>
      <div className="user-gradient relative flex min-h-[180px] flex-col bg-semantic-bg-primary">
        <div className="flex flex-row px-24 py-16">
          <div className="mr-auto flex max-w-5xl flex-col gap-y-3 ">
            <div className="flex w-full flex-row">
              <div className="mr-auto flex flex-row gap-x-3">
                {entity.isSuccess ? (
                  entity.data.namespaceType === "NAMESPACE_ORGANIZATION" ? (
                    <EntityAvatar
                      src={organization.data?.profile?.avatar ?? null}
                      entityName={organization.data?.name ?? ""}
                      className="my-auto h-6 w-6"
                      fallbackImg={
                        <div className="flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  ) : (
                    <EntityAvatar
                      src={user.data?.profile?.avatar ?? null}
                      entityName={user.data?.name ?? ""}
                      className="my-auto h-6 w-6"
                      fallbackImg={
                        <div className="flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                          <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
                        </div>
                      }
                    />
                  )
                ) : (
                  <Skeleton className="h-6 w-6 rounded-full" />
                )}

                {releases && pipeline.isSuccess ? (
                  <React.Fragment>
                    <div className="my-auto product-headings-heading-4">
                      <span
                        onClick={() => {
                          router.push(`/${entity.data.entity}`);
                        }}
                        className="cursor-pointer text-semantic-fg-disabled hover:!underline"
                      >
                        {entity.data.entity}
                      </span>
                      <span className="text-semantic-fg-disabled">/</span>
                      <span className="text-semantic-fg-primary">
                        {entity.data.id}
                      </span>
                    </div>

                    {releases.length && pipeline.isSuccess ? (
                      <Popover.Root
                        onOpenChange={() => setIsOpen(!isOpen)}
                        open={isOpen}
                      >
                        <Popover.Trigger asChild={true} className="my-auto">
                          <Button
                            className={cn(
                              "!h-8 !w-[145px] gap-x-1 !rounded-sm !border border-[#E1E6EF] !py-1 px-3 !transition-opacity !duration-300 !ease-in-out",
                              isOpen
                                ? "border-opacity-100 !bg-semantic-accent-bg "
                                : "border-opacity-0"
                            )}
                            size="sm"
                            variant="tertiaryColour"
                            type="button"
                            onClick={() => setIsOpen(true)}
                          >
                            <Tag
                              size="sm"
                              variant="darkPurple"
                              className="h-6 gap-x-2"
                            >
                              Version{" "}
                              {currentVersion === "latest"
                                ? releases[0]?.id
                                : currentVersion}
                            </Tag>
                            <Icons.ChevronDown className="h-4 w-4 stroke-semantic-fg-primary" />
                          </Button>
                        </Popover.Trigger>
                        <Popover.Content
                          side="top"
                          sideOffset={4}
                          align="start"
                          className="flex h-[180px] w-[145px] flex-col !rounded-sm !p-0"
                        >
                          <ScrollArea.Root>
                            <div className="flex flex-col gap-y-1 px-1.5 py-1">
                              {releases.length > 0 ? (
                                <React.Fragment>
                                  {releases.map((release) => (
                                    <VersionButton
                                      key={release.id}
                                      id={release.id}
                                      currentVersion={
                                        currentVersion === "latest"
                                          ? releases[0].id
                                          : currentVersion
                                      }
                                      onClick={() => {
                                        handleVersion(release.id);
                                        setIsOpen(false);
                                      }}
                                    />
                                  ))}
                                </React.Fragment>
                              ) : (
                                <div className="p-2 text-semantic-fg-disabled product-body-text-4-medium">
                                  This pipeline has no released versions.
                                </div>
                              )}
                            </div>
                          </ScrollArea.Root>
                        </Popover.Content>
                      </Popover.Root>
                    ) : null}
                    {pipeline.isSuccess ? (
                      <Tag
                        className="my-auto h-6 !border-0 !py-0"
                        variant="lightNeutral"
                        size="sm"
                      >
                        {isPublicPipeline(pipeline.data) ? (
                          <div className="flex flex-row gap-x-1">
                            <span className="my-auto">Public</span>
                          </div>
                        ) : (
                          <div className="flex flex-row gap-x-1">
                            <span className="my-auto">Private</span>
                            <Icons.Lock03 className="my-auto h-3 w-3 stroke-semantic-fg-primary" />
                          </div>
                        )}
                      </Tag>
                    ) : null}
                  </React.Fragment>
                ) : (
                  <PipelineNameSkeleton />
                )}
              </div>
            </div>
            {pipeline.isSuccess ? (
              <React.Fragment>
                {pipeline.data?.description ? (
                  <div className="flex w-full flex-row items-center gap-x-2">
                    <p className="font-mono text-xs text-semantic-fg-disabled">
                      {pipeline.data?.description}
                    </p>
                    <EditMetadataDialog
                      description={pipeline.data.description}
                    />
                  </div>
                ) : (
                  <div className="flex w-full flex-row items-center gap-x-2 p-1">
                    <p className="font-mono text-xs italic text-semantic-fg-disabled">
                      This is a placeholder brief of this pipeline
                    </p>
                    {pipeline.data.permission.can_edit ? (
                      <EditMetadataDialog
                        description={pipeline.data.description}
                      />
                    ) : null}
                  </div>
                )}
              </React.Fragment>
            ) : (
              <div className="h-8">
                <PipelineDescriptionSkeleton />
              </div>
            )}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 flex flex-row pl-24 pr-12">
          <div className="mr-auto">
            <TabMenu.Root
              value={selectedTab}
              onValueChange={(value) => setSelectedTab(value)}
              disabledDeSelect={true}
            >
              <TabMenu.Item value="overview">Overview</TabMenu.Item>
            </TabMenu.Root>
          </div>
          <div className="mt-auto flex flex-row gap-x-2 pb-1">
            {pipeline.isSuccess ? (
              <Menu
                pipeline={pipeline.data}
                handleDeletePipeline={handleDeletePipeline}
              />
            ) : null}

            {pipeline.isSuccess ? (
              <React.Fragment>
                {pipeline.data.permission.can_edit ? (
                  <Button
                    onClick={() => {
                      router.push(
                        `/${entity.data.entity}/pipelines/${entity.data.id}/builder`
                      );
                    }}
                    size="sm"
                    variant="secondaryGrey"
                    className="gap-x-2"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 14 13"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M9.11876 4.08624C8.88775 3.85523 8.77224 3.73972 8.72897 3.60653C8.6909 3.48937 8.6909 3.36317 8.72897 3.24601C8.77224 3.11282 8.88775 2.99731 9.11876 2.7663L10.7745 1.11059C10.3351 0.911883 9.84736 0.80127 9.33379 0.80127C7.4008 0.80127 5.83379 2.36827 5.83379 4.30127C5.83379 4.58771 5.8682 4.86611 5.93311 5.13257C6.00262 5.41791 6.03738 5.56058 6.03121 5.65071C6.02475 5.74507 6.01068 5.79528 5.96716 5.87925C5.92559 5.95947 5.84596 6.0391 5.68669 6.19838L2.04212 9.84294C1.55888 10.3262 1.55888 11.1097 2.04212 11.5929C2.52537 12.0762 3.30888 12.0762 3.79212 11.5929L7.43669 7.94838C7.59596 7.7891 7.67559 7.70947 7.75581 7.6679C7.83978 7.62438 7.88999 7.61032 7.98435 7.60386C8.07448 7.59768 8.21715 7.63244 8.50249 7.70195C8.76895 7.76686 9.04735 7.80127 9.33379 7.80127C11.2668 7.80127 12.8338 6.23427 12.8338 4.30127C12.8338 3.7877 12.7232 3.29996 12.5245 2.86059L10.8688 4.5163C10.6377 4.74731 10.5222 4.86282 10.3891 4.90609C10.2719 4.94416 10.1457 4.94416 10.0285 4.90609C9.89534 4.86282 9.77983 4.74731 9.54882 4.5163L9.11876 4.08624Z"
                        stroke="#1D2433"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                    Edit
                  </Button>
                ) : null}
                {me.isSuccess ? (
                  <ClonePipelineDialog
                    trigger={
                      <Button
                        className="items-center gap-x-2"
                        size="sm"
                        variant="secondaryGrey"
                      >
                        <Icons.Copy07 className="h-3 w-3 stroke-semantic-fg-secondary" />
                        Clone
                      </Button>
                    }
                    pipeline={pipeline.data}
                  />
                ) : (
                  <Button
                    onClick={() => {
                      router.push("/login");
                    }}
                    className="!normal-case"
                    variant="secondaryColour"
                    size="sm"
                  >
                    Log in to Clone
                  </Button>
                )}
              </React.Fragment>
            ) : (
              <HeaderControllerSkeleton />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

const PipelineDescriptionSkeleton = () => {
  return (
    <div className="h-4 w-[320px] animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
  );
};

const PipelineNameSkeleton = () => {
  return (
    <div className="h-6 w-[160px] animate-pulse rounded bg-gradient-to-r from-[#DBDBDB]" />
  );
};

const HeaderControllerSkeleton = () => {
  return (
    <React.Fragment>
      <Skeleton className="h-8 w-14 rounded" />
      <Skeleton className="h-8 w-14 rounded" />
    </React.Fragment>
  );
};

const VersionButton = ({
  id,
  currentVersion,
  onClick,
}: {
  id: string;
  currentVersion: Nullable<string>;
  onClick: () => void;
}) => {
  return (
    <Button
      key={id}
      className={cn(
        "w-full !px-2 !py-1.5",
        currentVersion === id ? "!bg-semantic-bg-secondary" : ""
      )}
      variant={"tertiaryColour"}
      onClick={onClick}
    >
      <div className="flex w-full flex-row gap-x-2">
        <div className="my-auto h-2 w-[9px] rounded-full bg-semantic-secondary-default"></div>
        <p
          className={cn(
            "w-full text-left text-semantic-fg-secondary product-body-text-3-medium"
          )}
        >
          Version {id}
        </p>
      </div>
    </Button>
  );
};
