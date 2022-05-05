import CreatePipelineForm from "@/components/forms/CreatePipelineForm";
import { PageBase } from "@/components/layouts";
import Breadcrumb from "@/components/ui/Breadcrumb";
import PageTitle from "@/components/ui/PageTitle";
import { FC, ReactElement, useMemo, useState } from "react";

interface GetLayOutProps {
  page: ReactElement;
}

const CreatePipelinePage: FC & {
  getLayout?: FC<GetLayOutProps>;
} = () => {
  const [stepNumber, setStepNumber] = useState(0);

  const currentPage = useMemo(() => {
    switch (stepNumber) {
      case 0:
        return {
          title: "Choose Pipeline Type",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 1:
        return {
          title: "Set Up data source",
          breadcrumbs: ["Pipeline", "Source setting"],
        };
      case 2:
        return {
          title: "Set Up Model",
          breadcrumbs: ["Pipeline", "Model setting"],
        };
      case 3:
        return {
          title: "Set Up Data Destination",
          breadcrumbs: ["Pipeline", "Destination setting"],
        };
      case 4:
        return {
          title: "Set Up Pipeline",
          breadcrumbs: ["Pipeline", "Pipeline setting"],
        };
    }
  }, [stepNumber]);

  return (
    <div className="flex h-full flex-col px-[138px] py-10">
      <div className="mb-[50px] flex flex-col gap-y-5">
        <Breadcrumb
          breadcrumbs={currentPage ? currentPage.breadcrumbs : ["Pipeline"]}
        />
        <PageTitle title={currentPage ? currentPage.title : ""} />
      </div>
      <CreatePipelineForm
        stepNumber={stepNumber}
        setStepNumber={setStepNumber}
        maximumStepNumber={4}
      />
    </div>
  );
};

CreatePipelinePage.getLayout = (page) => {
  return <PageBase>{page}</PageBase>;
};

export default CreatePipelinePage;
