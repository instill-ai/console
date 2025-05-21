"use client";

import * as React from "react";
import Link from "next/link";

import {
  Button,
  ComplicateIcons,
  DropdownMenu,
  Icons,
  Separator,
} from "@instill-ai/design-system";

import { DOCS_BASE_URL } from "../../constant";
import {
  InstillStore,
  useAuthenticatedUser,
  useAuthenticatedUserSubscription,
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../lib";
import { NamespaceAvatarWithFallback } from "../NamespaceAvatarWithFallback";
import { RemainingCreditCTA } from "./RemainingCredit";
import { TopbarDropdownGroup, TopbarDropdownItem } from "./TopbarDropdown";

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
        <NamespaceAvatarWithFallback.Root
          src={me.data.profile?.avatar ?? null}
          className="my-auto h-10 w-10 cursor-pointer"
          fallback={
            <NamespaceAvatarWithFallback.Fallback
              namespaceId={me.data.id}
              displayName={me.data.profile?.displayName ?? null}
              className="h-10 w-10"
            />
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
            <NamespaceAvatarWithFallback.Root
              src={me.data.profile?.avatar ?? null}
              className="my-auto h-10 w-10 cursor-pointer"
              fallback={
                <NamespaceAvatarWithFallback.Fallback
                  namespaceId={me.data.id}
                  displayName={me.data.profile?.displayName ?? null}
                  className="h-10 w-10"
                />
              }
            />
            <div className="flex flex-col">
              <h3 className="text-semantic-fg-primary product-body-text-3-medium">
                {me.data.profile?.displayName}
              </h3>
              <p className="text-semantic-fg-secondary product-body-text-4-regular">
                {me.data.email}
              </p>
            </div>
          </div>
          <RemainingCreditCTA ctaTargetHref="/subscribe" />
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
              navigate("/settings/organizations");
            }}
            asChild
          >
            <div className="flex flex-row gap-x-2">
              <Icons.Building05 className="h-4 w-4 stroke-semantic-fg-disabled" />
              <p className="mr-0.5">Your Organizations</p>
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
              href="https://discord.com/invite/sevxWsqpGh"
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.MessageSmileSquare className="h-4 w-4 stroke-semantic-fg-disabled" />
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
              href={DOCS_BASE_URL}
              className="flex gap-x-2"
              rel="noopener noreferrer"
              target="_blank"
            >
              <Icons.File06 className="h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Documentation</div>
            </a>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <a
              href="https://github.com/instill-ai/instill-core"
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
                  navigate("/subscribe");
                }}
                asChild
              >
                <Button
                  className="flex w-full items-center"
                  variant="secondaryColour"
                >
                  Upgrade to Starter Plan
                </Button>
              </TopbarDropdownItem>
            </TopbarDropdownGroup>
          </React.Fragment>
        ) : null}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : (
    <div className="h-10 w-10" />
  );
};
