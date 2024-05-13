"use client";

import * as React from "react";
import {
  Button,
  ComplicateIcons,
  DropdownMenu,
  Icons,
  Separator,
} from "@instill-ai/design-system";
import { EntityAvatar } from "../EntityAvatar";
import {
  InstillStore,
  useAuthenticatedUser,
  useAuthenticatedUserSubscription,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../lib";
import { TopbarDropdownGroup, TopbarDropdownItem } from "./TopbarDropdown";
import Link from "next/link";
import { RemainingCreditCTA } from "./RemainingCredit";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const CloudTopbarDropdown = () => {
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const userSub = useAuthenticatedUserSubscription({
    enabled: me.isSuccess && enabledQuery,
    accessToken,
  });

  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

  const subIsActive = React.useMemo(() => {
    if (userSub.isSuccess && me.isSuccess) {
      if (
        userSub.data.detail?.status === "STATUS_ACTIVE" ||
        userSub.data.detail?.status === "STATUS_TRIALING"
      ) {
        return true;
      }
    }

    return false;
  }, [userSub.isSuccess, userSub.data, me.isSuccess]);

  return me.isSuccess ? (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="!my-auto !h-10 !w-10">
        <EntityAvatar
          src={me.data.profile?.avatar ?? null}
          className="my-auto h-10 w-10 cursor-pointer"
          entityName={me.data.name}
          fallbackImg={
            <div className="flex h-10 w-10 rounded-full bg-semantic-bg-secondary">
              <Icons.User02 className="m-auto h-5 w-5 stroke-semantic-fg-disabled" />
            </div>
          }
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        className="box-content w-[240px] !rounded-sm !px-0 !py-0"
        side="bottom"
        align="end"
      >
        <div className="flex flex-col px-4 py-3">
          <div className="mb-4 flex flex-row gap-x-2">
            <EntityAvatar
              src={me.data.profile?.avatar ?? null}
              className="my-auto h-10 w-10 cursor-pointer"
              entityName={me.data.name}
              fallbackImg={
                <div className="flex h-10 w-10 rounded-full bg-semantic-bg-secondary">
                  <Icons.User02 className="m-auto h-5 w-5 stroke-semantic-fg-disabled" />
                </div>
              }
            />
            <div className="flex flex-col">
              <h3 className="text-semantic-fg-primary product-body-text-3-medium">
                {me.data.profile?.display_name}
              </h3>
              <p className="text-semantic-fg-secondary product-body-text-4-regular">
                {me.data.email}
              </p>
            </div>
          </div>
          <RemainingCreditCTA ctaTargetHref="/subscription" />
        </div>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem
            onClick={() => {
              navigate(`/${me.data.id}`);
            }}
          >
            <Icons.User02 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
            <div className="my-auto">View profile</div>
          </TopbarDropdownItem>
          <TopbarDropdownItem
            onClick={() => {
              navigate("/settings/profile");
            }}
          >
            <Icons.Gear01 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
            <div className="my-auto">Settings</div>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem
            onClick={() => {
              navigate("/settings/organizations/new");
            }}
            asChild
          >
            <div className="flex flex-row !gap-x-0">
              <div className="mr-2">
                <Icons.Plus className="h-4 w-4 stroke-semantic-fg-disabled" />
              </div>
              <p className="mr-0.5">Create Organization</p>
            </div>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem asChild>
            <a
              href="https://instill-ai.productlane.com/changelog"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.LayersTwo01 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              Changelog
            </a>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <a
              href="https://github.com/instill-ai/community"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.MessageSmileSquare className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Community</div>
            </a>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <a
              href="https://discord.com/invite/sevxWsqpGh"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.HelpCircle className="h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Support</div>
            </a>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <a
              href="https://www.instill.tech/docs"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.File05 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Documentation</div>
            </a>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <a
              href="https://github.com/instill-ai/vdp"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <ComplicateIcons.GitHub
                className="h-4 w-4"
                fillAreaColor="fill-semantic-fg-disabled"
              />
              <div className="my-auto">GitHub</div>
            </a>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem asChild>
            <Link href="/api/auth/logout" className="flex gap-x-2">
              <Icons.Logout01 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Log out</div>
            </Link>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        {!subIsActive ? (
          <React.Fragment>
            <Separator orientation="horizontal" />
            <TopbarDropdownGroup>
              <TopbarDropdownItem
                onClick={() => {
                  navigate("/settings/billing/plan");
                }}
                asChild
              >
                <Button
                  className="flex w-full items-center"
                  variant="secondaryColour"
                >
                  Upgrade to Pro
                </Button>
              </TopbarDropdownItem>
            </TopbarDropdownGroup>
          </React.Fragment>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : null;
};
