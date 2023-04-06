import { FC, ReactElement, useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { parse } from "cookie";
import { useRouter } from "next/router";

import {
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
} from "@/components";
import {
  ConfigureProfileForm,
  getUserQuery,
  type User,
  type Nullable,
} from "@instill-ai/toolkit";
import { mgmtRoleOptions } from "@/lib";

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
  const router = useRouter();
  const [user, setUser] = useState<Nullable<User>>(null);
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getUserQuery({ accessToken: null });
        setFetched(true);
        setUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    if (cookies) {
      fetchUser();
    } else {
      setFetched(true);
    }
  }, [cookies]);

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
        {fetched ? (
          <ConfigureProfileForm
            user={user}
            roles={mgmtRoleOptions}
            onConfigure={() => router.push("pipelines")}
            marginBottom={null}
            width={null}
            accessToken={null}
          />
        ) : null}
      </PageContentContainer>
    </>
  );
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
