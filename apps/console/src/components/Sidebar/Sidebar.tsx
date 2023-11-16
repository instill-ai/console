import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { DiscordIcon, Icons, Separator } from "@instill-ai/design-system";
import { LoadingSpin, useUser } from "@instill-ai/toolkit";

import { SidebarLink } from "./SidebarLink";
import { useAccessToken } from "../../lib/useAccessToken";

export const Sidebar = () => {
  const router = useRouter();
  const accessToken = useAccessToken();

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });

  return (
    <div className="flex w-[312px] flex-col bg-semantic-bg-base-bg">
      <div className="mb-auto px-4 pt-4">
        {user.isSuccess ? (
          <React.Fragment>
            <SidebarLink
              href={`/${user.data.id}/pipelines`}
              icon={
                <Icons.Pipeline className="h-6 w-6 stroke-semantic-fg-primary" />
              }
              name="Pipelines"
              hightlighted={router.pathname.split("/")[1] === "pipelines"}
              className="mb-2 px-3"
            />
            <SidebarLink
              href={`/${user.data.id}/connectors`}
              icon={
                <Icons.IntersectSquare className="h-6 w-6 stroke-semantic-fg-primary" />
              }
              name="Connectors"
              hightlighted={router.pathname.split("/")[1] === "connectors"}
              className="mb-2 px-3"
            />
            <SidebarLink
              href={`/${user.data.id}/model-hub`}
              icon={
                <Icons.Cube01 className="h-6 w-6 stroke-semantic-fg-primary" />
              }
              name="Model Hub"
              hightlighted={router.pathname.split("/")[1] === "model-hub"}
              className="mb-2 px-3"
            />
            <Separator orientation="horizontal" className="mb-2" />
            <SidebarLink
              href={`/${user.data.id}/dashboard`}
              icon={
                <Icons.BarChartSquare02 className="h-6 w-6 stroke-semantic-fg-primary" />
              }
              name="Dashboard"
              hightlighted={router.pathname.split("/")[1] === "dashboard"}
              className="px-3"
            />
          </React.Fragment>
        ) : (
          <div className="flex h-[217px] w-full items-center justify-center">
            <LoadingSpin />
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-6 px-4 pb-8">
        <Link
          className="flex flex-row space-x-3 px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="/settings"
        >
          <Icons.Gear01 className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Settings
          </p>
        </Link>
        <a
          className="flex flex-row space-x-3 rounded-xs px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="https://discord.com/invite/sevxWsqpGh"
          target="_blank"
          rel="noopener noreferrer"
        >
          <DiscordIcon
            width="w-6"
            height="h-6"
            color="fill-semantic-fg-primary"
            position="my-auto"
          />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Join our Discord
          </p>
        </a>
        <a
          className="flex flex-row space-x-3 rounded-xs px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="https://www.instill.tech/docs"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M14 2.26953V6.40007C14 6.96012 14 7.24015 14.109 7.45406C14.2049 7.64222 14.3578 7.7952 14.546 7.89108C14.7599 8.00007 15.0399 8.00007 15.6 8.00007H19.7305M14 17H8M16 13H8M20 9.98822V17.2C20 18.8802 20 19.7202 19.673 20.362C19.3854 20.9265 18.9265 21.3854 18.362 21.673C17.7202 22 16.8802 22 15.2 22H8.8C7.11984 22 6.27976 22 5.63803 21.673C5.07354 21.3854 4.6146 20.9265 4.32698 20.362C4 19.7202 4 18.8802 4 17.2V6.8C4 5.11984 4 4.27976 4.32698 3.63803C4.6146 3.07354 5.07354 2.6146 5.63803 2.32698C6.27976 2 7.11984 2 8.8 2H12.0118C12.7455 2 13.1124 2 13.4577 2.08289C13.7638 2.15638 14.0564 2.27759 14.3249 2.44208C14.6276 2.6276 14.887 2.88703 15.4059 3.40589L18.5941 6.59411C19.113 7.11297 19.3724 7.3724 19.5579 7.67515C19.7224 7.94356 19.8436 8.2362 19.9171 8.5423C20 8.88757 20 9.25445 20 9.98822Z"
              stroke="#000"
              strokeOpacity="0.8"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Documentation
          </p>
        </a>
        <Link
          className="flex flex-row space-x-3 px-3 py-2 hover:bg-semantic-bg-base-bg"
          href="/logout"
        >
          <Icons.Logout01 className="h-6 w-6 stroke-semantic-fg-primary" />
          <p className="stroke-semantic-fg-primary product-body-text-2-semibold">
            Logout
          </p>
        </Link>
      </div>
    </div>
  );
};
