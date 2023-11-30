import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import {
  ComplicateIcons,
  DropdownMenu,
  Icons,
  Separator,
} from "@instill-ai/design-system";
import { TopbarLink } from "./TopbarLink";
import { LoadingSpin, env, useUser } from "@instill-ai/toolkit";
import { useAccessToken } from "lib/useAccessToken";

export type TopbarProps = {
  logo: ReactElement;
  children?: React.ReactNode;
  className?: string;
};

export const Topbar = ({ logo, children, className }: TopbarProps) => {
  const router = useRouter();
  const { entity } = router.query;

  const accessToken = useAccessToken();

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });

  return (
    <div className="flex border-b border-semantic-bg-line px-8">
      <div
        className={cn(
          "box-content flex h-[var(--topbar-height)] w-2/3 flex-row bg-semantic-bg-primary",
          className
        )}
      >
        <Link
          href={
            entity
              ? `/${entity}/pipelines`
              : env("NEXT_PUBLIC_CONSOLE_BASE_URL")
          }
          className="my-auto pr-8"
        >
          {logo}
        </Link>

        {children ? (
          <div className="flex flex-1 flex-row">{children}</div>
        ) : (
          <React.Fragment>
            {user.isSuccess ? (
              <React.Fragment>
                <TopbarLink
                  href={`/${user.data.id}/pipelines`}
                  icon={
                    <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Pipelines"
                  hightlighted={router.pathname.split("/")[2] === "pipelines"}
                  className="mx-1 my-2 px-4"
                />
                <TopbarLink
                  href={`/${user.data.id}/connectors`}
                  icon={
                    <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Connectors"
                  hightlighted={router.pathname.split("/")[2] === "connectors"}
                  className="mx-1 my-2 px-4"
                />
                <TopbarLink
                  href={`/${user.data.id}/model-hub`}
                  icon={
                    <Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Model Hub"
                  hightlighted={router.pathname.split("/")[2] === "model-hub"}
                  className="mx-1 my-2 px-4"
                />

                <TopbarLink
                  href={`/${user.data.id}/dashboard`}
                  icon={
                    <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Dashboard"
                  hightlighted={router.pathname.split("/")[2] === "dashboard"}
                  className="mx-1 my-2 px-4"
                />
              </React.Fragment>
            ) : (
              <div className="flex h-[217px] w-full items-center justify-center">
                {/* <LoadingSpin className="!text-black" /> */}
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      <div className="flex w-1/3 justify-end gap-x-4">
        {user.isSuccess ? (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <div className="my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-semantic-bg-secondary">
                <Icons.User02 className="h-5 w-5 stroke-semantic-fg-secondary" />
              </div>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content
              className="w-[240px] !rounded-sm !px-0 !py-0"
              side="bottom"
              align="end"
            >
              <div className="flex flex-col px-4 py-3">
                <div className="flex flex-row gap-x-2">
                  <div className="my-auto flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-semantic-bg-secondary">
                    <Icons.User02 className="h-5 w-5 stroke-semantic-fg-secondary" />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-semantic-fg-primary product-body-text-3-medium">
                      User Name
                    </h3>
                    <p className="text-semantic-fg-secondary product-body-text-4-regular">
                      dani.sosa@instill.tech
                    </p>
                  </div>
                </div>
              </div>
              <Separator orientation="horizontal" />
              <TopbarDropdownGroup>
                <TopbarDropdownItem>
                  <Link
                    href={`/${user.data.id}/profile`}
                    className="flex gap-x-2"
                  >
                    <Icons.User02 className="my-auto h-4 w-4 stroke-semantic-fg-disabled" />
                    <div className="my-auto">View profile</div>
                  </Link>
                </TopbarDropdownItem>
                <TopbarDropdownItem>
                  <Link href="/settings" className="flex gap-x-2">
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
                  <Link
                    href="https://www.instill.tech/docs"
                    className="flex gap-x-2"
                  >
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
        ) : null}
      </div>
    </div>
  );
};

export const TopbarDropdownItem = ({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) => {
  return (
    <DropdownMenu.Item
      asChild={asChild}
      className="cursor-pointer !gap-x-2 !px-2.5 !py-[9px] !product-body-text-3-medium hover:!bg-semantic-bg-base-bg hover:!text-black"
    >
      {children}
    </DropdownMenu.Item>
  );
};

export const TopbarDropdownGroup = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <DropdownMenu.Group className="!p-1.5">{children}</DropdownMenu.Group>;
};
