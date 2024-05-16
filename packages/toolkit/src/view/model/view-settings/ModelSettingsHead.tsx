import React from "react";
import { EntityAvatar } from "../../../components";
import {
  GitHubIcon,
  Icons,
  Tag,
  TabMenu,
  getModelInstanceTaskToolkit,
  Nullable,
} from "@instill-ai/design-system";
import { Model } from "../../../lib";

export type ModelSettingsTabs =
  | "overview"
  | "api"
  | "examples"
  | "predictions"
  | "versions"
  | "settings";

export type HeadProps = {
  selectedTab: ModelSettingsTabs;
  onTabChange: React.Dispatch<React.SetStateAction<ModelSettingsTabs>>;
  model?: Model;
};

const OWNER = {
  avatarUrl: "",
  name: "",
};

export const ModelSettingsHead = ({
  selectedTab,
  onTabChange,
  model,
}: HeadProps) => {
  const owner = React.useMemo(() => {
    if (!model) {
      return OWNER;
    }

    const owner = model.owner.user || model.owner.organization;

    if (!owner || !owner.profile) {
      return OWNER;
    }

    return {
      avatarUrl: owner.profile.avatar || "",
      name: owner.id || "",
    };
  }, [model]);

  const task = getModelInstanceTaskToolkit(model?.task || "");

  return (
    <div className="-mx-8 -mt-8 w-[calc(100%+64px)] bg-gradient-to-t from-orange-50 to-sky-200 pt-7">
      <div className="mx-auto flex max-w-7xl flex-col gap-y-2">
        <div className="flex flex-row items-center gap-x-3">
          <EntityAvatar
            src={owner.avatarUrl}
            entityName={owner.name}
            className="my-auto h-6 w-6"
            fallbackImg={
              <div className="my-auto flex h-6 w-6 rounded-full bg-semantic-bg-secondary">
                <Icons.User02 className="m-auto h-4 w-4 stroke-semantic-fg-disabled" />
              </div>
            }
          />
          <div className="my-auto product-headings-heading-4">
            <a
              href={`/${owner.name}`}
              className="cursor-pointer text-semantic-fg-disabled hover:!underline"
            >
              {owner.name}
            </a>
            <span className="text-semantic-fg-disabled">/</span>
            <span className="text-semantic-fg-primary">{model?.id}</span>
          </div>
          <Tag
            className="my-auto h-6 gap-x-1 !border-0 !py-0"
            variant="lightNeutral"
            size="sm"
          >
            {model?.visibility === "VISIBILITY_PUBLIC" ? (
              "Public"
            ) : (
              <React.Fragment>
                Private
                <Icons.Lock03 className="h-3 w-3 stroke-semantic-fg-primary" />
              </React.Fragment>
            )}
          </Tag>
          {/*  TODO: uncomment and implement this when we have these props available
          
          <ExternalLink href="/">
            <GitHubIcon width="w-[18px]" height="h-[18px]" color="fill-semantic-bg-secondary-alt-primary" />
            GitHub
          </ExternalLink>
          <ExternalLink href="/">
            <Icons.Link01 className="w-3.5 h-3.5 stroke-semantic-bg-secondary-alt-primary" />
            Link
          </ExternalLink>
          <ExternalLink href="/">
            <Icons.Scales02 className="w-3.5 h-3.5 stroke-semantic-bg-secondary-alt-primary" />
            License
          </ExternalLink> */}
        </div>
        <div className="flex flex-row items-center gap-x-1">
          <Tag
            className="my-auto h-6 gap-x-1 !border-0 !py-0 text-semantic-secondary-on-bg"
            variant="lightNeutral"
            size="sm"
          >
            {task.getIcon("w-3 h-3")}
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
        {model?.description ? (
          <p className="font-mono text-xs text-semantic-fg-disabled">
            {model.description}
          </p>
        ) : null}
        <div className="mt-8">
          <TabMenu.Root
            value={selectedTab}
            onValueChange={(value: Nullable<string>) =>
              onTabChange(value as ModelSettingsTabs)
            }
            disabledDeSelect={true}
          >
            <TabMenu.Item value="overview">
              <Icons.NewModel className="h-4 w-4" />
              Overview
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
            <TabMenu.Item value="settings">
              <Icons.Settings02 className="h-4 w-4" />
              Settings
            </TabMenu.Item>
          </TabMenu.Root>
        </div>
      </div>
    </div>
  );
};
