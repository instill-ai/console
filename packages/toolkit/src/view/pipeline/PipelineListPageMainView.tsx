import { Button, Icons } from "@instill-ai/design-system";
import { useShallow } from "zustand/react/shallow";
import dynamic from "next/dynamic";

import {
  GeneralPageProp,
  InstillStore,
  generateRandomReadableName,
  useConnectorDefinitions,
  useInstillStore,
  useUser,
  useUserPipelines,
} from "../../lib";
import { StaffPickTemplates } from "../pipeline-builder/components/template";

const PipelinesTable = dynamic(
  () => import("./PipelinesTable").then((mod) => mod.PipelinesTable),
  { ssr: false }
);

export type PipelineListPageMainViewProps = GeneralPageProp;

const selector = (store: InstillStore) => ({
  setPipelineId: store.setPipelineId,
  setPipelineName: store.setPipelineName,
  updatePipelineIsNew: store.updatePipelineIsNew,
});

export const PipelineListPageMainView = (
  props: PipelineListPageMainViewProps
) => {
  const { router, enableQuery, accessToken } = props;
  const { entity } = router.query;

  const { setPipelineId, setPipelineName, updatePipelineIsNew } =
    useInstillStore(useShallow(selector));

  /* -------------------------------------------------------------------------
   * Query resource data
   * -----------------------------------------------------------------------*/

  const user = useUser({
    enabled: enableQuery,
    accessToken,
    retry: false,
  });

  const pipelines = useUserPipelines({
    userName: user.data?.name ?? null,
    enabled: enableQuery && user.isSuccess,
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
      <div className="mb-8">
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
