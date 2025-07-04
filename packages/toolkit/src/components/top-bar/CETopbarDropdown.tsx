"use client";

import { useRouter } from "next/navigation";

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
  useGuardPipelineBuilderUnsavedChangesNavigation,
  useInstillStore,
  useShallow,
} from "../../lib";
import { NamespaceAvatarWithFallback } from "../NamespaceAvatarWithFallback";
import { TopbarDropdownGroup, TopbarDropdownItem } from "./TopbarDropdown";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const CETopbarDropdown = () => {
  const router = useRouter();
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));

  const me = useAuthenticatedUser({
    enabled: enabledQuery,
    accessToken,
  });

  const navigate = useGuardPipelineBuilderUnsavedChangesNavigation();

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
        className="w-[240px] !rounded-sm !px-0 !py-0"
        side="bottom"
        align="end"
      >
        <div className="flex flex-col px-4 py-3">
          <div className="flex flex-row gap-x-2">
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
            <Button
              variant="tertiaryGrey"
              onClick={() => {
                router.push("/api/auth/logout");
              }}
            >
              <Icons.Logout01 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Log out</div>
            </Button>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : (
    <div className="h-10 w-10" />
  );
};
