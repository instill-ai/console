import { FC, ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import axios from "axios";

import { PageTitle, PageBase, PageContentContainer } from "@/components/ui";
import { GetUserResponse, User } from "@/lib/instill/mgmt";
import { OnboardingForm } from "@/components/onboarding";
import { Nullable } from "@/types/general";

export const getServerSideProps: GetServerSideProps<
  OnBoardingPageProps
> = async (context) => {
  if (context.req.headers.cookie) {
    const cookies = parse(context.req.headers.cookie);
    return {
      props: {
        cookies,
      },
    };
  } else {
    return {
      props: {
        cookies: null,
      },
    };
  }
};

export type OnBoardingPageProps = {
  cookies: Nullable<Record<string, string>>;
};

type GetLayOutProps = {
  page: ReactElement;
};

const OnBoardingPage: FC<OnBoardingPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ cookies }) => {
  const [user, setUser] = useState<Nullable<User>>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get<GetUserResponse>(
          `${process.env.NEXT_PUBLIC_MGMT_BACKEND_BASE_URL}/${process.env.NEXT_PUBLIC_API_VERSION}/users/local-user`
        );
        setFetched(true);
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      }
    };

    if (cookies) {
      fetchUser();
    } else {
      setFetched(true);
    }
  }, []);

  return (
    <PageContentContainer>
      <PageTitle
        title="Welcome to VDP console"
        breadcrumbs={["Onboarding"]}
        enableButton={false}
        marginBottom="mb-10"
      />
      {fetched ? <OnboardingForm user={user} /> : null}
    </PageContentContainer>
  );
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
