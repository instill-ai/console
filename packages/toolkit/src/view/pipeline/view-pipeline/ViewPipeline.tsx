"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  InstillStore,
  Nullable,
  useInstillStore,
  useNamespacePipeline,
  useRouteInfo,
  useShallow,
} from "../../../lib";
import {
  ReadOnlyPipelineBuilder,
  useSortedReleases,
} from "../../pipeline-builder";
import { Head } from "./Head";
import { InOutPut } from "./InOutPut";
import { Readme } from "./Readme";

const selector = (store: InstillStore) => ({
  accessToken: store.accessToken,
  enabledQuery: store.enabledQuery,
});

export const ViewPipeline = () => {
  const searchParams = useSearchParams();
  const shareCode = searchParams.get("view");
  const { accessToken, enabledQuery } = useInstillStore(useShallow(selector));
  const [selectedVersionId, setSelectedVersionId] =
    React.useState<Nullable<string>>(null);

  const router = useRouter();

  const routeInfo = useRouteInfo();

  const pipeline = useNamespacePipeline({
    namespacePipelineName: routeInfo.isSuccess
      ? routeInfo.data.pipelineName
      : null,
    enabled: enabledQuery && routeInfo.isSuccess,
    shareCode: shareCode ?? undefined,
    accessToken,
  });

  const releases = useSortedReleases({
    pipelineName: routeInfo.isSuccess ? routeInfo.data.pipelineName : null,
    enabledQuery: enabledQuery && routeInfo.isSuccess,
    accessToken,
  });

  React.useEffect(() => {
    if (releases.length === 0 || !releases[0]) {
      return;
    }
    setSelectedVersionId(releases[0].id);
  }, [releases]);

  React.useEffect(() => {
    if (pipeline.isError) {
      router.push("/404");
    }
  }, [pipeline.isError, router]);

  const selectedPipelineRelease = React.useMemo(() => {
    if (
      !pipeline.isSuccess ||
      !selectedVersionId ||
      pipeline.data.releases.length === 0
    ) {
      return null;
    }
    return (
      pipeline.data.releases.find(
        (release) => release.id === selectedVersionId,
      ) ?? null
    );
  }, [pipeline.isSuccess, pipeline.data, selectedVersionId]);

  return (
    <div className="flex h-full w-full flex-col">
      <Head
        setSelectedVersionId={(versionId) => {
          setSelectedVersionId(versionId);
        }}
        selectedVersionId={selectedVersionId}
      />
      <div className="flex justify-center">
        <div className="w-[1440px]">
          <div className="flex flex-1 flex-row px-8">
            <div className="w-7/12 gap-y-6 py-10 pr-10">
              <ReadOnlyPipelineBuilder
                pipelineName={pipeline.isSuccess ? pipeline.data.name : null}
                recipe={
                  selectedPipelineRelease
                    ? selectedPipelineRelease.recipe
                    : pipeline.data?.recipe ?? null
                }
                metadata={
                  selectedPipelineRelease
                    ? selectedPipelineRelease.metadata
                    : pipeline.data?.metadata ?? null
                }
                className="h-[378px] w-full"
              />
              <div className="my-4 w-full bg-semantic-bg-base-bg px-3 py-2 text-semantic-fg-primary product-body-text-1-semibold">
                Pipeline Description
              </div>
              <Readme
                isEditable={
                  pipeline.isSuccess
                    ? pipeline.data.permission.canEdit
                      ? true
                      : false
                    : false
                }
                readme={pipeline.isSuccess ? pipeline.data.readme : null}
              />
            </div>
            <div className="w-5/12 py-10">
              <InOutPut selectedVersionId={selectedVersionId} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
