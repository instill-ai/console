import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { parse } from "cookie";
import { PageBase, useAuthenticatedUser } from "@instill-ai/toolkit";
import { NextPageWithLayout } from "./_app";
import { useAccessToken } from "../lib/use-access-token/client";

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
  const accessToken = useAccessToken();

  const me = useAuthenticatedUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    retry: false,
  });

  useEffect(() => {
    if (!router.isReady || !cookies) return;

    if (me.isError) {
      router.push("/login");
      return;
    }

    if (me.isSuccess) {
      const cookieList = parse(cookies);
      if (cookieList["instill-ai-user"]) {
        router.push(`/${me.data.id}/pipelines`);
      } else {
        router.push("/onboarding");
      }
    }
  }, [router, cookies, me.isSuccess, me.data, me.isError]);

  return <div />;
};

MainPage.getLayout = (page) => {
  return (
    <PageBase.Container>
      <PageBase.Content>{page}</PageBase.Content>
    </PageBase.Container>
  );
};

export default MainPage;
