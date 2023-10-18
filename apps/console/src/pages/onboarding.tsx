import { Logo } from "@instill-ai/design-system";
import { PageBase, PageTitle, Topbar } from "@instill-ai/toolkit";

import { NextPageWithLayout } from "./_app";
import { OnboardingForm, Sidebar, ConsoleCorePageHead } from "../components";

const OnBoardingPage: NextPageWithLayout = () => {
  return (
    <>
      <ConsoleCorePageHead title="Onboarding" />
      <div className="flex flex-col">
        <PageTitle
          title="Welcome to Instill Core"
          breadcrumbs={["Onboarding"]}
          className="mb-10"
        />
        <OnboardingForm />
      </div>
    </>
  );
};

OnBoardingPage.getLayout = (page) => {
  return (
    <PageBase>
      <Topbar logo={<Logo variant="colourLogomark" width={38} />} />
      <PageBase.Container>
        <Sidebar />
        <PageBase.Content>{page}</PageBase.Content>
      </PageBase.Container>
    </PageBase>
  );
};

export default OnBoardingPage;
