import { PageBase } from "@/components/layouts";
import { FC, ReactElement } from "react";

// export type OnBoardingPageProps = {};

interface GetLayOutProps {
  page: ReactElement;
}

const OnBoardingPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return <div></div>;
};

OnBoardingPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default OnBoardingPage;
