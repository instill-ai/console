import * as React from "react";
import { useRouter } from "next/router";
import { LoadingSpin, useUser } from "@instill-ai/toolkit";
import { ProfileSidebarLink } from "./ProfileSidebarLink";
import { useAccessToken } from "../../lib/useAccessToken";

export const ProfileSidebar = () => {
  const router = useRouter();
  const accessToken = useAccessToken();

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });

  return (
    <div className="flex w-full flex-col bg-semantic-bg-base-bg">
      <div className="mb-auto px-4">
        {user.isSuccess ? (
          <React.Fragment>
            <ProfileSidebarLink
              href={`/settings`}
              name="Profile"
              hightlighted={router.pathname === "/settings"}
              className="mb-2 px-3"
            />
            {/* <ProfileSidebarLink
              href={`/settings/account`}
              name="Account"
              hightlighted={router.pathname.split("/")[2] === "account"}
              className="mb-2 px-3"
            /> */}
            <ProfileSidebarLink
              href={`/settings/organizations`}
              name="Organisations"
              hightlighted={router.pathname.split("/")[2] === "organizations"}
              className="mb-2 px-3"
            />
            <ProfileSidebarLink
              href={`/settings/billings`}
              name="Billing"
              hightlighted={router.pathname.split("/")[2] === "billings"}
              className="mb-2 px-3"
            />
            <ProfileSidebarLink
              href={`/settings/api-tokens`}
              name="API Tokens"
              hightlighted={router.pathname.split("/")[2] === "api-tokens"}
              className="px-3"
            />
          </React.Fragment>
        ) : (
          <div className="flex h-[217px] w-full items-center justify-center">
            <LoadingSpin />
          </div>
        )}
      </div>
    </div>
  );
};
