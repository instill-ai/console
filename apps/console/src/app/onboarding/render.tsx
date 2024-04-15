"use client";

import { Logo } from "@instill-ai/design-system";
import { AppTopbar, PageBase, PageTitle } from "@instill-ai/toolkit";
import { OnboardingForm } from "components";
import { useAppAccessToken } from "lib/use-app-access-token";

export const OnboardingPageRender = () => {
  useAppAccessToken();
  return (
    <PageBase>
      <AppTopbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <PageBase.Content>
          <div className="flex flex-col">
            <PageTitle
              title="Welcome to Instill Core"
              breadcrumbs={["Onboarding"]}
              className="mb-10"
            />
            <OnboardingForm />
          </div>
        </PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};
