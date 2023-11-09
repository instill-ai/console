import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { parse } from "cookie";
import { PageBase, useUser } from "@instill-ai/toolkit";
import { NextPageWithLayout } from "./_app";
import { useAccessToken } from "../lib/useAccessToken";

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

  const user = useUser({
    enabled: accessToken.isSuccess,
    accessToken: accessToken.isSuccess ? accessToken.data : null,
    retry: false,
  });

  useEffect(() => {
    if (!router.isReady || !cookies) return;

    const cookieList = parse(cookies);

    if (user.isError) {
      router.push("/login");
      return;
    }

    if (user.isSuccess) {
      if (cookieList["instill-ai-user"]) {
        router.push(`/${user.data.id}/pipelines`);
      } else {
        router.push("/onboarding");
      }
    }
  }, [router, cookies, user.isSuccess, user.data, user.isError]);

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
