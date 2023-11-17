import * as React from "react";
import { useRouter } from "next/router";
import { LoadingSpin, useUser } from "@instill-ai/toolkit";
import { OrganizationSidebarLink } from "./OrganizationSidebarLink";
import { useAccessToken } from "../../lib/useAccessToken";
import Link from "next/link";
import { Button, Logos } from "@instill-ai/design-system";

export const OrganizationSidebar = () => {
  const router = useRouter();
  const accessToken = useAccessToken();

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
  });

  const organisation = {
    name: "open-ai",
  };

  return (
    <div className="flex w-full flex-col bg-semantic-bg-base-bg">
      <div className="px-4 flex gap-x-3 mb-6">
        <div className="my-auto">
          <Link href={`/organization/open-ai/settings`}>
            <Button variant="secondaryGrey" size="lg" className="!p-3.5">
              <Logos.OpenAI className="h-7 w-7" />
            </Button>
          </Link>
        </div>

        <div className="my-auto">
          <Link href={`/organization/open-ai/settings`}>
            <p className="text-semantic-fg-primary product-body-text-2-semibold">
              Open AI
            </p>
          </Link>
          <p className="text-semantic-fg-disabled product-body-text-4-regular">
            Company
          </p>
        </div>
      </div>

      <div className="mb-auto px-4">
        {user.isSuccess ? (
          <React.Fragment>
            <OrganizationSidebarLink
              href={`/organization/${organisation.name}`}
              name="Profile"
              hightlighted={router.pathname.split("/")[3] === "settings"}
              className="mb-2 px-3"
            />
            <OrganizationSidebarLink
              href={`/organization/${organisation.name}/account`}
              name="Account"
              hightlighted={router.pathname.split("/")[3] === "account"}
              className="mb-2 px-3"
            />
            <OrganizationSidebarLink
              href={`/organization/${organisation.name}/organizations`}
              name="Members"
              hightlighted={router.pathname.split("/")[3] === "organizations"}
              className="mb-2 px-3"
            />
            <OrganizationSidebarLink
              href={`/organization/${organisation.name}/organizations`}
              name="Permissions"
              hightlighted={router.pathname.split("/")[3] === "organizations"}
              className="mb-2 px-3"
            />
            <OrganizationSidebarLink
              href={`/settings/${organisation.name}/billings`}
              name="Billing"
              hightlighted={router.pathname.split("/")[3] === "billings"}
              className="mb-2 px-3"
            />
            <OrganizationSidebarLink
              href={`/settings/${organisation.name}/api-tokens`}
              name="API Tokens"
              hightlighted={router.pathname.split("/")[3] === "api-tokens"}
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
