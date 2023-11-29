import React from "react";
import {
  ConsoleCorePageHead,
  OrganizationSidebar,
  Topbar,
} from "../../../components";
import { NextPageWithLayout } from "../../_app";
import { useAccessToken } from "../../../lib/useAccessToken";
import { useTrackToken } from "../../../lib/useTrackToken";

import {
  PageBase,
  PermissionTable,
  BreadcrumbWithLink,
} from "@instill-ai/toolkit";
import { Button, Logo, Separator } from "@instill-ai/design-system";

const PermissionsPage: NextPageWithLayout = () => {
  const accessToken = useAccessToken();
  useTrackToken({ enabled: true });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Open AI" />
      <BreadcrumbWithLink
        items={[
          { label: "Home", link: "/" },
          { label: "Organisations", link: "/settings/organizations" },
          { label: "Settings" },
        ]}
      />
      <div className="w-full flex mt-16 gap-x-14">
        <div className="w-1/6">
          <OrganizationSidebar />
        </div>
        <div className="w-5/6">
          <div className="w-full">
            <p className="product-body-text-1-semibold">Permission Groups</p>
            <Separator className="my-6" />
          </div>
          <div className="w-full">
            <PermissionTable
              permissions={[]}
              isError={false}
              isLoading={false}
              accessToken={null}
              enableQuery={true}
            />
          </div>
          <div className="flex justify-end my-3">
            <Button variant="primary" size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

PermissionsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="px-28 py-10">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default PermissionsPage;
