import {
  ComplicateIcons,
  DropdownMenu,
  Icons,
  Separator,
} from "@instill-ai/design-system";
import { EntityAvatar } from "../EntityAvatar";
import { TopbarDropdownGroup, TopbarDropdownItem } from "./Topbar";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  InstillStore,
  useAuthenticatedUser,
  useInstillStore,
  useShallow,
} from "../../lib";

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

  return me.isSuccess ? (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
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
        className="w-[240px] !rounded-sm !px-0 !py-0"
        side="bottom"
        align="end"
      >
        <div className="flex flex-col px-4 py-3">
          <div className="flex flex-row gap-x-2">
            <EntityAvatar
              src={me.data.profile?.avatar ?? null}
              className="h-10 w-10"
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
                {me.data.profile?.public_email}
              </p>
            </div>
          </div>
        </div>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem
            onClick={() => {
              router.push(`/${me.data.id}`);
            }}
          >
            <Icons.User02 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
            <div className="my-auto">View profile</div>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <Link href="/settings/profile" className="flex gap-x-2">
              <Icons.Gear01 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Settings</div>
            </Link>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem>
            <Icons.LayersTwo01 className="h-4 w-4 stroke-semantic-fg-disabled" />
            Changelog
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <Link
              href="https://github.com/instill-ai/community"
              className="flex gap-x-2"
            >
              <Icons.MessageSmileSquare className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Community</div>
            </Link>
          </TopbarDropdownItem>
          <TopbarDropdownItem>
            <Icons.HelpCircle className="h-4 w-4 stroke-semantic-fg-disabled" />
            Support
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <Link href="https://www.instill.tech/docs" className="flex gap-x-2">
              <Icons.File05 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Documentation</div>
            </Link>
          </TopbarDropdownItem>
          <TopbarDropdownItem asChild>
            <Link
              href="https://github.com/instill-ai/vdp"
              className="flex gap-x-2"
            >
              <ComplicateIcons.GitHub
                className="h-4 w-4"
                fillAreaColor="fill-semantic-fg-disabled"
              />
              <div className="my-auto">GitHub</div>
            </Link>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
        <Separator orientation="horizontal" />
        <TopbarDropdownGroup>
          <TopbarDropdownItem asChild>
            <Link href="/logout" className="flex gap-x-2">
              <Icons.Logout01 className=" my-auto h-4 w-4 stroke-semantic-fg-disabled" />
              <div className="my-auto">Log out</div>
            </Link>
          </TopbarDropdownItem>
        </TopbarDropdownGroup>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  ) : null;
};
