import OnboardingForm from "@/components/forms/OnboardingForm";
import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { FC, ReactElement } from "react";

// export type OnBoardingPageProps = {};

interface GetLayOutProps {
  page: ReactElement;
}

const OnBoardingPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Welcome to world&lsquo;s first AI-integrated pipeline dashboard"
        breadcrumbs={["Onboarding"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <OnboardingForm />
    </PageContentContainer>
  );
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
