import { PageBase, PageContentContainer } from "@/components/layouts";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, ReactElement, useEffect } from "react";
import cookie from "cookie";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie;
  return {
    props: {
      cookies,
    },
  };
};

export type MainPageProps = {
  cookies: string;
};

interface GetLayOutProps {
  page: ReactElement;
}

const MainPage: FC<MainPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ cookies }) => {
  const router = useRouter();
  const cookieList = cookie.parse(cookies);

  useEffect(() => {
    if (!router.isReady) return;

    if (!cookieList["instill-ai-user-onboarded"]) {
      router.push("/onboarding");
    } else {
      router.push("/pipelines");
    }
  }, [router]);

  return <PageContentContainer></PageContentContainer>;
};

MainPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default MainPage;
