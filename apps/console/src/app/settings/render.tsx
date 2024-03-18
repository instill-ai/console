"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, PageBase } from "@instill-ai/toolkit";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: `/settings/profile`,
      permanent: false,
    },
  };
};

export function SettingsViewPageRender() {
  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content contentPadding="!px-0 !py-8">{}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
}
