import { FC, ReactElement } from "react";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import axios from "axios";

import { PageTitle } from "@/components/ui";
import OnboardingForm from "@/components/forms/OnboardingForm";
import { PageBase, PageContentContainer } from "@/components/layouts";
import { GetUserResponse, User } from "@/lib/instill/mgmt";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;
  let user: User | null;

  if (cookies) {
    const cookieList = parse(cookies);
    if (cookieList["instill-ai-user-onboarded"]) {
      const { data } = await axios.get<GetUserResponse>(
        `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`
      );
      user = data.user;
    } else {
      user = null;
    }
  } else {
    user = null;
  }

  return {
    props: {
      user,
    },
  };
};

export type OnBoardingPageProps = {
  user: User | null;
};

interface GetLayOutProps {
  page: ReactElement;
}

const OnBoardingPage: FC<OnBoardingPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ user }) => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Welcome to VDP console"
        breadcrumbs={["Onboarding"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      <OnboardingForm user={user} />
    </PageContentContainer>
  );
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
