import { PageBase, PageContentContainer } from "@/components/ui";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { FC, ReactElement, useEffect } from "react";
import { parse } from "cookie";

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

interface GetLayOutProps {
  page: ReactElement;
}

const MainPage: FC<MainPageProps> & {
  getLayout?: FC<GetLayOutProps>;
} = ({ cookies }) => {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    if (!cookies) {
      router.push("/onboarding");
      return;
    }

    const cookieList = parse(cookies);

    if (!cookieList["instill-ai-user"]) {
      router.push("/onboarding");
    } else {
      router.push("/pipelines");
    }
  }, [router, cookies]);

  return <PageContentContainer></PageContentContainer>;
};

MainPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default MainPage;
