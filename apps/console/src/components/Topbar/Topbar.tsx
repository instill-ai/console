import cn from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import { LoadingSpin, env, useUser } from "@instill-ai/toolkit";
import { useAccessToken } from "lib/useAccessToken";
import { TopbarLink } from "components/Topbar/TopbarLink";
import { Icons } from "@instill-ai/design-system";

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
    <div
      className={cn(
        "box-content flex h-[var(--topbar-height)] flex-row border-b border-semantic-bg-line bg-semantic-bg-primary px-4",
        className
      )}
    >
      <Link
        href={
          entity ? `/${entity}/pipelines` : env("NEXT_PUBLIC_CONSOLE_BASE_URL")
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
  );
};
