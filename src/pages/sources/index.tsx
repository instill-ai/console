import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import SourceTable from "@/services/connector/SourceTable";

interface GetLayOutProps {
  page: ReactElement;
}

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const sources = [];
  return (
    <PageContentContainer>
      <PageTitle
        title="Data Sources"
        breadcrumbs={["Data sources"]}
        enableButton={sources.length === 0 ? false : true}
        buttonName="Add new source"
        buttonLink="/sources/create"
        marginBottom="mb-10"
      />
      <SourceTable sources={[]} isLoadingSources={false} />
    </PageContentContainer>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
