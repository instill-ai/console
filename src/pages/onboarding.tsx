import { FC, ReactElement } from "react";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  OnboardingForm,
} from "@/components";

type GetLayOutProps = {
  page: ReactElement;
};

const OnBoardingPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <>
      <PageHead title="Onboarding" />
      <PageContentContainer>
        <PageTitle
          title="Welcome to VDP console"
          breadcrumbs={["Onboarding"]}
          enableButton={false}
          marginBottom="mb-10"
        />
        <OnboardingForm />
      </PageContentContainer>
    </>
  );
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
