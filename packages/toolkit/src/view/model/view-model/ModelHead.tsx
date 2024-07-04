import React, { useMemo } from "react";
import Link from "next/link";
import cn from "clsx";

import {
  getModelInstanceTaskToolkit,
  GitHubIcon,
  Icons,
  Nullable,
  Skeleton,
  TabMenu,
  Tag,
} from "@instill-ai/design-system";

import { StateLabel } from "../../../components";
import { NamespaceAvatarWithFallback } from "../../../components/NamespaceAvatarWithFallback";
import { Model, ModelState } from "../../../lib";
import { ModelTabNames } from "../../../server";

export type HeadProps = {
  selectedTab: ModelTabNames;
  onTabChange: (tabName: ModelTabNames) => void;
  model?: Model;
  isReady: boolean;
  modelState: Nullable<ModelState>;
};

const DEFAULT_OWNER = {
  avatarUrl: null,
  displayName: null,
  id: null,
};

const ExternalLink = ({
  children,
  href,
}: {
  children: React.ReactNode;
  href: string;
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-row items-center gap-x-1 border-b border-zinc-700 text-sm font-semibold text-semantic-bg-secondary-alt-primary"
    >
      {children}
    </a>
  );
};

export const ModelSettingsHead = ({
  selectedTab,
  onTabChange,
  model,
  isReady,
  modelState,
}: HeadProps) => {
  const owner = useMemo(() => {
    if (!model) {
      return DEFAULT_OWNER;
    }

    const owner = model.owner?.user || model.owner?.organization;

    if (!owner || !owner.profile) {
      return DEFAULT_OWNER;
    }

    return {
      avatarUrl: owner.profile.avatar || "",
      id: owner.id || "",
      displayName: owner.profile.displayName || "",
    };
  }, [model]);

  const task = getModelInstanceTaskToolkit(model?.task || "");

  return (
    <div className="sticky -top-8 z-10 -mx-20 -mt-8 w-[calc(100%+160px)] bg-gradient-to-t from-orange-50 to-sky-200 px-20 pt-7">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-2">
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

          {isReady ? (
            <Skeleton className="h-6 w-60 rounded" />
          ) : (
            <React.Fragment>
              <div className="my-auto text-semantic-fg-disabled product-headings-heading-4">
                <a
                  href={`/${owner.id}`}
                  className="cursor-pointer hover:!underline"
                >
                  {owner.id}
                </a>
                /<span className="text-semantic-fg-primary">{model?.id}</span>
              </div>
              {modelState ? <StateLabel state={modelState} /> : null}
              {model?.visibility !== "VISIBILITY_PUBLIC" ? (
                <Tag
                  className="my-auto h-6 gap-x-1 !border-0 !py-0 !text-sm"
                  variant="lightNeutral"
                  size="sm"
                >
                  <Icons.Lock03 className="h-3 w-3 stroke-semantic-fg-primary" />
                  Private
                </Tag>
              ) : null}
              {model?.sourceUrl ? (
                <ExternalLink href={model.sourceUrl}>
                  <GitHubIcon
                    width="w-[18px]"
                    height="h-[18px]"
                    color="fill-semantic-bg-secondary-alt-primary"
                  />
                  GitHub
                </ExternalLink>
              ) : null}
              {model?.documentationUrl ? (
                <ExternalLink href={model.documentationUrl}>
                  <Icons.Link01 className="h-3.5 w-3.5 stroke-semantic-bg-secondary-alt-primary" />
                  Link
                </ExternalLink>
              ) : null}
              {model?.license ? (
                <ExternalLink href={model.license}>
                  <Icons.Scales02 className="h-3.5 w-3.5 stroke-semantic-bg-secondary-alt-primary" />
                  License
                </ExternalLink>
              ) : null}
            </React.Fragment>
          )}
        </div>
        {isReady ? (
          <React.Fragment>
            <Skeleton className="h-6 w-20 rounded" />
            <Skeleton className="h-6 w-40 rounded" />
          </React.Fragment>
        ) : (
          <div className="flex flex-row items-center gap-x-1">
            <Tag
              className="my-auto h-5 gap-x-1 !border-0 !py-0 text-semantic-secondary-on-bg"
              variant="lightNeutral"
              size="sm"
            >
              {task.getIcon(
                `w-3 h-3 ${["TASK_TEXT_GENERATION_CHAT", "TASK_IMAGE_TO_IMAGE", "TASK_VISUAL_QUESTION_ANSWERING"].includes(model?.task || "") ? "stroke-semantic-secondary-on-bg [&>*]:!stroke-semantic-secondary-on-bg" : "[&>*]:!fill-semantic-secondary-on-bg"}`,
              )}
              {task.label}
            </Tag>
            {/* TODO: uncomment and implement this when we have runs count available
              
              <Tag
                className="my-auto h-6 !border-0 !py-0 gap-x-1 text-semantic-success-on-bg"
                variant="lightNeutral"
                size="sm"
              >
                <Icons.Rocket01 className="h-3 w-3 stroke-semantic-success-on-bg" />
                345 Runs
              </Tag> */}
          </div>
        )}
        <p
          className={cn(
            "font-mono text-xs text-semantic-fg-disabled",
            !model?.description ? "italic" : "",
          )}
        >
          {model?.description || (
            <Link href={`/${owner.id}/models/${model?.id}/settings`}>
              Add a description
            </Link>
          )}
        </p>
        {isReady ? (
          <div className="mb-2 mt-10 flex flex-row gap-x-2">
            <Skeleton className="h-6 w-12 rounded" />
            <Skeleton className="h-6 w-12 rounded" />
          </div>
        ) : (
          <div className="mt-8">
            <TabMenu.Root
              value={selectedTab}
              onValueChange={(value: Nullable<string>) =>
                onTabChange(value as ModelTabNames)
              }
              disabledDeSelect={true}
            >
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
                </TabMenu.Item>
                <TabMenu.Item value="predictions">
                  <Icons.Activity className="h-4 w-4" />
                  Predictions
                </TabMenu.Item> */}
              <TabMenu.Item value="versions">
                <Icons.ClockRewind className="h-4 w-4" />
                Versions
              </TabMenu.Item>
              {model?.permission.canEdit ? (
                <TabMenu.Item value="settings">
                  <Icons.Settings02 className="h-4 w-4" />
                  Settings
                </TabMenu.Item>
              ) : null}
            </TabMenu.Root>
          </div>
        )}
      </div>
    </div>
  );
};
