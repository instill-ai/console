import { FC, ReactElement } from "react";

import { PageBase, PageContentContainer } from "@/components/layouts";
import PageTitle from "@/components/ui/PageTitle";
import { mockSources } from "@/services/connector/SourceServices";
import SourceTable from "@/services/connector/SourceTable";

// type DataSourcePageProps = {}

interface GetLayOutProps {
  page: ReactElement;
}

const SourcePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  return (
    <PageContentContainer>
      <PageTitle
        title="Data sources"
        breadcrumbs={["Data sources"]}
        enableButton={true}
        buttonName="Add new source"
        buttonLink="/sources/create"
        marginBottom="mb-10"
      />
      <SourceTable sources={mockSources} isLoadingSources={false} />
    </PageContentContainer>
  );
};

export default SourcePage;

SourcePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
