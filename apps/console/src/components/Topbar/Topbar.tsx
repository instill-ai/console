import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { LoadingSpin, env, useUser } from "@instill-ai/toolkit";
import { useAccessToken } from "lib/useAccessToken";
import { TopbarLink } from "components/Topbar/TopbarLink";
import {
  DropdownMenu,
  GitHubIcon,
  Icons,
  Separator,
  Tag,
} from "@instill-ai/design-system";

export type TopbarProps = {
  logo: ReactElement;
  children?: React.ReactNode;
  className?: string;
};

export const Topbar = (props: TopbarProps) => {
  const { children, className, logo } = props;
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
          "w-2/3 box-content flex h-[var(--topbar-height)] flex-row bg-semantic-bg-primary",
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
                  className="px-4 my-2 mx-1"
                />
                <TopbarLink
                  href={`/${user.data.id}/connectors`}
                  icon={
                    <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Connectors"
                  hightlighted={router.pathname.split("/")[2] === "connectors"}
                  className="px-4 my-2 mx-1"
                />
                <TopbarLink
                  href={`/${user.data.id}/model-hub`}
                  icon={
                    <Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Model Hub"
                  hightlighted={router.pathname.split("/")[2] === "model-hub"}
                  className="px-4 my-2 mx-1"
                />

                <TopbarLink
                  href={`/${user.data.id}/dashboard`}
                  icon={
                    <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
                  }
                  name="Dashboard"
                  hightlighted={router.pathname.split("/")[2] === "dashboard"}
                  className="px-4 my-2 mx-1"
                />
              </React.Fragment>
            ) : (
              <div className="flex h-[217px] w-full items-center justify-center">
                <LoadingSpin className="!text-black" />
              </div>
            )}
          </React.Fragment>
        )}
      </div>

      <div className="w-1/3 flex justify-end gap-x-4">
        <div className="h-10 w-10 rounded-lg my-auto flex items-center justify-center cursor-pointer">
          <Icons.SearchLg className="h-5 w-5 stroke-slate-500" />
        </div>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="h-10 w-10 rounded-lg bg-semantic-bg-secondary my-auto flex items-center justify-center cursor-pointer">
              <Icons.User02 className="h-5 w-5 stroke-slate-500" />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content
            className="w-[240px] !rounded-sm !px-0 !py-2"
            side="bottom"
            align="end"
          >
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer gap-x-3 my-auto hover:!text-black">
              <div className="h-10 w-10 rounded-lg bg-semantic-bg-secondary my-auto flex items-center justify-center cursor-pointer">
                <Icons.User02 className="h-5 w-5 stroke-slate-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="product-body-text-3-medium">User Name</h3>
                <p className="text-semantic-fg-secondary product-body-text-4-regular">
                  dani.sosa@instill.tech
                </p>
              </div>
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link href="/settings" className="flex gap-x-2">
                <Icons.User02 className="h-4 w-4 stroke-semantic-fg-disabled my-auto" />
                <div className="my-auto">View profile</div>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link href="/settings" className="flex gap-x-2">
                <Icons.Gear01 className="h-4 w-4 stroke-semantic-fg-disabled my-auto" />
                <div className="my-auto">Settings</div>
              </Link>
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer my-auto hover:!text-black">
              <div className="flex flex-row gap-x-2">
                <div className="my-auto">
                  <Icons.Plus className="h-4 w-4 stroke-semantic-fg-disabled" />
                </div>
                <div className="my-auto">Create Organisation</div>
                <div className="my-auto">
                  <Tag variant="lightBlue" size="sm">
                    Team
                  </Tag>
                </div>
              </div>
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer gap-x-2 my-auto hover:!text-black">
              <Icons.LayersTwo01 className="h-4 w-4 stroke-semantic-fg-disabled" />
              Changelog
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link
                href="https://github.com/instill-ai/community"
                className="flex gap-x-2"
              >
                <Icons.MessageSmileSquare className="h-4 w-4 stroke-semantic-fg-disabled my-auto" />
                <div className="my-auto">Community</div>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer gap-x-2 my-auto hover:!text-black">
              <Icons.HelpCircle className="h-4 w-4 stroke-semantic-fg-disabled" />
              Support
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link
                href="https://www.instill.tech/docs"
                className="gap-x-2 flex"
              >
                <Icons.File05 className="h-4 w-4 stroke-semantic-fg-disabled my-auto" />
                <div className="my-auto">Documentation</div>
              </Link>
            </DropdownMenu.Item>
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link
                href="https://github.com/instill-ai/vdp"
                className="flex gap-x-2"
              >
                <GitHubIcon
                  color="fill-semantic-fg-disabled"
                  height="h-[20px]"
                  position="my-auto"
                  width="w-[20px]"
                />
                <div className="my-auto">Github</div>
              </Link>
            </DropdownMenu.Item>
            <Separator orientation="horizontal" />
            <DropdownMenu.Item className="!px-3 !py-2.5 !product-body-text-3-medium cursor-pointer hover:!text-black">
              <Link href="/logout" className="flex gap-x-2">
                <Icons.Logout01 className=" my-auto h-4 w-4 stroke-semantic-fg-disabled" />
                <div className="my-auto">Log out</div>
              </Link>
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
    </div>
  );
};
