import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, ReactElement, useEffect } from "react";
import { parse } from "cookie";
import { PageBase, useUser } from "@instill-ai/toolkit";
import { NextPageWithLayout } from "./_app";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;
  return {
    props: {
      cookies: cookies ? cookies : null,
    },
  };
};

export type MainPageProps = {
  cookies: string;
};

const MainPage: NextPageWithLayout<MainPageProps> = ({ cookies }) => {
  const router = useRouter();

  const user = useUser({
    enabled: true,
    accessToken: null,
  });

  useEffect(() => {
    console.log(cookies);
    if (!router.isReady) return;

    if (!cookies) {
      router.push("/onboarding");
      return;
    }

    const cookieList = parse(cookies);

    console.log(user.data);

    if (!cookieList["instill-ai-user"]) {
      router.push("/onboarding");
    } else {
      if (user.isSuccess) {
        router.push(`/${user.data.id}/pipelines`);
      }
    }
  }, [router, cookies, user.isSuccess, user.data]);

  return <></>;
};

MainPage.getLayout = (page) => {
  return (
    <PageBase.Container>
      <PageBase.Content>{page}</PageBase.Content>
    </PageBase.Container>
  );
};

export default MainPage;
