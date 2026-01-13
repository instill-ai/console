"use client";

import type { Pipeline, PipelineRelease } from "instill-sdk";
import * as React from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import cn from "clsx";
import { InstillNameInterpreter } from "instill-sdk";

import {
  Button,
  Icons,
  Skeleton,
  TabMenu,
  Tag,
} from "@instill-ai/design-system";

import {
  ClonePipelineDialog,
  HeadExternalLink,
  VersionDropdownSelector,
} from "../../../components";
import { NamespaceAvatarWithFallback } from "../../../components/NamespaceAvatarWithFallback";
import {
  InstillStore,
  isPublicPipeline,
  Nullable,
  toastInstillError,
  toastInstillSuccess,
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

  const routeInfo = useRouteInfo();

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const deletePipeline = useDeleteNamespacePipeline();
  async function handleDeletePipeline() {
    if (
      !accessToken ||
      !pipeline ||
      !routeInfo.isSuccess ||
      !routeInfo.data.namespaceId
    ) {
      return;
    }

    const instillName = InstillNameInterpreter.pipeline(pipeline.name);

    try {
      await deletePipeline.mutateAsync({
        namespaceId: instillName.namespaceId,
        pipelineId: pipeline.id,
        accessToken: accessToken ? accessToken : null,
      });

      toastInstillSuccess({
        title: "Pipeline deleted",
      });

      router.push(`/${routeInfo.data.namespaceId}/pipelines`);
    } catch (error) {
      console.log(error);
      toastInstillError({
        title: "Something went wrong when delete the pipeline",
        error,
      });
    }
  }

  // NOTE: In CE, owner is always a user (organizations are EE-only)
  const owner = React.useMemo(() => {
    if (!pipeline) {
      return DEFAULT_OWNER;
    }

    const user = pipeline.owner?.user;

    if (!user || !user.profile) {
      return DEFAULT_OWNER;
    }

    return {
      avatarUrl: user.profile.avatar || "",
      id: user.id || "",
      displayName: user.profile.displayName || "",
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
          {pipeline ? (
            <Tag
              className="my-auto h-6 gap-x-1 !border-0 !py-0 !text-sm"
              variant="lightNeutral"
              size="sm"
            >
              {isPublicPipeline(pipeline) ? (
                <React.Fragment>
                  <Icons.BookOpen02 className="h-3 w-3 stroke-semantic-fg-primary" />
                  Public
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <Icons.Lock03 className="h-3 w-3 stroke-semantic-fg-primary" />
                  Private
                </React.Fragment>
              )}
            </Tag>
          ) : null}
          {pipeline?.documentationUrl ? (
            <HeadExternalLink href={pipeline.documentationUrl}>
              <Icons.Link01 className="h-3.5 w-3.5 stroke-semantic-bg-secondary-alt-primary" />
              Link
            </HeadExternalLink>
          ) : null}
          {!!releases?.length && pipeline ? (
            <VersionDropdownSelector
              activeVersion={activeVersion}
              versions={releases.map((release) => release.id)}
              onVersionUpdate={onActiveVersionUpdate}
            />
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
                    <React.Fragment>
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
                    </React.Fragment>
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
