import { FC, ReactElement, useState } from "react";
import { useRouter } from "next/router";

import {
  ModelsTable,
  PageTitle,
  PageBase,
  PageContentContainer,
  PageHead,
  TableLoadingProgress,
} from "@/components/ui/";
import { useModelsWithInstances } from "@/services/model";
import { useAmplitudeCtx } from "@/contexts/AmplitudeContext";
import { useSendAmplitudeData, useStateOverviewCounts } from "@/hooks";
import { Nullable } from "@/types/general";
import { useResourcePages } from "@/hooks/useResourcePages";
import { PaginationListContainer } from "@/components/ui/PaginationListContainer";

interface GetLayOutProps {
  page: ReactElement;
}

const ModelPage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const router = useRouter();
  const modelsWithInstances = useModelsWithInstances();
  const [currentPage, setCurrentPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState<Nullable<string>>(null);

  const modelPages = useResourcePages({
    resources: modelsWithInstances.data || null,
    searchTerm,
    pageSize: 2,
  });

  const stateOverviewCounts = useStateOverviewCounts(
    modelsWithInstances.isSuccess ? modelsWithInstances.data : []
  );

  const { amplitudeIsInit } = useAmplitudeCtx();

  useSendAmplitudeData(
    "hit_models_page",
    { type: "navigation" },
    router.isReady,
    amplitudeIsInit
  );

  return (
    <>
      <PageHead title="models" />
      <PageContentContainer>
        <PageTitle
          title="Model"
          breadcrumbs={["Model"]}
          enableButton={
            modelsWithInstances.isSuccess
              ? modelsWithInstances.data.length === 0
                ? false
                : true
              : false
          }
          buttonName="Add new model"
          buttonLink="/models/create"
          marginBottom="mb-10"
        />
        <PaginationListContainer
          title="Model"
          description="These are the models you can select"
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          totalPage={modelPages.length}
        >
          {modelsWithInstances.isSuccess ? (
            <ModelsTable
              modelPages={modelPages}
              marginBottom={null}
              currentPage={currentPage}
              stateOverviewCounts={stateOverviewCounts}
            />
          ) : (
            <TableLoadingProgress marginBottom={null} />
          )}
        </PaginationListContainer>
      </PageContentContainer>
    </>
  );
};

export default ModelPage;

ModelPage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};
