import * as React from "react";
import { ConsoleCorePageHead } from "../../components";
import { PageBase, BreadcrumbWithLink, Topbar } from "@instill-ai/toolkit";

import { Logo } from "@instill-ai/design-system";
import { NextPageWithLayout } from "../_app";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/settings/profile`,
      permanent: false,
    },
  };
};

const SettingsPage: NextPageWithLayout = () => {
  return (
    <React.Fragment>
      <ConsoleCorePageHead title="Settings" />
      <BreadcrumbWithLink
        items={[{ label: "Home", link: "/" }, { label: "Settings" }]}
      />
    </React.Fragment>
  );
};

SettingsPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default SettingsPage;
