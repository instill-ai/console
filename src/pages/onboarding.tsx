import { FC, ReactElement } from "react";

import {
  PageTitle,
  PageHead,
  OnboardingForm,
  Topbar,
  Sidebar,
  PageBase,
} from "@/components";
import { Logo } from "@instill-ai/design-system";

type GetLayOutProps = {
  page: ReactElement;
};

const OnBoardingPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <>
      <PageHead title="Onboarding" />
      <div className="flex flex-col">
        <PageTitle
          title="Welcome to VDP console"
          breadcrumbs={["Onboarding"]}
          disabledButton={true}
          marginBottom="mb-10"
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
