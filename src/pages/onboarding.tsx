import OnboardingForm from "@/components/forms/OnboardingForm";
import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { GetServerSideProps } from "next";
import { FC, ReactElement } from "react";
import cookie from "cookie";
import { getUserQuery, GetUserResponse, User } from "@/lib/instill/mgmt";
import axios from "axios";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;
  let user: User | null;

  if (cookies) {
    const cookieList = cookie.parse(cookies);
    if (cookieList["instill-ai-user-onboarded"]) {
      const res = await axios.get<GetUserResponse>(
        `${process.env.NEXT_PUBLIC_MGMT_API_ENDPOINT}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`
      );
      user = {
        id: res.data.user.id,
        email: res.data.user.email,
        companyName: res.data.user.company_name,
        role: res.data.user.role,
        usageDataCollection: res.data.user.usage_data_collection,
        newsletterSubscription: res.data.user.newsletter_subscription,
        type: res.data.user.type,
        createTime: res.data.user.create_time,
        updateTime: res.data.user.update_time,
      };
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
        title="Welcome to world&lsquo;s first AI-integrated pipeline dashboard"
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
