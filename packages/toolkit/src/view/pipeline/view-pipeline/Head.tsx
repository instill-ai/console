"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import cn from "clsx";
import { Pipeline } from "instill-sdk";

import {
  Button,
  GitHubIcon,
  Icons,
  Popover,
  ScrollArea,
  Skeleton,
  TabMenu,
  Tag,
  toast,
} from "@instill-ai/design-system";

import { ClonePipelineDialog, HeadExternalLink } from "../../../components";
import { NamespaceAvatarWithFallback } from "../../../components/NamespaceAvatarWithFallback";
import {
  InstillStore,
  isPublicPipeline,
  Nullable,
  PipelineRelease,
  toastInstillError,
  useAuthenticatedUser,
  useDeleteNamespacePipeline,
  useInstillStore,
  useNavigateBackAfterLogin,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import { PipelineTabNames } from "../../../server";
import { Menu } from "./Menu";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

const DEFAULT_OWNER = {
  avatarUrl: null,
  displayName: null,
  id: null,
};

export const Head = ({
  onActiveVersionUpdate,
  pipeline,
  isReady,
  selectedTab,
  onTabChange,
  releases,
}: {
  onActiveVersionUpdate: (version: string) => void;
  pipeline?: Pipeline;
  isReady: boolean;
  selectedTab: PipelineTabNames;
  onTabChange: (tabName: PipelineTabNames) => void;
  releases: Nullable<PipelineRelease[]>;
}) => {
  const router = useRouter();
  const navigateBackAfterLogin = useNavigateBackAfterLogin();
  const searchParams = useSearchParams();
  const activeVersion = searchParams.get("version");
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const [isVersionSelectorOpen, setIsVersionSelectorOpen] =
    React.useState<boolean>(false);

  const routeInfo = useRouteInfo();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
    retry: false,
  });

  const deletePipeline = useDeleteNamespacePipeline();
  async function handleDeletePipeline() {
    if (!accessToken || !pipeline) {
      return;
    }

    try {
      await deletePipeline.mutateAsync({
        namespacePipelineName: pipeline.name,
        accessToken: accessToken ? accessToken : null,
      });

      toast({
        title: "Pipeline deleted",
        variant: "alert-success",
        size: "large",
      });
      router.push(`/${routeInfo.data.namespaceId}/pipelines`);
    } catch (error) {
      console.log(error);
      toastInstillError({
        title: "Something went wrong when delete the pipeline",
        error,
        toast,
      });
    }
  }

  const owner = React.useMemo(() => {
    if (!pipeline) {
      return DEFAULT_OWNER;
    }

    const owner =
      "user" in pipeline.owner
        ? pipeline.owner.user
        : pipeline.owner.organization;

    if (!owner || !owner.profile) {
      return DEFAULT_OWNER;
    }

    return {
      avatarUrl: owner.profile.avatar || "",
      id: owner.id || "",
      displayName: owner.profile.displayName || "",
    };
  }, [pipeline]);

  return (
    <div className="sticky -top-8 z-10 -mx-8 -mt-8 w-[calc(100%+64px)] bg-gradient-to-t from-[#EFE7FE] to-[#FFF1EB] px-8 pt-7">
      <div className="flex flex-col gap-y-2">
        <div className="flex flex-row items-center gap-x-3">
          {owner.id ? (
            <NamespaceAvatarWithFallback.Root
              src={owner.avatarUrl}
              className="my-auto h-6 w-6"
              fallback={
                <NamespaceAvatarWithFallback.Fallback
                  namespaceId={owner.id}
                  displayName={owner.displayName}
                  className="my-auto flex h-6 w-6 !bg-semantic-secondary-bg"
                />
              }
            />
          ) : null}
          {!isReady ? (
            <Skeleton className="h-6 w-60 rounded" />
          ) : (
            <React.Fragment>
              <div className="my-auto text-semantic-fg-disabled product-headings-heading-4">
                <Link
                  href={`/${routeInfo.data.namespaceId}`}
                  className="cursor-pointer hover:!underline"
                >
                  {owner.id}
                </Link>
                /
                <span className="text-semantic-fg-primary">{pipeline?.id}</span>
              </div>
            </React.Fragment>
          )}
          {pipeline && !isPublicPipeline(pipeline) ? (
            <Tag
              className="my-auto h-6 gap-x-1 !border-0 !py-0 !text-sm"
              variant="lightNeutral"
              size="sm"
            >
              <Icons.Lock03 className="h-3 w-3 stroke-semantic-fg-primary" />
              Private
            </Tag>
          ) : null}
          {pipeline?.sourceUrl ? (
            <HeadExternalLink href={pipeline.sourceUrl}>
              <GitHubIcon
                width="w-[18px]"
                height="h-[18px]"
                color="fill-semantic-bg-secondary-alt-primary"
              />
              GitHub
            </HeadExternalLink>
          ) : null}
          {pipeline?.documentationUrl ? (
            <HeadExternalLink href={pipeline.documentationUrl}>
              <Icons.Link01 className="h-3.5 w-3.5 stroke-semantic-bg-secondary-alt-primary" />
              Link
            </HeadExternalLink>
          ) : null}
          {pipeline?.license ? (
            <HeadExternalLink href={pipeline.license}>
              <Icons.Scales02 className="h-3.5 w-3.5 stroke-semantic-bg-secondary-alt-primary" />
              License
            </HeadExternalLink>
          ) : null}
          {!!releases?.length && pipeline ? (
            <Popover.Root
              onOpenChange={() =>
                setIsVersionSelectorOpen(!isVersionSelectorOpen)
              }
              open={isVersionSelectorOpen}
            >
              <Popover.Trigger asChild={true} className="my-auto">
                <Button
                  className={cn(
                    "!h-8 !w-[145px] gap-x-1 !rounded-sm !border border-[#E1E6EF] !py-1 px-3 !transition-opacity !duration-300 !ease-in-out ml-auto",
                    isVersionSelectorOpen
                      ? "border-opacity-100 !bg-semantic-accent-bg "
                      : "border-opacity-0",
                  )}
                  size="sm"
                  variant="tertiaryColour"
                  type="button"
                  onClick={() => setIsVersionSelectorOpen(true)}
                >
                  <Tag size="sm" variant="darkPurple" className="h-6 gap-x-2">
                    Version {activeVersion}
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
                            currentVersion={activeVersion}
                            onClick={() => {
                              onActiveVersionUpdate(release.id);
                              setIsVersionSelectorOpen(false);
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
        </div>
        {!isReady ? (
          <React.Fragment>
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-40 rounded" />
          </React.Fragment>
        ) : pipeline?.tags.length ? (
          <div className="flex flex-row items-center gap-x-1">
            {pipeline?.tags.map((tag) => (
              <Tag
                key={tag}
                className="my-auto h-5 gap-x-1 !border-0 !py-0 text-semantic-secondary-on-bg"
                variant="lightNeutral"
                size="sm"
              >
                {/* task.getIcon(
                    `w-3 h-3 ${["TASK_TEXT_GENERATION_CHAT", "TASK_IMAGE_TO_IMAGE", "TASK_VISUAL_QUESTION_ANSWERING"].includes(model?.task || "") ? "stroke-semantic-secondary-on-bg [&>*]:!stroke-semantic-secondary-on-bg" : "[&>*]:!fill-semantic-secondary-on-bg"}`,
                  ) */}
                {tag}
              </Tag>
            ))}
          </div>
        ) : null}
        <p
          className={cn(
            "font-mono text-xs text-semantic-fg-disabled",
            !pipeline?.description ? "italic" : "",
          )}
        >
          {pipeline?.description ||
            (pipeline?.permission.canEdit ? (
              <Link href={`/${owner.id}/pipelines/${pipeline?.id}/settings`}>
                Add a description
              </Link>
            ) : (
              <span>No description</span>
            ))}
        </p>
        {!isReady ? (
          <div className="mb-2 mt-10 flex flex-row gap-x-2">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        ) : (
          <div className="mt-8 flex flex-row items-end justify-between">
            <TabMenu.Root
              value={selectedTab}
              onValueChange={(value: Nullable<string>) =>
                onTabChange(value as PipelineTabNames)
              }
              disabledDeSelect={true}
            >
              <TabMenu.Item value="readme">
                <Icons.File02 className="h-4 w-4" />
                README
              </TabMenu.Item>
              <TabMenu.Item value="playground">
                <Icons.NewModel className="h-4 w-4" />
                Playground
              </TabMenu.Item>
              <TabMenu.Item value="api">
                <Icons.CodeSnippet01 className="h-4 w-4" />
                API
              </TabMenu.Item>
              {/* <TabMenu.Item value="examples">
                  <Icons.CheckCircle className="h-4 w-4" />
                  Examples
                </TabMenu.Item> */}
              <TabMenu.Item value="preview">
                <Icons.Dataflow03 className="h-4 w-4" />
                Preview
              </TabMenu.Item>
              <TabMenu.Item value="runs">
                <Icons.Zap className="h-4 w-4" />
                Runs
              </TabMenu.Item>
              <TabMenu.Item value="versions">
                <Icons.ClockRewind className="h-4 w-4" />
                Versions
              </TabMenu.Item>
              {pipeline?.permission.canEdit ? (
                <TabMenu.Item value="settings">
                  <Icons.Settings02 className="h-4 w-4" />
                  Settings
                </TabMenu.Item>
              ) : null}
            </TabMenu.Root>
            <div className="flex flex-row gap-x-2">
              {pipeline && me.isSuccess && pipeline.permission.canEdit ? (
                <Menu
                  pipeline={pipeline}
                  handleDeletePipeline={handleDeletePipeline}
                />
              ) : null}
              {pipeline ? (
                <React.Fragment>
                  {me.isSuccess ? (
                    <ClonePipelineDialog
                      trigger={
                        <Button
                          className="items-center gap-x-2 h-[32px]"
                          size="md"
                          variant="secondaryGrey"
                        >
                          <Icons.Copy07 className="h-4 w-4 stroke-semantic-fg-secondary" />
                          Clone
                        </Button>
                      }
                      pipeline={pipeline}
                    />
                  ) : (
                    <Button
                      onClick={() => {
                        navigateBackAfterLogin();
                      }}
                      className="!normal-case h-[32px]"
                      variant="secondaryGrey"
                      size="md"
                    >
                      Log in to Clone
                    </Button>
                  )}
                  {pipeline.permission.canEdit ? (
                    <Button
                      onClick={() => {
                        router.push(
                          `/${routeInfo.data.namespaceId}/pipelines/${routeInfo.data.resourceId}/editor`,
                        );
                      }}
                      size="md"
                      variant="secondaryGrey"
                      className="gap-x-2 h-[32px]"
                    >
                      <Icons.Tool01 className="h-4 w-4 stroke-semantic-fg-secondary" />
                      Edit
                    </Button>
                  ) : null}
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Skeleton className="h-8 w-14 rounded" />
                  <Skeleton className="h-8 w-14 rounded" />
                </React.Fragment>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
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
        currentVersion === id ? "!bg-semantic-bg-secondary" : "",
      )}
      variant={"tertiaryColour"}
      onClick={onClick}
    >
      <div className="flex w-full flex-row gap-x-2">
        <div className="my-auto h-2 w-[9px] rounded-full bg-semantic-secondary-default"></div>
        <p
          className={cn(
            "w-full text-left text-semantic-fg-secondary product-body-text-3-medium",
          )}
        >
          Version {id}
        </p>
      </div>
    </Button>
  );
};
