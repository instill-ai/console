import { Button, Icons } from "@instill-ai/design-system";
import { shallow } from "zustand/shallow";

import {
  GeneralPageProp,
  generateRandomReadableName,
  useConnectorDefinitions,
  useUserPipelines,
} from "../../lib";
import {
  PipelineBuilderStore,
  usePipelineBuilderStore,
} from "../pipeline-builder";
import dynamic from "next/dynamic";
import { StaffPickTemplates } from "../pipeline-builder/components/template";

const PipelinesTable = dynamic(
  () => import("./PipelinesTable").then((mod) => mod.PipelinesTable),
  { ssr: false }
);

export type PipelineListPageMainViewProps = GeneralPageProp;

const selector = (state: PipelineBuilderStore) => ({
  setPipelineId: state.setPipelineId,
  setPipelineName: state.setPipelineName,
  updatePipelineIsNew: state.updatePipelineIsNew,
});

export const PipelineListPageMainView = (
  props: PipelineListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = router.query;

  const { setPipelineId, setPipelineName, updatePipelineIsNew } =
    usePipelineBuilderStore(selector, shallow);

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/
  const pipelines = useUserPipelines({
    userName: `users/${entity}`,
    enabled: enableQuery,
    accessToken,
  });

  const connectorDefinitions = useConnectorDefinitions({
    connectorResourceType: "all",
    enabled: enableQuery,
    accessToken,
  });

  /* -------------------------------------------------------------------------
   * Render
   * -----------------------------------------------------------------------*/

  return (
    <div className="flex flex-col">
      <div className="mb-14">
        <Button
          className="gap-x-2"
          variant="primary"
          size="lg"
          onClick={() => {
            const randomName = generateRandomReadableName();
            setPipelineId(randomName);
            setPipelineName(`users/${entity}/pipelines/${randomName}`);
            router.push(`/${entity}/pipelines/${randomName}`);
            updatePipelineIsNew(() => true);
          }}
        >
          <Icons.Plus className="h-4 w-4 stroke-semantic-bg-primary" />
          Add Pipeline
        </Button>
      </div>
      <StaffPickTemplates
        connectorDefinitions={
          connectorDefinitions.isSuccess ? connectorDefinitions.data : null
        }
        className="mb-6"
      />
      <PipelinesTable
        pipelines={pipelines.data ? pipelines.data : []}
        isError={pipelines.isError}
        isLoading={pipelines.isLoading || connectorDefinitions.isLoading}
        accessToken={accessToken}
        enableQuery={enableQuery}
      />
    </div>
  );
};
