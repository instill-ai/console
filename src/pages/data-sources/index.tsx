import { PageBase } from "@/components/layouts";
import { FC, ReactElement } from "react";

// type DataSourcePageProps = {}

interface GetLayOutProps {
  page: ReactElement;
}

const DataSourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return <div></div>;
};

export default DataSourcePage;

DataSourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
